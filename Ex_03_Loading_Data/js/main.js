//CSV
d3.csv("/data/ages.csv").then((data) => {
	console.log(data);
}).catch((error)=> {
	console.log(error);
});
//TSV
d3.tsv("/data/ages.tsv").then((data) => {
	console.log(data);
}).catch((error)=> {
	console.log(error);
});

var svg = d3.select("#chart-area").append("svg")
	.attr("width", 400)
	.attr("height", 400);

//JSON

var ages = [];

d3.json("data/ages.json").then((data)=> {
	data.forEach((d)=>{
		ages.push(d.age);
	});

	var circles = svg.selectAll("circle")
	.data(ages);

	console.log(ages);

	for (let i = 0; i < ages.length; i++)
	{
		circles.enter()
			.append("circle")
				.attr("cx", (d, i) => {
					return (i * 50) + 25;
				})
				.attr("cy", 250)
				.attr("r", (d)=> {return d*2;})
				.attr("fill", "blue");
	}
});
