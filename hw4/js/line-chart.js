/** Class representing the line chart view. */
class LineChart {
  /**
   * Creates a LineChart
   * @param globalApplicationState The shared global application state (has the data and map instance in it)
   */

  
  constructor(globalApplicationState) {
    // Set some class level variables
    this.globalApplicationState = globalApplicationState;

    // const groupedCovidData = covidData
    // .filter(covidData => covidData.iso_code === 'OWID')
    // .map(covidData => covidData.iso_code)

    // console.log(covidData.iso_code.startsWith('OWID'));

    let tofilter = this.globalApplicationState.covidData.iso_code;
    let filteredData = tofilter.filter(d => d.iso_code.startsWith('OWID'));

    const groupedCovidData = d3.group(filteredData, (d) => d.location);
    console.log(groupedCovidData)




    
    // import data from './grouped.json';
    // console.log(data);

    //var json = require('./grouped.json');

    // $.getJSON("grouped.json", function(json) {
    //   console.log(json); // this will show the info it in firebug console
    // });

    // let grouped = topojson.feature(this.globalApplicationState.groupData, this.globalApplicationState.groupData.objects)

    // const groupedCovidData= require('./grouped.json'); 
    // console.log(groupedCovidData);

    lineChart = d3.select('#line-chart')
    // padding = {
    //   return {left: 80, bottom: 20, right:50}
    // }
    lineColorScale = d3.scaleOrdinal(d3.schemeTableau10).domain(groupedCovidData.keys());


    // let minValue = d3.min(this.groupedCovidData, function (d) {
    //     return d[groupedCovidData.date];
    // });
    // let maxValue = d3.max(this.groupedCovidData, function (d) {
    //     return d[selectedDimension];
    // });
    // let date = [];
    // for (let item of this.groupedCovidData) {
    //     date.push(item.date);
    // }


    // Add x axis --> it is a date format
    // let xAxis = {
        let xAxis =d3.scaleTime()
        .domain([d3.min(groupedCovidData, c => c.date), d3.max(groupedCovidData, c => c.date)])
        .range([ padding.left, innerWidth - padding.right]);

      lineChart
        .select('#x-axis')
        .attr('transform', `translate(0, ${700 - padding.bottom})`)
        .call(d3.axisBottom(xAxis).ticks(7,'.2d'))

      // Append x axis text
      lineChart
        .select('#axes')
        .append('text')
        .text('Date')
        .attr('x', 550)
        .attr('y', 600);

      // return xAxis
    // }

    // Add x axis --> it is a date format
    // yAxis = {
      // Add y axis
      const yAxis = d3.scaleLinear()
        .domain([0, d3.max(groupedCovidData, c => parseFloat(c.total_cases_per_million))])
        .range([ 600 - padding.bottom, 10 ])
        .nice();

      lineChart
        .select('#axes')
        .append('g')
        .attr('transform', `translate(${padding.left},0)`)
        .call(d3.axisLeft(yAxis));

      // Append y axis text
      lineChart
        .select('#axes')
        .append('text')
        .text('Cases per Million')
        .attr('x', -340)
        .attr('y', 20)
        .attr('transform', 'rotate(-90)');

    //   return yAxis
    // }

    lineChart
      .select('#lines')
      .selectAll('path')
      .data(groupedCovidData)
      .join('path')
      .attr('fill', 'none')
      .attr('stroke', ([group, values]) => lineColorScale(group))
      .attr('stroke-width', 1)
      .attr('d', ([group, values]) => d3.line()
                                        .x((d) => xAxis(d.date))
                                        .y((d) => yAxis(d.spending))
                                        (values))
  }

  updateSelectedCountries () {

  }
}
