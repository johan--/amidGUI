'use strict';

Ext.define('LogViewer.store.Entries', {
	extend : 'Ext.data.Store',
	model : 'LogViewer.model.Entry',
	pageSize : 100,
	proxy : {
		type : 'ajax',
		reader : {
			idProperty : '_id',
			type : 'json'
		}
	}
});
