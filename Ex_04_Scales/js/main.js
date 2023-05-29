/*
*    main.js
*/

var svg = d3.select("#chart-area").append("svg")
	.attr("width", 500)
	.attr("height", 500);

d3.json("buildings.json").then((data)=> {
	console.log(data);

	height= d3.max(data,(d) => {return d.height});
	buildingname= data.map((d)=> {return d.name});


	var x = d3.scaleBand()
	.domain(buildingname)
	.range([0, 400])
	.paddingInner(0.3)
	.paddingOuter(0.3);

	var y = d3.scaleLinear()
	.domain([0, height])
	.range([0,400]); 

	var colors = d3.scaleOrdinal()
	.domain(buildingname)
	.range(d3.schemeSet3);


var rectangles = svg.selectAll("rect")
	.data(data);


rectangles.enter()
	.append("rect")
		.attr("x", (d)=>{return x(d.name);})
		.attr("y", (d) => {return 500 - y(d.height);})
		.attr("height", (d) => {return y(d.height);})
		.attr("width", x.bandwidth)
		.attr("fill", (d) => {return colors(d.name);})

}).catch((error)=>{
	console.log(error);
});