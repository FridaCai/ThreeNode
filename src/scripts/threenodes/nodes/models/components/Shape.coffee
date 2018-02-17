NodeNumberSimple = require 'threenodes/nodes/models/NodeNumberSimple'
RectangleView = require 'threenodes/nodes/views/RectangleView'

class Rectangle extends RectangleView
ThreeNodes.Core.addNodeView('Rectangle', Rectangle)

class Rectangle extends NodeNumberSimple
  @node_name = 'Rectangle'
  @group_name = 'Shape'
ThreeNodes.Core.addNodeType('Rectangle', Rectangle)

class Circle extends NodeNumberSimple
  @node_name = 'Circle'
  @group_name = 'Shape'
ThreeNodes.Core.addNodeType('Circle', Circle)

class Ellipse extends NodeNumberSimple
  @node_name = 'Ellipse'
  @group_name = 'Shape'
ThreeNodes.Core.addNodeType('Ellipse', Ellipse)
