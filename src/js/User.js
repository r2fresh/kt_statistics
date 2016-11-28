define([
   'module',
   'text!tpl/user.html',
   ],
   function(module, User){

	'use strict'

 	module.exports = new (Backbone.View.extend({

        render:function(){

            this.setElement('#kt_user');
            if(this.$el.children().length === 0){
                this.$el.html(User);
            }

            this.$el.find('#datetimepicker10').datetimepicker({
                viewMode: 'years',
                format: 'MM/YYYY'
            });

            this.$el.find('#datetimepicker2').datetimepicker({
                viewMode: 'years',
                format: 'MM/YYYY'
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
