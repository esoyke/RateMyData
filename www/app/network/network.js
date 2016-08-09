(function(){
	'use strict';
	angular.module('rateMyData').factory('networkPerformance', ['$filter', '$http', '$q', '$timeout', '$ionicLoading', '$cordovaNetwork', 'settings', 'networkHistory', networkPerformance]);
	function networkPerformance($filter, $http, $q, $timeout, $ionicLoading, $cordovaNetwork, settings, networkHistory){
	
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
			//console.log(netData);

			deferred.resolve(netData);

			return deferred.promise;
		};

		var connection = {};


    // returns ms to download a given url object
    function pingDownload(netData) {
			var tStart = new Date();
			var deferred = $q.defer();
			$ionicLoading.show({template: 'Hold on a sec...'});

			var FILE_SIZE = settings.downloadSize()*1000; //TODO- make an customizable option?
			// TODO - still need a reliable download source, Netflix does a hash of the unixtime, along with some secret value, 
			// (The links expire)
			var tempNetflix = 'https://ipv4_1-cxl0-c041.1.tpa001.ix.nflxvideo.net/speedtest/range/0-26214400?c=us&n=33363&v=3&e=1470775296&t=0NLLbvmOX4teXR1M-5-b8gnU08M';
			//replace their hard-coded file size with our packet size setting
			var pos1 = tempNetflix.indexOf('/0-')+3;
			var pos2 = tempNetflix.indexOf('?');
			var defaultURL = tempNetflix.substring(0, pos1)+FILE_SIZE+tempNetflix.substring(pos2, tempNetflix.length);
			var cacheKilla = new Date().getTime();
			// var url = args || defaultURL+'&foo='+cacheKilla;//+'?foo='+cacheKilla;
			var url = defaultURL+'&foo='+cacheKilla;//+'?foo='+cacheKilla;

			console.log(url);
			$http.get(url)
				.success(function(data, status){					
						console.log('download complete');
						var tEnd = new Date();
            var elapsed = tEnd - tStart;

            // returns rate in Kbps
            var results = {'id': tEnd.getTime(), 'network': netData, 'elapsed':elapsed, 'size':FILE_SIZE/1000, 'rate': Math.round((FILE_SIZE/(elapsed/1000))/1000)};
            networkHistory.addPoint(results);
						$ionicLoading.hide();
						deferred.resolve(results);
					})
				.error(function(err){
					//console.log('Error with test download: ', err);
					var results = {'id': new Date().getTime(), 'network': netData, 'elapsed':-1, 'size':FILE_SIZE/1000, 'rate': 0};
          networkHistory.addPoint(results);
					$ionicLoading.hide();
						deferred.reject();
				});
			return deferred.promise;
    }

		return {
			ping: pingDownload,
			getNetwork: cordovaNetwork
		}
	}
})();