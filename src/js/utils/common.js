/*
 * kt-membership-statistics-service 1.0.0
 * 방문자, 메뉴, 서비스 별로 다양한 통계 데이터와 차트
 * https://cms.membership.kt.com
 * Copyright ©2011 - 2017 KT corp. All rights reserved.
*/
(function(){
	window.KT = window.KT || {};

	switch(location.hostname){
		case 'localhost':
			KT.HOST = 'https://cms.membership.kt.com';
		break;
		case 'cms.membership.kt.com':
			KT.HOST = ''
		break;
	}
})();

(function(KT){
	KT.util = {};

	Object.assign(KT.util,{

		parseHash : function(){
			var hash;

			if(!location.hash.length){
				return null;
			}

			hash = location.hash.split('/');

			hash[0] = hash[0].replace('#','');

			return hash;
		},

		millisecondToTime:function(s){
			var ms = s % 1000;
			s = (s - ms) / 1000;
			var secs = s % 60;
			s = (s - secs) / 60;
			var mins = s % 60;
			var hrs = (s - mins) / 60;

			return hrs + '시간 ' + mins + '분 ' + secs + '초';
		}

	})
})(KT);
