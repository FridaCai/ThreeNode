ShapeNode = require 'threenodes/nodes/models/ShapeNode'
ShapeNodeView = require 'threenodes/nodes/views/ShapeNodeView'

class Rectangle extends ShapeNodeView
ThreeNodes.Core.addNodeView('Rectangle', Rectangle)

class Rectangle extends ShapeNode
  @node_name = 'Rectangle'
  @group_name = 'Shape'
  initialize: (options) =>
    super
    @set
      width: 90
      height: 26
ThreeNodes.Core.addNodeType('Rectangle', Rectangle)

class Circle extends ShapeNodeView
ThreeNodes.Core.addNodeView('Circle', Circle)

class Circle extends ShapeNode
  @node_name = 'Circle'
  @group_name = 'Shape'
  initialize: (options) =>
    super
    @set
      width: 90
      height: 90
ThreeNodes.Core.addNodeType('Circle', Circle)

class Ellipse extends ShapeNodeView
ThreeNodes.Core.addNodeView('Ellipse', Ellipse)

class Ellipse extends ShapeNode
  @node_name = 'Ellipse'
  @group_name = 'Shape'

  initialize: (options) =>
    super
    @set
      width: 90
      height: 50

ThreeNodes.Core.addNodeType('Ellipse', Ellipse)
