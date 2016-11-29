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

		console.log("1234")

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

		// 로그인이 되었는지 체크
		// hash가 null이 아니고, login이 아니라면
		// localstorage의 auth 객체를 확인 해서 토근이 존재하는지 확인
		// 없으면 login 페이지로 전환하고 아니면 패스
		if(!(KT.util.parseHash() !== null && KT.util.parseHash()[0] === 'login')){
			if(store.get('auth') === undefined){
				window.location.href="#login"
				return;
			}
		}

		if(prevView != null){
			prevView.hide();
		}

		let mainMenu = guideType;
		let subMenu = main;

		switch(mainMenu){
			case 'login' :
				$('body').css({'background-color':'#2D3E4F'})
				Login.render();
				prevView = Login;
				Login.show();
			break;
			case 'user' :
			case 'menu' :
			case 'action' :
			case null :
				$('body').css({'background-color':'#FFFFFF'})
				Main.render(mainMenu);
				prevView = Main;
				Main.show();
			break
			default :
				// 지정된 hash로 접근하면 dashboard로 리다이렉트
				window.location.href="/"
			break;
		}
	}

	function onChangeBodyColor(){

	}

	init();



})
