// Constants for the charts, that would be useful.
const CHART_WIDTH = 500;
const CHART_HEIGHT = 250;
const MARGIN = { left: 50, bottom: 20, top: 20, right: 20 };
const ANIMATION_DURATION = 300;

setup();

function setup () {

  // Fill in some d3 setting up here if you need
  // for example, svg for each chart, g for axis and shapes

  changeData();
}

// Function for mouse hovering changes
//function mouseHover(){}

/**
 * Render the visualizations
 * @param data
 */
function update (data) {

  // ****** TODO ******

  // sort data 
  //data = data.sort((cases, deaths) => (+cases - +deaths))
  // data = data.sort((cases, deaths) => cases.x - deaths.x)
  // for (let d of data){
  //   d.deaths = +d.deaths;
  //   d.cases = +d.cases
  // }

  // console.log(data)

  // // doesn't work
  // let yAllScale = d3
  // .scaleLinear()
  // .domain([0, d3.max(data, d => d['metric'])])
  // .range([CHART_HEIGHT - MARGIN.top - MARGIN.bottom, 0]);

  // let xBarScale = d3
  // .scaleBand()
  // .domain(d3.map(data, d => d['date']))
  // .range([0, CHART_WIDTH - MARGIN.right- MARGIN.left])
  // .padding(0.5);
  
  // let xLineAreaScale = d3
  //   .scalePoint()
  //   .domain(d3.map(data, d => d['date']))
  //   .range([MARGIN.left, CHART_WIDTH - MARGIN.right])

  // let labelset = data.map(d => d.date);
  let dataset = (document.getElementById('metric').value==="deaths" ? data.map(d => d.deaths) : data.map(d => d.cases));
  let dataset2 = (document.getElementById('metric').value==="deaths" ? data.map(d => d.cases) : data.map(d => d.deaths));

  let xBarScale = d3
    .scaleBand()
    .domain(data.map(d => d.date))
    .range([MARGIN.left, CHART_WIDTH - MARGIN.right])
    .padding(0.5);

  let xLineAreaScale = d3
    .scalePoint()
    .domain(data.map(d => d.date))
    .range([MARGIN.left, CHART_WIDTH - MARGIN.right])

  let yLineAreaBarScale = d3
    .scalePoint()
    .domain(d3.scaleLinear().domain([0, d3.max(dataset)]).nice().ticks(10))
    .range([CHART_HEIGHT - MARGIN.top - MARGIN.bottom,0]);

  let xScatterScale = d3
    .scalePoint()
    .domain(d3.scaleLinear().domain([0, d3.max(dataset2)]).nice().ticks(10))
    .range([MARGIN.left, CHART_WIDTH - MARGIN.right])

  let yScatterScale = d3
    .scalePoint()
    .domain(d3.scaleLinear().domain([0,d3.max(dataset)]).nice().ticks(10))
    .range([CHART_HEIGHT - MARGIN.bottom - MARGIN.top, 0])

  d3.select(`#x-barAxis`)
    .attr('transform', `translate(0, ${CHART_HEIGHT - MARGIN.bottom})`)
    .call(d3.axisBottom(xBarScale));
  
  d3.select(`#y-barAxis`)
    .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`)
    .call(d3.axisLeft(yLineAreaBarScale));

  d3.select('#x-lineAxis')
    .attr('transform', `translate(0,${CHART_HEIGHT - MARGIN.bottom})`)
    .call(d3.axisBottom(xLineAreaScale));

  d3.select('#y-lineAxis')
    .call(d3.axisLeft(yLineAreaBarScale))
    .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);

  d3.select('#x-areaAxis')
    .attr('transform', `translate(0,${CHART_HEIGHT - MARGIN.bottom})`)
    .call(d3.axisBottom(xLineAreaScale));

  d3.select('#y-areaAxis')
    .call(d3.axisLeft(yLineAreaBarScale))
    .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);

  d3.select('#x-scatterAxis')
    .attr('transform', `translate(0, ${CHART_HEIGHT - MARGIN.bottom})`)
    .call(d3.axisBottom(xScatterScale))

  d3.select('#y-scatterAxis')
    .call(d3.axisLeft(yScatterScale))
    .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`)




    // all the code lower does not work so I commented it out, but i tried...




  // d3.select("#barChart")
  //   .selectAll('g')
  //   .data(data)
  //   .enter()
  //   .append("rect")
  //   .attr("x",(data, i) => xBarScale(labelset[i]))
  //   .attr("y",(data, i)=> CHART_HEIGHT - MARGIN.bottom-(CHART_HEIGHT / d3.max(dataset))*dataset[i])
  //   .attr("width", d => 20)
  //   .attr("height", (data, i)=> (CHART_HEIGHT / d3.max(dataset))*dataset[i])
  //   .attr("opacity", 0.8);

  // const areaGenerator = d3
  //   .area()
  //   .x((data) => xScale(data.deaths))
  //   .y1((data) => yScale(data.cases) + MARGIN.top)
  //   .y0(CHART_HEIGHT - MARGIN.bottom);

  // const lineGenerator = d3
  //   .line()
  //   .x((data) => xScale(data.deaths))
  //   .y((data) => yScale(data.cases) + MARGIN.top);
    

  // const areaGenerator = d3
  //   // .select('#AreaChart')
  //   // .select('g')
  //   .area()
  //   .x((data, i) => xLineAreaScale(data[i].date))
  //   .y1((dataset, i) => yLineAreaBarScale(dataset[i]) + MARGIN.top)
  //   .y0(CHART_HEIGHT - MARGIN.bottom);

  // const lineGenerator = d3
  //   // .select('#LineChart')
  //   // .select('g')
  //   .line()
  //   .x((data, i) => xLineAreaScale(data[i].date))
  //   .y((dataset, i) => yLineAreaBarScale(dataset[i]) + MARGIN.top);

  // d3.select('#AreaChart')
  //   .select('path')
  //   .datum(data)
  //   .transition(ANIMATION_DURATION)
  //   .attr('d', this.areaGenerator(data))
  //   .attr('opacity', 1);

  // d3.select('#LineChart')
  //   .select('path')
  //   .datum(data)
  //   .transition(ANIMATION_DURATION)
  //   .attr('d', this.lineGenerator(data))
  //   .attr('opacity', 1);

  // d3.select('#BarChart')
  //   .selectAll('g')
  //   //.selectAll("rect")
  //   .data(data)
  //   .enter()
  //   .append('rect')
  //   .attr("x", (data, i)=> xBarScale(i))
  //   .attr("y",(dataset, i)=> yLineAreaBarScale(i))
  //   .attr("width", d => 10)
  //   .attr("height", (dataset, i)=> yLineAreaBarScale(i))
  //   .attr("opacity", 1);

  // d3.select("#scatterplot")
  //   .selectAll("circle")
  //   .data(data)
  //   .enter()
  //   .append("circle")
  //   .attr("cx", d => xScatterScale(d.cases))
  //   .attr("cy", d => yScatterScale(d.deaths))
  //   .attr("r", 5)
    // .exit()
    // .remove()

  // d3.select('#BarChart')
  //   .select('')
  //TODO 
  // call each update function below, adjust the input for the functions if you need to.
  // this.updateBarChart();
  // this.updateLineChart();
  // this.updateAreaChart();
  // this.updateScatterPlot();
}

/**
 * Update the bar chart
 */

function updateBarChart () {
  // d3.select('#BarChart')
  //   .selectAll('g')
  //   //.selectAll("rect")
  //   .exit()
  //   .remove()
  //   .attr("x",(data, i) => xBarScale(labelset[i]))
  //   .attr("y",(data, i)=> CHART_HEIGHT - MARGIN.bottom-(CHART_HEIGHT / d3.max(dataset))*dataset[i])
  //   .attr("width", d => 20)
  //   .attr("height", (data, i)=> (CHART_HEIGHT / d3.max(dataset))*dataset[i])
  //   .attr("opacity", 0.8);

  
}

/**
 * Update the line chart
 */
function updateLineChart () {
  // d3.select('#LineChart')
  //   .exit()
  //   .remove()
  //   .select('path')
  //   .datum(data)
  //   .transition(ANIMATION_DURATION)
  //   .attr('d', this.lineGenerator(data))
  //   .attr('opacity', 1);

}

/**
 * Update the area chart 
 */
function updateAreaChart () {
  // d3.select('#AreaChart')
  //   .exit()
  //   .remove()
  //   .select('path')
  //   .datum(data)
  //   .transition(ANIMATION_DURATION)
  //   .attr('d', this.areaGenerator(data))
  //   .attr('opacity', 1);
}

/**
 * update the scatter plot.
 */

function updateScatterPlot () {
  // d3.select("#scatterplot")
  //   .exit()
  //   .remove()
  //   .selectAll("circle")
  //   .data(data)
  //   .enter()
  //   .append("circle")
  //   .attr("cx", d => xScatterScale(d.cases))
  //   .attr("cy", d => yScatterScale(d.deaths))
  //   .attr("r", 5)
}


/**
 * Update the data according to document settings
 */
function changeData () {
  //  Load the file indicated by the select menu
  const dataFile = d3.select('#dataset').property('value');

  d3.csv(`data/${dataFile}.csv`)
    .then(dataOutput => {
      /**
       * D3 loads all CSV data as strings. While Javascript is pretty smart
       * about interpreting strings as numbers when you do things like
       * multiplication, it will still treat them as strings where it makes
       * sense (e.g. adding strings will concatenate them, not add the values
       * together, or comparing strings will do string comparison, not numeric
       * comparison).
       *
       * We need to explicitly convert values to numbers so that comparisons work
       * when we call d3.max()
       **/

      const dataResult = dataOutput.map((d) => ({
        cases: parseInt(d.cases),
        deaths: parseInt(d.deaths),
        date: d3.timeFormat("%m/%d")(d3.timeParse("%d-%b")(d.date))
      }));
      if (document.getElementById('random').checked) {
        // if random subset is selected
        update(randomSubset(dataResult));
      } else {
        update(dataResult);
      }
    }).catch(e => {
      console.log(e);
      alert('Error!');
    });
}

/**
 *  Slice out a random chunk of the provided in data
 *  @param data
 */
function randomSubset (data) {
  return data.filter((d) => Math.random() > 0.5);
}
