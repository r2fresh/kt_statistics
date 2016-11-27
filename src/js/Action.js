define([
   'module',
   'text!tpl/action.html',
   ],
   function(module, Action){

	'use strict'

 	module.exports = new (Backbone.View.extend({

        render:function(){
            this.setElement('#kt_action');
            if(this.$el.children().length === 0){
                this.$el.html(Action);
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
