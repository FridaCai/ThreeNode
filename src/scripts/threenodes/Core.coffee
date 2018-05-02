Nodes = require './nodes/collections/Nodes'
Node = require './nodes/models/Node'

Connections = require './connections/collections/Connections'
Connection = require './connections/models/Connection'

Groups = require './groups/collections/Groups'
Group = require './groups/models/Group'

# Frida. please find better solution.
Indexer = require 'threenodes/utils/Indexer'

#require 'jquery'

#### App
class Core
  @fields: {models:{}, views: {}}
  @nodes: {models:{}, views: {}}
  @groups: {models: {}, views: {}}
  
  
  constructor: (options) ->
    @id = indexer.getUID()

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

    @nodes.bind('node:renderConnections', @renderConnectionsByNode.bind(@))
    @groups.bind('node:renderConnections', @renderConnectionsByGroup.bind(@))

    @nodes.bind "connections:removed", (n)=>@connections.removeByNode(n)
    @groups.bind "connections:removed", (g)=>@connections.removeByGroup(g)
    @nodes.bind "connection:create", (op) =>@connections.create(op)
    @groups.bind "connection:create", (op) =>@connections.create(op)


  createGroup: ()->
    nodes = @getSelectedNodes()
    group = new Group({nodes: nodes})
    @groups.add(group)
    @nodes.remove(nodes)
    @connections.render()

  getSelectedNodes: () ->
    selected_nodes = []
    $selected = $(".node.ui-selected").not(".node .node")
    $selected.each () ->
      node = $(this).data("object")
      selected_nodes.push(node)
    return selected_nodes

  renderConnectionsByNode: (node) ->
    @connections.renderConnections(node)

  renderConnectionsByGroup:(group) ->
    group.get('nodes').map((n)->
      @connections.renderConnections(n)
    , @)
    @connections.renderConnections(group)
    

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

    indexer.set(maxid)

module.exports = Core
