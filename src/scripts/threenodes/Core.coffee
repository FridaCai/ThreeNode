Nodes = require './nodes/collections/Nodes'
Node = require './nodes/models/Node'

Connections = require './connections/collections/Connections'
Connection = require './connections/models/Connection'

Groups = require './groups/collections/Groups'
Group = require './groups/models/Group'

# Frida. please find better solution.
Indexer = require 'threenodes/utils/Indexer'

DB = require './db'

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

    @groups = new Groups([])
    @nodes = new Nodes([], {settings: @settings})
    @connections = new Connections()
    @head = null # null or groupid

    @nodes.bind('node:renderConnections', @renderConnectionsByNode.bind(@))
    @groups.bind('node:renderConnections', @renderConnectionsByGroup.bind(@))

    @nodes.bind "connections:removed", (n)=>@connections.removeByNode(n)
    @groups.bind "connections:removed", (g)=>@connections.removeByGroup(g)
    @nodes.bind "connection:create", (op) =>@connections.create(op)
    @groups.bind "connection:create", (op) =>@connections.create(op)


  createGroup: (nodes)->
    index = Indexer.getInstance().getUID()
    db.createGroup(nodes, index)    
    @refreshDatamodelAccordingToDB(db)

    
    # group = new Group({nodes: nodes})
    # @groups.add(group)
    # @nodes.remove(nodes)
    # @connections.render()

  
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

  dump: () =>
    db.updateProperty({
      nodes: @nodes
      groups: @groups
      connections: @connections
      id: @id
    })
    res = {
      id: db.id,
      connections: db.connections,
      nodes: db.nodes,
      groups: db.groups
    }
    return JSON.stringify(res, null, 2)

  setNodes: (json) ->
    # @nodes.removeAll()
    db.loadFromJson(json)
    tmparr = db.nodes.concat(db.connections)
    db.groups.map (obj) ->
      obj.nodes.map (nodeObj) ->
        tmparr.push(nodeObj)
    maxid = tmparr.reduce (a, b) ->
      return (if a.id > b.id then a.id else b.id)
    indexer.set(maxid)
    @refreshDatamodelAccordingToDB(db)



  refreshDatamodelAccordingToDB:(db)->
   # @groups = new Groups([])
    # @nodes = new Nodes([], {settings: @settings})
    # @connections = new Connections()
    @groups.removeAll()
    @nodes.removeAll()
    @connections.removeAll()


    self = @
    db.nodes.map (obj) ->
      nodeClass = Core.nodes.models[obj.type]
      node = new nodeClass(obj)
      self.nodes.push(node)

    # group
    db.groups.map (obj) ->
      nodes = obj.nodes.map (obj)->
        nodeClass = Core.nodes.models[obj.type]
        return new nodeClass(obj)

      groupObj = {
        id: obj.id
        x: obj.x
        y: obj.y
        width: obj.width,
        height: obj.height,
        nodes: nodes
      }
      group = new Group(groupObj)
      self.groups.push(group)


    #connections
    #                 node  group nodeInsideGroup
    # node            n->n  n->g  n->g
    # group           g->n  g->g  g->g
    # nodeInsideGroup g->n  g->g  sameGroup ? not render: g->g
    
    db.connections.map (c) ->
      from = {
        node: self.nodes.getById(c.from)
        group: self.groups.getById(c.from)
        nodeInGroup: self.groups.getByNodeId(c.from)
      }
      # when view group detial, external connection might be the case.
      if(!from.node && !from.group && !from.nodeInGroup)
        return

      to = {
        node: self.nodes.getById(c.to)
        group: self.groups.getById(c.to)
        nodeInGroup: self.groups.getByNodeId(c.to)
      }

      if(!to.node && !to.group && !to.nodeInGroup)
        return

      if(from.nodeInGroup && to.nodeInGroup && from.nodeInGroup == to.nodeInGroup)
        # do nothing
      else
        connection = new Connection({
          id: c.id
          from: from.node || from.group || from.nodeInGroup
          to: to.node || to.group || to.nodeInGroup
          fromType: c.fromType
          toType: c.toType
        })
        self.connections.push(connection)

module.exports = Core
