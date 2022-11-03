class Chart {

    constructor(data){
        this.data = data;
        this.height = 500;
        this.width = 900;
        this.margin = ({top: 0, right: 20, bottom: 20, left: 20});

        // Use d3 group to get the line data in groups
        const groupedData = d3.group(data, (d) => d.category);

        // Create a color scale
        const categories = groupedData.keys();
        this.colorScale = d3.scaleOrdinal(d3.schemeTableau10).domain([...categories]);

        this.svg = d3.select("#bubblechart")
            .attr("width", this.width)
            .attr("height", this.height);

        this.xScale = d3.scaleLinear()
            .domain([-50, 50])
            .range([0, this.width]);

        // let xScale = d3.scaleLinear()
        //     .range([this.margin.left, this.width - this.margin.right]);

        this.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (this.height - this.margin.bottom) + ")");

        // // Create line that connects node and point on X axis
        // this.xLine = this.svg.append("line")
        //     .attr("stroke", "lightgrey")
        //     .attr("stroke-dasharray", "1,2");

        // Create tooltip div and make it invisible
        this.tooltip = d3.select("#bubblechart").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Append x axis text
        this.svg.select('#x-axis')
            .append('text')
            .text('Democratic Leaning')
            .attr('x', this.margin.left)
            .attr('y', this.margin.bottom);

        this.svg.select('#x-axis')
            .append('text')
            .text('Republican Leaning')
            .attr('x', this.margin - this.margin.left - this.margin.right)
            .attr('y', this.margin.bottom);
    }

    // assigning colors to each of the categorized values
    colorScale(){
        // Colors used for circles depending on continent/geography
        let colors = d3.scaleOrdinal()
            // .domain(["asia", "africa", "northAmerica", "europe", "southAmerica", "oceania"])
            .domain(this.groupedData.map(d => d.category))
            .range(['#D81B60','#1976D2','#388E3C','#FBC02D','#E64A19','#455A64']);

        // this.data(d=> {
        //     if d.category
        // });

        // d3.select("#asiaColor").style("color", colors("asia"));
        // d3.select("#africaColor").style("color", colors("africa"));
        // d3.select("#northAmericaColor").style("color", colors("northAmerica"));
        // d3.select("#southAmericaColor").style("color", colors("southAmerica"));
        // d3.select("#europeColor").style("color", colors("europe"));
        // d3.select("#oceaniaColor").style("color", colors("oceania"));
    }

    drawLegend(){

        svg.selectAll('text')
            .data([-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50])
            .join('text')
            .attr('x', d => this.scaleX(d))
            .attr('y', this.height - 3)
            .text(d => `+${Math.abs(d)}`)
            // .classed('label', true)
    }
    
}