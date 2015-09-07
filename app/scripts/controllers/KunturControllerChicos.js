(function(){

  angular
       .module('kunturApp')
       .controller('KunturControllerChicos', [
          '$scope','$mdDialog', 'dataFactory', '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$mdUtil', '$mdToast', '$filter',
          KunturController
       ])



  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function KunturController( $scope, $mdDialog, dataFactory,$mdSidenav, $mdBottomSheet, $log, $q, $mdUtil, $mdToast, $filter) {
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
    $scope.wizardIndice=null;
    

    $scope.addChildrenOrg = function(org){
      // //console.log(org);
      if($scope.newAgreement.selectedOrgs2Lvl.indexOf(org)==-1)
        $scope.newAgreement.selectedOrgs2Lvl.push(org);
    }

    $scope.onFinish = function(){
      var agreementItemOu = {};
      var agreementItem = {};
      var agreement = {};
        var agreementItemOu = {};
        //console.log("pasa");
        for(var fac in $scope.newAgreement.plazasIn[0]){
          //console.log("pasa2");
          agreementItemOu.fac=fac;
          agreementItemOu.in=$scope.newAgreement.plazasIn[fac];
          agreementItemOu.out=$scope.newAgreement.plazasOut[fac];
        }
      //}
    }

    $scope.toggleLeft = buildToggler('left');

    function buildToggler(navID) {
      var debounceFn =  $mdUtil.debounce(function(){
            $mdSidenav(navID)
              .toggle()
              .then(function () {
                $log.debug("toggle " + navID + " is done");
              });
          },200);
      return debounceFn;
    }

    $scope.showContinents = function(){
      $scope.viewContinents = true;
      $scope.viewCountryFilter = false;
    };

    $scope.showCountries = function(){
      $scope.viewContinents = false;
      $scope.viewCountryFilter = false;
    };

    $scope.showCountryFilter = function(){
      $scope.viewCountryFilter = true;
    }; 

    $scope.searchByCountry = function(){
    }; 

    $scope.clearCountryFilter = function(){
      $scope.countryFilter = "";
      $scope.viewCountryFilter = false;
    }; 

    var page = 0;
    $scope.loadUniversities = function(){
      //console.log(page);
      page += 1;
      dataFactory.getUniversities(function(universities){
        $scope.universities = $scope.universities.concat(universities);
      },$scope.universitiesFilter, page);
    };

    $scope.addContryToAgreement=function(university){
      if($scope.newAgreement.universities.indexOf(university)==-1)
        $scope.newAgreement.universities.push(university);
      dataFactory.getResponsableXOrgs(loadContacts, $scope.newAgreement.universities);
    }

    var loadContacts=function(data){
      $scope.newAgreement.Contacts=JSON.parse(data[0].f_responsablesbyorg);
      $scope.newAgreement.Contacts=$filter('orderBy')($scope.newAgreement.Contacts, 'org_original_name', true);
    }


    $scope.removeContryToAgreement=function(university){
      $scope.newAgreement.universities.splice($scope.newAgreement.universities.indexOf(university),1); 
      //console.log(university);
      if($scope.newAgreement.Contacts!=null ){
        $scope.newAgreement.Contacts=$scope.newAgreement.Contacts.filter( function(item) {
          return !(university.id == item.org_id);
        } );
      }
      
      $scope.newAgreement.selectedContactsOut=[];
      $scope.newAgreement.selectedContactsIn=[];
    }

    $scope.searchUniversity=function(){
      $('#universities').scrollTop(0);
      page=0;
      $scope.universities=[];
      $scope.universitiesFilter.searchText=$scope.newAgreement.UniversitySearch;
      dataFactory.getUniversities(getUniversities,$scope.universitiesFilter);
    }

    $scope.searchUniversityCountry=function(code, name, flag){
      $('#universities').scrollTop(0);
      page=0;
      $scope.universities=[];
      $scope.universitiesFilter.countryCode=code;
      $scope.universitiesFilter.name=name;
      $scope.universitiesFilter.flag=flag;
      dataFactory.getUniversities(getUniversities,$scope.universitiesFilter);
    }

    $scope.removeFilters=function(){
      $('#universities').scrollTop(0);
      page=0;
      $scope.universities=[];
      $scope.universitiesFilter.countryCode=null;
      $scope.universitiesFilter.searchText="";
      dataFactory.getUniversities(getUniversities);
    }

    $scope.selectContactIn=function(contact){
      //console.log(contact);
      if($scope.newAgreement.selectedContactsIn.indexOf(contact)==-1)
        $scope.newAgreement.selectedContactsIn.push(contact);
    }

    $scope.removeContactFromAgreementIn=function(contact){
      $scope.newAgreement.selectedContactsIn.splice($scope.newAgreement.selectedContactsIn.indexOf(contact),1); 
    }

    $scope.selectContactOut=function(contact){
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
        agreementItem.agreementItemOu=[];
        agreementItem.id=i;
        if($scope.newAgreement.Contacts)
          agreementItem.contacts = $.grep($scope.newAgreement.Contacts, function(e){ return (e.org_id == i && (e.in==true || e.out==true)); });
        for(j in $scope.newAgreement.plazasIn[i]){
          var agreementItemOu={};
          agreementItemOu.id=j;
          agreementItemOu.in=$scope.newAgreement.plazasIn[i][j];
          agreementItemOu.out=$scope.newAgreement.plazasOut[i][j];
          agreementItem.agreementItemOu.push(agreementItemOu);
        }
        agreement.agreementItem.push(agreementItem)
      }

    var inputs = $('.inputPlazas');
    var errorInputs=false;
    for(i in inputs){
      if($('.inputPlazas')[i].value==""){
        errorInputs=true;
      }
    }
  
    if($scope.newAgreement.name=="" || $scope.newAgreement.from=="" || $scope.newAgreement.to=="" || $scope.newAgreement.type=="" || $scope.newAgreement.status==""){
      //alert("Faltan datos por completar");
        var toast = $mdToast.simple()
          .content('Faltan datos por completar en el paso 1')
          .position('bottom left')
          .hideDelay(4000);
        $mdToast.show(toast);
    }
    else if(agreement.from>agreement.to){
      var toast = $mdToast.simple()
        .content('Fechas inválidas')
        .position('bottom left')
        .hideDelay(4000);
      $mdToast.show(toast);
    }else if(inputs.length<1){
      var toast = $mdToast.simple()
        .content('No hay plazas seleccionadas')
        .position('bottom left')
        .hideDelay(4000);
      $mdToast.show(toast);
    }else if(errorInputs){
      var toast = $mdToast.simple()
        .content('Completar campos de plazas')
        .position('bottom left')
        .hideDelay(4000);
      $mdToast.show(toast);
    }else{
      dataFactory.setAgreement(agreement,succesAgreement);
        
    }

    }

    var succesAgreement=function(id){
      $mdDialog.hide([id]);
    }

    $scope.cancelAgreement=function(){
      $mdDialog.cancel();
    }

    function getCountriesFromContinent(continent, index, array) {
      dataFactory.getCountriesFromContinent(continent.code)
        .success( function(data){
          $scope.continents[index].countries = data["org.geoobject.model.Country"];
          if(index==array.length-1)
            activateLists();
          
        })
        .error(function (error){
          //console.log("Unable to load continents data." + error.message);
        });
    }

    $scope.continents = [];
    getContinents();
    function getContinents() {
      dataFactory.getContinents()
        .success(function(data) {
          $scope.continents = data["org.geoobject.model.Continent"];
          $scope.continents.forEach(getCountriesFromContinent);
        })
        .error(function (error){
          //console.log("Unable to load continents data." + error.message);
        });
    }

    $scope.countries = { 'INT': 'Internacional' };

    getCountries();
    function getCountries() {
      dataFactory.getCountries()
        .success(function(data) {
          $scope.countriesArray = data["org.geoobject.model.Country"];
          $scope.countriesArray.forEach(function(country){
          $scope.countries[country.code_iso_alfa3] = country.common_name;
          });
        })
        .error(function (error){
          //console.log("Unable to load Countries data." + error.message);
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
      $scope.orgsTree=[];
      $scope.orgsTree.push(data);
    }
    
    // dataFactory.getAgreements(getAgreements);
    dataFactory.getAgreementsTypes(getAgreementsTypes);
    dataFactory.getUniversities(getUniversities);
    dataFactory.orgs2lvl(getOrgs2Lvl);



    // Enables expand functionality in subtrees.
    var activateLists = function() {
      return $('.minimized li a').on('click', function() {
        var children, obj, toggle;
        obj = $(this);
        //console.log($(this));
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
            // $log.debug("toggle " + navID + " is done");
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