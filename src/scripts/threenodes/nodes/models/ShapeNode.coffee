_ = require 'Underscore'
Backbone = require 'Backbone'

### Node model ###

# Common base for all nodes.
class ShapeNode extends Backbone.Model
  @node_name = ''
  @group_name = ''

  defaults:
    nid: -1
    gid: -1 # group id, set on subnodes of group == group.nid
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

    if @get('nid') == -1
      # If this a new node assign a unique id to it
      @set('nid', @indexer.getUID())
    else
      # If the node is loaded set the indexer uid to the node.nid.
      # With this, the following created nodes will have a unique nid
      @indexer.uid = @get('nid')
    return this

  typename: => String(@constructor.name)

  remove: () =>
    delete @options
    delete @settings
    delete @indexer
    # todo : remove when @model.postInit is removed in NodeView
    delete @fully_inited
    @destroy()

 
  createConnection: (from_node, from_type, to_node, to_type) =>
    @trigger("createConnection", from_node, from_type, to_node, to_type)
  
  renderConnections:()=>
    @trigger("renderConnections", @)

  toJSON: () =>
    res =
      nid: @get('nid')
      name: @get('name')
      type: @typename()
      x: @get('x')
      y: @get('y')
      width: @get('width')
      height: @get('height')
    res

module.exports = ShapeNode