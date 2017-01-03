/*
 * kt-membership-statistics-service 1.0.0
 * 방문자, 메뉴, 서비스 별로 다양한 통계 데이터와 차트
 * https://cms.membership.kt.com
 * Copyright ©2011 - 2017 KT corp. All rights reserved.
*/
define([
   'module',
   'text!tpl/topMenu.html',
   'store',
   'backbone'
   ],
   function(module, TopMenu, store, Backbone){

	'use strict'

 	module.exports = new (Backbone.View.extend({
        initialize:function(){

        },
        events :{
            'click .kt_info_logout_btn' : 'onLogout',
 		},
        render:function(mainMenu){

            this.setElement('.kt-top-menu');
            if(this.$el.children().length === 0){
                this.$el.html(TopMenu);
            }

            this.setUserName();

        },
        setUserName:function(){
            var username = store.get('auth').username;
            this.$el.find('.kt_info_username strong').text(username);
        },
        onLogout:function(e){
            e.preventDefault();
            store.remove('auth');
            window.location.href="#login";
        },
        hide : function(){
            this.$el.addClass('displayNone');
        },
        show : function(){
            this.$el.removeClass('displayNone');
        }
 	}))

})
