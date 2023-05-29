/*
*    main.js
*/
var mwidth = 600;
var mheight = 400;
var flag = true;
var margin = {top: 10, right: 10, bottom: 100, left:100};

var svg = d3.select("#chart-area").append("svg")
	.attr("width", mwidth + margin.right + margin.left)
	.attr("height", mheight + margin.top + margin.bottom);

var g = svg.append("g")
		.attr("transform", "translate(" + margin.left + ", " + margin.top + ")")


var x = d3.scaleBand().range([0, mwidth]).padding(0.2);
var y = d3.scaleLinear().range([mheight, 0]);
	
var xAxisGroup = g.append("g").attr("class", "x axis")
.attr("transform", "translate(0, " + mheight + ")");
	
var yAxisGroup = g.append("g").attr("class", "y-axis");

var yLabel =g.append("text")
.attr("class", "y axis-label")
.attr("x", - (mheight/2))
.attr("y", -60)
.attr("font-size", "25px")
.attr("text-anchor", "middle")
.attr("transform", "rotate(-90)")
.style("fill","white")
.text("Revenues (dlls.)");

var xLabel = g.append("text")
  .attr("class", "x axis-label")
  .attr("x", mwidth / 2)
  .attr("y", mheight + 80)
  .attr("font-size", "25px")
  .attr("text-anchor", "middle")
  .style("fill", "white")
  .text("Month");


d3.json("data/revenues.json").then((data)=> {
	data.forEach((d)=>{
		d.revenue = +d.revenue;
		d.profit= +d.profit;
	});
	// *** NOTICE HOW WE REMOVE EVERYTHING IN HERE! ***
	d3.interval( ( ) => {
		var newData = flag ? data : data.slice(1)
		update(newData);
		flag = !flag;
		//console.log("errdf");
	}, 1000);
	update(data);
}).catch((error)=> {
	console.log(error);
});


function update(data) {	
	var value = flag ? "revenue" : "profit";
	
	x.domain(data.map((d) => { return d.month; }));
	y.domain([0, d3.max(data, (d) => { return d[value]; })]);

	var xAxisCall = d3.axisBottom(x);
	var leftAxis = d3.axisLeft(y)
	.ticks(11).tickFormat((d) => { return "$" + d; });
	


	xAxisGroup.call(xAxisCall);
	yAxisGroup.call(leftAxis);

	
	var label = flag ? "Revenue" : "Profit";
	var labelX =  "Month";
	yLabel.text(label);
	xLabel.text(labelX);
	var bars = g.selectAll("rect").data(data)
	bars.exit().remove();

	bars.attr("x", (d) => { return x(d.month); })
	.attr("y", (d) => { return y(d[value]); })
	.attr("width", x.bandwidth)
	.attr("height",(d) => { return mheight - y(d[value]);})


	bars.enter().append("rect")
	.attr("x", (d) => { return x(d.month); })
	.attr("y", (d) => { return y(d[value]); })
	.attr("width", x.bandwidth)
	.attr("height", (d) => { return mheight - y(d[value]);})
	.attr("fill", "green");
	}
