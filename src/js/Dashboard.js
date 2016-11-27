define([
   'module',
   'text!tpl/dashboard.html'
   ],
   function(module, Dashboard){

	'use strict'

 	module.exports = new (Backbone.View.extend({

        render:function(mainMenu){
            
            this.setElement('.dashboard');
            if(this.$el.children().length === 0){
                this.$el.html(Dashboard);
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
