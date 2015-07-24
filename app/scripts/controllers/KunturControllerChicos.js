(function(){

  angular
       .module('kunturApp')
       .controller('KunturControllerChicos', [
          '$scope','$mdDialog', 'dataFactory', '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$mdUtil',
          KunturController
       ])



  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function KunturController( $scope, $mdDialog, dataFactory,$mdSidenav, $mdBottomSheet, $log, $q, $mdUtil) {
    var self = this;

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
    $scope.newAgreement={};
    $scope.newAgreement.universities=[];
    $scope.newAgreement.UniversitySearch="";
    $scope.newAgreement.Contacts=[];
    $scope.newAgreement.selectedContactsIn=[];
    $scope.newAgreement.selectedContactsOut=[];
    $scope.newAgreement.orgs2Lvl=[];
    $scope.newAgreement.selectedOrgs2Lvl=[];
    $scope.newAgreement.plazasIn=[];
    $scope.newAgreement.plazasOut=[];
    $scope.newAgreement.type="";
    $scope.newAgreement.status="";
    $scope.newAgreement.from="";
    $scope.newAgreement.to="";
    $scope.newAgreement.name="";
    $scope.newAgreement.code="";

    $scope.onFinish = function(){
      var agreementItemOu = {};
      var agreementItem = {};
      var agreement = {};

      //for(var i=0;i<$scope.newAgreement.selectedOrgs2Lvl.length;i++){
        // console.log($scope.newAgreement.selectedOrgs2Lvl[i]);
        // console.log($scope.newAgreement.plazasIn[$scope.newAgreement.universities[i].id]);
        // console.log($scope.newAgreement.plazasOut[$scope.newAgreement.universities[i].id]);
        var agreementItemOu = {};
        console.log("pasa");
        for(var fac in $scope.newAgreement.plazasIn[0]){
          console.log("pasa2");
          agreementItemOu.fac=fac;
          agreementItemOu.in=$scope.newAgreement.plazasIn[fac];
          agreementItemOu.out=$scope.newAgreement.plazasOut[fac];
          // console.log(fac);
          // console.log($scope.newAgreement.plazasIn[fac]);
          console.log(agreementItemOu);
        }
      //}
    }

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

    $scope.addContryToAgreement=function(university){
      if($scope.newAgreement.universities.indexOf(university)==-1)
        $scope.newAgreement.universities.push(university);
      //console.log($scope.newAgreement.universities);
      //console.log(dataFactory.getResponsableXOrgs);
      dataFactory.getResponsableXOrgs(loadContacts, $scope.newAgreement.universities);
    }

    var loadContacts=function(data){
      //console.log(data[0].f_responsablesbyorg.length);
      $scope.newAgreement.Contacts=JSON.parse(data[0].f_responsablesbyorg);
    }


    $scope.removeContryToAgreement=function(university){
      $scope.newAgreement.universities.splice($scope.newAgreement.universities.indexOf(university),1); 
      console.log(university);
      //for(var i=0;iz)
      $scope.newAgreement.Contacts=$scope.newAgreement.Contacts.filter( function(item) {
        return !(university.id == item.org_id);
      } );
      
      $scope.newAgreement.selectedContactsOut=[];
      $scope.newAgreement.selectedContactsIn=[];
    }

    $scope.searchUniversity=function(){
      $scope.universitiesFilter.searchText=$scope.newAgreement.UniversitySearch;
      dataFactory.getUniversities(getUniversities,$scope.universitiesFilter);
    }

    $scope.searchUniversityCountry=function(code){
      $scope.universitiesFilter.countryCode=code;
      dataFactory.getUniversities(getUniversities,$scope.universitiesFilter);
    }

    $scope.removeFilters=function(){
      $scope.universitiesFilter.countryCode=null;
      $scope.universitiesFilter.searchText="";
      dataFactory.getUniversities(getUniversities);
    }

    $scope.selectContactIn=function(contact){
      //console.log(contact);
      console.log(contact);
      if($scope.newAgreement.selectedContactsIn.indexOf(contact)==-1)
        $scope.newAgreement.selectedContactsIn.push(contact);
    }

    $scope.removeContactFromAgreementIn=function(contact){
      $scope.newAgreement.selectedContactsIn.splice($scope.newAgreement.selectedContactsIn.indexOf(contact),1); 
    }

    $scope.selectContactOut=function(contact){
      //console.log(contact);
      if($scope.newAgreement.selectedContactsOut.indexOf(contact)==-1)
        $scope.newAgreement.selectedContactsOut.push(contact);
    }

    $scope.removeContactFromAgreementOut=function(contact){
      $scope.newAgreement.selectedContactsOut.splice($scope.newAgreement.selectedContactsOut.indexOf(contact),1); 
    }

    $scope.selectOrg2Lvl = function(org){
      if($scope.newAgreement.selectedOrgs2Lvl.indexOf(org)==-1)
        $scope.newAgreement.selectedOrgs2Lvl.push(org);
    }

    $scope.removeOrg2LvlFromAgreement = function(org){
      $scope.newAgreement.selectedOrgs2Lvl.splice($scope.newAgreement.selectedOrgs2Lvl.indexOf(org),1); 
    }

    $scope.submitAgreement = function(){
      //console.log($scope.newAgreement.plazasIn);
      //dataFactory.setAgreement($scope.newAgreement.plazasIn, $scope.newAgreement.plazasOut);
      var agreement={};
      agreement.agreementItem=[];
      agreement.name=$scope.newAgreement.name;
      agreement.from=$scope.newAgreement.from;
      agreement.to=$scope.newAgreement.to;
      agreement.status=$scope.newAgreement.status;
      agreement.type=$scope.newAgreement.type;
      agreement.code=$scope.newAgreement.code;
      for(i in $scope.newAgreement.plazasIn){
        var agreementItem={};
        //agreementItem.contactIn=[];
        //agreementItem.contactOut=[];
        agreementItem.agreementItemOu=[];
        agreementItem.id=i;
        agreementItem.contacts = $.grep($scope.newAgreement.Contacts, function(e){ return (e.org_id == i && (e.in==true || e.out==true)); });
        //agreementItem.contactOut = $.grep($scope.newAgreement.Contacts, function(e){ return (e.org_id == i && e.out==true); });
        for(j in $scope.newAgreement.plazasIn[i]){
          var agreementItemOu={};
          agreementItemOu.id=j;
          agreementItemOu.in=$scope.newAgreement.plazasIn[i][j];
          agreementItemOu.out=$scope.newAgreement.plazasOut[i][j];
          //console.log($scope.newAgreement.plazasOut[i][j]);
          agreementItem.agreementItemOu.push(agreementItemOu);
        }
        agreement.agreementItem.push(agreementItem)
      }



    // for(i in $scope.newAgreement.Contacts){
    //   if($scope.newAgreement.Contacts[i].in){
    //     contactIn.push($scope.newAgreement.Contacts[i].id)
    //   }
    //   if($scope.newAgreement.Contacts[i].out){
    //     contactOut.push($scope.newAgreement.Contacts[i].id)
    //   }
    // }
  
    dataFactory.setAgreement(agreement,succesAgreement);

    //   $scope.newAgreement.plazasIn=[];
    // $scope.newAgreement.plazasOut=[];
    
    }

    var succesAgreement=function(id){
      // alert(id);
      $mdDialog.hide([id]);
    }

    $scope.cancelAgreement=function(){
      $mdDialog.cancel();
    }

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

    var getOrgs2Lvl=function(data){
      $scope.newAgreement.orgs2Lvl=data;
    }
    
    dataFactory.getAgreements(getAgreements);
    dataFactory.getAgreementsTypes(getAgreementsTypes);
    dataFactory.getUniversities(getUniversities);
    dataFactory.orgs2lvl(getOrgs2Lvl);



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