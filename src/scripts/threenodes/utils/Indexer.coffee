# id generator.

_instance = null

class Indexer
  constructor: () ->
    @uid = -1

  getUID: () ->
    return @uid += 1
    
  reset: () ->
    @uid = -1

  # when load, need to set id according to external file
  set: (value)->
    @uid = value


Indexer.getInstance = () ->
  if (!_instance)
    _instance = new Indexer();
  return _instance;

module.exports = Indexer

# Frida. find better solutions. indexer will be included into several packages. so there will be multiple indexer instance with diff uid.
window.indexer = Indexer.getInstance()