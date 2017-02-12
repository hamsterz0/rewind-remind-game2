var app = angular.module('dashboardApp', []);

app.controller('dashboardController', function($scope, $http) {

	$scope.userresult;
	$scope.hidden = {
		hint: false,
		practiceModal: true
	}

	$scope.cancelPractice = function() {

		$scope.hidden.practiceModal = false;
		if ($scope.nopractice) {
			
			$http({
				url: '/game/practiceend',
				method: 'POST'
			}).then(function(res) {
			}).catch(function(err) {
			});
		}
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
		}).then(function success(res) {

			$scope.result11 = function() {

				$scope.words = JSON.parse(JSON.stringify(res.data));
				$scope.words = $scope.words.w1.g1;

				var userresult = $scope.results.gameresults.week1.game1;
				var i = 0;

				$scope.words.forEach(function(entry) {

					if(userresult.correctAnswers[i] == 1) {
						entry.push("right");
					} else {
						entry.push("wrong");
					}

					entry.push(userresult.questionTime[i]);

					if(userresult.hint[i].hintcounter > 0) {
						entry.push("yes");
					} else {
						entry.push("no");
					}

					i++;
				});

				$scope.words.userresult = userresult;
				$scope.hidden.hint = true;
				$scope.userresults = $scope.results.gameresults.week1.game1.correctAnswers;			}

			$scope.result12 = function() {

				$scope.words = JSON.parse(JSON.stringify(res.data));
				$scope.words = $scope.words.w1.g2;

				var userresult = $scope.results.gameresults.week1.game2;
				var i = 0;

				$scope.words.forEach(function(entry) {

					if(userresult.correctAnswers[i] == 1) {
						entry.push("right");
					} else {
						entry.push("wrong");
					}

					entry.push(userresult.questionTime[i]);

					if(userresult.hint[i].hintcounter > 0) {
						entry.push("yes");
					} else {
						entry.push("no");
					}

					i++;
				});

				$scope.words.userresult = userresult;
				$scope.hidden.hint = true;
				$scope.userresults = $scope.results.gameresults.week1.game2.correctAnswers;	
			}

			$scope.result13 = function() {

				$scope.words = JSON.parse(JSON.stringify(res.data));
				$scope.words = $scope.words.w1.g3;

				var userresult = $scope.results.gameresults.week1.game3;
				var i = 0;

				$scope.words.forEach(function(entry) {

					if(userresult.correctAnswers[i] == 1) {
						entry.push("right");
					} else {
						entry.push("wrong");
					}

					entry.push(userresult.questionTime[i]);

					if(userresult.hint[i].hintcounter > 0) {
						entry.push("yes");
					} else {
						entry.push("no");
					}

					i++;
				});

				$scope.words.userresult = userresult;
				$scope.hidden.hint = true;
				$scope.userresults = $scope.results.gameresults.week1.game3.correctAnswers;
			}

			$scope.result21 = function() {

				$scope.words = JSON.parse(JSON.stringify(res.data));
				$scope.words = $scope.words.w2.g1;


				var userresult = $scope.results.gameresults.week2.game1;
				var i = 0;

				$scope.words.forEach(function(entry) {

					if(userresult.correctAnswers[i] == 1) {
						entry.push("right");
					} else {
						entry.push("wrong");
					}

					entry.push(userresult.questionTime[i]);

					if(userresult.hint[i].hintcounter > 0) {
						entry.push("yes");
					} else {
						entry.push("no");
					}

					i++;
				});

				$scope.words.userresult = userresult;
				$scope.hidden.hint = true;
				$scope.userresults = $scope.results.gameresults.week2.game1.correctAnswers;
			}

			$scope.result22 = function() {

				$scope.words = JSON.parse(JSON.stringify(res.data));
				$scope.words = $scope.words.w2.g2;

				var userresult = $scope.results.gameresults.week2.game2;
				var i = 0;

				$scope.words.forEach(function(entry) {

					if(userresult.correctAnswers[i] == 1) {
						entry.push("right");
					} else {
						entry.push("wrong");
					}

					entry.push(userresult.questionTime[i]);

					if(userresult.hint[i].hintcounter > 0) {
						entry.push("yes");
					} else {
						entry.push("no");
					}

					i++;
				});

				$scope.words.userresult = userresult;
				$scope.hidden.hint = true;
				$scope.userresults = $scope.results.gameresults.week2.game2.correctAnswers;
			}

			$scope.result23 = function() {

				$scope.words = JSON.parse(JSON.stringify(res.data));
				$scope.words = $scope.words.w2.g3;

				var userresult = $scope.results.gameresults.week2.game3;
				var i = 0;

				$scope.words.forEach(function(entry) {

					if(userresult.correctAnswers[i] == 1) {
						entry.push("right");
					} else {
						entry.push("wrong");
					}

					entry.push(userresult.questionTime[i]);

					if(userresult.hint[i].hintcounter > 0) {
						entry.push("yes");
					} else {
						entry.push("no");
					}

					i++;
				});

				$scope.words.userresult = userresult;
				$scope.hidden.hint = true;
				$scope.userresults = $scope.results.gameresults.week2.game3.correctAnswers;
			}

			$scope.result31 = function() {

				$scope.words = JSON.parse(JSON.stringify(res.data));
				$scope.words = $scope.words.w3.g1;

				var userresult = $scope.results.gameresults.week3.game1;
				var i = 0;

				$scope.words.forEach(function(entry) {

					if(userresult.correctAnswers[i] == 1) {
						entry.push("right");
					} else {
						entry.push("wrong");
					}

					entry.push(userresult.questionTime[i]);

					if(userresult.hint[i].hintcounter > 0) {
						entry.push("yes");
					} else {
						entry.push("no");
					}

					i++;
				});

				$scope.words.userresult = userresult;
				$scope.hidden.hint = true;
				$scope.userresults = $scope.results.gameresults.week3.game1.correctAnswers;
			}

			$scope.result32 = function() {

				$scope.words = JSON.parse(JSON.stringify(res.data));
				$scope.words = $scope.words.w3.g2;

				var userresult = $scope.results.gameresults.week3.game2;
				var i = 0;

				$scope.words.forEach(function(entry) {

					if(userresult.correctAnswers[i] == 1) {
						entry.push("right");
					} else {
						entry.push("wrong");
					}

					entry.push(userresult.questionTime[i]);

					if(userresult.hint[i].hintcounter > 0) {
						entry.push("yes");
					} else {
						entry.push("no");
					}

					i++;
				});

				$scope.words.userresult = userresult;
				$scope.hidden.hint = true;
				$scope.userresults = $scope.results.gameresults.week3.game2.correctAnswers;
			}

			$scope.result33 = function() {

				$scope.words = JSON.parse(JSON.stringify(res.data));
				$scope.words = $scope.words.w3.g3;		

				var userresult = $scope.results.gameresults.week3.game3;
				var i = 0;

				$scope.words.forEach(function(entry) {

					if(userresult.correctAnswers[i] == 1) {
						entry.push("right");
					} else {
						entry.push("wrong");
					}

					entry.push(userresult.questionTime[i]);

					if(userresult.hint[i].hintcounter > 0) {
						entry.push("yes");
					} else {
						entry.push("no");
					}

					i++;
				});

				$scope.words.userresult = userresult;
				$scope.hidden.hint = true;
				$scope.userresults = $scope.results.gameresults.week3.game3.correctAnswers;
			}

			$scope.closebutton = function() {
				$scope.hidden.hint = false;
			}
		});




}, function error(err) {

});
});