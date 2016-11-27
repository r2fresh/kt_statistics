requirejs.config({
	baseUrl: './',
	paths: {
		'text':'lib/text/text',
		'tpl':'template'
	}
})

requirejs([
	'js/Login',
	'js/Main',
	'js/Dashboard',
],
function(Login, Main, Dashboard){

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
        routers.route('*guideType/:main', 'changeMainMenu', changeHash);
        routers.route('*guideType/:main/:sub', 'changeSubMenu', changeHash);

		Backbone.history.start({pushstate:true})
	}

	/**
	 * #의 router가 변경되면 처음에 실행 되는 함수
	 * @param {String} guideType 		선택된 가이드
	 */
	function changeHash( guideType, main, sub){

		console.log('guideType', guideType);
		console.log('main', main);
		console.log('sub', sub)

		if(prevView != null){
			prevView.hide();
		}

		let mainMenu = guideType;
		let subMenu = main;

		switch(mainMenu){
			case 'login' :
				Login.render();
				prevView = Login;
				Login.show();
			break;
			default :
				Main.render(mainMenu);
				prevView = Main;
				Main.show();
			break;
		}
	}

	init();

})
