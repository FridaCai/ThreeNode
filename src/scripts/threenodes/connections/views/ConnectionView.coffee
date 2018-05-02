_ = require 'Underscore'
Backbone = require 'Backbone'

require 'jquery.ui'

### Connection View ###
class ConnectionView extends Backbone.View
  initialize: () ->
    super
    @container = $("#graph")
    
    # @svg = ThreeNodes.UI.UIView.svg.path().attr
    #   stroke: "#555"
    #   fill: "none"
    @svg = ThreeNodes.UI.UIView.svg;
    @curve = @svg.path().attr
      stroke: "#fff"
    @triangle = @svg.path().attr
      stroke: "#fff"
      fill: "#fff"

    # set the dom element
    @el = @svg.node
    @model.bind("render", () => @render())
    @model.bind("destroy", () => @remove())
    @model.bind("remove", () => @remove())
    @render()

  remove: ->
    if(@curve)
      @curve.remove()
      delete @curve
    
    if(@triangle)
      @triangle.remove()
      delete @triangle

    return true

  render: () ->
    #                 node  group nodeInsideGroup
    # node            n->n  n->g  n->g
    # group           g->n  g->g  g->g
    # nodeInsideGroup g->n  g->g  sameGroup ? not render: g->g
    if(@model.from.id == @model.to.id)
      @remove()
      return

    drawModel = @model
    fromGroup = core.groups.getByNodeId(@model.from.id)
    toGroup = core.groups.getByNodeId(@model.to.id)
    if(fromGroup && toGroup && fromGroup.id == toGroup.id)
      @remove()
      return
    
    drawModel = {
      from: fromGroup || @model.from
      fromType: @model.fromType
      to: toGroup || @model.to
      toType: @model.toType
    }

    if @svg 
      @renderCurve(drawModel);
      @renderTriangle();
    @

  getNodePosition: (model, type) ->
    x = model.get('x')
    y = model.get('y')

    width = model.get('width')
    height = model.get('height')

    switch type
      when 'left' then o1 = {left: x, top: y + height/2}
      when 'right' then o1 = {left: x + width, top: y + height/2}
      when 'up' then o1 = {left: x + width/2, top: y}
      when 'down' then o1 = {left: x + width/2, top: y + height}
    diff = 3
    o1.top += diff
    o1.left += diff
    return o1

  renderTriangle: ()->
    return;
    len = @curve.getTotalLength()
    obj = @curve.getPointAtLength(len-13)
    @triangle.attr
      path: ["M", 0, 0, "L", 1.732, -1, "L", 1.732, 1].join(',')
    .transform('t' + obj.x + ',' + obj.y + 's5, 5' + 'r' + obj.alpha)

  renderCurve: (drawModel) ->
    f1 = @getNodePosition(drawModel.from, drawModel.fromType)
    f2 = @getNodePosition(drawModel.to, drawModel.toType)

    offset = $("#container-wrapper").offset()
    ofx = $("#container-wrapper").scrollLeft() - offset.left
    ofy = $("#container-wrapper").scrollTop() - offset.top

    x1 = f1.left
    y1 = f1.top
    x4 = f2.left
    y4 = f2.top

    min_diff = 42
    diffx = Math.max(min_diff, x4 - x1)
    diffy = Math.max(min_diff, y4 - y1)
    x2 = x1 + diffx * 0.5
    y2 = y1
    x3 = x4 - diffx * 0.5
    y3 = y4
    @curve.attr
      path: ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",")

module.exports = ConnectionView
