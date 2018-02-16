_ = require 'Underscore'
Backbone = require 'Backbone'
_view_node_template = require '../templates/node.tmpl.html'
namespace = require('libs/namespace').namespace

require 'libs/jquery.contextMenu'
require 'jquery.ui'

### Node View ###
class ShapeView extends Backbone.View
  className: "node"

  initialize: (options) ->
    # Setup the view DOM element
    @makeElement()
    # Render the node and "post init" the model
    @render()

  makeElement: () =>
    # Compile the template file
    @template = _.template(_view_node_template, @model)
    @$el.html(@template)

    # Add the node group name as a class to the node element for easier styling
    @$el.addClass("type-" + @model.constructor.group_name)

    # Add other dynamic classes
    @$el.addClass("node-" + @model.typename())

  render: () =>
    @$el.css
      left: parseInt @model.get("x")
      top: parseInt @model.get("y")
    @$el.find("> .head span").text('FridaTest:' + @model.get("name"))
    @$el.find("> .head span").show()

  renderConnections: () =>
    @model.fields.renderConnections()
    if @model.nodes
      _.each @model.nodes.models, (n) ->
        n.fields.renderConnections()

  computeNodePosition: () =>
    pos = $(@el).position()
    offset = $("#container-wrapper").offset()
    @model.set
      x: pos.left + $("#container-wrapper").scrollLeft()
      y: pos.top + $("#container-wrapper").scrollTop()

  remove: () =>
    $(".field", this.el).destroyContextMenu()
    if @$el.data("draggable") then @$el.draggable("destroy")
    $(this.el).unbind()
    @undelegateEvents()
    if @fields_view then @fields_view.remove()
    delete @fields_view
    super

  makeDraggable: () =>
    self = this

    nodes_offset = {top: 0, left: 0}
    selected_nodes = $([])

    $(this.el).draggable
      start: (ev, ui) ->
        if $(this).hasClass("ui-selected")
          selected_nodes = $(".ui-selected").each () ->
            $(this).data("offset", $(this).offset())
        else
          selected_nodes = $([])
          $(".node").removeClass("ui-selected")
        nodes_offset = $(this).offset()
      drag: (ev, ui) ->

        dt = ui.position.top - nodes_offset.top
        dl = ui.position.left - nodes_offset.left
        selected_nodes.not(this).each () ->
          el = $(this)
          offset = el.data("offset")
          dx = offset.top + dt
          dy = offset.left + dl
          el.css
            top: dx
            left: dy
          el.data("object").trigger("node:computePosition")
          el.data("object").trigger("node:renderConnections")

        self.renderConnections()
      stop: () ->
        selected_nodes.not(this).each () ->
          el = $(this).data("object")
          el.trigger("node:renderConnections")
        self.computeNodePosition()
        self.renderConnections()
    return @

ThreeNodes.Core.addNodeView('ShapeView', ShapeView)

module.exports = ShapeView
