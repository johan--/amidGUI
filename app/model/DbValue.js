'use strict';

Ext.define('LogViewer.model.DbValue', {
	extend : 'Ext.data.Model',
	fields : [{
		name : 'key',
		convert : function(value, record) {
			return record.raw;
		}
	}, {
		name : 'text',
		convert : function(value, record) {
			return Ext.String.ellipsis(record.raw.toString(), 40);
		}
	}],
	idProperty : 'key'
});