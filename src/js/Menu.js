/*
 * kt-membership-statistics-service 1.0.0
 * 방문자, 메뉴, 서비스 별로 다양한 통계 데이터와 차트
 * https://cms.membership.kt.com
 * Copyright ©2011 - 2017 KT corp. All rights reserved.
*/
define([
   'module',
   'text!tpl/menu.html',
   'text!tpl/template.html',
   'utils/r2Loading',
   'Model',
   'Handlebars',
   'c3',
   'store',
   'moment',
   'datetimepicker',
   'Utils',
   'moment/locale/ko'
   ],
   function(module, Menu, Template, R2Loading, Model, Handlebars, c3, store, moment, datetimepicker, Utils){

	'use strict'

 	module.exports = new (Backbone.View.extend({

        dateTimePickerTpl : '',
        selectboxTpl: '',
        menuListTpl:'',
        areaArr:null,
        areaIndex : 0,
        menuIndex : 0,
        menuAllData : null,
        events :{
            'click .kt-menu-csv-btn': 'onCVSClickHanlder',
            'click .kt-menu-serarch-btn': 'onSearchHanlder',
            'change  .kt-area-name-option': 'onChangeArea',
            'change  .kt-menu-name-option': 'onChangeMenu',
            'click .kt-menu-table-btn': 'onClickHandlerTable',
            'click .kt-menu-chart-btn': 'onClickHandlerChart'
 		},

        render:function(){

            this.setElement('.kt-menu');
            if(this.$el.children().length === 0){
                this.$el.html(Menu);

                this.selectboxTpl       = $(Template).find('.kt-selectbox-tpl').html();
                this.menuTableTpl       = $(Template).find('.kt-menu-table-tpl').html();
                this.dateTimePickerTpl  = $(Template).find('.kt-dateTimePicker-tpl').html();
            }

            this.setDateTimePicker();
            this.getMenu();

        },

        /**
        * DateTimePicker rendering 및 setting
        */
        setDateTimePicker:function(){

            var template = Handlebars.compile(this.dateTimePickerTpl);
            this.$el.find('.kt-menu-option .kt-menu-serarch-btn').before(template({'dateTimePickerId':'fromDate'}));
            this.$el.find('.kt-menu-option .kt-menu-serarch-btn').before(template({'dateTimePickerId':'toDate'}));

            var dateTimePickerOption = {
                viewMode : 'days',
                format : 'YYYY-MM-DD',
                ignoreReadonly: true,
                locale :moment.locale('ko'),
            }

            this.$el.find('.fromDate').datetimepicker( _.extend(dateTimePickerOption,{'defaultDate':this.getStartDate()}) )
            this.$el.find('.toDate').datetimepicker( _.extend(dateTimePickerOption,{'defaultDate':this.getEndDate()}) )
        },

        getMenu:function(){

            R2Loading.render({'msg':'메뉴별 데이터를\n불러오는 중입니다.','w':300})

            Model.getMenu({
                'fromDate' : this.getStartDate(),
                'toDate' : this.getEndDate(),
                'success' : Function.prototype.bind.call(this.getMenuSuccess,this),
                'error' : Function.prototype.bind.call(this.getMenuError,this)
            })
        },

        getMenuSuccess:function(data, textStatus, jqXHR){

            R2Loading.allDestroy();

            if(jqXHR.status === 200 && textStatus === 'success'){

                this.menuAllData = data.list;
                this.areaIndex = 0;
                this.menuIndex = 0;
                this.setCategory();
                this.setAreaSelectBox()
                this.setMenuTable();
                this.setMenuImage();
                this.setMenuChart();
            }
        },

        getMenuError:function(jsXHR, textStatus, errorThrown){

            R2Loading.allDestroy();

            if(textStatus === 'error'){
                if(jsXHR.status === 403) {
                    alert('토큰이 만료 되었습니다.')
                    store.remove('auth');
                    window.location.href="#login";
                }
            }
        },

        setCategory:function(){
            this.areaArr = _.map(this.menuAllData, function( areaObj, areaIndex){
                return {
                    'name' : areaObj.area,
                    'list' : _.map( areaObj.menuList, function( menuObj, menuIndex){
                        return {'name':menuObj.menuName, 'index':menuIndex }
                    })
                }
            });
        },

        setAreaSelectBox:function(){

            if(this.$el.find('.kt-area-name-option').length > 0){
                this.$el.find('.kt-area-name-option').remove();
            }

            var template = Handlebars.compile(this.selectboxTpl);
            this.$el.find('.kt-menu-control').append(template( {'className':'kt-area-name-option','list':this.areaArr} ));

            this.setMenuSelectBox()

        },

        setMenuSelectBox:function(){

            if(this.$el.find('.kt-menu-name-option').length > 0){
                this.$el.find('.kt-menu-name-option').remove();
            }

            var obj = {'className':'kt-menu-name-option','list':this.areaArr[this.areaIndex].list}
            var template = Handlebars.compile(this.selectboxTpl);
            this.$el.find('.kt-menu-control').append(template(obj));

        },

        setMenuTable:function(){

            this.menuData = this.menuAllData[this.areaIndex].menuList[this.menuIndex];

            _.each(this.menuData.dataList, function(obj){
                _.extend(obj,{ 'total': obj.ios + obj.android })
            })

            var template = Handlebars.compile(this.menuTableTpl);
            this.$el.find('.kt-menu-table').html(template( {'list':this.menuData} ));

            this.$el.find('.kt-menu-table table').DataTable({
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

        setMenuChart:function(){

            var ios     = (['ios']).concat(_.pluck(this.menuData.dataList,'ios'))
            ,android    = (['android']).concat(_.pluck(this.menuData.dataList,'android'))
            ,total      = (['total']).concat(_.pluck(this.menuData.dataList,'total'))
            ,dateArr    = (['x']).concat(_.pluck(this.menuData.dataList,'date'))
            ,chartData  = [dateArr, ios, android, total];

            this.menuChart = c3.generate({
                bindto:'.kt-menu-chart',
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

        onSearchHanlder:function(e){
            this.getMenu();
        },

        onClickHandlerTable:function(e){
            e.preventDefault();

            var $btn = $(e.currentTarget);

            if($btn.data('type') === 'default'){
                this.$el.find('.kt-menu-table').removeClass('displayNone');
                $btn.data('type','success');
                $btn.removeClass('btn-default').addClass('btn-success');
            } else {
                this.$el.find('.kt-menu-table').addClass('displayNone');
                $btn.data('type','default');
                $btn.removeClass('btn-success').addClass('btn-default');
            }
        },
        onClickHandlerChart:function(e){
            e.preventDefault();

            var $btn = $(e.currentTarget);

            if($btn.data('type') === 'default'){
                this.$el.find('.kt-menu-chart-panel').removeClass('displayNone');
                $btn.data('type','info');
                $btn.removeClass('btn-default').addClass('btn-info');

                this.menuChart.resize();
            } else {
                this.$el.find('.kt-menu-chart-panel').addClass('displayNone');
                $btn.data('type','default');
                $btn.removeClass('btn-info').addClass('btn-default');
            }
        },

        /**
        * 검색 시작 일 가져오기
        */
        getStartDate:function(){
            var date = this.$el.find('.kt-menu-option .fromDate input').val();
            return ( date === '' ) ? moment().format('YYYY-MM-') + '01' : date;
        },

        /**
        * 검색 끝 일 가져오기
        */
        getEndDate:function(){
            var date = this.$el.find('.kt-menu-option .toDate input').val();
            return ( date === '' ) ? moment().format('YYYY-MM-DD') : date;
        },

        setMenuImage:function(){

            this.$el.find('.kt-menu-control .kt-menu-image').remove();

            if(this.menuData.image !== ''){
                this.$el.find('.kt-menu-control').append('<img class="kt-menu-image" src="' + this.menuData.image + '" style="width:100px;"/>')
            }

        },

        onChangeArea:function(e){

            this.areaIndex = $(e.currentTarget).find('option').index( $(e.currentTarget).find('option:selected'))

            this.menuIndex = 0;

            this.setMenuSelectBox()
            this.setMenuTable();
            this.setMenuImage();
            this.setMenuChart();
        },

        onChangeMenu:function(e){

            this.menuIndex = $(e.currentTarget).find('option').index( $(e.currentTarget).find('option:selected'))

            this.setMenuTable();
            this.setMenuImage();
            this.setMenuChart();
        },

        onCVSClickHanlder:function(){
            var unionDateArr = this.getCVSUnionDate(this.menuAllData);
            var CVSData = this.getCVSData(unionDateArr, this.menuAllData)
            Utils.makeCVS(CVSData,"서비스별 통계", true)
        },

        getCVSUnionDate:function(menuAllData){
            var dateArr = [];
            _.each( menuAllData, function(obj){
                _.each( obj.menuList, function(menuObj){
                    _.each( menuObj.dataList, function(dataObj){
                        dateArr.push(dataObj.date);
                    })
                })
            })
            return _.uniq(dateArr);
        },

        getCVSData:function(unionDateArr, menuAllData){
            var CVSData = [];
            _.each( menuAllData, function(menuData){
                _.each( menuData.menuList, function(menuObj){
                    var pageData = {'페이지명':menuObj.menuName};
                    _.each( unionDateArr , function(dateValue){
                        pageData[dateValue] = 0;
                        _.each( menuObj.dataList, function(dataObj){
                            if(dateValue === dataObj.date) {
                                pageData[dateValue] = dataObj.android + dataObj.ios
                            }
                        })
                    })
                    CVSData.push(pageData)
                    pageData = null;
                })
            })

            return CVSData;
        },

        hide : function(){
            this.$el.addClass('displayNone');
        },
        show : function(){
            this.$el.removeClass('displayNone');
        }
 	}))

})
