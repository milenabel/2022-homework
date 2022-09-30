/** Class representing the map view. */
class MapVis {
  /**
   * Creates a Map Visuzation
   * @param globalApplicationState The shared global application state (has the data and the line chart instance in it)
   */
  constructor(globalApplicationState) {
    this.globalApplicationState = globalApplicationState;

    // Set up the map projection
    const projection = d3.geoWinkel3()
      .scale(150) // This set the size of the map
      .translate([400, 250]); // This moves the map to the center of the SVG

    this.drawMap(this.globalApplicationState.mapData, this.globalApplicationState.covidData, projection)
  }

  drawMap(mapData, covidData, projection){
    // try {
    let geojson = topojson.feature(mapData, mapData.objects.countries);
    console.log(geojson)

    // svg.append("path")
    //       .datum(topojson.feature(mapData, mapData.objects.countries))
    //       .attr("d", d3.geoPath().projection(d3.geoWinkel3()));

    // let svg = d3.select('#map').append('svg');

    let path = d3.geoPath()
        .projection(projection);


    // creating the map and its graticules
    let graticule = d3.geoGraticule();

    d3
      .select('#map')
      .append('svg')
      .append('defs')
      .append('path')
      .datum({type: 'Sphere'})
      .attr('id', 'sphere')
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .style('opacity', 0.2);
    d3
      .select('#map')
      .append('svg')
      .append('use')
      .attr('class', 'fill')
      .attr('xlink:href', '#sphere')
      d3
      .select('#map')
      .append('svg')
      .append('path')
      .datum(graticule)
      .attr('d', path)
      .attr('class', 'graticule')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .style('opacity', 0.2);

    let countries = topojson.feature(mapData, mapData.objects.countries).features;
    let colorScale = d3.scaleSequential(d3.interpolateReds)
        .domain([d3.min(covidData, c => parseFloat(c.total_cases_per_million)), d3.max(covidData, c => parseFloat(c.total_cases_per_million))]);

    d3
      .select('#map')
      .append('svg')
      .selectAll('path')
      .data(countries)
      .enter()
      .append('path')
      .attr('d', d=>path)
      .attr('class', 'country')
      .attr('d', path)
      .attr('fill', (d) => {return colorScale(d3.max(covidData.filter(c => c.iso_code === d.id), c => parseFloat(c.total_cases_per_million)));})
      .attr('id', (d) => d.id)
    //   .on('click', (d) => {
    //   console.log('clicked', d)
    // })

    // const stateD3 = d3
    //   .select('#map')
    //   .append('svg')
    //   .select('#countries')
    //   .selectAll('path')
    //   .data(countries)
    //   .enter()
    //   .append('path')
    //   .attr('d', path)
    //   .attr('fill', (d) => {return colorScale(d3.max(covidData.filter(c => c.iso_code === d.id), c => parseFloat(c.total_cases_per_million)));})
    //   // colorScale(countries))
    //   .attr('id', (d) => d.id)
    //   .attr('stroke', 'lightgrey')
      
    // stateD3.on('click', (d) => {
    //   console.log('clicked', d)
    // })
    

    // svg
    //   .selectAll('path')
    //   .data(countries)
    //   .enter()
    //   .append('path')
    //   .attr("class", "country")
    //   .attr('d', path(countries))
    //   .attr('fill', 'none')
    //   .attr('stroke', 'lightgrey')

    // d3.select("#map")
    //     .select("#graticule")
    //     .append('path')
    //     .attr('d', geoGraticule.outline())
    //     .attr('fill', 'none')
    //     .attr('stroke', 'black')
    //     .style('opacity', 0.2);
  
    // const stateD3 = svg
    //   .select('#countries')
    //   .selectAll('path')
    //   .data(countries.features)
    //   .enter()
    //   .append('path')
    //   .attr('d', path)
    //   .attr('fill', (d) => colorScale(countries))
    //   .attr('stroke', 'lightgrey')
      
    // stateD3.on('click', (d) => {
    //   console.log('clicked', d)
    // })


      // //formation of outlines and boundaries using outline
      // let mapGraticule = d3.geoGraticule();
      // d3.select("#map").append("path").datum(mapGraticule).attr("class", "graticule").attr("d", path);
      // d3.select("#map").append("path").datum(mapGraticule.outline).classed("strokeGraticule", true).attr("d", path);

      
      // }
      // catch(error){
      //     console.log(error);
      // }
  }

  updateSelectedCountries () {

  }
}
