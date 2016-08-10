(function(){
	'use strict';
	angular.module('rateMyData').factory('networkHistory', ['$rootScope', '$q', 'DSCacheFactory', 'settings', networkHistory]);
	function networkHistory($rootScope, $q, DSCacheFactory, settings){
		var vm = this;

 		self.historyCache = DSCacheFactory.get('historyCache');
		vm.historyPoints = _.values(self.historyCache.get('history'));

		// decorate with lat/long, add to historyCache, broadcast new point for marker onclick mapping
		function addDataPoint(data){
			var posOptions = {timeout: 5000, enableHighAccuracy: true};

			// currentPosition(posOptions).then(function(position){
			// 	console.log(data);
			// 	var lat  = position.coords.latitude;
	  //     var long = position.coords.longitude;
	  //     var title = 'time- ' + data.id;
			// 	//console.log(lat+','+long);
				
			// 	_.extend(data, {title: title, latitude:lat, longitude:long});
				

				// This works - example of adding custom icon to a marker (assign each a reference to differently colored icon)
				// var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
				// _.extend(data, {icon: image});
				// _.extend(data, {options: { title: ''+data.rate+' Kbps' }});
				if (data.rate < 1){
					 var image = 'img/circle-black.png';
					_.extend(data, {icon: image});
				}
				else if (data.rate < settings.thresholdSlow){
					 var image = 'img/circle-red.png';
					_.extend(data, {icon: image});
				}
				else if (data.rate < settings.thresholdMedium){
					 var image = 'img/circle-yellow.png';
					_.extend(data, {icon: image});
				}
				else {
					 var image = 'img/circle-green.png';
					_.extend(data, {icon: image});
				}

				// TODO - I'd prefer not to store all the stuff like icon & title, those should be derived from
				// the data at map creation time instead
				
				if(vm.historyPoints==null)
					vm.historyPoints = data;
				//vm.historyPoints.something = new Date().getTime();
				vm.historyPoints.push(data);

				// this was necessary to communicate the new point to the controller to map the new marker's onclick
				$rootScope.$emit('newPoint', data);

				self.historyCache.put('history', vm.historyPoints);	
			// }, function(err) {
   //    console.log('error:',err);
   //  });

		};

		// mock function to mimic some local movement
		// TODO replace with $cordovaGeolocation.getCurrentPosition, seems mocks isn't wotking
		// function currentPosition(){
		// 	var deferred = $q.defer();
		// 	if(settings.DEVMODE()){
		// 		console.log('Getting mocked geo...');
		// 		// make it look like I took a random stroll around town
		// 		var latVariation = Math.floor(Math.random() * 9999) + 1  ;
		// 		var longVariation = Math.floor(Math.random() * 99999) + 1  ;
		// 		var mockPosition = {coords:{latitude: 27.80+''+latVariation, longitude: -82.7+''+longVariation}};
		// 		console.log('Mocked geo: ', mockPosition);
		// 		deferred.resolve(mockPosition);
		// 	}
		// 	else{
		// 		console.log('Getting Cordova geo...');
		// 		$cordovaGeolocation.getCurrentPosition().then(function(cordovaPosition){
		// 			console.log('Cordova geo: ', cordovaPosition);
		// 			deferred.resolve(cordovaPosition);					
		// 		}, function(err){
		// 			console.log('error getting cordova geo: ', err);
		// 		});				

		// 	}
		// 	return deferred.promise;
		// };

		// returns all history points (from local cache)
		function getHistoryPoints(){
			//console.log('getting history points');
			var deferred = $q.defer();
			//var historyPoints = self.historyCache.get('history');
			//console.log(vm.historyPoints);
			deferred.resolve(vm.historyPoints);
			return deferred.promise;
		};
		
		// overwrite history localStorage cache
		function clearLocal(){
			console.log('clear local cache');
			self.historyCache.put('history', {});
			// TODO - need to remove markers from existing map
		};

		function addDataPointToServer(point){
			console.log('TODO- update server with data point');
		}

		return {
			addPoint: addDataPoint,
			getHistoryPoints: getHistoryPoints,
			clearLocal: clearLocal,
			//currentPosition: currentPosition
		}
	}
})();