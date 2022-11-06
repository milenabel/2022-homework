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

        // // Create tooltip div and make it invisible
        // this.tooltip = d3.select("#bubbles").append("div")
        //     .attr("class", "tooltip")
        //     .style("opacity", 0.1);

        // this.textTT = this.tooltip
        //     .append('span')
        //     .attr('class', 'tooltiptext');
        

        this.textCat = ['Economy/Fiscal issues', 'Energy/Environment', 'Crime/Justice', 'Education', 'Health Care', 'Mental Health/Substance Abuse'];
        this.textCat2 = ['', '', '' , '' ,'', '']
        this.positionCat = [-40, 85, 225, 345, 470, 620]

    //     // create a tooltip
    //     this.tooltip = d3.select("#chart")
    //         .append("div") 
    //         .style("opacity", 0)
    //         .attr("class", "tooltip")
    //         .style("font-size", "16px")

    //    // Three function that change the tooltip when user hover / move / leave a cell
    //     this.mouseover = function(d) {
    //         // this.tooltip
    //         //     .transition()
    //         //     .duration(200)
    //         //     .style("opacity", 1)
    //         this.tooltip
    //             .html("<span style='color:grey'> </span>" + d.category ) // + d.Prior_disorder + "<br>" + "HR: " +  d.HR)
    //             .html( (d) => {
    //                 if (d.moveX > 0){
    //                     return ("<span style='color:grey'> D+ </span>" + d.percent_of_d_speeches)
    //                 } 
    //                 else if (d.moveX < 0){
    //                     return ("<span style='color:grey'> R+ </span>" + d.percent_of_r_speeches ) 
    //             } }) 
    //             .html("<span style='color:grey'> In </span>" + d.total/50 + "<span style='color:grey'>% speeches </span>") 
    //             .style("left", (d3.mouse(this)[0]+30) + "px")
    //             .style("top", (d3.mouse(this)[1]+30) + "px")
    //     }
    //     this.mousemove = function(d) {
    //         this.tooltip
    //             .style("left", (d3.mouse(this)[0]+30) + "px")
    //             .style("top", (d3.mouse(this)[1]+30) + "px")
    //     }
    //     this.mouseleave = function(d) {
    //         this.tooltip
    //             .transition()
    //             .duration(200)
    //             .style("opacity", 0)
    //     }

        this.svg = d3.select("#chart")
            .attr("width", this.width);

        this.xScale = d3.scaleLinear()
            .domain([-50, 50])
            .range([this.margin.left, this.width - this.margin.left - this.margin.right]);

        // color scale
        this.colors = d3.scaleOrdinal()
            .domain(this.data.map( (d,i) => d.category[i] ))
            .range(['#ff50b3', '#a2ff50', '#9FE2BF', '#FF7F50', '#6495ED', '#CCCCFF']);

        //console.log(this.colors)

        this.drawLegend();
        this.circles();
        this.tooltips();

        this.button 
            .on('click', (event, d) => 
            {
                if (this.chartState === false) {
                    this.updateCircles();
                    console.log(this.chartState);
                    this.chartState === true;
                }
                else if (this.chartState === true){
                    this.updateCircles();
                    console.log(this.chartState);
                    this.chartState = false;
                }
            });
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

            this.svg
                .select('#textIn')
                .selectAll('text')
                .data(this.textCat2)
                .join('text')
                .transition()
                .duration(3600)
                .text(d => d)
                .attr('x', this.margin.left - 10)
                .attr('y', (_, i) => this.positionCat[i] );
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

            this.svg
                .select('#textIn')
                .selectAll('text')
                .data(this.textCat)
                .join('text')
                .transition()
                .duration(3600)
                .text(d => d)
                .attr('x', this.margin.left - 10)
                .attr('y', (_, i) => this.positionCat[i] );
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
            .append('g')
            .attr('id', 'textIn')
            .append('text');
        this.svg
            .select('#bubbles')
            .attr("width", this.width )
            .attr("transform", `translate(0, 120)`)
            .append('g')
            .attr('id', 'circlesIn')
            .selectAll('circle')
            .data(this.data)
            .join('circle')
            .attr('fill', (d, i) => this.colors(d.category))
            .attr('stroke', 'black')
            .attr('stroke-width', 0.1)
            .attr("cx", (d)=> d.sourceX)
            .attr("cy", (d)=> d.sourceY)
            .attr("r", (d)=> d.total*0.25)
            .attr('stroke-width', 1);
            // .on("mousemove", function(d) {
            // .on("mouseover", function(d) {

            //     this.tooltip.html(`<strong>${d.category}</strong><br>
            //                  <strong> In ${d.total/50}% speeches </strong>`)
            //                 //   ${chartState.legend.slice(0, chartState.legend.indexOf(","))}: 
            //                 //   <strong>${d3.format(",")(d[chartState.measure])}</strong>
            //                 //   ${chartState.legend.slice(chartState.legend.lastIndexOf(" "))}
            //         // .style('top', '5px')
            //         // .style('left', '5px')
            //         .style('position', 'absolute')
            //         .style("opacity", 0.9);
            // }).on("mouseout", function(_) {
            //     this.tooltip.style("opacity", 0);
            // });
            // .on("mouseover", this.mouseover)
            // .on("mousemove", this.mousemove)
            // .on("mouseleave", this.mouseleave);
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
        d3.selectAll(".circle").on("mousemove", function(d) {
            this.tooltip.html(`<strong>${d.category}</strong><br>
                         <strong> In ${d.total/50}% speeches </strong>`)
                        //   ${chartState.legend.slice(0, chartState.legend.indexOf(","))}: 
                        //   <strong>${d3.format(",")(d[chartState.measure])}</strong>
                        //   ${chartState.legend.slice(chartState.legend.lastIndexOf(" "))}
                // .style('top', '5px')
                // .style('left', '5px')
                .style('position', 'absolute')
                .style("opacity", 0.9);
        }).on("mouseout", function(_) {
            this.tooltip.style("opacity", 0);
        });
    }
}