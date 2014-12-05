'use strict';

Ext.define('LogViewer.model.DbCollection', {
	extend : 'Ext.data.Model',
	fields : [{
		name : 'value',
		convert : function(value, record) {
			return '/mongo/' + record.raw + '/';
		}
	}, {
		name : 'text',
		convert : function(value, record) {
			return record.raw;
		}
	}],
	idProperty : 'value'
});