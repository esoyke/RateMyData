(function(){
	'use strict';
	angular.module('rateMyData').factory('settings', ['DSCacheFactory', settings]);
	function settings(DSCacheFactory){
		var vm = this;

		// setting defaults
		vm.defaultDownloadSize = 128;		// (KB)
		vm.defaultTestRate = 60;				// (seconds)

		self.settingsCache = DSCacheFactory.get('settingsCache');

		function downloadSize() {
			return self.settingsCache.get('downloadSize') || vm.defaultDownloadSize;
		};
		function updateDownloadSize(data) {
			self.settingsCache.put('downloadSize', data);	
		}
		function testRate() {
			return self.settingsCache.get('testRate') || vm.defaultTestRate;
		};
		function updateTestRate(data) {
			self.settingsCache.put('testRate', data);	
		}
		return {
			downloadSize: downloadSize,
			updateDownloadSize: updateDownloadSize,
			testRate: testRate,
			updateTestRate: updateTestRate
		}
	}
})();