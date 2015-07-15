Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  var app = angular.module("simple-todos",['angular-meteor']);

  app.controller("TodosListCtrl", ['$scope', '$meteor', function($scope, $meteor){

      $scope.$watch('hideCompleted', function() {
        if ($scope.hideCompleted) {
          $scope.query = {checked: {$ne: true}};
        } else {
          $scope.query = {};
        }
      });

      $scope.tasks = $meteor.collection(function() {
        return Tasks.find($scope.getReactively('query'), {sort: {createdAt: -1}})
      });

      $scope.incompleteCount = function () {
        return Tasks.find({ checked: {$ne: true} }).count();
      };

      $scope.addTask = function(newTask) {
        $scope.tasks.push( {
          text: newTask,
          createdAt: new Date() }
        );
      };

  }]);
}