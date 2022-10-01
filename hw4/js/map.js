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
    try {
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

      console.log(covidData)

      Object.keys(covidData).map(function (key, index) {
        if (covidData[key] == null) {
            covidData[key] === 0;
        }
      });
      console.log(covidData); 

    let fcovidData = covidData

    let countries = topojson.feature(mapData, mapData.objects.countries).features;
    let colorScale = d3.scaleSequential(d3.interpolateReds)
        .domain([d3.min(covidData, c => parseFloat(c.total_cases_per_million)), d3.max(covidData, c => parseFloat(c.total_cases_per_million))]);

    const that = this;
    d3
      .select('#map')
      .select('#countries')
      .selectAll('path')
      .data(countries)
      .enter()
      .append('path')
      .attr('d', d=>path)
      .attr('class', 'country')
      .attr('d', path)
      .attr('id', (d) => d.id)
      .attr('fill', (d) => colorScale(d3.max(covidData.filter(c => c.iso_code === d.id), c => parseFloat(c.total_cases_per_million))))
      .on("click", function(event, d) {
        let selection = that.updateSelectedCountries(d);
        console.log('clicked', d);
      })

      // .on('click', (d)=> {
      //     console.log('clicked', d)
      //   })

    // countries.on("click", function(event, d) {
    //   const selection = that.updateSelectedCountries(d);
    //   console.log(d);
    // })

      }
      catch(error){
          console.log(error);
      }

    legend = d3.select('#legend')
      .append('rect')
      .attr('width', innerWidth)
      .attr('y', 0)
      .attr('height', 50)
      .style("fill", "url(#color-gradient)");

    let linearGradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "linear-gradient");






      // append a defs (for definition) element to your SVG
// var svgLegend = d3.select('body').append('svg')
// .attr("width",600);
// var defs = svgLegend.append('defs');

// // append a linearGradient element to the defs and give it a unique id
// var linearGradient = defs.append('linearGradient')
// .attr('id', 'linear-gradient');

// // horizontal gradient
// linearGradient
// .attr("x1", "0%")
// .attr("y1", "0%")
// .attr("x2", "100%")
// .attr("y2", "0%");

// // append multiple color stops by using D3's data/enter step

// linearGradient.selectAll("stop")
// .data(colorScale.domain())
// .enter().append("stop")
// .attr("offset", function(d) { 
// return d+"%"; 
// })
// .attr("stop-color", function(d) { 
// return colorScale(d); 
// });

// // append title
// svgLegend.append("text")
// .attr("class", "legendTitle")
// .attr("x", 0)
// .attr("y", 20)
// .style("text-anchor", "left")
// .text("Legend title");

// // draw the rectangle and fill with gradient
// svgLegend.append("rect")
// .attr("x", 10)
// .attr("y", 30)
// .attr("width", 400)
// .attr("height", 15)
// .style("fill", "url(#linear-gradient)");

// //create tick marks
// var xLeg = d3.scaleLinear()
// .domain([0, 100])
// .range([10, 400]);

// var axisLeg = d3.axisBottom(xLeg)
// .tickValues(colorScale.domain())

// svgLegend
// .attr("class", "axis")
// .append("g")
// .attr("transform", "translate(0, 40)")
// .call(axisLeg);

  }


  updateSelectedCountries () {
    let projection = this.projection;
    //Clear any previous selections;
    this.clearMap();
  }
}
