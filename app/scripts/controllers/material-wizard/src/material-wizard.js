(function() {
  'use strict';
  var mtWizard = angular.module('material.wizard', ['ngMaterial', 'ngAnimate']);

  /**
   * @ngdoc directive
   * @name mtWizard
   * @module material.wizard
   *
   * @description
   * `mt-wizard` Angularjs wizard based on angular material inspired fromangular wizard
   * https://github.com/mgonto/angular-wizard
   * Usually a form is  be defined inside this step. But a form can be defined for all the steps.
   * use the on onExit on mt-wz-step and the onFinish on the mt-wizard to control the data or api call submitted
   * the server
   * @param {string@} btn-progress-color color of the  circular progress that will be showed in the step circle
   * @param {string@} btn-bg-color normal button progress color
   * @param {string@} active-btn-bg-color selected button progress color

   * @usage
   * <hljs lang="html">
   *      <mt-wizard btn-progress-color="#D8D8D8"  btn-bg-color="#FAFAFA" active-btn-bg-color="#E9E9E9"  >
   *        <mt-wz-step title="Step 1" step-img="stepimage.svg" onExit="submitFormStep1">...</mt-wz-step>
   *        <mt-wz-step title="Step 2" step-img="stepimage.svg" onExit="submitFormStep2">...</mt-wz-step>
   *      <mt-wizard>
   * </hljs>
   */
  mtWizard.directive('mtWizard', ['$timeout', '$document','stepsArray',
    function (timer, $document,stepsArray) {
      return {
        scope: {
          //UI
          btnBgColor: '@',
          activeBtnBgColor: '@',
          inactiveBtnBgColor: '@',
          btnProgressColor: '@',
          activeBtnProgressColor: '@',
          principalTitle: '@',
          //Actions
          onFinish: '&',
          index: '='

        },
        restrict: 'E',
        transclude: true,
        controller: ['$scope', function ($scope) {
          $scope.selectedIndex = 0;
          $scope.curentStepTitle = "";
          var steps = $scope.steps = [];
          $scope.btnBgColor="#00BCD4";
          $scope.inactiveBtnBgColor="#00BCD4";
          $scope.activeBtnProgressColor="#C27ACE";
          $scope.firstStep=true;

          this.addStep = function (stepScope) {
            steps.push(stepScope);
            stepsArray.push(stepScope);
            stepScope.progresscircleStyle = {"background-color": $scope.btnProgressColor};
            stepScope.wizardBtnStyle = {"background-color": $scope.btnBgColor};
            if (steps.length == 1) {
              setStepActive(stepScope, true);
            }
          };

          $scope.next = function () {
            steps[$scope.selectedIndex].onExit();
            $scope.goto(Math.min($scope.selectedIndex + 1, steps.length - 1));
          };

          $scope.previous = function () {
            $scope.goto(Math.max($scope.selectedIndex - 1, 0));
          };

          //Central function to select a step. All must go through it
          $scope.goto = function (stepNr) {
            $scope.index=stepNr;
            if(stepNr==0){
              $scope.firstStep=true;
            }else{
              $scope.firstStep=false;
            }
            setStepActive(steps[$scope.selectedIndex], false);
            $scope.selectedIndex = stepNr;
            setStepActive(steps[stepNr], true);
          };


          /**
           * @param stepScope
           * @param active set to true if current step else false
           */
          function setStepActive(stepScope, active) {
            stepScope.selected = active;
            $scope.curentStepTitle = active ? stepScope.title : "";
            //stepScope.wizardBtnStyle = {"background-color": active ? $scope.activeBtnBgColor : $scope.btnBgColor};
            // $scope.elemento.style.backgroundColor = "red";
            if(active){
              stepScope.wizardBtnStyle = {"background-color": "#C27ACE"};
            }else{
              stepScope.wizardBtnStyle = {"background-color": "#00BCD4"};
            }
          }
        }],
        template: function (scope, element, attributes) {
          var template =
            '<div layout="column" class="md-whiteframe-z1" layout-padding style="height:92%;display:flex;width:100%;">' +//;height:100%
            ' <div layout="row"  layout-sm="column" layout-align="space-between start" layout-margin">' +
            '  <div><h2 style="color: #00BCD4;">{{principalTitle}}<h2></div>' +

            '  <div layout="row" layout-align="end center" layout-margin>' +
            '  <div  ng-repeat="step in steps" layout="row" layout-align="center center"  ng-click="goto($index)" >' +
            '   <md-button class="md-fab  wizard-button" aria-label="step button"  >' +
            '     <div class="circle-loader-wrap" ng-style="step.progresscircleStyle"><div class="circle-loader-wrap after" ng-style="step.wizardBtnStyle" ></div></div>' +
            '     <div class="wizard-step-img" style="position: initial;"><md-icon md-svg-src="{{step.stepImg}}" class="icon"></md-icon></div>' +
            '     <md-progress-circular md-mode="determinate" md-diameter="63"  value="{{step.stepFill}}"></md-progress-circular>' +
            '   </md-button>' +
            '   <md-progress-linear md-mode="determinate" value="0" md-mode="buffer" md-buffer-value="100" class="md-primary wizard-progress-linear" ng-show="$index<steps.length-1"></md-progress-linear >' +
            '  </div>' +
            ' </div>' +
            '</div>' +
            '<!--<md-divider ></md-divider>-->' +
            '<div layout="row"  class="wizard-container" ng-transclude style="height:77%;" ></div>' +//margin-top:90px;
            '<div layout="row" layout-align="space-between start" style="">' +//padding-top:35%;layout-align="end center"
            '  <md-button style="margin-left:15px;" class="md-fab wizard-chevron-left" aria-label="previous" ng-click="previous()" id="leftButton" ng-disabled="firstStep"></md-button>' +//ng-show="selectedIndex > 0 "
            '  <h3 style="margin-top:33px;">{{curentStepTitle}}</h3>'+
            '  <md-button layout-align="center center" class="md-fab wizard-chevron-right" aria-label="next" ng-click="next()" id="rightButton"  ng-if="selectedIndex < steps.length -1"></md-button>' +
            '  <md-button class="md-fab wizard-finish" aria-label="finish" ng-click="onFinish()" id="okButton" ng-if="selectedIndex == steps.length -1"></md-button>' +
            ' </div>';
            '</div>';
          return template;

        },
        link: function (scope, element, attrs) {
          var updateProgressStyle = function () {
            var progressBars = $document[0].querySelectorAll("md-progress-linear .md-container");
            angular.forEach(progressBars, function (progressBar) {
              angular.element(progressBar).css('background-color', scope.btnProgressColor);
            });
          };
          timer(updateProgressStyle, 0);
        }
      };
    }
  ]);

  /**
   * @ngdoc directive
   * @name mtWzStep
   * @module material.wizard
   *
   * @description
   * `mt-wz-step` Used to define a step inside the wizard. Usually a form is  be defined inside this step
   *
   * @param {string@} title Title of the step that will be displayed in the top left of wizard
   * @param {string@} step-img An svg image that will displayed in the step circle
   * @param {float@} step-fill Percent of the circular progress that will be showed in the step circle
   * @param {expression@} onExit function call on exit of the step, normally a form submit or server api call
   * @usage
   * <hljs lang="html">
   *    <mt-wz-step title="Step 1" step-img="stepimae.svg" onExit="submitForm"></mt-wz-step>
   * </hljs>
   */
  mtWizard.directive('mtWzStep', function () {
    return {
      require: '^mtWizard',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        title: '@',
        stepImg: '@',
        stepFill: '@',
        onExit: '&'
      },
      template: '<div ng-show="selected"  ng-transclude layout-fill> </div>',
      link: function (scope, element, attrs, wizardCtrl) {
        scope.stepFill = 0;
        scope.nextProgressValue = 0;
        wizardCtrl.addStep(scope);
      }
    };
  });

  /**
   * @ngdoc directive
   * @name stepFillPercent
   * @module material.wizard
   *
   * @description
   * `step-fill-percent` Used to update the value of the attribute stepFill of the current step.
   * This will update the circular progress of thhe current step
   *
   * @param {string@} step-fill-percent how much the circular progress should be increased
   * @param {string=} step-index mtWzStep index
   * @usage
   * <hljs lang="html">
   *    <input   name="field1" ng-model="field1"  type="text" required step-fill-percent="30"  step-index="0">
   * </hljs>
   */
  mtWizard.directive('stepFillPercent',['stepsArray',
    function (stepsArray) {
      return {
        require: '?ngModel',
        restrict: 'A',
        link: function (scope, element, attrs,  ngModel, $rootScope) {
          var updated = false;
          //need to bypass the scope to avoid conflicting with other directives in the same level
          scope.stepIndex = scope.$eval(attrs.stepIndex);
          scope.stepFillPercent = scope.$eval(attrs.stepFillPercent);
          scope.$watch(attrs.ngModel, function () {
            if (ngModel.$valid ){
              if ( !updated){
                stepsArray[scope.stepIndex].stepFill =Math.min(parseInt(stepsArray[scope.stepIndex].stepFill)+  parseInt(scope.stepFillPercent),100);
                updated = true;
              }
            }else{
              if (updated){
                stepsArray[scope.stepIndex].stepFill = Math.max(parseInt(stepsArray[scope.stepIndex].stepFill) -parseInt( scope.stepFillPercent),0);
                updated = false;
              }
            }
          });
        }
      };
    }]);

  /**
   * TODO change to a service holding a list of wizards to avoid conflicts in case of more than one wizard
   */
  mtWizard.value('stepsArray', []);



})();

