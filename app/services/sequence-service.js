var app = angular.module('SequenceGame');

app.service('SequenceService', function() {

	var original_images = ["square", "circle", "ellipse", "rectangle", "equal", "iris"];
	var all_colours = ["red", "green", "blue", "orange", "purple", "grey"];

	this.setImages = function(){
		var images = getRandomImages();

		for(var i = 0; i < 3; i++)
		{
			images.push(["empty", "brown"]);
		}

		// Making sure it mixes the images well
		for(var n = 0; n < 6; n++)
		{
			images.sort(function() { return 0.5 - Math.random() });
		}

		return images;
	}

	this.setSequence = function(length){
		var images = getRandomImages();

		for(var i = 0; i < 10; i++)
		{
			var more_images = getRandomImages();
			images = images.concat(more_images);
		}

		// Making sure it makes the sequence as various as possible
		images = images.sort(function() { return 0.5 - Math.random() });
		images = images.slice(0, length);

		return images;
	}

	getRandomImages = function(){
		var images = original_images.sort(function() { return 0.5 - Math.random() });
		var colours = all_colours.sort(function() { return 0.5 - Math.random() });

		var grid_images = [];

		for(var i = 0; i < images.length; i++)
		{
			grid_images.push([images[i], colours[i]]);
		}

		return grid_images;
	}

});