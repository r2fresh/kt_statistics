/*
 * kt-membership-statistics-service 1.0.0
 * 방문자, 메뉴, 서비스 별로 다양한 통계 데이터와 차트
 * https://cms.membership.kt.com
 * Copyright ©2011 - 2017 KT corp. All rights reserved.
*/
define([
 	'module',
 	'text!tpl/r2_loading.html',
    'backbone'
 	],
 	function(module, R2_Loading, Backbone){

        'use strict'

 		module.exports = new (Backbone.View.extend({
            title : '',
            message : '',
            className : '',
            callback : null,
            events :{
                // 로그아웃
                'click #confirm' : 'onConfirm',
     		},
            render:function(obj){
                this.className = 'r2_loading';

                if(obj.callback){
                    this.callback = obj.callback;
                }

                var r2Loading = R2.Dialog.render(this.className, R2_Loading);
                this.setElement(r2Loading);
                this.$el.find('.r2-dialog-main').css({'width':obj.w})
                this.$el.find('#message').text(obj.msg);
                R2.Dialog.rePosition(obj.className);
            },
            allDestroy:function(){
                R2.Dialog.destroy();
            }
        }))
 	}
)
