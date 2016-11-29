define([
   'module',
   'text!tpl/topMenu.html'
   ],
   function(module, TopMenu){

	'use strict'

 	module.exports = new (Backbone.View.extend({
        initialize:function(){

        },
        events :{
            'click .kt_info_logout_btn' : 'onLogout',
 		},
        render:function(mainMenu){

            this.setElement('#kt_topMenu');
            if(this.$el.children().length === 0){
                this.$el.html(TopMenu);
            }

            this.setUserName();

        },
        setUserName:function(){
            let username = store.get('auth').username;
            this.$el.find('.kt_info_username strong').text(username);
        },
        onLogout:function(e){
            e.preventDefault();
            store.remove('auth');
            window.location.href="#login";
        },
        hide : function(){
            this.$el.addClass('displayNone');
        },
        show : function(){
            this.$el.removeClass('displayNone');
        }
 	}))

})
