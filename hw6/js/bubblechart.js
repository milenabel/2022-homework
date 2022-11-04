class Chart {

    constructor(data){
        this.data = data;
        this.height = 500;
        this.width = 900;
        this.margin = ({top: 0, right: 20, bottom: 20, left: 20});
        this.chartState = false;
        this.button = d3.select("#clear-button")

        // Use d3 group to get the line data in groups
        const groupedData = d3.group(this.data, (d) => d.category);
        console.log(groupedData);

        // Create a color scale
        // this.categories = groupedData.keys();
        //this.colorScale = d3.scaleOrdinal(d3.schemeTableau10).domain([...categories]);

        this.svg = d3.select("#chart")
            .attr("width", this.width);
            //.attr("height", this.height);

        this.xScale = d3.scaleLinear()
            .domain([-50, 50])
            .range([this.margin.left, this.width - this.margin.left - this.margin.right]);


        // Create tooltip div and make it invisible
        this.tooltip = d3.select("#chart").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        this.colors = d3.scaleOrdinal()
            .domain(this.data.map( (d,i) => d.category[i] ))
            .range(['#FF7F50', '#DE3163', '#9FE2BF', '#40E0D0', '#6495ED', '#CCCCFF']);

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

        // this.colors = d3.scaleOrdinal()
        //     // .domain(["asia", "africa", "northAmerica", "europe", "southAmerica", "oceania"])
        //     .domain(this.groupedData.map(d => d.category))
        //     .range(['#D81B60','#1976D2','#388E3C','#FBC02D','#E64A19','#455A64']);

        this.drawLegend();
        this.circles();

        this.button 
            // .selectAll('th')
            // .data(this.headerData)
            .on('click', (event, d) => 
            {
                if (this.chartState === false) {
                    this.updateCircles();
                    console.log(this.chartState);
                    // this.chartState = True;
                }
                else if (this.chartState === true){
                    this.circles();
                    console.log(this.chartState);
                    // this.chartState = False;
                }
            });

        //this.colorScale();
       
        //this.updateCircles();
    }

    // assigning colors to each of the categorized values
    colorScale(){
        // Colors used for circles depending on continent/geography
        let colors = d3.scaleOrdinal()
            // .domain(["asia", "africa", "northAmerica", "europe", "southAmerica", "oceania"])
            // // .domain(this.groupedData.map(d => d.category))
            // .domain(this.data.map({ d,i => d.category[i]; }))
            // .range(['#D81B60','#1976D2','#388E3C','#FBC02D','#E64A19','#455A64']);

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
        let svgSelect = d3.select("#marginAxis")

        svgSelect.selectAll('text')
            .data([-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50])
            .join('text')
            .attr('x', d => this.xScale(d))
            .attr('y', this.margin.bottom*2)
            .text(d => `${Math.abs(d)}`)
            .attr('text-anchor', 'middle');

        svgSelect
            .append('text')
            .text('Democratic Leaning')
            .attr('x', 0)
            .attr('y', 10);

        svgSelect
            .append('text')
            .text('Republican Leaning')
            .attr('x', 770)
            .attr('y', 10);

        svgSelect
            .selectAll('.line')
            .data([-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50])
            .join('line')
            .attr('x1', d => this.xScale(d))
            .attr('x2', d => this.xScale(d))
            .attr('y1', this.margin.bottom*2 + 5)
            .attr('y2', this.margin.bottom*3 - 5)
            .attr('stroke', 'black')
            .attr('stoke-width', 0.1);
        
    }

    updateCircles(){

        this.chartState = true;
        let circles = this.svg
            .select('#bubbles')
            .attr("width", this.width )
            .attr("transform", `translate(0, 120)`)
            .selectAll('.circle')
            .data(this.data, (d) => d.position)

        circles
            .exit()
            .transition()
            .delay(2000)
            //.duration(1000)
            .attr("cx", 0)
            .attr("cy", (this.height / 2) - this.margin.bottom / 2)
            .remove();

        circles
            .enter()
            .join('circle')
            //.enter()
            .attr('fill', (d, i) => this.colors(d.category))
            // .attr('fill', "red")
            .attr('stroke', 'black')
            .attr('stroke-width', 0.1)
            .attr("cx", (d)=> d.moveX)
            .attr("cy", (d)=> d.moveY)
            .attr("r", (d)=> d.total*0.3)
            .attr('stroke-width', 1)
            .selectAll('text')
            .data(this.groupedData, (d) => d.category)
            .join('text')
            .attr('x', 0)
            .attr('y', this.margin.bottom*2)
            .text(d => `text`)
            .attr('text-anchor', 'middle');

        // let svgSelect = d3.selectAll("#bubbles")
        //     //.attr("width", this.width )
        //     //.attr("height", 10000)
        //     //.attr("transform", `translate(0, 120)`);

        // let circles = svgSelect
        //     .selectAll("circle")
        //     .data(this.data, (d) => d.position);

        // circles.exit()
        //     .transition()
        //     .duration(1000)
        //     .attr("cx", 0)
        //     .attr("cy", (this.height / 2) - this.margin.bottom / 2)
        //     .remove();

        // circles
        //     .enter()
        //     .append("circle")
        //     .attr("class", "position")
        //     .attr("cx", 0)
        //     .attr("cy", ((this.height - this.margin.bottom) / 2) - this.margin.bottom / 2)
        //     .attr("r", (d)=> d.total*0.3)
        //     .attr('fill', (d, i) => colors(d.category))
        //     //.merge(circles)
        //     // .transition()
        //     // .duration(2000)
        //     .attr("cx", function(d) { return d.sourceX; })
        //     .attr("cy", function(d) { return d.sourceY; });
    }

    circles(){
        this.chartState = false;
        this.svg
            .select('#bubbles')
            .attr("width", this.width )
            .attr("transform", `translate(0, 120)`)
            .selectAll('.circle')
            .data(this.data, (d) => d.position)
            .join('circle')
            .attr('fill', (d, i) => this.colors(d.category))
            // .attr('fill', "red")
            .attr('stroke', 'black')
            .attr('stroke-width', 0.1)
            .attr("cx", (d)=> d.sourceX)
            .attr("cy", (d)=> d.sourceY)
            .attr("r", (d)=> d.total*0.3)
            .attr('stroke-width', 1);
    }    
}