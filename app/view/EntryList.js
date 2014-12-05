'use strict';

Ext.define('LogViewer.view.EntryList', {
	alias : 'widget.entrylist',
	autoheight : true,
	columns : [],
	dockedItems : [{
		docked : 'top',
		items : [
		{
            text : 'Logout',
            itemId : 'logout',
            xtype : 'button'
        },
		{
			text : 'Show Filters',
			itemId : 'showFilters'
		}, {
			text : 'Reset Filters',
			itemId : 'resetFilters'
		}, '->', {
			text : 'Refresh',
			iconCls : 'x-tbar-loading',
			itemId : 'refreshButton',
			xtype : 'button'
		}, {
			text : 'Export',
			itemId : 'exportButton',
			xtype : 'button'
		}, '->', {
            editable : false,
            emptyText : 'Please select',
            fieldLabel : 'Sort By',
            itemId : 'sortSelector',
            labelAlign : 'right',
            minListWidth : 200,
            store : Ext.create('Ext.data.JsonStore', {
                fields : [{name: 'name'}],
                autoLoad: false
            }),
            queryMode : 'local',
            tooltip : 'Select source',
            displayField:'name',
            valueField : 'name',
            width : 200,
            xtype : 'combo'
        }, {
            editable : false,
            itemId : 'orderSelector',
            labelAlign : 'right',
            minListWidth : 50,
            queryMode : 'local',
            store: Ext.create('Ext.data.ArrayStore', {
                fields: ['name', 'value'],
                data: [
                    ['ASC',1],
                    ['DESC',-1]
                ]
            }),
            displayField:'name',
            valueField : 'value',
            width : 50,
            xtype : 'combo'
        }, 
/*        {
			editable : false,
			emptyText : 'Please select',
			fieldLabel : 'DB/Collection',
			itemId : 'dbClSelector',
			labelAlign : 'right',
			minListWidth : 400,
			queryMode : 'local',
			store : 'DbCollections',
			tooltip : 'Select source',
			valueField : 'value',
			width : 400,
			xtype : 'combo',
            hidden: true
		}
*/      
        {
            itemId : 'dbClSelector',
            id: 'hidCollId',
            value : '',
            xtype : 'hiddenfield'
        }
        ],
		xtype : 'toolbar'
	}, {
		displayInfo : true,
		dock : 'bottom',
		items : [],
		store : 'Entries',
		listeners : {
			render : function() {
				this.down('#refresh').hide();
			}
		},
		xtype : 'pagingtoolbar'
	}],
	extend : 'Ext.grid.Panel',
	features : [{
		autoReload : false,
		ftype : 'filtersMongo',
		encode : true,
		local : false, // remote filtering
		paramPrefix : 'query'
	}],
	loadMask : true,
	sortableColumns : true,
	store : 'Entries',
	viewConfig : {
		enableTextSelection : true
	}
});
