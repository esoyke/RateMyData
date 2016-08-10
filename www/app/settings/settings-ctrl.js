(function(){
	angular.module('rateMyData').controller('SettingsCtrl', ['$scope', '$ionicPopup', 'settings', 'networkHistory', SettingsCtrl]);

	function SettingsCtrl($scope, $ionicPopup, settings, networkHistory) {
		var vm = this;

		// auto tet size (KB)
		vm.downloadSize = settings.downloadSize();
		$scope.$watch('vm.downloadSize', function() {
			settings.updateDownloadSize(vm.downloadSize);
		});

		// auto test interval (seconds)
		vm.testRate = settings.testRate();
		$scope.$watch('vm.testRate', function() {
			settings.updateTestRate(vm.testRate);
		});

		// repeating or manual mode
    vm.autoMode = settings.autoMode();
		$scope.$watch('vm.autoMode', function() {
			settings.updateAutoMode(vm.autoMode);
		});

		// share or paranoid mode
		vm.shareMode = settings.shareMode();
		$scope.$watch('vm.shareMode', function() {
			settings.updateShareMode(vm.shareMode);
		});

		// share or paranoid mode
		vm.DEVMODE = settings.DEVMODE();
		$scope.$watch('vm.DEVMODE', function() {
			settings.updateDevMode(vm.DEVMODE);
		});

		// returns a calcualted hourly data usage in KB or MB
		vm.hourlyUsage = function(){
			var usage = Math.round(vm.downloadSize*(3600/vm.testRate));
			if(usage>1000){
				usage = Math.round(usage/1000);
				return ''+usage+' MB';
			}
			return ''+usage + ' KB';
		}

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