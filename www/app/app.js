angular.module("rateMyData", ["ionic", "angular-data.DSCacheFactory", "google-maps", "ngCordovaMocks"])

.run(function($ionicPlatform, DSCacheFactory, $location,$rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      //cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    DSCacheFactory('historyCache', {storageMode: 'localStorage'});

   $location.path('/tab/dash');
   $rootScope.$apply();
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('app', {
      abstract: true,
      url: "/app",
      templateUrl: "app/layout/menu-layout.html"
    })

    .state('home', {
      abstract: true,
      url: "/home",
      templateUrl: "app/home/home.html"
    })

    .state('home.network', {
      url: "/network",
      views: {
        "tab-network": {
          templateUrl: "app/network/datatest.html"
        }
      }
    })

    .state('home.networkMap', {
      url: "/networkMap",
      views: {
        "tab-networkMap": {
          templateUrl: "app/history/historyMap.html"
        }
      }
    })

    .state('home.settings', {
      url: "/settings",
      views: {
        "tab-settings": {
          templateUrl: "app/settings/settings.html"
        }
      }
    })

    .state('app.locations', {
      url: "/locations",
      views: {
        'menuContent': {
          templateUrl: "app/locations/locations.html"
        }
      }
    })

    .state('app.location-map', {
      url: "/location-map/:id",
      views: {
        'menuContent': {
          templateUrl: "app/locations/location-map.html"
        }
      }
    })

    ;

    // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home/network');
});