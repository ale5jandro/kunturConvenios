(function(){

  angular
       .module('kunturApp')
       .controller('KunturControllerAle', [
          '$scope','$mdDialog', 'dataFactory','userService', '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$mdUtil',
          KunturController
       ]);

  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function KunturController( $scope, $mdDialog, dataFactory,userService,$mdSidenav, $mdBottomSheet, $log, $q, $mdUtil) {
    var self = this;

    self.selected     = null;
    self.users        = [ ];
    self.selectUser   = selectUser;
    self.toggleList   = toggleUsersList;
    self.showContactOptions  = showContactOptions;
    $scope.cadenaBuscada="";
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
    $scope.plazas = {};
    $scope.plazas.datos = [];
    $scope.plazas.cabeceras = [];

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

    //callback de universidades en la pantalla inicial
    var cargarUniversidades = function(universidades){
      $scope.universities=universidades;
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
      console.log(ev);
      dataFactory.setAgreement($scope.convenio.borrado, $scope.convenio.codigo,$scope.convenio.nombre, $scope.convenio.desde,$scope.convenio.hasta, $scope.convenio.comentario, $scope.convenio.tipo, $scope.convenio.organizacion);
      $mdDialog.hide();
    }

    $scope.cancelarCargaAgreement = function(){
      $mdDialog.cancel();
    }

    $scope.buscar = function(){
      console.log("busque");
      dataFactory.getAgreements(cargarUniversidades,$scope.cadenaBuscada);
    }

    $scope.cargarDatosAgreement = function(data){
      console.log("data");

      console.log(data);
      $scope.plazas = {};
      $scope.plazas.datos = [];
      // $scope.plazas.cabeceras = [];
      // $scope.convenioSeleccionado.cantidad=data.length;
      // var i;
      // for(i in data[0]){
      // var auxArray=[];
      // var auxObject=[];
      // for(var i in data.fields){
      //   $scope.plazas.cabeceras.push(data.fields[i].name);
        // for(var j=0;j<data.rows.length;j++){
        //   auxObject.i
        // }
      // }

      // for(var i=0;i<data.rows.length;i++){
      //   auxObject={};
      //   for(var j=0;j<data.fields.length;j++){
      //     auxObject[j]=data.rows[i][(data.fields[j].name)];
      //   }
      //   auxArray.push(auxObject);
      // }
      // console.log($scope.plazas.cabeceras);
      // }

      // var aux=[];
      // for(var j=0;j<data.datos;j++){
      //   //$scope.plazas.datos = data;
      //   for(i in data[0]){
      //     aux.push(data(j).get(i));
      //   }
      // }
      // $scope.plazas.datos=aux;
      $scope.plazas.datos = data;
    }

    $scope.cargarResponsablesAgreement = function(data){

      $scope.convenioSeleccionado.responsables=[];
      var envio=[];
      var recepcion=[];
      var row = {};
      var i=0;
      for(;i<data.length;i++){
        //for (j in data[i]){
          //console.log(data[i][j]);
          //console.log(data[i].person_family_name);
          if((i>0)&&(data[i-1].org_short_name!=data[i].org_short_name)){
            row = {};
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
      row.org_short_name=data[i-1].org_short_name;
      row.reception_student=recepcion;
      row.sending_student=envio;
      $scope.convenioSeleccionado.responsables.push(row);
      // console.log()
      //$scope.convenioSeleccionado.responsables=data;
      console.log($scope.convenioSeleccionado.responsables);
    }

    //Inicializacion de aplicacion
    dataFactory.getAgreements(cargarUniversidades,"");
    dataFactory.getAgreementsTypes(caragarAgreementsTypess);
    dataFactory.getOrganizations(caragarOrganizaciones);
    dataFactory.getStatus(cargarStatus);
    //dataFactory.getConveniosXOrg();

    $scope.getAgreementData = function(convenio){
      // console.log("llama2");
      // console.log(convenio);
      $scope.convenioSeleccionado.nombre=convenio.name;
      $scope.convenioSeleccionado.nro=convenio.nro;
      $scope.convenioSeleccionado.tipo=convenio.type;
      dataFactory.getConveniosXOrg(convenio.id,$scope.cargarDatosAgreement);
      dataFactory.getResponsableXOrgXConvenio(convenio.id,$scope.cargarResponsablesAgreement);
    }

                    
  //   $scope.showAdd = function(ev) {
  //   $mdDialog.show({
  //     controller: KunturController,
  //     template: '<md-dialog aria-label="Mango (Fruit)"> ' +
  //                  '<md-content class="md-padding"> ' +
  //                     '<form name="nuevoConvenioForm">' +
  //                      '<div layout layout-sm="column">' +

  //                   ' <md-input-container flex> ' +
  //                   '    <md-select placeholder="Estado" ng-model="convenio.estado"> <md-option ng-repeat="sta in estados" value="{{sta.id}}">{{sta.name}}</md-option> ' +
  //                   ' </md-input-container> ' +
  //                    '  ' +
  //                    ' <md-input-container flex> ' +
  //                    '   <label>Nombre</label> <input ng-model="convenio.nombre"> ' +
  //                     '</md-input-container> ' +

  //                    ' <md-input-container flex> ' +
  //                    '   <label>Codigo</label> <input ng-model="convenio.codigo"> ' +
  //                    ' </md-input-container> </div>' +

  //                    ' <div layout layout-sm="column"> ' +
     
  //                    ' <md-input-container flex> ' +
  //                    '   <label>Fecha desde</label><input ng-model="convenio.desde" type="text" label="desde"></input>' +
  //                    ' </md-input-container> ' +

  //                   ' <md-input-container flex> ' +
  //                   '  <label>Fecha hasta</label><input ng-model="convenio.hasta" type="text"/>' +
  //                    ' </md-input-container>  ' +

  //                   ' <md-input-container flex> ' +
  //                   '    <md-select placeholder="Organizacion" ng-model="convenio.organizacion"> <md-option ng-repeat="org in organizaciones" value="{{org.id}}">{{org.name}}</md-option> ' +
  //                   ' </md-input-container> ' +

  //                   ' <md-input-container flex> ' +
  //                   '    <md-select placeholder="Tipo" ng-model="convenio.tipo"> <md-option ng-repeat="tipo in agreementsTypes" value="{{tipo.id}}">{{tipo.name}}</md-option> ' +
  //                   ' </md-input-container></div> ' +



  //                    ' <md-input-container flex> ' +
  //                   '    <label>Comentarios</label> <textarea ng-model="convenio.comentario" columns="1" md-maxlength="150"></textarea> ' +
  //                   '  </md-input-container> </form> ' +
  //                 '  </md-content> ' +
  //                ' <div class="md-actions" layout="row"> <span flex></span> ' +
  //                ' <md-button ng-click="cancelarCargaAgreement()"> Cancel </md-button> ' +
  //               '  <md-button ng-click="guardarAgreement($event)" class="md-primary"> Save </md-button> ' +
  //                ' </div>' +
  //                ' </md-dialog>',
  //     targetEvent: ev,
  //   })
  //   .then(function(answer) {
  //     $scope.alert = 'You said the information was "' + answer + '".';
  //   }, function() {
  //     $scope.alert = 'You cancelled the dialog.';
  //   });
  // };

  $scope.showAdd = function(ev){
    $mdDialog.show({
      controller: KunturController,
      templateUrl: 'views/wizardNuevoConvenio.html',
      parent: angular.element(document.body),
      targetEvent: ev
    });
  }




    // $scope.continents = [];
    // getContinents();
    // function getContinents() {
    //   dataFactory.getContinents()
    //     .success(function(data) {
    //       $scope.continents = data;
    //       console.log($scope.continents);
    //     })
    //     .error(function (error){
    //       console.log("Unable to load continents data." + error.message);
    //     });
    // }






  /*$scope.showSearchToolbar=function(){
    $scope.showSearch=!$scope.showSearch;
    //document.getElementById('inputSearchText').focus();// make the input ready for typing
    $("#inputSearchText").focus();
  }
*/

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
