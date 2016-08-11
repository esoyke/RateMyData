(function(){
	'use strict';
	angular.module('rateMyData').factory('settings', ['$rootScope', 'DSCacheFactory', settings]);
	function settings($rootScope, DSCacheFactory){
		var vm = this;

		// setting defaults
		vm.defaultDownloadSize = 128;		// (KB)
		vm.defaultTestRate = 60;				// (seconds)
		vm.defaultThresholdSlow = 10;		// (KB)
		vm.defaultThresholdMedium = 50;	// (KB)

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
		function thresholdSlow() {
			return self.settingsCache.get('thresholdSlow') || vm.defaultThresholdSlow;
		};
		function updateThresholdSlow(data) {
      //TODO for efficiency we might dedup to reduce the # of times the map is redrawn due to this
			$rootScope.$emit('thresholdSlowChanged');
			self.settingsCache.put('thresholdSlow', data);	
		};
		function thresholdMedium() {
			return self.settingsCache.get('thresholdMedium') || vm.defaultThresholdMedium;
		};
		function updateThresholdMedium(data) {
      //TODO for efficiency we might dedup to reduce the # of times the map is redrawn due to this
			$rootScope.$emit('thresholdMediumChanged');
			self.settingsCache.put('thresholdMedium', data);	
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
			updateThresholdSlow: updateThresholdSlow,
			updateThresholdMedium: updateThresholdMedium,
		}
	}
})();