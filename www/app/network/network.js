(function(){
	'use strict';
	angular.module('rateMyData').factory('networkPerformance', ['$filter', '$http', '$q', '$timeout', '$ionicPlatform', '$ionicLoading', '$cordovaNetwork', '$cordovaGeolocation', 'settings', 'networkHistory', networkPerformance]);
	function networkPerformance($filter, $http, $q, $timeout, $ionicPlatform, $ionicLoading, $cordovaNetwork, $cordovaGeolocation, settings, networkHistory){
	
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

		// return the connection type
		function cordovaNetwork() {
	    var q = $q.defer();
	    if(settings.DEVMODE())
	    	q.resolve('wifi');
	    //$ionicPlatform.ready(function () {
	    else
	    	q.resolve($cordovaNetwork.getNetwork());
	    //});
	    return q.promise;
	  };

	  // return if online
	  function isOnline(){
	  	var q = $q.defer();
			if(settings.DEVMODE())
	    	q.resolve(true);
	    else
	    	q.resolve($cordovaNetwork.isOnline());
	    return q.promise;
	  }

		function currentPosition(){
			var deferred = $q.defer();
			if(settings.DEVMODE()){
				console.log('Getting mocked geo...');
				// make it look like I took a random stroll around town
				var latVariation = Math.floor(Math.random() * 9999) + 1  ;
				var longVariation = Math.floor(Math.random() * 99999) + 1  ;
				var mockPosition = {coords:{latitude: 27.80+''+latVariation, longitude: -82.7+''+longVariation}};
				console.log('Mocked geo: ', mockPosition);
				deferred.resolve(mockPosition);
			}
			else{
				console.log('Getting Cordova geo...');
				$cordovaGeolocation.getCurrentPosition().then(function(cordovaPosition){
					console.log('Cordova geo: ');
					console.log(cordovaPosition);
					deferred.resolve(cordovaPosition);					
				}, function(err){
					console.log('error getting cordova geo: ', err);
				});				

			}
			return deferred.promise;
		};

		var connection = {};

		function decoratePosition(data, location){
    	console.log(location);
			var lat  = location.coords.latitude;
      var long = location.coords.longitude;
			console.log(lat+','+long);							
			_.extend(data, {latitude:lat, longitude:long});
		}

    // returns ms to download a given url object
    function pingDownload(netData) {
			var tStart = new Date();
			var deferred = $q.defer();
			$ionicLoading.show({template: 'Hold on a sec...'});

			var FILE_SIZE = settings.downloadSize()*1000; //TODO- make an customizable option?
			// TODO - still need a reliable download source, Netflix does a hash of the unixtime, along with some secret value, 
			// (The links expire)
			var tempNetflix = 'https://ipv4_1-cxl0-c173.1.mia003.ix.nflxvideo.net/speedtest/range/0-26214400?c=us&n=17406&v=3&e=1470934894&t=xU2A-TcwBXHsBHKUX-3pCo6-3Yk';
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
            var results = {'id': tEnd.getTime(), 'network': netData, 'elapsed':elapsed, 'size':FILE_SIZE/1000, 'rate': Math.round((FILE_SIZE/(elapsed/1000))/1000)};
            //decorate with current position
            currentPosition().then(function(location){
            	decoratePosition(results, location);

							// add the point to the history
	            networkHistory.addPoint(results);
							$ionicLoading.hide();
							deferred.resolve(results);            	
            })
            // returns rate in Kbps

					})
				.error(function(err){
					// Same as success only we set rate as 0
					//console.log('Error with test download: ', err);
					var results = {'id': new Date().getTime(), 'network': netData, 'elapsed':-1, 'size':FILE_SIZE/1000, 'rate': 0};
            currentPosition().then(function(location){
	          	decoratePosition(results, location);
  		        networkHistory.addPoint(results);
							$ionicLoading.hide();
							deferred.reject();
					 })
				});
			return deferred.promise;
    }


		return {
			ping: pingDownload,
			getNetwork: cordovaNetwork,
			isOnline: isOnline,
			currentPosition: currentPosition
		}
	}
})();