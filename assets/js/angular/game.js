var app = angular.module('myApp', []);

app.controller('gameController', function($scope, $http) {
	$scope.firstname = window.x;

	$http.get('/getwords').then(function getCallback(response) {

		console.log(response.data.week1.word1);
		$scope.firstname = response.data.userinfo;

	}, function getError(error) {});
});