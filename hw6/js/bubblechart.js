class Chart {

    constructor(globalApplicationState){
        this.globalApplicationState = globalApplicationState
        this.data = globalApplicationState.data;
        this.height = 500;
        this.width = 900;
        this.margin = ({top: 20, right: 20, bottom: 20, left: 20});
        this.chartState = false;
        this.button = d3.select("#clear-button")

        // Use d3 group to get the line data in groups
        const groupedData = d3.group(this.data, (d) => d.category);
        console.log(groupedData);        

        this.textCat = ['Economy/Fiscal issues', 'Energy/Environment', 'Crime/Justice', 'Education', 'Health Care', 'Mental Health/Substance Abuse'];
        this.textCat2 = ['', '', '' , '' ,'', ''];
        this.positionCat = [-40, 85, 225, 345, 470, 620];

        this.svg = d3.select("#chart")
            .attr("width", this.width);

        this.tooltip =d3
            .select('#bubblechart')
            .append('g')
            .attr('id', 'tooltip')
            .attr('visibility', 'hidden')

        this.tooltip.append('rect').attr('width', 200).attr('height', 100).attr('fill', 'gray')

        this.tooltip.append('text').attr('id', 'tooltip_phrase').attr('text-anchor', 'middle').attr('transform', `translate(100, 20)`);
        this.tooltip.append('text').attr('id', 'tooltip_diff').attr('text-anchor', 'middle').attr('transform', `translate(100, 40)`);
        this.tooltip.append('text').attr('id', 'tooltip_freq').attr('text-anchor', 'middle').attr('transform', `translate(100, 60)`);


        this.xScale = d3.scaleLinear()
            .domain([-50, 50])
            .range([this.margin.left, this.width - this.margin.left - this.margin.right]);

        // color scale
        this.colors = d3.scaleOrdinal()
            .domain(this.data.map( (d,i) => d.category[i] ))
            .range(['#ff50b3', '#a2ff50', '#9FE2BF', '#FF7F50', '#6495ED', '#CCCCFF']);

        this.drawLegend();
        this.circles();

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
        //this.chartState = true;
        this.svg.select('#brush-layer').attr('display','none');
        let brush1 = this.svg
            .append('g')
            .attr('id','brush-layer1')
            .call(d3.brushX()
                .extent([[0, 50], [900, 200 ]])
                .on("start brush end", d => brushed2(d, this, 50, 200)));

        let brush2 = this.svg
            .append('g')
            .attr('id','brush-layer2')
            .call(d3.brushX()
                .extent([[0, 200], [900, 325]])
                .on("start brush end", d => brushed2(d, this, 200, 325)));

        let brush3 = this.svg
            .append('g')
            .attr('id','brush-layer3')
            .call(d3.brushX()
                .extent([[0, 325], [900, 425]])
                .on("start brush end", d => brushed2(d, this, 325, 425)));

        let brush4 = this.svg
            .append('g')
            .attr('id','brush-layer4')
            .call(d3.brushX()
            .extent([[0, 425], [900, 600]])
            .on("start brush end", d => brushed2(d, this, 425, 600)));

        let brush5 = this.svg
            .append('g')
            .attr('id','brush-layer5')
            .call(d3.brushX()
            .extent([[0, 600], [900, 700]])
            .on("start brush end", d => brushed2(d, this, 600, 700)));

        let brush6 = this.svg
            .append('g')
            .attr('id','brush-layer6')
            .call(d3.brushX()
            .extent([[0, 700], [900, 800 ]])
            .on("start brush end", d => brushed2(d, this, 700, 800)));

        function brushed2(e, self, y0, y1){
            let value = [];
            let bubble2 = self.svg
                .select('#bubbles')
                .attr("width", self.width )
                .attr("transform", `translate(0, 120)`)
                // .append('g')
                // .attr('id', 'circlesIn')
                .selectAll('circle')
                .data(self.data)
                .join('circle')
                .attr('fill', (d, i) => self.colors(d.category))
                .attr('stroke', 'black')
                .attr('stroke-width', 0.1)
                .attr("cx", (d)=> d.moveX)
                .attr("cy", (d)=> d.moveY)
                .attr("r", (d)=> d.total*0.25)
                .attr('stroke-width', 1);
            // let bubble2 = self.svg.selectAll('circle')

            let {selection} = e
            if (selection) {

                const [x0, x1] = selection; 

                let selectedBubbles = [];

                let selectedData = [];

                bubble2.attr('opacity', 0.1);

                for (const bubble of bubble2) {
                    let cx = +bubble.getAttribute('cx')
                    let cy = +bubble.getAttribute('cy') + 120
                    // console.log(bubble);
                    if (cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1) {
                        d3.select(bubble).attr('opacity', 1);
                        selectedBubbles.push(bubble);
                        selectedData.push(bubble.__data__);
                    }
                }
                self.globalApplicationState.data = selectedData
                self.globalApplicationState.table.drawTable()
                // d3.select('#selection-output').html(`Selection: ${value.map((d,i)=>`${i}: [${d.moveX}, ${d.moveY}]`)}`)
                //self.svg.html(`Selection: ${value.map((d,i)=>`${i}: [${d.moveX}, ${d.moveY}]`)}`)
            } else {    
                // there is no brush currently. so we want to update the selection to none
                d3.select('#selection-output').html(`Selection: No brush`)
                self.globalApplicationState.data = [...self.data]
                self.globalApplicationState.table.drawTable()
                bubble2.attr('opacity', 1);
            }

        };

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
            .attr("r", (d)=> d.total*0.25)
            .on("mouseover", function(e, d) {
                d3.select('#tooltip_phrase').text(d.phrase)
                d3.select('#tooltip_diff').text(d.position > 0 ? 'D +' + Math.abs(d.position) : 'R +'+Math.abs(d.position))
                d3.select('#tooltip_freq').text('In ' + d.total/50 + ' % of speeches')
                d3.select('#tooltip').attr('visibility', 'visible')
            })
            .on("mousemove", e => {
                let [xPosition, yPosition] = d3.pointer(e)

                d3.select('#tooltip')
                    .attr('transform', `translate(${xPosition}, ${yPosition})`)

            })
            .on("mouseout", function(_) {
                d3.select('#tooltip').attr("visibility", 'hidden');
            });;

        // for (const bubble of bubble2) {
        //     let cx = bubble.getAttribute('cx')
        //     let moveX = bubble.getAttribute('moveX')
        //     // console.log(bubble);
        //     if (cx === moveX) {
        //         this.chartState === false;
        //         console.log(this.chartState)
        //     }
        //     else {
        //         this.chartState === true;
        //     }
        // }
 
        //this.chartState = true;
    }

    circles(){
        this.chartState = false;
        this.svg
            .append('g')
            .attr('id','brush-layer')
            .call(d3.brushX().extent([[0, 50], [900, 200 ]])
                .on("start brush end", (e) => brushed(e, this)));

        function brushed(e, self){
            //bubble1;
            let {selection} = e
            if (selection) {

                const [x0, x1] = selection; 

                let selectedBubbles = [];

                let selectedData = [];

                bubble1.attr('opacity', 0.1);

                for (const bubble of bubble1) {
                    // console.log(bubble);
                    if (bubble.__data__.sourceX >= x0 && bubble.__data__.sourceX <= x1) {
                        d3.select(bubble).attr('opacity', 1);
                        selectedBubbles.push(bubble);
                        selectedData.push(bubble.__data__);
                    }
                }
                self.globalApplicationState.data = selectedData;
                self.globalApplicationState.table.drawTable();
            } else {
                self.globalApplicationState.data = [...self.data];
                self.globalApplicationState.table.drawTable();
                bubble1.attr('opacity', 1);
            }
        };


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
        let bubble1 = this.svg
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
            .attr('stroke-width', 1)
            .on("mouseover", function(e, d) {
                d3.select('#tooltip_phrase').text(d.phrase)
                d3.select('#tooltip_diff').text(d.position > 0 ? 'D +' + Math.abs(d.position) : 'R +'+Math.abs(d.position))
                d3.select('#tooltip_freq').text('In ' + d.total/50 + ' % of speeches')
                d3.select('#tooltip').attr('visibility', 'visible')
            })
            .on("mousemove", e => {
                let [xPosition, yPosition] = d3.pointer(e)

                d3.select('#tooltip')
                    .attr('transform', `translate(${xPosition}, ${yPosition})`)

            })
            .on("mouseout", function(_) {
                d3.select('#tooltip').attr("visibility", 'hidden');
            });
    }    
}