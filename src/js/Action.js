define([
   'module',
   'text!tpl/action.html',
   'text!tpl/tableTemplate.html',
   'js/Model'
   ],
   function(module, Action, TableTemplate, Model){

	'use strict'

 	module.exports = new (Backbone.View.extend({

        actionListTpl : '',
        selectboxTpl : '',
        actionName : '',

        startDate : '',
        endDate : '',

        actionData : '',

        events :{
            'change .kt_action_option .kt_action_option': 'onChangeAction',
            'click .kt_action_serarch_btn': 'onClickSearch',
            'click .kt_action_table_btn': 'onClickHandlerTable',
            'click .kt_action_chart_btn': 'onClickHandlerChart'
 		},

        render:function(){
            this.setElement('#kt_action');
            if(this.$el.children().length === 0){
                this.$el.html(Action);

                this.selectboxTpl       = $(TableTemplate).find('.kt-selectbox-tpl').html();
                this.actionListTpl      = $(TableTemplate).find('.kt-action-table-tpl').html();
                this.dateTimePickerTpl  = $(TableTemplate).find('.kt-dateTimePicker-tpl').html();

            }

            // this.$el.find('.kt_action_table table').datetimepicker({
            //     viewMode: 'days',
            //     format: 'DD/MM/YYYY'
            // });
            //
            // this.$el.find('.kt_action_table table').datetimepicker({
            //     viewMode: 'days',
            //     format: 'DD/MM/YYYY'
            // });

            // this.$el.find('#example').DataTable({
            //     "ordering" : false,
            //     "info" : false,
            //     'filter' : false,
            //     'lengthChange' : false
            // });


            this.startDate = moment().format('YYYY-MM-') + '01'
            this.endDate = moment().format('YYYY-MM-DD')

            var template = Handlebars.compile(this.dateTimePickerTpl);
            this.$el.find('.kt_action_option .kt_action_serarch_btn').before(template({'dateTimePickerId':'startDate'}));
            this.$el.find('.kt_action_option .kt_action_serarch_btn').before(template({'dateTimePickerId':'endDate'}));

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


            this.getActionName();
        },

        onClickHandlerTable:function(e){

            e.preventDefault();

            var $btn = $(e.currentTarget);

            if($btn.data('type') === 'default'){
                this.$el.find('.kt_action_table').removeClass('displayNone');
                $btn.data('type','success');
                $btn.removeClass('btn-default').addClass('btn-success');
            } else {
                this.$el.find('.kt_action_table').addClass('displayNone');
                $btn.data('type','default');
                $btn.removeClass('btn-success').addClass('btn-default');
            }

        },
        onClickHandlerChart:function(e){
            e.preventDefault();

            var $btn = $(e.currentTarget);

            if($btn.data('type') === 'default'){
                this.$el.find('.kt_action_chart').removeClass('displayNone');
                $btn.data('type','info');
                $btn.removeClass('btn-default').addClass('btn-info');

                this.setActionChart();
            } else {
                this.$el.find('.kt_action_chart').addClass('displayNone');
                $btn.data('type','default');
                $btn.removeClass('btn-info').addClass('btn-default');
            }
        },

        setActionChart:function(){


            console.log(this.actionData)

            let chartData = null;

            let ios = (['ios']).concat(_.pluck(this.actionData,'ios'));
            let android = (['android']).concat(_.pluck(this.actionData,'android'));
            let dateArr = (['x']).concat(_.pluck(this.actionData,'date'));

            chartData = [dateArr, ios, android]

            var chart = c3.generate({
                bindto:'.action_chart',
                data: {
                    x : 'x',
                    columns:chartData
                },
                axis: {
                    x: {
                        type: 'category'
                    }
                }
            });
        },

        onChangeAction:function(e){
            this.actionName = $(e.currentTarget).val();
        },

        onClickSearch:function(e){
            e.preventDefault();
            this.$el.find('.kt_action_list').empty();

            var startDateValue = this.$el.find('.kt_action_option .startDate input').val();
            var endDateValue = this.$el.find('.kt_action_option .endDate input').val();

            this.startDate = (startDateValue.split('/')).join('-');
            this.endDate = (endDateValue.split('/')).join('-');

            this.getAction();
        },



        getActionName : function(){
            Model.getActionName({
                'success' : Function.prototype.bind.call(this.getActionNameSuccess,this),
                'error' : Function.prototype.bind.call(this.getActionNameError,this)
            })
        },

        getActionNameSuccess : function(data, textStatus, jqXHR){

            if(jqXHR.status === 200 && textStatus === 'success'){
                this.actionName = data[0];
                this.setActionSelectbox(data);
                this.getAction();
            }
            //this.actionName = this.$el.find('.kt_action_option .kt_action_name_option option:eq(0)').val();
        },

        setActionSelectbox:function(data){
            var actionNameList = _.map(data,function(value){return{'name':value}})
            var template = Handlebars.compile(this.selectboxTpl);
            this.$el.find('.kt_action_name').html(template( {'className':'kt_action_option','list':actionNameList} ));
        },

        getActionNameError : function(jsXHR, textStatus, errorThrown){
            if(textStatus === 'error'){

                if(jsXHR.status === 403) {

                    alert('토큰이 만료 되었습니다.')
                    store.remove('auth');
                    window.location.href="#login";
                }
            }
        },

        getAction : function(){
            Model.getAction({
                'fromDate' : this.startDate,
                'toDate' : this.endDate,
                'action' : this.actionName,
                'success' : Function.prototype.bind.call(this.getActionSuccess,this),
                'error' : Function.prototype.bind.call(this.getActionError,this)
            })
        },
        getActionSuccess : function(data, textStatus, jqXHR){

            let propsChange = _.map(data,function(value, key){
                value[value.os] = value.actions
                return _.omit(value,'actions')
            })

            var dateSortArr = _.uniq(_.map(propsChange,function(value, key){
                return value.date
            }))

            console.log(dateSortArr)

            var dateUniqArr = [];

            _.each(dateSortArr,function(value){

                var temp = {
                    action : '',
                    date : '',
                    android : null,
                    ios : null,
                    serviceName : '',
                }
                _.each(propsChange,function(obj){
                    if(obj.date === value) {
                        if(obj.action != null) { temp.action = obj.action}
                        if(obj.date != null) { temp.date = obj.date}
                        if(obj.android != null) { temp.android = obj.android}
                        if(obj.ios != null) { temp.ios = obj.ios}
                        if(obj.serviceName != null) { temp.serviceName = obj.serviceName}

                    }
                })

                dateUniqArr.push(temp)

                temp = null;

            })

            this.actionData = dateUniqArr;

            console.log(dateUniqArr)

            this.$el.find('.kt_action_list tbody').empty();

            var template = Handlebars.compile(this.actionListTpl);
            this.$el.find('.kt_action_list').append(template({'actionList':dateUniqArr}));

            this.$el.find('.kt_action_table table').DataTable({
                "ordering" : false,
                "info" : false,
                'filter' : false,
                'lengthChange' : false,
                'language': {
                    paginate: {
                        first:    '<i class="fa fa-angle-double-left" aria-hidden="true"></i> 처음',
                        previous: '<i class="fa fa-angle-left" aria-hidden="true"></i> 이전',
                        next:     '다음 <i class="fa fa-angle-right" aria-hidden="true"></i>',
                        last:     '마지막 <i class="fa fa-angle-double-right" aria-hidden="true"></i>'
                    }
                }
            });


            this.setActionChart()

            // console.log(propsChange)
            //
            // var actionType = _.map(data,function(value, key){
            //     return value.action
            // })
            // console.log(_.uniq(actionType))

        },
        getActionError : function(jsXHR, textStatus, errorThrown){
            console.log(jsXHR)
            console.log(textStatus)
            console.log(errorThrown)
            if(textStatus === 'error'){

                if(jsXHR.status === 403) {

                    alert('토큰이 만료 되었습니다.')
                    store.remove('auth');
                    window.location.href="#login";
                }
            }
        },

        hide : function(){
            this.$el.addClass('displayNone');
        },
        show : function(){
            this.$el.removeClass('displayNone');
        }
 	}))

})
