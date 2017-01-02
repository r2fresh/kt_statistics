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
   'datetimepicker',
   'moment/locale/ko'
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
        userChart : null,
        events :{
            'change .kt-user-option input[name=dateRadioOption]': 'onChangeDate',
            'click .kt-user-serarch-btn': 'onClickSearch',
            'click .kt-user-table-btn': 'onClickHandlerTable',
            'click .kt-user-chart-btn': 'onClickHandlerChart'
 		},

        render:function(){

            this.setElement('.kt-user');

            if(this.$el.children().length === 0){
                this.$el.html(User);

                this.dayUserListTpl     = $(Template).find('.day-user-list-tpl').html();
                this.hourUserListTpl    = $(Template).find('.hour-user-list-tpl').html();
                this.monthUserListTpl   = $(Template).find('.month-user-list-tpl').html();
                this.dateTimePickerTpl  = $(Template).find('.kt-dateTimePicker-tpl').html();
            }

            this.pathDateOption = this.$el.find('.kt-user-option input[name=dateRadioOption]:checked').val();

            this.fromDate = moment().format('YYYY-MM-') + '01'
            this.toDate = moment().format('YYYY-MM-DD')

            this.setDateTimePicker();
            this.getUser();
        },

        setDateTimePicker:function(){
            this.$el.find('.kt-search-period > div .fromDate').remove();
            this.$el.find('.kt-search-period > div .toDate').remove();

            var template = Handlebars.compile(this.dateTimePickerTpl);
            this.$el.find('.kt-search-period > div').prepend(template({'dateTimePickerId':'toDate'}));
            this.$el.find('.kt-search-period > div').prepend(template({'dateTimePickerId':'fromDate'}));

            var viewMode = '';
            var format = '';
            var startDefaultDate = ''

            if(this.pathDateOption === 'day' || this.pathDateOption === 'hour'){
                viewMode = 'days';
                format = 'YYYY/MM/DD';
                startDefaultDate = moment().format('YYYYMM') + '01'

            } else if(this.pathDateOption === 'month'){
                viewMode = 'months';
                format = 'YYYY/MM';
                startDefaultDate = 'moment'
            }

            this.$el.find('.toDate').datetimepicker({
                viewMode : viewMode,
                format : format,
                defaultDate : 'moment',
                locale :moment.locale('ko'),
                ignoreReadonly: true
            })

            this.$el.find('.fromDate').datetimepicker({
                viewMode : viewMode,
                format : format,
                defaultDate : startDefaultDate,
                locale :moment.locale('ko'),
                ignoreReadonly: true
            })

            if(this.pathDateOption === 'month'){
                this.$el.find('.fromDate').on('dp.show',function(e){
                    $(this).data("DateTimePicker").viewMode('months');
                })

                this.$el.find('.toDate').on('dp.show',function(e){
                    $(this).data("DateTimePicker").viewMode('months');
                })
            }
        },

        onChangeDate:function(e){
            this.pathDateOption = $(e.currentTarget).val();
            this.setDateTimePicker();
        },

        getUser:function(){

            R2Loading.render({'msg':'방문자별 데이터를\n불러오는 중입니다.','w':300})

            Model.getUser({
                'pathDateOption' : (this.pathDateOption === 'day') ? 'daily' : (this.pathDateOption === 'month') ? 'monthly' : 'hourly',
                'fromDate' : this.fromDate,
                'toDate' : this.toDate,
                'success' : Function.prototype.bind.call(this.getUserSuccess,this),
                'error' : Function.prototype.bind.call(this.getUserError,this)
            })
        },
        getUserSuccess:function(data, textStatus, jqXHR){

            R2Loading.allDestroy();

            if(jqXHR.status === 200 && textStatus === 'success'){

                this.userData = (this.pathDateOption === 'day') ? data : (this.pathDateOption === 'month') ? data.list : data.hourData;

                this.setUserTable();
                this.setUserChart();
            }
        },
        setUserTable:function(){

            var template = Handlebars.compile(this[this.pathDateOption + 'UserListTpl']);
            this.$el.find('.kt-user-table').html(template({'userList':this.userData}));

            this.$el.find('.kt-user-table table').DataTable({
                'ordering' : true,
                'info' : false,
                'filter' : false,
                'lengthChange' : false,
                'order' : [[ 0, 'desc' ]],
                'language': {
                    paginate: {
                        first:    '<strong><i class="fa fa-angle-double-left" aria-hidden="true"></i> 처음</strong>',
                        previous: '<strong><i class="fa fa-angle-left" aria-hidden="true"></i> 이전</strong>',
                        next:     '<strong>다음 <i class="fa fa-angle-right" aria-hidden="true"></i></strong>',
                        last:     '<strong>마지막 <i class="fa fa-angle-double-right" aria-hidden="true"></i></strong>'
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
                this.$el.find('.kt-user-table').removeClass('displayNone');
                $btn.data('type','success');
                $btn.removeClass('btn-default').addClass('btn-success');
            } else {
                this.$el.find('.kt-user-table').addClass('displayNone');
                $btn.data('type','default');
                $btn.removeClass('btn-success').addClass('btn-default');
            }

        },
        onClickHandlerChart:function(e){
            e.preventDefault();

            var $btn = $(e.currentTarget);
            var $chartPanel = this.$el.find('.kt-user-chart-panel');

            if($btn.data('type') === 'default'){
                $chartPanel.removeClass('displayNone');
                $btn.data('type','info');
                $btn.removeClass('btn-default').addClass('btn-info');
                this.userChart.resize();
            } else {
                $chartPanel.addClass('displayNone');
                $btn.data('type','default');
                $btn.removeClass('btn-info').addClass('btn-default');
            }
        },
        onClickSearch:function(e){
            e.preventDefault();
            this.$el.find('.kt-user-table').empty();

            var startDateValue = this.$el.find('.kt-user-option .fromDate input').val();
            var endDateValue = this.$el.find('.kt-user-option .toDate input').val();

            this.fromDate = (startDateValue.split('/')).join('-');
            this.toDate = (endDateValue.split('/')).join('-');

            this.getUser();
        },

        setUserChart:function(){
            var chartData = null
            ,$chart = this.$el.find('.kt-user-chart');

            if(this.pathDateOption === 'day'){
                var uniqVists = (['고유방문자']).concat(_.pluck(this.userData,'uniqVisits'))
                var pageViews = (['페이지뷰']).concat(_.pluck(this.userData,'pageViews'))
                var visits = (['방문자']).concat(_.pluck(this.userData,'visits'))
                var dateArr = (['x']).concat(_.pluck(this.userData,'date'))
                chartData = [dateArr, uniqVists, pageViews, visits]
            } else if(this.pathDateOption === 'month') {
                var uniqVists = (['고유방문자']).concat(_.pluck(this.userData,'uniqVisits'))
                var pageViews = (['페이지뷰']).concat(_.pluck(this.userData,'pageViews'))
                var visits = (['방문자']).concat(_.pluck(this.userData,'visits'))
                var dateArr = (['x']).concat(_.pluck(this.userData,'month'))

                chartData = [dateArr, uniqVists, pageViews, visits]
            } else if(this.pathDateOption === 'hour') {
                var avgPagesViews = (['평균페이지뷰']).concat(_.pluck(this.userData,'avgPagesViews'))
                var avgUniqVisits = (['평균고유방문자']).concat(_.pluck(this.userData,'avgUniqVisits'))
                var avgVisits = (['평균방문자']).concat(_.pluck(this.userData,'avgVisits'))
                var dateArr = (['x']).concat(_.pluck(this.userData,'hour'))

                chartData = [dateArr, avgPagesViews, avgUniqVisits, avgVisits]
            }

            this.userChart = c3.generate({
                bindto:'.kt-user-chart',
                data: {
                    x : 'x',
                    columns: chartData
                },
                axis: {
                    x: {
                        type: 'category'
                    }
                },
                tooltip: {
                    format: {
                        value: function (value, ratio, id) {
                            var format = d3.format(',');
                            return format(value);
                        }
                    }
                }
            });
        },
        hide : function(){
            this.$el.addClass('displayNone');
        },
        show : function(){
            this.$el.removeClass('displayNone');
        }
 	}))

})
