// FIRST HEATMAP
// set dimensions and margins
const margin = { top: 30, right: 30, bottom: 100, left: 100 },
      width = 600 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

// create SVG inside the heatmap1 div
const svg = d3.select("#heatmap1")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// load the correlation matrix CSV
d3.csv("corr_data.csv").then(function(data) {
  // get unique variables
  const groups = Array.from(new Set(data.map(d => d.group)));
  const variables = Array.from(new Set(data.map(d => d.variable)));

  // build scales
  const x = d3.scaleBand()
    .domain(groups)
    .range([0, width])
    .padding(0.05);

  const y = d3.scaleBand()
    .domain(variables)
    .range([height, 0])
    .padding(0.05);

  // add axes
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSize(0))
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

  svg.append("g")
    .call(d3.axisLeft(y).tickSize(0));

  // define color scale
  const color = d3.scaleSequential()
    .interpolator(d3.interpolateRdBu)
    .domain([1, -1]); 

  // draw heatmap rectangles
  svg.selectAll()
    .data(data)
    .enter()
    .append("rect")
      .attr("x", d => x(d.group))
      .attr("y", d => y(d.variable))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", d => color(+d.value));

  // add text labels (correlation values)
  svg.selectAll()
    .data(data)
    .enter()
    .append("text")
      .attr("x", d => x(d.group) + x.bandwidth() / 2)
      .attr("y", d => y(d.variable) + y.bandwidth() / 2 + 4)
      .text(d => (+d.value).toFixed(2))
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", d => Math.abs(d.value) > 0.5 ? "white" : "black");
});

// SECOND HEATMAP
// set dimensions and margins
const margin2 = { top: 30, right: 30, bottom: 100, left: 100 },
      width2 = 700 - margin2.left - margin2.right,
      height2 = 500 - margin2.top - margin2.bottom;

// create SVG inside the #heatmap2 div
const svg2 = d3.select("#heatmap2")
  .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
  .append("g")
    .attr("transform", `translate(${margin2.left},${margin2.top})`);

// load the genre feature means CSV
d3.csv("genre_feature_means.csv").then(function(data) {
  // get unique genres and features
  const genres = Array.from(new Set(data.map(d => d.genre)));
  const features = Array.from(new Set(data.map(d => d.feature)));

  // build scales
  const x = d3.scaleBand()
    .domain(features)
    .range([0, width2])
    .padding(0.05);

  const y = d3.scaleBand()
    .domain(genres)
    .range([0, height2])
    .padding(0.05);

  // axes
  svg2.append("g")
    .attr("transform", `translate(0, ${height2})`)
    .call(d3.axisBottom(x).tickSize(0))
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

  svg2.append("g")
    .call(d3.axisLeft(y).tickSize(0));

  // color scale
  const color = d3.scaleSequential()
    .interpolator(d3.interpolateRdBu)
    .domain([1, -1]);

  // draw heatmap squares
  svg2.selectAll()
    .data(data)
    .enter()
    .append("rect")
      .attr("x", d => x(d.feature))
      .attr("y", d => y(d.genre))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", d => color(+d.value));

  // add text labels
  svg2.selectAll()
    .data(data)
    .enter()
    .append("text")
      .attr("x", d => x(d.feature) + x.bandwidth() / 2)
      .attr("y", d => y(d.genre) + y.bandwidth() / 2 + 4)
      .text(d => (+d.value).toFixed(2))
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", d => +d.value > 0.5 ? "white" : "black");
});

// save figures as html files