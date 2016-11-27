requirejs.config({
	baseUrl: './',
	paths: {
		'text':'lib/text/text',
		'tpl':'template'
	}
})

requirejs([
	'js/Login',
	'js/User',
],
function(Login, User){

	var prevView = null, routers = null;

	/**
	 * 초기 실행 함수
	 */
	function init(){
		var app, appName, hash = KT.util.parseHash();

		routeStart();
		if(hash) {
			routers.navigate(hash.join('/'), { trigger: false, replace: true });
		} else {
			routers.navigate('', { trigger: true, replace: true });
		}
	}

	/**
	 * hash를 사용하여 페이지 전환 설정
	 */
	function routeStart(){
		window.router = routers = new (Backbone.Router.extend());
		routers.route('','defaultGuide', changeHash);
		routers.route('*guideType', 'changeGuide', changeHash);
		Backbone.history.start({pushstate:true})
	}

	/**
	 * #의 router가 변경되면 처음에 실행 되는 함수
	 * @param {String} guideType 		선택된 가이드
	 */
	function changeHash( guideType){
		if(prevView != null){
			prevView.hide();
		}

		switch(guideType){
			case 'login' :
				Login.render();
				prevView = Login;
				Login.show();
			break;
			case 'user' :
				User.render();
				prevView = User;
				User.show();
			break;
			default :
				Login.render();
				prevView = Login;
				Login.show();
			break;
		}
	}

	init();

})
