define([
   'module',
   'text!tpl/user.html',
   ],
   function(module, User){

	'use strict'

 	module.exports = new (Backbone.View.extend({
 		el: '.user',
        render:function(){
            this.$el.html(User);
        },
        hide : function(){
            this.$el.addClass('displayNone');
        },
        show : function(){
            this.$el.removeClass('displayNone');
        }
 	}))

})
