define([
   'module',
   'text!tpl/user.html',
   'js/Model'
   ],
   function(module, User, Model){

	'use strict'

 	module.exports = new (Backbone.View.extend({

        render:function(){

            this.setElement('#kt_user');
            if(this.$el.children().length === 0){
                this.$el.html(User);
            }

            this.$el.find('#datetimepicker10').datetimepicker({
                viewMode: 'years',
                format: 'MM/YYYY'
            });

            this.$el.find('#datetimepicker2').datetimepicker({
                viewMode: 'years',
                format: 'MM/YYYY'
            });

            this.$el.find('#example').DataTable({
                "ordering" : false,
                "info" : false,
                'filter' : false,
                'lengthChange' : false
            });

            this.getUser();

        },
        getUser:function(){

            var token = store.get('auth').token;

            Model.getUser({
                url: KT.HOST + '/info/membership/daily/visit?from=2016-11-01&to=2016-11-30',
                method : 'GET',
                headers : {
                    'x-auth-token' : 'b4c6fe8f-4afc-4cf4-8eb9-6d1c1e14e1e4'
                },
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader('x-auth-token','b4c6fe8f-4afc-4cf4-8eb9-6d1c1e14e1e4')
                //     xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
                // },
                dataType : 'json',
                contentType:"application/json; charset=UTF-8",
                success : Function.prototype.bind.call(this.getUserSuccess,this),
                error : Function.prototype.bind.call(this.getUserError,this)
            })
        },
        getUserSuccess:function(data, textStatus, jqXHR){
            //console.log(data);
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
