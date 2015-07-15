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
        $meteor.call("addTask", newTask);
      };

      $scope.deleteTask = function(task) {
        $meteor.call("deleteTask", task._id);
      };

      $scope.setChecked = function(task) {
        $meteor.call("setChecked", task._id, !task.checked);
      };

  }]);

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

Meteor.methods({
  addTask: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteTask: function (taskId) {
    Tasks.remove(taskId);
  },
  setChecked: function (taskId, setChecked) {
    Tasks.update(taskId, { $set: { checked: setChecked} });
  }
});