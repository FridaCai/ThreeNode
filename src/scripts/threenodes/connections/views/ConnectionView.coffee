_ = require 'Underscore'
Backbone = require 'Backbone'

require 'jquery.ui'

### Connection View ###
class ConnectionView extends Backbone.View
  initialize: (options) ->
    super
    @settings = options.settings
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
    @curve.remove()
    delete @curve
    
    @triangle.remove()
    delete @triangle

    return true

  render: () ->
    if @svg 
      @renderCurve();
      @renderTriangle();
    @

  getNodePosition: (model, type) ->
    x = model.get('x')
    y = model.get('y')
    width = 90 # why cannot obtain model.get('width')?
    height = 26 # why cannot obtain model.get('height')?

    switch type
      when 'left' then o1 = {left: x, top: y + height/2}
      when 'right' then o1 = {left: x + width, top: y + height/2}
      when 'up' then o1 = {left: x + width/2, top: y}
      when 'down' then o1 = {left: x + width/2, top: y + height}
    diff = 3
    o1.top += diff
    o1.left += diff
    return o1

  getFieldPosition_deprecated: (field) ->
    # if !field.button
    #   console.log "no button"
    #   console.log field
    #   return {left: 0, top: 0}
    # o1 = $(".inner-field span", field.button).offset()
    # #console.log field.button
    # if !o1
    #   console.log "no o1"
    #   return {left: 0, top: 0}
    diff = 3
    o1.top += diff
    o1.left += diff
    return o1

  renderTriangle: ()->
    if(!@settings.direction)
      return;
    len = @curve.getTotalLength()
    obj = @curve.getPointAtLength(len-13)
    @triangle.attr
      path: ["M", 0, 0, "L", 1.732, -1, "L", 1.732, 1].join(',')
    .transform('t' + obj.x + ',' + obj.y + 's5, 5' + 'r' + obj.alpha)

  renderCurve: () ->
    # f1 = @getFieldPosition(@model.from_field)
    # f2 = @getFieldPosition(@model.to_field)
    f1 = @getNodePosition(@model.options.from_node, @model.options.from_type)
    f2 = @getNodePosition(@model.options.to_node, @model.options.to_type)

    offset = $("#container-wrapper").offset()
    ofx = $("#container-wrapper").scrollLeft() - offset.left
    ofy = $("#container-wrapper").scrollTop() - offset.top

    # x1 = f1.left + ofx
    # y1 = f1.top + ofy
    # x4 = f2.left + ofx
    # y4 = f2.top + ofy
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
