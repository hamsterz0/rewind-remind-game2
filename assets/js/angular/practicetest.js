var app = angular.module('myGameTestApp', []);

app.controller('gameTestController', function($scope, $http, $interval, $window, $location, $timeout) {

	var userdata = {
		questionTime: [],
		hint: [],
		correctAnswers: []
	};

	$scope.hidden = {

		information: true,
		gametest: false,
		hint: false,
		answerresult: false,
		endgame: false
	}

	

	var usercurrent = window.x;
	var userplaying = window.up;

	var counter = 0;
	var questions;
	$scope.hintsolutions;

	var hintTimerInterval;

	$scope.beginTest = function() {

		$scope.hidden.information = false;
		$scope.hidden.gametest = true;


		var questionTimerInterval;


		$http({
			url: '/game/getpracticetestwords',
			method: 'GET',
			params: {usercurrent: usercurrent}
		}).then(function success(res) {

			questions = res.data;

			$http({
				url: '/game/getpracticewords',
				method: 'GET',
				params: {usercurrent: usercurrent}
			}).then(function success(res) {

				$scope.hintsolutions = res.data;
				startGame();
			}, function error(err) {

			});


		}, function error(err) {

		});


		function startGame() {

			var hintdetails = {
				hintcounter: 0,
				hinttime: 0
			}
			
			//----------------------------------------------------
			if(counter == questions.length) {

				var gamesleft;

				if(userplaying == usercurrent) {
					gamesleft = 3 - usercurrent[1];

					if(usercurrent[1] == 3) {}

					$scope.endtext = "You have completed the practice round.";
					
				} else {
					gamesleft = 4 - usercurrent[1];

					if(userplaying[0] < usercurrent[0]) {
						$scope.endtext = "You have completed the practice round.";
					}

					$scope.endtext = "You have completed the practice round."
				}
								

				$scope.hidden.gametest = false;
				$scope.hidden.endgame = true;
				$scope.hidden.answerresult = false;

			}
			//----------------------------------------------------

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
				userdata.questionTime.push($scope.questionTimer);

			}


			function startHintTimer() {

				hintTimerHelper(0);
				hintdetails.hintcounter =  hintdetails.hintcounter + 1;
			}

			function hintTimerHelper(startTime) {

				$scope.hintTimer = startTime;
				hintTimerInterval = $interval(function() {

					$scope.hintTimer++;
				}, 1000);
			}

			function stopHintTimer() {

				$interval.cancel(hintTimerInterval);
				hintdetails.hinttime = hintdetails.hinttime + $scope.hintTimer;
			}


			$scope.yesPressed = function() {

				if(questions[counter][2] === true) {
					userdata.correctAnswers.push(1);
					answerview('Correct!');
				} else {
					userdata.correctAnswers.push(0);
					answerview('Wrong!');
				}

				counter++;
				stopQuestionTimer();
				userdata.hint.push(hintdetails);

				var displaytime = $timeout(function() {
					$scope.hidden.gametest = true;
					$scope.hidden.answerresult = false;
					startGame();
				}, 1000);
			}

			$scope.noPressed = function() {

				if(questions[counter][2] === false) {
					userdata.correctAnswers.push(1);
					answerview('Correct!');
				} else {
					userdata.correctAnswers.push(0);
					answerview('Wrong!');
				}

				counter++;
				stopQuestionTimer();


				userdata.hint.push(hintdetails);

				var displaytime = $timeout(function() {
					$scope.hidden.gametest = true;
					$scope.hidden.answerresult = false;
					startGame();
				}, 1000);
			}

			$scope.hintButton = function() {
				$scope.hidden.hint = true;
				startHintTimer();
			}

			$scope.modalClose = function() {

				$scope.hidden.hint = false;
				stopHintTimer();
			}

			$scope.dashboard = function() {

				$http({
					url: '/game/practiceend',
					method: 'POST',
					data: {
						usercurrent: usercurrent,
						userresult: userdata
					}
				}).then(function success(res) {

					$window.location.href = '/dashboard'
				}, function error(err) {
					console.log(err.data);
				});

				
			}

			var answerview = function(result) {

				console.log('answerview called');

				$scope.hidden.gametest = false;
				$scope.hidden.answerresult = true;


				console.log('timeout is working');
				$scope.answerresult = result;
				
			}

			
		}
	}

});