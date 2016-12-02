var app = angular.module('myGameTestApp', []);

app.controller('gameTestController', function($scope, $http, $interval, $window, $location) {

	var userdata = {
		questionTime: [],
		hint: [],
		correctAnswers: []
	};

	$scope.hidden = {

		information: true,
		gametest: false,
		hint: false,
		endgame: false
	}

	

	var usercurrent = window.x;
	var userplaying = window.userplaying;
	var counter = 0;
	var questions;
	$scope.hintsolutions;

	var hintTimerInterval;

	$scope.beginTest = function() {

		$scope.hidden.information = false;
		$scope.hidden.gametest = true;


		var questionTimerInterval;


		$http({
			url: '/game/gettestwords',
			method: 'GET',
			params: {usercurrent: usercurrent}
		}).then(function success(res) {

			questions = res.data;

			$http({
				url: '/game/getwords',
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

					console.log(usercurrent);

					if(usercurrent[1] == 3) {}

					$scope.endtext = "Thank you for playing. You have " + gamesleft + " more games left to complete this week.";
					
				} else {
					gamesleft = 4 - usercurrent[1];

					if(userplaying[0] < usercurrent[0]) {
						$scope.endtext = "Thank you for playing. You have no more games to complete this week.";
					}

					$scope.endtext = "Thank you for playing. You have " + gamesleft + " more games left to complete this week."
				}
								

				$scope.hidden.gametest = false;
				$scope.hidden.endgame = true;

			}
			//----------------------------------------------------

			$scope.word1 = questions[counter][0];
			$scope.word2 = questions[counter][1];

			console.log(questions);

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
				console.log('hintcounter: ' + hintdetails.hintcounter);
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
				} else {
					userdata.correctAnswers.push(0);
				}

				counter++;
				stopQuestionTimer();
				userdata.hint.push(hintdetails);

				startGame();
			}

			$scope.noPressed = function() {

				if(questions[counter][2] === false) {
					userdata.correctAnswers.push(1);
				} else {
					userdata.correctAnswers.push(0);
				}

				counter++;
				stopQuestionTimer();


				userdata.hint.push(hintdetails);

				startGame();
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

				if(userplaying != usercurrent) {

					$window.location.href = '/dashboard';
				} else {
					if(usercurrent[1] == 3 ) {
					usercurrent = parseInt(usercurrent) + 8;
					} else {
						usercurrent = parseInt(usercurrent) + 1;
					}

					$http({
						url: '/game/end',
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
				
			}

			
		}
	}

});