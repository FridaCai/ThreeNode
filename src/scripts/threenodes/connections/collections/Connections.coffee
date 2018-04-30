Backbone = require 'Backbone'
Connection = require 'threenodes/connections/models/Connection'

class Connections extends Backbone.Collection
  model: Connection

  initialize: (models, options) =>
    @bind "connection:removed", (c) => 
      @remove(c)
    super


  removeByEntity: (n)=>
    @models.map((c)->
      if(c.from.id == n.id || c.to.id == n.id)
        @remove(c)
    , @)

  render: () =>
    if(c.from.id == c.to.id)
      return
    @each (c) -> c.render()

  renderConnections: (node) =>
    @each (c) ->
      if(c.to == node or c.from == node)
        c.render()

  removeAll: () =>
    @remove(@models)

module.exports = Connections
