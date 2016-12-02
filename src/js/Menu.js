define([
   'module',
   'text!tpl/menu.html',
   'js/Model'
   ],
   function(module, Menu, Model){

	'use strict'

 	module.exports = new (Backbone.View.extend({

        render:function(){

            this.setElement('#kt_menu');
            if(this.$el.children().length === 0){
                this.$el.html(Menu);
            }

            this.$el.find('#datetimepicker20').datetimepicker({
                viewMode: 'days',
                format: 'DD/MM/YYYY'
            });

            this.$el.find('#datetimepicker21').datetimepicker({
                viewMode: 'days',
                format: 'DD/MM/YYYY'
            });

            this.$el.find('#example').DataTable({
                "ordering" : false,
                "info" : false,
                'filter' : false,
                'lengthChange' : false
            });

            this.getMenu();

        },

        getMenu:function(){

            var token = store.get('auth').token;

            Model.getUser({
                url: KT.HOST + '/info/membership/menu',
                data:{'from':'2016-08-1','to':'2016-12-1'},
                method : 'GET',
                headers : {
                    'x-auth-token' : token
                },
                dataType : 'json',
                contentType:"application/json; charset=UTF-8",
                success : Function.prototype.bind.call(this.getMenuSuccess,this),
                error : Function.prototype.bind.call(this.getMenuError,this)
            })
        },
        getMenuSuccess:function(data, textStatus, jqXHR){
            console.log(data);
        },
        getMenuError:function(jsXHR, textStatus, errorThrown){

        },
        hide : function(){
            this.$el.addClass('displayNone');
        },
        show : function(){
            this.$el.removeClass('displayNone');
        }
 	}))

})
