
angular.module('steem.witness', ['ionic', 'steem.witness.controllers', 'steem.witness.services', 'ngLetterAvatar', 'ngStorage', 'ngCordova'])

.run(function($ionicPlatform, $localStorage, $rootScope, $ionicPopup, $cordovaToast, $ionicLoading) {
  $rootScope.$storage = $localStorage;
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    $rootScope.showAlert = function(title, msg) {
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: msg
      });
      if (msg.indexOf("error")>-1) {
        //window.Api.initPromise.then(function(response) {
        console.log("broadcast error");
        //});
      }
      return alertPopup/*.then(function(res) {
        console.log('Thank you ...');
      });*/
    };
    if (!$rootScope.$storage.socket) {
      $rootScope.$storage.socket = "wss://steemit.com/wspa";
    }

    $rootScope.$watch('$storage.socket',function(newv, oldv) {
      console.log(newv);
      steem.api.setWebSocket(newv);
    });
    
    if (navigator.splashscreen) {
      setTimeout(function() {
        navigator.splashscreen.hide();  
      }, 3000);
    }
    //steem.api.setWebSocket($rootScope.$storage.socket);

    $rootScope.showMessage = function(title, msg) {
      if (window.cordova) {
        $cordovaToast.showLongBottom(title+": "+msg).then(function(success) {
          // success
          console.log("toast"+success);
        }, function (error) {
          // error
          console.log("toast"+error);
        });  
      } else {
        $rootScope.showAlert(title, msg);
      }
    };
    //if (window.cordova) {
      window.open = cordova.InAppBrowser.open;  

      //if (!ionic.Platform.isWindowsPhone()) {
        FCMPlugin.getToken(
          function(token){
            console.log("device "+token);
            $rootScope.$storage.deviceid = token;
          },
          function(err){
            console.log('error retrieving token: ' + err);
          }
        );


        //FCMPlugin.onNotification( onNotificationCallback(data), successCallback(msg), errorCallback(err) )
        //Here you define your application behaviour based on the notification data.
        FCMPlugin.onNotification(
          function(data){
            if(data.wasTapped){
              $rootScope.showAlert(data.title, data.body);
            } else{
              $rootScope.showMessage(data.title, data.body);
            }
          },
          function(msg){
            console.log('onNotification callback successfully registered: ' + msg);
            //alert("msg "+JSON.stringify(msg));
          },
          function(err){
            console.log('Error registering onNotification callback: ' + err);
          }
        );  
      //}
   //}
  });

  
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.witnesses', {
      url: '/witnesses',
      views: {
        'tab-witnesses': {
          templateUrl: 'templates/tab-witnesses.html',
          controller: 'WitnessesCtrl'
        }
      }
    })
    
    .state('tab.witness-detail', {
      url: '/witness/:witnessId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/witness-detail.html',
          controller: 'WitnessDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');
  $ionicConfigProvider.tabs.position('bottom'); // other values: top
  $ionicConfigProvider.navBar.alignTitle('center');
});
