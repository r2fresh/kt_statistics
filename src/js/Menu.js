define([
   'module',
   'text!tpl/menu.html',
   ],
   function(module, Menu){

	'use strict'

 	module.exports = new (Backbone.View.extend({

        render:function(){

            this.setElement('#kt_menu');
            if(this.$el.children().length === 0){
                this.$el.html(Menu);
            }

            this.$el.find('#datetimepicker20').datetimepicker({
                viewMode: 'days',
                format: 'DD/MM/YYYY'
            });

            this.$el.find('#datetimepicker21').datetimepicker({
                viewMode: 'days',
                format: 'DD/MM/YYYY'
            });

            this.$el.find('#example').DataTable({
                "ordering" : false,
                "info" : false,
                'filter' : false,
                'lengthChange' : false
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
