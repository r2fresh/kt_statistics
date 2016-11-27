define([
   'module',
   'text!tpl/login.html',
   ],
   function(module, Login){

	'use strict'
 	module.exports = new (Backbone.View.extend({
 		el: '.login',
        render:function(){
            this.$el.html(Login);
        },
        hide : function(){
            this.$el.addClass('displayNone');
        },
        show : function(){
            this.$el.removeClass('displayNone');
        }
 	}))

})
