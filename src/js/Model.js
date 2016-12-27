define([
		'module',
		'store',
		'backbone'
	],
	function(module, store, Backbone){

		module.exports = new (Backbone.Model.extend({
			postLogin:function(option){
				$.ajax({
					url: KT.HOST + '/user/login',
	                method : 'POST',
	                data : JSON.stringify({'username':option.id,'password':option.pwd}),
	                dataType : 'json',
	                contentType:"application/json; charset=UTF-8",
					success : option.success,
					error : option.error,
				});
			},
			getUser:function(option){
				var token = store.get('auth').token;

				$.ajax({
					url: KT.HOST + '/info/membership/' + option.pathDateOption + '/visit',
					data:{'from':option.fromDate,'to':option.toDate},
					method : 'GET',
					headers : {
						'x-auth-token' : token
					},
					dataType : 'json',
					contentType:"application/json; charset=UTF-8",
					success : option.success,
					error : option.error,
				});
			},
			getMenu:function(option){
				var token = store.get('auth').token;

				$.ajax({
					url: KT.HOST + '/info/membership/menu',
					data: {'from':option.fromDate,'to':option.toDate},
					method : 'GET',
					headers : {
						'x-auth-token' : token
					},
					dataType : 'json',
					contentType:"application/json; charset=UTF-8",
					success : option.success,
					error : option.error,
				});
			},
			getToken:function(){
				return store.get('auth').token;
			},
			getAction:function(option){

				var token = store.get('auth').token;

				$.ajax({
	                url: KT.HOST + '/info/service/membership/action',
	                data:{'from':option.fromDate,'to':option.toDate,'action' : option.action},
	                method : 'GET',
	                headers : {
	                    'x-auth-token' : token
	                },
	                dataType : 'json',
	                contentType:"application/json; charset=UTF-8",
					success : option.success,
					error : option.error,
	            });
			},
			getActionName:function(option){

				var token = store.get('auth').token;

				$.ajax({
					url: KT.HOST + '/info/service/membership/action/list',
					method : 'GET',
					headers : {
						'x-auth-token' : token
					},
					dataType : 'json',
					contentType:"application/json; charset=UTF-8",
					success : option.success,
					error : option.error,
				});
			}
		}))
	}
)
