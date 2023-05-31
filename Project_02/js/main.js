var margin = {top: 10, right: 10, bottom: 100, left:100};

var width = 600;

var height= 400;

var g = d3.select("#chart-area")
.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
.append("g")
	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var x = d3.scaleLog().domain([142, 150000]).range([0, width]).base(10);;

var y = d3.scaleLinear().domain([0, 90]).range([height, 0]);

var area = d3.scaleLinear().domain([2000, 1400000000]).range([25*Math.PI, 1500*Math.PI])

var timeLabel = g.append("text")
	.attr("class", "x axis-label")
	.attr("x", (width-15))
	.attr("y", height-15)
	.attr("font-size", "30px")
	.attr("text-anchor", "end")
	.style("fill","black")

var yLabel = g.append("text")
	.attr("class", "y axis-label")
	.attr("x", - (height / 2))
	.attr("y", -60)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.attr("transform", "rotate(-90)")
	.style("fill","black")
	.text("Life Expectancy (Years)");

var xLabel = g.append("text")
	.attr("class", "x axis-label")
	.attr("x", (width/2))
	.attr("y", height+60)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.style("fill","black")
	.text("GDP Per Capita ($)");


var xAxisGroup = g.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0, " + height + ")")

var continents = ["europe", "asia", "americas", "africa"];

var color = d3.scaleOrdinal().range(d3.schemePastel1).domain(continents);

var xAxisCall = d3.axisBottom(x)
	.tickValues([400, 4000, 40000])
	.tickFormat(function(d) {
		return "$" + d;
	});

var yAxisGroup = g.append("g").attr("class", "y-axis");

var yAxisCall = d3.axisLeft(y);

d3.json("data/data.json").then(function(data){

	const newData = data.map((year) => {
		return year["countries"].filter((country) => {
			var dataExists = (country.income && country.life_exp);
			return dataExists
		}).map((country) => {
			country.income = +country.income;
			country.life_exp = +country.life_exp;
			return country;
		})
	});
	
	console.log(data);

	continents.forEach((continent, i) => {
		var legendRow = g.append("g")
			.attr("transform", "translate("+(width - 20)+", " + (height - 60 - (i*20)) + ")");
		legendRow.append("rect")
			.attr("width", 10)
			.attr("height", 10)
			.attr("fill", color(continent));
		legendRow.append("text")
			.attr("x", -10)
			.attr("y", 10)
			.attr("text-anchor", "end")
			.style("text-transform", "capitalize")
			.text(continent);
	});

	var time = data.map((d) => {return d.year;});

	let count = 0;

	d3.interval( ( ) => {
		count++;

		update(newData[count % time.length], time[count % time.length]);
	}, 500);

function update(data, year) {
	xAxisGroup.call(xAxisCall)
	yAxisGroup.call(yAxisCall);

	timeLabel.text(year);

	var circles = g.selectAll("circle").data(data);
	circles.exit().remove();
	circles.attr("fill", (d) => color(d.continent))
		.attr("cy", (d) => y(d.life_exp))
		.attr("cx", (d) => x(d.income))
		.attr("r", (d) => Math.sqrt(area(d.population) / Math.PI));

	circles.enter().append("circle")
	.attr("fill",(d, i) => { return color(d.continent); }) 
	.attr("cy", (d, i) => { return y(d.life_exp);})
	.attr("cx", (d, i) => { return x(d.income); })
	.attr("r", (d, i) => { var value = Math.sqrt(area( d.population) / Math.PI);
		return value; 
	});
}

}).catch((error)=> {
	console.log(error);

});