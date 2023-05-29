var svg = d3.select("#chart-area").append("svg")
	.attr("width", 750)
	.attr("height", 750);

var circle = svg.append("circle")
	.attr("cx", 150)
	.attr("cy", 150)
	.attr("r", 70)
	.attr("fill", "green");

var rect = svg.append("rect")
	.attr("x", 300)
	.attr("y", 180)
	.attr("width", 50)
	.attr("height", 50)
	.attr("fill","magenta");
