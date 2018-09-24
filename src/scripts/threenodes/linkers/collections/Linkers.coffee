Backbone = require 'Backbone'

class Linkers extends Backbone.Collection

  initialize: (models, options) =>
    @bind "model:removed", (linker)=>
      @.remove(linker)
      @trigger "linkers:removed", linker

  getById: (id) ->
    return @models.find (l)->
      l.get('id') == id

  removeAll: () ->
    @remove(@models)


module.exports = Linkers
