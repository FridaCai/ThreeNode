_ = require 'Underscore'
Backbone = require 'Backbone'
Utils = require 'threenodes/utils/Utils'

class Node extends Backbone.Model
  defaults:
    id: -1
    x: 0
    y: 0
    width: 90
    height: 26
    name: ""

  initialize: (obj) =>
    super
    
    id = obj.id || Index.getInstance().getUID() #todo: Indexer
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
      name: @get('name')
      type: @typename()
      x: @get('x')
      y: @get('y')
      width: @get('width')
      height: @get('height')
    res
 
module.exports = Node