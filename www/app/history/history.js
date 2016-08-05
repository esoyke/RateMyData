(function(){
	'use strict';
	angular.module('rateMyData').factory('networkHistory', ['$q', 'DSCacheFactory', networkHistory]);
	function networkHistory($q, DSCacheFactory){
		var vm = this;

 		self.historyCache = DSCacheFactory.get('historyCache');
		vm.historyPoints = _.values(self.historyCache.get('history'));

		function addDataPoint(data){
			if(vm.historyPoints==null)
				vm.historyPoints = data;
			vm.historyPoints.push(data);
			console.log(vm.historyPoints);
			self.historyCache.put('history', vm.historyPoints);	
		};

		// returns all history points from local storage
		function getHistoryPoints(){
			console.log('getting history points');
			var deferred = $q.defer();
			var historyPoints = self.historyCache.get('history');
			console.log(historyPoints);
			deferred.resolve(historyPoints);
			return deferred.promise;
		};

		return {
			addPoint: addDataPoint,
			getHistoryPoints: getHistoryPoints
		}
	}
})();