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

        userData : null,

        events :{
            'change .kt_user_option input[name=dateRadioOption]': 'onChangeDate',
            'click .kt_user_serarch_btn': 'onClickSearch',
            'click .kt_user_table_btn': 'onClickHandlerTable',
            'click .kt_user_chart_btn': 'onClickHandlerChart'
 		},
        onClickHandlerTable:function(e){

            e.preventDefault();

            var $btn = $(e.currentTarget);

            if($btn.data('type') === 'default'){
                this.$el.find('.kt_user_table').removeClass('displayNone');
                $btn.data('type','success');
                $btn.removeClass('btn-default').addClass('btn-success');
            } else {
                this.$el.find('.kt_user_table').addClass('displayNone');
                $btn.data('type','default');
                $btn.removeClass('btn-success').addClass('btn-default');
            }

        },
        onClickHandlerChart:function(e){
            e.preventDefault();

            var $btn = $(e.currentTarget);

            if($btn.data('type') === 'default'){
                this.$el.find('.kt_user_chart').removeClass('displayNone');
                $btn.data('type','info');
                $btn.removeClass('btn-default').addClass('btn-info');

                this.setUserChart();
            } else {
                this.$el.find('.kt_user_chart').addClass('displayNone');
                $btn.data('type','default');
                $btn.removeClass('btn-info').addClass('btn-default');
            }
        },
        onClickSearch:function(e){
            e.preventDefault();
            this.$el.find('.kt_user_list').empty();

            var startDateValue = this.$el.find('.kt_user_option .startDate input').val();
            var endDateValue = this.$el.find('.kt_user_option .endDate input').val();

            this.startDate = (startDateValue.split('/')).join('-');
            this.endDate = (endDateValue.split('/')).join('-');

            console.log(this.startDate)

            this.getUser();
        },

        setUserChart:function(){


            console.log(this.userData)

            let chartData = null;

            if(this.pathDateOption === 'daily'){
                let uniqVists = (['uniqVisits']).concat(_.pluck(this.userData,'uniqVisits'))
                let pageViews = (['pageViews']).concat(_.pluck(this.userData,'pageViews'))
                let visits = (['views']).concat(_.pluck(this.userData,'visits'))
                let dateArr = (['x']).concat(_.pluck(this.userData,'date'))

                console.log(dateArr)
                chartData = [dateArr, uniqVists, pageViews, visits]
            } else if(this.pathDateOption === 'monthly') {
                let uniqVists = (['uniqVisits']).concat(_.pluck(this.userData,'uniqVisits'))
                let pageViews = (['pageViews']).concat(_.pluck(this.userData,'pageViews'))
                let visits = (['views']).concat(_.pluck(this.userData,'visits'))
                let dateArr = (['x']).concat(_.pluck(this.userData,'month'))

                chartData = [dateArr, uniqVists, pageViews, visits]
            } else if(this.pathDateOption === 'hourly') {
                let avgPagesViews = (['avgPagesViews']).concat(_.pluck(this.userData,'avgPagesViews'))
                let avgUniqVisits = (['avgUniqVisits']).concat(_.pluck(this.userData,'avgUniqVisits'))
                let avgVisits = (['avgVisits']).concat(_.pluck(this.userData,'avgVisits'))
                let dateArr = (['x']).concat(_.pluck(this.userData,'hour'))

                chartData = [dateArr, avgPagesViews, avgUniqVisits, avgVisits]
            }

            console.log(chartData)

            var chart = c3.generate({
                bindto:'#chart_2',
                data: {
                    x : 'x',
                    columns: chartData
                },
                axis: {
                    x: {
                        type: 'category'
                    }
                }
            });
        },

        onChangeDate:function(e){
            console.log( $(e.currentTarget).val() );
            this.pathDateOption = $(e.currentTarget).val();

            this.$el.find('.kt_user_option .startDate').remove();
            this.$el.find('.kt_user_option .endDate').remove();

            var template = Handlebars.compile(this.dateTimePickerTpl);
            this.$el.find('.kt_user_option .kt_user_serarch_btn').before(template({'dateTimePickerId':'startDate'}));
            this.$el.find('.kt_user_option .kt_user_serarch_btn').before(template({'dateTimePickerId':'endDate'}));

            var viewMode = '';
            var format = '';
            var startDefaultDate = ''

            if(this.pathDateOption === 'daily' || this.pathDateOption === 'hourly'){
                viewMode = 'days';
                format = 'YYYY/MM/DD';
                startDefaultDate = moment().format('YYYYMM') + '01'

            } else if(this.pathDateOption === 'monthly'){
                viewMode = 'months';
                format = 'YYYY/MM';
                startDefaultDate = 'moment'
            }

            this.$el.find('.endDate').datetimepicker({
                viewMode : viewMode,
                format : format,
                defaultDate : 'moment',
                ignoreReadonly: true
            })

            this.$el.find('.startDate').datetimepicker({
                viewMode : viewMode,
                format : format,
                defaultDate : startDefaultDate,
                ignoreReadonly: true
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

            //console.log(moment())

            this.startDate = moment().format('YYYY-MM-') + '01'
            this.endDate = moment().format('YYYY-MM-DD')

            var template = Handlebars.compile(this.dateTimePickerTpl);
            this.$el.find('.kt_user_option .kt_user_serarch_btn').before(template({'dateTimePickerId':'startDate'}));
            this.$el.find('.kt_user_option .kt_user_serarch_btn').before(template({'dateTimePickerId':'endDate'}));

            this.$el.find('.endDate').datetimepicker({
                viewMode : 'days',
                format : 'YYYY/MM/DD',
                defaultDate : 'moment',
                ignoreReadonly: true
            }).find('input[type="text"]').attr("readonly",true)
            this.$el.find('.startDate').datetimepicker({
                viewMode : 'days',
                format : 'YYYY/MM/DD',
                defaultDate : moment().format('YYYYMM') + '01',
                ignoreReadonly: true
            }).find('input[type="text"]').attr("readonly",true)


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
                this.userData = data;
                var template = Handlebars.compile(this.dayUserListTpl);
                this.$el.find('.kt_user_list').html(template({'userList':data}));

                this.$el.find('#example').DataTable({
                    "ordering" : false,
                    "info" : false,
                    'filter' : false,
                    'lengthChange' : false
                });
            } else if(this.pathDateOption === 'monthly'){
                this.userData = data.list;
                var template = Handlebars.compile(this.monthUserListTpl);
                this.$el.find('.kt_user_list').html(template({'userList':data.list}));

                this.$el.find('#example').DataTable({
                    "ordering" : false,
                    "info" : false,
                    'filter' : false,
                    'lengthChange' : false
                });
            } else if(this.pathDateOption === 'hourly'){
                this.userData = data.hourData;
                var template = Handlebars.compile(this.hourUserListTpl);
                this.$el.find('.kt_user_list').html(template({'userList':data.hourData}));

                this.$el.find('#example').DataTable({
                    "ordering" : false,
                    "info" : false,
                    'filter' : false,
                    'lengthChange' : false
                });
            }

            this.setUserChart();

        },
        getUserError:function(jsXHR, textStatus, errorThrown){

            if(textStatus === 'error'){

                if(jsXHR.status === 403) {

                    alert('토큰이 만료 되었습니다.')
                    store.remove('auth');
                    window.location.href="#login";
                }
            }
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
