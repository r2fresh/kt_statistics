define([
   'module',
   'text!tpl/user.html',
   'text!tpl/template.html',
   'utils/r2Loading',
   'Model',
   'Handlebars',
   'c3',
   'store',
   'moment',
   'datetimepicker'
   ],
   function(module, User, Template, R2Loading, Model, Handlebars, c3, store, moment, datetimepicker){

	'use strict'

 	module.exports = new (Backbone.View.extend({

        dayUserListTpl : '',
        hourUserListTpl : '',
        dateTimePickerTpl : '',
        pathDateOption : '',
        fromDate : '',
        toDate : '',
        userData : null,
        events :{
            'change .kt-user-option input[name=dateRadioOption]': 'onChangeDate',
            'click .kt_user_serarch_btn': 'onClickSearch',
            'click .kt_user_table_btn': 'onClickHandlerTable',
            'click .kt_user_chart_btn': 'onClickHandlerChart'
 		},

        render:function(){

            this.setElement('.kt-user');

            if(this.$el.children().length === 0){
                this.$el.html(User);

                this.dayUserListTpl     = $(Template).find('.day-user-list-tpl').html();
                this.hourUserListTpl    = $(Template).find('.hour_user_list_tpl').html();
                this.monthUserListTpl   = $(Template).find('.month_user_list_tpl').html();
                this.dateTimePickerTpl  = $(Template).find('.kt-dateTimePicker-tpl').html();

                this.$el.find('.kt_user_list').empty()
            }

            this.pathDateOption = this.$el.find('.kt-user-option input[name=dateRadioOption]:checked').val();

            this.fromDate = moment().format('YYYY-MM-') + '01'
            this.toDate = moment().format('YYYY-MM-DD')

            this.setDateTimePicker();
            this.getUser();
            this.setDateRadioOptions();
        },

        setDateTimePicker:function(){
            var template = Handlebars.compile(this.dateTimePickerTpl);
            this.$el.find('.kt-search-period > div').prepend(template({'dateTimePickerId':'toDate'}));
            this.$el.find('.kt-search-period > div').prepend(template({'dateTimePickerId':'fromDate'}));

            this.$el.find('.toDate').datetimepicker({
                viewMode : 'days',
                format : 'YYYY/MM/DD',
                defaultDate : 'moment',
                ignoreReadonly: true
            }).find('input[type="text"]').attr("readonly",true)

            this.$el.find('.fromDate').datetimepicker({
                viewMode : 'days',
                format : 'YYYY/MM/DD',
                defaultDate : moment().format('YYYYMM') + '01',
                ignoreReadonly: true
            }).find('input[type="text"]').attr("readonly",true)
        },


        getUser:function(){

            R2Loading.render({'msg':'방문자별 데이터를\n불러오는 중입니다.','w':300})

            Model.getUser({
                'pathDateOption' : this.pathDateOption,
                'fromDate' : this.fromDate,
                'toDate' : this.toDate,
                'success' : Function.prototype.bind.call(this.getUserSuccess,this),
                'error' : Function.prototype.bind.call(this.getUserError,this)
            })
        },


        getUserSuccess:function(data, textStatus, jqXHR){

            R2Loading.allDestroy();

            if(jqXHR.status === 200 && textStatus === 'success'){

                if(this.pathDateOption === 'daily') {
                    this.userData = data;
                } else if(this.pathDateOption === 'monthly'){
                    this.userData = data.list;
                } else if(this.pathDateOption === 'hourly'){
                    this.userData = data.hourData;
                }

                this.userData = data;
                this.setUserTable();
                this.setUserChart();
            }
        },
        setUserTable:function(){

            if(this.pathDateOption === 'daily') {
                var template = Handlebars.compile(this.dayUserListTpl);
                this.$el.find('.kt_user_list').html(template({'userList':this.userData}));
            } else if(this.pathDateOption === 'monthly'){
                var template = Handlebars.compile(this.monthUserListTpl);
                this.$el.find('.kt_user_list').html(template({'userList':this.userData.list}));
            } else if(this.pathDateOption === 'hourly'){
                var template = Handlebars.compile(this.hourUserListTpl);
                this.$el.find('.kt_user_list').html(template({'userList':this.userData.hourData}));
            }

            this.$el.find('.kt_user_list table').DataTable({
                'ordering' : true,
                'info' : false,
                'filter' : false,
                'lengthChange' : false,
                'order' : [[ 0, 'desc' ]],
                'language': {
                    paginate: {
                        first:    '<i class="fa fa-angle-double-left" aria-hidden="true"></i> 처음',
                        previous: '<i class="fa fa-angle-left" aria-hidden="true"></i> 이전',
                        next:     '다음 <i class="fa fa-angle-right" aria-hidden="true"></i>',
                        last:     '마지막 <i class="fa fa-angle-double-right" aria-hidden="true"></i>'
                    }
                }
            });
        },
        getUserError:function(jsXHR, textStatus, errorThrown){

            R2Loading.allDestroy();

            if(textStatus === 'error'){
                if(jsXHR.status === 403) {
                    alert('토큰이 만료 되었습니다.')
                    store.remove('auth');
                    window.location.href="#login";
                }
            }
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

            var startDateValue = this.$el.find('.kt-user-option .fromDate input').val();
            var endDateValue = this.$el.find('.kt-user-option .toDate input').val();

            this.fromDate = (startDateValue.split('/')).join('-');
            this.toDate = (endDateValue.split('/')).join('-');

            this.getUser();
        },

        setUserChart:function(){


            console.log(this.userData)

            var chartData = null;

            if(this.pathDateOption === 'daily'){
                var uniqVists = (['고유방문자']).concat(_.pluck(this.userData,'uniqVisits'))
                var pageViews = (['페이지뷰']).concat(_.pluck(this.userData,'pageViews'))
                var visits = (['방문자']).concat(_.pluck(this.userData,'visits'))
                var dateArr = (['x']).concat(_.pluck(this.userData,'date'))

                console.log(dateArr)
                chartData = [dateArr, uniqVists, pageViews, visits]
            } else if(this.pathDateOption === 'monthly') {
                var uniqVists = (['고유방문자']).concat(_.pluck(this.userData,'uniqVisits'))
                var pageViews = (['페이지뷰']).concat(_.pluck(this.userData,'pageViews'))
                var visits = (['방문자']).concat(_.pluck(this.userData,'visits'))
                var dateArr = (['x']).concat(_.pluck(this.userData,'month'))

                chartData = [dateArr, uniqVists, pageViews, visits]
            } else if(this.pathDateOption === 'hourly') {
                var avgPagesViews = (['평균페이지뷰']).concat(_.pluck(this.userData,'avgPagesViews'))
                var avgUniqVisits = (['평균고유방문자']).concat(_.pluck(this.userData,'avgUniqVisits'))
                var avgVisits = (['평균방문자']).concat(_.pluck(this.userData,'avgVisits'))
                var dateArr = (['x']).concat(_.pluck(this.userData,'hour'))

                chartData = [dateArr, avgPagesViews, avgUniqVisits, avgVisits]
            }

            console.log(chartData)

            var chart = c3.generate({
                bindto:'.user_chart',
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

            this.$el.find('.kt-user-option .fromDate').remove();
            this.$el.find('.kt-user-option .toDate').remove();

            var template = Handlebars.compile(this.dateTimePickerTpl);
            this.$el.find('.kt-user-option .kt_user_serarch_btn').before(template({'dateTimePickerId':'fromDate'}));
            this.$el.find('.kt-user-option .kt_user_serarch_btn').before(template({'dateTimePickerId':'toDate'}));

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

            this.$el.find('.toDate').datetimepicker({
                viewMode : viewMode,
                format : format,
                defaultDate : 'moment',
                ignoreReadonly: true
            })

            this.$el.find('.fromDate').datetimepicker({
                viewMode : viewMode,
                format : format,
                defaultDate : startDefaultDate,
                ignoreReadonly: true
            })

            if(this.pathDateOption === 'monthly'){
                this.$el.find('.fromDate').on('dp.show',function(e){
                    $(this).data("DateTimePicker").viewMode('months');
                })

                this.$el.find('.toDate').on('dp.show',function(e){
                    $(this).data("DateTimePicker").viewMode('months');
                    console.log('ksy')
                })
            }
        },





        setDateRadioOptions:function(){

            //this.$el.find('.user_option input[type=radio]').

        },

        hide : function(){
            this.$el.addClass('displayNone');
        },
        show : function(){
            this.$el.removeClass('displayNone');
        }
 	}))

})
