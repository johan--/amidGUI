'use strict';

Ext.define('LogViewer.controller.Entries', {

    clearFilters : function() {
        while (this.getMyGrid().filters.getFilterData().length > 0) {
            this.getMyGrid().filters.clearFilters();
        }
    },

    extend : 'Ext.app.Controller',

    init : function() {

        this.getEntriesStore().addListener('load', this.onEntriesStoreLoad, this);
        this.getDbCollectionsStore().addListener('load', this.onDbCollectionsStoreLoad, this);
        this.control({
        'viewport > panel' : {
            itemdblclick : this.onItemDblClick,
            render : this.onPanelRendered,
            filterupdate : this.onFilterUpdate,
        },
        'viewport > panel > toolbar > #dbClSelector' : {
            change : this.onDbClSelector
        },
        'viewport > panel > toolbar > #refreshButton' : {
            click : this.onRefreshButton
        },
        'viewport > panel > toolbar > #exportButton' : {
            click : this.onExportButton
        },
        'viewport > panel > toolbar > #showFilters' : {
            click : this.onShowFilters
        },
        'viewport > panel > toolbar > #resetFilters' : {
            click : this.onResetFilters
        },
        'viewport > panel > toolbar > #logout' : {
                click : this.onLogout
        }
       });

        this.showLoginWindow(this.getDbCollectionsStore());

    },

    loadCollection : function() {
        var url = Ext.getCmp('hidCollId').getValue();
        if (!url) {
            return;
        }

        var keyParams = new Object();//filters.buildQuery(filters.getFilterData());
        keyParams['operation'] = 'key';
        // autoconfiguration call
        // using the first document of the collection        
        Ext.Ajax.request({
            failure : function(response, callOptions) {
                Ext.Msg.alert('Error', 'Cannot load from: ' + url);
            },
            loadMask : true,
            method : 'GET',
            params : keyParams,
            scope : this,
            success : function(response, callOptions) {

                var objects = Ext.decode(response.responseText);
                // use first object to set new fields
                var fields = [];
                if (objects.length) {
                    var sortArr =  new Array();
                    fields = objects;
                    for (var i in objects) {
                        sortArr.push({name: objects[i]})
                    }
                    this.getModel('Entry').setFields(fields);
                    this.getSortSelector().getStore().removeAll();
                    this.getSortSelector().getStore().add(sortArr);
                    var check = this.getSortSelector().getStore().find('name', this.getSortSelector().getValue(), 0, false, true);
                    if (check < 0) {
                        this.getSortSelector().setValue('time');
                        this.getOrderSelector().setValue(-1);
                    }
                } else {
                    Ext.Msg.alert('Info', 'No records found in: ' + url);
                }
                // get totalCount for paging

                var countUrl = url;
                var filters = this.getMyGrid().filters;
                var countParams = new Object();//filters.buildQuery(filters.getFilterData());
                countParams['operation'] = 'count';
                countParams['timeout'] = 60000;

                Ext.Ajax.request({
                    failure : function(response, callOptions) {
                        Ext.Msg.alert('Error', 'Cannot load from: ' + countUrl);
                    },
                    method : 'GET',
                    params : countParams,
                    url : countUrl,
                    scope : this,
                    success : function(response, callOptions) {
                        this.totalCount = Ext.decode(response.responseText);
                        var selection = fields;
                        var sortField = this.getSortSelector().getValue();
                        var sortOrder = this.getOrderSelector().getValue();
                        // load first page of results
                        var store = this.getEntriesStore();
                        store.proxy.url = url;

                        // custom query parameters
                        store.proxy.startParam = 'skip';
                        store.proxy.pageParam = undefined;
                        store.proxy.extraParams = {
                            sort:"{\"" + sortField + "\": " + sortOrder + "}",
                            fields: selection,
                            timeout:60000
                        }
                        store.addListener('datachanged', this.onEntriesStoreDataChanged, this);

                        store.loadPage(1);
                        
                        this.managePagingButton(filters);
                    }
                });
            },
            url : url
        });
    },

    maxDistinctValues : 100,

    models : ['Entry'],

    onDbClSelector : function() {
        this.clearFilters();
        this.loadCollection();
    },

    onDbCollectionsStoreLoad : function(store, records, successful, eOpts) {
        if (successful === false) {
            Ext.Msg.alert('Error', 'Cannot get list of db/collections');
        }
    },

    onEntriesStoreLoad : function(store, records, successful, eOpts) {
        if (store.count()) {
            this.getMyGrid().reconfigure(store, this.recordToColumns(store.getAt(0).data));
        }
        this.getRefreshButton().setText('Refresh');
    },
    onLogout: function() {

        Ext.util.Cookies.clear('username');
        Ext.util.Cookies.clear('password');
        document.location = '/';
    },
    onEntriesStoreDataChanged : function(store, eOpts) {
        this.getEntriesStore().totalCount = this.totalCount;
    },

    onFilterUpdate : function() {
        this.getRefreshButton().setText('Refresh *');
    },
    showHideButtons: function (docked, hide) {
        
        Ext.Array.each(docked.items.items, function(name, index, obj) {
            
            if (obj[index].itemId) {
                
                switch (obj[index].itemId) {
                    case 'displayItem':
                    case 'afterTextItem':
                    case 'last': {
                        obj[index].setVisible(!hide);
                    }
                    break;
                    case 'inputItem':{
                        
                        obj[index].readOnly = hide;
                    }
                }
            }
        });
    },
    managePagingButton: function (filters) {

        var docked = this.getMyGrid().getDockedItems('toolbar[dock="bottom"]')[0];
        if (filters.getFilterData().length > 0) {
            
            this.showHideButtons(docked, true);
        } else {
            this.showHideButtons(docked, false);
        }
    },
    showLoginWindow: function (dbCollectionsStore) {

        var cookie = Ext.util.Cookies.get('username');
        if(cookie!=null){

            dbCollectionsStore.load({
                params: {
                    username: Ext.util.Cookies.get('username'),
                    password: Ext.util.Cookies.get('password')
                },
                callback: function(records, operation, success) {

                    if (!success) {

                        Ext.Msg.alert('Status', 'Network error');
                    }
                    if (!records.length) {

                        Ext.Msg.alert('Status', 'Wrong user/password');
                    }
                }
            });

        } else {
/*            var loginWindow = Ext.create('LogViewer.view.LoginWindow',{
                dbCollectionsStore: dbCollectionsStore
            }).show();*/
        }
    },
    onItemDblClick : function(grid, record, item, index) {

        Ext.Ajax.request({
            url: Ext.getCmp('hidCollId').getValue() + record.internalId,
            method: 'GET',
            success: function (response) {

                var data = [];
                var obj = JSON.parse(response.responseText);

                for ( var key in obj) {
                    if (key != '_id') data.push([key, obj[key]]);
                }

                var store = Ext.create('LogViewer.store.Details', {
                    data : data
                });

                var details = Ext.create('LogViewer.view.DetailsGrid', {
                    store : store,
                    internalId: record.internalId
                });

                var grid = Ext.create('LogViewer.view.DetailsWindow', {
                    items : [details]
                }).show();
            },
            failure: function (response) {
                var obj = JSON.parse(response.responseText);
                alert(response.responseText)
            }
        });
    },
    onPanelRendered : function() {
    },

    onResetFilters : function() {
        this.clearFilters();
    },

    onShowFilters : function() {
        var data = this.getMyGrid().filters.getFilterData();
        this.getFiltersStore().loadData(data);
        Ext.create('LogViewer.view.FiltersWindow').show();
    },
    onExportButton : function() {
        var url = Ext.getCmp('hidCollId').getValue();
        var filters = this.getMyGrid().filters;
        var countParams = filters.buildQuery(filters.getFilterData());
        if (!url) {
            alert('Inserire dei filtri, grazie.')
            return;
        }
        if (typeof countParams.query == 'undefined') {
            countParams.query = '';
        }
        document.location = url + '?operation=csv&query=' + countParams.query + '&sort={"time":-1}&limit=30000';

    },

    onRefreshButton : function() {
        this.loadCollection();
    },
    onEditRecord: function (editor, e) {

        Ext.Ajax.request({
            url: Ext.getCmp('hidCollId').getValue() + e.grid.internalId,
            method: 'PUT',
            jsonData : '{"$set": {"' + e.record.data.key + '":"' + e.record.data.value + '"}}'
        });
        e.record.commit();
        this.getEntriesStore().reload();
    },
    recordToColumns : function(obj) {
        var columns = [];
        for ( var key in obj) {
            var filterType = 'mongoString';

            if (typeof (obj[key]) === 'number') {
                filterType = 'mongoNumeric';
            }
            var regex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
            if (regex.test(obj[key])) {
                filterType = 'mongoTime';
            }
            if (typeof (obj[key]) === 'boolean') {
                filterType = 'boolean';
            }

            var store = Ext.create('LogViewer.store.DbValues', {
                maxDistinctValues : this.maxDistinctValues,
                listeners : {
                    load : function(store, records, successful) {
                        if(successful) {
                            if (store.count() > store.maxDistinctValues) {
                                Ext.Msg.alert('Error', 'Cannot load more than ' + store.maxDistinctValues + ' distinct values');
                                store.removeAll();
                            }
                        } else {
                            Ext.Msg.alert('Error', 'Cannot load distinct values for field: ' + store.proxy.extraParams.fields);
                        }
                    }
                }
            });
            store.proxy.url = Ext.getCmp('hidCollId').getValue();
            store.proxy.extraParams = {
                operation : 'distinct',
                timeout: 60000,
                fields : key
            };

            var conf = {
                header : key.toUpperCase(),
                dataIndex : key,
                filter : {
                    type : filterType,
                    store : store
                },
                renderer : 'htmlEncode'
            };

            if (filterType === 'mongoTime') {
                conf.width = 120;
                conf.renderer = function(value) {
	            if (value) return value.slice(0, 19);
		    else return value;
                };
            } else {
                conf.flex = 1;
            }
            columns.push(conf);
        }
        return columns;
    },
    setDbCollection: function (string) {

        Ext.getCmp('hidCollId').setValue('/mongo/' + string + '/');
    },
    recordToFields : function(obj) {
        var fields = [];
        for ( var key in obj) {
            // skip mongo _id
            if (key == '_id' ) {
                continue;
            }

            if (obj[key] != null && (obj[key].length > 1024*100 || key.toLowerCase() == 'response')) {
                continue;
            }

            var type = 'string';
            if (typeof (obj[key]) === 'number') {
                type = 'int';
            }
            if (typeof (obj[key]) === 'boolean') {
                type = 'boolean';
            }
            fields.push({
                name : key,
                type : type
            });
        }
        return fields;
    },

    refs : [
    {
        ref : 'orderSelector',
        selector : 'viewport > panel > toolbar > #orderSelector'
    }, {
        ref : 'sortSelector',
        selector : 'viewport > panel > toolbar > #sortSelector'
    }, {
        ref : 'myGrid',
        selector : 'grid'
    }, {
        ref : 'dbselect',
        selector : 'viewport > panel > toolbar > #dbClSelector'
    }, {
        ref : 'refreshButton',
        selector : 'viewport > panel > toolbar > #refreshButton'
    }],

    requires : ['LogViewer.store.DbValues'],

    stores : ['Entries', 'DbCollections', 'Filters'],
    views : ['EntryList', 'DetailsWindow', 'FiltersGrid']
});
