(function(){

  angular
       .module('kunturApp')
       .controller('KunturControllerAle', [
          '$scope','$mdDialog', 'dataFactory','userService', '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$mdUtil', '$rootScope', '$mdToast', 
          KunturController
       ]);

  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function KunturController( $scope, $mdDialog, dataFactory,userService,$mdSidenav, $mdBottomSheet, $log, $q, $mdUtil, $rootScope, $mdToast) {
    var self = this;

    self.selected     = null;
    self.users        = [ ];
    self.selectUser   = selectUser;
    self.toggleList   = toggleUsersList;
    self.showContactOptions  = showContactOptions;
    
    $scope.convenio = {};
    $scope.convenio.borrado=false;
    $scope.convenio.nombre="";
    $scope.convenio.codigo="";
    $scope.convenio.desde="";
    $scope.convenio.hasta="";
    $scope.convenio.organizacion="";
    $scope.convenio.tipo="";
    $scope.convenio.comentario="";
    $scope.convenio.id="";
    $scope.convenioSeleccionado={};
    $scope.convenioSeleccionado.nombre="";
    $scope.convenioSeleccionado.cantidad="";
    $scope.convenioSeleccionado.tipo="";
    $scope.convenioSeleccionado.nro="";
    $scope.convenioSeleccionado.responsables=[];
    $scope.convenioSeleccionado.id=""
    $scope.plazas = {};
    $scope.plazas.datos = [];
    $scope.plazas.cabeceras = [];
    $scope.agreementFilter = {};
    $scope.agreementFilter.showErased=false;
    $scope.agreementFilter.cadenaBuscada="";

    // Load all registered users

    userService
          .loadAllUsers()
          .then( function( users ) {
            self.users    = [].concat(users);
            self.selected = users[0];
          });

    // *********************************
    // Internal methods
    // *********************************

    /**
     * First hide the bottomsheet IF visible, then
     * hide or Show the 'left' sideNav area
     */
    function toggleUsersList() {
      var pending = $mdBottomSheet.hide() || $q.when(true);

      pending.then(function(){
        $mdSidenav('left').toggle();
      });
    }

    /**
     * Select the current avatars
     * @param menuId
     */
    function selectUser ( user ) {
      self.selected = angular.isNumber(user) ? $scope.users[user] : user;
      self.toggleList();
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
        function ContactPanelController( $mdBottomSheet ) {
          this.user = user;
          this.actions = [
            { name: 'Phone'       , icon: 'phone'       , icon_url: 'styles/svg/phone.svg'},
            { name: 'Twitter'     , icon: 'twitter'     , icon_url: 'styles/svg/twitter.svg'},
            { name: 'Google+'     , icon: 'google_plus' , icon_url: 'styles/svg/google_plus.svg'},
            { name: 'Hangout'     , icon: 'hangouts'    , icon_url: 'styles/svg/hangouts.svg'}
          ];
          this.submitContact = function(action) {
            $mdBottomSheet.hide(action);
          };
        }
    }

    /*------------KUNTUR-------------*/
    //$scope.universities=dataFactory.getUniversities();

    $rootScope.onEnter = function(e, funcion){
      if(e.keyCode==13){//enter
        //console.log("enter");
        funcion();
      }
    }

    $scope.resetSearch = function(){
      var filter={};
      dataFactory.getAgreements(cargarUniversidades, $scope.agreementFilter);
    }

    var pageAgreement = 0;
    $scope.loadAgreements = function(){
      pageAgreement += 1;
      dataFactory.getAgreements(function(universities){
        //console.log(universities);
        $scope.universities = $scope.universities.concat(universities);
      },$scope.agreementFilter, pageAgreement);
    };

    //callback de universidades en la pantalla inicial
    var cargarUniversidades = function(universidades){
      $scope.universities=universidades;
      pageAgreement = 0;
      $('#content').scrollTop(0);
    }

    //callback de tipos de convenios, usado para traer los distintos tipos de convenios (se usa para cargarlos)
    var caragarAgreementsTypess = function(tipos){
      $scope.agreementsTypes=tipos;
    }

    //callback de organizaciones (se usa para cargar los convenios)
    var caragarOrganizaciones = function(org){
      $scope.organizaciones=org;
    }

    //callback de status (se usa para cargar los convenios)
    var cargarStatus = function(estados){
      $scope.estados=estados;
    }

    $scope.guardarAgreement = function(ev){
      dataFactory.setAgreement($scope.convenio.borrado, $scope.convenio.codigo,$scope.convenio.nombre, $scope.convenio.desde,$scope.convenio.hasta, $scope.convenio.comentario, $scope.convenio.tipo, $scope.convenio.organizacion);
      $mdDialog.hide();
    }

    $scope.cancelarCargaAgreement = function(){
      $mdDialog.cancel();
    }

    $scope.buscar = function(){
      pageAgreement=0;
      $('#content').scrollTop(0);
      dataFactory.getAgreements(cargarUniversidades,$scope.agreementFilter);
      // $scope.showSearch = !$scope.showSearch;

    }

    $scope.cleanSearch = function(){
      pageAgreement=0;
      $('#content').scrollTop(0);
      $scope.agreementFilter.cadenaBuscada='';
      $scope.showSearch = !$scope.showSearch;
      dataFactory.getAgreements(cargarUniversidades,$scope.agreementFilter);
    }

    $scope.toastPosition = {
      bottom: true,
      top: false,
      left: true,
      right: false
    };

    $scope.agreementDeleted = function(){
      var filter={};
      dataFactory.getAgreements(cargarUniversidades, $scope.agreementFilter);

      //   var toast = $mdToast.simple()
      //   .content('Acuerdo eliminado')
      //   .action('DESHACER')
      //   .highlightAction(true)
      //   .position($scope.getToastPosition())
      //   .hideDelay(3000)
    

      // $mdToast.show(toast).then(function() {
      //     dataFactory.reinsertAgreement(0,function(){ //refreshing the view
      //       dataFactory.getAgreements(cargarUniversidades,$scope.agreementFilter);
      //       var t = $mdToast.simple()
      //             .content('Acuerdo restaurado')
      //             .position('bottom left')
      //             .hideDelay(4000);
      //       $mdToast.show(t);

      //     });
      // });
    }

    var agreementReinserted = function(){
      dataFactory.getAgreements(cargarUniversidades,$scope.agreementFilter);
      var t = $mdToast.simple()
        .content('Acuerdo restaurado')
        .position('bottom left')
        .hideDelay(4000);
      $mdToast.show(t);
    }

    $scope.getToastPosition = function() {
      return Object.keys($scope.toastPosition)
      .filter(function(pos) { return $scope.toastPosition[pos]; })
      .join(' ');
    };

    $scope.deleteAgreement = function(convenio){

      var confirm = $mdDialog.confirm()
        .title('¿Esta seguro de borrar el acuerdo '+convenio.title+'?')
        .content('El acuerdo se borrará definitivamente y no podrá ser recuperado.')
        .ariaLabel('Borrar')
        .ok('Si')
        .cancel('No')
                // .targetEvent(ev);
      $mdDialog.show(confirm).then(function() {
        $scope.convenioSeleccionado.nombre=convenio.title;
        $scope.convenioSeleccionado.nro=convenio.number_agreement;
        $scope.convenioSeleccionado.tipo=convenio.type;
        $scope.convenioSeleccionado.id=convenio.id;
        dataFactory.deleteAgreement(convenio.id,$scope.agreementDeleted);
      }, function() {
        
      });

      
    }

    $scope.reinsertAgreement = function(convenio){
      $scope.convenioSeleccionado.nombre=convenio.title;
      $scope.convenioSeleccionado.nro=convenio.number_agreement;
      $scope.convenioSeleccionado.tipo=convenio.type;
      $scope.convenioSeleccionado.id=convenio.id;
      dataFactory.reinsertAgreement(convenio.id,agreementReinserted);
    }





    $scope.cargarDatosAgreement = function(data){
      $scope.plazas = {};
      $scope.plazas.datos = [];
      $scope.plazas.datos = data;
    }

    $scope.updateAgreement=function(agr){
      dataFactory.updateAgreement(agr);

      if($scope.statusAvaibles){
        var status = findFirstOccurrence($scope.statusAvaibles, "id", agr.agreement_status_id);
        agr.agreement_status_name=status.name;
      }
      if($scope.typesAvaibles){
        var type = findFirstOccurrence($scope.typesAvaibles, "id", agr.agreement_type_id);
        agr.agreement_type_name=type.name;
      }
    }

    $scope.prueba=function(key, data, plaza, aux){
      plaza[key]=aux;
    }

    $scope.cargarResponsablesAgreement = function(data){
      $scope.convenioSeleccionado.responsables=[];
      if(data.length>0){
        
        var envio=[];
        var recepcion=[];
        var row = {};
        var i=0;
        for(;i<data.length;i++){
            if((i>0)&&(data[i-1].org_original_name!=data[i].org_original_name)){
              row = {};
              row.org_original_name=data[i-1].org_original_name;
              row.org_short_name=data[i-1].org_short_name;
              row.reception_student=recepcion;
              row.sending_student=envio;
              envio=[];
              recepcion=[];
              $scope.convenioSeleccionado.responsables.push(row);
            }
            if(data[i].reception_student){
              row = {};
              row.name=data[i].name;
              row.email=data[i].email;
              row.tel=data[i].tel;
              recepcion.push(row);
            }

            if(data[i].sending_student){
              row = {};
              row.name=data[i].name;
              row.email=data[i].email;
              row.tel=data[i].tel;
              envio.push(row);
            }

         // }
        }
        row = {};
        row.org_original_name=data[i-1].org_original_name;
        row.org_short_name=data[i-1].org_short_name;
        row.reception_student=recepcion;
        row.sending_student=envio;
        $scope.convenioSeleccionado.responsables.push(row);
      }
    }

    //Inicializacion de aplicacion
    var filter={};
    dataFactory.getAgreements(cargarUniversidades,$scope.agreementFilter);
    dataFactory.getAgreementsTypes(caragarAgreementsTypess);
    dataFactory.getOrganizations(caragarOrganizaciones);
    dataFactory.getStatus(cargarStatus);
    //dataFactory.getConveniosXOrg();

    $scope.changeView = function(){
      $('#content').scrollTop(0);
      pageAgreement=0;
      $scope.agreementFilter.showErased=!$scope.agreementFilter.showErased;
      dataFactory.getAgreements(cargarUniversidades,$scope.agreementFilter);
    }

    $scope.loadStatus = function(){
      var promesa=dataFactory.loadStatusPromise();
      promesa.success(function(data) {
        $scope.statusAvaibles = data;
      });
    }

    $scope.loadTypes = function(){
      var promesa=dataFactory.loadTypesPromise();
      promesa.success(function(data) {
        $scope.typesAvaibles = data;
      });
    }

    $scope.getAgreementData = function(convenio){
      $scope.convenioSeleccionado.nombre=convenio.title;
      $scope.convenioSeleccionado.nro=convenio.number_agreement;
      $scope.convenioSeleccionado.tipo=convenio.type;
      $scope.convenioSeleccionado.id=convenio.id;
      dataFactory.getConveniosXOrg(convenio.id,$scope.cargarDatosAgreement);
      dataFactory.getResponsableXOrgXConvenio(convenio.id,$scope.cargarResponsablesAgreement);
    }

  $scope.showAdd = function(ev){
    $mdDialog.show({
      controller: KunturController,
      templateUrl: 'views/wizardNuevoConvenio.html',
      parent: angular.element(document.body),
      targetEvent: ev
    })
    .then(function(id){
      // alert(id);
      dataFactory.findAgreementById(cargarUniversidades,id);
    });
  }

  $scope.modResponsables = function(ev, convenio){
    $scope.convenioSeleccionado.nombre=convenio.title;
    $scope.convenioSeleccionado.nro=convenio.number_agreement;
    $scope.convenioSeleccionado.tipo=convenio.type;
    $scope.convenioSeleccionado.id=convenio.id;
    $mdDialog.show({
      templateUrl: 'views/updateResponsables.html',
       locals: {
           id: $scope.convenioSeleccionado.id
         },
      parent: angular.element(document.body),
      targetEvent: ev,
      controller: responsablesController
    })
    .then(function(id){
      dataFactory.findAgreementById(cargarUniversidades,id);
    });
  }

  var responsablesController = function($scope, $mdDialog, id, $mdDialog, $filter){
    // alert(id);
    $scope.newAgreement={};
    $scope.universitiesFilter = {};
    $scope.newAgreement.universities=[];
    $scope.newAgreement.UniversitySearch="";
    $scope.newAgreement.Contacts=[];
    $scope.newAgreement.orgs2Lvl=[];
    $scope.newAgreement.selectedOrgs2Lvl=[];
    $scope.newAgreement.plazasIn=[];
    $scope.newAgreement.plazasOut=[];
    $scope.newAgreement.universitiesInsert=[];
    $scope.newAgreement.universitiesDelete=[];
    $scope.newAgreement.selectedOrgs2LvlInsert=[];
    $scope.newAgreement.selectedOrgs2LvlDelete=[];
    $scope.newAgreement.contactsInsert=[];
    $scope.newAgreement.title;
    $scope.newAgreement.from_date;
    $scope.newAgreement.to_date;
    $scope.newAgreement.status_name;
    $scope.newAgreement.type_name;
    $scope.newAgreement.agreement_type_id;
    $scope.newAgreement.agreement_status_id;
    $scope.wizardIndice=null;

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

    var page = 0;
    $scope.loadUniversities = function(){
      page += 1;
      //console.log(page);
      dataFactory.getUniversities(function(universities){
        $scope.universities = $scope.universities.concat(universities);
      },$scope.universitiesFilter, page);
    };

    function toggleUsersList() {
      var pending = $mdBottomSheet.hide() || $q.when(true);

      pending.then(function(){
        $mdSidenav('left').toggle();
      });
    }

    var getUniversities = function(organizations){
      $scope.universities=organizations;
    }

    $scope.addContryToAgreement=function(university){
      // //console.log($scope.newAgreement.universities);
      // //console.log(university);
      if(findFirstOccurrence($scope.newAgreement.universities, 'id', university.id) < 0){//$scope.newAgreement.universities.indexOf(university)==-1
        $scope.newAgreement.universities.push(university);
        $scope.newAgreement.universitiesInsert.push(university);
      }
      dataFactory.getResponsableXOrgs(loadContacts, $scope.newAgreement.universities);
    }

    $scope.removeContryToAgreement=function(university){
      $scope.newAgreement.universities.splice($scope.newAgreement.universities.indexOf(university),1);
      if($scope.newAgreement.universitiesInsert.indexOf(university)!=-1){//se ahbia agregado recientemente
        $scope.newAgreement.universitiesInsert.splice($scope.newAgreement.universitiesInsert.indexOf(university),1);
      }else{//se esta borrando una universidad cargada anteriormente
        $scope.newAgreement.universitiesDelete.push(university);
      }
      //for(var i=0;iz)
      $scope.newAgreement.Contacts=$scope.newAgreement.Contacts.filter( function(item) {
        return !(university.id == item.org_id);
      } );
      
      $scope.newAgreement.selectedContactsOut=[];
      $scope.newAgreement.selectedContactsIn=[];
    }

    $scope.searchUniversity=function(){
      $('#universitiesContainer').scrollTop(0);
      page=0;
      $scope.universities=[];
      $scope.universitiesFilter.searchText=$scope.newAgreement.UniversitySearch;
      dataFactory.getUniversities(getUniversities,$scope.universitiesFilter);
    }

    $scope.removeFilters=function(){
      $('#universitiesContainer').scrollTop(0);
      page=0;
      $scope.universities=[];
      $scope.universitiesFilter.countryCode=null;
      $scope.universitiesFilter.searchText="";
      dataFactory.getUniversities(getUniversities);
    }

    var loadContacts=function(data){
      var aux=JSON.parse(data[0].f_responsablesbyorg);
      // $scope.newAgreement.Contacts=[];

      for(var i in aux){
        //console.log(aux[i]);

        if(findFirstOccurrence($scope.newAgreement.Contacts, 'contact_id', aux[i].id) < 0 && findFirstOccurrence($scope.newAgreement.Contacts, 'id', aux[i].id) < 0){
          $scope.newAgreement.Contacts.push(aux[i]);
        }
        //$scope.newAgreement.Contacts=JSON.parse(data[0].f_responsablesbyorg);
      }
      
      $scope.newAgreement.Contacts=$filter('orderBy')($scope.newAgreement.Contacts, 'org_original_name', true);
    }

    $scope.selectContact=function(con){
      if((typeof con.existsInAgreementContact === 'undefined')&&(!con.in||!con.out)){
        $scope.newAgreement.contactsInsert.push(con);
      }
    }

    var getOrgs2Lvl=function(data){
      //$scope.newAgreement.orgs2Lvl=data;
      $scope.orgsTree=[];
      $scope.orgsTree.push(data);
    }

    $scope.selectOrg2Lvl = function(org){
      if($scope.newAgreement.selectedOrgs2Lvl.indexOf(org)==-1){
        $scope.newAgreement.selectedOrgs2Lvl.push(org);
        $scope.newAgreement.selectedOrgs2LvlInsert.push(org);
      }
    }

    $scope.addChildrenOrg = function(org){
      if($scope.newAgreement.selectedOrgs2Lvl.indexOf(org)==-1){
        org.org_id=org.id;//Este paso es necesario porque las org que se cargaron con anterioridad (cuando se abre el acuerdo) son otro tipo de dato, quedando org_id como el id de la org
        $scope.newAgreement.selectedOrgs2Lvl.push(org);
        $scope.newAgreement.selectedOrgs2LvlInsert.push(org);
      }
    }

    $scope.removeOrg2LvlFromAgreement = function(org){
      $scope.newAgreement.selectedOrgs2Lvl.splice($scope.newAgreement.selectedOrgs2Lvl.indexOf(org),1);
      if($scope.newAgreement.selectedOrgs2LvlInsert.indexOf(org)!=-1){
        $scope.newAgreement.selectedOrgs2LvlInsert.splice($scope.newAgreement.selectedOrgs2LvlInsert.indexOf(org),1);//se agrego en esta operacion, no llego a l abase
      }else{
        $scope.newAgreement.selectedOrgs2LvlDelete.push(org);//se esta quitando una org que estaba cargada en la base
      }
    }

    $scope.cancelAgreement=function(){
      $mdDialog.cancel();
    }

    var getSelectedOrgs = function(agreement){
      //console.log("agreement");
      //console.log(agreement);
      $scope.newAgreement.title=agreement.title;
      $scope.newAgreement.from_date=$filter('date')(agreement.from_date, "dd/MM/yyyy");
      $scope.newAgreement.to_date=$filter('date')(agreement.to_date, "dd/MM/yyyy");
      // $scope.newAgreement.from_date=agreement.from_date;
      $scope.newAgreement.status_name=agreement.status_name;
      $scope.newAgreement.type_name=agreement.type_name;
      $scope.newAgreement.agreement_type_id=agreement.agreement_type_id;
      $scope.newAgreement.agreement_status_id=agreement.agreement_status_id;

      for(ai in agreement.agreementItem){
        var orgAux={};
        $scope.newAgreement.plazasIn[agreement.agreementItem[ai].org_id]=[];
        $scope.newAgreement.plazasOut[agreement.agreementItem[ai].org_id]=[];
        orgAux.id=agreement.agreementItem[ai].org_id;
        orgAux.short_name=agreement.agreementItem[ai].short_name;
        orgAux.original_name=agreement.agreementItem[ai].original_name;
        orgAux.country_code=agreement.agreementItem[ai].country_code;
        $scope.newAgreement.universities.push(orgAux);

        for(c in agreement.agreementItem[ai].contacts){
          var contactAux={};
          contactAux.id=agreement.agreementItem[ai].contacts[c].id;
          if(agreement.agreementItem[ai].contacts[c].reception_student){
            contactAux.in=true;
          }
          if(agreement.agreementItem[ai].contacts[c].sending_student){
            contactAux.out=true;
          }
          contactAux.org_short_name=agreement.agreementItem[ai].contacts[c].short_name;
          contactAux.org_original_name=agreement.agreementItem[ai].contacts[c].original_name;
          contactAux.org_web_site=agreement.agreementItem[ai].contacts[c].web_site;
          contactAux.org_id=agreement.agreementItem[ai].contacts[c].org_id;
          contactAux.person_given_name=agreement.agreementItem[ai].contacts[c].given_name;
          contactAux.person_middle_name=agreement.agreementItem[ai].contacts[c].middle_name;
          contactAux.person_family_name=agreement.agreementItem[ai].contacts[c].family_name;
          contactAux.person_id=agreement.agreementItem[ai].contacts[c].person_id;
          contactAux.contact_id=agreement.agreementItem[ai].contacts[c].contact_id;

          contactAux.existsInAgreementContact=true;
          $scope.newAgreement.Contacts.push(contactAux);
        }


        for(aio in agreement.agreementItem[ai].agreementItemOu){
          if(ai==0)
            $scope.newAgreement.selectedOrgs2Lvl.push(agreement.agreementItem[ai].agreementItemOu[aio]);
          $scope.newAgreement.plazasIn[agreement.agreementItem[ai].org_id][agreement.agreementItem[ai].agreementItemOu[aio].org_id]=agreement.agreementItem[ai].agreementItemOu[aio].in_units;
          $scope.newAgreement.plazasOut[agreement.agreementItem[ai].org_id][agreement.agreementItem[ai].agreementItemOu[aio].org_id]=agreement.agreementItem[ai].agreementItemOu[aio].out_units;
          //console.log($scope.newAgreement.plazasIn);
        }
        $scope.newAgreement.plazasIn[agreement.agreementItem[ai].org_id]['UNC']=agreement.agreementItem[ai].in_units;
        $scope.newAgreement.plazasOut[agreement.agreementItem[ai].org_id]['UNC']=agreement.agreementItem[ai].out_units;
      }
      dataFactory.getResponsableXOrgs(loadContacts, $scope.newAgreement.universities);//Cargar los contactos que no estan en agreement_contact
    }


    $scope.submitAgreement = function(){
  
      var agreement={};
      agreement.agreementItem=[];
      agreement.id=id;
      agreement.universitiesInsert=$scope.newAgreement.universitiesInsert;
      agreement.universitiesDelete=$scope.newAgreement.universitiesDelete;
      agreement.selectedOrgs2LvlInsert=$scope.newAgreement.selectedOrgs2LvlInsert;
      agreement.selectedOrgs2LvlDelete=$scope.newAgreement.selectedOrgs2LvlDelete;
      agreement.contactsInsert=$scope.newAgreement.contactsInsert;
      for(i in $scope.newAgreement.plazasIn){
        var agreementItem={};
        agreementItem.agreementItemOu=[];
        agreementItem.id=i;
        agreementItem.contacts = $.grep($scope.newAgreement.Contacts, function(e){ return (e.org_id == i && (e.in==true || e.out==true || typeof e.existsInAgreementContact !== 'undefined')) });
        for(j in $scope.newAgreement.plazasIn[i]){
          var agreementItemOu={};
          agreementItemOu.id=j;
          agreementItemOu.in=$scope.newAgreement.plazasIn[i][j];
          agreementItemOu.out=$scope.newAgreement.plazasOut[i][j];
          agreementItem.agreementItemOu.push(agreementItemOu);
        }
        agreement.agreementItem.push(agreementItem)
      }

    

    // var agr={};
    agreement.id=id;
    agreement.title=$scope.newAgreement.title;
    agreement.from_date=$scope.newAgreement.from_date;
    agreement.to_date=$scope.newAgreement.to_date;
    agreement.agreement_type_id=$scope.newAgreement.agreement_type_id;
    agreement.agreement_status_id=$scope.newAgreement.agreement_status_id;


    var inputs = $('.inputPlazas');
    var errorInputs=false;
    for(i in inputs){
      if($('.inputPlazas')[i].value==""){
        errorInputs=true;
      }
    }

    if($scope.newAgreement.title=="" || $scope.newAgreement.from=="" || $scope.newAgreement.to=="" || $scope.newAgreement.type=="" || $scope.newAgreement.status==""){
      // alert("Faltan datos por completar");
      var toast = $mdToast.simple()
        .content('Faltan datos por completar en el paso 1')
        .position('bottom left')
        .hideDelay(4000);
      $mdToast.show(toast);
    }else if(agreement.from_date>agreement.to_date){
      // dataFactory.updateAgreement(agr);
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
        dataFactory.updateAgreementData(agreement,succesAgreement);
        $mdDialog.hide([id]);
    }




    }

    var succesAgreement=function(id){
      $mdDialog.hide([id]);
    }

    $scope.searchUniversityCountry=function(code, name, flag){
      page = 0;
      $('#universitiesContainer').scrollTop(0);
      $scope.universities=[];
      $scope.universitiesFilter.countryCode=code;
      $scope.universitiesFilter.name=name;
      $scope.universitiesFilter.flag=flag;
      dataFactory.getUniversities(getUniversities,$scope.universitiesFilter);
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


    var getAgreementsTypes = function(types){
      $scope.agreementsTypes=types;
    }

    var cargarStatus = function(estados){
      $scope.estados=estados;
    }

    dataFactory.getAgreementsTypes(getAgreementsTypes);
    dataFactory.getStatus(cargarStatus);

    dataFactory.getUniversities(getUniversities);
    dataFactory.orgs2lvl(getOrgs2Lvl);
    dataFactory.getSelectedOrgs(id, getSelectedOrgs);

  }

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
