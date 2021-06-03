// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1200 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#line_plot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Sampling Rate
const freq = 512; // Hz

function getAmplitude(data)
{
    return data.map(a => a.amplitude);
}

function getTime(data)
{
    return data.map(a => a.time);
}

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
        //console.log(channelNames[i]);
        //console.log(channelData);
        d.push({channel: channelNames[i],
                value: channelData,
        });
    }
    return d;
}

d3.csv("A114_raw_512HZ.csv", 
  function(d) {
    return d;
  }, 

  function(error, data) {

    // Parse out channel names
    var channelNames = d3.keys(data[0]);
    console.log(channelNames);

    // Transpose data. Return Array of objects with channel and array of amplitudes
    let allData = getEEGData(channelNames, data);
    console.log(allData);

    // Extract the channel name and the amplitudes
    console.log(allData[0].channel);
    console.log(allData[0].value);
    
    let amplitude1 = getAmplitude(allData[0].value);
    let time1 = getTime(allData[0].value);
    console.log(amplitude1);
    console.log(time1);

    let goodData = getChannelData(channelNames[0], data);
    console.log(goodData);

     // Add X axis --> it is a date format
     var x = d3.scaleLinear()
     .domain(d3.extent(goodData, function(d) { return d.time; }))
     .range([ 0, width ]);
   svg.append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x));

   // Add Y axis
   var y = d3.scaleLinear()
     .domain(d3.extent(goodData, function(d) { return d.amplitude; }))
     .range([ height, 0 ]);
   svg.append("g")
     .call(d3.axisLeft(y));

   // Add the line
   svg.append("path")
     .datum(goodData)
     .attr("fill", "none")
     .attr("stroke", "steelblue")
     .attr("stroke-width", 1.5)
     .attr("d", d3.line()
       .x(function(d) { return x(d.time) })
       .y(function(d) { return y(d.amplitude) })
       )
  });

