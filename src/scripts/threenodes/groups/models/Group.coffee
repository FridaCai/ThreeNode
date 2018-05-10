_ = require 'Underscore'
Backbone = require 'Backbone'
Node = require '../../nodes/models/Node'

# id
# nodes
# name

class Group extends Backbone.Model
    defaults:
        width: 90
        height: 26
        x: 0
        y: 0
        name: "Hello Group"

    initialize: (obj) =>
        super
        id = obj.id || indexer.getUID() 
        @set('name', obj.name || @typename())
        @set('id', id)
        @set('nodes', obj.nodes)

        # avgpos = @getNodesAveragePosition()
        # x = if obj.x then obj.x else avgpos.x
        # y = if obj.y then obj.y else avgpos.y
        @set('x', obj.x)
        @set('y', obj.y)
    
    typename: => String(@constructor.name)

    
    remove: () =>
        @trigger "group:removed", @

module.exports = Group
