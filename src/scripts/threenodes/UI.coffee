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
DB = require 'threenodes/db'

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
      linkerEl: jQuery("<div class='linkers-container'></div>").appendTo("#container")
      el: jQuery("<div class='nodes-container'></div>").appendTo("#container")
      settings: @core.settings






















  setWorkspaceFromDefinition: (clickNode) =>
    if clickNode == "global"
      @ui.breadcrumb.reset()
      core.refreshDatamodelAccordingToDB({
        nodes: db.nodes,
        connections: db.connections,
        groups: db.groups
      })

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
      @ui.menubar.on("GroupSelectedNodes", @createGroup)
      @ui.menubar.on("AutoLayout", @autoLayout)
      
      # Special events
      @url_handler.on("SetDisplayModeCommand", @ui.setDisplayMode)

      #breadcrumb
      @ui.breadcrumb.on("click", @setWorkspaceFromDefinition.bind(@))

      self= @
      $(document).on('view_group_detail', (e, group)->
        # self.createWorkspace() # accually, reset workspace.
        self.ui.breadcrumb.set([group])

        group = db.groups.find((g)->
          return g.id == group.get('id')
        )
        core.refreshDatamodelAccordingToDB({
          nodes: group.nodes,
          connections: db.connections,
          groups: []
        })
      )
    else
      # If the application is in test mode add a css class to the body
      $("body").addClass "test-mode"
    return this

  createGroup:()=>
    nodes = @getSelectedNodes()
    @workspace.clearView()
    @core.createGroup(nodes)

  autoLayout:()=>
    # datamodel => db
    db.updateProperty({
      nodes: core.nodes
      groups: core.groups
      connections: core.connections
      id: core.id
    })


    params = ['digraph {']

    db.groups.map((g)=>
      params.push('subgraph cluster' + g.id + '{')

      g.nodes.map((n)=>
        params.push(n.id + ';')
      )
      params.push('}');
    )

    if(db.groups.length !=0)
      db.nodes.map((n)=>
        params.push(n.id + ';')
      )

    db.connections.map((c)=>
      params.push(c.from + '->' + c.to + ';')
    )

    params.push('}');


    paramStr = params.join(' ')
    
    console.log('=========graphviz test params===========')
    console.log(paramStr)


    plain = Viz(paramStr, {format: 'plain'});
    console.log('=========graphviz test plain===========')
    console.log(plain)


    factor = 100
    plain.split('\n').map((line)->
      cells = line.split(' ')
      type = cells[0]
      if(type == 'node')
        id = parseInt(cells[1])
        
        x = parseFloat(cells[2]) * factor
        y = parseFloat(cells[3]) * factor
        target = db.findNodeInNodes(id) || db.findNodeInGroups(id) || db.findGroup(id)
        if(target)
          target.x = x
          target.y = y
    )

    core.refreshDatamodelAccordingToDB(db)

  getSelectedNodes: () ->
    selected_nodes = []
    $selected = $(".node.ui-selected").not(".node .node")
    $selected.each () ->
      node = $(this).data("object")
      selected_nodes.push(node)
    return selected_nodes


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
    db.reset()
    if @ui then @ui.clearWorkspace()

UI.nodes = {}
UI.UIView = UIView
UI.nodes.NodeView = NodeView
UI.nodes.Color = NodeViewColor
UI.nodes.WebGLRenderer = NodeViewWebgl
# UI.nodes.Group = NodeViewGroup

module.exports = UI
