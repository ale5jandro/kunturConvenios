'use strict';

/**
 * @ngdoc overview
 * @name kunturApp
 * @description
 * # kunturApp
 *
 * Main module of the application.
 */
angular
    .module('kunturApp', ['ngRoute','ngAnimate','ngMaterial', 'users','ngMdIcons','material.wizard','xeditable', 'angularTreeview', 'datetime'])//'ngMap',, 'ui.bootstrap'

.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/moduloConvenios', {
        templateUrl: 'views/moduloconvenios.html',
        controller: 'KunturControllerAle'
      })
      .when('/index', {
        templateUrl: 'views/vistaChicos.html',
        controller: 'KunturControllerChicos'
      })
      .otherwise({
        redirectTo: '/'
      });
  })

      .config(function($mdThemingProvider, $mdIconProvider){
           $mdIconProvider
                .defaultIconSet("styles/svg/avatars.svg", 128)
                .icon("menu"       , "styles/svg/menu.svg"        , 24)
                .icon("share"      , "styles/svg/share.svg"       , 24)
                .icon("google_plus", "styles/svg/google_plus.svg" , 512)
                .icon("hangouts"   , "styles/svg/hangouts.svg"    , 512)
                .icon("twitter"    , "styles/svg/twitter.svg"     , 512)
                .icon("phone"      , "styles/svg/phone.svg"       , 512);

                 
                $mdThemingProvider.theme('default')
                      .primaryPalette('cyan')
                      .accentPalette('purple', {
                        'default': '400'

    });

                  $mdThemingProvider.theme('input', 'default')
                      .primaryPalette('grey')   

    })


    .factory('dataFactory', ['$http',function($http){
      var urlGeoObjectWS= 'http://nodejs-nodo1-dev.psi.unc.edu.ar:3005/'; //TODO: replace it for the actual url' 
      var dataFactory = {};
      var urlKuntur = 'http://172.16.248.194:8080/'
      var lastElementDeleted;
      
      dataFactory.getContinents=function(){
        return $http.get(urlGeoObjectWS + 'continents');
      };

      dataFactory.getCountries=function(){
        return $http.get(urlGeoObjectWS + 'countries');
      };

      dataFactory.getCountriesFromContinent=function(continentCode){
        return $http.get(urlGeoObjectWS + 'continents/' + continentCode + '/countries');
      };

      dataFactory.getCountry=function(searchFilters){
          searchFilters=searchFilters||{}; //Null parameter case
          return $http.get(urlGeoObjectWS + 'countries');
      };

      dataFactory.getAgreements=function(callback, filtrosAgreement, page){
          
          console.log(page);
          var pageSize = 30;
          if(page)
            var offset = page * pageSize;
          else
            var offset = 0;
          return $http.get(urlKuntur + 'getAgreements',{
            params: {
              filter:filtrosAgreement,
              offset:offset,
              pageSize:pageSize
            }
          })
          .success(function(data){
            callback(data);
          })
          .error(function(err){
            console.log(err);
          });
      };

      dataFactory.findAgreementById=function(callback, id){
          return $http.get(urlKuntur + 'findAgreementById',{
            params: {
              idAgreement:id
            }
          })
          .success(function(data){
            callback(data);
          })
          .error(function(err){
            console.log(err);
          });
      };

      dataFactory.getAgreementsTypes=function(callback){
          return $http.get(urlKuntur + 'getAgreementsTypes')
          .success(function(data){
            callback(data);
          })
          .error(function(err){
            console.log(err);
          });

      };

      dataFactory.getOrganizations=function(callback){
          return $http.get(urlKuntur + 'getOrganizations')
          .success(function(data){
            callback(data);
          })
          .error(function(err){
            console.log(err);
          });

      };

      dataFactory.getStatus=function(callback){
          return $http.get(urlKuntur + 'getStatus')
          .success(function(data){
            callback(data);
          })
          .error(function(err){
            console.log(err);
          });

      };

      dataFactory.loadStatusPromise=function(){
        return $http.get(urlKuntur + '/getStatus');
      }

      dataFactory.loadTypesPromise=function(){
        return $http.get(urlKuntur + '/getAgreementsTypes');
      }


      dataFactory.setAgreement=function(agreement, callback){
       $http({
            method:"post",
            url: urlKuntur + 'insertarAgreement',
            data:{
              agreement:agreement//angular.toJson(plazaIn)
            }
          })
          .success(function(data){
            callback(data);
          })
          .error(function(err){
            console.log(err);
          });
      }

      dataFactory.getConveniosXOrg=function(agreId, callback){
        $http.get(urlKuntur + 'getConveniosXOrganizacion',{
          params: {
            agrId:agreId
          }
        })
          .success(function(data){
            // console.log("datos");
            // console.log(data);
            callback(data);
          })
          .error(function(err){
            console.log(err);
          });
      }

      dataFactory.getResponsableXOrgs=function(callback, orgs){
        $http({
            method:"post",
            url: urlKuntur + 'listResponsablesByOrgs',
            data:{
              orgs:orgs
            }
        })
        .success(function(data){
          // console.log(data);
          callback(data);
        })
        .error(function(err){
          console.log(err);
        });
      }


      dataFactory.getResponsableXOrgXConvenio=function(agreId, callback){
        $http.get(urlKuntur + 'getResponsableXOrgXConvenio',{
          params: {
            agrId:agreId
          }
        })
          .success(function(data){
            callback(data);
          })
          .error(function(err){
            console.log(err);
          });
      }

      dataFactory.deleteAgreement=function(agreId, callback){
        lastElementDeleted=agreId;
        $http.get(urlKuntur + 'deleteAgreement',{
          params: {
            agrId:agreId
          }
        })
          .success(function(data){
            callback();
          })
          .error(function(err){
            console.log(err);
          });
      }

      dataFactory.reinsertAgreement=function(agrId, callback){
        if(agrId!=0){//si es cero quiere decir que tengo que reinsertar el ultimo borrado
          $http.get(urlKuntur + 'reinsertAgreement',{
            params: {
              agrId:agrId
            }
          })
            .success(function(data){
              callback();
            })
            .error(function(err){
              console.log(err);
            });
        }else{
          $http.get(urlKuntur + 'reinsertAgreement',{
            params: {
              agrId:lastElementDeleted
            }
          })
            .success(function(data){
              callback();
            })
            .error(function(err){
              console.log(err);
          });
        }
      }

      dataFactory.orgs2lvl=function(callback){
        $http.get(urlKuntur + 'orgs2lvl')
          .success(function(data){
            callback(data);
          })
          .error(function(err){
            console.log(err);
          });
      }

      dataFactory.updateAgreement=function(agr){
        $http({
          method:"post",
          url:urlKuntur + 'updateAgreement',
          data:{
            agreement:agr
          }
        })
          .success(function(data){
          })
          .error(function(err){
            console.log(err);
          });
      }

      dataFactory.updateAgreementData=function(agr){
        $http({
          method:"post",
          url:urlKuntur + 'updateAgreementData',
          data:{
            agreement:agr
          }
        })
          .success(function(data){
          })
          .error(function(err){
            console.log(err);
          });
      }

      dataFactory.getSelectedOrgs = function(id, callback){
          return $http.get(urlKuntur + 'agreementData',{
            params: {
              agrId:id
            }
          })
          .success(function(data){
            callback(data);
          })
          .error(function(err){
            console.log(err);
          });
      }

      dataFactory.getUniversities = function (callback,universitiesFilter, page){
        var pageSize = 30;
        if(page)
          var offset = page * pageSize;
        else
          var offset = 0;
        var url = urlKuntur + 'universities?offset='+ offset +'&limit='+pageSize;

        if(universitiesFilter){
          if(universitiesFilter.countryCode)
            url += '&countryCode=' + universitiesFilter.countryCode;

          if(universitiesFilter.searchText)
            url += '&searchText=' + universitiesFilter.searchText;
        }

        return $http.get(url)
          .success(function(data){
            callback(data);
          })
          .error(function(error){
            alert("Unable to load organizations data.",error.message);
          });
      };
      
    return dataFactory;
  }])

.directive('showFocus', function($timeout) {
  return function(scope, element, attrs) {
    scope.$watch(attrs.showFocus, 
      function (newValue) { 
        $timeout(function() {
            newValue && element.focus();
        }, 80);
      },true);
  };    
})

.directive('whenScrollEnds', function() {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                //console.log(element);
                
                var threshold = 200;
                element.scroll(function() {
                    var visibleHeight = element.height();
                    var scrollableHeight = element.prop('scrollHeight');
                    var hiddenContentHeight = scrollableHeight - visibleHeight;
                    // console.log("scrollableHeight");
                    // console.log(scrollableHeight);
                    // console.log("visibleHeight");
                    // console.log(visibleHeight);
                    // console.log("element.scrollTop()");
                    // console.log(element.scrollTop());
                    // console.log("re");
                    // console.log(hiddenContentHeight - element.scrollTop());
                    if (hiddenContentHeight - element.scrollTop() <= threshold) {
                        // Scroll is almost at the bottom. Loading more rows
                        scope.$apply(attrs.whenScrollEnds);
                    }
                });
            }
        };
})

.directive('datepicker', function() {
  return {
    require: 'ngModel',
    link: function(scope, el, attr, ngModel) {
      $(el).datepicker({
        dateFormat: 'dd-mm-yy',
        onSelect: function(dateText) {
          scope.$apply(function() {
            ngModel.$setViewValue(dateText);
          });
        }
      });
    }
  };
});

// app.factory('dateService', [function(){
//   return { items: [] };
// }]);

var findFirstOccurrence = function(array, property, value){
  for(var i = 0 ; i < array.length; i++){
    if(array[i][property]==value){
      return array[i];
    }
  }
  return -1;
}

var allowNumericInputOnly = function (e) {
      // Allow: backspace, delete, tab, escape, enter and whitespace
      if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 32]) !== -1 ||
           // Allow: Ctrl+A
          (e.keyCode == 65 && e.ctrlKey === true) ||
           // Allow: home, end, left, right
          (e.keyCode >= 35 && e.keyCode <= 39)) {
               // let it happen, don't do anything
               return;
      }
      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
          e.preventDefault();
      }
}

// angular
//   .module('kunturApp', [
//     'ngAnimate',
//     'ngRoute'
//   ])
  


