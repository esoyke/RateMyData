(function(){
	angular.module('rateMyData').controller('SettingsCtrl', ['$scope', 'settings', SettingsCtrl]);

	function SettingsCtrl($scope, settings) {
		var vm = this;

		vm.downloadSize = settings.downloadSize();
		$scope.$watch('vm.downloadSize', function() {
			settings.updateDownloadSize(vm.downloadSize);
		});
        
		vm.smallDL = function(){ return vm.downloadSize<1000;}
		vm.largeDL = function(){ return !vm.smallDL();}
	}


})();