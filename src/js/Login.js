define([
   'module',
   'text!tpl/login.html',
   'js/Model'
   ],
   function(module, Login, Model){

	'use strict'
 	module.exports = new (Backbone.View.extend({
 		el: '.login',
        events :{
            'click #kt_login_submit' : 'onSubmit',
 		},
        render:function(){
            this.$el.html(Login);
        },
        onSubmit:function(e){

            var id = this.$el.find('#kt_login_insert_id').val();
            var pwd = this.$el.find('#kt_login_pwd').val();

            e.preventDefault();

            Model.postLogin({
                url: KT.LOGIN_HOST + '/user/login',
                method : 'POST',
                data : JSON.stringify({'username':id,'password':pwd}),
                dataType : 'json',
                contentType:"application/json; charset=UTF-8",
                success : Function.prototype.bind.call(this.postLoginSuccess,this),
                error : Function.prototype.bind.call(this.postLoginError,this)
            })

        },
        postLoginSuccess:function(data, textStatus, jqXHR){

            if(textStatus === 'success'){
                store.set('auth',data);
            }

            window.location.href = "/";

            console.log(data);
            console.log(textStatus);
            console.log(jqXHR)
        },
        postLoginError:function(jsXHR, textStatus, errorThrown){

        },
        hide : function(){
            this.$el.addClass('displayNone');
        },
        show : function(){
            this.$el.removeClass('displayNone');
        }
 	}))

})
