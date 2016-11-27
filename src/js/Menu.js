define([
   'module',
   'text!tpl/menu.html',
   ],
   function(module, Menu){

	'use strict'

 	module.exports = new (Backbone.View.extend({

        render:function(){

            this.setElement('#kt_menu');
            if(this.$el.children().length === 0){
                this.$el.html(Menu);
            }

        },
        hide : function(){
            this.$el.addClass('displayNone');
        },
        show : function(){
            this.$el.removeClass('displayNone');
        }
 	}))

})
