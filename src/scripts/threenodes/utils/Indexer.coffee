# Frida todo: why cannot be singleton?

_instance = null

class Indexer
  constructor: () ->
    @uid = 0

  getUID: () ->
    return @uid += 1
    
  reset: () ->
    @uid = 0


Indexer.getInstance = () ->
  if (!_instance)
    _instance = new Indexer();
  return _instance;

module.exports = Indexer