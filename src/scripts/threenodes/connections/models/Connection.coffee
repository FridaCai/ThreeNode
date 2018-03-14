Backbone = require 'Backbone'
Indexer = require 'threenodes/utils/Indexer'

### Connection model ###
class Connection extends Backbone.Model
  # Create a static indexer used if the connection is not part of a nodes collection (tests)
  @STATIC_INDEXER: new Indexer()

  defaults:
    "cid": -1

  sync: () =>

  initialize: (options) =>
    @options = options

    @from_node = options.from_node;
    @from_type = options.from_type;
    @to_node = options.to_node;
    @to_type = options.to_type;

    indexer = options.indexer || Connection.STATIC_INDEXER

    # Set a unique connection id
    if @get("cid") == -1 then @set({"cid": indexer.getUID()})

  remove: =>
    # Delete variable reference for garbage collection
    delete @from_node
    delete @from_type
    delete @to_node
    delete @to_type

    # Trigger the removed event and call destroy()
    @trigger "connection:removed", this
    @destroy()
    false

  render: () =>
    @trigger("render", this, this)

  validate: () =>
    return false

  validate_deprecated: (attrs, options) =>
    @from_field = attrs.from_field
    @to_field = attrs.to_field
    # make sure we have input and output
    if !@from_field || !@to_field
      return true

    # never connect 2 outputs or 2 inputs
    # if @from_field.get("is_output") == @to_field.get("is_output")
    #   return true

    # never connect in/out from the same node
    # if @from_field.node.get('nid') == @to_field.node.get('nid')
    #   return true

    # @switchFieldsIfNeeded()
    return false

  # todo
  toJSON: () ->
    res =
      id: @get("cid")
      from_node: @from_node.get("nid")
      from_node_gid: @from_node.get("gid")
      from: @from_type
      to_node: @to_node.get("nid")
      to_node_gid: @to_node.get("gid")
      to: @to_type
    res

module.exports = Connection
