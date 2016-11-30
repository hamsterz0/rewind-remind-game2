var app = angular.module('myGameTestApp', []);

app.controller('gameTestController', function($scope, $http, $interval, $window) {

	var userAnswers = {
		time: [],
		hintTime: [],
		correctAnswers: []
	};

	$scope.information = true;
	$scope.gametest = false;
	$scope.hint = false;
	$scope.hintTimer = 0;
	hintCheckCounter = 0;
	var counter = 0;
	var questions;
	$scope.hintsolutions;

	$scope.beginTest = function() {

		$scope.information = false;
		$scope.gametest = true;
		$scope.modalview = false;


		var questionTimerInterval;


		$http.get('/game/gettestwords').then(function success(res) {

			questions = res.data.week1.game1;
			console.log(questions);

			$http.get('/game/getwords').then(function success(res) {

				$scope.hintsolutions = res.data.week1.game1;
				console.log($scope.hintsolutions[0][0]);
				startGame();
			}, function error(err) {

			});


		}, function error(err) {

		});


		function startGame() {

			

			if(counter == questions.length-1) {

				console.log('Finished with questions');
				$window.location.href = '/game/test';
			}

			$scope.word1 = questions[counter][0];
			$scope.word2 = questions[counter][1];

			startQuestionTimer();

			function startQuestionTimer() {

				questionTimerHelper(0);
				
			}

			function questionTimerHelper(startTime) {

				$scope.questionTimer = startTime;

				questionTimerInterval = $interval(function() {

					$scope.questionTimer++;


				}, 1000);
			}

			function stopQuestionTimer() {

				$interval.cancel(questionTimerInterval);

			}


			function startHintTimer() {

				hintTimerHelper(0);
			}

			function hintTimerHelper(startTime) {

				$scope.hintTimer = startTime;
				hintTimerInterval = $interval(function() {

					$scope.hintTimer++;
				}, 1000);
			}

			function stopHintTimer() {

				$interval.cancel(hintTimerInterval);
			}


			$scope.yesPressed = function() {

				counter++;
				stopQuestionTimer();
				startGame();
			}

			$scope.hintButton = function() {
				$scope.hint = true;
				hintCheckCounter++;
				startHintTimer();
			}

			$scope.modalClose = function() {

				$scope.hint = false;
				stopHintTimer();
			}

			$scope.noPressed = function() {

				counter++;
				stopQuestionTimer();
				startGame();
			}
		}
	}

});