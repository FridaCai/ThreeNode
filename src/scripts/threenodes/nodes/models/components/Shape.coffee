NodeNumberSimple = require 'threenodes/nodes/models/NodeNumberSimple'


class Shape extends NodeNumberSimple
  @node_name = 'Shape'
  @group_name = 'Shape'

ThreeNodes.Core.addNodeType('Shape', Shape)

