(function(){
	angular.module('rateMyData').controller('HistoryCtrl', ['$rootScope', '$scope', 'networkHistory', 'networkPerformance', 'uiGmapGoogleMapApi', 'uiGmapIsReady', HistoryCtrl]);

	function HistoryCtrl($rootScope, $scope, networkHistory, networkPerformance, uiGmapGoogleMapApi, uiGmapIsReady) {
		var vm = this;

    vm.googlemap = {};
    vm.map = {
        center: {
			latitude: 27.808100,     // lat/long will be overwritten from network.currentPosition
			longitude: -82.732800
		},
		zoom: 12,
        pan: 1,
        options: vm.mapOptions,
        control: {},
        events: {
            tilesloaded: function (maps, eventName, args) {},
            dragend: function (maps, eventName, args) {},
            zoom_changed: function (maps, eventName, args) {}
        }
    };

	uiGmapGoogleMapApi.then(function(maps) {
        networkPerformance.currentPosition().then(function(current){
            console.log('setting map center lat :'+current.coords.latitude);
            console.log('setting map center lon :'+current.coords.longitude);
            vm.map.center.latitude = current.coords.latitude;    
            vm.map.center.longitude = current.coords.longitude;    
            return;
        })
        .then(networkHistory.getHistoryPoints().then(function(points){
    	  //console.log(points);
			vm.markers = points;
		  })
        );			
    });	

	vm.addMarkerClickFunction = function (markersArray) {
        angular.forEach(markersArray, function (value, key) {
            value.onClick = function () {
            	// console.log(value);
                vm.onClick(value.size+'K in '+value.elapsed+'ms ('+value.rate+' Kbps)');
                vm.MapOptions.markers.selected = value;
            };
        });
    };

	vm.windowOptions = {
	    show: false
	};

	vm.onClick = function(data) {
	    vm.windowOptions.show = !vm.windowOptions.show;
	};

	vm.closeClick = function() {
	    vm.windowOptions.show = false;
	};

    uiGmapIsReady.promise() // if no value is put in promise() it defaults to promise(1)
    .then(function (instances) {
      //console.log('map: ',instances[0].map); // get the current map
    })
    .then(function () {
      vm.addMarkerClickFunction(vm.markers);
    });

	vm.MapOptions = {
        minZoom: 3,
        zoomControl: false,
        draggable: true,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        disableDoubleClickZoom: false,
        keyboardShortcuts: true,
        markers: {
            selected: {}
        },
        // styles: [{
        //     featureType: "poi",
        //     elementType: "labels",
        //     stylers: [{
        //         visibility: "off"
        //     }]
        // }, {
        //     featureType: "transit",
        //     elementType: "all",
        //     stylers: [{
        //         visibility: "off"
        //     }]
        // }],
    };

    vm.isSlow = function(rate){
    	// console.log(rate < 1000? 'slow' : '');
		 	return rate < 1000;
    }
    vm.isMedium = function(rate){
    	// console.log(rate < 1500 && rate > 1000 ? 'medium' : '');
		  return rate < 1500 && rate > 1000;
    }
    vm.isFast = function(rate){
	  	// console.log(rate > 1500 ? 'fast' : '');
		  return rate > 1500;
    }

    // any of these events should cause a recreation of the map
    angular.forEach(['thresholdSlowChanged', 'thresholdMediumChanged', 'newPoint', 'dataCleared'], function(value) {
      $rootScope.$on(value, function(event) {
      console.log('recreating map due to '+event.name);
          // remap the whole marker array, just adding the new one wasn't working
          networkHistory.getHistoryPoints().then(function(points){
                vm.markers = points;
                vm.addMarkerClickFunction(vm.markers);
        });   
      });
    });


  }
})();