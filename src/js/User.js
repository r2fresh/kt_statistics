define([
   'module',
   'text!tpl/user.html',
   'text!tpl/dateTimePicker.html',
   'js/Model'
   ],
   function(module, User, DateTimePicker, Model){

	'use strict'

 	module.exports = new (Backbone.View.extend({

        dayUserListTpl : '',
        hourUserListTpl : '',
        dateTimePickerTpl : '',

        pathDateOption : '',

        startDate : '',
        endDate : '',

        events :{
            'change .kt_user_option input[name=dateRadioOption]': 'onChangeDate',
            'click .kt_user_serarch_btn': 'onClickSearch',
 		},
        onClickSearch:function(e){
            e.preventDefault();
            this.$el.find('.kt_user_list').empty();

            var startDateValue = this.$el.find('.kt_user_option #startDate input').val();
            var endDateValue = this.$el.find('.kt_user_option #endDate input').val();

            this.startDate = (startDateValue.split('/')).join('-');
            this.endDate = (endDateValue.split('/')).join('-');

            console.log(this.startDate)

            this.getUser();
        },

        onChangeDate:function(e){
            console.log( $(e.currentTarget).val() );
            this.pathDateOption = $(e.currentTarget).val();

            this.$el.find('.kt_user_option #startDate').remove();
            this.$el.find('.kt_user_option #endDate').remove();

            var template = Handlebars.compile(this.dateTimePickerTpl);
            this.$el.find('.kt_user_option .kt_user_serarch_btn').before(template({'dateTimePickerId':'startDate'}));
            this.$el.find('.kt_user_option .kt_user_serarch_btn').before(template({'dateTimePickerId':'endDate'}));

            var viewMode = '';
            var format = '';

            if(this.pathDateOption === 'daily' || this.pathDateOption === 'hourly'){
                viewMode = 'days';
                format = 'YYYY/MM/DD';
            } else if(this.pathDateOption === 'monthly'){
                viewMode = 'months';
                format = 'YYYY/MM';
            }

            this.$el.find('#endDate').datetimepicker({
                viewMode : viewMode,
                format : format
            })

            this.$el.find('#startDate').datetimepicker({
                viewMode : viewMode,
                format : format
            })

            if(this.pathDateOption === 'monthly'){
                this.$el.find('#startDate').on('dp.show',function(e){
                    $(this).data("DateTimePicker").viewMode('months');
                })

                this.$el.find('#endDate').on('dp.show',function(e){
                    $(this).data("DateTimePicker").viewMode('months');
                    console.log('ksy')
                })
            }
        },

        render:function(){

            this.setElement('#kt_user');
            if(this.$el.children().length === 0){
                this.$el.html(User);
                this.dayUserListTpl  = this.$el.find(".day_user_list_tpl").html();
                this.hourUserListTpl  = this.$el.find(".hour_user_list_tpl").html();
                this.monthUserListTpl  = this.$el.find(".month_user_list_tpl").html();

                this.dateTimePickerTpl  = DateTimePicker;

                this.$el.find('.kt_user_list').empty()
            }

            this.pathDateOption = this.$el.find('.kt_user_option input[name=dateRadioOption]:checked').val()

            //this.pathDateOptions =


            //$(function () {

            //});

            var template = Handlebars.compile(this.dateTimePickerTpl);
            this.$el.find('.kt_user_option .kt_user_serarch_btn').before(template({'dateTimePickerId':'startDate'}));
            this.$el.find('.kt_user_option .kt_user_serarch_btn').before(template({'dateTimePickerId':'endDate'}));

            this.$el.find('#endDate').datetimepicker({
                viewMode : 'days',
                format : 'YYYY/MM/DD'
            })
            this.$el.find('#startDate').datetimepicker({
                viewMode : 'days',
                format : 'YYYY/MM/DD'
            })


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
                data:{'from':this.startDate,'to':this.endDate},
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
