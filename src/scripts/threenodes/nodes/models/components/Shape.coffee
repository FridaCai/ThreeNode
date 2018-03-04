ShapeNode = require 'threenodes/nodes/models/ShapeNode'
RectangleView = require 'threenodes/nodes/views/RectangleView'

class Rectangle extends RectangleView
ThreeNodes.Core.addNodeView('Rectangle', Rectangle)

class Rectangle extends ShapeNode
  @node_name = 'Rectangle'
  @group_name = 'Shape'
ThreeNodes.Core.addNodeType('Rectangle', Rectangle)

class Circle extends ShapeNode
  @node_name = 'Circle'
  @group_name = 'Shape'
ThreeNodes.Core.addNodeType('Circle', Circle)

class Ellipse extends ShapeNode
  @node_name = 'Ellipse'
  @group_name = 'Shape'
ThreeNodes.Core.addNodeType('Ellipse', Ellipse)
