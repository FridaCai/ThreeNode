require 'jquery'
_ = require 'Underscore'
Backbone = require 'Backbone'
UIView = require './views/UIView'
Workspace = require './views/Workspace'
AppTimeline = require './views/AppTimeline'
UrlHandler = require 'threenodes/utils/UrlHandler'
FileHandler = require 'threenodes/utils/FileHandler'

NodeView = require 'threenodes/nodes/views/NodeView'
NodeViewColor = require 'threenodes/nodes/views/Color'
NodeViewWebgl = require 'threenodes/nodes/views/WebGLRenderer'

class UI
  constructor: (@core) ->
    # Fix backbone with webpack.
    Backbone.$ = $

    # Define renderer mouseX/Y for use in utils.Mouse node for instance
    ThreeNodes.renderer =
      mouseX: 0
      mouseY: 0

    #@webgl = new WebglBase()

    @url_handler = new UrlHandler()
    @file_handler = new FileHandler(@core)

    # File and url events
    @file_handler.on("ClearWorkspace", () => @clearWorkspace())
    @url_handler.on("ClearWorkspace", () => @clearWorkspace())
    @url_handler.on("LoadJSON", @file_handler.loadFromJsonData)

    # Initialize the user interface and timeline
    @initUI()
    @initTimeline()

    # Initialize the workspace view
    @createWorkspace()

    Backbone.history.start
      pushState: false

    return true

  createWorkspace: () =>
    if @workspace then @workspace.destroy()
    @workspace = new Workspace
      el: jQuery("<div class='nodes-container'></div>").appendTo("#container")
      settings: @core.settings























  setWorkspaceFromDefinition: (definition) =>
    @createWorkspace()

    # always remove current edit node if it exists
    if @edit_node
      console.log "remove edit node"
      @edit_node.remove()
      delete @edit_node
      # maybe sync new modifications...

    if definition == "global"
      @workspace.render(@core.nodes)
      @ui.breadcrumb.reset()
    else
      # create a hidden temporary group node from this definition
      # @edit_node = @core.nodes.createGroup
      #   type: "Group"
      #   definition: definition
      #   x: -9999
      # @workspace.render(@edit_node.nodes)
      # @ui.breadcrumb.set([definition])














  initUI: () =>
    if @core.settings.test == false
      # Create the main user interface view
      @ui = new UIView
        el: $("body")
        settings: @core.settings

      # Link UI to render events
      @ui.on("render", @core.nodes.render)
      @ui.on("renderConnections", @core.nodes.renderAllConnections)

      # Setup the main menu events
      @ui.menubar.on("RemoveSelectedNodes", @core.nodes.removeSelectedNodes)
      @ui.menubar.on("ClearWorkspace", @clearWorkspace)
      @ui.menubar.on("SaveFile", @file_handler.saveLocalFile)
      @ui.menubar.on("ExportCode", @file_handler.exportCode)
      @ui.menubar.on("LoadJSON", @file_handler.loadFromJsonData)
      @ui.menubar.on("LoadFile", @file_handler.loadLocalFile)
      @ui.menubar.on("GroupSelectedNodes", @core.createGroup.bind(@core))

      # Special events
      @url_handler.on("SetDisplayModeCommand", @ui.setDisplayMode)

      #breadcrumb
      @ui.breadcrumb.on("click", @setWorkspaceFromDefinition)

      self= @
      $(document).on('view_group_detail', (e, group)->
        self.createWorkspace() # accually, reset workspace.
        self.ui.breadcrumb.set(group)

        nodes = group.get('nodes');
        nodes.map((n)->
          self.workspace.renderNode(n)
        )
        core.connections.map((c)=>
          groupFrom = groups.getGroupByNodeId(c.rawFromId)
          groupTo = groups.getGroupByNodeId(c.rawToId)
          if groupFrom && groupTo && groupFrom == groupTo 
            self.workspace.renderConnection(c)
        )
      )















    else
      # If the application is in test mode add a css class to the body
      $("body").addClass "test-mode"
    return this

  setDisplayMode: (is_player = false) =>
    if @ui then @ui.setDisplayMode(is_player)

  initTimeline: () =>
    # Remove old timeline DOM elements
    $("#timeline-container, #keyEditDialog").remove()

    # Cleanup the old timeline if there was one
    if @timelineView
      @core.nodes.off("remove", @timelineView.onNodeRemove)
      @timelineView.remove()
      if @ui
        @timelineView.off("TimelineCreated", @ui.onUiWindowResize)

    # Create a new timeline
    @timelineView = new AppTimeline
      el: $("#timeline")
      ui: @ui

    # Bind events to it
    # @core.nodes.bindTimelineEvents(@timelineView)
    @core.nodes.on("remove", @timelineView.onNodeRemove)
    if @ui then @ui.onUiWindowResize()

    return this

  clearWorkspace: () =>
    @core.nodes.removeAll()
    @core.connections.removeAll()
    @core.groups.removeAll()
    indexer.reset()
    if @ui then @ui.clearWorkspace()

UI.nodes = {}
UI.UIView = UIView
UI.nodes.NodeView = NodeView
UI.nodes.Color = NodeViewColor
UI.nodes.WebGLRenderer = NodeViewWebgl
# UI.nodes.Group = NodeViewGroup

module.exports = UI
