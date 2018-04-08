_ = require 'Underscore'
Backbone = require 'Backbone'

### Node model ###

# Common base for all nodes.
class ShapeNode extends Backbone.Model
  @node_name = ''
  @group_name = ''

  defaults:
    id: -1
    # gid: -1 # group id, set on subnodes of group == group.id
    x: 0
    y: 0
    width: null
    height: null
    name: ""

  initialize: (options) =>
    super
    # Keep reference of some variables
    @settings = options.settings
    @indexer = options.indexer
    @options = options

    # Parent node, used to detect if a node is part of a group
    @parent = options.parent

    # Set a default node name if none is provided
    if @get('name') == '' then @set('name', @typename())

    if @get('id') == -1
      @set('id', @indexer.getUID())
    else
      @indexer.uid = @get('id')
    return this

  typename: => String(@constructor.name)

  remove: () =>
    delete @options
    delete @settings
    delete @indexer
    # todo : remove when @model.postInit is removed in NodeView
    delete @fully_inited
    
    @removeConnection()
    @destroy()

  removeConnection: () =>
    @trigger("removeConnection", @)
 
  createConnection: (from_node, from_type, to_node, to_type) =>
    @trigger("createConnection", from_node, from_type, to_node, to_type)
  
  renderConnections:()=>
    @trigger("renderConnections", @)

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

module.exports = ShapeNode