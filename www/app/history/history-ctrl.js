(function(){
	angular.module('rateMyData').controller('HistoryCtrl', ['networkHistory', 'uiGmapGoogleMapApi', 'uiGmapIsReady', HistoryCtrl]);

	function HistoryCtrl(networkHistory, uiGmapGoogleMapApi, uiGmapIsReady) {
		var vm = this;

		// vm.map = {
		// 	center: {
		// 		latitude: 27.808100,
		// 		longitude: -82.732800
		// 	},
		// 	zoom: 12
		// };
		//vm.marker = {};
		//vm.markers = [];
    vm.googlemap = {};
    vm.map = {
            center: {
							latitude: 27.808100,
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


				// vm.map.center.latitude = vm.location.latitude;
				// vm.map.center.longitude = vm.location.longitude;
				//vm.historyDataPoints = data;

				// vm.markers = [];
				// _.each(data, function(point){
				// 	console.log(point);
				// 	vm.markers.push(point);
				// });
        // for (var i = 0; i < 50; i++) {
        //   markers.push(createRandomMarker(i, $scope.map.bounds))
        // }
				//console.log(data);
			});			

    });	

		// vm.clickMapPoint = function(data){
		// 	console.log(data);
		// 	var infowindow = new google.maps.InfoWindow({
	 //    	content: '<h4>Fooooo</h4>'
  // 		});
	 //    infowindow.open(map, marker);  		   
		// }

		vm.addMarkerClickFunction = function (markersArray) {
        angular.forEach(markersArray, function (value, key) {
            value.onClick = function () {
            	// console.log(value);
                vm.onClick(value.size+'K in '+value.elapsed+'ms ('+value.rate+' Kbps)');
                vm.MapOptions.markers.selected = value;
            };
        });
    };

		// vm.addMarkerClickFunction = function(markersArray){
		//     angular.forEach(markersArray, function(value, key) {
		//         value.onClick = function(){
		//                 vm.onClick(value.data);
		//             };
		//     });
		// }; 

		vm.windowOptions = {
		    show: false
		};

		vm.onClick = function(data) {
		    vm.windowOptions.show = !vm.windowOptions.show;
		    console.log('vm.windowOptions.show: ', vm.windowOptions.show);
		    console.log(data);
		};

		vm.closeClick = function() {
		    vm.windowOptions.show = false;
		};

    uiGmapIsReady.promise() // if no value is put in promise() it defaults to promise(1)
    .then(function (instances) {
        console.log(instances[0].map); // get the current map
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
        styles: [{
            featureType: "poi",
            elementType: "labels",
            stylers: [{
                visibility: "off"
            }]
        }, {
            featureType: "transit",
            elementType: "all",
            stylers: [{
                visibility: "off"
            }]
        }],
    };


	}

})();