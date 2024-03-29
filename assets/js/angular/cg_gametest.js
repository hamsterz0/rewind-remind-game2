var app = angular.module('cgApp', []);

app.controller('cgcontroller', function($scope, $http, $interval, $window, $location, $timeout) {

	var userdata = {
		questionTime: [],
		hint: [],
		correctAnswers: []
	};

	$scope.hidden = {

		game: true,
		answerresult: false,
		endgame: false
	};

	var phrases = [];

	

	var usercurrent = window.x;
	var userplaying = window.userplaying;
	var counter = 0;
	var questions;
	var questionTimerInterval;


	$http({
		url: '/game/gettestwords',
		method: 'GET',
		params: {usercurrent: usercurrent}
	}).then(function success(res) {

		questions = res.data;
		startGame();

	}, function error(err) {

	});


	function startGame() {

		$scope.userinput = '';

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

				$scope.endtext = "Thank you for playing. You have " + gamesleft + " more games left to complete this week.";
				
			} else {
				gamesleft = 4 - usercurrent[1];

				if(userplaying[0] < usercurrent[0]) {
					$scope.endtext = "Thank you for playing. You have no more games to complete this week.";
				}

				$scope.endtext = "Thank you for playing. You have " + gamesleft + " more games left to complete this week."
			}
							

			$scope.hidden.game = false;
			$scope.hidden.endgame = true;
			$scope.hidden.answerresult = false;

		}
		//----------------------------------------------------

		$scope.word1 = questions[counter][0];
		$scope.word2 = questions[counter][1];
		$scope.word3 = questions[counter][Math.random() < 0.5 ? 0:1];

		startQuestionTimer();

		function startQuestionTimer() {

			questionTimerHelper(0);
			
		}

		function questionTimerHelper(startTime) {

			$scope.questionTimer = startTime;

			questionTimerInterval = $interval(function() {

				$scope.questionTimer++;


			}, 1);
		}

		function stopQuestionTimer() {

			$interval.cancel(questionTimerInterval);
			userdata.questionTime.push($scope.questionTimer);

		}

		$scope.nextquestion = function() {

			phrases.push($scope.userinput);

			if($scope.userinput.toLowerCase() === $scope.word3.toLowerCase()) {
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
				$scope.hidden.game = true;
				$scope.hidden.answerresult = false;
				startGame();
			}, 1000);
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
						userresult: userdata,
						phrases: phrases
					}
				}).then(function success(res) {

					$window.location.href = '/dashboard'
				}, function error(err) {
				});

			}
			
		}

		var answerview = function(result) {

			$scope.hidden.game = false;
			$scope.hidden.answerresult = true;

			$scope.answerresult = result;
			
		}

		
	}



});