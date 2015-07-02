(function(){

  angular
       .module('kunturApp')
       .controller('KunturControllerChicos', [
          '$scope','$mdDialog', 'dataFactory', '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$mdUtil',
          KunturController
       ]);

  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function KunturController( $scope, $mdDialog, dataFactory,$mdSidenav, $mdBottomSheet, $log, $q, $mdUtil) {
    var self = this;
    $scope.prueba="lalalala";

    function toggleUsersList() {
      var pending = $mdBottomSheet.hide() || $q.when(true);

      pending.then(function(){
        $mdSidenav('left').toggle();
      });
    }

    /**
     * Show the bottom sheet
     */
    function showContactOptions($event) {
        var user = self.selected;

        return $mdBottomSheet.show({
          parent: angular.element(document.getElementById('content')),
          templateUrl: 'views/contactSheet.html',
          controller: [ '$mdBottomSheet', ContactPanelController],
          controllerAs: "cp",
          bindToController : true,
          targetEvent: $event
        }).then(function(clickedItem) {
          clickedItem && $log.debug( clickedItem.name + ' clicked!');
        });

        /**
         * Bottom Sheet controller for the Avatar Actions
         */
        
    }

    /*------------KUNTUR-------------*/
    //$scope.universities=dataFactory.getUniversities();

    $scope.viewContinents = false;
    $scope.viewCountryFilter = false;
    $scope.countryFilter = "";
    $scope.universitiesFilter = {};


    $scope.showContinents = function(){
      $scope.viewContinents = true;
      $scope.viewCountryFilter = false;
      //setTimeout(activateLists,400); //after transition ended
      //activateLists();
    };

    $scope.showCountries = function(){
      $scope.viewContinents = false;
      $scope.viewCountryFilter = false;
    };

    $scope.showCountryFilter = function(){
      $scope.viewCountryFilter = true;
    }; 

    $scope.searchByCountry = function(){
      //$scope.search.country="";
      //$scope.viewCountryFilter = false;
    }; 

    $scope.clearCountryFilter = function(){
      $scope.countryFilter = "";
      $scope.viewCountryFilter = false;
    }; 

    var page = 0;
    $scope.loadUniversities = function(){
      page += 1;
      dataFactory.getUniversities(function(universities){
        $scope.universities = $scope.universities.concat(universities);
        // console.log($scope.universities);
      }, page);
    };

    $scope.showAdd = function(ev) {
    $mdDialog.show({
      controller: KunturController,
      template: '<md-dialog aria-label="Mango (Fruit)"> ' +
                   '<md-content class="md-padding"> ' +
                      '<form name="userForm">' +
                       '<div layout layout-sm="column">' +
                       '<md-input-container flex> ' +
                       ' <label>First Name</label> <input ng-model="user.firstName" placeholder="Placeholder text"> ' +
                       '</md-input-container> ' +
                       '<md-input-container flex> ' +
                      '  <label>Last Name</label> <input ng-model="theMax"> ' +
                      ' </md-input-container> ' +
                     ' </div> ' +
                     ' <md-input-container flex> ' +
                     '   <label>Address</label> <input ng-model="user.address"> ' +
                      '</md-input-container> ' +
                     ' <div layout layout-sm="column"> ' +
                     ' <md-input-container flex> ' +
                     '   <label>City</label> <input ng-model="user.city"> ' +
                     ' </md-input-container> ' +
                     ' <md-input-container flex> ' +
                     '   <label>State</label> <input ng-model="user.state"> ' +
                     ' </md-input-container> ' +
                     ' <md-input-container flex> ' +
                    '    <label>Postal Code</label> <input ng-model="user.postalCode"> ' +
                     ' </md-input-container> </div> ' +
                     ' <md-input-container flex> ' +
                    '    <label>Biography</label> <textarea ng-model="user.biography" columns="1" md-maxlength="150"></textarea> ' +
                    '  </md-input-container> </form> ' +
                  '  </md-content> ' +
                 ' <div class="md-actions" layout="row"> <span flex></span> ' +
                 ' <md-button ng-click="answer(\'not useful\')"> Cancel </md-button> ' +
                '  <md-button ng-click="answer(\'useful\')" class="md-primary"> Save </md-button> ' +
                 ' </div>' +
                 ' </md-dialog>',
      targetEvent: ev,
    })
    .then(function(answer) {
      $scope.alert = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.alert = 'You cancelled the dialog.';
    });
  };


    function getCountriesFromContinent(continent, index, array) {
      dataFactory.getCountriesFromContinent(continent.code)
        .success( function(data){
          $scope.continents[index].countries = data["org.geoobject.model.Country"];
          //onsole.log(array);
          //setTimeout(activateLists,400);
          if(index==array.length-1)
            activateLists();
          
        })
        .error(function (error){
          console.log("Unable to load continents data." + error.message);
        });
    }

    $scope.continents = [];
    getContinents();
    function getContinents() {
      dataFactory.getContinents()
        .success(function(data) {
          $scope.continents = data["org.geoobject.model.Continent"];
          $scope.continents.forEach(getCountriesFromContinent);
          // for(var i=0;i<$scope.continents.length;i++){
          //   console.log($scope.continents);
          //   getCountriesFromContinent($scope.continents[i],i);
          // }
        })
        .error(function (error){
          console.log("Unable to load continents data." + error.message);
        });
    }

    $scope.countries = { 'INT': 'Internacional' };

    //$scope.countries = [];
    getCountries();
    function getCountries() {
      dataFactory.getCountries()
        .success(function(data) {
          $scope.countriesArray = data["org.geoobject.model.Country"];
          //$scope.countries = {};
          $scope.countriesArray.forEach(function(country){
          $scope.countries[country.code_iso_alfa3] = country.common_name;
          });
        })
        .error(function (error){
          console.log("Unable to load Countries data." + error.message);
        });
    }

    var getAgreements = function(agreements){
      $scope.agreements=agreements;
    }

    //callback de tipos de convenios, usado para traer los distintos tipos de convenios (se usa para cargarlos)
    var getAgreementsTypes = function(types){
      $scope.agreementsTypes=types;
    }

    var getUniversities = function(organizations){
      $scope.universities=organizations;
    }
    
    dataFactory.getAgreements(getAgreements);
    dataFactory.getAgreementsTypes(getAgreementsTypes);
    dataFactory.getUniversities(getUniversities);


    // Enables expand functionality in subtrees.
    var activateLists = function() {
      return $('.minimized li a').on('click', function() {
        var children, obj, toggle;
        obj = $(this);
        console.log($(this));
        if (obj.attr('href') === '#') {
          children = obj.parent().children('ul');
          toggle = obj.find('.toggle');
          if (children.hasClass('opened')) {
            children.removeClass('opened');
            toggle.removeClass(toggle.attr('data-altclass'));
            toggle.addClass(toggle.attr('data-class'));
            children.slideUp('fast');
          } else {
            children.addClass('opened');
            toggle.removeClass(toggle.attr('data-class'));
            toggle.addClass(toggle.attr('data-altclass'));
            children.slideDown('fast');
          }
          return false;
        }
      });
    };

 $scope.toggleRight = buildToggler('right');

function buildToggler(navID) {
      var debounceFn = $mdUtil.debounce(function() {
        $mdSidenav(navID)
          .toggle()
          .then(function() {
            $log.debug("toggle " + navID + " is done");
          });
      }, 10);

      return debounceFn;
    }



$scope.close = function() {

      $mdSidenav('right').close()
        .then(function() {
          $log.debug("close RIGHT is done");
        });
    };

}; /*fin controlador*/

})();