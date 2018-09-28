_ = require 'Underscore'
Backbone = require 'Backbone'
_view_node_template = require '../templates/node.tmpl.html'
_view_node_context_menu = require '../templates/node_context_menu.tmpl.html'
# FieldsView = require 'threenodes/fields/views/FieldsView'

namespace = require('libs/namespace').namespace

require 'libs/jquery.contextMenu'
require 'jquery.ui'
Linker = require('../../linkers/models/Linker')


### Node View ###
class ShapeNodeView extends Backbone.View
  className: "node"

  initialize: (options) ->
    # Setup the view DOM element
    @makeElement()

    # Initialize mouse events
    if !options.isSubNode
      @makeDraggable()
    @initNodeClick()
    @initTitleClick()

    # Initialize the fields view
    # @fields_view = new FieldsView
    #   node: @model
    #   collection: @model.fields
    #   el: $("> .options", @$el)

    # Bind events
    @model.on('change', @render)
    #@model.on('postInit', @postInit)
    @model.on('remove', () => @remove())
    @model.on("node:computePosition", @move)
    # @model.on("node:renderConnections", @renderConnections)
    @model.on("node:addSelectedClass", @addSelectedClass)

    # Render the node and "post init" the model
    @render()
    @initContextMenus()
    # @highlighAnimations()
    #@model.postInit()

  initContextMenus: () =>
    self = @
    if $("#node-context-menu").length < 1
      node_menu = _.template(_view_node_context_menu, {})
      $("body").append(node_menu)
    @$el.find(".head").contextMenu {menu: "node-context-menu"}, (action, el, pos) =>
      if action == "remove_node" then self.model.remove()
      if action == "rename_node" then @rename()
    return @
  
  rename: ()->
    $title_span = @$el.find("> .head span");
    $input = @$el.find("> .head input");
    prev = $title_span.html()
    $input.val(prev)
    $title_span.hide();
    $input.show()
    $input.select();

  makeElement: () =>
    # Compile the template file
    @template = _.template(_view_node_template, @model)
    @$el.html(@template)

    # Add the node group name as a class to the node element for easier styling
    @$el.addClass("type-" + @model.constructor.group_name)

    # Add other dynamic classes
    @$el.addClass("node-" + @model.typename())
    @addHandlerListener()

  addHandlerListener: ()->
    self = this
    linker = null
    from = null
    now = null

    $('.handler', @$el).draggable
      helper: () ->
        $("<div class='ui-widget-drag-helper'></div>")
      scroll: true
      cursor: 'pointer'
      cursorAt:
        left: 0
        top: 0
      start: (event, ui) ->
        dir = $(this).data('attr')
        angle = 0

        switch dir
          when "up" then angle = 1 / 2
          when "down" then angle = 3 / 2 
          when "left" then angle = 0
          when "right" then angle = 1
        
        angle *= Math.PI

        _from = $(this).position()
        _now = ui.position
        ofx = $("#container-wrapper").scrollLeft()
        ofy = $("#container-wrapper").scrollTop()
        offset =
            left: self.model.get("x")
            top: self.model.get("y")

        from = {
          x: _from.left + offset.left + 2
          y: _from.top + offset.top + 2
          id: self.model.id
          angle
        }
        now = {
          x: _now.left + offset.left + ofx
          y: _now.top + offset.top + ofy
        }
        
        linker = new Linker({
          from, 
          to: now
        })
        

      stop: (event, ui) ->
        if(Math.abs(now.x - from.x) > 20 || Math.abs(now.y - from.y) > 20)
          core.linkers.add(linker)
        else
          Linker.removeLinker(linker)
          



        
      drag: (event, ui) ->
        _now = ui.position
        ofx = $("#container-wrapper").scrollLeft()
        ofy = $("#container-wrapper").scrollTop()
        offset =
            left: self.model.get("x")
            top: self.model.get("y")
        now = {
          x: _now.left + offset.left + ofx
          y: _now.top + offset.top + ofy
        }
        Linker.moveLinker(linker, 'to', now.x, now.y)

    $(".handler", @$el).droppable
      accept: '.handler'
      activeClass: "ui-state-active"
      hoverClass: "ui-state-hover"
      tolerance: "pointer"
      drop: (event, ui) ->
        self.model.trigger("connection:create", {
          from: $(ui.draggable).parent().data('object')
          fromType: $(ui.draggable).attr('data-attr')
          to: self.model
          toType: $(@).attr('data-attr')
        })
        return this
  render: () =>
    @$el.css
      left: parseInt @model.get("x")
      top: parseInt @model.get("y")
    @$el.find("> .head span").text(@model.get("name"))
    @$el.find("> .head span").show()

  addSelectedClass: () =>
    @$el.addClass("ui-selected")


  move: (offset) =>
    @model.set
      x: @model.get('x') + offset.x
      y: @model.get('y') + offset.y

    # get model linkers by go through linkers collection
    linkers = core.linkers.getLinkersByShapeId(@model.id)
    linkers.map((linker) =>
      from = linker.get('from')
      if(from.id == @model.id)
        from.x += offset.x
        from.y += offset.y
        linker.set('from', from)

      to = linker.get('to')
      if(to.id == @model.id)
        to.x += offset.x 
        to.y += offset.y
        linker.set('to', to)

      Linker.render(linker, true)
    )

  remove: () =>
    $(".field", this.el).destroyContextMenu()
    if @$el.data("draggable") then @$el.draggable("destroy")
    $(this.el).unbind()
    @undelegateEvents()
    super

  initNodeClick: () ->
    self = this
    $(@el).click (e) ->
      if e.metaKey == false
        $( ".node" ).removeClass("ui-selected")
        $( ".group" ).removeClass("ui-selected")
        $(this).addClass("ui-selecting")
      else
        if $(this).hasClass("ui-selected")
          $(this).removeClass("ui-selected")
        else
          $(this).addClass("ui-selecting")
      selectable = $("#container").data("ui-selectable")
      if !selectable then return
      selectable.refresh()
      # selectable._mouseStop(null)
      # self.model.fields.renderSidebar()
    return @

  apply_input_result:() ->
    $title_span = @$el.find("> .head span");
    $input = @$el.find("> .head input");

    name = $input.val()
    name = name || $title_span.html()

    this.model.set('name', name)
    
    $input.hide()
    $title_span.show()

  initTitleClick: () ->
    self = @
    $input = $("<input type='text' />")
    @$el.find("> .head").append($input)
    $input.hide()

    $input.blur (e) ->
      self.apply_input_result()

    $("#graph").click (e) ->
      self.apply_input_result()

    $input.keydown (e) ->
      if e.keyCode == 13
        self.apply_input_result()

    $input.on 'mousedown', (e) ->
      e.stopPropagation()

    @$el.find("> .head span").dblclick (e) ->
      self.rename()
    return @

  makeDraggable: () =>
    self = this

    selected_nodes = $([])
    start = null

    $(this.el).draggable
      start: (ev, ui) ->
        start = {
          x: ui.position.left
          y: ui.position.top
        }
      drag: (ev, ui) ->
        offset = {
          x: ui.position.left - start.x
          y: ui.position.top - start.y
        }

        self.move(offset)

        start.x = ui.position.left
        start.y = ui.position.top

      stop: () ->

    return @

ThreeNodes.Core.addNodeView('ShapeNodeView', ShapeNodeView)

module.exports = ShapeNodeView
