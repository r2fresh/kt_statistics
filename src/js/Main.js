/*
 * kt-membership-statistics-service 1.0.0
 * 방문자, 메뉴, 서비스 별로 다양한 통계 데이터와 차트
 * https://cms.membership.kt.com
 * Copyright ©2011 - 2017 KT corp. All rights reserved.
*/
define([
   'module',
   'text!tpl/main.html',
   'Dashboard',
   'TopMenu',
   'User',
   'Menu',
   'Action'
   ],
   function(module, Main, Dashboard, TopMenu, User, Menu, Action){

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

            TopMenu.render();
            TopMenu.show();

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
