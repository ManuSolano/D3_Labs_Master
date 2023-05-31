var width = 600;
var height = 400;
var flag = true;
var margin = {top: 10, right: 10, bottom: 100, left:100};

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

d3.json("data/revenues.json").then((data)=> {
    console.log(data);

    var revenue = d3.max(data, (d) => { return d.revenue; });
    var months = data.map((d) => { return d.month; });

    var x = d3.scaleBand()
        .domain(months)
        .range([0, width])
        .padding(0.2);

    var y = d3.scaleLinear()
        .domain([0, revenue])
        .range([height, 0]);

    var colors = d3.scaleOrdinal()
        .domain(months)
        .range(d3.schemeSet3);

    var rectangles = g.selectAll("rect")
        .data(data);

    rectangles.enter()
        .append("rect")
            .attr("x", (d) => { return x(d.month); })
            .attr("y", (d) => { return y(d.revenue); })
            .attr("height", (d) => { return height - y(d.revenue); })
            .attr("width", x.bandwidth)
            .attr("fill", "green");

    var xAxisGroup = g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(d3.axisBottom(x));

    var yAxisGroup = g.append("g")
        .attr("class", "left axis")
        .call(d3.axisLeft(y).ticks(5).tickFormat((d) => { return "$" + d/1000 + "K"; }));

    labelY = g.append("text")
        .attr("class", "y axis-label")
        .attr("x", -(height / 2))
        .attr("y", -60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Revenue (dlls.)")
        .attr("fill", "white");

    labelX = g.append("text")
        .attr("class", "x axis-label")
        .attr("x", width / 2)
        .attr("y", height + 80)
        .attr("font-size", "25px")
        .attr("text-anchor", "middle")
        .text("Month")
        .attr("fill", "white");

}).catch((error)=>{
    console.log(error);
});
