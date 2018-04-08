(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("_"), require("Backbone"));
	else if(typeof define === 'function' && define.amd)
		define(["_", "Backbone"], factory);
	else if(typeof exports === 'object')
		exports["Core"] = factory(require("_"), require("Backbone"));
	else
		root["ThreeNodes"] = root["ThreeNodes"] || {}, root["ThreeNodes"]["Core"] = factory(root["_"], root["Backbone"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__) {
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
	
	Indexer = __webpack_require__(1);
	
	Nodes = __webpack_require__(2);
	
	Node = __webpack_require__(7);
	
	Connections = __webpack_require__(5);
	
	Connection = __webpack_require__(6);
	
	Groups = __webpack_require__(9);
	
	Group = __webpack_require__(10);
	
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
	    var indexer, settings;
	    settings = {
	      test: false,
	      player_mode: false,
	      direction: true
	    };
	    this.settings = $.extend({}, settings, options);
	    indexer = new Indexer();
	    this.groups = new Groups([], {
	      indexer: indexer
	    });
	    this.nodes = new Nodes([], {
	      settings: this.settings,
	      indexer: indexer
	    });
	    this.connections = new Connections();
	  }
	
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
	
	  Core.prototype.getGroupByNode = function(id) {
	    var group, i, len, ref;
	    ref = this.db.groups;
	    for (i = 0, len = ref.length; i < len; i++) {
	      group = ref[i];
	      if (group.nodes.includes(id)) {
	        return group;
	      }
	    }
	  };
	
	  Core.prototype.getNodeById = function(id) {
	    var i, len, node, ref;
	    ref = this.db.nodes;
	    for (i = 0, len = ref.length; i < len; i++) {
	      node = ref[i];
	      if (node.id === id) {
	        return node;
	      }
	    }
	  };
	
	  Core.prototype.setNodes = function(json_object) {
	    var self;
	    this.nodes.removeAll();
	    this.db = json_object;
	    self = this;
	    this.db.nodes.map(function(obj) {
	      var node;
	      if (!self.getGroupByNode(obj.id, self.db.groups)) {
	        node = new Node(obj);
	        return self.nodes.push(node);
	      }
	    });
	    this.db.groups.map(function(obj) {
	      var group, groupObj;
	      groupObj = {
	        id: obj.id,
	        x: obj.x,
	        y: obj.y,
	        width: obj.width,
	        height: obj.height,
	        nodes: []
	      };
	      obj.nodes.map(function(nodeId) {
	        var node;
	        node = self.nodes.getNodeById(nodeId);
	        return groupObj.nodes.push(node);
	      });
	      group = new Group(groupObj);
	      return self.groups.push(group);
	    });
	    return;
	    return this.db.connections.map(function(c) {
	      var connection, fromGroup, fromGroupObj, fromNode, fromNodeId, fromNodeObj, obj, toGroup, toGroupObj, toNode, toNodeId, toNodeObj;
	      fromNodeId = c.from;
	      fromNodeObj = self.getNodeById(fromNodeId);
	      fromNode = new Node(fromNodeObj);
	      fromGroupObj = self.getGroupByNode(fromNodeId, self.db.groups);
	      if (fromGroupObj) {
	        fromGroup = new Group(fromGroupObj);
	      }
	      toNodeId = c.to;
	      toNodeObj = self.getNodeById(toNodeId);
	      toNode = new Node(toNodeObj);
	      toGroupObj = self.getGroupByNode(toNodeId, self.db.groups);
	      if (toGroupObj) {
	        toGroup = new Group(toGroupObj);
	      }
	      obj = {
	        id: c.id,
	        fromType: c.fromType,
	        toType: c.toType
	      };
	      if (fromGroup && toGroup && fromGroup.id === toGroup.id) {
	
	      } else {
	        obj.from = fromGroup || fromNode;
	        obj.to = toGroup || toNode;
	        connection = new Connection(obj);
	        return self.connections.push(connection);
	      }
	    });
	  };
	
	  return Core;
	
	})();
	
	module.exports = Core;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	var Indexer, _instance;
	
	_instance = null;
	
	Indexer = (function() {
	  function Indexer() {
	    this.uid = 0;
	  }
	
	  Indexer.prototype.getUID = function() {
	    return this.uid += 1;
	  };
	
	  Indexer.prototype.reset = function() {
	    return this.uid = 0;
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


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var Backbone, Connections, Indexer, Nodes, _,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(3);
	
	Backbone = __webpack_require__(4);
	
	Indexer = __webpack_require__(1);
	
	Connections = __webpack_require__(5);
	
	Nodes = (function(superClass) {
	  extend(Nodes, superClass);
	
	  function Nodes() {
	    this.stopSound = bind(this.stopSound, this);
	    this.startSound = bind(this.startSound, this);
	    this.showNodesAnimation = bind(this.showNodesAnimation, this);
	    this.renderAllConnections = bind(this.renderAllConnections, this);
	    this.removeGroupsByDefinition = bind(this.removeGroupsByDefinition, this);
	    this.render = bind(this.render, this);
	    this.createNode = bind(this.createNode, this);
	    this.find = bind(this.find, this);
	    this.destroy = bind(this.destroy, this);
	    this.clearWorkspace = bind(this.clearWorkspace, this);
	    this.initialize = bind(this.initialize, this);
	    return Nodes.__super__.constructor.apply(this, arguments);
	  }
	
	  Nodes.prototype.initialize = function(models, options) {
	    var self;
	    self = this;
	    this.indexer = new Indexer();
	    return this.connections = new Connections([], {
	      indexer: this.indexer
	    });
	  };
	
	  Nodes.prototype.clearWorkspace = function() {
	    this.removeConnections();
	    this.removeAll();
	    $("#webgl-window canvas").remove();
	    this.materials = [];
	    this.indexer.reset();
	    return this;
	  };
	
	  Nodes.prototype.destroy = function() {
	    this.removeConnections();
	    this.removeAll();
	    delete this.materials;
	    delete this.indexer;
	    return delete this.connections;
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
	    options.indexer = this.indexer;
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
	
	  Nodes.prototype.removeGroupsByDefinition = function(def) {
	    var _nodes;
	    _nodes = this.models.concat();
	    return _.each(_nodes, function(node) {
	      if (node.definition && node.definition.gid === def.gid) {
	        return node.remove();
	      }
	    });
	  };
	
	  Nodes.prototype.renderAllConnections = function() {
	    return this.connections.render();
	  };
	
	  Nodes.prototype.removeConnection = function(c) {
	    return this.connections.remove(c);
	  };
	
	  Nodes.prototype.getNodeById = function(id) {
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
	
	  Nodes.prototype.removeAll = function() {
	    var models;
	    $("#tab-attribute").html("");
	    models = this.models.concat();
	    _.invoke(models, "remove");
	    this.reset([]);
	    return true;
	  };
	
	  Nodes.prototype.removeConnections = function() {
	    return this.connections.removeAll();
	  };
	
	  return Nodes;
	
	})(Backbone.Collection);
	
	module.exports = Nodes;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	var Backbone, Connection, Connections,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	Backbone = __webpack_require__(4);
	
	Connection = __webpack_require__(6);
	
	Connections = (function(superClass) {
	  extend(Connections, superClass);
	
	  function Connections() {
	    this.removeAll = bind(this.removeAll, this);
	    this.renderConnections = bind(this.renderConnections, this);
	    this.render = bind(this.render, this);
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
	
	  Connections.prototype.render = function() {
	    return this.each(function(c) {
	      return c.render();
	    });
	  };
	
	  Connections.prototype.renderConnections = function(node) {
	    return this.each(function(c) {
	      if (c.options.to_node === node || c.options.from_node === node) {
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	var Backbone, Connection, Indexer,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	Backbone = __webpack_require__(4);
	
	Indexer = __webpack_require__(1);
	
	Connection = (function(superClass) {
	  extend(Connection, superClass);
	
	  function Connection() {
	    this.validate = bind(this.validate, this);
	    this.render = bind(this.render, this);
	    this.initialize = bind(this.initialize, this);
	    return Connection.__super__.constructor.apply(this, arguments);
	  }
	
	  Connection.prototype.initialize = function(obj) {
	    var id;
	    id = obj.id || Indexer.getInstance().getUID();
	    this.set('id', id);
	    this.from = obj.from;
	    this.fromType = obj.fromType;
	    this.to = obj.to;
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	var Backbone, Node, Utils, _,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(3);
	
	Backbone = __webpack_require__(4);
	
	Utils = __webpack_require__(8);
	
	Node = (function(superClass) {
	  extend(Node, superClass);
	
	  function Node() {
	    this.toJSON = bind(this.toJSON, this);
	    this.typename = bind(this.typename, this);
	    this.initialize = bind(this.initialize, this);
	    return Node.__super__.constructor.apply(this, arguments);
	  }
	
	  Node.prototype.defaults = {
	    id: -1,
	    x: 0,
	    y: 0,
	    width: 90,
	    height: 26,
	    name: ""
	  };
	
	  Node.prototype.initialize = function(obj) {
	    var id, name;
	    Node.__super__.initialize.apply(this, arguments);
	    id = obj.id || Index.getInstance().getUID();
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
	      name: this.get('name'),
	      type: this.typename(),
	      x: this.get('x'),
	      y: this.get('y'),
	      width: this.get('width'),
	      height: this.get('height')
	    };
	    return res;
	  };
	
	  return Node;
	
	})(Backbone.Model);
	
	module.exports = Node;


/***/ }),
/* 8 */
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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	var Backbone, Group, Groups, Indexer, _,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(3);
	
	Backbone = __webpack_require__(4);
	
	Indexer = __webpack_require__(1);
	
	Group = __webpack_require__(10);
	
	Groups = (function(superClass) {
	  extend(Groups, superClass);
	
	  function Groups() {
	    this.createGroup = bind(this.createGroup, this);
	    this.initialize = bind(this.initialize, this);
	    return Groups.__super__.constructor.apply(this, arguments);
	  }
	
	  Groups.prototype.initialize = function(models, options) {
	    return this.indexer = options.indexer;
	  };
	
	  Groups.prototype.createGroup = function() {
	    var n, nodes;
	    nodes = this.getSelectedNodes();
	    n = new Group({
	      nodes: nodes
	    }, {
	      indexer: this.indexer
	    });
	    return this.add(n);
	  };
	
	  Groups.prototype.getSelectedNodes = function() {
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
	
	  return Groups;
	
	})(Backbone.Collection);
	
	module.exports = Groups;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var Backbone, Group, _,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(3);
	
	Backbone = __webpack_require__(4);
	
	Group = (function(superClass) {
	  extend(Group, superClass);
	
	  function Group() {
	    this.typename = bind(this.typename, this);
	    this.initialize = bind(this.initialize, this);
	    return Group.__super__.constructor.apply(this, arguments);
	  }
	
	  Group.prototype.defaults = {
	    id: -1,
	    width: 90,
	    height: 26,
	    x: 0,
	    y: 0,
	    name: ""
	  };
	
	  Group.prototype.initialize = function(obj) {
	    Group.__super__.initialize.apply(this, arguments);
	    this.set('name', obj.name || this.typename());
	    this.set('id', obj.id || Indexer.getInstance().getUID());
	    this.set('x', obj.x);
	    return this.set('y', obj.y);
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
	
	  return Group;
	
	})(Backbone.Model);
	
	module.exports = Group;


/***/ })
/******/ ])
});
;
//# sourceMappingURL=ThreeNodes.Core.js.map