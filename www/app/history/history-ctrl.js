(function(){
	angular.module('rateMyData').controller('HistoryCtrl', ['$rootScope', 'networkHistory', 'uiGmapGoogleMapApi', 'uiGmapIsReady', HistoryCtrl]);

	function HistoryCtrl($rootScope, networkHistory, uiGmapGoogleMapApi, uiGmapIsReady) {
		var vm = this;

    vm.googlemap = {};
    vm.map = {
            center: {
							latitude: 27.808100,
							longitude: -82.732800
						},
						zoom: 11,
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
	    networkHistory.getHistoryPoints().then(function(points){
	    	console.log(points);
				vm.markers = points;
				// vm.marker = {
				// 	coords:{
				// 	// latitude: vm.location.latitude,
				// 	// longitude: vm.location.longitude,
				// 	latitude: data[0].latitude,
				// 	longitude: data[0].longitude,
				// }
				// 	// title: 'Tap for Details',
				// 	// showWindow: true
				// };

			});			

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
		    //console.log('vm.windowOptions.show: ', vm.windowOptions.show);
		    //console.log(data);
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

    // $scope.networkHistory = networkHistory;
    // Adding a data point is dynamically updating the map, BUT since we are not adding the click handler
    // the infowindow isn't there until an app refresh. Need to catch a marker addition and add the handler.
    // TODO - why won't this catch updates in the history service??

  //   $scope.$watch('networkHistory.getHistoryPoints()', function(newVal, oldVal){
  //   	console.log('changed');
		// }, true);

		// for some reason I was unable to do a $scope.watch to map the new point's onclick, had to resort to rootscope
    $rootScope.$on('newPoint', function(value){
		 	// remap the whole marker array, just adding the new one wasn't working
      networkHistory.getHistoryPoints().then(function(points){
	    	// console.log('remapped array: ',points);
				vm.markers = points;
				vm.addMarkerClickFunction(vm.markers);
			});			

		});

	}

})();