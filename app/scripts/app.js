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
    .module('kunturApp', ['ngRoute','ngAnimate','ngMaterial', 'users','ngMdIcons','720kb.datepicker','material.wizard'])//'ngMap',

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

      dataFactory.setAgreement=function(id, erased, code, name, from_date, to_date, comment, agreement_type_id, org_id){
          $http({
            method:"post",
            url: urlKuntur + 'insertarAgreement',
            data:{
              erased:erased,
              code:code,
              name:name,
              from_date:from_date,
              to_date:to_date,
              comment:comment,
              agreement_type_id:agreement_type_id,
              org_id:org_id
            }
          })
          .error(function(){
            alert("no iserto");
          });
    
      };

      dataFactory.getConveniosXOrg=function(agreId, callback){
        console.log("llmado");
        $http.get(urlKuntur + 'getConveniosXOrganizacion',{
          params: {
            agrId:agreId
          }
        })
          .success(function(data){
            console.log("datos");
            console.log(data);
            callback(data);
          })
          .error(function(){
            alert("Se rompio todo con el WS de conveniosXOrga");
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
          .error(function(){
            alert("Se rompio todo con el WS de getResponsableXOrgXConvenio");
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



.controller('datePickerCtrl', function() {

  });


// angular
//   .module('kunturApp', [
//     'ngAnimate',
//     'ngRoute'
//   ])
  


