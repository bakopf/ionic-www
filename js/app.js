// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova.plugins.sms'])

.filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config (function ( $stateProvider, $urlRouterProvider, $sceDelegateProvider ) {
  $sceDelegateProvider.resourceUrlWhitelist([
     // Allow same origin resource loads.
     'self',
     // Allow loading from our assets domain.  Notice the difference between * and **.
     '**',

   ]);

  $stateProvider

    .state( 'tabs' , {
      url:'/tabs',
      abstract: true,
      templateUrl: 'templates/navigation.html'
    })

    .state( 'tabs.home' , {
      url:'/home',
      views : {
        'home-tab' : {
          templateUrl: 'templates/netTrek.html'
        }
      }
    })

    .state( 'tabs.sms' , {
      url:'/sms',
      views : {
        'sms-tab' : {
          templateUrl: 'templates/sms.html',
          controller: 'SmsCtrl'
        }
      }
    })

    .state( 'tabs.list' , {
      url:'/list',
      views : {
        'list-tab' : {
          templateUrl: 'templates/list.html',
          controller: 'ListCtrl'
        }
      }
    })

    .state( 'tabs.detail' , {
      url:'/list/:id',
      views : {
        'list-tab' : {
          templateUrl: 'templates/detail.html',
          controller: 'ListCtrl'
        }
      }
    })

  ;

  $urlRouterProvider.otherwise( '/tabs/home' );


})

.controller ("SmsCtrl", function ( $scope, $cordovaSms) {
  $scope.send = function ( msg ) {

    $cordovaSms
      .send('0123456789', msg )
      .then(function() {
        alert ("Übertragung abgeschlossen")
      }, function(error) {
        alert ("FEHLER .....")
      });
  }
})




.controller ("ListCtrl", function ( $scope, $http, $window, $state ) {
    /*
    $scope.name = "Saban Ünlü";
    */

    $scope.enableReorder = false;
    $scope.enableDelete = false;

    $scope.moveItem = function (person, $fromIndex, $toIndex) {
        //console.log ( person, $fromIndex, $toIndex );
        $scope.data.splice ( $fromIndex, 1 );
        $scope.data.splice ( $toIndex, 0, person );
    }

    $scope.deleteItem = function ( index ) {
        $scope.data.splice ( index, 1 );
    }

    $scope.toggleReorder = function () {
      $scope.enableReorder = !$scope.enableReorder;
      if ( $scope.enableReorder ) {
        $scope.enableDelete = false;
      }
    };

    $scope.toggleDelete = function () {
      $scope.enableDelete = !$scope.enableDelete;
      if ( $scope.enableDelete ) {
        $scope.enableReorder  = false;
      }
    };

    $scope.toggleFav = function ( person ) {
      person.fav = !person.fav;
    }

    $scope.mailTo = function ( person ) {
      $window.location.href = 'mailto:'+person.mail
    }

    $scope.call = function ( person ) {
      $window.location.href = 'tel:'+person.phone
    }

    $scope.doRefresh = function () {
      $http.get ("js/data.json").then ( function ( data ) {
        $scope.data = data.data;
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

    $http.get ("js/data.json").then ( function ( data ) {
      $scope.data = data.data;
      $scope.selectedID = $state.params.id;
    })

})
