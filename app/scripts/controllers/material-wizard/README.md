# material-wizard
mt-wizard` Angularjs wizard based on angular material inspired fromangular wizard https://github.com/mgonto/angular-wizard
Usually a form is  be defined inside this step. But a form can be defined for all the steps. use the on onExit on mt-wz-step and the onFinish on the mt-wizard to control the data or api call submitted the server

A demo can be found under http://plnkr.co/edit/rp5qJykW2DD1A7EvaVZP?p=preview

# Dependencies
material-wizard depends on Angular and angular material.

# Usage

First you need to add the module dependency 
````js
angular.module( 'app', ['ngMaterial','material.wizard'] );
````
and then add the html part 
```html
 <mt-wizard btn-progress-color="#D8D8D8"  btn-bg-color="#FAFAFA" active-btn-bg-color="#E9E9E9"  >
    <mt-wz-step title="Step 1" step-img="step1.svg"   >
        <form name="formStep1"  novalidate layout="column" layout-sm="column" layout-align="start start">
           <md-input-container >
             <label>Field 1</label>
             <input   name="field1" ng-model="field1"  type="text" required step-fill-percent="67"  step-index="0">
             <div ng-show="field1.$dirty " ng-messages="field1.$error">
               <div ng-message="required">Item name is required</div>
             </div>
           </md-input-container>
           <md-input-container >
             <label>Field 2</label>
             <input   name="field2" ng-model="field2"  type="text" required step-fill-percent="34"  step-index="0">
             <div ng-show="field2.$dirty " ng-messages="field2.$error">
               <div ng-message="required">Item name is required</div>
             </div>
           </md-input-container>
          </form>
    </mt-wz-step>
    <mt-wz-step title="Step 2" step-img="step2.svg" >
   <form name="formStep1"  novalidate layout="column" layout-sm="column" layout-align="start start">
           <md-input-container >
             <label>Field 1</label>
             <input   name="field1" ng-model="field1"  type="text" required step-fill-percent="67"  step-index="1">
             <div ng-show="field1.$dirty " ng-messages="field1.$error">
               <div ng-message="required">Item name is required</div>
             </div>
           </md-input-container>
           <md-input-container >
             <label>Field 2</label>
             <input   name="field2" ng-model="field2"  type="text" required step-fill-percent="35"  step-index="1">
             <div ng-show="field2.$dirty " ng-messages="field2.$error">
               <div ng-message="required">Item name is required</div>
             </div>
           </md-input-container>
           <md-input-container >
             <label>Field 3</label>
             <input   name="field3" ng-model="field3"  type="text" required step-fill-percent="35"  step-index="1">
             <div ng-show="field3.$dirty " ng-messages="field3.$error">
               <div ng-message="required">Item name is required</div>
             </div>
           </md-input-container>
          </form>
    </mt-wz-step>
 

  </mt-wizard>
````
## Directive parameters:
### mt-wizard
 btn-progress-color: color of the  circular progress that will be showed in the step circle
 btn-bg-color: normal button progress color
 active-btn-bg-color: selected button progress color
### mt-wz-step
 title: Title of the step that will be displayed in the top left of wizard
 step-img: An svg image that will displayed in the step circle
 step-fill: Percent of the circular progress that will be showed in the step circle
 onExit: function call on exit of the step, normally a form submit or server api call
### step-fill-percent
 step-fill-percent: how much the circular progress should be increased
 step-index: mt-wz-step current index (starting with 0)
