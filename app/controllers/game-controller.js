var app = angular.module('SequenceGame');

app.controller('GameController', ['$scope', '$interval', '$timeout', 'SequenceService',
	function($scope, $interval, $timeout, SequenceService) {

		$scope.level = 1;
		$scope.sequence_length = 3;

		$scope.sequence_text = "";
		$scope.sequence_type = "";

		$scope.game_set = false;
		$scope.timer_function;

		$scope.play_sequence = [];
		$scope.grid_images = [];

		$scope.current_image = "";
		$scope.sequence_text = "";

		$scope.sequence_finished = true;
		$scope.game_finished = false;
		
		$scope.game_index = 0;
		$scope.mistakes = 0;

		$scope.timer = "0.0";
		$scope.start_time = null;

		$scope.$watch('game_index', function(){
			if($scope.game_index == $scope.sequence_length){
				$scope.game_finished = true;
				$scope.timerCount("stop");
			}
		});

		$scope.init = function(){
			var sequences = [
				["colour", "Follow the colour sequence"],
				["shape", "Follow the shape sequence"]
			];

			var chosen_sequence = sequences.sort(function() { return 0.5 - Math.random() })[0];

			$scope.sequence_type = chosen_sequence[0];
			$scope.sequence_text = chosen_sequence[1];
		}

		$scope.begin = function(){
			$scope.play_sequence = SequenceService.setSequence($scope.sequence_length);
			$scope.grid_images = SequenceService.setImages();

			$scope.game_set = true;

			$scope.playSequence();
		}

		$scope.playSequence = function(){
			if($scope.sequence_finished && !$scope.game_finished)
			{
				$scope.sequence_text = "Sequence";
				$scope.sequence_finished = false;

				$scope.game_finished = false;
				$scope.game_index = 0;

				var i = 1;
				var index = 0;

				$scope.current_image = $scope.play_sequence[0];

				$interval(function() {
					var element = $('#sequence-image img');
					var element_classes = element.attr("class").split(/\s+/);

					$scope.current_image = $scope.play_sequence[index];

					if(i < 2)
					{
						if(element.hasClass('hide')){
							element.removeClass('hide');
						}

						element.addClass($scope.current_image[1]);
						element.addClass('show');						
					}

					if(i % 2 == 0){
						element.removeClass('show');
						element.addClass('hide');

						index++;
					} else {
						element.removeClass(element_classes[1]);
						element.addClass($scope.current_image[1]);

						element.removeClass('hide');
						element.addClass('show');					
					}

					if(i == $scope.sequence_length * 2){
						$timeout(function () {
							$scope.sequence_finished = true;

							$scope.current_image = "";
							$scope.sequence_text = "";

							if(!$scope.start_time)
							{
								$scope.start_time = new Date().getTime();
								$scope.timerCount("start");
							}
						}, 1000);
					}

					i++;
				}, 1500, $scope.sequence_length * 2);
			}
		}

		$scope.compare = function(shape, colour){
			if(!$scope.game_finished && $scope.sequence_finished)
			{
				var sequence_index;
				var comparison_item;

				if($scope.sequence_type == "colour") {
					sequence_index = 1;
					comparison_item = colour;
				}
				else if($scope.sequence_type == "shape") {
					sequence_index = 0;
					comparison_item = shape;
				}

				if(comparison_item == $scope.play_sequence[$scope.game_index][sequence_index])
				{
					$scope.game_index++;
					$scope.playSound("correct");
				}
				else {
					$scope.mistakes++;
					$scope.playSound("incorrect");
				}
			}

		}

		$scope.playSound = function(type)
		{
			var element = $("#audio");

			if(type == "correct"){
				element.attr("src", "./sounds/correct.mp3");
				element.trigger("play");
			}
			else if(type == "incorrect"){
				element.attr("src", "./sounds/incorrect.mp3");
				element.trigger("play");
			}
		}

		$scope.next = function()
		{
			$scope.level++;
			$scope.game_index = 0;

			$scope.mistakes = 0;
			$scope.sequence_finished = true;

			$scope.game_finished = false;
			$scope.game_set = false;

			$scope.sequence_length = $scope.level + 2;
			$scope.grid_images = [];

			$scope.timer = "0.0";
			$scope.start_time = null;

			$scope.init();
		}

		$scope.timerCount = function(action)
		{
			if(action == "start"){
				$scope.timer_function = $interval(function() {
					/* Old method. It didn't work
					var time = new Date().getTime() - $scope.start_time;
					var elapsed = Math.floor(time / 100) / 10;

					if(Math.round(elapsed) == elapsed) { 
						elapsed += '.0'; 
					}

					$scope.timer = elapsed;
					*/

					var time = new Date().getTime() - $scope.start_time;
					var miliseconds = String(Math.floor(time / 100)).charAt(String(Math.floor(time / 100)).length - 1);

					var seconds = Math.floor((time / 1000) % 60);
					var minutes = Math.floor(((time / 1000) / 60) % 60);

					var elapsed = String(seconds) + '.' + miliseconds;

					if(minutes >= 1){
						if(seconds < 10){
							seconds = '0' + seconds;
						}

						elapsed = String(minutes).charAt(0) + '.' + String(seconds) + '.' + miliseconds;
					}
					

					$scope.timer = elapsed;

				}, 100);
			} else if(action == "stop"){
				$interval.cancel($scope.timer_function);
				$scope.opened_image = true;
			}
		}

}]);