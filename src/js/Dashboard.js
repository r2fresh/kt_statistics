define([
   'module',
   'text!tpl/dashboard.html',
   'text!tpl/template.html',
   'utils/r2Alert',
   'utils/r2Loading',
   'Model',
   'Handlebars',
   'c3',
   'store',
   'moment',
   'datetimepicker'
   ],
   function(module, Dashboard, Template, R2Alert, R2Loading, Model, Handlebars, c3, store, moment, datetimepicker){

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

                this.dayUserListTpl     = $(Template).find('.day-user-list-tpl').html();
                this.menuTableTpl       = $(Template).find('.kt-menu-table-tpl').html();
                this.actionTableTpl     = $(Template).find('.kt-action-table-tpl').html();
                this.selectboxTpl       = $(Template).find('.kt-selectbox-tpl').html();
            }

            this.getUser();
        },
        getUser:function(){

            R2Loading.render({'msg':'방문자별 데이터를\n불러오는 중입니다.','w':300})

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

            R2Loading.allDestroy();

            if(jqXHR.status === 200 && textStatus === 'success'){
                this.userData = data;
                this.setUserTable();
                this.setUserChart();

                this.getMenu();
            }
        },
        getUserError:function(jsXHR, textStatus, errorThrown){

            R2Loading.allDestroy();

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
            var template = Handlebars.compile(this.dayUserListTpl);
            this.$el.find('.kt-dashboard-user .user-table').html(template({'userList':this.userData}));
        },
        setUserChart:function(){
            var chartData = null;

            var uniqVists = (['고유방문자']).concat(_.pluck(this.userData,'uniqVisits'))
            var pageViews = (['페이지뷰']).concat(_.pluck(this.userData,'pageViews'))
            var visits = (['방문자']).concat(_.pluck(this.userData,'visits'))
            var dateArr = (['x']).concat(_.pluck(this.userData,'date'))

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

            R2Loading.render({'msg':'메뉴별 데이터를\n불러오는 중입니다.','w':300})

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

            R2Loading.allDestroy();

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

                this.getActionName();
            }

        },
        getMenuError:function(jsXHR, textStatus, errorThrown){

            R2Loading.allDestroy();

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
            var chartData = null;

            var ios = (['ios']).concat(_.pluck(this.selectMenuData.dataList,'ios'));
            var android = (['android']).concat(_.pluck(this.selectMenuData.dataList,'android'));
            var total = (['total']).concat(_.pluck(this.selectMenuData.dataList,'total'));
            var dateArr = (['x']).concat(_.pluck(this.selectMenuData.dataList,'date'));

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

            R2Loading.render({'msg':'서비스별 카테고리 데이터\n불러오는 중입니다.','w':300})

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
        getActionNameError : function(jsXHR, textStatus, errorThrown){

            R2Loading.allDestroy();

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

            R2Loading.render({'msg':'서비스별 데이터를\n불러오는 중입니다.','w':300})

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

            R2Loading.allDestroy();

            if(jqXHR.status === 200 && textStatus === 'success'){
                this.setActionData(data);
            }
        },

        getActionError : function(jsXHR, textStatus, errorThrown){

            R2Loading.allDestroy();

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
            var propsChange = _.map(data,function(value, key){
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
            var chartData = null;

            var ios = (['ios']).concat(_.pluck(this.actionData,'ios'));
            var android = (['android']).concat(_.pluck(this.actionData,'android'));
            var dateArr = (['x']).concat(_.pluck(this.actionData,'date'));

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
