'use strict';

Ext.define('LogViewer.store.DbValues', {
	alias : 'store.dbvalues',
	autoLoad : false,
	extend : 'Ext.data.Store',
	model : 'LogViewer.model.DbValue',
	proxy : {
		reader : {
			type : 'array'
		},
		type : 'ajax',
		url : ''
	},
	sorters : [{
		sorterFn : function(o1, o2) {
			return o1.get('text') < o2.get('text') ? -1 : 1;
		}
	}],
	sortOnLoad : true
});
