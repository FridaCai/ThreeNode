Backbone = require 'Backbone'
Connection = require 'threenodes/connections/models/Connection'

class Connections extends Backbone.Collection
  model: Connection

  initialize: (models, options) =>
    @bind "connection:removed", (c) => @remove(c)
    super

  render: () =>
    @each (c) -> c.render()

  renderConnections: (node) =>
    @each (c) ->
      if(c.to == node or c.from == node)
        c.render()

  removeAll: () =>
    @remove(@models)

module.exports = Connections
