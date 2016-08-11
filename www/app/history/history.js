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
				// console.log('settings.thresholdMedium(): ',settings.thresholdMedium());
				// if (data.rate < 1){
				// 	 var image = 'img/circle-black.png';
				// 	_.extend(data, {icon: image});
				// }
				// else if (data.rate < settings.thresholdSlow()){
				// 	 var image = 'img/circle-red.png';
				// 	_.extend(data, {icon: image});
				// }
				// else if (data.rate < settings.thresholdMedium()){
				// 	 var image = 'img/circle-yellow.png';
				// 	_.extend(data, {icon: image});
				// }
				// else {
				// 	 var image = 'img/circle-green.png';
				// 	_.extend(data, {icon: image});
				// }

				// TODO - I'd prefer not to store all the stuff like icon & title, those should be derived from
				// the data at map creation time instead for less storage. Also by storing the icon we can't change 
				// display thresholds dynamically
				
				if(vm.historyPoints==null)
					vm.historyPoints = data;
				//vm.historyPoints.something = new Date().getTime();
				vm.historyPoints.push(data);

				// this was necessary to communicate the new point to the controller to map the new marker's onclick
				$rootScope.$emit('newPoint', data);

				// don't store image icons in cache
				stripIcons();
				self.historyCache.put('history', vm.historyPoints);	

		};


		// returns all history points (from local cache)
		function getHistoryPoints(){
			var deferred = $q.defer();

			// add colored map icons to all points
			decorateIcons();

			deferred.resolve(vm.historyPoints);
			return deferred.promise;
		};

		// Add custom icon to a marker (assign each a reference to colored icon based on rate and thresholds)
		function decorateIcons(){
      angular.forEach(vm.historyPoints, function (data) {

				if (data.rate < 1){
					 var image = 'img/circle-black.png';
					_.extend(data, {icon: image});
				}
				else if (data.rate < settings.thresholdSlow()){
					 var image = 'img/circle-red.png';
					_.extend(data, {icon: image});
				}
				else if (data.rate < settings.thresholdMedium()){
					 var image = 'img/circle-yellow.png';
					_.extend(data, {icon: image});
				}
				else {
					 var image = 'img/circle-green.png';
					_.extend(data, {icon: image});
				}
      });
		}

		// strip icons before persisting back to cache
		function stripIcons(){
			vm.historyPoints = _.map(vm.historyPoints, function(data) { return _.omit(data, 'icon'); });
		}


		// overwrite history localStorage cache
		function clearLocal(){
			console.log(vm.historyPoints);
			console.log('clear local cache');
			self.historyCache.put('history', {});
			vm.historyPoints = [];
			$rootScope.$emit('dataCleared');
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