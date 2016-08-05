(function(){
	'use strict';
	angular.module('rateMyData').factory('settings', [settings]);
	function settings(){
		var vm = this;

		// defaults to 128 (KB)
		vm.downloadSize = 128;

		function downloadSize() {
			return vm.downloadSize;
		};
		function updateDownloadSize(data) {
			vm.downloadSize = data;
			//TODO- persist to localStorage for future sessions
		}

		return {
			downloadSize: downloadSize,
			updateDownloadSize: updateDownloadSize
		}
	}
})();