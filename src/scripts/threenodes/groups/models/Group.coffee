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

    getNodesAveragePosition: () ->
        min_x = 0
        min_y = 0
        max_x = 0
        max_y = 0
        for node in this.get('nodes')
            min_x = Math.min(min_x, node.get("x"))
            max_x = Math.max(max_x, node.get("x"))
            min_y = Math.min(min_y, node.get("y"))
            max_y = Math.max(max_y, node.get("y"))

        dx = (min_x + max_x) / 2
        dy = (min_y + max_y) / 2
        return {x: dx, y: dy}

    remove: () =>
        @trigger "group:removed", @

module.exports = Group
