(function(){
	angular.module('rateMyData').controller('NetworkCtrl', ['$rootScope', '$scope', '$interval', '$timeout', '$cordovaDialogs', 'networkPerformance', 'settings', NetworkCtrl]);

	function NetworkCtrl($rootScope, $scope, $interval, $timeout, $cordovaDialogs, networkPerformance, settings) {
		var vm = this;

		vm.pingTest = function(){
			console.log('calling ping download...');

			// get network type
			networkPerformance.isOnline()
			.then(function(isonline){
				console.log('isonline: '+isonline);
				return;
			}, function(err){
				console.log('error checking online status: ', err);
			})
			networkPerformance.getNetwork()
			.then(function(netData){
				vm.networkType = netData;
				console.log('network type: ', netData);
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

	

    var stop;

    function startRepeater() {
    	console.log('starting test repeat every '+settings.testRate()+' seconds');
      if ( angular.isDefined(stop) ) return;

 			stop = $interval(function() {
          console.log('PING!');
          vm.pingTest();
      }, settings.testRate() * 1000);
    };

    function stopRepeater() {
    	console.log('stopped repeater');
      if (angular.isDefined(stop)) {
        $interval.cancel(stop);
        stop = undefined;
      }
    };

		$scope.$on('$destroy', function() {
          // Make sure that the interval is destroyed too
          $scope.stopRepeater();
    });

		$rootScope.$on('startRepeat', function(value){
			startRepeater();
		});
		$rootScope.$on('stopRepeat', function(value){
			stopRepeater();
		});

		// kick off the repeater if that's their preference at startup		
		angular.element(document).ready(function () {
			$timeout(function(){
	   		console.log('checking if auto mode');
				if(settings.autoMode())
	      	startRepeater();
			}, 5000);
    });

  }
})();