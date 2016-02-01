var app = angular.module('SequenceGame');

app.controller('GameController', ['$scope', '$interval', 'SequenceService',
	function($scope, $interval, SequenceService) {

		$scope.level = 1;
		$scope.sequence_length = 3;

		$scope.sequence_text = "";
		$scope.sequence_type = "";

		$scope.game_set = false;

		$scope.play_sequence = [];
		$scope.grid_images = [];

		$scope.current_image = "";
		$scope.sequence_text = "";

		$scope.sequence_finished = true;
		$scope.game_finished = false;
		
		$scope.game_index = 0;
		$scope.mistakes = 0;

		$scope.$watch('game_index', function(){
			if($scope.game_index == $scope.sequence_length){
				$scope.game_finished = true;
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
			if($scope.sequence_finished)
			{
				$scope.sequence_text = "Sequence";
				$scope.sequence_finished = false;

				$scope.game_finished = false;
				$scope.game_index = 0;

				var i = 0;
				$interval(function() {
					var element = $('#sequence-image img');
					var element_classes = element.attr("class").split(/\s+/);

					if(i < $scope.sequence_length)
					{
						$scope.current_image = $scope.play_sequence[i];

						if(element_classes.length > 1){
							element.removeClass(element_classes[1]);
						}

						element.addClass($scope.current_image[1]);
					}
					else {
						element.removeClass(element_classes[1]);
						$scope.sequence_finished = true;

						$scope.current_image = "";
						$scope.sequence_text = "";
					}
					
					i++;
				}, 1000, $scope.sequence_length + 1);
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

		$scope.playSound = function(type){
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

		$scope.next = function(){
			$scope.level++;
			$scope.game_index = 0;

			$scope.mistakes = 0;
			$scope.sequence_finished = true;

			$scope.game_finished = false;
			$scope.game_set = false;

			$scope.sequence_length = $scope.level + 2;
			$scope.init();
		}

}]);