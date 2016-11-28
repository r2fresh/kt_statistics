define(function(require, exports, module){

	function postLogin(data){
		$.ajax(data);
	}

	module.exports = new (Backbone.Model.extend({
		postLogin:postLogin,

	}))

})
