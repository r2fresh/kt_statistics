define([
   'module',
   'text!tpl/dashboard.html',
   'text!tpl/tableTemplate.html',
   'js/utils/r2Alert',
   'js/Model'
   ],
   function(module, Dashboard, TableTemplate, R2Alert, Model){

	'use strict'

 	module.exports = new (Backbone.View.extend({
        events :{
            'change  .kt_area_name_option': 'onChangeArea',
            'change  .kt_menu_name_option': 'onChangeMenu',
            'change  .kt_action_option': 'onChangeAction',
 		},

        render:function(mainMenu){

            this.setElement('.dashboard');

            if(this.$el.children().length === 0){
                this.$el.html(Dashboard);

                this.dayUserListTpl     = $(TableTemplate).find('.day-user-list-tpl').html();
                this.menuTableTpl       = $(TableTemplate).find('.kt-menu-table-tpl').html();
                this.actionTableTpl     = $(TableTemplate).find('.kt-action-table-tpl').html();
                this.selectboxTpl       = $(TableTemplate).find('.kt-selectbox-tpl').html();
            }

            R2.Loading.render('r2_loading','로딩중입니다.')

            this.getUser();
            //this.getMenu();
            //this.getActionName();
        },
        getUser:function(){

            var toDate   = moment().format('YYYY-MM-DD');
            var duration = moment.duration(1,'week');
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

                R2.Loading.destroy('r2_loading');
            }
        },
        getUserError:function(jsXHR, textStatus, errorThrown){
            if(textStatus === 'error'){
                switch(jsXHR.status){
                    case 403:
                        alert('토큰이 만료 되었습니다.');
                        R2.Loading.destroy('r2_loading');
                        store.remove('auth');
                        window.location.href="#login";
                    break;
                    case 0:
                        alert('에러가 발생 했습니다.');
                        R2.Loading.destroy('r2_loading');
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
            var duration = moment.duration(1,'week');
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
            this.areaIndex = $(e.currentTarget).find('option').index( $(e.currentTarget).find('option:selected'))
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
            this.menuIndex = $(e.currentTarget).find('option').index( $(e.currentTarget).find('option:selected'))
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
            var template = Handlebars.compile(this.selectboxTpl);
            this.$el.find('.kt-dashboard-action .panel-title').after(template( {'className':'kt_action_option','list':actionNameList} ));
        },
        getAction:function(){

            var toDate   = moment().format('YYYY-MM-DD');
            var duration = moment.duration(1,'week');
            var fromDate = ( (moment()).subtract(duration) ).format('YYYY-MM-DD');

            Model.getAction({
                'fromDate' : fromDate,
                'toDate' : toDate,
                'action' : this.actionName,
                'success' : Function.prototype.bind.call(this.getActionSuccess,this),
                'error' : Function.prototype.bind.call(this.getActionError,this)
            })
        },

        getActionSuccess : function(data, textStatus, jqXHR){
            if(jqXHR.status === 200 && textStatus === 'success'){
                this.setActionData(data);
            }
        },

        getActionError : function(jsXHR, textStatus, errorThrown){
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

        setActionData : function(data){
            let propsChange = _.map(data,function(value, key){
                value[value.os] = value.actions
                return _.omit(value,'actions')
            })

            var dateSortArr = _.uniq(_.map(propsChange,function(value, key){
                return value.date
            }))

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

            this.setActionTable();
            this.setActionChart();
        },
        setActionTable:function(){
            this.$el.find('.kt-dashboard-action .actino-table').empty();
            var template = Handlebars.compile(this.actionTableTpl);
            this.$el.find('.kt-dashboard-action .action-table').html(template({'actionList':this.actionData}));
        },
        setActionChart:function(){
            let chartData = null;

            let ios = (['ios']).concat(_.pluck(this.actionData,'ios'));
            let android = (['android']).concat(_.pluck(this.actionData,'android'));
            let dateArr = (['x']).concat(_.pluck(this.actionData,'date'));

            chartData = [dateArr, ios, android]

            var chart = c3.generate({
                bindto:'.kt-dashboard-action .action-chart',
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
            e.preventDefault();
            this.actionName = $(e.currentTarget).val();
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
