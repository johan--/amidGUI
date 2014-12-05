'use strict';

Ext.define('LogViewer.view.DetailsWindow', {
	autoScroll: true,
	maximizable: true,
	extend: 'Ext.Window',
	height: '500px',
	layout: 'fit',
	closeAction: 'destroy',
	modal: false,
	resizable: true,
	title: 'Log Details',
	width: Ext.get(document.body).getWidth()-40
});
