(function(){
	window.KT = window.KT || {};

	KT.HOST = 'http://192.168.6.1:8080'

	//Auction.basil = null;

	//Auction.io = null;
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
		}

	})
})(KT);
