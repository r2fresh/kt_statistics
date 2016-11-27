define([
   'module',
   'text!tpl/sub.html',
   'js/LeftMenu',
   'js/User',
   'js/Menu',
   'js/Action'
   ],
   function(module, Sub, LeftMenu, User, Menu, Action){

	'use strict'

 	module.exports = new (Backbone.View.extend({

        prevView: null,
        render:function(mainMenu){

            //if(this.$el.children().length === 0){
                this.setElement('#kt_sub');
                this.$el.html(Sub);
            //}

            if(this.prevView != null){
    			this.prevView.hide();
    		}

            console.log("1212")

            LeftMenu.render();
            LeftMenu.show();

            switch(mainMenu){
    			case 'user' :
    				User.render();
    				this.prevView = User;
    				User.show();
    			break;
                case 'menu' :
    				Menu.render();
    				this.prevView = Menu;
    				Menu.show();
    			break;
                case 'action' :
    				Action.render();
    				this.prevView = Action;
    				Action.show();
    			break;
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
