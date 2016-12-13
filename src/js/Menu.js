define([
   'module',
   'text!tpl/menu.html',
   'text!tpl/dateTimePicker.html',
   'js/Model',
   'data/menu.js'
   ],
   function(module, Menu, DateTimePicker, Model, MenuData){

	'use strict'

 	module.exports = new (Backbone.View.extend({

        dateTimePickerTpl : '',

        menuOptionTpl: '',

        menuListTpl:'',

        areaArr:null,

        areaIndex : 0,

        menuIndex : 0,

        menuData : null,

        events :{
            'click .kt_menu_csv_btn': 'onCVSClickHanlder',
            'click .kt_menu_serarch_btn': 'onSearchHanlder',
            'change .kt_menu_option .kt_area_name_option': 'onChangeArea',
            'change .kt_menu_option .kt_menu_name_option': 'onChangeMenu',
 		},

        render:function(){

            this.setElement('#kt_menu');
            if(this.$el.children().length === 0){
                this.$el.html(Menu);

                this.dateTimePickerTpl  = DateTimePicker;

                this.menuOptionTpl = this.$el.find(".kt_menu_option_tpl").html();
                this.menuListTpl = this.$el.find(".kt_menu_list_tpl").html();


            }

            this.$el.find('#example').DataTable({
                "ordering" : false,
                "info" : false,
                'filter' : false,
                'lengthChange' : false
            });

            this.setDateTimePicker();
            this.onSearchHanlder(null);

        },

        onSearchHanlder:function(e){
            let queryData = {
                'from' : this.getStartDate(),
                'to' : this.getEndDate()
            }
            this.getMenu(queryData);
        },

        /**
        * DateTimePicker rendering 및 setting
        */
        setDateTimePicker:function(){

            var template = Handlebars.compile(this.dateTimePickerTpl);
            this.$el.find('.kt_menu_option .kt_menu_serarch_btn').before(template({'dateTimePickerId':'startDate'}));
            this.$el.find('.kt_menu_option .kt_menu_serarch_btn').before(template({'dateTimePickerId':'endDate'}));

            let dateTimePickerOption = {
                viewMode : 'days',
                format : 'YYYY-MM-DD',
                ignoreReadonly: true
            }
            this.$el.find('.startDate').datetimepicker( _.extend(dateTimePickerOption,{'defaultDate':this.getStartDate()}) )
            this.$el.find('.endDate').datetimepicker( _.extend(dateTimePickerOption,{'defaultDate':this.getEndDate()}) )
        },

        /**
        * 검색 시작 일 가져오기
        */
        getStartDate:function(){
            let date = this.$el.find('.kt_menu_option .startDate input').val();
            return ( date === '' ) ? moment().format('YYYY-MM-') + '01' : date;
        },

        /**
        * 검색 끝 일 가져오기
        */
        getEndDate:function(){
            let date = this.$el.find('.kt_menu_option .endDate input').val();
            return ( date === '' ) ? moment().format('YYYY-MM-DD') : date;
        },

        /**출
        * 메뉴별 데이터 호출
        */
        getMenu:function(queryData){

            console.log(queryData)

            //this.getMenuSuccess(MenuData);
            //return;

            var token = store.get('auth').token;

            Model.getUser({
                url: KT.HOST + '/info/membership/menu',
                data:queryData,
                method : 'GET',
                headers : {
                    'x-auth-token' : token
                },
                dataType : 'json',
                contentType:"application/json; charset=UTF-8",
                success : Function.prototype.bind.call(this.getMenuSuccess,this),
                error : Function.prototype.bind.call(this.getMenuError,this)
            })
        },
        getMenuSuccess:function(data, textStatus, jqXHR){

            console.log(data);

            this.menuData = data.list;

            this.areaIndex = 0;

            this.menuIndex = 0;

            this.setAreaSelectBox(data)

            this.setMenuList();

            // var menuDataArr = [];
            //
            // var menuKeyList = _.keys( data.menuStatisticMap );
            //
            // for(var i=0; i<menuKeyList.length; ++i){
            //
            //     var keyList = _.keys( data.menuStatisticMap[menuKeyList[i]] )
            //
            //     var list = [];
            //
            //     for(var j=0; j<keyList.length; ++j){
            //
            //         list.push( data.menuStatisticMap[menuKeyList[i]][keyList[j]] )
            //
            //     }
            //
            //     var obj = {
            //         'list' : list,
            //         'menu' : menuKeyList[i],
            //     }
            //     menuDataArr.push(obj)
            // }
            //
            // console.log( menuDataArr )

        },
        getMenuError:function(jsXHR, textStatus, errorThrown){

        },

        setAreaSelectBox:function(data){

            this.areaArr = _.map(data.list, function( areaObj, areaIndex){
                return {
                    'name' : areaObj.area,
                    'index' : areaIndex ,
                    'list' : _.map( areaObj.menuList, function( menuObj, menuIndex){
                        return {'name':menuObj.menuName, 'index':menuIndex }
                    })
                }

            });

            if(this.$el.find('.kt_area_name_option').length > 0){
                this.$el.find('.kt_area_name_option').remove();
            }

            var template = Handlebars.compile(this.menuOptionTpl);
            this.$el.find('.kt_menu_option .kt_menu_csv_btn').before(template( {'className':'kt_area_name_option','list':this.areaArr} ));

            this.setMenuSelectBox(this.areaIndex)

        },

        setMenuSelectBox:function(areaIndex){

            if(this.$el.find('.kt_menu_name_option').length > 0){
                this.$el.find('.kt_menu_name_option').remove();
            }

            var obj = {'className':'kt_menu_name_option','list':this.areaArr[areaIndex].list}
            var template = Handlebars.compile(this.menuOptionTpl);
            this.$el.find('.kt_menu_option .kt_menu_csv_btn').before(template(obj));

        },

        onChangeArea:function(e){

            this.areaIndex = $(e.currentTarget).val();

            this.menuIndex = 0;

            this.setMenuSelectBox(this.areaIndex)

            this.setMenuList();
        },

        onChangeMenu:function(e){

            this.menuIndex = $(e.currentTarget).val();

            this.setMenuList();
        },

        setMenuList:function(){

            console.log(this.$el.find('.kt_menu_list').children().length)

            if(this.$el.find('.kt_menu_list').children().length > 0){
                this.$el.find('.kt_menu_list').empty();
            }

            var obj = this.menuData[this.areaIndex].menuList[this.menuIndex];

            _.each(obj.dataList, function(obj){
                _.extend(obj,{ 'total': obj.ios + obj.android })
            })

            var template = Handlebars.compile(this.menuListTpl);
            this.$el.find('.kt_menu_list').html(template( {'list':obj} ));

            this.$el.find('#menu_list').DataTable({
                "ordering" : false,
                "info" : false,
                'filter' : false,
                'lengthChange' : false
            });
        },


















        onCVSClickHanlder:function(){

            console.log(this.menuData)

            //var test = [];

            var dateArr = []

            _.each( this.menuData, function(obj){
                _.each( obj.menuList, function(menuObj){
                    _.each( menuObj.dataList, function(dataObj){
                        dateArr.push(dataObj.date);
                    })
                })
            })

            var arr = _.union(dateArr);

            console.log(arr)

            var sss = [];

            _.each( this.menuData, function(obj){
                _.each( obj.menuList, function(menuObj){
                    //console.log(menuObj.menuName)

                    var test = {};

                    test['페이지명'] = menuObj.menuName;

                    _.each( menuObj.dataList, function(dataObj){
                        dateArr.push(dataObj.date);



                        _.each( arr , function(dateValue){

                            if(dateValue === dataObj.date) {

                                test[dateValue] = dataObj.android + dataObj.ios

                            } else {
                                test[dateValue] = 0;
                            }

                        })


                    })



                    sss.push(test)

                    test = null;

                })
            })

            console.log(sss)


            //var kkk = '[{"Vehicle":"BMW","Date":"30, Jul 2013 09:24 AM","Location":"Hauz Khas, Enclave, New Delhi, Delhi, India","Speed":42},{"Vehicle":"Honda CBR","Date":"30, Jul 2013 12:00 AM","Location":"Military Road,  West Bengal 734013,  India","Speed":0},{"Vehicle":"Supra","Date":"30, Jul 2013 07:53 AM","Location":"Sec-45, St. Angel\'s School, Gurgaon, Haryana, India","Speed":58},{"Vehicle":"Land Cruiser","Date":"30, Jul 2013 09:35 AM","Location":"DLF Phase I, Marble Market, Gurgaon, Haryana, India","Speed":83},{"Vehicle":"Suzuki Swift","Date":"30, Jul 2013 12:02 AM","Location":"Behind Central Bank RO, Ram Krishna Rd by-lane, Siliguri, West Bengal, India","Speed":0},{"Vehicle":"Honda Civic","Date":"30, Jul 2013 12:00 AM","Location":"Behind Central Bank RO, Ram Krishna Rd by-lane, Siliguri, West Bengal, India","Speed":0},{"Vehicle":"Honda Accord","Date":"30, Jul 2013 11:05 AM","Location":"DLF Phase IV, Super Mart 1, Gurgaon, Haryana, India","Speed":71}]'

            var kkk = '[{"페이지명":"DOWN","2016-12-01":100,"2016-12-02":200,"2016-12-03":200},{"페이지명":"DOWN/LTE","2016-12-01":300,"2016-12-03":400},{"페이지명":"DOWN/안녕하세요","2016-12-01":300,"2016-12-05":400}]'

            this.test(sss,"메뉴별 통계", true)

        },









        test:function(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var CSV = '';
    //Set Report title in first row or line

    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {

            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    //Generate a file name
    var fileName = "MyReport_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");

    //Initialize file format you want csv or xls
    //var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    var uri = 'data:text/csv;charset=UTF-8,\uFEFF' + encodeURI(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
},



















        hide : function(){
            this.$el.addClass('displayNone');
        },
        show : function(){
            this.$el.removeClass('displayNone');
        }
 	}))

})
