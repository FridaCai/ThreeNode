Backbone = require 'Backbone'

class Linkers extends Backbone.Collection

  initialize: (models, options) =>
    @bind "model:removed", (linker)=>
      @.remove(linker)
      @trigger "linkers:removed", linker

  getById: (id) ->
    return @models.find (l)->
      l.get('id') == id

  getLinkersByShapeId:(id) ->
    return @models.filter (l) ->
      if(l.get('from').id == id || l.get('to').id == id)
        return true
      return false
      

  removeAll: () ->
    @remove(@models)


module.exports = Linkers
