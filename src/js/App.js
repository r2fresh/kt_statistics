requirejs.config({
	baseUrl: '/js',
	paths: {
		text:'../lib/text/text',
		tpl:'../template',
		jquery:'../lib/jquery/dist/jquery',
		Handlebars:'../lib/handlebars/handlebars',
		d3:'../lib/d3/d3',
		c3:'../lib/c3/c3',
		store:'../lib/store-js/store',
		numeral:'../lib/numeral/numeral',
		moment:'../lib/moment/moment',
		ko:'../lib/moment/locale/ko',
		datetimepicker:'../lib/eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker',
		underscore:'../lib/underscore/underscore',
		backbone:'../lib/backbone/backbone',
		'datatables.net':'../lib/datatables/media/js/jquery.dataTables',
		'dataTable':'../lib/datatables/media/js/dataTables.bootstrap',
		'r2Common':'utils/r2Common',
		'common':'utils/common',
	},
	shim:{
        'c3':{
            deps: ['d3'], //angular가 로드되기 전에 jquery가 로드 되어야 한다.
            exports:'c3' //로드된 angular 라이브러리는 angular 라는 이름의 객체로 사용할 수 있게 해준다
        },
		'datetimepicker':{
			deps:['moment','jquery'],
			exports:'datetimepicker'
		},
		'backbone':{
			deps:['underscore'],
			exports:'Backbone'
		},
		'dataTable':{
			deps:['datatables.net'],
			exports:'dataTable'
		},
    }
});

requirejs([
	'Login',
	'Main',
	'Dashboard',
	'Handlebars',
	'store',
	'numeral',
	'backbone',
	'dataTable',
	'r2Common',
	'common'
],
function(Login, Main, Dashboard, Handlebars, store, numeral, Backbone){

	var prevView = null, routers = null;

	/**
	 * 초기 실행함수
	 */
	function init(){
		setHandlebars();
		routeStart();
		startRouter();
	}

	/**
	*
	*/
	function setHandlebars(){
		Handlebars.registerHelper( 'capitalize', function(str){
			return KT.util.millisecondToTime( parseInt(str,10) )
		});
		Handlebars.registerHelper( 'numberComma', function(str){
			return numeral( parseInt(str,10) ).format('0,0')
		});
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
	 * 처음 라우터 설정
	 */
	function startRouter(){
		var hash = KT.util.parseHash();

		if(hash) {
			routers.navigate(hash.join('/'), { trigger: false, replace: true });
		} else {
			routers.navigate('', { trigger: true, replace: true });
		}
	}

	/**
	 * #의 router가 변경되면 처음에 실행 되는 함수
	 * @r2fresh
	 * @param {String} guideType - 선택된 가이드
	 * @param {String} main - 선택된 가이드
	 * @param {String} sub - 선택된 가이드
	 */
	function changeHash( guideType ){

		// 로그인이 되었는지 체크
		// hash가 null이 아니고, login이 아니라면
		// localstorage의 auth 객체를 확인 해서 토근이 존재하는지 확인
		// 없으면 login 페이지로 전환하고 아니면 패스
		if(!(KT.util.parseHash() !== null && KT.util.parseHash()[0] === 'login')){
			if(store.get('auth') === undefined){
				routers.navigate('#login',{ trigger: true, replace: true })
				return;
			}
		}

		if(prevView != null){
			prevView.hide();
		}

		var mainMenu = guideType;

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
				window.location.href="#"
			break;
		}
	}
	init();
})
