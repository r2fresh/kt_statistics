define([], function () {
	var data = {
		"serviceName": "membership",
		"from": "2016-08-1",
		"to": "2016-12-1",
		"menuStatisticMap":
		[
			{
				"area" : "DOWN",
				"menuList" : [
					{
					"menuName" : "DOWN",
					"dateList" : [
							{"date": "2016-11-01", "image" : "aaa1.jpg", "ios" : 11, "android" : 101},
							{"date": "2016-11-15", "image" : "aaa2.jpg", "ios" : 12, "android" : 102},
							{"date": "2016-12-18", "image" : "aaa3.jpg", "ios" : 13, "android" : 103}
						]
					},
					{
					"menuName" : "DOWN/단말&액세서리 할인",
						"dateList" : [
							{"date": "2016-11-05", "image" : "bbb1.jpg", "ios" : 14, "android" : 104},
							{"date": "2016-11-15", "image" : "bbb2.jpg", "ios" : 15, "android" : 105},
							{"date": "2016-12-20", "image" : "bbb3.jpg", "ios" : 16, "android" : 106}
						]
					}
				]
			},
			{
			   "area" : "FREE",
			   "menuList" : [
				   {
				   "menuName" : "FREE",
				   "dateList" : [
						   {"date": "2016-11-10", "image" : "ccc1.jpg", "ios" : 17, "android" : 107},
						   {"date": "2016-11-05", "image" : "ccc2.jpg", "ios" : 18, "android" : 108},
						   {"date": "2016-12-20", "image" : "ccc3.jpg", "ios" : 19, "android" : 109}
					   ]
				   },
				   {
				   "menuName" : "FREE/글로벌 FREE",
					   "dateList" : [
						   {"date": "2016-11-03", "image" : "ddd1.jpg", "ios" : 20, "android" : 110},
						   {"date": "2016-11-05", "image" : "ddd2.jpg", "ios" : 21, "android" : 111},
						   {"date": "2016-12-18", "image" : "ddd3.jpg", "ios" : 22, "android" : 112}
					   ]
				   }
			   ]
			},
		]
	}

	return data
});

// define([], function () {
// 	var data = {
// 		"serviceName": "membership",
// 		"from": "2016-08-1",
// 		"to": "2016-12-1",
// 		"menuStatisticMap":
// 		[
// 			{"menuName":"DOWN", "date": "2016-11-01", "image" : "aaa1.jpg", "ios" : 11, "android" : 101},
// 			{"menuName":"DOWN", "date": "2016-11-15", "image" : "aaa2.jpg", "ios" : 12, "android" : 102},
// 			{"menuName":"DOWN", "date": "2016-12-18", "image" : "aaa3.jpg", "ios" : 13, "android" : 103},
// 			{"menuName":"DOWN/단말&액세서리 할인", "date": "2016-11-05", "image" : "bbb1.jpg", "ios" : 14, "android" : 104},
// 			{"menuName":"DOWN/단말&액세서리 할인", "date": "2016-11-15", "image" : "bbb2.jpg", "ios" : 15, "android" : 105},
// 			{"menuName":"DOWN/단말&액세서리 할인", "date": "2016-12-20", "image" : "bbb3.jpg", "ios" : 16, "android" : 106},
// 			{"menuName":"FREE", "date": "2016-11-10", "image" : "ccc1.jpg", "ios" : 17, "android" : 107},
// 			{"menuName":"FREE", "date": "2016-11-05", "image" : "ccc2.jpg", "ios" : 18, "android" : 108},
// 			{"menuName":"FREE", "date": "2016-12-20", "image" : "ccc3.jpg", "ios" : 19, "android" : 109},
// 			{"menuName":"FREE/글로벌 FREE", "date": "2016-11-03", "image" : "ddd1.jpg", "ios" : 20, "android" : 110},
// 			{"menuName":"FREE/글로벌 FREE", "date": "2016-11-05", "image" : "ddd2.jpg", "ios" : 21, "android" : 111},
// 			{"menuName":"FREE/글로벌 FREE", "date": "2016-12-18", "image" : "ddd3.jpg", "ios" : 22, "android" : 112}
// 		]
// 	}
//
// 	return data
// });
