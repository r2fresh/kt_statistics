define([
   'module',
   'text!tpl/user.html',
   'js/Model'
   ],
   function(module, User, Model){

	'use strict'

 	module.exports = new (Backbone.View.extend({

        dayUserListTpl : '',

        render:function(){

            this.setElement('#kt_user');
            if(this.$el.children().length === 0){
                this.$el.html(User);
                this.dayUserListTpl  = this.$el.find(".day_user_list_tpl").html();
            }

            this.$el.find('#datetimepicker10').datetimepicker({
                viewMode: 'years',
                format: 'MM/YYYY'
            });

            this.$el.find('#datetimepicker2').datetimepicker({
                viewMode: 'years',
                format: 'MM/YYYY'
            });



            this.getUser();

        },
        getUser:function(){

            var token = store.get('auth').token;

            Model.getUser({
                url: KT.HOST + '/info/membership/daily/visit',
                data:{'from':'2016-10-01','to':'2016-11-30'},
                method : 'GET',
                headers : {
                    'x-auth-token' : token
                },
                dataType : 'json',
                contentType:"application/json; charset=UTF-8",
                success : Function.prototype.bind.call(this.getUserSuccess,this),
                error : Function.prototype.bind.call(this.getUserError,this)
            })
        },
        getUserSuccess:function(data, textStatus, jqXHR){
            console.log(data);

            var template = Handlebars.compile(this.dayUserListTpl);
            this.$el.find('.day_user_list').html(template({'userList':data}));

            this.$el.find('#example').DataTable({
                "ordering" : false,
                "info" : false,
                'filter' : false,
                'lengthChange' : false
            });
        },
        getUserError:function(jsXHR, textStatus, errorThrown){
            //console.log(jsXHR)
            //console.log(textStatus)
            //console.log(errorThrown)
        },
        hide : function(){
            this.$el.addClass('displayNone');
        },
        show : function(){
            this.$el.removeClass('displayNone');
        }
 	}))

})
