var margin = {top: 10, right: 10, bottom: 100, left:100};

var width = 600;

var height= 400;

var transition = d3.transition().duration(1000);

var group = d3.select("#chart-area").append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height+ margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var x = d3.scaleLog()
	.domain([142, 150000])
	.range([0, width])
	.base(10);

var y = d3.scaleLinear()
	.domain([0, 90])
	.range([height, 0]);

var area = d3.scaleLinear()
	.domain([2000, 1400000000])
	.range([25 * Math.PI, 1500 * Math.PI]);

var color = d3.scaleOrdinal()
	.range(d3.schemePastel1);

var bottomAxis = d3.axisBottom(x)
	.tickValues([400, 4000, 40000])
	.tickFormat(d3.format("$"));

var leftAxis = d3.axisLeft(y);

var xAxisGroup = group.append("g")
    .attr("class", "bottom axis")
    .attr("transform", "translate(0, " + height + ")");

var yAxisGroup = group.append("g")
    .attr("class", "y axis");

var legend = group.append("g")
 	.attr("transform", "translate(" + (width - 10) + "," + (height - 170) + ")");

var yLabel = group.append("text")
	.attr("class", "y axis-label")
	.attr("x", - (height/ 2))
	.attr("y", -60)
	.attr("font-size", "30px")
	.attr("text-anchor", "middle")
	.attr("transform", "rotate(-90)")
	.text("Life Expectancy (Years)");

var xLabel = group.append("text")
    .attr("class", "x axis-label")
    .attr("x", (width / 2))
    .attr("y", height + 140)
    .attr("font-size", "30px")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(0, -70)")
    .text("GDP Per Capita ($)");

var legendArea = group.append("text")
	.attr("class", "x axis-label")
	.attr("x", width - 50)
	.attr("y", height - 20)
	.attr("font-size", "50px")
	.attr("text-anchor", "middle")
	.attr("fill", "gray")

var cont=0;

d3.json("data/data.json").then((data)=>{    
	data.forEach((d)=>{
		d.year = + d.year;
	});

	const formattedData = data.map((year) => {
        return year["countries"].filter((country) => {
		    var dataExists = (country.income && country.life_exp);
		    return dataExists;
		}).map((country) => {
			country.income = +country.income;
			country.life_exp = +country.life_exp;
			return country;
		})
	});

	var years = data.map((d) => {return d.year;});
	var contin = formattedData[0].map((d) => {return d.continent.charAt(0).toUpperCase() + d.continent.slice(1);});
	var continents = [...new Set(contin)];

	color.domain(continents)
	continents.forEach((c, i) => {
		var continent_row = legend.append("g")
			.attr("transform", "translate(0, " + (i * 20) + ")");

		continent_row.append("rect")
			.attr("width", 10)
			.attr("height", 10)
			.attr("fill", color(c))
			.attr("stroke", "white");

		continent_row.append("text")
			.attr("x", -20)
			.attr("y", 10)
			.attr("text-anchor", "end")
			.text(c);
	});

	d3.interval( ( ) => {
		update(years[cont % years.length], formattedData[cont % years.length]);
		cont += 1;
	}, 1000);
    
	update(years[cont % years.length], formattedData[cont % years.length]);
	cont += 1;
});

$("#play-button").on("click", ( ) => {
	
	var button = $("#play-button");
	if(button.text() == "Play"){
		button.text("Pause");
		interval = setInterval(step, 1000);
	} 
    else{
		button.text("Play");
		clearInterval(interval);
	}
});


$("#reset-button").on("click", ( ) => {
	cont = 0;
});

$("#continent-select").on("change", ( ) => {
	step();
});

$("#date-slider").slider({
	max: 2014, min: 1800, step: 1,
	slide:(event, ui) => {
		cont = ui.value - 1800;
		step();
	}
});

function step(){
    update(years[cont % years.length], formattedData[cont % years.length]);
	cont += 1;
}

function update(year, data) {
	legendArea.text(year);

	xAxisGroup.call(bottomAxis)
    .selectAll("text")
    .attr("y", "10")
    .attr("x", "-5")
    .attr("filled", "white")
    .attr("text-anchor", "middle");

	yAxisGroup.call(leftAxis);
	var circles = group.selectAll("circle").data(data, (d) => { return d.country; });

	var continent = $("#continent-select").val();
	
    var data = data.filter((d) => {
        if (continent == "all") { return true; }
        else {
            return d.continent == continent;
        }
    });


	circles.exit()
    .transition(transition)
		.attr("fill", (d) => { return color(d.continent.charAt(0).toUpperCase() + d.continent.slice(1)); })
		.attr("cx", (d) => { return y(d.income); })
		.attr("cy", (d) => { return y(d.life_exp); })
		.attr("r", (d)=>{ return Math.sqrt(area(d.population) / Math.PI);})
        .remove();

	circles.transition(transition)
		.attr("fill", (d) => { return color(d.continent.charAt(0).toUpperCase() + d.continent.slice(1)); })
		.attr("cx", (d) => { return x(d.income); })
		.attr("cy", (d) => { return y(d.life_exp); })
		.attr("r", (d)=>{ return Math.sqrt(area(d.population) / Math.PI); })

	circles.enter().append("circle")
		.attr("fill", (d) => { return color(d.continent.charAt(0).toUpperCase() + d.continent.slice(1)) })
		.attr("cx", (d) => { return x(d.income); })
		.attr("cy", (d) => { return y(d.life_exp); })
		.attr("r", (d)=>{ return Math.sqrt(area(d.population) / Math.PI); })
		.merge(circles)
		.transition(transition)
        .attr("cx", (d) => { return x(d.income); })
        .attr("cy", (d) => { return y(d.life_exp); })
        .attr("r", (d)=>{ return Math.sqrt(area(d.population) / Math.PI);});
}