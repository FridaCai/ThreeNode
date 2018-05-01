Backbone = require 'Backbone'
Connection = require 'threenodes/connections/models/Connection'

class Connections extends Backbone.Collection
  model: Connection

  initialize: (models, options) =>
    @bind "connection:removed", (c) => 
      @remove(c)
    super

  removeByGroup: (g)=>
    ids = [g.id]
    
    g.get('nodes').map((n)->
      ids.push n.id
    )
    
    todelete = @models.filter((c)=>
      if(ids.includes(c.rawFromId) || ids.includes(c.rawToId))
        return true
      return false)

    todelete.map((g)->
      @.remove(g)
    ,@)


  removeByNode: (n)=>
    @models.map((c)->
      if(c.from.id == n.id || c.to.id == n.id)
        @remove(c)
    , @)

  render: () =>
    @each (c) -> c.render()

  renderConnections: (node) =>
    @each (c) ->
      if(c.to == node or c.from == node)
        c.render()

  removeAll: () =>
    @remove(@models)

module.exports = Connections
