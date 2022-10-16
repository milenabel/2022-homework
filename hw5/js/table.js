/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(forecastData, pollData) {
        this.forecastData = forecastData;
        this.tableData = [...forecastData];
        console.log(forecastData);
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
        let axis = d3
            .axisBottom(this.scaleX)
            .tickValues([-75,-50, -25, 25, 50, 75])
            .tickFormat(d3.format('+'));
            
        // let styles = axis.style(axis.tickValues()>0 ? 'red' : 'blue');

        let scale = d3.select('#predictionTable')
            .select('#marginAxis')
            .attr('width', this.vizWidth)
            .attr('height', this.vizHeight)
            .call(axis);   

        let removingDomain = scale
            .select('.domain')
            .attr('stroke-width', 0);
            
        let removingTicks = scale
            .selectAll('g')
            .selectAll('line')
            .remove()
            .selectAll('path')
            .remove();

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
    }

    updateHeaders() {
        ////////////
        // PART 7 // 
        ////////////
        /**
         * update the column headers based on the sort state
         */

     
    }

    addGridlines(containerSelect, ticks) {
        ////////////
        // PART 3 // 
        ////////////
        /**
         * add gridlines to the vizualization
         */
        //containerSelect = d3.select('#predictionTableBody').selectAll('svg').select('g');
        // ticks = [-75, -50, -25, 0, 25, 50, 75];
        let gridline1 = containerSelect
            .append('line')
            .attr('x1', ticks[0])
            .attr('y1', 0)
            .attr('x2', ticks[0])
            .attr('y2', this.vizHeight)
            .attr('transform', 'translate(+115, 0)')
            .style('stroke-width', 2)
            .style('stroke', 'lightgrey')
            .style('fill', 'none');
        
        let gridline2 = containerSelect.append('line')
            .attr('x1', ticks[1])
            .attr('y1', 0)
            .attr('x2', ticks[1])
            .attr('y2', this.vizHeight)
            .attr('transform', 'translate(+130, 0)')
            .style('stroke-width', 2)
            .style('stroke', 'lightgrey')
            .style('fill', 'none');

        let gridline3 = containerSelect.append('line')
            .attr('x1', ticks[3])
            .attr('y1', 0)
            .attr('x2', ticks[3])
            .attr('y2', this.vizHeight)
            .attr('transform', 'translate(+115, 0)')
            .style('stroke-width', 2)
            .style('stroke', 'lightgrey')
            .style('fill', 'none');

        let gridline4 = containerSelect.append('line')
            .attr('x1', ticks[4])
            .attr('y1', 0)
            .attr('x2', ticks[4])
            .attr('y2', this.vizHeight)
            .attr('transform', 'translate(+165, 0)')
            .style('stroke-width', 2)
            .style('stroke', 'lightgrey')
            .style('fill', 'none');

        let gridline5 = containerSelect.append('line')
            .attr('x1', ticks[5])
            .attr('y1', 0)
            .attr('x2', ticks[5])
            .attr('y2', this.vizHeight)
            .attr('transform', 'translate(+175, 0)')
            .style('stroke-width', 2)
            .style('stroke', 'lightgrey')
            .style('fill', 'none');
            
        let gridline6 = containerSelect.append('line')
            .attr('x1', ticks[6])
            .attr('y1', 0)
            .attr('x2', ticks[6])
            .attr('transform', 'translate(+190, 0)')
            .attr('y2', this.vizHeight)
            .style('stroke-width', 2)
            .style('stroke', 'lightgrey')
            .style('fill', 'none');

        let line = containerSelect.append('line')  // middle line
            .attr('x1', (this.vizWidth/2))
            .attr('y1', 0)
            .attr('x2', (this.vizWidth/2))
            .attr('y2', this.vizHeight)
            .style('stroke-width', 2)
            .style('stroke', 'black')
            .style('fill', 'none');

    }

    addRectangles(containerSelect) {
        ////////////
        // PART 4 // 
        ////////////
        /**
         * add rectangles for the bar charts
         */
        

       
    }

    addCircles(containerSelect) {
        ////////////
        // PART 5 // 
        ////////////
        /**
         * add circles to the vizualizations
         */

      
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

        
    }

  


    toggleRow(rowData, index) {
        ////////////
        // PART 8 // 
        ////////////
        /**
         * Update table data with the poll data and redraw the table.
         */
     
    }

    collapseAll() {
        this.tableData = this.tableData.filter(d => d.isForecast)
    }

}
