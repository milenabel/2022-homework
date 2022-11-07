// function fetchJSONFile (path, callback) {
//     const httpRequest = new XMLHttpRequest();
//     httpRequest.onreadystatechange = function () {
//       if (httpRequest.readyState === 4) {
//         if (httpRequest.status === 200) {
//           const data = JSON.parse(httpRequest.responseText);
//           if (callback) callback(data);
//         }
//       }
//     };
//     httpRequest.open('GET', path);
//     httpRequest.send();
//   }
  
//   fetchJSONFile('data/words.json', function (data) {
//     // creating a column for use in table.js sorting for percentage column
//     data = data.map(d => ({
//         ...d,
//         sum: +d.percent_of_d_speeches + +d.percent_of_r_speeches
//     }))
//     const chart = new Chart(data);
//     console.log(data);
//     // chart.buildTree();
//     // chart.renderTree();
//     const table = new Table(data);
//     console.log(data)
//   });

async function loadData () {
    let data = await d3.json('data/words.json');
    data = data.map(d => ({
        ...d,
        sum: +d.percent_of_d_speeches + +d.percent_of_r_speeches
    }))
    return data;
}

const globalApplicationState = {
    selectedData: [],
    data: null,
    chart: null,
    table: null,
  };

  loadData().then((loadedData) => {
    console.log('Here is the imported data:', loadedData);
    // Store the loaded data into the globalApplicationState
    globalApplicationState.data = loadedData;
    // Creates the view objects with the global state passed in
    const chart = new Chart(globalApplicationState);
    const table = new Table(globalApplicationState);
    globalApplicationState.chart = chart;
    globalApplicationState.table = table;
  });