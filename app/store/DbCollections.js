'use strict';

Ext.define('LogViewer.store.DbCollections', {
	alias : 'store.dbcollections',
	autoLoad : true,
	extend : 'Ext.data.Store',
	model : 'LogViewer.model.DbCollection',
	proxy : {
		type : 'ajax',
		reader : {
			type : 'array'
		},
		url : '/mongo/db/'
	// url : 'dbcoll.json'
	},
	sorters : [{
		sorterFn : function(o1, o2) {
			return o1.get('text') < o2.get('text') ? -1 : 1;
		}
	}],
	sortOnLoad : true
});
