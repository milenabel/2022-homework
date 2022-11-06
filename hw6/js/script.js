function fetchJSONFile (path, callback) {
    const httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          const data = JSON.parse(httpRequest.responseText);
          if (callback) callback(data);
        }
      }
    };
    httpRequest.open('GET', path);
    httpRequest.send();
  }
  
  fetchJSONFile('data/words.json', function (data) {
    // creating a column for use in table.js sorting for percentage column
    data = data.map(d => ({
        ...d,
        sum: +d.percent_of_d_speeches + +d.percent_of_r_speeches
    }))
    const chart = new Chart(data);
    console.log(data);
    // chart.buildTree();
    // chart.renderTree();
    const table = new Table(data);
    console.log(data)
  });