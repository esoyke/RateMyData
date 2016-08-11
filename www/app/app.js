angular.module("rateMyData", ["ionic", "angular-data.DSCacheFactory", "ngCordova", "uiGmapgoogle-maps"]) //  ngCordovaMocks

.run(function($ionicPlatform, DSCacheFactory, $location,$rootScope) {
  $ionicPlatform.ready(function() {

    // $cordovaNetwork.getNetwork().then(function(){
    //   console.log('got network');
    // }, function(){
    //   console.log('failed to get network');
    // });

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard && window.cordova.plugins.Network ) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      //cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    DSCacheFactory('historyCache', {storageMode: 'localStorage'});
    DSCacheFactory('settingsCache', {storageMode: 'localStorage'});

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

    // Manual test screen
    .state('home.network', {
      url: "/network",
      views: {
        "tab-network": {
          templateUrl: "app/network/datatest.html"
        }
      }
    })

    // Mapping screen
    .state('home.networkMap', {
      url: "/networkMap",
      views: {
        "tab-networkMap": {
          templateUrl: "app/history/historyMap.html"
        }
      }
    })

    // Settings screen
    .state('home.settings', {
      url: "/settings",
      views: {
        "tab-settings": {
          templateUrl: "app/settings/settings.html"
        }
      }
    })

    // Dev screen
    .state('home.devscreen', {
      url: "/devscreen",
      views: {
        "tab-devscreen": {
          templateUrl: "app/home/devscreen.html"
        }
      }
    })

    ;

    // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home/devscreen');
})

// .config(function(uiGmapGoogleMapApiProvider) {
//     uiGmapGoogleMapApiProvider.configure({
//         //    key: 'your api key',
//         //v: '3.20', //defaults to latest 3.X anyhow
//         libraries: 'weather,geometry,visualization'
//     });
// })
;