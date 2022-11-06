// /** Class implementing the table. */
class Table {
//     /**
//      * Creates a Table Object
//      */
    constructor(data) {
        this.data = data;
        this.tableData = [...data];
    
        this.filteredData = this.data.filter(d => [d.phrase, d.percent_of_d_speeches, d.percent_of_r_speeches, d.total]);
        this.colors = d3.scaleOrdinal()
            .domain(this.data.map( (d,i) => d.category[i] ))
            .range(['#ff50b3', '#a2ff50', '#9FE2BF', '#FF7F50', '#6495ED', '#CCCCFF']);

        this.headerData = [
            {
                sorted: false,
                ascending: false,
                key:'phrase'
            },
            {
                sorted: false,
                ascending: false,
                key: 'total',
                alterFunc: d => Math.abs(+d/50)
            },
            {
                sorted: false,
                ascending: false,
                key: 'sum',
                alterFunc: d => Math.abs(+d)
            },
            {
                sorted: false,
                ascending: false,
                key: 'total',
                alterFunc: d => Math.abs(+d)
            },
        ]
        console.log(this.headerData);

        this.vizWidth = 300;
        this.vizHeight = 30;
        this.smallVizHeight = 20;
        this.margin = 20;

        this.scaleX1 = d3.scaleLinear()
            .domain([0.0, 1.0])
            .range([this.margin, this.vizWidth - this.margin]);

        this.scaleX2 = d3.scaleLinear()
            .domain([-100, 100])
            .range([this.margin, this.vizWidth - this.margin]);

        this.attachSortHandlers();
        this.drawLegend();
        this.drawTable();
    }

    drawLegend() {
        /**
         * Draw the legend for the bar charts.
         */

        let svgSelect1 = d3.select('#marginaxis1')
            .attr('width', this.vizWidth)
            .attr('height', this.vizHeight);

        const pad = 10;

        svgSelect1.selectAll('text')
            .data([0.0, 0.5, 1.0])
            .join('text')
            .attr('x', d => this.scaleX1(d))
            .attr('y', this.vizHeight - pad)
            .text(d => `${Math.abs(d)}`)
            .attr('text-anchor', 'middle')
            .classed('label', true);

        d3.select('#marginaxis1')
            .selectAll('.line')
            .data([0.0, 0.5, 1.0])
            .join('line')
            .attr('x1', d => this.scaleX1(d))
            .attr('x2', d => this.scaleX1(d))
            .attr('y1', this.vizHeight + 10)
            .attr('y2', this.vizHeight - 6)
            .attr('stroke', 'black')
            .attr('stoke-width', 0.1);

        let svgSelect2 = d3.select('#marginaxis2')
            .attr('width', this.vizWidth)
            .attr('height', this.vizHeight);
            
        svgSelect2.selectAll('text')
            .data([-100, -50, 0, 50, 100])
            .join('text')
            .attr('x', d => this.scaleX2(d))
            .attr('y', this.vizHeight - pad)
            .text(d => `${Math.abs(d)}`)
            .attr('text-anchor', 'middle')
            .classed('label', true);

        d3.select('#marginaxis2')
            .selectAll('.line')
            .data([-100, -50, 0, 50, 100])
            .join('line')
            .attr('x1', d => this.scaleX2(d))
            .attr('x2', d => this.scaleX2(d))
            .attr('y1', this.vizHeight + 10)
            .attr('y2', this.vizHeight - 6)
            .attr('stroke', 'black')
            .attr('stoke-width', 0.1);
    }

    drawTable() {
        // this.updateHeaders();
        let rowSelection = d3.select('#predictionTableBody')
            .selectAll('tr')
            .data(this.data)    
            .join('tr');

        let transformSelection = rowSelection.selectAll('td')
            .data(this.rowToCellDataTransform)
            .join('td')
            .attr('class', d => d.class);

        transformSelection.filter(d => d.type === 'text').text(d => d.value);

        let vizSelection = transformSelection.filter(d => d.type === 'viz');

        let svgSelect = vizSelection.selectAll('svg')
            .data(d => [d])
            .join('svg')
            .attr('width', this.vizWidth)
            .attr('height', this.vizHeight);

        let grouperSelect = vizSelection
            .filter((d,i) => i === 1)
            .selectAll('svg')
            .selectAll('g')
            .data(d => [d, d])
            .join('g');

        this.addFreq(vizSelection.filter((d,i) => i === 0));
        this.addPercentBlue(grouperSelect.filter((d,i) => i === 0));
        this.addPercentRed(grouperSelect.filter((d,i) => i === 1));
    }

    rowToCellDataTransform(d) {
        let phraseInfo = {
            type: 'text',
            class: '',
            value: d.phrase
        };

        let freqInfo = {
            type: 'viz',
            class: 'freq',
            value: {
                marginLow: 0,
                //margin: d.isForecast ? -(+d.mean_netpartymargin) : d.margin,
                marginHigh: d.total/50,
            }
        };

        let percInfo = {
            type: 'viz',
            class: 'perc',
            value: {
                marginLow: -d.percent_of_d_speeches,
                //margin: d.isForecast ? -(+d.mean_netpartymargin) : d.margin,
                marginHigh: -d.percent_of_r_speeches,
            }
        };

        let totalInfo = {
            type: 'text',
            class: '',
            value: d.total
        };

        let dataList = [phraseInfo, freqInfo, percInfo, totalInfo];
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
    }

    // addPhrase(containerSelect){
    //     containerSelect
    //         .selectAll('td')
    //         .data(d => d.phrase)
    //         .join();
    // }

    addFreq(containerSelect){
        const heightPercent = 2/3;
        const padPercent = (1 - heightPercent) / 2;
        let i = -1
        containerSelect.select('svg')
        for (const container of containerSelect) {
            i++
            d3.select(container)
                .select('svg')
                .attr('class', 'frec')
                .selectAll('rect')
                .data([this.data[i]])
                .join('rect')
                .attr('x', this.margin)
                .attr('y', this.vizHeight * padPercent)
                .attr('width', d => this.scaleX1(+d['total']/50) - this.margin)
                .attr('height', this.vizHeight * heightPercent)
                .attr('fill', (d, i) => this.colors(d.category))
                .classed('margin-bar', true);
        }

        // containerSelect.selectAll('rect').remove();
    }

    addPercentBlue(containerSelect){
        const heightPercent = 2/3;
        const padPercent = (1 - heightPercent) / 2;
        let i = -1
        containerSelect.select('g')
        for (const container of containerSelect) {
            i++
            d3.select(container)
                //.select('g')
                .selectAll('rect')
                .data([this.data[i]])
                .join('rect')
                // .attr('class', 'perc')
                // .attr('x', d => console.log(d))
                .attr('x', d => this.scaleX2(0) - Math.abs(this.scaleX2(0) - this.scaleX2(+d.percent_of_d_speeches)))
                .attr('y', this.vizHeight * padPercent)
                .attr('width', d => Math.abs(this.scaleX2(0) - this.scaleX2(+d.percent_of_d_speeches)))
                .attr('height', this.vizHeight * heightPercent)
                .attr('fill', 'steelblue')
                .classed('perc', true);
        }
    }

    addPercentRed(containerSelect){
        const heightPercent = 2/3;
        const padPercent = (1 - heightPercent) / 2;
        let i = -1
        containerSelect.select('g')
        for (const container of containerSelect) {
            i++
            //console.log(container)
            d3.select(container)
                //.select('g')
                .selectAll('rect')
                .data([this.data[i]])
                .join('rect')
                .attr('x', this.scaleX2(0))
                .attr('y', this.vizHeight * padPercent)
                .attr('width', d => Math.abs(this.scaleX2(0) - this.scaleX2(+d.percent_of_r_speeches) - 1))
                .attr('height', this.vizHeight * heightPercent)
                .attr('fill', 'firebrick')
                .classed('margin-bar', true)
                .classed('perc', true);
        }

        // containerSelect.selectAll('rect').remove();
    }

    // addTotal(containerSelect){
    //     containerSelect.selectAll('td')
    //         // .data(this.data, d => d.total)
    //         .data(d => d.total)
    //         .join();
    // }

    attachSortHandlers() 
    {
        /**
         * Attach click handlers to all the th elements inside the columnHeaders row.
         * The handler should sort based on that column and alternate between ascending/descending.
         */
        d3.select('#columnHeaders')
            .selectAll('th')
            .data(this.headerData)
            .on('click', (event, d) => 
            {
                //this.collapseAll(); // Comment this line out for extra credit 2
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
    }

    sortData(key, ascend, alterFunc)
    {
        this.data.sort((a, b) =>
            {
                let sortKey = key;
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
}
