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
    .module('kunturApp', ['ngRoute','ngAnimate','ngMaterial', 'users','ngMdIcons','720kb.datepicker','material.wizard','xeditable'])//'ngMap',, 'ui.bootstrap'

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
                      .accentPalette('lime', {
      'default': '500' // use shade 200 for default, and keep all other shades the same

    });

                  $mdThemingProvider.theme('input', 'default')
                      .primaryPalette('grey')   

    })


    .factory('dataFactory', ['$http',function($http){
      var urlGeoObjectWS= 'http://nodejs-nodo1-dev.psi.unc.edu.ar:3005/'; //TODO: replace it for the actual url' 
      var dataFactory = {};
      var urlKuntur = 'http://172.16.248.194:8080/'
      
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

      dataFactory.getAgreements=function(callback, cadenaBuscada){
          return $http.get(urlKuntur + 'getAgreements',{
            params: {
              busqueda:cadenaBuscada
            }
          })
          .success(function(data){
            callback(data);
          })
          .error(function(){
            alert("Se rompio todo con el WS de agreements");
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
          .error(function(){
            alert("Se rompio todo con el WS de findAgreementById");
          });
      };

      dataFactory.getAgreementsTypes=function(callback){
          return $http.get(urlKuntur + 'getAgreementsTypes')
          .success(function(data){
            callback(data);
          })
          .error(function(){
            alert("Se rompio todo con el WS de agreements_types");
          });

      };

      dataFactory.getOrganizations=function(callback){
          return $http.get(urlKuntur + 'getOrganizations')
          .success(function(data){
            callback(data);
          })
          .error(function(){
            alert("Se rompio todo con el WS de organizations");
          });

      };

      dataFactory.getStatus=function(callback){
          return $http.get(urlKuntur + 'getStatus')
          .success(function(data){
            callback(data);
          })
          .error(function(){
            alert("Se rompio todo con el WS de status");
          });

      };

      // dataFactory.setAgreement=function(id, erased, code, name, from_date, to_date, comment, agreement_type_id, org_id){
      //     $http({
      //       method:"post",
      //       url: urlKuntur + 'insertarAgreement',
      //       data:{
      //         erased:erased,
      //         code:code,
      //         name:name,
      //         from_date:from_date,
      //         to_date:to_date,
      //         comment:comment,
      //         agreement_type_id:agreement_type_id,
      //         org_id:org_id
      //       }
      //     })
      //     .error(function(){
      //       alert("no iserto");
      //     });
    
      // };

      dataFactory.loadStatusPromise=function(){
        return $http.get(urlKuntur + '/getStatus');
      }

      dataFactory.loadTypesPromise=function(){
        return $http.get(urlKuntur + '/getAgreementsTypes');
      }


      dataFactory.setAgreement=function(agreement, callback){
        console.log(agreement);
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
            alert(err);
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
          .error(function(){
            alert("Se rompio todo con el WS de conveniosXOrga");
          });
      }

      dataFactory.getResponsableXOrgs=function(callback, orgs){
        //console.log("llmado");
        //console.log(orgs);
        // var aux="";
        // for(var i=0;i<orgs.length;i++){
        //   aux+="orgs="+orgs[i];
        //   if(i!=orgs.length-1)
        //     aux+="&";
        // }
        $http({
            method:"post",
            url: urlKuntur + 'listResponsablesByOrgs',
            data:{
              orgs:orgs
            }
        })
        .success(function(data){
          console.log(data);
          callback(data);
        })
        .error(function(){
          alert("Se rompio todo con el WS de getResponsableXOrgs");
        });
       /* $http.get(urlKuntur + 'listResponsablesByOrgs/'+aux)
          .success(function(data){
            callback(data);
          })
          .error(function(){
            alert("Se rompio todo con el WS de getResponsableXOrgs");
          });*/
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
          .error(function(){
            alert("Se rompio todo con el WS de getResponsableXOrgXConvenio");
          });
      }

      dataFactory.orgs2lvl=function(callback){
        $http.get(urlKuntur + 'orgs2lvl')
          .success(function(data){
            callback(data);
          })
          .error(function(){
            alert("Se rompio todo con el WS de orgs2lvl");
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
})

.controller('datePickerCtrl', function() {

  });




// angular
//   .module('kunturApp', [
//     'ngAnimate',
//     'ngRoute'
//   ])
  


