/** Class representing a Tree. */
class Tree {
  /**
   * Creates a Tree Object
   * Populates a single attribute that contains a list (array) of Node objects to be used by the other functions in this class
   * @param {json[]} json - array of json objects with name and parent fields
   */

  //Add code that will create this list of `Node` objects based on the input. This is a good place to populate the `parentNode` field of the `Node` objects as well.
  constructor(json) {
  // creating an array of node objects by extracting it from json file
    this.nodeList = [];
    json.forEach(node => {
      //console.log(node)
      let newObj = new Node(node.name, node.parent);
      newObj.parentNode = this.nodeList.find(element => element.name == newObj.parentName);  //adding parent nodes 
      this.nodeList.push(newObj);
    });
    //console.log(this.nodeList);
  } 

  /**
   * Function that builds a tree from a list of nodes with parent refs
   */
  buildTree() {
    // assigning children 
    this.nodeList.forEach(node => {
      for (let i=0; i<this.nodeList.length; i++)
        if (this.nodeList[i].parentName === node.name) 
          node.addChild(this.nodeList[i]);
    });

  	this.assignLevel(this.nodeList[0],0);     // calling on assignLevel function to register level
    this.assignPosition(this.nodeList[0],0);  // calling on assignPosition function to register position
    //console.log(this.nodeList);
  }

  /**
   * Recursive function that assign levels to each node
   */
  assignLevel (node, level) {
    node.level = level;
    node.children.forEach( nodeN => {this.assignLevel(nodeN, level+1)});
  }


  /**
   * Recursive function that assign positions to each node
   */
  assignPosition (node, position) {
    let offset = 0;
    node.position = position;
    for (let i = 0; i < node.children.length; i++) {
      if (i > 0) {offset = node.children[i-1].children.length;}
      if (offset > 0) offset--; 
      this.assignPosition(node.children[i], position + offset + i);
    }
  }

  /**
   * Function that renders the tree
   */
   
  renderTree () {

    //let selection = d3.select("body"); //select the entire body of the page
    d3.select("body").append("svg")
        .attr("height", 1200)
        .attr("width", 1200);
    //let svgBlock = d3.selectAll("svg");
    let x_mult = 200, y_mult = 120, x_shift = 100, y_shift = 100;  // initial starting point and shifts
      
    this.nodeList.forEach( node => {
      node.children.forEach(nodeN => {
        d3.selectAll("svg").append("line")  // creating lines
        .attr("x1", x_mult*(node.level) + x_shift)
        .attr("y1", y_mult*(node.position) + y_shift)
        .attr("x2", x_mult*(nodeN.level) + x_shift)
        .attr("y2", y_mult*(nodeN.position) + y_shift);
      });
    
      let node_group = d3.selectAll("svg").append("g")
        .attr("class","nodeGroup")
        .attr("transform","translate(" + x_mult*node.level+"," + y_mult*node.position+")");
      node_group.append("circle") // creating circles
        .attr("r", 50)
        .attr("cx", 100)
        .attr("cy", 100);
      node_group.append("text") // creating labels as text
        .attr("class", "label")
        .attr("dx", x_shift)
        .attr("dy", y_shift)
        .text(node.name);
    });
  }
}

