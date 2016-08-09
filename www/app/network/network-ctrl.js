(function(){
	angular.module('rateMyData').controller('NetworkCtrl', ['$cordovaDialogs', 'networkPerformance', NetworkCtrl]);

	function NetworkCtrl($cordovaDialogs, networkPerformance) {
		var vm = this;

		vm.pingTest = function(){
			console.log('calling ping download...');

			// get network type
			networkPerformance.getNetwork()
			.then(function(netData){
				vm.networkType = netData;
				return netData;
			})
			// get download performance
			.then(function(netData){
				return networkPerformance.ping(netData);
			})
			.then(function(data){
					console.log(data);
					vm.downloadTime = data.elapsed;
					vm.downloadSize = data.size;
					vm.downloadRatePretty = data.rate < 1000 ? data.rate+' Kbps' : data.rate/1000 + ' Mbps';
					vm.downloadSizePretty = vm.downloadSize < 1000 ? vm.downloadSize+'KB' : vm.downloadSize/1000+'MB';
			
			}, function(err){
				console.log('error getting network ping');
				vm.downloadRatePretty = 'Hrmmmm, couldn\'t get a network connection.'; 
			});

		}

	}


})();