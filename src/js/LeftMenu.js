define([
   'module',
   'text!tpl/leftMenu.html',
   ],
   function(module, LeftMenu){

	'use strict'

 	module.exports = new (Backbone.View.extend({

        render:function(){

            this.setElement('#kt_leftMenu');
            if(this.$el.children().length === 0){
                this.$el.html(LeftMenu);
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
