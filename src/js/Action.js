/*
 * kt-membership-statistics-service 1.0.0
 * 방문자, 메뉴, 서비스 별로 다양한 통계 데이터와 차트
 * https://cms.membership.kt.com
 * Copyright ©2011 - 2017 KT corp. All rights reserved.
*/
define([
   'module',
   'text!tpl/action.html',
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
   function(module, Action, Template, R2Loading, Model, Handlebars, c3, store, moment, datetimepicker){

	'use strict'

    moment.locale('ko');

 	module.exports = new (Backbone.View.extend({

        actionListTpl : '',
        selectboxTpl : '',
        actionName : '',
        actionChart : null,
        fromDate : '',
        toDate : '',
        actionData : '',
        events :{
            'change .kt-action-name-option': 'onActionNameHandler',
            'click .kt-action-serarch-btn': 'onSearchHanlder',
            'click .kt-action-table-btn': 'onClickHandlerTable',
            'click .kt-action-chart-btn': 'onClickHandlerChart'
 		},

        render:function(){
            this.setElement('.kt-action');
            if(this.$el.children().length === 0){
                this.$el.html(Action);

                this.selectboxTpl       = $(Template).find('.kt-selectbox-tpl').html();
                this.actionListTpl      = $(Template).find('.kt-action-table-tpl').html();
                this.dateTimePickerTpl  = $(Template).find('.kt-dateTimePicker-tpl').html();

            }

            this.setDateTimePicker();
            this.getActionName();
        },

        setDateTimePicker:function(){
            var template = Handlebars.compile(this.dateTimePickerTpl);
            this.$el.find('.kt-action-option .kt-action-serarch-btn').before(template({'dateTimePickerId':'fromDate'}));
            this.$el.find('.kt-action-option .kt-action-serarch-btn').before(template({'dateTimePickerId':'toDate'}));

            var dateTimePickerOption = {
                viewMode : 'days',
                format : 'YYYY-MM-DD',
                ignoreReadonly: true,
                locale :moment.locale('ko'),
            }

            this.$el.find('.fromDate').datetimepicker( _.extend(dateTimePickerOption,{'defaultDate':this.getStartDate()}) )
            this.$el.find('.toDate').datetimepicker( _.extend(dateTimePickerOption,{'defaultDate':this.getEndDate()}) )
        },

        /**
        * 검색 시작 일 가져오기
        */
        getStartDate:function(){
            var date = this.$el.find('.kt-action-option .fromDate input').val();
            return ( date === '' ) ? moment().format('YYYY-MM-') + '01' : date;
        },

        /**
        * 검색 끝 일 가져오기
        */
        getEndDate:function(){
            var date = this.$el.find('.kt-action-option .toDate input').val();
            return ( date === '' ) ? moment().format('YYYY-MM-DD') : date;
        },

        getActionName : function(){

            R2Loading.render({'msg':'서비스별 카테고리 데이터를\n불러오는 중입니다.','w':300})

            Model.getActionName({
                'success' : Function.prototype.bind.call(this.getActionNameSuccess,this),
                'error' : Function.prototype.bind.call(this.getActionNameError,this)
            })
        },

        getActionNameSuccess : function(data, textStatus, jqXHR){

            R2Loading.allDestroy();

            if(jqXHR.status === 200 && textStatus === 'success'){
                this.actionName = data[0];
                this.setActionSelectbox(data);
                this.getAction();
            }
        },

        setActionSelectbox:function(data){
            var actionNameList = _.map(data,function(value){return{'name':value}})
            var template = Handlebars.compile(this.selectboxTpl);
            this.$el.find('.kt-action-control').html(template( {'className':'kt-action-name-option','list':actionNameList} ));
        },

        getActionNameError : function(jsXHR, textStatus, errorThrown){

            R2Loading.allDestroy();

            if(textStatus === 'error'){
                if(jsXHR.status === 403) {
                    alert('토큰이 만료 되었습니다.')
                    store.remove('auth');
                    window.location.href="#login";
                }
            }
        },

        getAction : function(){

            R2Loading.render({'msg':'서비스별 데이터를\n불러오는 중입니다.','w':300})

            Model.getAction({
                'fromDate' : this.getStartDate(),
                'toDate' : this.getEndDate(),
                'action' : this.actionName,
                'success' : Function.prototype.bind.call(this.getActionSuccess,this),
                'error' : Function.prototype.bind.call(this.getActionError,this)
            })
        },

        getActionSuccess : function(data, textStatus, jqXHR){
            R2Loading.allDestroy();
            if(jqXHR.status === 200 && textStatus === 'success'){
                this.actionData = this.setActionData(data);
                this.setActionTable();
                this.setActionChart()
            }

        },

        getActionError : function(jsXHR, textStatus, errorThrown){
            R2Loading.allDestroy();
            if(textStatus === 'error'){
                if(jsXHR.status === 403) {
                    alert('토큰이 만료 되었습니다.')
                    store.remove('auth');
                    window.location.href="#login";
                }
            }
        },

        setActionData:function(data){

            var firstData = _.map(data, function(item, key){
                item[item.os] = item.actions
                return _.omit(item,'os','actions')
            })

            var dateArr = _.uniq(_.map(firstData, function(value, key){
                return value.date
            }))

            return _.map(dateArr, function(date){

                var basicObject = {date : date, android : 0, ios : 0}

                _.each(firstData, function(item){
                    if(item.date === date) {
                        if(item.android != null) { basicObject.android = item.android}
                        if(item.ios != null) { basicObject.ios = item.ios}
                    }
                })

                return _.extend(basicObject,{total:basicObject.ios + basicObject.android})
            })
        },

        setActionTable:function(){
            var template = Handlebars.compile(this.actionListTpl);
            this.$el.find('.kt-action-table').html(template({'actionList':this.actionData}));

            this.$el.find('.kt-action-table table').DataTable({
                "ordering" : true,
                "info" : false,
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

        setActionChart:function(){
            var ios = (['ios']).concat(_.pluck(this.actionData,'ios'));
            var android = (['android']).concat(_.pluck(this.actionData,'android'));
            var total = (['total']).concat(_.pluck(this.actionData,'total'));
            var dateArr = (['x']).concat(_.pluck(this.actionData,'date'));

            var chartData = [dateArr, ios, android, total]

            this.actionChart = c3.generate({
                bindto:'.kt-action-chart',
                data: {
                    x : 'x',
                    columns:chartData,
                    type: 'bar',
                    types: {
                        total: 'line',
                    },
                    groups: [
                        ['ios','android']
                    ]
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

        onClickHandlerTable:function(e){

            e.preventDefault();

            var $btn = $(e.currentTarget);

            if($btn.data('type') === 'default'){
                this.$el.find('.kt-action-table').removeClass('displayNone');
                $btn.data('type','success');
                $btn.removeClass('btn-default').addClass('btn-success');
            } else {
                this.$el.find('.kt-action-table').addClass('displayNone');
                $btn.data('type','default');
                $btn.removeClass('btn-success').addClass('btn-default');
            }

        },
        onClickHandlerChart:function(e){

            e.preventDefault();

            var $btn = $(e.currentTarget);

            if($btn.data('type') === 'default'){
                this.$el.find('.kt-action-chart-panel').removeClass('displayNone');
                $btn.data('type','info');
                $btn.removeClass('btn-default').addClass('btn-info');

                this.actionChart.resize();
            } else {
                this.$el.find('.kt-action-chart-panel').addClass('displayNone');
                $btn.data('type','default');
                $btn.removeClass('btn-info').addClass('btn-default');
            }
        },

        onActionNameHandler:function(e){
            e.preventDefault();
            this.actionName = $(e.currentTarget).val();
        },

        onSearchHanlder:function(e){
            e.preventDefault();
            this.getAction();
        },

        hide : function(){
            this.$el.addClass('displayNone');
        },
        show : function(){
            this.$el.removeClass('displayNone');
        }
 	}))

})
