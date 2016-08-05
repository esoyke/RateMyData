(function(){
	angular.module('rateMyData').controller('HistoryCtrl', ['networkHistory', HistoryCtrl]);

	function HistoryCtrl(networkHistory) {
		var vm = this;

    networkHistory.getHistoryPoints().then(function(data){
			vm.historyDataPoints = data;
			console.log(data);
		});			

	}

})();