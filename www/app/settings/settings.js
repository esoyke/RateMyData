(function(){
	'use strict';
	angular.module('rateMyData').factory('settings', ['$rootScope', 'DSCacheFactory', settings]);
	function settings($rootScope, DSCacheFactory){
		var vm = this;

		// setting defaults
		vm.defaultDownloadSize = 128;		// (KB)
		vm.defaultTestRate = 60;				// (seconds)
		var thresholdSlow = 500;
		var thresholdMedium = 1000;
		self.settingsCache = DSCacheFactory.get('settingsCache');

		function downloadSize() {
			return self.settingsCache.get('downloadSize') || vm.defaultDownloadSize;
		};
		function updateDownloadSize(data) {
			self.settingsCache.put('downloadSize', data);	
		};
		function testRate() {
			return self.settingsCache.get('testRate') || vm.defaultTestRate;
		};
		function updateTestRate(data) {
			self.settingsCache.put('testRate', data);	
		};
		function autoMode() {
			return self.settingsCache.get('autoMode') ;
		};
		function updateAutoMode(data) {
			if(data)
				$rootScope.$emit('startRepeat');
			else
				$rootScope.$emit('stopRepeat');
			self.settingsCache.put('autoMode', data);	
		};
		function shareMode() {
			return self.settingsCache.get('shareMode') ;
		};
		function updateShareMode(data) {
			self.settingsCache.put('shareMode', data);	
		};
		function devMode() {
			return self.settingsCache.get('devMode') ;
		};
		function updateDevMode(data) {
			self.settingsCache.put('devMode', data);	
		};
		return {
			downloadSize: downloadSize,
			updateDownloadSize: updateDownloadSize,
			testRate: testRate,
			updateTestRate: updateTestRate,
			shareMode: shareMode,
			updateShareMode: updateShareMode,
			autoMode: autoMode,
			updateAutoMode: updateAutoMode,
			DEVMODE: devMode,
			updateDevMode: updateDevMode,
			thresholdSlow: thresholdSlow,
			thresholdMedium: thresholdMedium,
		}
	}
})();