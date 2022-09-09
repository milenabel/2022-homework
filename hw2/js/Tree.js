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
    let name = this.name
    let parentNode = this.parent
  }

  /**
   * Assign other required attributes for the nodes.
   */
  buildTree () {
    // note: in this function you will assign positions and levels by making calls to assignPosition() and assignLevel()

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