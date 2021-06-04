// Sampling Rate
const freq = 512; // Hz

function getChannelData(channel, data)
{
    d = data.map(a => a[channel]).map(Number);
    result = [];
    t =0;
    for(let i=0; i<d.length; i++)
    {
        result.push({
            amplitude: d[i],
            time: t
        });
        t+= 1/freq;
    }
    return result;
}

function getEEGData(channelNames, data)
{
    let d = [];
    for(let i=0; i<channelNames.length; i++)
    {
        channelData = getChannelData(channelNames[i], data);
        d.push({channel: channelNames[i],
					      values: channelData});
    }
    return d;
}


 // set the dimensions and margins of the graph
 var margin = {top: 10, right: 30, bottom: 30, left: 50},
 width = 1200 - margin.left - margin.right,
 height = 400 - margin.top - margin.bottom;

 // append the svg object to the body of the page
 var svg = d3.select(line_plot1)
 .append("svg")
 .attr("width", width + margin.left + margin.right)
 .attr("height", height + margin.top + margin.bottom)
 .append("g")
 .attr("transform",
     "translate(" + margin.left + "," + margin.top + ")");

 // Initialise a X axis:
 var x = d3.scaleLinear().range([0,width]);
 var xAxis = d3.axisBottom().scale(x);
 svg.append("g")
 .attr("transform", "translate(0," + height + ")")
 .attr("class","myXaxis")

         
// text label for the x axis
  svg.append("text")             
  .attr("transform",
        "translate(" + (width/2) + " ," + 
                       (height + margin.top + 20) + ")")
  .style("text-anchor", "middle")
  .text("Time");

 // Initialize an Y axis
 var y = d3.scaleLinear().range([height, 0]);
 var yAxis = d3.axisLeft().scale(y);
 svg.append("g")
 .attr("class","myYaxis")

// text label for the y axis
  svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x",0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Amplitude");     
 
// Create a function that takes a dataset as input and update the plot:
function update_internal(data_idx, allData) {
    var data = allData[data_idx].values;
		// Create the X axis:
		x.domain(d3.extent(data, function(d) { return d.time; }));
		svg.selectAll(".myXaxis").transition()
		.duration(3000)
		.call(xAxis);

		// create the Y axis
		y.domain(d3.extent(data, function(d) { return d.amplitude; }));
		svg.selectAll(".myYaxis")
		.transition()
		.duration(3000)
		.call(yAxis);

		// Create a update selection: bind to the new data
		var u = svg.selectAll(".lineTest")
		.data([data], function(d){ return d.time });

		// Updata the line
		u
		.enter()
		.append("path")
		.attr("class","lineTest")
		.merge(u)
		.transition()
		.duration(3000)
		.attr("d", d3.line()
		.x(function(d) { return x(d.time); })
		.y(function(d) { return y(d.amplitude); }))
		.attr("fill", "none")
		.attr("stroke", "steelblue")
		.attr("stroke-width", 2.5);

		d3.select("#title")
		  .text(allData[data_idx].channel)
			.attr("transform",
			"translate(" + (width/2) + ", 0)")
}


var allData=[];

d3.csv("A114_raw_512HZ.csv", 
  function(data) {

    // Parse out channel names
    var channelNames = d3.keys(data[0]);

    allData = getEEGData(channelNames, data);
    
    update_internal(0, allData);

});

console.log(allData);

function update(data_name)
{
    update_internal(data_name, allData);
}
