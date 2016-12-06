define([
   'module',
   'text!tpl/action.html',
   'text!tpl/dateTimePicker.html',
   'js/Model'
   ],
   function(module, Action, DateTimePicker, Model){

	'use strict'

 	module.exports = new (Backbone.View.extend({

        actionListTpl : '',
        actionNameListTpl : '',
        actionName : '',

        startDate : '',
        endDate : '',

        events :{
            'change .kt_action_option .kt_action_name_option': 'onChangeDate',
            'click .kt_action_serarch_btn': 'onClickSearch'
 		},

        onChangeDate:function(e){
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

        render:function(){
            this.setElement('#kt_action');
            if(this.$el.children().length === 0){
                this.$el.html(Action);

                this.actionNameListTpl  = this.$el.find(".action_name_list_tpl").html();
                this.actionListTpl  = this.$el.find(".action_list_tpl").html();

                this.dateTimePickerTpl  = DateTimePicker;

            }

            this.$el.find('#datetimepicker30').datetimepicker({
                viewMode: 'days',
                format: 'DD/MM/YYYY'
            });

            this.$el.find('#datetimepicker31').datetimepicker({
                viewMode: 'days',
                format: 'DD/MM/YYYY'
            });

            // this.$el.find('#example').DataTable({
            //     "ordering" : false,
            //     "info" : false,
            //     'filter' : false,
            //     'lengthChange' : false
            // });


            this.startDate = '2016-05-01'//moment().format('YYYY-MM-') + '01'
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

        getActionName : function(){
            var token = store.get('auth').token;

            Model.getUser({
                url: KT.HOST + '/info/service/membership/action/list',
                method : 'GET',
                headers : {
                    'x-auth-token' : token
                },
                dataType : 'json',
                contentType:"application/json; charset=UTF-8",
                success : Function.prototype.bind.call(this.getActionNameSuccess,this),
                error : Function.prototype.bind.call(this.getActionNameError,this)
            })
        },

        getActionNameSuccess : function(data, textStatus, jqXHR){

            var actionNameList = _.map(data,function(value){return{'name':value}})

            console.log(actionNameList)

            var template = Handlebars.compile(this.actionNameListTpl);
            this.$el.find('.kt_action_option').prepend(template({'actionNameList':actionNameList}));

            this.actionName = this.$el.find('.kt_action_option .kt_action_name_option option:eq(0)').val();

            this.getAction();
        },

        getActionNameError : function(jsXHR, textStatus, errorThrown){

        },

        getAction : function(){

            var token = store.get('auth').token;

            Model.getUser({
                url: KT.HOST + '/info/service/membership/action',
                data:{'from':this.startDate,'to':this.endDate, 'action' : this.actionName},
                method : 'GET',
                headers : {
                    'x-auth-token' : token
                },
                dataType : 'json',
                contentType:"application/json; charset=UTF-8",
                success : Function.prototype.bind.call(this.getActionSuccess,this),
                error : Function.prototype.bind.call(this.getActionError,this)
            })

        },
        getActionSuccess : function(data, textStatus, jqXHR){

            let propsChange = _.map(data,function(value, key){
                value[value.os] = value.actions
                return _.omit(value,'actions')
            })

            console.log(propsChange)

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

            console.log(dateUniqArr)

            this.$el.find('.kt_action_list tbody').empty();

            var template = Handlebars.compile(this.actionListTpl);
            this.$el.find('.kt_action_list').append(template({'actionList':dateUniqArr}));

            this.$el.find('#actionListTable').DataTable({
                "ordering" : false,
                "info" : false,
                'filter' : false,
                'lengthChange' : false
            });


            // console.log(propsChange)
            //
            // var actionType = _.map(data,function(value, key){
            //     return value.action
            // })
            // console.log(_.uniq(actionType))

        },
        getActionError : function(jsXHR, textStatus, errorThrown){
            console.log(jsXHR);
        },

        hide : function(){
            this.$el.addClass('displayNone');
        },
        show : function(){
            this.$el.removeClass('displayNone');
        }
 	}))

})
