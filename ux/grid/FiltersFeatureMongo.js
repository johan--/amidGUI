Ext.define('Ext.ux.grid.FiltersFeatureMongo', {
	alias : 'feature.filtersMongo',
	/**
	 * Method overwritten to adapt the format of the filter query to that of
	 * mongo rest service
	 * 
	 * {filters:[{"field":"someDataIndex","comparison":"someValue1","type":"someValue2","value":"someValue3"}]}
	 * {query:{"numeric_field" : numeric_value, "string_field": "string_value",
	 * "date_field": {"$gte": "gt_value", "$lt": "lt_value"}}
	 * 
	 * @param {Array}
	 *            filters A collection of objects representing active filters
	 *            and their configuration. Each element will take the form of
	 *            {field: dataIndex, data: filterConf}. dataIndex is not assured
	 *            to be unique as any one filter may be a composite of more
	 *            basic filters for the same dataIndex.
	 * 
	 * @return {Object} Query keys and values
	 */
	buildQuery : function(filters) {
		var p = {}, i, f, o, root, dataPrefix, key, tmp, len = filters.length;

		tmp = {};
		for (i = 0; i < len; i++) {
			f = filters[i];
			switch (f.data.comparison) {

			case 'eq':
				tmp[f.field] = f.data.value;
				break;

			case 'gt':
			case 'lt':
			case 'gte':
			case 'lte':
			case 'ne':
				o = {};
				o['$' + f.data.comparison] = f.data.value;
				tmp[f.field] = Ext.apply({}, o, tmp[f.field]);
				break;

			case 'regex':
				o = {};
				o['$regex'] = f.data.value;
				o['$options'] = 'i';
				tmp[f.field] = Ext.apply({}, o, tmp[f.field]);
				break;

			case 'list':
				o = {};
				o['$in'] = f.data.value;
				tmp[f.field] = Ext.apply({}, o, tmp[f.field]);
				break;

			default:
				Ext.Msg.alert('Error', 'Unknown filter type: ' + f.data.comparison);
				break;
			}

		}
		// only build if there is active filter
		if (Object.getOwnPropertyNames(tmp).length > 0) {
			p[this.paramPrefix] = Ext.JSON.encode(tmp);
		}
		return p;
	},
	extend : 'Ext.ux.grid.FiltersFeature',
	uses : ['Ext.ux.grid.menu.ListMenu', 'Ext.ux.grid.filter.BooleanFilter', 'Ext.ux.grid.filter.DateFilter', 'Ext.ux.grid.filter.ListFilter', 'Ext.ux.grid.filter.StringFilter',
			'Ext.ux.grid.menu.MongoNumericRangeMenu', 'Ext.ux.grid.filter.MongoNumericFilter', 'Ext.ux.grid.menu.MongoStringRangeMenu', 'Ext.ux.grid.filter.MongoStringFilter',
			'Ext.ux.grid.menu.MongoTimeRangeMenu', 'Ext.ux.grid.filter.MongoTimeFilter']
});
