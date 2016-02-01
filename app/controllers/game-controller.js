var app = angular.module('SequenceGame');

app.controller('GameController', ['$scope', '$interval', 'SequenceService',
	function($scope, $interval, SequenceService) {

		$scope.level = 1;
		$scope.sequence_length = $scope.level + 2;

		$scope.sequence_text = "";
		$scope.sequence_type = "";

		$scope.game_set = false;

		$scope.play_sequence = [];
		$scope.grid_images = [];

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
		}

}]);