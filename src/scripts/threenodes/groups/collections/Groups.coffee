_ = require 'Underscore'
Backbone = require 'Backbone'

class Groups extends Backbone.Collection

  initialize: (models, options) =>
    @bind "group:removed", (group)=>
      @.remove(group)
      @trigger "connections:removed", group

  getById: (id) ->
    return @models.find (g)->
      g.get('id') == id

  getByNodeId: (id) -> 
    return @models.find (g) ->
      nodes = g.get('nodes')
      return nodes.find (n) -> 
        return n.id == id
  
  removeAll: () ->
    @remove(@models)


module.exports = Groups
