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

    groupedCovidData = d3.group(covidData, (d) => { d.iso_code.filter(d => d.iso_code === 'OWID')});
      // covidData.filter(covidData => covidData.iso_code === 'OWID')
    console.log(groupedCovidData)
    

  }

  updateSelectedCountries () {

  }
}
