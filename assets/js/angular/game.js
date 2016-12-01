var app = angular.module('myApp', []);

app.controller('gameController', function($scope, $http, $window) {

	var wordList;
	var counter = 1;
	var usercurrent = window.x;

	console.log(usercurrent);

	$scope.buttonTitle = "Next Set";

	$http({
			url: '/game/getwords',
			method: 'GET',
			params: {usercurrent: usercurrent}
		}).then(function getCallback(response) {

		wordList = response.data;
		console.log(wordList);

		$scope.word1 = wordList[0][0];
		$scope.word2 = wordList[0][1];
		$scope.hint = wordList[0][2];

		$scope.buttonPressed = function() {

			if(counter == wordList.length-1) {
				$scope.buttonTitle = 'Finish memorizing';
				$window.location.href = '/game/test';
			}

			$scope.word1 = wordList[counter][0];
			$scope.word2 = wordList[counter][1];
			$scope.hint = wordList[counter++][2];
		}
	}, function getError(error) {

		console.log('Internal Server Error: 500');
	});
});