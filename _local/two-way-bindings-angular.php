<?php require_once("two-way-bindings-config.php"); ?>
<!doctype html>
<html ng-app>
  <head>
    <title>Angular</title>
    <script src="vendors/angular.min.js"></script>
    <style>
      #content {
        padding: 10px;
      }
      #content span {
        padding: 0 2px 0 2px;
        display: inline-block;
        border-radius: 2px;
      }
      #content, #content span {
        border: #999 solid 1px;
      }
      #content input {
        display: block;
      }
    </style>
    <script type="text/javascript">
      function TodoCtrl($scope) {
        $scope.list = [];
        for(var i=0; i<<?php echo ELEMENTS; ?>; i++) {
          $scope.list.push(i);
        }
        $scope.method = function() {
          $scope.list[600] = Math.floor((Math.random()*100000)+1);
        }
      }
    </script>
  </head>
  <body>
    <div id="content" ng-controller="TodoCtrl">
      <input type="text" ng-model="text">
      <input type="button" ng-click="method()" value="click me" />
      <p>{{text}}</p>
      <span ng-repeat="item in list">
        {{item}}
      </span>
    </div>
    <script type="text/javascript">
      window.onload = function() {
        
      }
    </script>
  </body>
</html>