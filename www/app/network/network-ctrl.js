(function(){
	angular.module('rateMyData').controller('NetworkCtrl', ['$cordovaDialogs', 'networkPerformance', NetworkCtrl]);

	function NetworkCtrl($cordovaDialogs, networkPerformance) {
		var vm = this;

		vm.pingTest = function(){
			console.log('calling ping download...');

			// get network type
			networkPerformance.getNetwork().then(function(netData){
				vm.networkType = netData;
			});

			// get download performance
			networkPerformance.ping().then(function(data){
				console.log(data);
				vm.downloadTime = data.elapsed;
				vm.downloadSize = data.size;
				vm.downloadRate = data.rate;
				vm.downloadSizePretty = vm.downloadSize < 1000 ? vm.downloadSize+'KB' : vm.downloadSize/1000+'MB';
			});
		
		}

	}


})();