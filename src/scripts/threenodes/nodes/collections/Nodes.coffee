_ = require 'Underscore'
Backbone = require 'Backbone'

class Nodes extends Backbone.Collection

  initialize: (models, options) =>
    self = this

    @bind "node:removed", (node)=>
      @remove(node)
      @trigger "connections:removed", node

      
  destroy: () =>
    @removeAll()

  find: (node_name) =>
    return this.where({name: node_name})

  createNode: (options) =>
    # If not is a string instead of an object then take the option as the node type
    if $.type(options) == "string"
      options = {type: options}

    # Save references of the application settings and timeline in the node model
    options.timeline = @timeline
    options.settings = @settings

    # Save a reference of the nodes indexer
    # options.indexer = @indexer

    options.parent = @parent

    # Print error if the node type is not found and return false
    if !ThreeNodes.Core.nodes.models[options.type]
      console.error("Node type doesn't exists: " + options.type)
      return false

    # Create the node and pass the options
    n = new ThreeNodes.Core.nodes.models[options.type](options)

    # Add the node to the collection
    @add(n)
    n


  getById: (id) ->
    return @models.find (n)->
      n.get('id') == id

  removeSelectedNodes: () ->
    for node in $(".node.ui-selected")
      $(node).data("object").remove()

  removeAll: () ->
    @remove(@models)

module.exports = Nodes
