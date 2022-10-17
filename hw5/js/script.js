preGrouped = d3.json('./data/senate_polls.json');
// extraCredit = d3.csv('./data/senate_polls.csv');
// console.log(extraCredit);
// let selected_data = extraCredit.filter((d) => {d.state, d.winner_Dparty, d.winner_Rparty, d.mean_netpartymargin, d.p90_netpartymargin, d.p10_netpartymargin});
      
//     const newPollsData = d3.group(selected_data, (d) => {d.state, d.poll_id });
//     console.log(newPollsData);

Promise.all([d3.csv('./data/senate_forecasts.csv'), preGrouped]).then( data =>
    {
        let forecastData = data[0];
        let pollData = data[1];

        /////////////////
        // EXTRA CREDIT//
        /////////////////
        /**
         * replace preGrouped with extraCredit and uncomment the line that defines extraCredit.
         * Then use d3.rollup to group the csvfile on the fly.
         * 
         * If you are not doing the extra credit, you do not need to change this file.
         */
        
        rolledPollData = new Map(pollData); //  convert to a Map object for consistency with d3.rollup
        let table = new Table(forecastData, rolledPollData);
        table.drawTable();
    });