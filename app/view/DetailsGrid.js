'use strict';

Ext.define('LogViewer.view.DetailsGrid', {
    //    id: 'idForNewView',
    columns : [ {
        dataIndex : 'key',
        flex : 1,
        text : 'FIELD'
    }, {
        dataIndex : 'value',
        flex : 7,
        //renderer : 'htmlEncode',
        renderer: function(v,m,r,i) {
            // fix per fare il prettify dell'XML o JSON
            try {
		return JSON.stringify(JSON.parse(v), null, 4)
	    } catch (e) {

	    	if(r.data.key.toUpperCase() === 'REQUEST' ||
            		r.data.key.toUpperCase() === 'RESPONSE' ||
            		r.data.key.toUpperCase() === 'EXCEPTION') {
			try {
                		v = '<pre>'+Ext.String.htmlEncode(this.formatXml(v))+'</pre>';
			} catch (e) {
				
				v =  JSON.stringify(v, null, 4);	
			}
            	} else {
                	v = Ext.String.htmlEncode(v);
            	}
            	return v;
	    }
        },
        text : 'VALUE',
        tdCls : 'wrap',
        editor: {
            xtype: 'textarea'
        }
    } ],
    extend : 'Ext.grid.Panel',
    sortableColumns : false,
    viewConfig : {
        enableTextSelection : true
    },
    formatXml: function (xml) {
        var formatted = '';
        var reg = /(>)(<)(\/*)/g;
        xml = xml.replace(reg, '$1\r\n$2$3');
        var pad = 0;
        Ext.each(xml.split('\r\n'), function(node,index) {
            var indent = 0;
            if (node.match( /.+<\/\w[^>]*>$/ )) {
                indent = 0;
            } else if (node.match( /^<\/\w/ )) {
                if (pad != 0) {
                    pad -= 1;
                }
            } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
                indent = 1;
            } else {
                indent = 0;
            }

            var padding = '';
            for (var i = 0; i < pad; i++) {
                padding += ' ';
            }

            formatted += padding + node + '\r\n';
            pad += indent;
        });

        return formatted;
    }
});

