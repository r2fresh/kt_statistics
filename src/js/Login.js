/*
 * kt-membership-statistics-service 1.0.0
 * 방문자, 메뉴, 서비스 별로 다양한 통계 데이터와 차트
 * https://cms.membership.kt.com
 * Copyright ©2011 - 2017 KT corp. All rights reserved.
*/
define([
   'module',
   'text!tpl/login.html',
   'Model',
   'store',
   'utils/r2Loading',
   ],
   function(module, Login, Model, store, R2Loading){

	'use strict'
 	module.exports = new (Backbone.View.extend({
 		el: '.kt-login',
        events :{
            'click .kt-login-submit' : 'onSubmit'
 		},
        render:function(){
            this.$el.html(Login);
            this.$id = this.$el.find('.kt-login-id')
            this.$pwd = this.$el.find('.kt-login-pwd')
        },
        onSubmit:function(e){

            e.preventDefault();

            var id = this.$id.val()
            ,pwd = this.$pwd.val()

            if(id === ''){alert('ID를 입력해 주시기 바랍니다.');this.$id.focus();return;};
            if(pwd === ''){alert('비밀번호를 입력해 주시기 바랍니다.');this.$pwd.focus();return;};

            R2Loading.render({'msg':'로그인중입니다.','w':300})

            Model.postLogin({
                'id' : id,
                'pwd' : pwd,
                'success' : Function.prototype.bind.call(this.postLoginSuccess,this),
                'error' : Function.prototype.bind.call(this.postLoginError,this)
            })
        },
        postLoginSuccess:function(data, textStatus, jqXHR){

            R2Loading.allDestroy();

            if(jqXHR.status === 200 && textStatus === 'success'){
                store.set('auth',data);
                window.location.href = "#";
            }
        },
        postLoginError:function(jsXHR, textStatus, errorThrown){

            R2Loading.allDestroy();

            if(textStatus === 'error'){
                alert('에러가 발생 했습니다.');
            }
        },
        hide : function(){
            this.$el.addClass('displayNone');
        },
        show : function(){
            this.$el.removeClass('displayNone');
            this.$id.focus()
        }
 	}))

})
