Backbone = require 'Backbone'

# Node to Node; Group to Group; Node to Group
class Connection extends Backbone.Model
  initialize: (obj) =>
    id = obj.id || indexer.getUID()
    @set('id', id)

    @rawFromId = obj.from
    @rawToId = obj.to

    from = {
      node: core.nodes.getById(obj.from)
      group: core.groups.getById(obj.from)
      nodeInGroup: core.groups.getByNodeId(obj.from)
    }
    @from = from.node || from.group || from.nodeInGroup;
    

    to = {
      node: core.nodes.getById(obj.to)
      group: core.groups.getById(obj.to)
      nodeInGroup: core.groups.getByNodeId(obj.to)
    }
    @to = to.node || to.group || to.nodeInGroup;

    @fromType = obj.fromType;
    @toType = obj.toType;

  render: () =>
    @trigger("render", this, this)

  validate: () =>
    return false
  
  # todo
  toJSON: () ->
    res =
      id: @get("id")
      from: @rawFromId
      fromType: @fromType
      to: @rawToId
      toType: @toType
    res

module.exports = Connection