(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("_"), require("Backbone"));
	else if(typeof define === 'function' && define.amd)
		define(["_", "Backbone"], factory);
	else if(typeof exports === 'object')
		exports["Core"] = factory(require("_"), require("Backbone"));
	else
		root["ThreeNodes"] = root["ThreeNodes"] || {}, root["ThreeNodes"]["Core"] = factory(root["_"], root["Backbone"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "assets/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	var Connection, Connections, Core, DB, Group, Groups, Indexer, Node, Nodes,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
	
	Nodes = __webpack_require__(1);
	
	Node = __webpack_require__(4);
	
	Connections = __webpack_require__(6);
	
	Connection = __webpack_require__(7);
	
	Groups = __webpack_require__(8);
	
	Group = __webpack_require__(9);
	
	Indexer = __webpack_require__(10);
	
	DB = __webpack_require__(11);
	
	Core = (function() {
	  Core.fields = {
	    models: {},
	    views: {}
	  };
	
	  Core.nodes = {
	    models: {},
	    views: {}
	  };
	
	  Core.groups = {
	    models: {},
	    views: {}
	  };
	
	  function Core(options) {
	    this.dump = bind(this.dump, this);
	    var settings;
	    this.id = indexer.getUID();
	    settings = {
	      test: false,
	      player_mode: false,
	      direction: true
	    };
	    this.settings = $.extend({}, settings, options);
	    this.groups = new Groups([]);
	    this.nodes = new Nodes([], {
	      settings: this.settings
	    });
	    this.connections = new Connections();
	    this.head = null;
	    this.nodes.bind('node:renderConnections', this.renderConnectionsByNode.bind(this));
	    this.groups.bind('node:renderConnections', this.renderConnectionsByGroup.bind(this));
	    this.nodes.bind("connections:removed", (function(_this) {
	      return function(n) {
	        return _this.connections.removeByNode(n);
	      };
	    })(this));
	    this.groups.bind("connections:removed", (function(_this) {
	      return function(g) {
	        return _this.connections.removeByGroup(g);
	      };
	    })(this));
	    this.nodes.bind("connection:create", (function(_this) {
	      return function(op) {
	        return _this.connections.create(op);
	      };
	    })(this));
	    this.groups.bind("connection:create", (function(_this) {
	      return function(op) {
	        return _this.connections.create(op);
	      };
	    })(this));
	  }
	
	  Core.prototype.createGroup = function(nodes) {
	    var db, index;
	    db = DB.getInstance();
	    index = Indexer.getInstance().getUID();
	    db.createGroup(nodes, index);
	    return this.refreshDatamodelAccordingToDB(db);
	  };
	
	  Core.prototype.renderConnectionsByNode = function(node) {
	    return this.connections.renderConnections(node);
	  };
	
	  Core.prototype.renderConnectionsByGroup = function(group) {
	    group.get('nodes').map(function(n) {
	      return this.connections.renderConnections(n);
	    }, this);
	    return this.connections.renderConnections(group);
	  };
	
	  Core.addFieldType = function(fieldName, field) {
	    Core.fields.models[fieldName] = field;
	    return true;
	  };
	
	  Core.addFieldView = function(fieldName, fieldView) {
	    Core.fields.views[fieldName] = fieldView;
	    return true;
	  };
	
	  Core.addNodeType = function(nodeName, nodeType) {
	    Core.nodes.models[nodeName] = nodeType;
	    return true;
	  };
	
	  Core.addNodeView = function(viewName, nodeView) {
	    Core.nodes.views[viewName] = nodeView;
	    return true;
	  };
	
	  Core.prototype.dump = function() {
	    var db, res;
	    db = DB.getInstance();
	    db.updateProperty({
	      nodes: this.nodes,
	      groups: this.groups,
	      connections: this.connections
	    });
	    res = db.dump();
	    return JSON.stringify(res, null, 2);
	  };
	
	  Core.prototype.setNodes = function(json) {
	    var db, dbInstance, maxid, tmparr;
	    dbInstance = DB.getInstance();
	    dbInstance.loadFromJson(json);
	    db = dbInstance.dump();
	    tmparr = db.nodes.concat(db.connections);
	    db.groups.map(function(obj) {
	      return obj.nodes.map(function(nodeObj) {
	        return tmparr.push(nodeObj);
	      });
	    });
	    maxid = tmparr.reduce(function(a, b) {
	      return (a.id > b.id ? a.id : b.id);
	    });
	    indexer.set(maxid);
	    return this.refreshDatamodelAccordingToDB(db);
	  };
	
	  Core.prototype.refreshDatamodelAccordingToDB = function(db) {
	    var self;
	    this.groups.removeAll();
	    this.nodes.removeAll();
	    this.connections.removeAll();
	    self = this;
	    db.nodes.map(function(obj) {
	      var node, nodeClass;
	      nodeClass = Core.nodes.models[obj.type];
	      node = new nodeClass(obj);
	      return self.nodes.push(node);
	    });
	    db.groups.map(function(obj) {
	      var group, groupObj;
	      groupObj = {
	        id: obj.id,
	        x: obj.x,
	        y: obj.y,
	        width: obj.width,
	        height: obj.height,
	        nodes: obj.nodes
	      };
	      group = new Group(groupObj);
	      return self.groups.push(group);
	    });
	    return db.connections.map(function(c) {
	      var connection, from, to;
	      from = {
	        node: self.nodes.getById(c.from),
	        group: self.groups.getById(c.from),
	        nodeInGroup: self.groups.getByNodeId(c.from)
	      };
	      to = {
	        node: self.nodes.getById(c.to),
	        group: self.groups.getById(c.to),
	        nodeInGroup: self.groups.getByNodeId(c.to)
	      };
	      if (from.nodeInGroup && to.nodeInGroup && from.nodeInGroup === to.nodeInGroup) {
	
	      } else {
	        connection = new Connection({
	          id: c.id,
	          from: from.node || from.group || from.nodeInGroup,
	          to: to.node || to.group || to.nodeInGroup,
	          fromType: c.fromType,
	          toType: c.toType
	        });
	        return self.connections.push(connection);
	      }
	    });
	  };
	
	  return Core;
	
	})();
	
	module.exports = Core;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var Backbone, Nodes, _,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(2);
	
	Backbone = __webpack_require__(3);
	
	Nodes = (function(superClass) {
	  extend(Nodes, superClass);
	
	  function Nodes() {
	    this.createNode = bind(this.createNode, this);
	    this.find = bind(this.find, this);
	    this.destroy = bind(this.destroy, this);
	    this.initialize = bind(this.initialize, this);
	    return Nodes.__super__.constructor.apply(this, arguments);
	  }
	
	  Nodes.prototype.initialize = function(models, options) {
	    var self;
	    self = this;
	    return this.bind("node:removed", (function(_this) {
	      return function(node) {
	        _this.remove(node);
	        return _this.trigger("connections:removed", node);
	      };
	    })(this));
	  };
	
	  Nodes.prototype.destroy = function() {
	    return this.removeAll();
	  };
	
	  Nodes.prototype.find = function(node_name) {
	    return this.where({
	      name: node_name
	    });
	  };
	
	  Nodes.prototype.createNode = function(options) {
	    var n;
	    if ($.type(options) === "string") {
	      options = {
	        type: options
	      };
	    }
	    options.timeline = this.timeline;
	    options.settings = this.settings;
	    options.parent = this.parent;
	    if (!ThreeNodes.Core.nodes.models[options.type]) {
	      console.error("Node type doesn't exists: " + options.type);
	      return false;
	    }
	    n = new ThreeNodes.Core.nodes.models[options.type](options);
	    this.add(n);
	    return n;
	  };
	
	  Nodes.prototype.getById = function(id) {
	    return this.models.find(function(n) {
	      return n.get('id') === id;
	    });
	  };
	
	  Nodes.prototype.removeSelectedNodes = function() {
	    var i, len, node, ref, results;
	    ref = $(".node.ui-selected");
	    results = [];
	    for (i = 0, len = ref.length; i < len; i++) {
	      node = ref[i];
	      results.push($(node).data("object").remove());
	    }
	    return results;
	  };
	
	  Nodes.prototype.removeAll = function() {
	    return this.remove(this.models);
	  };
	
	  return Nodes;
	
	})(Backbone.Collection);
	
	module.exports = Nodes;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	var Backbone, Node, Utils, _,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(2);
	
	Backbone = __webpack_require__(3);
	
	Utils = __webpack_require__(5);
	
	Node = (function(superClass) {
	  extend(Node, superClass);
	
	  function Node() {
	    this.remove = bind(this.remove, this);
	    this.toJSON = bind(this.toJSON, this);
	    this.typename = bind(this.typename, this);
	    this.initialize = bind(this.initialize, this);
	    return Node.__super__.constructor.apply(this, arguments);
	  }
	
	  Node.prototype.defaults = {
	    x: 0,
	    y: 0,
	    width: 90,
	    height: 26,
	    name: ""
	  };
	
	  Node.prototype.initialize = function(obj) {
	    var id, name;
	    Node.__super__.initialize.apply(this, arguments);
	    id = obj.id || indexer.getUID();
	    this.set('id', id);
	    name = obj.name || this.typename();
	    this.set('name', name);
	    this.set('x', obj.x);
	    this.set('y', obj.y);
	    this.set('width', obj.width);
	    this.set('height', obj.height);
	    return this;
	  };
	
	  Node.prototype.typename = function() {
	    return String(this.constructor.name);
	  };
	
	  Node.prototype.toJSON = function() {
	    var res;
	    res = {
	      id: this.get('id'),
	      type: this.typename(),
	      x: this.get('x'),
	      y: this.get('y'),
	      width: this.get('width'),
	      height: this.get('height')
	    };
	    return res;
	  };
	
	  Node.prototype.remove = function() {
	    return this.trigger("node:removed", this);
	  };
	
	  return Node;
	
	})(Backbone.Model);
	
	module.exports = Node;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

	var Utils;
	
	Utils = (function() {
	  function Utils() {}
	
	  Utils.flatArraysAreEquals = function(arr1, arr2) {
	    var i, j, k, len;
	    if (arr1.length !== arr2.length) {
	      return false;
	    }
	    for (i = j = 0, len = arr1.length; j < len; i = ++j) {
	      k = arr1[i];
	      if (arr1[i] !== arr2[i]) {
	        return false;
	      }
	    }
	    return true;
	  };
	
	  return Utils;
	
	})();
	
	module.exports = Utils;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	var Backbone, Connection, Connections,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	Backbone = __webpack_require__(3);
	
	Connection = __webpack_require__(7);
	
	Connections = (function(superClass) {
	  extend(Connections, superClass);
	
	  function Connections() {
	    this.removeAll = bind(this.removeAll, this);
	    this.renderConnections = bind(this.renderConnections, this);
	    this.render = bind(this.render, this);
	    this.removeByNode = bind(this.removeByNode, this);
	    this.removeByGroup = bind(this.removeByGroup, this);
	    this.create = bind(this.create, this);
	    this.initialize = bind(this.initialize, this);
	    return Connections.__super__.constructor.apply(this, arguments);
	  }
	
	  Connections.prototype.model = Connection;
	
	  Connections.prototype.initialize = function(models, options) {
	    this.bind("connection:removed", (function(_this) {
	      return function(c) {
	        return _this.remove(c);
	      };
	    })(this));
	    return Connections.__super__.initialize.apply(this, arguments);
	  };
	
	  Connections.prototype.create = function(op) {
	    return this.add(new Connection({
	      from: op.from,
	      to: op.to,
	      fromType: op.fromType,
	      toType: op.toType
	    }));
	  };
	
	  Connections.prototype.removeByGroup = function(g) {
	    var ids, todelete;
	    ids = [g.id];
	    g.get('nodes').map(function(n) {
	      return ids.push(n.id);
	    });
	    todelete = this.models.filter((function(_this) {
	      return function(c) {
	        if (ids.includes(c.rawFromId) || ids.includes(c.rawToId)) {
	          return true;
	        }
	        return false;
	      };
	    })(this));
	    return todelete.map(function(g) {
	      return this.remove(g);
	    }, this);
	  };
	
	  Connections.prototype.removeByNode = function(n) {
	    return this.models.map(function(c) {
	      if (c.from.id === n.id || c.to.id === n.id) {
	        return this.remove(c);
	      }
	    }, this);
	  };
	
	  Connections.prototype.render = function() {
	    return this.each(function(c) {
	      return c.render();
	    });
	  };
	
	  Connections.prototype.renderConnections = function(node) {
	    return this.each(function(c) {
	      if (c.to === node || c.from === node) {
	        return c.render();
	      }
	    });
	  };
	
	  Connections.prototype.removeAll = function() {
	    return this.remove(this.models);
	  };
	
	  return Connections;
	
	})(Backbone.Collection);
	
	module.exports = Connections;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	var Backbone, Connection,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	Backbone = __webpack_require__(3);
	
	Connection = (function(superClass) {
	  extend(Connection, superClass);
	
	  function Connection() {
	    this.validate = bind(this.validate, this);
	    this.render = bind(this.render, this);
	    this.initialize = bind(this.initialize, this);
	    return Connection.__super__.constructor.apply(this, arguments);
	  }
	
	  Connection.prototype.initialize = function(obj) {
	    this.id = obj.id || indexer.getUID();
	    this.from = obj.from;
	    this.to = obj.to;
	    this.fromType = obj.fromType;
	    return this.toType = obj.toType;
	  };
	
	  Connection.prototype.render = function() {
	    return this.trigger("render", this, this);
	  };
	
	  Connection.prototype.validate = function() {
	    return false;
	  };
	
	  return Connection;
	
	})(Backbone.Model);
	
	module.exports = Connection;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	var Backbone, Group, Groups, _,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(2);
	
	Backbone = __webpack_require__(3);
	
	Group = __webpack_require__(9);
	
	Groups = (function(superClass) {
	  extend(Groups, superClass);
	
	  function Groups() {
	    this.initialize = bind(this.initialize, this);
	    return Groups.__super__.constructor.apply(this, arguments);
	  }
	
	  Groups.prototype.initialize = function(models, options) {
	    return this.bind("group:removed", (function(_this) {
	      return function(group) {
	        _this.remove(group);
	        return _this.trigger("connections:removed", group);
	      };
	    })(this));
	  };
	
	  Groups.prototype.getById = function(id) {
	    return this.models.find(function(g) {
	      return g.get('id') === id;
	    });
	  };
	
	  Groups.prototype.getByNodeId = function(id) {
	    return this.models.find(function(g) {
	      var nodes;
	      nodes = g.get('nodes');
	      return nodes.find(function(n) {
	        return n.id === id;
	      });
	    });
	  };
	
	  Groups.prototype.removeAll = function() {
	    return this.remove(this.models);
	  };
	
	  return Groups;
	
	})(Backbone.Collection);
	
	module.exports = Groups;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	var Backbone, Group, Node, _,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(2);
	
	Backbone = __webpack_require__(3);
	
	Node = __webpack_require__(4);
	
	Group = (function(superClass) {
	  extend(Group, superClass);
	
	  function Group() {
	    this.remove = bind(this.remove, this);
	    this.typename = bind(this.typename, this);
	    this.initialize = bind(this.initialize, this);
	    return Group.__super__.constructor.apply(this, arguments);
	  }
	
	  Group.prototype.defaults = {
	    width: 90,
	    height: 26,
	    x: 0,
	    y: 0,
	    name: "Hello Group"
	  };
	
	  Group.prototype.initialize = function(obj) {
	    var id;
	    Group.__super__.initialize.apply(this, arguments);
	    id = obj.id || indexer.getUID();
	    this.set('name', obj.name || this.typename());
	    this.set('id', id);
	    this.set('nodes', obj.nodes);
	    this.set('x', obj.x);
	    return this.set('y', obj.y);
	  };
	
	  Group.prototype.typename = function() {
	    return String(this.constructor.name);
	  };
	
	  Group.prototype.remove = function() {
	    return this.trigger("group:removed", this);
	  };
	
	  return Group;
	
	})(Backbone.Model);
	
	module.exports = Group;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

	var Indexer, _instance;
	
	_instance = null;
	
	Indexer = (function() {
	  function Indexer() {
	    this.uid = -1;
	  }
	
	  Indexer.prototype.getUID = function() {
	    return this.uid += 1;
	  };
	
	  Indexer.prototype.reset = function() {
	    return this.uid = -1;
	  };
	
	  Indexer.prototype.set = function(value) {
	    return this.uid = value;
	  };
	
	  return Indexer;
	
	})();
	
	Indexer.getInstance = function() {
	  if (!_instance) {
	    _instance = new Indexer();
	  }
	  return _instance;
	};
	
	module.exports = Indexer;
	
	window.indexer = Indexer.getInstance();


/***/ }),
/* 11 */
/***/ (function(module, exports) {

	var DB, db,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
	
	db = null;
	
	DB = (function() {
	  function DB() {
	    this.dump = bind(this.dump, this);
	    this.createGroup = bind(this.createGroup, this);
	    this.updateProperty = bind(this.updateProperty, this);
	    this.loadFromJson = bind(this.loadFromJson, this);
	    this.reset = bind(this.reset, this);
	  }
	
	  DB.prototype.reset = function() {
	    this.nodes = [];
	    this.connections = [];
	    this.groups = [];
	    return this.id = null;
	  };
	
	  DB.prototype.loadFromJson = function(json) {
	    this.reset();
	    this.id = json.id;
	    this.nodes = json.nodes;
	    this.groups = json.groups;
	    return this.connections = json.connections;
	  };
	
	  DB.prototype.updateProperty = function(param) {
	    param.groups.map((function(_this) {
	      return function(gParam) {
	        var g;
	        g = _this.groups.find(function(_g) {
	          return _g.id === gParam.get('id');
	        });
	        g.x = gParam.get('x');
	        g.y = gParam.get('y');
	        g.width = gParam.get('width');
	        return g.height = gParam.get('height');
	      };
	    })(this), this);
	    return param.nodes.map((function(_this) {
	      return function(nParam) {
	        var n;
	        n = _this.nodes.find(function(_n) {
	          return _n.id === nParam.id;
	        });
	        n.x = nParam.get('x');
	        n.y = nParam.get('y');
	        n.width = nParam.get('width');
	        return n.height = nParam.get('height');
	      };
	    })(this), this);
	  };
	
	  DB.prototype.calculatePos = function(nodes) {
	    var dx, dy, i, len, max_x, max_y, min_x, min_y, node;
	    min_x = 0;
	    min_y = 0;
	    max_x = 0;
	    max_y = 0;
	    for (i = 0, len = nodes.length; i < len; i++) {
	      node = nodes[i];
	      min_x = Math.min(min_x, node.get("x"));
	      max_x = Math.max(max_x, node.get("x"));
	      min_y = Math.min(min_y, node.get("y"));
	      max_y = Math.max(max_y, node.get("y"));
	    }
	    dx = (min_x + max_x) / 2;
	    dy = (min_y + max_y) / 2;
	    return {
	      x: dx,
	      y: dy
	    };
	  };
	
	  DB.prototype.createGroup = function(nodes, index) {
	    var nodesObj, pos;
	    pos = this.calculatePos(nodes);
	    nodesObj = nodes.map((function(_this) {
	      return function(n) {
	        return n.toJSON();
	      };
	    })(this));
	    this.groups.push({
	      id: index,
	      x: pos.x,
	      y: pos.y,
	      width: 90,
	      height: 26,
	      nodes: nodesObj
	    });
	    return this.nodes = this.nodes.filter(function(n) {
	      var nodeIds;
	      nodeIds = nodes.map(function(_n) {
	        return _n.id;
	      });
	      return !nodeIds.includes(n.id);
	    }, this);
	  };
	
	  DB.prototype.dump = function() {
	    return {
	      id: this.id,
	      nodes: this.nodes,
	      groups: this.groups,
	      connections: this.connections
	    };
	  };
	
	  DB.getInstance = function() {
	    if (!db) {
	      db = new DB();
	    }
	    return db;
	  };
	
	  return DB;
	
	})();
	
	module.exports = DB;


/***/ })
/******/ ])
});
;
//# sourceMappingURL=ThreeNodes.Core.js.map