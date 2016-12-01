define([
   'module',
   'text!tpl/user.html',
   'js/Model'
   ],
   function(module, User, Model){

	'use strict'

 	module.exports = new (Backbone.View.extend({

        dayUserListTpl : '',
        hourUserListTpl : '',

        pathDateOption : '',

        events :{
            'change .kt_user_option input[name=dateRadioOption]': 'onChangeDate',
            'click .kt_user_serarch_btn': 'onClickSearch',
 		},
        onClickSearch:function(e){
            e.preventDefault();
            this.$el.find('.kt_user_list').empty()
            this.getUser();
        },

        onChangeDate:function(e){

            console.log( $(e.currentTarget).val() );

            this.pathDateOption = $(e.currentTarget).val()

            //pathDateOption

        },

        render:function(){

            this.setElement('#kt_user');
            if(this.$el.children().length === 0){
                this.$el.html(User);
                this.dayUserListTpl  = this.$el.find(".day_user_list_tpl").html();
                this.hourUserListTpl  = this.$el.find(".hour_user_list_tpl").html();
                this.monthUserListTpl  = this.$el.find(".month_user_list_tpl").html();

                this.$el.find('.kt_user_list').empty()
            }

            this.pathDateOption = this.$el.find('.kt_user_option input[name=dateRadioOption]:checked').val()

            //this.pathDateOptions =


            this.$el.find('#datetimepicker10').datetimepicker({
                viewMode: 'years',
                format: 'MM/YYYY'
            });

            this.$el.find('#datetimepicker2').datetimepicker({
                viewMode: 'years',
                format: 'MM/YYYY'
            });



            this.getUser();

            this.setDateRadioOptions();

        },
        setDateRadioOptions:function(){

            //this.$el.find('.user_option input[type=radio]').

        },
        getUser:function(){

            var token = store.get('auth').token;

            Model.getUser({
                url: KT.HOST + '/info/membership/' + this.pathDateOption + '/visit',
                data:{'from':'2016-08','to':'2016-12'},
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

            if(this.pathDateOption === 'daily') {
                var template = Handlebars.compile(this.dayUserListTpl);
                this.$el.find('.kt_user_list').html(template({'userList':data}));

                this.$el.find('#example').DataTable({
                    "ordering" : false,
                    "info" : false,
                    'filter' : false,
                    'lengthChange' : false
                });
            } else if(this.pathDateOption === 'monthly'){
                var template = Handlebars.compile(this.monthUserListTpl);
                this.$el.find('.kt_user_list').html(template({'userList':data.list}));

                this.$el.find('#example').DataTable({
                    "ordering" : false,
                    "info" : false,
                    'filter' : false,
                    'lengthChange' : false
                });
            } else if(this.pathDateOption === 'hourly'){
                var template = Handlebars.compile(this.hourUserListTpl);
                this.$el.find('.kt_user_list').html(template({'userList':data.hourData}));

                this.$el.find('#example').DataTable({
                    "ordering" : false,
                    "info" : false,
                    'filter' : false,
                    'lengthChange' : false
                });
            }


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
