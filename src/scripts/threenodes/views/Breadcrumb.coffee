#"use strict"
_ = require 'Underscore'
Backbone = require 'Backbone'

class Breadcrumb extends Backbone.View
  initialize: () ->
    super
    @$el.click(@onClick)

  reset: () =>
    @items = []
    @$el.html("")

  set: (items) =>
    # items is an ordered array of groups
    @items = items
    @$el.html("<a href='#' data-id='global'>Global</a>")
    for item in items
      name = item.get("name")
      id = item.get("id")
      @$el.append(" ▶ " + "<a href='#' class='grp' data-id='#{id}'>#{name}</a>")

  onClick: (e) =>
    id = $(e.target).data("id")
    if id == "global"
      @trigger("click", "global")

module.exports = Breadcrumb
