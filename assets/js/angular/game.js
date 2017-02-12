var app = angular.module('myApp', []);

app.controller('gameController', function($scope, $http, $window, $timeout) {

	var wordList;
	var counter = 1;
	var usercurrent = window.x;
	var userplaying = window.userplaying;

	var usertype = window.ut;
	$scope.emphasizeHint = false;

	$scope.buttonTitle = "Next Set";

	var phrases = [];
	$http({
			url: '/game/getwords',
			method: 'GET',
			params: {usercurrent: usercurrent}
		}).then(function getCallback(response) {

		wordList = response.data;

		$scope.word1 = wordList[0][0];
		$scope.word2 = wordList[0][1];
		$scope.hint = wordList[0][2];

		$scope.buttonPressed = function() {
			
			if(usertype[0] !== 'D' || similarity("fits into", $scope.userinput)*100 >= 75 || similarity("contains", $scope.userinput)*100 >= 75) {

				phrases.push($scope.userinput);

				if(counter == wordList.length) {
					$http({
						url: '/game/storingphrases',
						method: 'POST',
						data: {
							usercurrent: usercurrent,
							phrases: phrases
						}
					}).then(function success(res) {

						$window.location.href = '/game/test/' + usercurrent;
					}, function error(err) {
						console.log(err.data);
					});

					// $scope.buttonTitle = 'Finish memorizing';

				}

				$scope.word1 = wordList[counter][0];
				$scope.word2 = wordList[counter][1];
				$scope.hint = wordList[counter++][2];
				$scope.userinput = '';
			} else {
				$scope.emphasizeHint = true;

				$timeout(function() {

					$scope.emphasizeHint = false;
				}, 1000);

			}
		}
	}, function getError(error) {

		console.log('Internal Server Error: 500');
	});

	function similarity(s1, s2) {
	  	var longer = s1;
	  	var shorter = s2;
	  	if (s1.length < s2.length) {
	    	longer = s2;
	    	shorter = s1;
	  	}
	  	var longerLength = longer.length;
	  	if (longerLength == 0) {
	    	return 1.0;
	  	}
		return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
	}

	function editDistance(s1, s2) {
  		s1 = s1.toLowerCase();
  		s2 = s2.toLowerCase();

  		var costs = new Array();
  		for (var i = 0; i <= s1.length; i++) {
    		var lastValue = i;
    		for (var j = 0; j <= s2.length; j++) {
      			if (i == 0)
        			costs[j] = j;
      			else {
        			if (j > 0) {
          				var newValue = costs[j - 1];
          				if (s1.charAt(i - 1) != s2.charAt(j - 1))
            				newValue = Math.min(Math.min(newValue, lastValue),
              				costs[j]) + 1;
          					costs[j - 1] = lastValue;
          					lastValue = newValue;
        				}
      				}
    			}
			if (i > 0)
  				costs[s2.length] = lastValue;
  		}
  		return costs[s2.length];
	}
});