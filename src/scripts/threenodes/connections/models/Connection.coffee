Backbone = require 'Backbone'
Indexer = require 'threenodes/utils/Indexer'

# Node to Node; Group to Group; Node to Group
class Connection extends Backbone.Model
  initialize: (obj) =>

    
    id = obj.id || Indexer.getInstance().getUID()
    @set('id', id)
    
    # frida: what is the difference of this.** and this.set('', '')?
    @from = obj.from;
    @fromType = obj.fromType;
    @to = obj.to;
    @toType = obj.toType;

  # remove: =>
  #   # Delete variable reference for garbage collection
  #   delete @from_node
  #   delete @from_type
  #   delete @to_node
  #   delete @to_type
  #   @trigger "connection:removed", this
  #   @destroy()
  #   false

  render: () =>
    @trigger("render", this, this)

  validate: () =>
    return false

  
  # todo
  # toJSON: () ->
  #   res =
  #     id: @get("id")
  #     from_node: @from_node.get("id")
  #     from: @from_type
  #     to_node: @to_node.get("id")
  #     to: @to_type
  #   res

module.exports = Connection