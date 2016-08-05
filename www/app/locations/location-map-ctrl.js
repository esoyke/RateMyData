(function(){
	'use strict';

	angular.module('rateMyData').controller('LocationMapCtrl', ['$stateParams', 'eliteApi', LocationMapCtrl]);
	function LocationMapCtrl ($stateParams, eliteApi) {
		var vm = this;
		vm.locationId = Number($stateParams.id);
		vm.map = {
			center: {
				latitude: 38.897677,
				longitude: -77.036530
			},
			zoom: 12
		};
		vm.marker = {};

		eliteApi.getLeagueData().then(function(data){
			vm.location = _.find(data.locations, {id: vm.locationId});
			vm.marker = {
				latitude: vm.location.latitude,
				longitude: vm.location.longitude,
				title: vm.location.name+'</br>Tap for Directions',
				showWindow: true
			};
			vm.map.center.latitude = vm.location.latitude;
			vm.map.center.longitude = vm.location.longitude;
		});

		vm.locationClicked = function(marker){
			// For time being open the thing in Apple maps. You can get teh device type from cordova:
			// http://cordova.apache.org/docs/en/3.0.0/cordova/device/device.html#device.platform

			// this is opening Google Earth on my iphone:
			//window.location = 'geo:'+marker.latitude+','+marker.longitude+';u=35';
			// this launches Apple maps
			window.open('http://maps.apple.com/?q='+marker.latitude+','+marker.longitude, '_system');
			// this launches Google maps
			//window.open('http://maps.google.com/?q='+marker.latitude+','+marker.longitude, '_system');
		}
	}

})();