'use strict';

Ext.define('LogViewer.view.LoginWindow', {
    extend : 'Ext.Window',
    title: 'Login',
    closable: false,
    modal:true,
    width: 250,
    renderTo: Ext.getBody(),
    items:[{
        xtype:'form',
        monitorValid: true,
        frame: true,
        defaultType: 'textfield',
        defaults: {
            labelWidth: 60,
            validationEvent: false,
            validateOnBlur: false
        },
        items: [{
            fieldLabel: 'Login',
            name: 'LOGINNAME',
            //width: 120,
            allowBlank: false
        },{
            fieldLabel: 'Password',
            name: 'PASSWORD',
            //width: 120,
            allowBlank: false,
            inputType: 'password'
        }],
        buttonAlign: 'center',
        buttons: [{
            text: 'Login',
            handler: function() {
                this.findParentByType('window').doLogin();
            },
            formBind: true
        }],
        keys: [{
            // assegna al tasto "return" la funzione di login
            key: 13,
            fn: function() {
                this.findParentByType('window').doLogin();
            }
        }]
    }],
    doLogin: function() {
        this.dbCollectionsStore.load({
            params: {
                username: this.items.getAt(0).getForm().getValues().LOGINNAME,
                password: this.items.getAt(0).getForm().getValues().PASSWORD
            },
            callback: function(records, operation, success) {
                if(records.length){
                    // login OK, salviamo in un cookie per riutilizzo futuro
                    var today = new Date();
                    var setUntill = new Date(today.getTime() + (365*24 * 60 * 60 * 1000));
                    Ext.util.Cookies.set("username", operation.params.username,setUntill);
                    Ext.util.Cookies.set("password", operation.params.password,setUntill);
                    // chiudiamo la finestra
                    this.close();
                }
                if (!success) {

                    Ext.Msg.alert('Status', 'Network error');
                }
                if (!records.length) {

                    Ext.Msg.alert('Status', 'Wrong user/password');
                }
            },
            scope:this
        });
    }
});

