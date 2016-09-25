angular.module('steem.witness.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.service('APIs', ['$http', '$rootScope', function ($http, $rootScope) {
  'use strict';
  
  return {
    saveSubscription: function(deviceid, witness) {
      //var device = ionic.Platform.platform();
      return $http.post("http://192.158.29.1:8080/api/wdevices", {deviceid: deviceid, witness: witness});
    },
    updateSubscription: function(deviceid, witness, del) {
      //var device = ionic.Platform.platform();
      if (!del) {
        return $http.put("http://192.158.29.1:8080/api/wdevices", {deviceid: deviceid, witness: witness});  
      } else {
        return $http.put("http://192.158.29.1:8080/api/wdevices", {deviceid: deviceid, witness: witness, delete: true});
      }
    },
    updateParticipation: function(deviceid, status) {
      return $http.post("http://192.158.29.1:8080/api/wdevicesp", {deviceid: deviceid, participation: status});  
    },
    getParticipation: function(deviceid) {
      return $http.get("http://192.158.29.1:8080/api/wdevicesp/"+deviceid);
    },
    deleteSubscription: function(deviceid, witness) {
      return $http.delete("http://192.158.29.1:8080/api/wdevices/"+deviceid+"/"+witness);
    },
    getSubscriptions: function(deviceid) {
      return $http.get("http://192.158.29.1:8080/api/wdevices/"+deviceid);
    },
    getSTEEMRate: function() {
      return $http.get("https://api.coinmarketcap.com/v1/ticker/steem/");
      //return $http.get("https://www.cryptonator.com/api/full/steem-usd");
    },
    getBTCRate: function() {
      return $http.get("https://api.exchange.coinbase.com/products/BTC-USD/ticker");
    }
  };
}])

.filter( 'shortNumber', function($filter) {
  return function( number ) {
    if ( number ) {
      abs = Math.abs( number );
      if ( abs >= Math.pow( 10, 15 ) ) {
        // trillion
        number = $filter('number')(( number / Math.pow( 10, 15 ) ), 1) + " PV";
      } else if ( abs < Math.pow( 10, 12 ) && abs >= Math.pow( 10, 9 ) ) {
        // billion
        number = ( number / Math.pow( 10, 9 ) ).toFixed( 0 ) + " B";
      } else if ( abs < Math.pow( 10, 9 ) && abs >= Math.pow( 10, 6 ) ) {
        // million
        number = ( number / Math.pow( 10, 6 ) ).toFixed( 0 ) + " M";
      } else if ( abs < Math.pow( 10, 6 ) && abs >= Math.pow( 10, 3 ) ) {
        // thousand
        number = ( number / Math.pow( 10, 3 ) ).toFixed( 0 ) + " K";
      }
      return number;
    }
  };
})

.filter('timeago', function() {
  return function(input, p_allowFuture) {

      var substitute = function (stringOrFunction, number, strings) {
              var string = angular.isFunction(stringOrFunction) ? stringOrFunction(number, dateDifference) : stringOrFunction;
              var value = (strings.numbers && strings.numbers[number]) || number;
              return string.replace(/%d/i, value);
          },
          nowTime = (new Date()).getTime(),
          date = (new Date(input)).getTime(),
          //refreshMillis= 6e4, //A minute
          allowFuture = p_allowFuture || false,
          strings= {
              prefixAgo: '',
              prefixFromNow: '',
              suffixAgo: "ago",
              suffixFromNow: "from now",
              seconds: "seconds",
              minute: "a minute",
              minutes: "%d minutes",
              hour: "an hour",
              hours: "%d hours",
              day: "a day",
              days: "%d days",
              month: "a month",
              months: "%d months",
              year: "a year",
              years: "%d years"
          },
          dateDifference = nowTime - date,
          words,
          seconds = Math.abs(dateDifference) / 1000,
          minutes = seconds / 60,
          hours = minutes / 60,
          days = hours / 24,
          years = days / 365,
          separator = strings.wordSeparator === undefined ?  " " : strings.wordSeparator,
      
         
          prefix = strings.prefixAgo,
          suffix = strings.suffixAgo;
          
      if (allowFuture) {
          if (dateDifference < 0) {
              prefix = strings.prefixFromNow;
              suffix = strings.suffixFromNow;
          }
      }

      words = seconds < 45 && substitute(strings.seconds, Math.round(seconds), strings) ||
      seconds < 90 && substitute(strings.minute, 1, strings) ||
      minutes < 45 && substitute(strings.minutes, Math.round(minutes), strings) ||
      minutes < 90 && substitute(strings.hour, 1, strings) ||
      hours < 24 && substitute(strings.hours, Math.round(hours), strings) ||
      hours < 42 && substitute(strings.day, 1, strings) ||
      days < 30 && substitute(strings.days, Math.round(days), strings) ||
      days < 45 && substitute(strings.month, 1, strings) ||
      days < 365 && substitute(strings.months, Math.round(days / 30), strings) ||
      years < 1.5 && substitute(strings.year, 1, strings) ||
      substitute(strings.years, Math.round(years), strings);
      //console.log(prefix+words+suffix+separator);
      prefix.replace(/ /g, '')
      words.replace(/ /g, '')
      suffix.replace(/ /g, '')
      return (prefix+' '+words+' '+suffix+' '+separator);
      
  };
})

;
