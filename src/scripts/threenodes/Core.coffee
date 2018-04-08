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

    # Create a group node when selected nodes are grouped
    # @group_definitions.bind("definition:created", @nodes.createGroup)

    # When a group definition is removed delete all goup nodes using this definition
    # @group_definitions.bind("remove", @nodes.removeGroupsByDefinition)

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

    # nodes
    self = @

    @db.nodes.map (obj) ->
      if !self.getGroupByNode(obj.id, self.db.groups)
        node = new Node(obj)
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
        node = self.nodes.getNodeById(nodeId)
        groupObj.nodes.push(node)        
      
      group = new Group(groupObj)
      self.groups.push(group)

      
    return;

    # connections
    @db.connections.map (c)->
      fromNodeId = c.from
      fromNodeObj = self.getNodeById(fromNodeId)
      fromNode = new Node(fromNodeObj)
      fromGroupObj = self.getGroupByNode(fromNodeId, self.db.groups)
      if fromGroupObj
        fromGroup = new Group(fromGroupObj)

      toNodeId = c.to
      toNodeObj = self.getNodeById(toNodeId)
      toNode = new Node(toNodeObj)
      toGroupObj = self.getGroupByNode(toNodeId, self.db.groups)
      if toGroupObj
        toGroup = new Group(toGroupObj)

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







    





    # First recreate the group definitions
    # if json_object.groups
    #   for grp_def in json_object.groups
    #     @group_definitions.create(grp_def)

    # Create the nodes
    # for node in json_object.nodes
    #   if node.type != "Group"
    #     # Create a simple node
    #     @nodes.createNode(node)
    #   else
        # If the node is a group we first need to get the previously created group definition
        # def = @group_definitions.getByGid(node.definition_id)
        # if def
        #   node.definition = def
        #   grp = @nodes.createGroup(node)
        # else
        #   console.log "can't find the GroupDefinition: #{node.definition_id}"

    # Create the connections
    # for connection in json_object.connections
    #   @nodes.createConnectionFromObject(connection)

    # @nodes.indexer.uid = json_object.uid
    # delay = (ms, func) -> setTimeout func, ms
    # delay 1, => @nodes.renderAllConnections()

module.exports = Core
