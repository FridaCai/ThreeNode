Nodes = require './nodes/collections/Nodes'
Node = require './nodes/models/Node'

Connections = require './connections/collections/Connections'
Connection = require './connections/models/Connection'

Groups = require './groups/collections/Groups'
Group = require './groups/models/Group'

Linkers = require './linkers/collections/Linkers'
Linker = require './linkers/models/Linker'

# Frida. please find better solution.
Indexer = require 'threenodes/utils/Indexer'

DB = require './db'

#require 'jquery'

#### App
class Core
  @fields: {models:{}, views: {}}
  @nodes: {models:{}, views: {}}
  # @groups: {models: {}, views: {}}
  
  
  constructor: (options) ->
    @id = indexer.getUID()

    # Default settings
    settings =
      test: false
      player_mode: false
      direction: true
    @settings = $.extend({}, settings, options)

    @groups = new Groups([])
    @linkers = new Linkers([])
    @nodes = new Nodes([], {settings: @settings})
    @connections = new Connections()

    # for testing
    @Linker=require './linkers/models/Linker'

    @head = null # null or groupid

    # @nodes.bind('node:renderConnections', @renderConnectionsByNode.bind(@))
    # @groups.bind('node:renderConnections', @renderConnectionsByGroup.bind(@))

    # @nodes.bind "connections:removed", (n)=>@connections.removeByNode(n)
    # @groups.bind "connections:removed", (g)=>@connections.removeByGroup(g)
    # @nodes.bind "connection:create", (op) =>@connections.create(op)
    # @groups.bind "connection:create", (op) =>@connections.create(op)


  createGroup: (nodes)->
    index = Indexer.getInstance().getUID()
    db.updateProperty({
      id: @id,
      nodes: @nodes,
      groups: @groups,
      connections: @connections
    })
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
      linkers: @linkers
      id: @id
    })
    res = {
      id: db.id,
      linkers: db.linkers,
      nodes: db.nodes,
      groups: db.groups
    }
    return JSON.stringify(res, null, 2)

  setNodes: (json) ->
    db.loadFromJson(json)
    tmparr = db.nodes.concat(db.linkers)
    
    db.groups.map (obj) ->
      obj.nodes.map (nodeObj) ->
        tmparr.push(nodeObj)
    maxid = tmparr.reduce (a, b) ->
      return (if a.id > b.id then a.id else b.id)
    indexer.set(maxid)
    @refreshDatamodelAccordingToDB(db)



  refreshDatamodelAccordingToDB:(db)->
    @groups.removeAll()
    @nodes.removeAll()
    @linkers.removeAll()

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

    db.linkers.map (obj)->
      linker = new Linker(
        id: obj.id
        name:'linker'
        text:obj.text
        points:obj.points
        from:obj.from
        to:obj.to
      )
      self.linkers.push(linker)

    return

    #connections
    #                 node  group nodeInsideGroup
    # node            n->n  n->g  n->g
    # group           g->n  g->g  g->g
    # nodeInsideGroup g->n  g->g  sameGroup ? not render: g->g
    
    db.linkers.map (c) ->
      from = {
        node: self.nodes.getById(c.from.id)
        group: self.groups.getById(c.from.id)
        nodeInGroup: self.groups.getByNodeId(c.from.id)
      }
      # when view group detial, external connection might be the case.
      if(!from.node && !from.group && !from.nodeInGroup)
        return

      to = {
        node: self.nodes.getById(c.to.id)
        group: self.groups.getById(c.to.id)
        nodeInGroup: self.groups.getByNodeId(c.to.id)
      }

      if(!to.node && !to.group && !to.nodeInGroup)
        return

      if(from.nodeInGroup && to.nodeInGroup && from.nodeInGroup == to.nodeInGroup)
        # do nothing
      else
      #frida. problem here.
        _from = from.node || from.group || from.nodeInGroup
        linker = new Linker({
          id: c.id
          name:'linker'
          text:''
          points: c.points
          from: 
            x: _from.x
            y:_from.y
          to: to.node || to.group || to.nodeInGroup
          fromType: c.fromType
          toType: c.toType
        })
        self.linkers.push(linker)

module.exports = Core
