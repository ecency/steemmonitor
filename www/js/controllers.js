angular.module('steem.witness.controllers', [])

.controller('DashCtrl', function($scope, $interval, $rootScope, $ionicLoading, APIs) {

  $scope.$on('$ionicView.enter', function(e) {
    
  });
  
  $scope.refresh = function() {
    $ionicLoading.show({
      noBackdrop : true,
      template: '<ion-spinner></ion-spinner>'
    });
    window.steem.api.getDynamicGlobalProperties(function(err, response){
        //console.log(err, response);
        $scope.blocks = response;

        $ionicLoading.hide();

        if (!$scope.$$phase){
          $scope.$apply();
        }
    });
    APIs.getSTEEMRate().then(function(res){
      //console.log(res);
      if (res.status == 200) {
        $scope.rate = res.data[0];  
      }
    });
  };

  $scope.refresh();
})

.controller('WitnessesCtrl', function($scope, $rootScope, APIs, $ionicLoading) {
  
  $scope.openUrl = function(url) {
    window.open(url, "_blank", "toolbar=yes");
  };

  $scope.isNotify = function(witness) {
    if ($scope.mysubs) {
      //console.log($scope.mysubs);
      if ($scope.mysubs.indexOf(witness) !== -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  $scope.notify = function(witness) {
    if ($rootScope.$storage.deviceid) {
      $ionicLoading.show({
        noBackdrop : true,
        template: '<ion-spinner></ion-spinner>'
      });
      APIs.saveSubscription($rootScope.$storage.deviceid, witness).then(function(res){
        console.log("save subs");
        //console.log(angular.toJson(res));
        $scope.getSubs();
        $ionicLoading.hide();
      });
    }
  };

  $scope.unnotify = function(witness) {
    $ionicLoading.show({
      noBackdrop : true,
      template: '<ion-spinner></ion-spinner>'
    });
    APIs.deleteSubscription($rootScope.$storage.deviceid, witness).then(function(res){
      console.log("update subs");
      //console.log(angular.toJson(res));
      $scope.getSubs();
      $ionicLoading.hide();
    });
  };

  
  $scope.$on('$ionicView.beforeEnter', function(e) {
    $ionicLoading.show({
      noBackdrop : true,
      template: '<ion-spinner></ion-spinner>'
    });
    window.steem.api.getWitnessesByVote("", 70, function(err, response){
      //console.log(err, response);
      $scope.witnesses = response;
      $ionicLoading.hide();
      if (!$scope.$$phase){
        $scope.$apply();
      }
    });
    $scope.getSubs = function() {
      if ($rootScope.$storage.deviceid) {
        $ionicLoading.show({
          noBackdrop : true,
          template: '<ion-spinner></ion-spinner>'
        });
        $scope.mysubs = [];
        APIs.getSubscriptions($rootScope.$storage.deviceid).then(function(res){
          console.log("subs");
          //console.log(angular.toJson(res));
          for (var i = 0; i < res.data.length; i++) {
            $scope.mysubs.push(res.data[i].witness);
          }
          $ionicLoading.hide();
          if (!$scope.$$phase){
            $scope.$apply();
          }
        });  
      }
    };
    setTimeout(function() {
      $scope.getSubs();
    }, 50);
  });

})

.controller('WitnessDetailCtrl', function($scope, $stateParams, APIs, $ionicLoading) {
  
})

.controller('AccountCtrl', function($scope, $ionicLoading, APIs, $rootScope) {
  $scope.settings = {
    enableNotifications: false
  };
  $scope.changeSettings = function() {
    console.log('update participation');

    APIs.updateParticipation($rootScope.$storage.deviceid, $scope.settings.enableNotifications).then(function(res){
      console.log("updated participation");      
      if (!$scope.$$phase){
        $scope.$apply();
      }
    });  
  };

  $scope.$on('$ionicView.enter', function(e) {
    $scope.getMyParticipation = function() {
      if ($rootScope.$storage.deviceid) {
        $ionicLoading.show({
          noBackdrop : true,
          template: '<ion-spinner></ion-spinner>'
        });
        APIs.getParticipation($rootScope.$storage.deviceid).then(function(res){
          console.log("get participation "+angular.toJson(res));
          $scope.settings.enableNotifications = res.data.participation;
          if (!$scope.$$phase){
            $scope.$apply();
          }
          $ionicLoading.hide();
          $ionicLoading.hide();
        });  
      }  
    }
    $scope.getMyParticipation();
  });

});