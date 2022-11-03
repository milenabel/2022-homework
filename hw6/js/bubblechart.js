class Chart {

    constructor(data){
        this.data = data;
        this.height = 500;
        this.width = 900;
        this.margin = ({top: 0, right: 20, bottom: 20, left: 20});
        this.chartState = {};

        // Use d3 group to get the line data in groups
        const groupedData = d3.group(this.data, (d) => d.category);

        // Create a color scale
        this.categories = groupedData.keys();
        //this.colorScale = d3.scaleOrdinal(d3.schemeTableau10).domain([...categories]);

        this.svg = d3.select("#chart")
            .attr("width", this.width)
            .attr("height", this.height);

        this.xScale = d3.scaleLinear()
            .domain([-50, 50])
            .range([this.margin.left, this.width - this.margin.left - this.margin.right]);

        this.scale();

        // this.svg.append("g")
        //     .attr("class", "axis")
        //     .attr("transform", "translate(0," + (this.height - this.margin.bottom) + ")");







        // this.xAxis = this.svg.axis()
        //     .scale(xScale)
        //     .orient("top");

        // // Create line that connects node and point on X axis
        // this.xLine = this.svg.append("line")
        //     .attr("stroke", "lightgrey")
        //     .attr("stroke-dasharray", "1,2");


        // Create tooltip div and make it invisible
        this.tooltip = d3.select("#chart").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Append x axis text
        // this.svg.select('#x-axis')
        //     .append('text')
        //     .text('Democratic Leaning')
        //     .attr('x', this.margin.left)
        //     .attr('y', this.margin.bottom);

        // this.svg.select('#x-axis')
        //     .append('text')
        //     .text('Republican Leaning')
        //     .attr('x', this.margin - this.margin.left - this.margin.right)
        //     .attr('y', this.margin.bottom);
        
        // this.xScale.domain(d3.extent(data, function (d) {
        //         return +d.total;
        //     }));

        this.colors = d3.scaleOrdinal()
            // .domain(["asia", "africa", "northAmerica", "europe", "southAmerica", "oceania"])
            .domain(this.groupedData.map(d => d.category))
            .range(['#D81B60','#1976D2','#388E3C','#FBC02D','#E64A19','#455A64']);


        //this.drawLegend();
        //this.colorScale();
        this.drawCircles();
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

        this.svg.selectAll('text')
            .data([-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50])
            .join('text')
            .attr('x', d => this.xScale(d))
            .attr('y', this.height - 3)
            .text(d => `${Math.abs(d)}`)
            .classed('label', true)
            .orient('top');

        this.svg.select('#axis')
            .append('text')
            .text('Democratic Leaning')
            .attr('x', this.margin.left)
            .attr('y', this.margin.bottom);

        this.svg.select('#axis')
            .append('text')
            .text('Republican Leaning')
            .attr('x', this.margin - this.margin.left - this.margin.right)
            .attr('y', this.margin.bottom);
    }

    drawCircles(){

        // const grouped = this.data.group(data, (d) => d.category)

        // let colors = d3.scaleOrdinal()
        //     // .domain(["asia", "africa", "northAmerica", "europe", "southAmerica", "oceania"])
        //     .domain(this.grouped.map(d => d.category))
        //     .range(['#D81B60','#1976D2','#388E3C','#FBC02D','#E64A19','#455A64']);

        let circles = this.svg
            .selectAll("circle")
            .data(this.data, (d) => d.position);

        // circles.exit()
        //     .transition()
        //     .duration(1000)
        //     .attr("cx", 0)
        //     .attr("cy", (height / 2) - margin.bottom / 2)
        //     .remove();

        circles
            .enter()
            .append("circle")
            .attr("class", "position")
            .attr("cx", 0)
            .attr("cy", (this.height / 2) - this.margin.bottom / 2)
            .attr("r", 6)
            //.attr("fill", function(d){ return this.colors(d.category)})
            .merge(circles)
            .transition()
            .duration(2000)
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }




    scale(){

        let labels = ['50', '40', '30', '20', '10', '0', '10', '20', '30', '40', '50'];
        let ticks = [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50];

        let axis = d3
            .axisTop(this.xScale)
            .tickValues([-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50])
            // .tickFormat(function(d, i){return labels[i]});
            .tickFormat((d, i) => ['50', '40', '30', '20', '10', '0', '10', '20', '30', '40', '50'][i]);
        
        let scale = d3.select('#chart')
            .select('#marginAxis')
            .attr('width', this.width)
            .attr('height', this.height)
            .call(axis); 

        // let removingDomain = scale
        //     .select('.domain')
        //     .attr('stroke-width', 0)
            ;   
        // let removingTicks = scale
        //     .selectAll('g')
        //     .selectAll('line')
        //     .remove()
        //     .selectAll('path')
        //     .remove();

        d3.selectAll('g.tick')
            .select('text')
            // .attr('class', function(d, i){ 
            //     if (i < 3){
            //     return 'biden'}
            //     else {return 'trump'}
            // })
            .attr('text-size', '30px')
            .attr('fill', 'blue')
            .attr('dy', '2 em');

        let line = scale.append('line')
            .attr('x1', (this.width/2))
            .attr('y1', this.margin.bottom)
            .attr('x2', (this.width/2))
            .attr('y2', this.height/4)
            .style('stroke-width', 2)
            .style('stroke', 'lightgrey')
            .style('fill', 'none');
    }



    
}