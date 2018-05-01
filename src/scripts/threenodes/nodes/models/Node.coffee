_ = require 'Underscore'
Backbone = require 'Backbone'
Utils = require 'threenodes/utils/Utils'

class Node extends Backbone.Model
  defaults:
    x: 0
    y: 0
    width: 90
    height: 26
    name: ""

  initialize: (obj) =>
    super
    
    id = obj.id || indexer.getUID() #todo: Indexer
    @set('id', id)
    
    name = obj.name || @typename()
    @set('name', name)

    @set('x', obj.x)
    @set('y', obj.y)
    @set('width', obj.width)
    @set('height', obj.height)
    return this

  typename: => String(@constructor.name)

  toJSON: () =>
    res =
      id: @get('id')
      type: @typename()
      x: @get('x')
      y: @get('y')
      width: @get('width')
      height: @get('height')
    res


  remove: () =>
    @trigger "node:removed", @
 
module.exports = Node