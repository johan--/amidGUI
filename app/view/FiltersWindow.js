'use strict';

Ext.define('LogViewer.view.FiltersWindow', {
	autorender : true,
	autoScroll : true,
	draggable : false,
	extend : 'Ext.Window',
	items : [{
		xtype : 'filtersgrid'
	}],
	maximized : false,
	modal : true,
	resizable : false,
	title : 'Filters',
	width : '60%',
	y : 100
});
