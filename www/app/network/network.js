(function(){
	'use strict';
	angular.module('rateMyData').factory('networkPerformance', ['$filter', '$http', '$q', '$timeout', '$ionicLoading', '$cordovaNetwork', 'settings', networkPerformance]);
	function networkPerformance($filter, $http, $q, $timeout, $ionicLoading, $cordovaNetwork, settings){
	
		//test a simulated ping
		function pingFake(){
			var deferred = $q.defer();
			$ionicLoading.show({template: 'Hold on a sec...'});

			$timeout(function(){
				var PING_RESPONSE = 50;
				$ionicLoading.hide();
				deferred.resolve(PING_RESPONSE);
			}, 3000);
			return deferred.promise;
		};

		// return the network type
		function cordovaNetwork(){
			var deferred = $q.defer();

			var netData = $cordovaNetwork.getNetwork();
			console.log(netData);

			deferred.resolve(netData);

			return deferred.promise;
		};

		var connection = {};


    // returns ms to download a given url object
    function pingDownload(args) {
			var tStart = new Date();
			var deferred = $q.defer();
			$ionicLoading.show({template: 'Hold on a sec...'});

			var FILE_SIZE = settings.downloadSize()*1000; //TODO- make an customizable option?
			// TODO - still need a reliable download source, Netflix does a hash of the unixtime, along with some secret value, The links expire.
			var defaultURL = 'https://ipv4_1-cxl0-c257.1.dfw001.ix.nflxvideo.net/speedtest/range/0-'+FILE_SIZE+'?c=us&n=33363&v=3&e=1470427299&t=ZH33bNjnKOyje4kIBhnEnkoYMUU';

			//var defaultURL = 'http://ipv4.download.thinkbroadband.com/5MB.zip'; //getting 403 from here, but browser is OK?
			var cacheKilla = new Date().getTime();
			var url = args || defaultURL+'&foo='+cacheKilla;//+'?foo='+cacheKilla;
			console.log(url);
			$http.get(url)
				.success(function(data, status){					
						console.log('download complete');
						var tEnd = new Date();
            var elapsed = tEnd - tStart;
            // returns rate in Kbps
            var results = {'elapsed':elapsed, 'size':FILE_SIZE/1000, 'rate': (FILE_SIZE/(elapsed/1000))/1000}
						$ionicLoading.hide();
						deferred.resolve(results);
					})
				.error(function(){
					console.log('Error with test download');
					$ionicLoading.hide();
						deferred.reject();
				});
			return deferred.promise;
    }

		return {
			ping: pingDownload,
			// ping: pingFake,
			getNetwork: cordovaNetwork
		}
	}
})();