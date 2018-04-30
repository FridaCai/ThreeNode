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