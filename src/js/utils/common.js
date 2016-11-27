(function(){
	window.KT = window.KT || {};

	//Auction.HOST = 'http://14.32.174.222:8080'
	//Auction.HOST = ''

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
