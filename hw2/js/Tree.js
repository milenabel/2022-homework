/** Class representing a Tree. */
class Tree {
  /**
   * Creates a Tree Object
   * Populates a single attribute that contains a list (array) of Node objects to be used by the other functions in this class
   * @param {json[]} json - array of json objects with name and parent fields
   */

  //Add code that will create this list of `Node` objects based on the input. This is a good place to populate the `parentNode` field of the `Node` objects as well.

  constructor(json) {
    // creating an array of objects by extracting it from json file
    let nodeObj = [];
    json.forEach(node => {
      console.log(node)
      let newNodeObj = new Node(node.name, node.parent);
      nodeObj.push(newNodeObj);
    });
    console.log(nodeObj);

    // nodeObj.forEach(node => {
    //   console.log(node);
    //   const found = nodeObj.find(element => {element.name === node.parent});
    //   console.log(found);
    //   // let newNodeObj = new Node(node.name, node.parent);
    //   // nodeObj.push(newNodeObj);
    // });

    // nodeObj.forEach(node => {
    //   //console.log(node);
    //   node.parentNode = nodeObj.find(element => {
    //     element.name === node.parent;
    //   });
    //   //console.log(nodeObj);
    // });
  }

  /**
   * Assign other required attributes for the nodes.
   */
  buildTree () {
    // note: in this function you will assign positions and levels by making calls to assignPosition() and assignLevel()
    // let children = [];
    // nodeObj.Node

    // nodeObj.
    // assign children 

    // let rootNode;

    // this.staticPos = 0;
    // this.mapPosition = {};

    // nodeObj.forEach( nodeI => {
    //   if (nodeI.parentName === "root")
    //     rootNode = nodeI;
    //   nodeObj.forEach(nodeJ => {
    //     if (nodeI.name === nodeJ.parentName)
    //       nodeI.addchild(nodeJ);
    //     if (nodeI.parentName === nodeJ.name)
    //       nodeI.parentNode = nodeJ;
    //   })
    // })
    // this.assignLevel(rootNode, 0);
    // this.mapPosition[rootNode.level] = 0;
    // this.assignPosition(rootNode, 0);

    // console.log(nodeObj);

    // let rootNode;
    // let current, tempNode;
    // let i, j;
    // this.static_pos = 0;
    // this.mapPositions = {}
    // let l = this.listOfNodes.length;
    // for(i = 0; i < l; i++){
    //     current = this.listOfNodes[i];
    //     if(current.parentName === "root")
    //         rootNode = current;
    //     for(j = 0; j < l; j++){
    //         tempNode = this.listOfNodes[j];
    //         if(current.name === tempNode.parentName)
    //             current.addChild(tempNode);
    //         if(current.parentName === tempNode.name)
    //             current.parentNode = tempNode;
    //     }
    // }
    // this.assignLevel(rootNode, 0);
    // this.mapPositions[rootNode.level] = 0;
    // this.assignPosition(rootNode, 0);
    // console.log(this.listOfNodes);


    // for (let i = 0; i < 1; i++) {
    //   current = this.nodeObj[i];
    //   if (current.parentName === "root")
    //     rootNode = current;
    //   for (let j = 0; j < this.nodeObj.length; j++){
    //     tempNode = this.nodeObj[j];
    //     if (current.name === tempNode.parentName){
    //       current.addChild(tempNode);
    //     }
    //     if (current.parentName === tempNode.name){
    //       current.parentNode = tempNode;
    //     }
    //   }
    // }

    // let rootNode;
    // let current, tempNode;
    // let i, j;
    // this.static_pos = 0;
    // this.mapPositions = {}
    // let l = this.listOfNodes.length;

    // for(i = 0; i < l; i++){
    //     current = this.listOfNodes[i];

    //     if(current.parentName === "root")
    //         rootNode = current;

    //     for(j = 0; j < l; j++){
    //         tempNode = this.listOfNodes[j];
    //         if(current.name === tempNode.parentName)
    //             current.addChild(tempNode);

    //         if(current.parentName === tempNode.name)
    //             current.parentNode = tempNode;
    //     }
        

  }

  /**
   * Recursive function that assign levels to each node
   */
  assignLevel (node, level) {
    // let i;
    // node.level = level;
    // let l = node.children.length;
    // for(i = 0; i < l; i++){
    //     this.assignLevel(node.children[i], level + 1);
    // }
  }

  /**
   * Recursive function that assign positions to each node
   */
  assignPosition (node, position) {
    // this.staticPos = Math.max(this.staticPos, position);
    // node.position = position;

    // if(node.children.length > 0){
    //     this.assignPosition(node.children[0], position);
    // }

    // for(let i = 1; i < node.children.length; i++){
    //     if(this.staticPos > position){
    //         this.assignPosition(node.children[i], this.static_pos + 1);
    //     }
    //     else{
    //         this.assignPosition(node.children[i], position+1);
    //     }
    // }
    
  }

  /**
   * Function that renders the tree
   */
  renderTree () {

  }

}