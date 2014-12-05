'use strict';
Ext.override(Ext.data.proxy.Ajax, { timeout:300000 });
Ext.override(Ext.data.Connection, { timeout:300000});

Ext.Loader.setPath('Ext.ux', 'ux', '.');

Ext.Loader.setConfig({
	enabled : true
});

Ext.require(['Ext.data.*', 'Ext.grid.*', 'Ext.ux.data.PagingMemoryProxy', 'Ext.data.proxy.Memory',
		'Ext.ux.grid.FiltersFeature', 'Ext.ux.grid.FiltersFeatureMongo']);

Ext.define('LogViewer.model.accordion', {
    extend: 'Ext.data.Model',
    fields : [{
        name : 'value',
        convert : function(value, record) {
            return '/mongo/db/' + record.raw;
        }
    }, {
        name : 'title',
        convert : function(value, record) {
            return record.raw;
        }
    }],
    idProperty : 'title'
});

var accordion = Ext.create('Ext.Panel', {
    title: 'DB/Collections',
    collapsible: true,
    region:'west',
    margins:'3 0 3 3',
    split:true,
    width: 210,
    layout:'accordion',
    loadAccordionElements: function(panel, preStore){

        preStore.data.each(function(store) {
            
            panel.add({
                title       : "<b>" + store.data.title + "</b>",
                listeners: {
                    added: function(panelObj) {
                        
                        Ext.Ajax.request({
                            url: store.data.value,
                            success: function(response){
                                
                                var list = Ext.JSON.decode(response.responseText);
                                for (var i=0; i<list.length; i++){
                                    
                                    panelObj.add({
                                        xtype: 'button',
                                        collectionDb: list[i],
                                        text: "<div style='text-align:left;'>"+list[i]+"<div>",
                                        cls: 'btn-align',
                                        iconCls:'x-btn-text-iconBig',
                                        icon: 'resources/images/find.png',
                                        handler: function (button, event) {
                                            
                                            LogViewer.controller.Entries.prototype.setDbCollection(button.collectionDb);
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        });
    },
    listeners: {
        afterrender: function(panel) {

            var preStore = Ext.create('Ext.data.Store', {
                storeId: 'addStore',
                model: 'LogViewer.model.accordion',
                autoLoad: 'true',
                proxy: {
                    type: 'ajax',
                    url: '/mongo/db/onlyDbList'
                }
            });
            preStore.on('load', function () {
                
                panel.loadAccordionElements(panel, preStore);
            });
        }
    }
});

Ext.application({
    appFolder : 'app',
    controllers : ['Entries'],
    launch : function() {
        Ext.create('Ext.container.Viewport', {
            items : [
                {
                    region: 'north',
                    title: '<big><h1 class="x-panel-header" align="right"><b>AMID GUI</b></h1></big>',
                    border: false,
                },
                accordion,
                {
                    region:'center',
                    margins:'3 0 3 0',
                    xtype : 'entrylist'
                }/*,
                {
                    title: 'Query Panel',
                    collapsible: true,
                    collapsed: true,
                    height: 200,
                    bbar : [{
                        text : 'Exec',
                        handler: function(){
                            //http://localhost/mongo/application/essential/
                            //query=%7B%22code%22%3A5030%7D
                            //&sort=%7B%22time%22%3A%20-1%7D
                            //&fields=message&fields=class&fields=code&fields=timeLog&fields=result&fields=TIME&fields=user&fields=market&fields=machine&fields=thread
                            //&timeout=60000&skip=0&limit=100
                            var text = Ext.getCmp('queryPanel').getValue();
                            var replaced = text.replace(/(\r\n|\n|\r)/gm,"");
                            try {
                                var isJSON = JSON.parse(replaced);
                            } catch (e) {
                                
                                alert(e)
                            }
                        }
                    }],
                    split:true,
                    region:'south',
                    items:[
                        {
                            xtype: 'textarea',
                            id : 'queryPanel',
                            editable: true,
                            height: 200,
                            width: '100%'
                        }
                    ]
                }*/
            ],
            layout : 'border'
        });
    },
    name : 'LogViewer'
});
