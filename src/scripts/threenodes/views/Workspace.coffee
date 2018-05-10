#"use strict"
_ = require 'Underscore'
Backbone = require 'Backbone'
ConnectionView = require 'threenodes/connections/views/ConnectionView'
GroupView = require 'threenodes/groups/views/Group'
require 'jquery.ui'


### Workspace View ###

# A workspace consists of nodes and connections.
# There is a global workspace and possibly many workspaces
# from group nodes. There is always only one workspace displayed.

class Workspace extends Backbone.View
  initialize: (options) =>
    super
    @settings = options.settings
    @initDrop()

    @views = []
    @nodes = core.nodes
    @connections = core.connections
    @groups = core.groups

    @nodes.bind("add", @renderNode)
    @connections.bind("add", @renderConnection)
    @groups.bind("add", @renderGroup)

  render: () =>
    
  clearView:()->
    _.each(@views, (view) -> view.remove())
    @views=[]

  destroy: () =>
    # Remove all existing views before displaying new ones
    _.each(@views, (view) -> view.remove())
    @nodes.unbind("add", @renderNode)
    @connections.unbind("add", @renderConnection)
    delete @views
    delete @settings
    @remove()

  renderNode: (node) =>
    nodename = node.constructor.name

    if ThreeNodes.Core.nodes.views[nodename]
      # If there is a view associated with the node model use it
      viewclass = ThreeNodes.Core.nodes.views[nodename]
    else
      # Use the default view class
      viewclass = ThreeNodes.Core.nodes.views.NodeView

    # Add directly the node element to the dom so that the view can
    # access the .parent() directly. (@see FieldsView.onFieldCreated)
    $nodeEl = $("<div class='node'></div>").appendTo(@$el)
    view = new viewclass
      model: node
      el: $nodeEl

    # Save the id and model in the data attribute
    view.$el.data("id", node.get("id"))
    view.$el.data("object", node)
    @views.push(view)

  renderConnection: (connection) =>
    if @settings.test == true
      return false
    view = new ConnectionView
      model: connection
      settings: @settings
    @views.push(view)

  renderGroup: (group) =>
    $groupEl = $("<div class='group'></div>").appendTo(@$el)
    view  = new GroupView
      model: group
      el: $groupEl

    @views.push(view)
    view.$el.data("object", group)





  initDrop: () =>
    self = this
    # Setup the drop area for the draggables created above
    $("#container").droppable
      accept: "#tab-new a.button, #library .definition"
      activeClass: "ui-state-active"
      hoverClass: "ui-state-hover"
      drop: (event, ui) ->
        offset = $("#container-wrapper").offset()
        definition = false

        if ui.draggable.hasClass("definition")
          nodename = "Group"
          container =  $("#library")
          definition = ui.draggable.data("model")
          offset.left -= container.offset().left
        else
          nodename = ui.draggable.attr("rel")
          container =  $("#sidebar .ui-layout-center")

        dx = ui.position.left + $("#container-wrapper").scrollLeft() - offset.left - 10
        dy = ui.position.top + $("#container-wrapper").scrollTop() - container.scrollTop() - offset.top
        if self.nodes
          self.nodes.createNode({type: nodename, x: dx, y: dy, definition: definition})
        $("#sidebar").show()

    return this

module.exports = Workspace
