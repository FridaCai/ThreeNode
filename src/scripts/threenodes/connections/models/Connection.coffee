Backbone = require 'Backbone'

# Node to Node; Group to Group; Node to Group
class Connection extends Backbone.Model
  initialize: (obj) =>
    @id = obj.id || indexer.getUID()
    @from = obj.from    
    @to = obj.to
    @fromType = obj.fromType;
    @toType = obj.toType;

  render: () =>
    @trigger("render", this, this)

  validate: () =>
    return false
  
module.exports = Connection