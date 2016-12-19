define([
   'module',
   'text!tpl/dashboard.html',
   'text!tpl/tableTemplate.html',
   'js/Model'
   ],
   function(module, Dashboard, TableTemplate, Model){

	'use strict'

 	module.exports = new (Backbone.View.extend({
        events :{
            'change  .kt_area_name_option': 'onChangeArea',
            'change  .kt_menu_name_option': 'onChangeMenu',
 		},

        render:function(mainMenu){

            this.setElement('.dashboard');

            if(this.$el.children().length === 0){
                this.$el.html(Dashboard);

                this.dayUserListTpl     = $(TableTemplate).find('.day-user-list-tpl').html();
                this.menuTableTpl       = $(TableTemplate).find('.kt-menu-table-tpl').html();
                this.actionTableTpl     = $(TableTemplate).find('.kt-action-table-tpl').html();
                this.selectboxTpl   = $(TableTemplate).find('.kt-selectbox-tpl').html();

            //     var chart = c3.generate({
            //         bindto:'.user_chart',
            //         data: {
            //             x: 'x',
            //             columns: [
            //                 ['x', '01-01', '01-01', '01-01', '01-01', '01-01', '01-01','02-01'],
            //                 ['sample', 30, 200, 100, 400, 150, 250, 30]
            //             ]
            //         }
            //     });
            //
            //     var chart = c3.generate({
            //         bindto:'.menu_chart',
            //         data: {
            //             x: 'x',
            //             columns: [
            //                 ['x', '01-01', '01-01', '01-01', '01-01', '01-01', '01-01','02-01'],
            //                 ['sample', 30, 200, 100, 400, 150, 250, 30]
            //             ]
            //         }
            //     });
            //
            //     var chart = c3.generate({
            //         bindto:'.action_chart',
            //         data: {
            //             x: 'x',
            //             columns: [
            //                 ['x', '01-01', '01-01', '01-01', '01-01', '01-01', '01-01','02-01'],
            //                 ['sample', 30, 200, 100, 400, 150, 250, 30]
            //             ]
            //         }
            //     });
            //
             }

            this.getUser();
            this.getMenu();
            this.getActionName();
        },
        getActionName : function(){
            var token = store.get('auth').token;

            Model.getActionName({
                'success' : Function.prototype.bind.call(this.getActionNameSuccess,this),
                'error' : Function.prototype.bind.call(this.getActionNameError,this)
            })
        },
        getActionNameSuccess : function(data, textStatus, jqXHR){
            if(jqXHR.status === 200 && textStatus === 'success'){
                this.userData = data;
                this.setActionSelectbox(data);
            }
        },
        getActionNameError : function(jsXHR, textStatus, errorThrown){
            if(textStatus === 'error'){
                switch(jsXHR.status){
                    case 403:
                        alert('토큰이 만료 되었습니다.')
                        store.remove('auth');
                        window.location.href="#login";
                    break;
                    case 0:
                        alert('에러가 발생 했습니다.');
                        store.remove('auth');
                        window.location.href="/";
                    break;
                }
            }
        },
        setActionSelectbox:function(data){
            var actionNameList = _.map(data,function(value){return{'name':value}})

            console.log(actionNameList)

            var template = Handlebars.compile(this.selectboxTpl);
            this.$el.find('.kt-dashboard-action .panel-title').after(template( {'className':'kt_area_name_option','list':actionNameList} ));

            //this.actionName = this.$el.find('.kt_action_option .kt_action_name_option option:eq(0)').val();
        },


        getUser:function(){

            var toDate   = moment().format('YYYY-MM-DD');
            var duration = moment.duration(5,'week');
            var fromDate = ( (moment()).subtract(duration) ).format('YYYY-MM-DD')

            Model.getUser({
                'pathDateOption' : 'daily',
                'fromDate' : fromDate,
                'toDate' : toDate,
                'success' : Function.prototype.bind.call(this.getUserSuccess,this),
                'error' : Function.prototype.bind.call(this.getUserError,this)
            })
        },
        getUserSuccess:function(data, textStatus, jqXHR){
            if(jqXHR.status === 200 && textStatus === 'success'){
                this.userData = data;
                this.setUserTable();
                this.setUserChart();
            }
        },
        getUserError:function(jsXHR, textStatus, errorThrown){
            if(textStatus === 'error'){
                switch(jsXHR.status){
                    case 403:
                        alert('토큰이 만료 되었습니다.')
                        store.remove('auth');
                        window.location.href="#login";
                    break;
                    case 0:
                        alert('에러가 발생 했습니다.');
                        store.remove('auth');
                        window.location.href="/";
                    break;
                }
            }
        },

        setUserTable:function(){
            Handlebars.registerHelper( 'capitalize', (str) => KT.util.millisecondToTime( parseInt(str,10) ) );
            var template = Handlebars.compile(this.dayUserListTpl);
            this.$el.find('.kt-dashboard-user .user-table').html(template({'userList':this.userData}));
        },
        setUserChart:function(){
            let chartData = null;

            let uniqVists = (['고유방문자']).concat(_.pluck(this.userData,'uniqVisits'))
            let pageViews = (['페이지뷰']).concat(_.pluck(this.userData,'pageViews'))
            let visits = (['방문자']).concat(_.pluck(this.userData,'visits'))
            let dateArr = (['x']).concat(_.pluck(this.userData,'date'))

            chartData = [dateArr, uniqVists, pageViews, visits]

            var chart = c3.generate({
                bindto:'.kt-dashboard-user .user-chart',
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
        getMenu:function(){
            var toDate   = moment().format('YYYY-MM-DD');
            var duration = moment.duration(5,'week');
            var fromDate = ( (moment()).subtract(duration) ).format('YYYY-MM-DD')

            Model.getMenu({
                'fromDate' : fromDate,
                'toDate' : toDate,
                'success' : Function.prototype.bind.call(this.getMenuSuccess,this),
                'error' : Function.prototype.bind.call(this.getMenuError,this)
            })
        },
        getMenuSuccess:function(data, textStatus, jqXHR){
            if(jqXHR.status === 200 && textStatus === 'success'){
                this.menuData = data.list;
                this.areaIndex = 0;
                this.menuIndex = 0;
                this.selectMenuData = this.menuData[this.areaIndex].menuList[this.menuIndex]
                _.each(this.selectMenuData.dataList, function(obj){
                    _.extend(obj,{ 'total': obj.ios + obj.android })
                })
                this.setMenuAreaSelectbox();
                this.setMenuSelectBox()
                this.setMenuTable();
                this.setMenuChart();
            }

        },
        getMenuError:function(jsXHR, textStatus, errorThrown){
            if(textStatus === 'error'){
                switch(jsXHR.status){
                    case 403:
                        alert('토큰이 만료 되었습니다.')
                        store.remove('auth');
                        window.location.href="#login";
                    break;
                    case 0:
                        alert('에러가 발생 했습니다.');
                        store.remove('auth');
                        window.location.href="/";
                    break;
                }
            }kt-menu-selectbox-tpl

        },

        setMenuAreaSelectbox:function(){
            this.areaArr = _.map(this.menuData, function( areaObj, areaIndex){
                return {
                    'name' : areaObj.area,
                    'index' : areaIndex ,
                    'list' : _.map( areaObj.menuList, function( menuObj, menuIndex){
                        return {'name':menuObj.menuName, 'index':menuIndex }
                    })
                }
            });

            var template = Handlebars.compile(this.selectboxTpl);
            this.$el.find('.kt-dashboard-menu .panel-title').after(template( {'className':'kt_area_name_option','list':this.areaArr} ));
        },
        setMenuSelectBox:function(){

            if(this.$el.find('.kt-dashboard-menu .kt_menu_name_option').length > 0){
                this.$el.find('.kt-dashboard-menu .kt_menu_name_option').remove();
            }

            var obj = {'className':'kt_menu_name_option','list':this.areaArr[this.areaIndex].list}
            var template = Handlebars.compile(this.selectboxTpl);
            this.$el.find('.kt-dashboard-menu .kt_area_name_option').after(template(obj));
        },

        onChangeArea:function(e){
            this.areaIndex = $(e.currentTarget).val();
            this.menuIndex = 0;
            this.selectMenuData = this.menuData[this.areaIndex].menuList[this.menuIndex]
            _.each(this.selectMenuData.dataList, function(obj){
                _.extend(obj,{ 'total': obj.ios + obj.android })
            })
            this.setMenuSelectBox()
            this.setMenuTable();
            this.setMenuChart();
        },

        onChangeMenu:function(e){
            this.menuIndex = $(e.currentTarget).val();
            this.selectMenuData = this.menuData[this.areaIndex].menuList[this.menuIndex]
            _.each(this.selectMenuData.dataList, function(obj){
                _.extend(obj,{ 'total': obj.ios + obj.android })
            })
            this.setMenuTable();
            this.setMenuChart();
        },

        setMenuTable:function(){
            if(this.$el.find('.kt-dashboard-menu .menu-table').children().length > 0){
                this.$el.find('.kt-dashboard-menu .menu-table').empty();
            }

            var template = Handlebars.compile(this.menuTableTpl);
            this.$el.find('.kt-dashboard-menu .menu-table').html(template( {'list':this.selectMenuData} ));
        },

        setMenuChart:function(){
            let chartData = null;

            let ios = (['ios']).concat(_.pluck(this.selectMenuData.dataList,'ios'));
            let android = (['android']).concat(_.pluck(this.selectMenuData.dataList,'android'));
            let total = (['total']).concat(_.pluck(this.selectMenuData.dataList,'total'));
            let dateArr = (['x']).concat(_.pluck(this.selectMenuData.dataList,'date'));

            chartData = [dateArr, ios, android, total]

            var chart = c3.generate({
                bindto:'.kt-dashboard-menu .menu-chart',
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

        hide : function(){
            this.$el.addClass('displayNone');
        },
        show : function(){
            this.$el.removeClass('displayNone');
        }
 	}))

})
