define([
   'module',
   'text!tpl/main.html',
   'Dashboard',
   'TopMenu',
   'Sub'
   ],
   function(module, Main, Dashboard, TopMenu, Sub){

	'use strict'
 	module.exports = new (Backbone.View.extend({
 		el: '.main',
        prevView: null,
        initialize:function(){

        },
        render:function(mainMenu){

            this.$el.html(Main);

            if(this.prevView != null){
    			this.prevView.hide();
    		}

            console.log("여기")

            TopMenu.render();
            TopMenu.show();

            switch(mainMenu){
    			case 'user' :
                case 'menu' :
                case 'action' :
    				Sub.render(mainMenu);
    				this.prevView = Sub;
    				Sub.show();
    			break;
                default :
    				Dashboard.render();
    				this.prevView = Dashboard;
    				Dashboard.show();
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
