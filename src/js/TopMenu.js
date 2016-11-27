define([
   'module',
   'text!tpl/topMenu.html'
   ],
   function(module, TopMenu){

	'use strict'

 	module.exports = new (Backbone.View.extend({
        initialize:function(){

        },
        render:function(mainMenu){

            this.setElement('#kt_topMenu');
            if(this.$el.children().length === 0){
                this.$el.html(TopMenu);
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
