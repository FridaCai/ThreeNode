_ = require 'Underscore'
Backbone = require 'Backbone'
Utils = require 'threenodes/utils/Utils'
CodeExporter = require 'threenodes/utils/CodeExporter'


require 'Blob'
require 'FileSaver'
#require 'libs/json2'

class FileHandler extends Backbone.Events
  constructor: (@core) ->
    _.extend(FileHandler::, Backbone.Events)

  saveLocalFile: () =>
    result_string = @core.dump()
    blob = new Blob([result_string], {"text/plain;charset=utf-8"})
    fileSaver = saveAs(blob, "nodes.json")

  loadFromJsonData: (txt) =>
    loaded_data = JSON.parse(txt)
    @core.setNodes(loaded_data)

  loadLocalFile: (e) =>
    # Clear the workspace first
    @trigger("ClearWorkspace")

    # Load the file
    file = e.target.files[0]
    reader = new FileReader()
    self = this
    reader.onload = (e) ->
      txt = e.target.result
      # Call loadFromJsonData when the file is loaded
      self.loadFromJsonData(txt)
    reader.readAsText(file, "UTF-8")

module.exports = FileHandler
