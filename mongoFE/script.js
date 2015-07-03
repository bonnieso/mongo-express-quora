'use strict';

angular.module('heimdall', ['ngRoute'])
.constant("ATN", {
  "API_URL": "http://localhost:3000"
})
.factory('Question', function($http, ATN) {
  return {
    getAll: function() {
      return $http.get(ATN.API_URL + "/questions");
    },

    addQuestion: function(newQuestion) {
      return $http.post(ATN.API_URL + "/questions", newQuestion);
    },
    
    getOne: function(oneID) {
      return $http.get(ATN.API_URL + "/questions/"+oneID);
    },
  }
})
.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'MainCtrl',
      templateUrl: 'display.html'
    })
    .when("/question/:id", {
      controller: 'QuestionCtrl',
      templateUrl: 'question.html'     
    })
    .otherwise({
      redirectTo: '/'
    })
})
.controller('MainCtrl', function($scope, Question, $location){
  Question.getAll().success(function(data) {
    $scope.questions = data;
  }).catch(function(err) {
    console.error(err);
  });

  $scope.askQuestion = function() {
    Question.addQuestion($scope.question)
      .success(function(data) {
        $scope.questions.unshift(data);
        $scope.question = {};
        $("#new-question-modal").modal("hide");
      })
      .catch(function(err) {
        console.error(err);
      })
  };
  
  
  $scope.reload = function(){
    $location.path("/");
  }

})
.controller('QuestionCtrl', function($scope, $http, $routeParams, Question){
  
  console.log("hello");

    Question.getOne($routeParams.id)
      .success(function(data){
      console.log(data);
      $scope.oneQuestion = data;
    })
      .catch(function(err) {
        console.log(err);
    });
  
});
