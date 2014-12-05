/**
 * @class Ext.ux.grid.menu.MongoTimeRangeMenu
 * @extends Ext.menu.Menu Custom implementation of {@link Ext.menu.Menu} that
 *          has preconfigured items for entering string range comparison values:
 *          less-than, less-or-equal-than, greater-than, greater-or-equal-than,
 *          and equal-to. This is used internally by
 *          {@link Ext.ux.grid.filter.MongoTimeFilter} to create its menu.
 */
Ext.define('Ext.ux.grid.menu.MongoTimeRangeMenu', {
	extend : 'Ext.menu.Menu',

	/**
	 * @cfg {String} fieldCls The Class to use to construct each field item
	 *      within this menu Defaults to:
	 * 
	 * <pre>
	 * fieldCls: Ext.form.field.Text
	 * </pre>
	 */
	fieldCls : 'Ext.form.field.Text',

	/**
	 * @cfg {Object} fieldCfg The default configuration options for any field
	 *      item unless superseded by the <code>{@link #fields}</code>
	 *      configuration. Defaults to:
	 * 
	 * <pre>
	 * fieldCfg: {
	 * }
	 * </pre>
	 * 
	 * Example usage:
	 * 
	 * <pre><code>
	 * 	fieldCfg : {
	 * 	width: 150,
	 * 	},
	 * </code></pre>
	 */

	/**
	 * @cfg {Object} fields The field items may be configured individually
	 *      Defaults to <tt>undefined</tt>. Example usage:
	 * 
	 * <pre><code>
	 * 	fields : {
	 * 	gt: { // override fieldCfg options
	 * 	    width: 200,
	 * 	    fieldCls: Ext.ux.form.CustomNumberField // to override default {@link #fieldCls}
	 * 	}
	 * 	},
	 * </code></pre>
	 */

	/**
	 * @cfg {Object} itemIconCls The itemIconCls to be applied to each
	 *      comparator field item. Defaults to:
	 * 
	 * <pre>
	 * 	itemIconCls : {
	 * 	gt : 'ux-rangemenu-gt',
	 * 	lt : 'ux-rangemenu-lt',
	 * 	eq : 'ux-rangemenu-eq'
	 * 	}
	 * </pre>
	 */
	itemIconCls : {
		gt : 'ux-mongorangemenu-gt',
		gte : 'ux-mongorangemenu-gte',
		lt : 'ux-mongorangemenu-lt',
		lte : 'ux-mongorangemenu-lte',
		eq : 'ux-mongorangemenu-eq',
		ne : 'ux-mongorangemenu-ne'
	},

	/**
	 * @cfg {Object} fieldLabels Accessible label text for each comparator field
	 *      item. Can be overridden by localization files. Defaults to:
	 * 
	 * <pre>
	 * 	fieldLabels : {
	 * 	 gt: 'Greater Than',
	 * 	 lt: 'Less Than',
	 * 	 eq: 'Equal To'
	 * 	}
	 * </pre>
	 */
	fieldLabels : {
		gt : 'Greater Than',
		lt : 'Less Than',
		eq : 'Equal To'
	},

	/**
	 * @cfg {Object} menuItemCfgs Default configuration options for each menu
	 *      item Defaults to:
	 * 
	 * <pre>
	 * 	menuItemCfgs : {
	 * 	emptyText: 'Enter Filter Text...',
	 * 	selectOnFocus: true,
	 * 	width: 125
	 * 	}
	 * </pre>
	 */
	menuItemCfgs : {
		emptyText : 'Enter Value...',
		selectOnFocus : false,
		width : 200
	},

	/**
	 * @cfg {Array} menuItems The items to be shown in this menu. Items are
	 *      added to the menu according to their position within this array.
	 *      Defaults to:
	 * 
	 * <pre>
	 * menuItems: ['lt', 'gt', '-', 'eq']
	 * </pre>
	 */
	menuItems : ['gte', 'lte', 'eq'],

	constructor : function(config) {
		var me = this, fields, fieldCfg, i, len, item, cfg, Cls;

		me.callParent(arguments);

		fields = me.fields = me.fields || {};
		fieldCfg = me.fieldCfg = me.fieldCfg || {};

		me.addEvents(
		/**
		 * @event update Fires when a filter configuration has changed
		 * @param {Ext.ux.grid.filter.Filter}
		 *            this The filter object.
		 */
		'update');

		me.updateTask = Ext.create('Ext.util.DelayedTask', me.fireUpdate, me);

		for (i = 0, len = me.menuItems.length; i < len; i++) {
			item = me.menuItems[i];
			if (item !== '-') {
				// defaults
				cfg = {
					itemId : 'range-' + item,
					enableKeyEvents : true,
					hideLabel : false,
					fieldLabel : me.iconTpl.apply({
						cls : me.itemIconCls[item] || 'no-icon',
						text : me.fieldLabels[item] || '',
						src : Ext.BLANK_IMAGE_URL
					}),
					labelSeparator : '',
					labelWidth : 29,
					labelStyle : 'position: relative;',
					listeners : {
						scope : me,
						change : me.onInputChange,
						keyup : me.onInputKeyUp,
						el : {
							click : function(e) {
								e.stopPropagation();
							}
						}
					},
					activate : Ext.emptyFn,
					deactivate : Ext.emptyFn
				};
				Ext.apply(cfg,
				// custom configs
				Ext.applyIf(fields[item] || {}, fieldCfg[item]),
				// configurable defaults
				me.menuItemCfgs);
				Cls = cfg.fieldCls || me.fieldCls;
				item = fields[item] = Ext.create(Cls, cfg);
			}
			me.add(item);
		}
	},

	/**
	 * @private called by this.updateTask
	 */
	fireUpdate : function() {
		this.fireEvent('update', this);
	},

	/**
	 * Get and return the value of the filter.
	 * 
	 * @return {String} The value of this filter
	 */
	getValue : function() {
		var result = {}, key, field;
		var timeformat = "YYYY-MM-DDT00:00:00.000Z";
		for (key in this.fields) {
			field = this.fields[key];
			if (field.isValid() && field.getValue().length >= 10) {
				var value = field.getValue();
				var time = value.slice(0, 10) + "T" + value.slice(11) + timeformat.slice(11+value.slice(11).length, 24);
				result[key] = time;
			}
		}
		return result;
	},

	/**
	 * Set the value of this menu and fires the 'update' event.
	 * 
	 * @param {Object}
	 *            data The data to assign to this menu
	 */
	setValue : function(data) {
		var me = this, key, field;

		for (key in me.fields) {

			// Prevent field's change event from tiggering a Store filter. The
			// final upate event will do that
			field = me.fields[key];
			field.suspendEvents();
			field.setValue(key in data ? data[key] : '');
			field.resumeEvents();
		}

		// Trigger the filering of the Store
		me.fireEvent('update', me);
	},

	/**
	 * @private Handler method called when there is a keyup event on an input
	 *          item of this menu.
	 */
	onInputKeyUp : function(field, e) {
		if (e.getKey() === e.RETURN && field.isValid()) {
			e.stopEvent();
			this.hide();
		}
	},

	/**
	 * @private Handler method called when the user changes the value of one of
	 *          the input items in this menu.
	 */
	onInputChange : function(field) {
		if (typeof field === "undefined" || field.getValue() === "") {
			return;
		}

		var me = this, fields = me.fields;

		// incompatibilities
		// ______lte_lt__gte_gt__ne__eq
		// lte___-___1___0___0___0___1
		// lt____1___-___0___0___0___1
		// gte___0___0___-___1___0___1
		// gt____0___0___1___-___0___1
		// ne____0___0___0___0___-___1
		// eq____1___1___1___1___1___-

		var incompatibilities = {
			lte : ["lt", "eq"],
			lt : ["lte", "eq"],
			gte : ["gt", "eq"],
			gt : ["gte", "eq"],
			ne : ["eq"],
			eq : ["lte", "lt", "gte", "gt", "ne"]
		};

		var fieldKey = field.itemId.slice(6);
		var fieldsToReset = incompatibilities[fieldKey];
		for ( var i = 0; i < fieldsToReset.length; i++) {
			var key = fieldsToReset[i];
			if (fields[key]) {
				fields[key].setValue("");
			}
		}

		// restart the timer
		this.updateTask.delay(this.updateBuffer);
	}
}, function() {

	/**
	 * @cfg {Ext.XTemplate} iconTpl A template for generating the label for each
	 *      field in the menu
	 */
	this.prototype.iconTpl = Ext.create('Ext.XTemplate', '<img src="{src}" alt="{text}" class="' + Ext.baseCSSPrefix + 'menu-item-icon ux-rangemenu-icon {cls}" />');

});
