class Chart {

    constructor(data){
        this.data = data;
        this.height = 500;
        this.width = 900;
        this.margin = ({top: 20, right: 20, bottom: 20, left: 20});
        this.chartState = false;
        this.button = d3.select("#clear-button")

        // Use d3 group to get the line data in groups
        const groupedData = d3.group(this.data, (d) => d.category);
        console.log(groupedData);

        this.svg = d3.select("#chart")
            .attr("width", this.width);
            //.attr("height", this.height);

        this.xScale = d3.scaleLinear()
            .domain([-50, 50])
            .range([this.margin.left, this.width - this.margin.left - this.margin.right]);


        // Create tooltip div and make it invisible
        this.tooltip = d3.select("#bubble").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        this.colors = d3.scaleOrdinal()
            .domain(this.data.map( (d,i) => d.category[i] ))
            .range(['#FF7F50', '#DE3163', '#9FE2BF', '#40E0D0', '#6495ED', '#CCCCFF']);

        // this.colors = d3.scaleOrdinal()
        //     // .domain(["asia", "africa", "northAmerica", "europe", "southAmerica", "oceania"])
        //     .domain(this.groupedData.map(d => d.category))
        //     .range(['#D81B60','#1976D2','#388E3C','#FBC02D','#E64A19','#455A64']);

        this.drawLegend();
        this.circles();

        this.button 
            .on('click', (event, d) => 
            {
                if (this.chartState === false) {
                    this.updateCircles();
                    console.log(this.chartState);
                    this.chartState === true;
                    // this.chartState = True;
                }
                else if (this.chartState === true){
                    this.updateCircles();
                    console.log(this.chartState);
                    this.chartState = false;
                    // this.chartState = False;
                }
            });

        //this.colorScale();       
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
            .attr('y', this.margin.top);

        svgSelect
            .append('text')
            .text('Republican Leaning')
            .attr('x', 770)
            .attr('y', this.margin.top);

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

        if (this.chartState === true) {
            this.svg
            .select('#bubbles')
            .selectAll('line')
            .join('line')
            .transition()
            .duration(3600)
            .attr('x1', ((this.width - this.margin.left)/2))
            .attr('y1',-60)
            .attr('x2', ((this.width - this.margin.left)/2))
            .attr('y2', 70)
            .style('stroke-width', 2)
            .style('stroke', 'darkgrey')
            .style('fill', 'none');
        }
        else if (this.chartState === false){
            this.svg
            .select('#bubbles')
            .selectAll('line')
            .join('line')
            .transition()
            .duration(3600)
            .attr('x1', ((this.width - this.margin.left)/2))
            .attr('y1',-60)
            .attr('x2', ((this.width - this.margin.left)/2))
            .attr('y2', this.height + 180)
            .style('stroke-width', 2)
            .style('stroke', 'darkgrey')
            .style('fill', 'none');
        }

        this.svg
            .select('#bubbles')
            .select('#circlesIn')
            .selectAll('circle')
            .data(this.data)
            .join('circle')
            .attr('fill', (d, i) => this.colors(d.category))
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .transition()
            .duration(3600)
            .attr("cx", (d)=> this.chartState === false ? d.moveX : d.sourceX)
            .attr("cy", (d)=> this.chartState === false ? d.moveY : d.sourceY)
            .attr("r", (d)=> d.total*0.25);

        this.chartState = true;
    }

    circles(){
        this.chartState = false;
        let div = d3.select("#bubbles");
        this.svg
            .select('#bubbles')
            .append('g')
            .attr('id', 'lineIn')
            .append('line')
            .attr('x1', ((this.width - this.margin.left)/2))
            .attr('y1',-60)
            .attr('x2', ((this.width - this.margin.left)/2))
            .attr('y2', 70)
            .style('stroke-width', 2)
            .style('stroke', 'darkgrey')
            .style('fill', 'none');
        this.svg
            .select('#bubbles')
            .attr("width", this.width )
            .attr("transform", `translate(0, 120)`)
            .append('g')
            .attr('id', 'circlesIn')
            .selectAll('circle')
            // .data(this.data, (d) => d.position)
            .data(this.data)
            .join('circle')
            .attr('fill', (d, i) => this.colors(d.category))
            // .attr('fill', "red")
            .attr('stroke', 'black')
            .attr('stroke-width', 0.1)
            .attr("cx", (d)=> d.sourceX)
            .attr("cy", (d)=> d.sourceY)
            .attr("r", (d)=> d.total*0.25)
            .attr('stroke-width', 1);
            // .on("mouseover", (d) => {		
            //     div.selectAll('.circle')
            //         .transition()		
            //         //.duration(200)		
            //         .style("opacity", .5);		
            //     // div	.html(formatTime(d.date) + "<br/>"  + d.close)	
            //     //     .style("left", (d3.event.pageX) + "px")		
            //     //     .style("top", (d3.event.pageY - 28) + "px");	
            //     })					
            // .on("mouseout", (d) => {		
            //     div.transition()		
            //         .duration(500)		
            //         .style("opacity", 1);	
            // });
    }    

    tooltips(){
        // Show tooltip when hovering over circle (data for respective country)
        d3.selectAll(".countries").on("mousemove", function(d) {
            tooltip.html(`Country: <strong>${d.country}</strong><br>
                          ${chartState.legend.slice(0, chartState.legend.indexOf(","))}: 
                          <strong>${d3.format(",")(d[chartState.measure])}</strong>
                          ${chartState.legend.slice(chartState.legend.lastIndexOf(" "))}`)
                .style('top', d3.event.pageY - 12 + 'px')
                .style('left', d3.event.pageX + 25 + 'px')
                .style("opacity", 0.9);

            xLine.attr("x1", d3.select(this).attr("cx"))
                .attr("y1", d3.select(this).attr("cy"))
                .attr("y2", (height - margin.bottom))
                .attr("x2",  d3.select(this).attr("cx"))
                .attr("opacity", 1);

        }).on("mouseout", function(_) {
            tooltip.style("opacity", 0);
            xLine.attr("opacity", 0);
        });
    }
}