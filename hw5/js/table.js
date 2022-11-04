/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(data) {
        this.data = data;
        this.tableData = [...data];
        // add useful attributes
        for (let forecast of this.tableData)
        {
            forecast.isForecast = true;
            forecast.isExpanded = false;
        }
        this.headerData = [
            {
                sorted: false,
                ascending: false,
                key:'phrase'
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
                key: 'mean_netpartymargin',
                alterFunc: d => Math.abs(+d)
            },
            {
                sorted: false,
                ascending: false,
                key: 'total',
                alterFunc: d => +d
            },
        ]

        this.vizWidth = 300;
        this.vizHeight = 30;
        this.smallVizHeight = 20;

        this.scaleX1 = d3.scaleLinear()
            .domain([0.0, 1.0])
            .range([0, this.vizWidth]);

        this.scaleX2 = d3.scaleLinear()
            .domain([-100, 100])
            .range([0, this.vizWidth]);

        this.attachSortHandlers();
        this.drawLegend();
    }

    drawLegend() {
        /**
         * Draw the legend for the bar chart.
         */

        let svgSelect1 = d3.select('#marginaxis1')
        .attr('width', this.vizWidth)
        .attr('height', this.vizHeight);
        
        this.addGridlines(svgSelect, [0]);

        const pad = 3;

        svgSelect1.selectAll('text')
            .data([-100, -50, 0, 50, 100])
            .join('text')
            .attr('x', d => this.scaleX2(d))
            .attr('y', this.vizHeight - pad)
            .text(d => `+${Math.abs(d)}`)
            .attr('class', d => d < 0 ? 'biden' : 'trump')
            .classed('label', true)

        let svgSelect1 = d3.select('#marginaxis2')
            .attr('width', this.vizWidth)
            .attr('height', this.vizHeight);

        svgSelect.selectAll('text')
            .data([-100, -50, 0, 50, 100])
            .join('text')
            .attr('x', d => this.scaleX2(d))
            .attr('y', this.vizHeight - pad)
            .text(d => `+${Math.abs(d)}`)
            .attr('class', d => d < 0 ? 'biden' : 'trump')
            .classed('label', true)
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

        let selection = rowSelection.selectAll('td')
            .data(this.rowToCellDataTransform)
            .join('td')
            .attr('class', d => d.class);



        // ++++++++ BEGIN CUT +++++++++++
        selection.filter(d => d.type === 'text').text(d => d.phrase);
        console.log(selection);
        // ++++++++  END CUT  +++++++++++

        let vizSelection = selection.filter(d => d.type === 'viz');

        let svgSelect = vizSelection.selectAll('svg')
            .data(d => [d])
            .join('svg')
            .attr('width', this.vizWidth)
            .attr('height', d => d.isForecast ? this.vizHeight : this.smallVizHeight);

        let grouperSelect = svgSelect.selectAll('g')
            .data(d => [d, d, d, d])
            .join('g');

        this.addGridlines2(grouperSelect.filter((d,i) => i === 0), [-100, -50, 0, 50, 100]);
        this.addGridlines1(grouperSelect.filter((d,i) => i === 0), [0.0, 0.5, 1.0]);
        this.addRectangles2(grouperSelect.filter((d,i) => i === 1));
        this.addRectangles1(grouperSelect.filter((d,i) => i === 1));
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
            const trumpWinChance = +d.percent_of_r_speeches;
            const bidenWinChance = +d.percent_of_d_speeches;

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
        /**
         * update the column headers based on the sort state
         */
        const colSelect = d3.select('#columnHeaders');

        colSelect.selectAll('th')
            .data(this.headerData)
            .classed('sorting', d => d.sorted)

        colSelect.selectAll('i')
            .data(this.headerData)
            .classed('no-display', d => !d.sorted)
            .classed('fa-sort-up', d => d.ascending)
            .classed('fa-sort-down', d => !d.ascending);
            // ++++++++  END CUT  +++++++++++
    }

    addGridlines1(containerSelect, ticks) {
        ////////////
        // PART 3 // 
        ////////////
        /**
         * add gridlines to the vizualization
         */

        // ++++++++ BEGIN CUT +++++++++++
        containerSelect.selectAll('line')
            .data(ticks)
            .join('line')
            .attr('x1', d => this.scaleX1(d))
            .attr('x2', d => this.scaleX1(d))
            .attr('y1', 0)
            .attr('y2', this.vizHeight) // this is technically out of bounds in the smaller svg, but it doesn't show and makes the code simpler.
            .attr('stroke', d => d === 0 ? 'black' : '#cccccc');
        // ++++++++  END CUT  +++++++++++
    }

    addGridlines2(containerSelect, ticks) {
        ////////////
        // PART 3 // 
        ////////////
        /**
         * add gridlines to the vizualization
         */

        // ++++++++ BEGIN CUT +++++++++++
        containerSelect.selectAll('line')
            .data(ticks)
            .join('line')
            .attr('x1', d => this.scaleX2(d))
            .attr('x2', d => this.scaleX2(d))
            .attr('y1', 0)
            .attr('y2', this.vizHeight) // this is technically out of bounds in the smaller svg, but it doesn't show and makes the code simpler.
            .attr('stroke', d => d === 0 ? 'black' : '#cccccc');
        // ++++++++  END CUT  +++++++++++
    }

    addRectangles2(containerSelect) {
        ////////////
        // PART 4 // 
        ////////////
        /**
         * add rectangles for the bar charts
         */

        // ++++++++ BEGIN CUT +++++++++++
        const heightPercent = 2/3;
        const padPercent = (1 - heightPercent) / 2

        containerSelect.filter(d => d.isForecast).selectAll('rect')
            .data(d => {
                let val = d.phrase;
                if (Math.sign(val.marginLow) === Math.sign(val.marginHigh))
                {
                    return [[val.marginLow, val.marginHigh]];
                }
                return [[val.marginLow, 0], [0, val.marginHigh]]
            })
            .join('rect')
            .attr('x', d => this.scaleX2(d[0]))
            .attr('y', this.vizHeight * padPercent)
            .attr('width', d => this.scaleX2(d[1]) - this.scaleX2(d[0]))
            .attr('height', this.vizHeight * heightPercent)
            .classed('biden', d => d[0] < 0)
            .classed('trump', d => d[1] > 0)
            .classed('margin-bar', true);

        containerSelect.filter(d => !d.isForecast).selectAll('rect').remove();
        // ++++++++  END CUT  +++++++++++
    }

    addRectangles1(containerSelect) {
        ////////////
        // PART 5 // 
        ////////////
        /**
         * add circles to the vizualizations
         */

        // ++++++++ BEGIN CUT +++++++++++
        containerSelect.selectAll('circle')
            .data(d => [d])
            .join('circle')
            .attr('cx', d => this.scaleX2(d.value.margin))
            .attr('cy', d => d.isForecast ? this.vizHeight / 2 : this.smallVizHeight / 2)
            .attr( 'r', d => d.isForecast ? this.vizHeight / 6 : this.vizHeight / 9 )
            .classed('trump', d => d.value.margin > 0)
            .classed('biden', d => d.value.margin <= 0)
            .classed('margin-circle', true);
        // ++++++++  END CUT  +++++++++++
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

        // ++++++++ BEGIN CUT +++++++++++
        d3.select('#columnHeaders')
            .selectAll('th')
            .data(this.headerData)
            .on('click', (event, d) => 
            {
                this.collapseAll(); // Comment this line out for extra credit 2
                const sortAscending = d.sorted ? !d.ascending : true; // sort ascending by default, otherwise flip it.
                this.sortData(d.key, sortAscending, d.alterFunc);
                // reset state
                for (let header of this.headerData)
                {
                    header.sorted = false;
                }
                // set new state for this node
                d.sorted = true;
                d.ascending = sortAscending;
                this.drawTable();
            });
            // ++++++++  END CUT  +++++++++++
    }

    // ++++++++ BEGIN CUT +++++++++++
    sortData(key, ascend, alterFunc)
    {
        // let tempLookup = d3.group(this.tableData.filter(d => d.isForecast), d => d.state); // for extra credit only
        this.tableData.sort((a, b) =>
            {
                let sortKey = key;
                // ---- Extra Credit 2 Logic ----
                // To Run:
                // * comment out call to this.collapseAll()
                // * uncomment the line that defines tempLookup in the first funciton of sortData
                // 
                // if (a.isForecast !== b.isForecast)
                // {
                //     // in the case you compare a forecast with a poll
                //     if (a.state === b.state)
                //     {
                //         // if the poll belongs to the forecast, always sort the poll below the forecast
                //         if (a.isForecast)
                //         {
                //             return -1;
                //         }
                //         return 1;
                //     }
                //     // otherwise sort based on parent grouper
                //     if (!a.isForecast)
                //     {
                //         a = tempLookup.get(a.state)[0];
                //     }
                //     else
                //     {
                //         b = tempLookup.get(b.state)[0];
                //     }
                // }
                // else if (!a.isForecast && !b.isForecast)
                // {
                //     // in the case you have two polls
                //     if (a.state !== b.state)
                //     {
                //         // actually compare based on parent groupers
                //         a = tempLookup.get(a.state)[0];
                //         b = tempLookup.get(b.state)[0];
                //     }
                //     else if (key === 'state')
                //     {
                //         // in the case where you are comparing two polls for the same state
                //         // and sorting based on the state key, you need to reference a different
                //         // attribute
                //         sortKey = 'name';
                //     }
                // }
                // ---- end extra credit logic ----
                let x = a[sortKey];
                let y = b[sortKey];

                if (!ascend)
                {
                    [x, y] = [y, x] // swap variables
                }
                if (alterFunc)
                {
                    x = alterFunc(x);
                    y = alterFunc(y);
                }
                if (x < y)
                {
                    return -1
                }
                else if (x > y)
                {
                    return 1
                }
                return 0;
            }
        );
    }
    // ++++++++  END CUT  +++++++++++


    toggleRow(rowData, index) {
        ////////////
        // PART 8 // 
        ////////////
        /**
         * Update table data with the poll data and redraw the table.
         */
        // ++++++++  BEGIN CUT  +++++++++++
        if (rowData.isExpanded)
        {
            // collapse - remove rows
            this.tableData = this.tableData.filter(d => d.isForecast || rowData.state !== d.state);
        }
        else
        {
            // expand - add rows
            let addList = this.pollData.get(rowData.state);
            if (addList)
            {
                this.tableData.splice(index + 1, 0, ...addList);
            }
        }
        rowData.isExpanded = !rowData.isExpanded;
        this.drawTable();
        // ++++++++  END CUT  +++++++++++
    }

    collapseAll() {
        this.tableData = this.tableData.filter(d => d.isForecast)
    }

}
