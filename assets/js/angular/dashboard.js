var app = angular.module('dashboardApp', []);

app.controller('dashboardController', function($scope, $http) {

	$scope.userresult;
	$scope.hidden = {
		hint: false
	}


	$http({
		url: '/game/results',
		method: 'GET'
	}).then(function success(response) {

		$scope.results = response.data;

		$http({
			url: '/game/gettestwords',
			method: 'GET',
			params: {usercurrent: 1000}
		}).then(function success(response) {

			$scope.words = response.data;
			console.log($scope.words);

			$scope.result11 = function() {

				var userresult = $scope.results.gameresults.week1.game1;
				var i = 0;

				$scope.words.forEach(function(entry) {

					if(userresult.correctAnswers[i] == 1) {
						entry.push("right");
					} else {
						entry.push("wrong");
					}

					i++;
				});

				$scope.words.userresult = userresult;
				$scope.hidden.hint = true;
				$scope.userresults = $scope.results.gameresults.week1.game1.correctAnswers;
			}

			$scope.result12 = function() {
				$scope.userresult = results.gameresults.week1.game2;	
			}

			$scope.result13 = function() {
				$scope.userresult = results.gameresults.week1.game3;
			}

			$scope.result21 = function() {
				$scope.userresult = results.gameresults.week2.game1;
			}

			$scope.result22 = function() {
				$scope.userresult = results.gameresults.week2.game2;
			}

			$scope.result23 = function() {
				$scope.userresult = results.gameresults.week2.game3;
			}

			$scope.result31 = function() {
				$scope.userresult = results.gameresults.eek3.game1;
			}

			$scope.result32 = function() {
				$scope.userresult = results.gameresults.week3.game2;
			}

			$scope.result33 = function() {
				$scope.userresult = results.gameresults.week3.game3;
			}

			$scope.closebutton = function() {
				$scope.hidden.hint = false;
			}
		});


	}, function error(err) {

	});
});