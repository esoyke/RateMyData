(function(){
	angular.module('rateMyData').controller('SettingsCtrl', ['$scope', '$ionicPopup', 'settings', 'networkHistory', SettingsCtrl]);

	function SettingsCtrl($scope, $ionicPopup, settings, networkHistory) {
		var vm = this;

		vm.downloadSize = settings.downloadSize();
		$scope.$watch('vm.downloadSize', function() {
			settings.updateDownloadSize(vm.downloadSize);
		});

		vm.testRate = settings.testRate();
		$scope.$watch('vm.testRate', function() {
			settings.updateTestRate(vm.testRate);
		});

		vm.shareMode = true;
        
		vm.smallDL = function(){ return vm.downloadSize<1000;}
		vm.largeDL = function(){ return !vm.smallDL();}

		vm.confirmClearLocal = function() {    
      var confirmPopup = $ionicPopup.confirm({
          title: 'Confirm reset',
          template: 'Clear ALL local history?'
      });
      confirmPopup.then(function(res){
          if(res){
              networkHistory.clearLocal();
          }
      });

    };

	}


})();