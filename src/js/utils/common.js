(function(){
	window.KT = window.KT || {};

	switch(location.hostname){
		case 'localhost':
			KT.LOGIN_HOST = 'https://cms.membership.kt.com'//'http://192.168.6.1:8000'
			KT.HOST = 'https://cms.membership.kt.com'//'http://192.168.6.1:8000'
		break;
		case 'cms.membership.kt.com':
			KT.LOGIN_HOST = ''
			KT.HOST = ''
		break;
	}
})();

(function(KT){
	KT.util = {};

	_.extend(KT.util,{

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
