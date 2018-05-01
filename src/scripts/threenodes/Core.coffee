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
  @id: Indexer.getInstance().getUID()
  
  constructor: (options) ->
    # Default settings
    settings =
      test: false
      player_mode: false
      direction: true
    @settings = $.extend({}, settings, options)

    # Initialize some core classes
    # @group_definitions = new GroupDefinitions([])
    @groups = new Groups([])
    @nodes = new Nodes([], {settings: @settings})
    @connections = new Connections()

    @nodes.bind('node:renderConnections', @renderConnections.bind(@))
    @groups.bind('node:renderConnections', @renderConnections.bind(@))

    
    
    
    
    #rm connections by node or group
    @nodes.bind "connections:removed", (n)=>
      @connections.removeByNode(n)
    @groups.bind "connections:removed", (g)=>
      @connections.removeByGroup(g)
    
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

  

  setNodes: (json) ->
    # @nodes.removeAll()

    self = @
    @id = json.id
    maxid = json.id

    json.nodes.map (obj) ->
      maxid = if obj.id > maxid then obj.id else maxid
      nodeClass = Core.nodes.models[obj.type]
      node = new nodeClass(obj)
      self.nodes.push(node)

    # group
    json.groups.map (obj) ->
      maxid = if obj.id > maxid then obj.id else maxid
      groupObj = {
        id: obj.id,
        x: obj.x,
        y: obj.y
        width: obj.width,
        height: obj.height,
        nodes: []
      }

      obj.nodes.map (nodeObj) ->
        maxid = if nodeObj.id > maxid then nodeObj.id else maxid
        node = new Core.nodes.models[nodeObj.type](nodeObj)
        groupObj.nodes.push(node)
      
      group = new Group(groupObj)
      self.groups.push(group)


    #connections
    json.connections.map (c) ->
      maxid = if c.id > maxid then c.id else maxid
      connection = new Connection(c)
      self.connections.push(connection)

    Indexer.getInstance().set(maxid)

module.exports = Core
