'use strict';

Ext.define('LogViewer.model.Filter', {
	extend : 'Ext.data.Model',
	fields : [{
		name : 'id',
		convert : function(value, record) {
			return record.raw.field + '-' + record.raw.data.type + '-' + record.raw.data.comparison;
		}
	}, {
		name : 'field'
	}, {
		name : 'type',
		convert : function(value, record) {
			return record.raw.data.type;
		}
	}, {
		name : 'comparison',
		convert : function(value, record) {
			var filterNames = {
				gte : '>=',
				gt : '>',
				lte : '<=',
				lt : '<',
				ne : '<>',
				eq : '=',
				regex : 'regex'
			};
			return record.raw.data.comparison;
		}
	}, {
		name : 'value',
		convert : function(value, record) {
			return record.raw.data.value;
		}
	}],
	idProperty : 'id'
});