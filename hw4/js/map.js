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

    // this.nameArray = globalApplicationState.population.map(d => d.geo.toUpperCase());
    // this.populationData = globalApplicationState.population;
    // this.updateCountry = updateCountry;

    try {
    let geojson = topojson.feature(worldMap, worldMap.objects.countries);
    let path = d3.geoPath(this.projection);
    //let svgSelection = d3.select("#map").append("svg");
    let countryData = geojson.features.map(country => {

      let index = this.nameArray.indexOf(country.id);
      let region = 'countries';

      if (index > -1) {
          //  console.log(this.populationData[index].geo, country.id);
        region = this.populationData[index].region;
        return new CountryData(country.type, country.id, country.properties, country.geometry, region);
      }
      else {
      //iso_code', 'location', 'date', 'total_cases_per_million']
        //console.log('not found');
        return new CountryData(country.type, country.id, country.properties, country.geometry, null);
      }
    });

    d3.select("map")
        .select("#graticule")
        .append('path')
        .attr('d', path(geoGraticule()))
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .style('opacity', 0.2);

    d3.select("#map")
      .selectAll("path")
      .data(countryData)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", d => d.region)
      .classed("countries", true)
      .classed("boundary", true)
      .attr("id", d => d.id);


      // //formation of outlines and boundaries using outline
      // let mapGraticule = d3.geoGraticule();
      // d3.select("#map").append("path").datum(mapGraticule).attr("class", "graticule").attr("d", path);
      // d3.select("#map").append("path").datum(mapGraticule.outline).classed("strokeGraticule", true).attr("d", path);

      
      }
      catch(error){
          console.log(error);
      }
  }

  updateSelectedCountries () {

  }
}
