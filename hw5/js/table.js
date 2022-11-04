/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(forecastData, pollData) {
        this.forecastData = forecastData;
        this.tableData = [...forecastData];
        console.log(forecastData);
        console.log(this.tableData);
        // add useful attributes
        for (let forecast of this.tableData)
        {
            forecast.isForecast = true;
            forecast.isExpanded = false;
        }
        this.pollData = pollData;
        this.headerData = [
            {
                sorted: false,
                ascending: false,
                key: 'state'
            },
            {
                sorted: false,
                ascending: false,
                key: 'mean_netpartymargin',
                alterFunc: d => Math.abs(+d)
            },
            {
                sorted: false,
                ascending: false,
                key: 'winner_Rparty',
                alterFunc: d => +d
            },
        ]

        this.vizWidth = 300;
        this.vizHeight = 30;
        this.smallVizHeight = 20;

        this.scaleX = d3.scaleLinear()
            .domain([-100, 100])
            .range([0, this.vizWidth]);

        // this.KeyMap = d3.map(this.headerData, d => d.key);
        this.attachSortHandlers();
        this.drawLegend();
    }

    drawLegend() {
        ////////////
        // PART 2 //
        ////////////
        /**
         * Draw the legend for the bar chart.
         */
        //let labels1 = ['+75','+50','+25', '','+25', '+50', '+75'];
        let labels = ['+75','+50','+25','+25', '+50', '+75'];
        let ticks = [-75,-50, -25, 25, 50, 75];

        // version 1 

        // let svg = d3.select('#marginAxis')
        //     .attr('width', this.vizWidth)
        //     .attr('height', this.vizHeight);
        
        // let line = svg.append('line')
        //     .attr('x1', (this.vizWidth/2))
        //     .attr('y1', 0)
        //     .attr('x2', (this.vizWidth/2))
        //     .attr('y2', this.vizHeight)
        //     .style('stroke-width', 2)
        //     .style('stroke', 'black')
        //     .style('fill', 'none');

        // let grouped = svg.selectAll('g')
        //     .data(labels1)
        //     .enter()
        //     .append('g')
        //     .attr('tranform', function(d, i) {
        //         return `translate(` + (i*37.5+26) + `,0)`;
        //     });

        // grouped.append('text')
        //     .attr('class', function(d, i) {
        //         if (i < 3){return 'biden';}
        //         else {return 'trump';}
        //     })
        //     .attr('dy', '1.5em')
        //     .text(d => d);

        // version 2

        let axis = d3
            .axisBottom(this.scaleX)
            .tickValues(ticks)
            .tickFormat(function(d, i){return labels[i]});
        
        let scale = d3.select('#predictionTable')
            .select('#marginAxis')
            .attr('width', this.vizWidth)
            .attr('height', this.vizHeight)
            .call(axis); 

        let removingDomain = scale
            .select('.domain')
            .attr('stroke-width', 0)
            ;   
        let removingTicks = scale
            .selectAll('g')
            .selectAll('line')
            .remove()
            .selectAll('path')
            .remove();

        d3.selectAll('g.tick')
            .select('text')
            .attr('class', function(d, i){ 
                if (i < 3){
                return 'biden'}
                else {return 'trump'}
            })
            .attr('text-size', '30px')
            .attr('dy', '1.5 em');

        let line = scale.append('line')
            .attr('x1', (this.vizWidth/2))
            .attr('y1', 0)
            .attr('x2', (this.vizWidth/2))
            .attr('y2', this.vizHeight)
            .style('stroke-width', 2)
            .style('stroke', 'black')
            .style('fill', 'none');
    }

    drawTable() {
        this.updateHeaders();
        let rowSelection = d3.select('#predictionTableBody')
            .selectAll('tr')
            .data(this.tableData)
            .join('tr');

        rowSelection.on('click', (event, d) => 
            {
                if (d.isForecast)
                {
                    this.toggleRow(d, this.tableData.indexOf(d));
                }
            });
        
        //console.log(rowSelection);

        let forecastSelection = rowSelection.selectAll('td')
            .data(this.rowToCellDataTransform)
            .join('td')
            .attr('class', d => d.class);
        //console.log(forecastSelection);

        ////////////
        // PART 1 // 
        ////////////
        /**
         * with the forecastSelection you need to set the text based on the dat value as long as the type is 'text'
         */
        let filteredData = forecastSelection.filter(d => d.type === 'text');
        //console.log(filteredData);
        let rows = filteredData
            .append('text')
            .text((d) => {
                    return Object.values(d);
                })
            .join('td').text(d => d.value)

        let vizSelection = forecastSelection.filter(d => d.type === 'viz');
        console.log(vizSelection);

        let svgSelect = vizSelection.selectAll('svg')
            .data(d => [d])
            .join('svg')
            .attr('width', this.vizWidth)
            .attr('height', d => d.isForecast ? this.vizHeight : this.smallVizHeight);

        let grouperSelect = svgSelect.selectAll('g')
            .data(d => [d, d, d])
            .join('g');

        this.addGridlines(grouperSelect.filter((d,i) => i === 0), [-75, -50, -25, 0, 25, 50, 75]);
        this.addRectangles(grouperSelect.filter((d,i) => i === 1));
        this.addCircles(grouperSelect.filter((d,i) => i === 2));
    }

    rowToCellDataTransform(d) {
        let stateInfo = {
            type: 'text',
            class: d.isForecast ? 'state-name' : 'poll-name',
            value: d.isForecast ? d.state : d.name
        };

        let marginInfo = {
            type: 'viz',
            value: {
                marginLow: -d.p90_netpartymargin,
                margin: d.isForecast ? -(+d.mean_netpartymargin) : d.margin,
                marginHigh: -d.p10_netpartymargin,
            }
        };

        let winChance;
        if (d.isForecast)
        {
            const trumpWinChance = +d.winner_Rparty;
            const bidenWinChance = +d.winner_Dparty;

            const trumpWin = trumpWinChance > bidenWinChance;
            const winOddsValue = 100 * Math.max(trumpWinChance, bidenWinChance);
            let winOddsMessage = `${Math.floor(winOddsValue)} of 100`
            if (winOddsValue > 99.5 && winOddsValue !== 100)
            {
                winOddsMessage = '> ' + winOddsMessage
            }
            winChance = {
                type: 'text',
                class: trumpWin ? 'trump' : 'biden',
                value: winOddsMessage
            }
        }
        else
        {
            winChance = {type: 'text', class: '', value: ''}
        }

        let dataList = [stateInfo, marginInfo, winChance];
        for (let point of dataList)
        {
            point.isForecast = d.isForecast;
        }
        return dataList;
        //this.KeyMap = [{'wins' : winOddsValue }];
    }

    updateHeaders() {
        ////////////
        // PART 7 // 
        ////////////
        /**
         * update the column headers based on the sort state
         */
        //not completed

        let that = this;
        // d3.selectAll('th')
        //     .attr('class', 'sorting');
        // d3.selectAll('i')
        //     .select('class', 'no-display')
        //     .remove();   

    }

    addGridlines(containerSelect, ticks) {
        ////////////
        // PART 3 // 
        ////////////
        /**
         * add gridlines to the vizualization
         */
        for (let i=0; i<ticks.length; i++){
            let position = this.scaleX(ticks[i])
            if (i === 3){
                containerSelect
                    .append('line') // middle line
                    .attr('x1', 150)
                    .attr('y1', 0)
                    .attr('x2', 150)
                    .attr('y2', this.vizHeight)
                    .style('stroke-width', 2)
                    .style('stroke', 'black')
                    .style('fill', 'none');
            }
            else {
                containerSelect
                    .append('line')  // actual gridlines
                    .attr('x1', position)
                    .attr('y1', 0)
                    .attr('x2', position)
                    .attr('y2', this.vizHeight)
                    .style('stroke-width', 2)
                    .style('stroke', 'lightgrey')
                    .style('fill', 'none');
            }
        };
    }

    addRectangles(containerSelect) {
        ////////////
        // PART 4 // 
        ////////////
        /**
         * add rectangles for the bar charts
         */
        let that = this;
        let individualContainers = containerSelect 
            .append('rect')
            .attr('x', function(d){
                let x1 = that.scaleX(d.value.marginLow);
                return x1;
            })
            .attr('y', 0)
            .attr('width', function(d){
                let x1 = that.scaleX(d.value.marginLow);
                let x2 = that.scaleX(d.value.marginHigh);
                if (x1 <= 150 && x2 >= 150){ return 0; }
                else { return x2 - x1; }
            })
            .attr('height', 20)
            .attr('class', function(d) {
                if (that.scaleX(d.value.marginLow) >= 150) { return 'trump'; }
                else if (that.scaleX(d.value.marginLow) <= 150) { return 'biden'; }
            })
            .style('opacity', 0.5);

        let bidenContainers = containerSelect 
            .append('rect')
            .attr('x', function(d){
                let x1 = that.scaleX(d.value.marginLow);
                let x2 = that.scaleX(d.value.marginHigh);
                if (x1 <= 150 && x2 >= 150){ return x1; }
                else { return 0; }
            })
            .attr('y', 0)
            .attr('width', function(d){
                let x1 = that.scaleX(d.value.marginLow);
                let x2 = that.scaleX(d.value.marginHigh);
                if (x1 <= 150 && x2 >= 150){ return 150-x1; }
                else {return 0; }
            })
            .attr('height', 20)
            .attr('class', 'biden')
            .style('opacity', 0.5);

        let trumpContainers = containerSelect 
            .append('rect')
            .attr('x', 150)
            .attr('y', 0)
            .attr('width', function(d){
                let x1 = that.scaleX(d.value.marginLow);
                let x2 = that.scaleX(d.value.marginHigh);
                if (x1 <= 150 && x2 >= 150){ return x2 -150; }
                else {return 0; }
            })
            .attr('height', 20)
            .attr('class', 'trump')
            .style('opacity', 0.5);
    }

    addCircles(containerSelect) {
        ////////////
        // PART 5 // 
        ////////////
        /**
         * add circles to the vizualizations
         */
        let that = this;
        containerSelect
            .append('circle')
            .attr('cx', function(d){ return (that.scaleX(d.value.margin)); })
            .attr('cy', 10)
            .attr('r', 5)
            .attr('class', function(d){
                let change = that.scaleX(d.value.margin);
                if (change < 150){return 'biden';}
                else {return 'trump';}
            })
            .style('stroke', 'black')
            .style('stroke-width', 0.5);      
    }

    attachSortHandlers() 
    {
        ////////////
        // PART 6 // 
        ////////////
        /**
         * Attach click handlers to all the th elements inside the columnHeaders row.
         * The handler should sort based on that column and alternate between ascending/descending.
         */
        let that = this;
        let selection = d3.select('#columnHeaders')
            .selectAll('th')
            .on('click', function(d){
                onClick(d);
                //console.log(that.tableData[0]['state'])
            })

        // KeyMap is not yet defined
        //this.KeyMap [{'wins' : this.winOddsValue }];
        
        function onClick(d){
            let key = d.path[0].innerText;
            key = that.KeyMap[key]
            let ascending = false;
            that.headerData.map(function(d){
                if (d.key === key){
                    d.sorted = true;
                    d.ascending=!d.ascending;
                    ascending=d.ascending;
                }
                else {d.sorted = false};
                    // else { return d3.descending(a.headerData.key['state'], b.headerData.key['state']); }
            });
            that.tableData.sort(function(a, b){
                if (ascending){ return d3.ascending(a[key], b[key]); }
                else { return d3.descending(a[key], b[key]); }
            });

        }        
    }

  


    toggleRow(rowData, index) {
        ////////////
        // PART 8 // 
        ////////////
        /**
         * Update table data with the poll data and redraw the table.
         */

        // not completed
        let that = this;
        // rowData.sort(function(a, b){
        //     if (that.tableData.parents === pollData.entries){
        //         return console.log(rowData);
        //     }
        // });     
    }

    collapseAll() {
        this.tableData = this.tableData.filter(d => d.isForecast)
    }

}
