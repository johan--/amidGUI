'use strict';

Ext.define('LogViewer.view.FiltersGrid', {
	alias : 'widget.filtersgrid',
	columns : [{
		dataIndex : 'field',
		flex : 1,
		text : 'FIELD'
	}, {
		dataIndex : 'comparison',
		flex : 1,
		text : 'OPERATOR',
		renderer : function(value, metadata, record) {
			metadata.tdCls = 'no-repeat ux-mongorangemenu-'+value;
		}
	}, {
		dataIndex : 'value',
		flex : 3,
		text : 'VALUE'
	}, {
		dataIndex : 'type',
		flex : 1,
		text : 'TYPE'
	}],
	extend : 'Ext.grid.Panel',
	emptyText : 'No active filters found!',
	store : 'Filters',
	viewConfig : {
		enableTextSelection : true,
		deferEmptyText : false
	}
});
