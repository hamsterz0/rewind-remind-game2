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

	

	var usercurrent = window.x;
	var userplaying = window.userplaying;
	var counter = 0;
	var questions;
	var questionTimerInterval;


	$http({
		url: '/game/getpracticetestwords',
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

				$scope.endtext = "You have completed the practice round.";
				
			} else {
				gamesleft = 4 - usercurrent[1];

				if(userplaying[0] < usercurrent[0]) {
					$scope.endtext = "You have completed the practice round.";
				}

				$scope.endtext = "You have completed the practice round."
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


			}, 1000);
		}

		function stopQuestionTimer() {

			$interval.cancel(questionTimerInterval);
			userdata.questionTime.push($scope.questionTimer);

		}

		$scope.nextquestion = function() {
			
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

			$scope.hidden.game = false;
			$scope.hidden.answerresult = true;

			$scope.answerresult = result;
			
		}

		
	}



});