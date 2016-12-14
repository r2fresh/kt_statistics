define([
   'module',
   'text!tpl/dashboard.html'
   ],
   function(module, Dashboard){

	'use strict'

 	module.exports = new (Backbone.View.extend({

        render:function(mainMenu){

            this.setElement('.dashboard');
            if(this.$el.children().length === 0){
                this.$el.html(Dashboard);

                var chart = c3.generate({
                    bindto:'#chart_3',
                    data: {
                        x: 'x',
                        columns: [
                            ['x', '01-01', '01-01', '01-01', '01-01', '01-01', '01-01','02-01'],
                            ['sample', 30, 200, 100, 400, 150, 250, 30]
                        ]
                    }
                });

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
