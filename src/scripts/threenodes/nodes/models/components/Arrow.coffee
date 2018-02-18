NodeNumberSimple = require 'threenodes/nodes/models/NodeNumberSimple'


class Direction extends NodeNumberSimple
  @node_name = 'Direction'
  @group_name = 'Arrow'
ThreeNodes.Core.addNodeType('Direction', Direction)

class NoDirection extends NodeNumberSimple
  @node_name = 'NoDirection'
  @group_name = 'Arrow'
ThreeNodes.Core.addNodeType('NoDirection', NoDirection)


