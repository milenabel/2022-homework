/** Class representing a Tree. */
class Tree {
  /**
   * Creates a Tree Object
   * Populates a single attribute that contains a list (array) of Node objects to be used by the other functions in this class
   * @param {json[]} json - array of json objects with name and parent fields
   */

  //Add code that will create this list of `Node` objects based on the input. This is a good place to populate the `parentNode` field of the `Node` objects as well.

  constructor(json) {
    console.log(json)
    let name = this.nodeName
    let parentNode = this.parentName
  }

  /**
   * Assign other required attributes for the nodes.
   */
  buildTree () {
    // note: in this function you will assign positions and levels by making calls to assignPosition() and assignLevel()
    this.assignPosition(0,0)
    this.assignLevel(0,0)

    this.assignPosition(1,1)
    this.assignLevel(1,0)  

    this.assignPosition(2,1)
    this.assignLevel(2,2)

    this.assignPosition(3,2)
    this.assignLevel(3,0)

    this.assignPosition(4,2)
    this.assignLevel(4,1)

    this.assignPosition(5,2)
    this.assignLevel(5,2)

    this.assignPosition(6,2)
    this.assignLevel(6,5)

    this.assignPosition(7,2)
    this.assignLevel(7,5)

    this.assignPosition(8,3)
    this.assignLevel(8,2)

    this.assignPosition(9,3)
    this.assignLevel(9,3)

    this.assignPosition(10,3)
    this.assignLevel(10,4)
    
    this.assignPosition(11,4)
    this.assignLevel(11,4)

    this.assignPosition(12,3)
    this.assignLevel(12,5)

    this.assignPosition(13,3)
    this.assignLevel(13,6)

    this.assignPosition(14,4)
    this.assignLevel(14,6)

    this.assignPosition(15,4)
    this.assignLevel(15,7)

  }

  /**
   * Recursive function that assign levels to each node
   */
  assignLevel (node, level) {

  }

  /**
   * Recursive function that assign positions to each node
   */
  assignPosition (node, position) {
    
  }

  /**
   * Function that renders the tree
   */
  renderTree () {

  }

}