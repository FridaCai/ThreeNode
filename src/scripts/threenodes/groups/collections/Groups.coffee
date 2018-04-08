_ = require 'Underscore'
Backbone = require 'Backbone'
Indexer = require 'threenodes/utils/Indexer'
Group = require '../models/Group'

class Groups extends Backbone.Collection

  initialize: (models, options) =>
    @indexer = options.indexer

  createGroup: () =>
    nodes = @getSelectedNodes()
    n = new Group({nodes: nodes}, {indexer: @indexer})
    @add(n)


  getSelectedNodes: () ->
    selected_nodes = []
    $selected = $(".node.ui-selected").not(".node .node")
    $selected.each () ->
      node = $(this).data("object")
      selected_nodes.push(node)
    return selected_nodes

module.exports = Groups
