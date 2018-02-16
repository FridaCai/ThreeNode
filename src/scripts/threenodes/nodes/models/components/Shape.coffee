NodeNumberSimple = require 'threenodes/nodes/models/NodeNumberSimple'
ShapeView = require 'threenodes/nodes/views/ShapeView'

class Rectangle extends NodeNumberSimple
  @node_name = 'Rectangle'
  @group_name = 'Shape'
ThreeNodes.Core.addNodeType('Rectangle', Rectangle)

class Rectangle extends ShapeView
ThreeNodes.Core.addNodeView('Rectangle', Rectangle)