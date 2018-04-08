Indexer = require './utils/Indexer'

Nodes = require './nodes/collections/Nodes'
Node = require './nodes/models/Node'

Connections = require './connections/collections/Connections'
Connection = require './connections/models/Connection'

Groups = require './groups/collections/Groups'
Group = require './groups/models/Group'


#require 'jquery'

#### App
class Core
  @fields: {models:{}, views: {}}
  @nodes: {models:{}, views: {}}
  @groups: {models: {}, views: {}}

  constructor: (options) ->
    # Default settings
    settings =
      test: false
      player_mode: false
      direction: true
    @settings = $.extend({}, settings, options)

    # Initialize some core classes
    # @group_definitions = new GroupDefinitions([])
    indexer = new Indexer()
    @groups = new Groups([], {indexer: indexer})
    @nodes = new Nodes([], {settings: @settings, indexer:indexer})
    @connections = new Connections()

    @nodes.bind('node:renderConnections', @renderConnections.bind(@))

    # Create a group node when selected nodes are grouped
    # @group_definitions.bind("definition:created", @nodes.createGroup)

    # When a group definition is removed delete all goup nodes using this definition
    # @group_definitions.bind("remove", @nodes.removeGroupsByDefinition)

  renderConnections: (node) ->
    @connections.renderConnections(node)


  @addFieldType: (fieldName, field) ->
    Core.fields.models[fieldName] = field
    return true

  @addFieldView: (fieldName, fieldView) ->
    Core.fields.views[fieldName] = fieldView
    return true

  @addNodeType: (nodeName, nodeType) ->
    Core.nodes.models[nodeName] = nodeType
    return true

  @addNodeView: (viewName, nodeView) ->
    Core.nodes.views[viewName] = nodeView
    return true

  getGroupByNode: (id) ->
    for group in @db.groups
      if(group.nodes.includes(id))
        return group
    return

  getNodeById: (id) ->
    for node in @db.nodes
      if(node.id == id)
        return node
    return

  setNodes: (json_object) ->
    @nodes.removeAll()
    @db = json_object
    self = @

    @db.nodes.map (obj) ->
      if !self.getGroupByNode(obj.id, self.db.groups)
        nodeClass = Core.nodes.models[obj.type]
        node = new nodeClass(obj)
        self.nodes.push(node)

    # group
    @db.groups.map (obj) ->
      groupObj = {
        id: obj.id,
        x: obj.x,
        y: obj.y
        width: obj.width,
        height: obj.height,
        nodes: []
      }

      obj.nodes.map (nodeId) ->
        nodeObj = self.getNodeById(nodeId)
        node = new Core.nodes.models[nodeObj.type](nodeObj)
        groupObj.nodes.push(node)
      
      group = new Group(groupObj)
      self.groups.push(group)

      
    # connections
    @db.connections.map (c) ->
      fromNode = self.nodes.getById(c.from)
      fromGroup = self.groups.getByNodeId(c.from)
      toNode = self.nodes.getById(c.to)
      toGroup = self.groups.getByNodeId(c.to)
      obj = {
        id: c.id,
        fromType: c.fromType,
        toType: c.toType
      }
      
      if fromGroup && toGroup && fromGroup.id == toGroup.id
        # do nothing
      else
        obj.from = fromGroup || fromNode
        obj.to = toGroup || toNode
        connection = new Connection(obj)
        self.connections.push(connection)

module.exports = Core
