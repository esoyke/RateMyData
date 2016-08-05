(function(){
	'use strict';
	angular.module('rateMyData').controller('LocationsCtrl', ['eliteApi', LocationsCtrl]);

	function LocationsCtrl (eliteApi) {
		var vm = this;
		eliteApi.getLeagueData().then(function(data){
			vm.locations = data.locations;
		});	

	}

})();
