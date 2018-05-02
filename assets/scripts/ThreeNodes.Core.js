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

	var Connection, Connections, Core, Group, Groups, Indexer, Node, Nodes;
	
	Nodes = __webpack_require__(1);
	
	Node = __webpack_require__(4);
	
	Connections = __webpack_require__(6);
	
	Connection = __webpack_require__(7);
	
	Groups = __webpack_require__(8);
	
	Group = __webpack_require__(9);
	
	Indexer = __webpack_require__(10);
	
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
	    this.nodes.bind('node:renderConnections', this.renderConnections.bind(this));
	    this.groups.bind('node:renderConnections', this.renderConnections.bind(this));
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
	  }
	
	  Core.prototype.createGroup = function() {
	    var group, nodes;
	    nodes = this.getSelectedNodes();
	    group = new Group({
	      nodes: nodes
	    });
	    this.groups.add(group);
	    this.nodes.remove(nodes);
	    return this.connections.render();
	  };
	
	  Core.prototype.getSelectedNodes = function() {
	    var $selected, selected_nodes;
	    selected_nodes = [];
	    $selected = $(".node.ui-selected").not(".node .node");
	    $selected.each(function() {
	      var node;
	      node = $(this).data("object");
	      return selected_nodes.push(node);
	    });
	    return selected_nodes;
	  };
	
	  Core.prototype.renderConnections = function(node) {
	    return this.connections.renderConnections(node);
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
	
	  Core.prototype.setNodes = function(json) {
	    var maxid, self;
	    self = this;
	    this.id = json.id;
	    maxid = json.id;
	    json.nodes.map(function(obj) {
	      var node, nodeClass;
	      maxid = obj.id > maxid ? obj.id : maxid;
	      nodeClass = Core.nodes.models[obj.type];
	      node = new nodeClass(obj);
	      return self.nodes.push(node);
	    });
	    json.groups.map(function(obj) {
	      var group, groupObj;
	      maxid = obj.id > maxid ? obj.id : maxid;
	      groupObj = {
	        id: obj.id,
	        x: obj.x,
	        y: obj.y,
	        width: obj.width,
	        height: obj.height,
	        nodes: []
	      };
	      obj.nodes.map(function(nodeObj) {
	        var node;
	        maxid = nodeObj.id > maxid ? nodeObj.id : maxid;
	        node = new Core.nodes.models[nodeObj.type](nodeObj);
	        return groupObj.nodes.push(node);
	      });
	      group = new Group(groupObj);
	      return self.groups.push(group);
	    });
	    json.connections.map(function(c) {
	      var connection;
	      maxid = c.id > maxid ? c.id : maxid;
	      connection = new Connection(c);
	      return self.connections.push(connection);
	    });
	    return indexer.set(maxid);
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
	    this.stopSound = bind(this.stopSound, this);
	    this.startSound = bind(this.startSound, this);
	    this.showNodesAnimation = bind(this.showNodesAnimation, this);
	    this.render = bind(this.render, this);
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
	
	  Nodes.prototype.render = function() {
	    var buildNodeArrays, evaluateSubGraph, id, invalidNodes, terminalNodes;
	    return;
	    invalidNodes = {};
	    terminalNodes = {};
	    buildNodeArrays = function(nodes) {
	      var i, len, node, results;
	      results = [];
	      for (i = 0, len = nodes.length; i < len; i++) {
	        node = nodes[i];
	        if (node.hasOutConnection() === false || node.auto_evaluate || node.delays_output) {
	          terminalNodes[node.attributes["id"] + "/" + node.attributes["gid"]] = node;
	        }
	        invalidNodes[node.attributes["id"] + "/" + node.attributes["gid"]] = node;
	        if (node.nodes) {
	          results.push(buildNodeArrays(node.nodes.models));
	        } else {
	          results.push(void 0);
	        }
	      }
	      return results;
	    };
	    buildNodeArrays(this.models);
	    evaluateSubGraph = function(node) {
	      var i, len, upnode, upstreamNodes;
	      upstreamNodes = node.getUpstreamNodes();
	      for (i = 0, len = upstreamNodes.length; i < len; i++) {
	        upnode = upstreamNodes[i];
	        if (invalidNodes[upnode.attributes["id"] + "/" + upnode.attributes["gid"]] && !upnode.delays_output) {
	          evaluateSubGraph(upnode);
	        }
	      }
	      if (node.dirty || node.auto_evaluate) {
	        node.compute();
	        node.dirty = false;
	        node.fields.setFieldInputUnchanged();
	      }
	      delete invalidNodes[node.attributes["id"] + "/" + node.attributes["gid"]];
	      return true;
	    };
	    for (id in terminalNodes) {
	      if (invalidNodes[id]) {
	        evaluateSubGraph(terminalNodes[id]);
	      }
	    }
	    return true;
	  };
	
	  Nodes.prototype.getById = function(id) {
	    return this.models.find(function(n) {
	      return n.get('id') === id;
	    });
	  };
	
	  Nodes.prototype.showNodesAnimation = function() {
	    return this.invoke("showNodeAnimation");
	  };
	
	  Nodes.prototype.startSound = function(time) {
	    return this.each(function(node) {
	      if (node.playSound instanceof Function) {
	        return node.playSound(time);
	      }
	    });
	  };
	
	  Nodes.prototype.stopSound = function() {
	    return this.each(function(node) {
	      if (node.stopSound instanceof Function) {
	        return node.stopSound();
	      }
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
	    var groupFrom, groupTo, id, nodeFrom, nodeTo;
	    id = obj.id || indexer.getUID();
	    this.set('id', id);
	    this.rawFromId = obj.from;
	    this.rawToId = obj.to;
	    groupFrom = core.groups.getByNodeId(obj.from);
	    nodeFrom = core.nodes.getById(obj.from);
	    this.from = nodeFrom || groupFrom;
	    groupTo = core.groups.getByNodeId(obj.to);
	    nodeTo = core.nodes.getById(obj.to);
	    this.to = nodeTo || groupTo;
	    this.fromType = obj.fromType;
	    return this.toType = obj.toType;
	  };
	
	  Connection.prototype.render = function() {
	    return this.trigger("render", this, this);
	  };
	
	  Connection.prototype.validate = function() {
	    return false;
	  };
	
	  Connection.prototype.toJSON = function() {
	    var res;
	    res = {
	      id: this.get("id"),
	      from: this.rawFromId,
	      fromType: this.fromType,
	      to: this.rawToId,
	      toType: this.toType
	    };
	    return res;
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
	    name: ""
	  };
	
	  Group.prototype.initialize = function(obj) {
	    var avgpos, id, x, y;
	    Group.__super__.initialize.apply(this, arguments);
	    id = obj.id || indexer.getUID();
	    this.set('name', obj.name || this.typename());
	    this.set('id', id);
	    this.set('nodes', obj.nodes);
	    avgpos = this.getNodesAveragePosition();
	    x = obj.x ? obj.x : avgpos.x;
	    y = obj.y ? obj.y : avgpos.y;
	    this.set('x', x);
	    return this.set('y', y);
	  };
	
	  Group.prototype.typename = function() {
	    return String(this.constructor.name);
	  };
	
	  Group.prototype.getNodesAveragePosition = function() {
	    var dx, dy, i, len, max_x, max_y, min_x, min_y, node, ref;
	    min_x = 0;
	    min_y = 0;
	    max_x = 0;
	    max_y = 0;
	    ref = this.get('nodes');
	    for (i = 0, len = ref.length; i < len; i++) {
	      node = ref[i];
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


/***/ })
/******/ ])
});
;
//# sourceMappingURL=ThreeNodes.Core.js.map