(function(){
	'use strict';
	angular.module('rateMyData').factory('networkHistory', ['$rootScope', '$q', 'DSCacheFactory', '$cordovaGeolocation', networkHistory]);
	function networkHistory($rootScope, $q, DSCacheFactory, $cordovaGeolocation){
		var vm = this;

 		self.historyCache = DSCacheFactory.get('historyCache');
		vm.historyPoints = _.values(self.historyCache.get('history'));

		// _.each(data, function(point){
		// 	console.log(point);
		// 	vm.markers.push(point);
		// });

		// decorate with lat/long, add to historyCache, broadcast new point for marker onclick mapping
		function addDataPoint(data){
			var posOptions = {timeout: 5000, enableHighAccuracy: true};

			vm.getCurrentPosition(posOptions).then(function(position){
				//console.log(position);
				var lat  = position.coords.latitude;
	      var long = position.coords.longitude;
	      var title = 'time- ' + data.id;
				//console.log(lat+','+long);
				
				_.extend(data, {title: title, latitude:lat, longitude:long});
				
				// This works - example of adding custom icon to a marker (assign each a reference to differently colored icon)
				// var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
				// _.extend(data, {icon: image});
				// _.extend(data, {options: { title: ''+data.rate+' Kbps' }});

				// TODO - I'd prefer not to store all the stuff like icon & title, those should be derived from
				// the data at map creation time instead
				
				if(vm.historyPoints==null)
					vm.historyPoints = data;
				//vm.historyPoints.something = new Date().getTime();
				vm.historyPoints.push(data);

				// this was necessary to communicate the new point to the controller to map the new marker's onclick
				$rootScope.$emit('newPoint', data);

				self.historyCache.put('history', vm.historyPoints);	
			}, function(err) {
      console.log('error:',err);
    });

		};

		// mock function to mimic some local movement
		// TODO replace with $cordovaGeolocation.getCurrentPosition, seems mocks isn't wotking
		vm.getCurrentPosition = function(){
			var deferred = $q.defer();
			// make it look like I took a random stroll around town
			var latVariation = Math.floor(Math.random() * 9999) + 1  ;
			var longVariation = Math.floor(Math.random() * 99999) + 1  ;
			var pos = {coords:{latitude: 27.80+''+latVariation, longitude: -82.7+''+longVariation}};
			deferred.resolve(pos);
			return deferred.promise;
		};

		function getHistoryPoints(){
			//console.log('getting history points');
			var deferred = $q.defer();
			//var historyPoints = self.historyCache.get('history');
			console.log(vm.historyPoints);
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
			clearLocal: clearLocal
		}
	}
})();