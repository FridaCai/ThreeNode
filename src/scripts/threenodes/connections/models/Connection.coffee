Backbone = require 'Backbone'
Indexer = require 'threenodes/utils/Indexer'

# Node to Node; Group to Group; Node to Group
class Connection extends Backbone.Model
  initialize: (obj) =>
    id = obj.id || Indexer.getInstance().getUID()
    @set('id', id)

    @rawFromId = obj.from
    @rawToId = obj.to

    
    groupFrom = core.groups.getByNodeId(obj.from)
    nodeFrom = core.nodes.getById(obj.from)
    @from = nodeFrom || groupFrom;
    

    groupTo = core.groups.getByNodeId(obj.to)
    nodeTo = core.nodes.getById(obj.to)
    @to = nodeTo || groupTo;

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