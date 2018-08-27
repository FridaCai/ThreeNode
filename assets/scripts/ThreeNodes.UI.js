(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("_"), require("Backbone"), require("jQuery"), require("Blob"), require("FileSaver"), require("Raphael"));
	else if(typeof define === 'function' && define.amd)
		define(["_", "Backbone", "jQuery", "Blob", "FileSaver", "Raphael"], factory);
	else if(typeof exports === 'object')
		exports["UI"] = factory(require("_"), require("Backbone"), require("jQuery"), require("Blob"), require("FileSaver"), require("Raphael"));
	else
		root["ThreeNodes"] = root["ThreeNodes"] || {}, root["ThreeNodes"]["UI"] = factory(root["_"], root["Backbone"], root["jQuery"], root["Blob"], root["FileSaver"], root["Raphael"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_18__, __WEBPACK_EXTERNAL_MODULE_81__, __WEBPACK_EXTERNAL_MODULE_82__, __WEBPACK_EXTERNAL_MODULE_101__) {
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

	var AppTimeline, Backbone, DB, FileHandler, NodeView, NodeViewColor, NodeViewWebgl, UI, UIView, UrlHandler, Workspace, _,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
	
	__webpack_require__(18);
	
	_ = __webpack_require__(2);
	
	Backbone = __webpack_require__(3);
	
	UIView = __webpack_require__(91);
	
	Workspace = __webpack_require__(104);
	
	AppTimeline = __webpack_require__(109);
	
	UrlHandler = __webpack_require__(110);
	
	FileHandler = __webpack_require__(111);
	
	NodeView = __webpack_require__(38);
	
	NodeViewColor = __webpack_require__(44);
	
	NodeViewWebgl = __webpack_require__(113);
	
	DB = __webpack_require__(11);
	
	UI = (function() {
	  function UI(core1) {
	    this.core = core1;
	    this.clearWorkspace = bind(this.clearWorkspace, this);
	    this.initTimeline = bind(this.initTimeline, this);
	    this.setDisplayMode = bind(this.setDisplayMode, this);
	    this.autoLayout = bind(this.autoLayout, this);
	    this.createGroup = bind(this.createGroup, this);
	    this.initUI = bind(this.initUI, this);
	    this.setWorkspaceFromDefinition = bind(this.setWorkspaceFromDefinition, this);
	    this.createWorkspace = bind(this.createWorkspace, this);
	    Backbone.$ = $;
	    ThreeNodes.renderer = {
	      mouseX: 0,
	      mouseY: 0
	    };
	    this.url_handler = new UrlHandler();
	    this.file_handler = new FileHandler(this.core);
	    this.file_handler.on("ClearWorkspace", (function(_this) {
	      return function() {
	        return _this.clearWorkspace();
	      };
	    })(this));
	    this.url_handler.on("ClearWorkspace", (function(_this) {
	      return function() {
	        return _this.clearWorkspace();
	      };
	    })(this));
	    this.url_handler.on("LoadJSON", this.file_handler.loadFromJsonData);
	    this.initUI();
	    this.initTimeline();
	    this.createWorkspace();
	    Backbone.history.start({
	      pushState: false
	    });
	    return true;
	  }
	
	  UI.prototype.createWorkspace = function() {
	    if (this.workspace) {
	      this.workspace.destroy();
	    }
	    return this.workspace = new Workspace({
	      el: jQuery("<div class='nodes-container'></div>").appendTo("#container"),
	      settings: this.core.settings
	    });
	  };
	
	  UI.prototype.setWorkspaceFromDefinition = function(clickNode) {
	    if (clickNode === "global") {
	      this.ui.breadcrumb.reset();
	      return core.refreshDatamodelAccordingToDB({
	        nodes: db.nodes,
	        connections: db.connections,
	        groups: db.groups
	      });
	    }
	  };
	
	  UI.prototype.initUI = function() {
	    var self;
	    if (this.core.settings.test === false) {
	      this.ui = new UIView({
	        el: $("body"),
	        settings: this.core.settings
	      });
	      this.ui.on("render", this.core.nodes.render);
	      this.ui.on("renderConnections", this.core.nodes.renderAllConnections);
	      this.ui.menubar.on("RemoveSelectedNodes", this.core.nodes.removeSelectedNodes);
	      this.ui.menubar.on("ClearWorkspace", this.clearWorkspace);
	      this.ui.menubar.on("SaveFile", this.file_handler.saveLocalFile);
	      this.ui.menubar.on("ExportCode", this.file_handler.exportCode);
	      this.ui.menubar.on("LoadJSON", this.file_handler.loadFromJsonData);
	      this.ui.menubar.on("LoadFile", this.file_handler.loadLocalFile);
	      this.ui.menubar.on("GroupSelectedNodes", this.createGroup);
	      this.ui.menubar.on("AutoLayout", this.autoLayout);
	      this.url_handler.on("SetDisplayModeCommand", this.ui.setDisplayMode);
	      this.ui.breadcrumb.on("click", this.setWorkspaceFromDefinition.bind(this));
	      self = this;
	      $(document).on('view_group_detail', function(e, group) {
	        self.ui.breadcrumb.set([group]);
	        group = db.groups.find(function(g) {
	          return g.id === group.get('id');
	        });
	        return core.refreshDatamodelAccordingToDB({
	          nodes: group.nodes,
	          connections: db.connections,
	          groups: []
	        });
	      });
	    } else {
	      $("body").addClass("test-mode");
	    }
	    return this;
	  };
	
	  UI.prototype.createGroup = function() {
	    var nodes;
	    nodes = this.getSelectedNodes();
	    this.workspace.clearView();
	    return this.core.createGroup(nodes);
	  };
	
	  UI.prototype.autoLayout = function() {
	    var factor, paramStr, params, plain;
	    db.updateProperty({
	      nodes: core.nodes,
	      groups: core.groups,
	      connections: core.connections,
	      id: core.id
	    });
	    params = ['digraph {'];
	    db.groups.map((function(_this) {
	      return function(g) {
	        params.push('subgraph cluster' + g.id + '{');
	        g.nodes.map(function(n) {
	          return params.push(n.id + ';');
	        });
	        return params.push('}');
	      };
	    })(this));
	    if (db.groups.length !== 0) {
	      db.nodes.map((function(_this) {
	        return function(n) {
	          return params.push(n.id + ';');
	        };
	      })(this));
	    }
	    db.connections.map((function(_this) {
	      return function(c) {
	        return params.push(c.from + '->' + c.to + ';');
	      };
	    })(this));
	    params.push('}');
	    paramStr = params.join(' ');
	    console.log('=========graphviz test params===========');
	    console.log(paramStr);
	    plain = Viz(paramStr, {
	      format: 'plain'
	    });
	    console.log('=========graphviz test plain===========');
	    console.log(plain);
	    factor = 100;
	    plain.split('\n').map(function(line) {
	      var cells, id, target, type, x, y;
	      cells = line.split(' ');
	      type = cells[0];
	      if (type === 'node') {
	        id = parseInt(cells[1]);
	        x = parseFloat(cells[2]) * factor;
	        y = parseFloat(cells[3]) * factor;
	        target = db.findNodeInNodes(id) || db.findNodeInGroups(id) || db.findGroup(id);
	        if (target) {
	          target.x = x;
	          return target.y = y;
	        }
	      }
	    });
	    return core.refreshDatamodelAccordingToDB(db);
	  };
	
	  UI.prototype.getSelectedNodes = function() {
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
	
	  UI.prototype.setDisplayMode = function(is_player) {
	    if (is_player == null) {
	      is_player = false;
	    }
	    if (this.ui) {
	      return this.ui.setDisplayMode(is_player);
	    }
	  };
	
	  UI.prototype.initTimeline = function() {
	    $("#timeline-container, #keyEditDialog").remove();
	    if (this.timelineView) {
	      this.core.nodes.off("remove", this.timelineView.onNodeRemove);
	      this.timelineView.remove();
	      if (this.ui) {
	        this.timelineView.off("TimelineCreated", this.ui.onUiWindowResize);
	      }
	    }
	    this.timelineView = new AppTimeline({
	      el: $("#timeline"),
	      ui: this.ui
	    });
	    this.core.nodes.on("remove", this.timelineView.onNodeRemove);
	    if (this.ui) {
	      this.ui.onUiWindowResize();
	    }
	    return this;
	  };
	
	  UI.prototype.clearWorkspace = function() {
	    this.core.nodes.removeAll();
	    this.core.connections.removeAll();
	    this.core.groups.removeAll();
	    indexer.reset();
	    db.reset();
	    if (this.ui) {
	      return this.ui.clearWorkspace();
	    }
	  };
	
	  return UI;
	
	})();
	
	UI.nodes = {};
	
	UI.UIView = UIView;
	
	UI.nodes.NodeView = NodeView;
	
	UI.nodes.Color = NodeViewColor;
	
	UI.nodes.WebGLRenderer = NodeViewWebgl;
	
	module.exports = UI;


/***/ }),
/* 1 */,
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
	      height: this.get('height'),
	      name: this.get('name')
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
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */
/***/ (function(module, exports) {

	var DB, db,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
	
	db = null;
	
	DB = (function() {
	  function DB() {
	    this.findGroup = bind(this.findGroup, this);
	    this.findNodeInGroups = bind(this.findNodeInGroups, this);
	    this.findNodeInNodes = bind(this.findNodeInNodes, this);
	    this.createGroup = bind(this.createGroup, this);
	    this.updateProperty = bind(this.updateProperty, this);
	    this.loadFromJson = bind(this.loadFromJson, this);
	    this.reset = bind(this.reset, this);
	    this.reset();
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
	    this.id = param.id;
	    param.groups.map((function(_this) {
	      return function(gParam) {
	        var g;
	        if (!_this.groups.length) {
	          return _this.groups.push(gParam.toJSON());
	        } else {
	          g = _this.groups.find(function(_g) {
	            return _g.id === gParam.get('id');
	          });
	          if (g) {
	            g.x = gParam.get('x');
	            g.y = gParam.get('y');
	            g.width = gParam.get('width');
	            g.height = gParam.get('height');
	            return g.name = gParam.get('name');
	          } else {
	            return _this.groups.push(gParam.toJSON());
	          }
	        }
	      };
	    })(this), this);
	    param.nodes.map((function(_this) {
	      return function(nParam) {
	        var n;
	        if (!_this.nodes.length) {
	          return _this.nodes.push(nParam.toJSON());
	        } else {
	          n = _this.nodes.find(function(_n) {
	            return _n.id === nParam.id;
	          });
	          if (n) {
	            n.x = nParam.get('x');
	            n.y = nParam.get('y');
	            n.width = nParam.get('width');
	            n.height = nParam.get('height');
	            return n.name = nParam.get('name');
	          } else {
	            return _this.nodes.push(nParam.toJSON());
	          }
	        }
	      };
	    })(this), this);
	    this.connections = [];
	    return param.connections.map((function(_this) {
	      return function(cParam) {
	        return _this.connections.push(cParam.toJSON());
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
	
	  DB.prototype.findNodeInNodes = function(id) {
	    return this.nodes.find((function(_this) {
	      return function(n) {
	        return n.id === id;
	      };
	    })(this));
	  };
	
	  DB.prototype.findNodeInGroups = function(id) {
	    var node;
	    node = null;
	    this.groups.map((function(_this) {
	      return function(g) {
	        return g.nodes.map(function(n) {
	          if (n.id === id) {
	            return node = n;
	          }
	        });
	      };
	    })(this));
	    return node;
	  };
	
	  DB.prototype.findGroup = function(id) {
	    return this.groups.find((function(_this) {
	      return function(g) {
	        return g.id === id;
	      };
	    })(this));
	  };
	
	  return DB;
	
	})();
	
	module.exports = DB;
	
	window.db = new DB();


/***/ }),
/* 12 */,
/* 13 */,
/* 14 */
/***/ (function(module, exports) {

	module.exports = "<div class='head'><span><%= get(\"name\") %></span></div>\n<div class='options'>\n  <div class='inputs'></div>\n  <div class='center'></div>\n  <div class='outputs'></div>\n</div>\n\n<div class=\"up handler\" data-attr='up'></div>\n<div class=\"down handler\" data-attr='down'></div>\n<div class=\"left handler\" data-attr='left'></div>\n<div class=\"right handler\" data-attr='right'></div>\n<!-- <div class=\"center handler\" data-attr='center'></div> -->\n";

/***/ }),
/* 15 */
/***/ (function(module, exports) {

	module.exports = "<ul id=\"node-context-menu\" class=\"context-menu\">\n  <li><a href=\"#remove_node\">Remove node</a></li>\n  <li><a href=\"#rename_node\">Rename node</a></li>\n</ul>";

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	/*
	 * namespace.coffee v1.0.0
	 * Copyright (c) 2011 CodeCatalyst, LLC.
	 * Open source under the MIT License.
	 */
	(function() {
	  var namespace;
	  namespace = function(name, values) {
	    var key, subpackage, target, value, _i, _len, _ref, _results;
	    target = typeof exports !== "undefined" && exports !== null ? exports : window;
	    //target = window;
	    if (name.length > 0) {
	      _ref = name.split('.');
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        subpackage = _ref[_i];
	        target = target[subpackage] || (target[subpackage] = {});
	      }
	    }
	    _results = [];
	    for (key in values) {
	      value = values[key];
	      _results.push(target[key] = value);
	    }
	    return _results;
	  };
	  namespace("", {
	    namespace: namespace
	  });
	}).call(this);


/***/ }),
/* 17 */
/***/ (function(module, exports) {

	// jQuery Context Menu Plugin
	//
	// Version 1.01
	//
	// Cory S.N. LaViska
	// A Beautiful Site (http://abeautifulsite.net/)
	//
	// More info: http://abeautifulsite.net/2008/09/jquery-context-menu-plugin/
	//
	// Terms of Use
	//
	// This plugin is dual-licensed under the GNU General Public License
	//   and the MIT License and is copyright A Beautiful Site, LLC.
	//
	if(jQuery)( function() {
		$.extend($.fn, {
	
			contextMenu: function(o, callback) {
				// Defaults
				if( o.menu == undefined ) return false;
				if( o.inSpeed == undefined ) o.inSpeed = 150;
				if( o.outSpeed == undefined ) o.outSpeed = 75;
				// 0 needs to be -1 for expected results (no fade)
				if( o.inSpeed == 0 ) o.inSpeed = -1;
				if( o.outSpeed == 0 ) o.outSpeed = -1;
				// Loop each context menu
				$(this).each( function() {
					var el = $(this);
					var offset = $(el).offset();
					// Add contextMenu class
					$('#' + o.menu).addClass('contextMenu');
					// Simulate a true right click
					$(this).mousedown( function(e) {
						var evt = e;
						evt.preventDefault();
						$(this).mouseup( function(e) {
							e.preventDefault();
							var srcElement = $(this);
							$(this).unbind('mouseup');
							if( evt.button == 2 ) {
								// Hide context menus that may be showing
								$(".contextMenu").hide();
								// Get this context menu
								var menu = $('#' + o.menu);
	
								if( $(el).hasClass('disabled') ) return false;
	
								// Detect mouse position
								var d = {}, x, y;
								if( self.innerHeight ) {
									d.pageYOffset = self.pageYOffset;
									d.pageXOffset = self.pageXOffset;
									d.innerHeight = self.innerHeight;
									d.innerWidth = self.innerWidth;
								} else if( document.documentElement &&
									document.documentElement.clientHeight ) {
									d.pageYOffset = document.documentElement.scrollTop;
									d.pageXOffset = document.documentElement.scrollLeft;
									d.innerHeight = document.documentElement.clientHeight;
									d.innerWidth = document.documentElement.clientWidth;
								} else if( document.body ) {
									d.pageYOffset = document.body.scrollTop;
									d.pageXOffset = document.body.scrollLeft;
									d.innerHeight = document.body.clientHeight;
									d.innerWidth = document.body.clientWidth;
								}
								(e.pageX) ? x = e.pageX : x = e.clientX + d.scrollLeft;
								(e.pageY) ? y = e.pageY : y = e.clientY + d.scrollTop;
	
								// Show the menu
								$(document).unbind('click');
								$(menu).css({ top: y, left: x }).fadeIn(o.inSpeed);
								// Hover events
								$(menu).find('A').mouseover( function() {
									$(menu).find('LI.hover').removeClass('hover');
									$(this).parent().addClass('hover');
								}).mouseout( function() {
									$(menu).find('LI.hover').removeClass('hover');
								});
	
								// Keyboard
								$(document).keypress( function(e) {
									switch( e.keyCode ) {
										case 38: // up
											if( $(menu).find('LI.hover').size() == 0 ) {
												$(menu).find('LI:last').addClass('hover');
											} else {
												$(menu).find('LI.hover').removeClass('hover').prevAll('LI:not(.disabled)').eq(0).addClass('hover');
												if( $(menu).find('LI.hover').size() == 0 ) $(menu).find('LI:last').addClass('hover');
											}
										break;
										case 40: // down
											if( $(menu).find('LI.hover').size() == 0 ) {
												$(menu).find('LI:first').addClass('hover');
											} else {
												$(menu).find('LI.hover').removeClass('hover').nextAll('LI:not(.disabled)').eq(0).addClass('hover');
												if( $(menu).find('LI.hover').size() == 0 ) $(menu).find('LI:first').addClass('hover');
											}
										break;
										case 13: // enter
											$(menu).find('LI.hover A').trigger('click');
										break;
										case 27: // esc
											$(document).trigger('click');
										break
									}
								});
	
								// When items are selected
								$('#' + o.menu).find('A').unbind('click');
								$('#' + o.menu).find('LI:not(.disabled) A').click( function() {
									$(document).unbind('click').unbind('keypress');
									$(".contextMenu").hide();
									// Callback
									if( callback ) callback( $(this).attr('href').substr(1), $(srcElement), {x: x - offset.left, y: y - offset.top, docX: x, docY: y} );
									return false;
								});
	
								// Hide bindings
								setTimeout( function() { // Delay for Mozilla
									$(document).click( function() {
										$(document).unbind('click').unbind('keypress');
										$(menu).fadeOut(o.outSpeed);
										return false;
									});
								}, 0);
							}
						});
					});
	
					// Disable text selection
					/*if( $.browser.mozilla ) {
						$('#' + o.menu).each( function() { $(this).css({ 'MozUserSelect' : 'none' }); });
					} else if( $.browser.msie ) {
						$('#' + o.menu).each( function() { $(this).bind('selectstart.disableTextSelect', function() { return false; }); });
					} else {*/
						$('#' + o.menu).each(function() { $(this).bind('mousedown.disableTextSelect', function() { return false; }); });
					//}
					// Disable browser context menu (requires both selectors to work in IE/Safari + FF/Chrome)
					$(el).add($('UL.contextMenu')).bind('contextmenu', function() { return false; });
	
				});
				return $(this);
			},
	
			// Disable context menu items on the fly
			disableContextMenuItems: function(o) {
				if( o == undefined ) {
					// Disable all
					$(this).find('LI').addClass('disabled');
					return( $(this) );
				}
				$(this).each( function() {
					if( o != undefined ) {
						var d = o.split(',');
						for( var i = 0; i < d.length; i++ ) {
							$(this).find('A[href="' + d[i] + '"]').parent().addClass('disabled');
	
						}
					}
				});
				return( $(this) );
			},
	
			// Enable context menu items on the fly
			enableContextMenuItems: function(o) {
				if( o == undefined ) {
					// Enable all
					$(this).find('LI.disabled').removeClass('disabled');
					return( $(this) );
				}
				$(this).each( function() {
					if( o != undefined ) {
						var d = o.split(',');
						for( var i = 0; i < d.length; i++ ) {
							$(this).find('A[href="' + d[i] + '"]').parent().removeClass('disabled');
	
						}
					}
				});
				return( $(this) );
			},
	
			// Disable context menu(s)
			disableContextMenu: function() {
				$(this).each( function() {
					$(this).addClass('disabled');
				});
				return( $(this) );
			},
	
			// Enable context menu(s)
			enableContextMenu: function() {
				$(this).each( function() {
					$(this).removeClass('disabled');
				});
				return( $(this) );
			},
	
			// Destroy context menu(s)
			destroyContextMenu: function() {
				// Destroy specified context menus
				$(this).each( function() {
					// Disable action
					$(this).unbind('mousedown').unbind('mouseup');
				});
				return( $(this) );
			}
	
		});
	})(jQuery);


/***/ }),
/* 18 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_18__;

/***/ }),
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	var Backbone, FieldsView, NodeView, _, _view_node_context_menu, _view_node_template, namespace,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(2);
	
	Backbone = __webpack_require__(3);
	
	_view_node_template = __webpack_require__(14);
	
	_view_node_context_menu = __webpack_require__(15);
	
	FieldsView = __webpack_require__(39);
	
	namespace = __webpack_require__(16).namespace;
	
	__webpack_require__(17);
	
	__webpack_require__(18);
	
	
	/* Node View */
	
	NodeView = (function(superClass) {
	  extend(NodeView, superClass);
	
	  function NodeView() {
	    this.makeDraggable = bind(this.makeDraggable, this);
	    this.remove = bind(this.remove, this);
	    this.computeNodePosition = bind(this.computeNodePosition, this);
	    this.renderConnections = bind(this.renderConnections, this);
	    this.addSelectedClass = bind(this.addSelectedClass, this);
	    this.highlighAnimations = bind(this.highlighAnimations, this);
	    this.render = bind(this.render, this);
	    this.makeElement = bind(this.makeElement, this);
	    this.initContextMenus = bind(this.initContextMenus, this);
	    return NodeView.__super__.constructor.apply(this, arguments);
	  }
	
	  NodeView.prototype.className = "node";
	
	  NodeView.prototype.initialize = function(options) {
	    this.makeElement();
	    this.makeDraggable();
	    this.initNodeClick();
	    this.initTitleClick();
	    this.model.on('change', this.render);
	    this.model.on('remove', (function(_this) {
	      return function() {
	        return _this.remove();
	      };
	    })(this));
	    this.model.on("node:computePosition", this.computeNodePosition);
	    this.model.on("node:renderConnections", this.renderConnections);
	    this.model.on("node:addSelectedClass", this.addSelectedClass);
	    this.render();
	    return this.initContextMenus();
	  };
	
	  NodeView.prototype.initContextMenus = function() {
	    var node_menu;
	    if ($("#node-context-menu").length < 1) {
	      node_menu = _.template(_view_node_context_menu, {});
	      $("body").append(node_menu);
	    }
	    this.$el.find(".head").contextMenu({
	      menu: "node-context-menu"
	    }, (function(_this) {
	      return function(action, el, pos) {
	        if (action === "remove_node") {
	          return _this.model.remove();
	        }
	      };
	    })(this));
	    return this;
	  };
	
	  NodeView.prototype.makeElement = function() {
	    this.template = _.template(_view_node_template, this.model);
	    this.$el.html(this.template);
	    this.$el.addClass("type-" + this.model.constructor.group_name);
	    return this.$el.addClass("node-" + this.model.typename());
	  };
	
	  NodeView.prototype.render = function() {
	    this.$el.css({
	      left: parseInt(this.model.get("x")),
	      top: parseInt(this.model.get("y"))
	    });
	    this.$el.find("> .head span").text(this.model.get("name"));
	    return this.$el.find("> .head span").show();
	  };
	
	  NodeView.prototype.highlighAnimations = function() {
	    var $target, i, len, nodeAnimation, propTrack, ref;
	    nodeAnimation = false;
	    ref = this.model.anim.objectTrack.propertyTracks;
	    for (i = 0, len = ref.length; i < len; i++) {
	      propTrack = ref[i];
	      $target = $('.inputs .field-' + propTrack.name, this.$el);
	      if (propTrack.anims.length > 0) {
	        $target.addClass("has-animation");
	        nodeAnimation = true;
	      } else {
	        $target.removeClass("has-animation");
	      }
	    }
	    this.$el.toggleClass("node-has-animation", nodeAnimation);
	    return true;
	  };
	
	  NodeView.prototype.addSelectedClass = function() {
	    return this.$el.addClass("ui-selected");
	  };
	
	  NodeView.prototype.renderConnections = function() {
	    return this.model.renderConnections();
	  };
	
	  NodeView.prototype.computeNodePosition = function() {
	    var offset, pos;
	    pos = $(this.el).position();
	    offset = $("#container-wrapper").offset();
	    return this.model.set({
	      x: pos.left + $("#container-wrapper").scrollLeft(),
	      y: pos.top + $("#container-wrapper").scrollTop()
	    });
	  };
	
	  NodeView.prototype.remove = function() {
	    $(".field", this.el).destroyContextMenu();
	    if (this.$el.data("draggable")) {
	      this.$el.draggable("destroy");
	    }
	    $(this.el).unbind();
	    this.undelegateEvents();
	    if (this.fields_view) {
	      this.fields_view.remove();
	    }
	    delete this.fields_view;
	    return NodeView.__super__.remove.apply(this, arguments);
	  };
	
	  NodeView.prototype.initNodeClick = function() {
	    var self;
	    self = this;
	    $(this.el).click(function(e) {
	      var selectable;
	      if (e.metaKey === false) {
	        $(".node").removeClass("ui-selected");
	        $(this).addClass("ui-selecting");
	      } else {
	        if ($(this).hasClass("ui-selected")) {
	          $(this).removeClass("ui-selected");
	        } else {
	          $(this).addClass("ui-selecting");
	        }
	      }
	      selectable = $("#container").data("ui-selectable");
	      if (!selectable) {
	        return;
	      }
	      selectable.refresh();
	      selectable._mouseStop(null);
	      return self.model.fields.renderSidebar();
	    });
	    return this;
	  };
	
	  NodeView.prototype.initTitleClick = function() {
	    var $input, $title_span, self;
	    self = this;
	    $title_span = this.$el.find("> .head span");
	    $input = $("<input type='text' />");
	    this.$el.find("> .head").append($input);
	    $input.hide();
	    $input.on('mousedown', function(e) {
	      return e.stopPropagation();
	    });
	    $title_span.dblclick(function(e) {
	      var apply_input_result, prev;
	      prev = $(this).html();
	      $input.val(prev);
	      $title_span.hide();
	      $input.show();
	      apply_input_result = function() {
	        self.model.set('name', $input.val());
	        $input.hide();
	        return $title_span.show();
	      };
	      $input.blur(function(e) {
	        return apply_input_result();
	      });
	      $("#graph").click(function(e) {
	        return apply_input_result();
	      });
	      return $input.keydown(function(e) {
	        if (e.keyCode === 13) {
	          return apply_input_result();
	        }
	      });
	    });
	    return this;
	  };
	
	  NodeView.prototype.makeDraggable = function() {
	    var nodes_offset, selected_nodes, self;
	    self = this;
	    nodes_offset = {
	      top: 0,
	      left: 0
	    };
	    selected_nodes = $([]);
	    $(this.el).draggable({
	      start: function(ev, ui) {
	        if ($(this).hasClass("ui-selected")) {
	          selected_nodes = $(".ui-selected").each(function() {
	            return $(this).data("offset", $(this).offset());
	          });
	        } else {
	          selected_nodes = $([]);
	          $(".node").removeClass("ui-selected");
	        }
	        return nodes_offset = $(this).offset();
	      },
	      drag: function(ev, ui) {
	        var dl, dt;
	        dt = ui.position.top - nodes_offset.top;
	        dl = ui.position.left - nodes_offset.left;
	        selected_nodes.not(this).each(function() {
	          var dx, dy, el, offset;
	          el = $(this);
	          offset = el.data("offset");
	          dx = offset.top + dt;
	          dy = offset.left + dl;
	          el.css({
	            top: dx,
	            left: dy
	          });
	          el.data("object").trigger("node:computePosition");
	          return el.data("object").trigger("node:renderConnections");
	        });
	        return self.renderConnections();
	      },
	      stop: function() {
	        selected_nodes.not(this).each(function() {
	          var el;
	          el = $(this).data("object");
	          return el.trigger("node:renderConnections");
	        });
	        self.computeNodePosition();
	        return self.renderConnections();
	      }
	    });
	    return this;
	  };
	
	  return NodeView;
	
	})(Backbone.View);
	
	ThreeNodes.Core.addNodeView('NodeView', NodeView);
	
	module.exports = NodeView;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	var Backbone, FieldButton, FieldsView, _,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(2);
	
	Backbone = __webpack_require__(3);
	
	FieldButton = __webpack_require__(40);
	
	__webpack_require__(18);
	
	
	/* Fields View */
	
	FieldsView = (function(superClass) {
	  extend(FieldsView, superClass);
	
	  function FieldsView() {
	    this.remove = bind(this.remove, this);
	    this.onFieldCreated = bind(this.onFieldCreated, this);
	    return FieldsView.__super__.constructor.apply(this, arguments);
	  }
	
	  FieldsView.prototype.initialize = function(options) {
	    FieldsView.__super__.initialize.apply(this, arguments);
	    this.node = options.node;
	    this.subviews = [];
	    this.collection.on("add", this.onFieldCreated);
	    return this.collection.each(this.onFieldCreated);
	  };
	
	  FieldsView.prototype.onFieldCreated = function(field) {
	    var $node, connection, from_gid, isInsideAnotherDOMnode, target, to_gid, view;
	    target = field.get("is_output") === false ? ".inputs" : ".outputs";
	    if (field.get("is_output") === false && field.isConnected()) {
	      connection = field.connections[0];
	      $node = this.$el.parent();
	      isInsideAnotherDOMnode = function() {
	        return $node.parent().closest(".node").length > 0;
	      };
	      if (isInsideAnotherDOMnode()) {
	        from_gid = connection.from_field.node.get("gid");
	        to_gid = connection.to_field.node.get("gid");
	        if (from_gid !== "-1" && to_gid !== "-1" && from_gid === to_gid) {
	          return;
	        }
	      }
	    }
	    view = new FieldButton({
	      model: field
	    });
	    view.$el.appendTo($(target, this.$el));
	    field.button = view.$el;
	    return this.subviews.push(view);
	  };
	
	  FieldsView.prototype.remove = function() {
	    var views;
	    this.undelegateEvents();
	    this.collection.off("add", this.onFieldCreated);
	    views = this.subviews.concat();
	    _.each(views, function(view) {
	      return view.remove();
	    });
	    $("input", $(this.el)).remove();
	    delete this.collection;
	    delete this.node;
	    delete this.subviews;
	    return FieldsView.__super__.remove.apply(this, arguments);
	  };
	
	  return FieldsView;
	
	})(Backbone.View);
	
	module.exports = FieldsView;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	var Backbone, FieldButton, _, _view_field_context_menu, _view_node_field_in, _view_node_field_out,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(2);
	
	Backbone = __webpack_require__(3);
	
	_view_node_field_in = __webpack_require__(41);
	
	_view_node_field_out = __webpack_require__(42);
	
	_view_field_context_menu = __webpack_require__(43);
	
	__webpack_require__(5);
	
	__webpack_require__(17);
	
	
	/* FieldButton View */
	
	FieldButton = (function(superClass) {
	  extend(FieldButton, superClass);
	
	  function FieldButton() {
	    this.render = bind(this.render, this);
	    this.makeElement = bind(this.makeElement, this);
	    this.remove = bind(this.remove, this);
	    return FieldButton.__super__.constructor.apply(this, arguments);
	  }
	
	  FieldButton.prototype.className = "field";
	
	  FieldButton.prototype.initialize = function(options) {
	    FieldButton.__super__.initialize.apply(this, arguments);
	    this.makeElement();
	    return this.render();
	  };
	
	  FieldButton.prototype.remove = function() {
	    var $inner;
	    $inner = $(".inner-field", this.$el);
	    if ($inner.data("droppable")) {
	      $inner.droppable("destroy");
	    }
	    if ($inner.data("draggable")) {
	      $inner.draggable("destroy");
	    }
	    $inner.remove();
	    return FieldButton.__super__.remove.apply(this, arguments);
	  };
	
	  FieldButton.prototype.makeElement = function() {
	    var bt, layout;
	    layout = this.model.get("is_output") ? _view_node_field_out : _view_node_field_in;
	    bt = _.template(layout, {
	      fid: this.model.get("fid"),
	      name: this.model.get("name")
	    });
	    return this.$el.html(bt);
	  };
	
	  FieldButton.prototype.render = function() {
	    this.$el.attr("rel", this.model.get("name"));
	    this.$el.addClass("field-" + this.model.get("name"));
	    this.$el.data("object", this.model);
	    this.$el.data("fid", this.model.get("fid"));
	    this.initContextMenu();
	    return this.addFieldListener();
	  };
	
	  FieldButton.prototype.initContextMenu = function() {
	    var menu_field_menu;
	    if ($("#field-context-menu").length < 1) {
	      menu_field_menu = _.template(_view_field_context_menu, {});
	      $("body").append(menu_field_menu);
	    }
	    this.$el.contextMenu({
	      menu: "field-context-menu"
	    }, (function(_this) {
	      return function(action, el, pos) {
	        if (action === "removeConnection") {
	          return _this.model.removeConnections();
	        }
	      };
	    })(this));
	    return this;
	  };
	
	  FieldButton.prototype.addFieldListener = function() {
	    var accept_class, field, getPath, highlight_possible_targets, self, start_offset_x, start_offset_y;
	    self = this;
	    field = this.model;
	    start_offset_x = 0;
	    start_offset_y = 0;
	    getPath = function(start, end, offset) {
	      var ofx, ofy;
	      ofx = $("#container-wrapper").scrollLeft();
	      ofy = $("#container-wrapper").scrollTop();
	      return "M" + (start.left + offset.left + 2) + " " + (start.top + offset.top + 2) + " L" + (end.left + offset.left + ofx - start_offset_x) + " " + (end.top + offset.top + ofy - start_offset_y);
	    };
	    highlight_possible_targets = function() {
	      var target;
	      target = ".outputs .field";
	      if (field.get("is_output") === true) {
	        target = ".inputs .field";
	      }
	      return $(target).filter(function() {
	        return $(this).parent().parent().parent().data("id") !== field.node.get("id");
	      }).addClass("field-possible-target");
	    };
	    $(".inner-field", this.$el).draggable({
	      helper: function() {
	        return $("<div class='ui-widget-drag-helper'></div>");
	      },
	      scroll: true,
	      cursor: 'pointer',
	      cursorAt: {
	        left: 0,
	        top: 0
	      },
	      start: function(event, ui) {
	        start_offset_x = $("#container-wrapper").scrollLeft();
	        start_offset_y = $("#container-wrapper").scrollTop();
	        highlight_possible_targets();
	        if (ThreeNodes.UI.UIView.connecting_line) {
	          return ThreeNodes.UI.UIView.connecting_line.attr({
	            opacity: 1
	          });
	        }
	      },
	      stop: function(event, ui) {
	        $(".field").removeClass("field-possible-target");
	        if (ThreeNodes.UI.UIView.connecting_line) {
	          return ThreeNodes.UI.UIView.connecting_line.attr({
	            opacity: 0
	          });
	        }
	      },
	      drag: function(event, ui) {
	        var node_pos, pos;
	        if (ThreeNodes.UI.UIView.connecting_line) {
	          pos = $(this).position();
	          node_pos = {
	            left: field.node.get("x"),
	            top: field.node.get("y")
	          };
	          ThreeNodes.UI.UIView.connecting_line.attr({
	            path: getPath(pos, ui.position, node_pos)
	          });
	          return true;
	        }
	      }
	    });
	    accept_class = ".outputs .inner-field";
	    if (field && field.get("is_output") === true) {
	      accept_class = ".inputs .inner-field";
	    }
	    $(".inner-field", this.$el).droppable({
	      accept: accept_class,
	      activeClass: "ui-state-active",
	      hoverClass: "ui-state-hover",
	      drop: function(event, ui) {
	        var field2, origin;
	        origin = $(ui.draggable).parent();
	        field2 = origin.data("object");
	        if (field.node.parent) {
	          return field2.node.createConnection(field, field2);
	        } else {
	          return field.node.createConnection(field, field2);
	        }
	      }
	    });
	    return this;
	  };
	
	  return FieldButton;
	
	})(Backbone.View);
	
	module.exports = FieldButton;


/***/ }),
/* 41 */
/***/ (function(module, exports) {

	module.exports = "<span class=\"inner-field\"><span></span><%= name %></span>";

/***/ }),
/* 42 */
/***/ (function(module, exports) {

	module.exports = "<span class=\"inner-field\"><%= name %><span></span></span>";

/***/ }),
/* 43 */
/***/ (function(module, exports) {

	module.exports = "<ul id=\"field-context-menu\" class=\"context-menu\">\n  <li><a href=\"#removeConnection\">Remove connection(s)</a></li>\n</ul>";

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	var Backbone, Color, NodeView, _, namespace,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(2);
	
	Backbone = __webpack_require__(3);
	
	namespace = __webpack_require__(16).namespace;
	
	__webpack_require__(4);
	
	NodeView = __webpack_require__(38);
	
	__webpack_require__(45);
	
	Color = (function(superClass) {
	  extend(Color, superClass);
	
	  function Color() {
	    this.remove = bind(this.remove, this);
	    this.init_preview = bind(this.init_preview, this);
	    this.initialize = bind(this.initialize, this);
	    return Color.__super__.constructor.apply(this, arguments);
	  }
	
	  Color.prototype.initialize = function(options) {
	    Color.__super__.initialize.apply(this, arguments);
	    this.model.compute();
	    return this.init_preview();
	  };
	
	  Color.prototype.init_preview = function() {
	    var col, fields;
	    fields = this.model.fields;
	    this.$picker_el = $("<div class='color_preview'></div>");
	    col = fields.getField("rgb", true).getValue(0);
	    this.$picker_el.ColorPicker({
	      color: {
	        r: Math.ceil(col.r * 255),
	        g: Math.ceil(col.g * 255),
	        b: Math.ceil(col.b * 255)
	      },
	      livePreview: false,
	      onChange: (function(_this) {
	        return function(hsb, hex, rgb) {
	          fields.getField("r").setValue(rgb.r / 255);
	          fields.getField("g").setValue(rgb.g / 255);
	          return fields.getField("b").setValue(rgb.b / 255);
	        };
	      })(this)
	    });
	    $(".center", this.$el).append(this.$picker_el);
	    return fields.getField("rgb", true).on_value_update_hooks.set_bg_color_preview = (function(_this) {
	      return function(v) {
	        return _this.$picker_el.css({
	          background: v[0].getStyle()
	        });
	      };
	    })(this);
	  };
	
	  Color.prototype.remove = function() {
	    this.$picker_el.each(function() {
	      var cal, picker;
	      if ($(this).data('colorpickerId')) {
	        cal = $('#' + $(this).data('colorpickerId'));
	        picker = cal.data('colorpicker');
	        if (picker) {
	          delete picker.onChange;
	        }
	        return cal.remove();
	      }
	    });
	    this.$picker_el.unbind();
	    this.$picker_el.remove();
	    delete this.$picker_el;
	    return Color.__super__.remove.apply(this, arguments);
	  };
	
	  return Color;
	
	})(NodeView);
	
	module.exports = Color;


/***/ }),
/* 45 */
/***/ (function(module, exports) {

	/**
	 *
	 * Color picker
	 * Author: Stefan Petre www.eyecon.ro
	 * 
	 * Dual licensed under the MIT and GPL licenses
	 * 
	 */
	(function ($) {
		var ColorPicker = function () {
			var
				ids = {},
				inAction,
				charMin = 65,
				visible,
				tpl = '<div class="colorpicker"><div class="colorpicker_color"><div><div></div></div></div><div class="colorpicker_hue"><div></div></div><div class="colorpicker_new_color"></div><div class="colorpicker_current_color"></div><div class="colorpicker_hex"><input type="text" maxlength="6" size="6" /></div><div class="colorpicker_rgb_r colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_rgb_g colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_rgb_b colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_h colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_s colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_b colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_submit"></div></div>',
				defaults = {
					eventName: 'click',
					onShow: function () {},
					onBeforeShow: function(){},
					onHide: function () {},
					onChange: function () {},
					onSubmit: function () {},
					color: 'ff0000',
					livePreview: true,
					flat: false
				},
				fillRGBFields = function  (hsb, cal) {
					var rgb = HSBToRGB(hsb);
					$(cal).data('colorpicker').fields
						.eq(1).val(rgb.r).end()
						.eq(2).val(rgb.g).end()
						.eq(3).val(rgb.b).end();
				},
				fillHSBFields = function  (hsb, cal) {
					$(cal).data('colorpicker').fields
						.eq(4).val(hsb.h).end()
						.eq(5).val(hsb.s).end()
						.eq(6).val(hsb.b).end();
				},
				fillHexFields = function (hsb, cal) {
					$(cal).data('colorpicker').fields
						.eq(0).val(HSBToHex(hsb)).end();
				},
				setSelector = function (hsb, cal) {
					$(cal).data('colorpicker').selector.css('backgroundColor', '#' + HSBToHex({h: hsb.h, s: 100, b: 100}));
					$(cal).data('colorpicker').selectorIndic.css({
						left: parseInt(150 * hsb.s/100, 10),
						top: parseInt(150 * (100-hsb.b)/100, 10)
					});
				},
				setHue = function (hsb, cal) {
					$(cal).data('colorpicker').hue.css('top', parseInt(150 - 150 * hsb.h/360, 10));
				},
				setCurrentColor = function (hsb, cal) {
					$(cal).data('colorpicker').currentColor.css('backgroundColor', '#' + HSBToHex(hsb));
				},
				setNewColor = function (hsb, cal) {
					$(cal).data('colorpicker').newColor.css('backgroundColor', '#' + HSBToHex(hsb));
				},
				keyDown = function (ev) {
					var pressedKey = ev.charCode || ev.keyCode || -1;
					if ((pressedKey > charMin && pressedKey <= 90) || pressedKey == 32) {
						return false;
					}
					var cal = $(this).parent().parent();
					if (cal.data('colorpicker').livePreview === true) {
						change.apply(this);
					}
				},
				change = function (ev) {
					var cal = $(this).parent().parent(), col;
					if (this.parentNode.className.indexOf('_hex') > 0) {
						cal.data('colorpicker').color = col = HexToHSB(fixHex(this.value));
					} else if (this.parentNode.className.indexOf('_hsb') > 0) {
						cal.data('colorpicker').color = col = fixHSB({
							h: parseInt(cal.data('colorpicker').fields.eq(4).val(), 10),
							s: parseInt(cal.data('colorpicker').fields.eq(5).val(), 10),
							b: parseInt(cal.data('colorpicker').fields.eq(6).val(), 10)
						});
					} else {
						cal.data('colorpicker').color = col = RGBToHSB(fixRGB({
							r: parseInt(cal.data('colorpicker').fields.eq(1).val(), 10),
							g: parseInt(cal.data('colorpicker').fields.eq(2).val(), 10),
							b: parseInt(cal.data('colorpicker').fields.eq(3).val(), 10)
						}));
					}
					if (ev) {
						fillRGBFields(col, cal.get(0));
						fillHexFields(col, cal.get(0));
						fillHSBFields(col, cal.get(0));
					}
					setSelector(col, cal.get(0));
					setHue(col, cal.get(0));
					setNewColor(col, cal.get(0));
					cal.data('colorpicker').onChange.apply(cal, [col, HSBToHex(col), HSBToRGB(col)]);
				},
				blur = function (ev) {
					var cal = $(this).parent().parent();
					cal.data('colorpicker').fields.parent().removeClass('colorpicker_focus');
				},
				focus = function () {
					charMin = this.parentNode.className.indexOf('_hex') > 0 ? 70 : 65;
					$(this).parent().parent().data('colorpicker').fields.parent().removeClass('colorpicker_focus');
					$(this).parent().addClass('colorpicker_focus');
				},
				downIncrement = function (ev) {
					var field = $(this).parent().find('input').focus();
					var current = {
						el: $(this).parent().addClass('colorpicker_slider'),
						max: this.parentNode.className.indexOf('_hsb_h') > 0 ? 360 : (this.parentNode.className.indexOf('_hsb') > 0 ? 100 : 255),
						y: ev.pageY,
						field: field,
						val: parseInt(field.val(), 10),
						preview: $(this).parent().parent().data('colorpicker').livePreview					
					};
					$(document).bind('mouseup', current, upIncrement);
					$(document).bind('mousemove', current, moveIncrement);
				},
				moveIncrement = function (ev) {
					ev.data.field.val(Math.max(0, Math.min(ev.data.max, parseInt(ev.data.val + ev.pageY - ev.data.y, 10))));
					if (ev.data.preview) {
						change.apply(ev.data.field.get(0), [true]);
					}
					return false;
				},
				upIncrement = function (ev) {
					change.apply(ev.data.field.get(0), [true]);
					ev.data.el.removeClass('colorpicker_slider').find('input').focus();
					$(document).unbind('mouseup', upIncrement);
					$(document).unbind('mousemove', moveIncrement);
					return false;
				},
				downHue = function (ev) {
					var current = {
						cal: $(this).parent(),
						y: $(this).offset().top
					};
					current.preview = current.cal.data('colorpicker').livePreview;
					$(document).bind('mouseup', current, upHue);
					$(document).bind('mousemove', current, moveHue);
				},
				moveHue = function (ev) {
					change.apply(
						ev.data.cal.data('colorpicker')
							.fields
							.eq(4)
							.val(parseInt(360*(150 - Math.max(0,Math.min(150,(ev.pageY - ev.data.y))))/150, 10))
							.get(0),
						[ev.data.preview]
					);
					return false;
				},
				upHue = function (ev) {
					fillRGBFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
					fillHexFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
					$(document).unbind('mouseup', upHue);
					$(document).unbind('mousemove', moveHue);
					return false;
				},
				downSelector = function (ev) {
					var current = {
						cal: $(this).parent(),
						pos: $(this).offset()
					};
					current.preview = current.cal.data('colorpicker').livePreview;
					$(document).bind('mouseup', current, upSelector);
					$(document).bind('mousemove', current, moveSelector);
				},
				moveSelector = function (ev) {
					change.apply(
						ev.data.cal.data('colorpicker')
							.fields
							.eq(6)
							.val(parseInt(100*(150 - Math.max(0,Math.min(150,(ev.pageY - ev.data.pos.top))))/150, 10))
							.end()
							.eq(5)
							.val(parseInt(100*(Math.max(0,Math.min(150,(ev.pageX - ev.data.pos.left))))/150, 10))
							.get(0),
						[ev.data.preview]
					);
					return false;
				},
				upSelector = function (ev) {
					fillRGBFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
					fillHexFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
					$(document).unbind('mouseup', upSelector);
					$(document).unbind('mousemove', moveSelector);
					return false;
				},
				enterSubmit = function (ev) {
					$(this).addClass('colorpicker_focus');
				},
				leaveSubmit = function (ev) {
					$(this).removeClass('colorpicker_focus');
				},
				clickSubmit = function (ev) {
					var cal = $(this).parent();
					var col = cal.data('colorpicker').color;
					cal.data('colorpicker').origColor = col;
					setCurrentColor(col, cal.get(0));
					cal.data('colorpicker').onSubmit(col, HSBToHex(col), HSBToRGB(col), cal.data('colorpicker').el);
				},
				show = function (ev) {
					var cal = $('#' + $(this).data('colorpickerId'));
					cal.data('colorpicker').onBeforeShow.apply(this, [cal.get(0)]);
					var pos = $(this).offset();
					var viewPort = getViewport();
					var top = pos.top + this.offsetHeight;
					var left = pos.left;
					if (top + 176 > viewPort.t + viewPort.h) {
						top -= this.offsetHeight + 176;
					}
					if (left + 356 > viewPort.l + viewPort.w) {
						left -= 356;
					}
					cal.css({left: left + 'px', top: top + 'px'});
					if (cal.data('colorpicker').onShow.apply(this, [cal.get(0)]) != false) {
						cal.show();
					}
					$(document).bind('mousedown', {cal: cal}, hide);
					return false;
				},
				hide = function (ev) {
					if (!isChildOf(ev.data.cal.get(0), ev.target, ev.data.cal.get(0))) {
						if (ev.data.cal.data('colorpicker').onHide.apply(this, [ev.data.cal.get(0)]) != false) {
							ev.data.cal.hide();
						}
						$(document).unbind('mousedown', hide);
					}
				},
				isChildOf = function(parentEl, el, container) {
					if (parentEl == el) {
						return true;
					}
					if (parentEl.contains) {
						return parentEl.contains(el);
					}
					if ( parentEl.compareDocumentPosition ) {
						return !!(parentEl.compareDocumentPosition(el) & 16);
					}
					var prEl = el.parentNode;
					while(prEl && prEl != container) {
						if (prEl == parentEl)
							return true;
						prEl = prEl.parentNode;
					}
					return false;
				},
				getViewport = function () {
					var m = document.compatMode == 'CSS1Compat';
					return {
						l : window.pageXOffset || (m ? document.documentElement.scrollLeft : document.body.scrollLeft),
						t : window.pageYOffset || (m ? document.documentElement.scrollTop : document.body.scrollTop),
						w : window.innerWidth || (m ? document.documentElement.clientWidth : document.body.clientWidth),
						h : window.innerHeight || (m ? document.documentElement.clientHeight : document.body.clientHeight)
					};
				},
				fixHSB = function (hsb) {
					return {
						h: Math.min(360, Math.max(0, hsb.h)),
						s: Math.min(100, Math.max(0, hsb.s)),
						b: Math.min(100, Math.max(0, hsb.b))
					};
				}, 
				fixRGB = function (rgb) {
					return {
						r: Math.min(255, Math.max(0, rgb.r)),
						g: Math.min(255, Math.max(0, rgb.g)),
						b: Math.min(255, Math.max(0, rgb.b))
					};
				},
				fixHex = function (hex) {
					var len = 6 - hex.length;
					if (len > 0) {
						var o = [];
						for (var i=0; i<len; i++) {
							o.push('0');
						}
						o.push(hex);
						hex = o.join('');
					}
					return hex;
				}, 
				HexToRGB = function (hex) {
					var hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
					return {r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF)};
				},
				HexToHSB = function (hex) {
					return RGBToHSB(HexToRGB(hex));
				},
				RGBToHSB = function (rgb) {
					var hsb = {
						h: 0,
						s: 0,
						b: 0
					};
					var min = Math.min(rgb.r, rgb.g, rgb.b);
					var max = Math.max(rgb.r, rgb.g, rgb.b);
					var delta = max - min;
					hsb.b = max;
					if (max != 0) {
						
					}
					hsb.s = max != 0 ? 255 * delta / max : 0;
					if (hsb.s != 0) {
						if (rgb.r == max) {
							hsb.h = (rgb.g - rgb.b) / delta;
						} else if (rgb.g == max) {
							hsb.h = 2 + (rgb.b - rgb.r) / delta;
						} else {
							hsb.h = 4 + (rgb.r - rgb.g) / delta;
						}
					} else {
						hsb.h = -1;
					}
					hsb.h *= 60;
					if (hsb.h < 0) {
						hsb.h += 360;
					}
					hsb.s *= 100/255;
					hsb.b *= 100/255;
					return hsb;
				},
				HSBToRGB = function (hsb) {
					var rgb = {};
					var h = Math.round(hsb.h);
					var s = Math.round(hsb.s*255/100);
					var v = Math.round(hsb.b*255/100);
					if(s == 0) {
						rgb.r = rgb.g = rgb.b = v;
					} else {
						var t1 = v;
						var t2 = (255-s)*v/255;
						var t3 = (t1-t2)*(h%60)/60;
						if(h==360) h = 0;
						if(h<60) {rgb.r=t1;	rgb.b=t2; rgb.g=t2+t3}
						else if(h<120) {rgb.g=t1; rgb.b=t2;	rgb.r=t1-t3}
						else if(h<180) {rgb.g=t1; rgb.r=t2;	rgb.b=t2+t3}
						else if(h<240) {rgb.b=t1; rgb.r=t2;	rgb.g=t1-t3}
						else if(h<300) {rgb.b=t1; rgb.g=t2;	rgb.r=t2+t3}
						else if(h<360) {rgb.r=t1; rgb.g=t2;	rgb.b=t1-t3}
						else {rgb.r=0; rgb.g=0;	rgb.b=0}
					}
					return {r:Math.round(rgb.r), g:Math.round(rgb.g), b:Math.round(rgb.b)};
				},
				RGBToHex = function (rgb) {
					var hex = [
						rgb.r.toString(16),
						rgb.g.toString(16),
						rgb.b.toString(16)
					];
					$.each(hex, function (nr, val) {
						if (val.length == 1) {
							hex[nr] = '0' + val;
						}
					});
					return hex.join('');
				},
				HSBToHex = function (hsb) {
					return RGBToHex(HSBToRGB(hsb));
				},
				restoreOriginal = function () {
					var cal = $(this).parent();
					var col = cal.data('colorpicker').origColor;
					cal.data('colorpicker').color = col;
					fillRGBFields(col, cal.get(0));
					fillHexFields(col, cal.get(0));
					fillHSBFields(col, cal.get(0));
					setSelector(col, cal.get(0));
					setHue(col, cal.get(0));
					setNewColor(col, cal.get(0));
				};
			return {
				init: function (opt) {
					opt = $.extend({}, defaults, opt||{});
					if (typeof opt.color == 'string') {
						opt.color = HexToHSB(opt.color);
					} else if (opt.color.r != undefined && opt.color.g != undefined && opt.color.b != undefined) {
						opt.color = RGBToHSB(opt.color);
					} else if (opt.color.h != undefined && opt.color.s != undefined && opt.color.b != undefined) {
						opt.color = fixHSB(opt.color);
					} else {
						return this;
					}
					return this.each(function () {
						if (!$(this).data('colorpickerId')) {
							var options = $.extend({}, opt);
							options.origColor = opt.color;
							var id = 'collorpicker_' + parseInt(Math.random() * 1000);
							$(this).data('colorpickerId', id);
							var cal = $(tpl).attr('id', id);
							if (options.flat) {
								cal.appendTo(this).show();
							} else {
								cal.appendTo(document.body);
							}
							options.fields = cal
												.find('input')
													.bind('keyup', keyDown)
													.bind('change', change)
													.bind('blur', blur)
													.bind('focus', focus);
							cal
								.find('span').bind('mousedown', downIncrement).end()
								.find('>div.colorpicker_current_color').bind('click', restoreOriginal);
							options.selector = cal.find('div.colorpicker_color').bind('mousedown', downSelector);
							options.selectorIndic = options.selector.find('div div');
							options.el = this;
							options.hue = cal.find('div.colorpicker_hue div');
							cal.find('div.colorpicker_hue').bind('mousedown', downHue);
							options.newColor = cal.find('div.colorpicker_new_color');
							options.currentColor = cal.find('div.colorpicker_current_color');
							cal.data('colorpicker', options);
							cal.find('div.colorpicker_submit')
								.bind('mouseenter', enterSubmit)
								.bind('mouseleave', leaveSubmit)
								.bind('click', clickSubmit);
							fillRGBFields(options.color, cal.get(0));
							fillHSBFields(options.color, cal.get(0));
							fillHexFields(options.color, cal.get(0));
							setHue(options.color, cal.get(0));
							setSelector(options.color, cal.get(0));
							setCurrentColor(options.color, cal.get(0));
							setNewColor(options.color, cal.get(0));
							console.log(options);
							if (options.flat) {
								cal.css({
									position: 'relative',
									display: 'block'
								});
							} else {
								$(this).bind(options.eventName, show);
							}
						}
					});
				},
				showPicker: function() {
					return this.each( function () {
						if ($(this).data('colorpickerId')) {
							show.apply(this);
						}
					});
				},
				hidePicker: function() {
					return this.each( function () {
						if ($(this).data('colorpickerId')) {
							$('#' + $(this).data('colorpickerId')).hide();
						}
					});
				},
				setColor: function(col) {
					if (typeof col == 'string') {
						col = HexToHSB(col);
					} else if (col.r != undefined && col.g != undefined && col.b != undefined) {
						col = RGBToHSB(col);
					} else if (col.h != undefined && col.s != undefined && col.b != undefined) {
						col = fixHSB(col);
					} else {
						return this;
					}
					return this.each(function(){
						if ($(this).data('colorpickerId')) {
							var cal = $('#' + $(this).data('colorpickerId'));
							cal.data('colorpicker').color = col;
							cal.data('colorpicker').origColor = col;
							fillRGBFields(col, cal.get(0));
							fillHSBFields(col, cal.get(0));
							fillHexFields(col, cal.get(0));
							setHue(col, cal.get(0));
							setSelector(col, cal.get(0));
							setCurrentColor(col, cal.get(0));
							setNewColor(col, cal.get(0));
						}
					});
				}
			};
		}();
		$.fn.extend({
			ColorPicker: ColorPicker.init,
			ColorPickerHide: ColorPicker.hidePicker,
			ColorPickerShow: ColorPicker.showPicker,
			ColorPickerSetColor: ColorPicker.setColor
		});
	})(jQuery)

/***/ }),
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_81__;

/***/ }),
/* 82 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_82__;

/***/ }),
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

	
	/* UI View */
	var Backbone, Breadcrumb, MenuBar, Sidebar, UIView, _, _view_app_ui,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(2);
	
	Backbone = __webpack_require__(3);
	
	_view_app_ui = __webpack_require__(92);
	
	Sidebar = __webpack_require__(93);
	
	Breadcrumb = __webpack_require__(96);
	
	MenuBar = __webpack_require__(97);
	
	__webpack_require__(100);
	
	__webpack_require__(101);
	
	__webpack_require__(18);
	
	__webpack_require__(102);
	
	__webpack_require__(103);
	
	__webpack_require__(18);
	
	UIView = (function(superClass) {
	  extend(UIView, superClass);
	
	  function UIView() {
	    this.animate = bind(this.animate, this);
	    this.onUiWindowResize = bind(this.onUiWindowResize, this);
	    this.showApplication = bind(this.showApplication, this);
	    this.initResizeSlider = bind(this.initResizeSlider, this);
	    this.initBottomToolbox = bind(this.initBottomToolbox, this);
	    this.initDisplayModeSwitch = bind(this.initDisplayModeSwitch, this);
	    this.switchDisplayMode = bind(this.switchDisplayMode, this);
	    this.scrollTo = bind(this.scrollTo, this);
	    this.setupMouseScroll = bind(this.setupMouseScroll, this);
	    this.setDisplayMode = bind(this.setDisplayMode, this);
	    this.initLayout = bind(this.initLayout, this);
	    this.initMenubar = bind(this.initMenubar, this);
	    this.clearWorkspace = bind(this.clearWorkspace, this);
	    return UIView.__super__.constructor.apply(this, arguments);
	  }
	
	  UIView.svg = false;
	
	  UIView.connecting_line = false;
	
	  UIView.prototype.initialize = function(options) {
	    var ui_tmpl;
	    UIView.__super__.initialize.apply(this, arguments);
	    this.settings = options.settings;
	    this.is_grabbing = false;
	    $(window).resize(this.onUiWindowResize);
	    ui_tmpl = _.template(_view_app_ui, {});
	    this.$el.append(ui_tmpl);
	    this.breadcrumb = new Breadcrumb({
	      el: $("#breadcrumb")
	    });
	    UIView.svg = Raphael("graph", 4000, 4000);
	    UIView.connecting_line = UIView.svg.path("M0 -20 L0 -20").attr({
	      stroke: "#fff",
	      'stroke-dasharray': "-",
	      fill: "none",
	      opacity: 1
	    });
	    this.sidebar = new Sidebar({
	      el: $("#sidebar"),
	      settings: this.settings
	    });
	    this.initMenubar();
	    this.initLayout();
	    this.showApplication();
	    this.onUiWindowResize();
	    return this.animate();
	  };
	
	  UIView.prototype.clearWorkspace = function() {
	    this.sidebar.clearWorkspace();
	    return $("#tab-attribute").html("");
	  };
	
	  UIView.prototype.initMenubar = function() {
	    var $menu_tmpl, menu_tmpl;
	    menu_tmpl = _.template(MenuBar.template, {});
	    $menu_tmpl = $(menu_tmpl).prependTo("body");
	    this.menubar = new MenuBar({
	      el: $menu_tmpl
	    });
	    this.menubar.on("ToggleAttributes", (function(_this) {
	      return function() {
	        if (_this.layout) {
	          return _this.layout.toggle("west");
	        }
	      };
	    })(this));
	    this.menubar.on("ToggleLibrary", (function(_this) {
	      return function() {
	        if (_this.layout) {
	          return _this.layout.toggle("east");
	        }
	      };
	    })(this));
	    this.menubar.on("ToggleTimeline", (function(_this) {
	      return function() {
	        if (_this.layout) {
	          return _this.layout.toggle("south");
	        }
	      };
	    })(this));
	    return this;
	  };
	
	  UIView.prototype.initLayout = function() {
	    this.makeSelectable();
	    this.setupMouseScroll();
	    this.initBottomToolbox();
	    this.initDisplayModeSwitch();
	    this.layout = $('body').layout({
	      scrollToBookmarkOnLoad: false,
	      animatePaneSizing: false,
	      fxName: 'none',
	      center: {
	        size: "100%"
	      },
	      north: {
	        closable: false,
	        resizable: false,
	        slidable: false,
	        showOverflowOnHover: true,
	        size: 27,
	        resizerClass: "ui-layout-resizer-hidden",
	        spacing_open: 0,
	        spacing_closed: 0
	      },
	      east: {
	        minSize: 220,
	        initClosed: true,
	        onresize: (function(_this) {
	          return function(name, pane_el, state, opt, layout_name) {
	            return _this.onUiWindowResize();
	          };
	        })(this),
	        onopen: (function(_this) {
	          return function(name, pane_el, state, opt, layout_name) {
	            return _this.onUiWindowResize();
	          };
	        })(this),
	        onclose: (function(_this) {
	          return function(name, pane_el, state, opt, layout_name) {
	            return _this.onUiWindowResize();
	          };
	        })(this)
	      },
	      west: {
	        minSize: 220
	      },
	      south: {
	        minSize: 48,
	        size: 48,
	        onopen: (function(_this) {
	          return function(name, pane_el, state, opt, layout_name) {
	            _this.trigger("timelineResize", pane_el.innerHeight());
	            return _this.onUiWindowResize();
	          };
	        })(this),
	        onclose: (function(_this) {
	          return function(name, pane_el, state, opt, layout_name) {
	            _this.trigger("timelineResize", pane_el.innerHeight());
	            return _this.onUiWindowResize();
	          };
	        })(this),
	        onresize: (function(_this) {
	          return function(name, pane_el, state, opt, layout_name) {
	            _this.trigger("timelineResize", pane_el.innerHeight());
	            return _this.onUiWindowResize();
	          };
	        })(this)
	      }
	    });
	    this.trigger("timelineResize", 48);
	    return this;
	  };
	
	  UIView.prototype.makeSelectable = function() {
	    $("#container").selectable({
	      filter: ".nodes-container >div",
	      stop: (function(_this) {
	        return function(event, ui) {
	          var $selected, nodes;
	          $selected = $(".node.ui-selected");
	          nodes = [];
	          $selected.each(function() {
	            var ob, obgrp;
	            ob = $(this).data("object");
	            if (!ob.get("parent")) {
	              return nodes.push(ob);
	            } else {
	              obgrp = ob.get("parent");
	              if (!_.find(nodes, function(n) {
	                return n.id === obgrp.id;
	              })) {
	                return nodes.push(obgrp);
	              }
	            }
	          });
	          _this.sidebar.clearNodesAttributes();
	          return _this.sidebar.renderNodesAttributes(nodes);
	        };
	      })(this)
	    });
	    $("#container").mousedown(function(e) {
	      return $('input, textarea').trigger('blur');
	    });
	    return this;
	  };
	
	  UIView.prototype.setDisplayMode = function(is_player) {
	    if (is_player == null) {
	      is_player = false;
	    }
	    if (is_player === true) {
	      $("body").addClass("player-mode");
	      $("body").removeClass("editor-mode");
	      $("#display-mode-switch").html("");
	    } else {
	      $("body").addClass("editor-mode");
	      $("body").removeClass("player-mode");
	      $("#display-mode-switch").html("player mode");
	    }
	    $("#display-mode-switch").toggleClass("icon-pencil", is_player);
	    this.settings.player_mode = is_player;
	    if (is_player === false) {
	      this.trigger("renderConnections");
	    }
	    return true;
	  };
	
	  UIView.prototype.setupMouseScroll = function() {
	    var is_from_target;
	    this.scroll_target = $("#container-wrapper");
	    is_from_target = function(e) {
	      if (e.target === $("#graph svg")[0]) {
	        return true;
	      }
	      return false;
	    };
	    this.scroll_target.bind("contextmenu", function(e) {
	      return false;
	    });
	    this.scroll_target.mousedown((function(_this) {
	      return function(e) {
	        if (is_from_target(e) && (e.which === 2 || e.which === 3)) {
	          _this.is_grabbing = true;
	          _this.xp = e.pageX;
	          _this.yp = e.pageY;
	          return false;
	        }
	      };
	    })(this));
	    this.scroll_target.mousemove((function(_this) {
	      return function(e) {
	        if (is_from_target(e) && (_this.is_grabbing === true)) {
	          _this.scrollTo(_this.xp - e.pageX, _this.yp - e.pageY);
	          _this.xp = e.pageX;
	          return _this.yp = e.pageY;
	        }
	      };
	    })(this));
	    this.scroll_target.mouseout((function(_this) {
	      return function() {
	        return _this.is_grabbing = false;
	      };
	    })(this));
	    this.scroll_target.mouseup((function(_this) {
	      return function(e) {
	        if (is_from_target(e) && (e.which === 2 || e.which === 3)) {
	          return _this.is_grabbing = false;
	        }
	      };
	    })(this));
	    return true;
	  };
	
	  UIView.prototype.scrollTo = function(dx, dy) {
	    var x, y;
	    x = this.scroll_target.scrollLeft() + dx;
	    y = this.scroll_target.scrollTop() + dy;
	    return this.scroll_target.scrollLeft(x).scrollTop(y);
	  };
	
	  UIView.prototype.switchDisplayMode = function() {
	    this.setDisplayMode(!this.settings.player_mode);
	    return this;
	  };
	
	  UIView.prototype.initDisplayModeSwitch = function() {
	    $("body").append("<div id='display-mode-switch'>switch mode</div>");
	    return $("#display-mode-switch").click((function(_this) {
	      return function(e) {
	        return _this.switchDisplayMode();
	      };
	    })(this));
	  };
	
	  UIView.prototype.initBottomToolbox = function() {
	    var $container;
	    $("body").append("<div id='bottom-toolbox'></div>");
	    $container = $("#bottom-toolbox");
	    return this.initResizeSlider($container);
	  };
	
	  UIView.prototype.initResizeSlider = function($container) {
	    var scale_graph;
	    $container.append("<div id='zoom-slider'></div>");
	    scale_graph = function(val) {
	      var factor;
	      factor = val / 100;
	      return $("#container").css('transform', "scale(" + factor + ", " + factor + ")");
	    };
	    return $("#zoom-slider").slider({
	      min: 25,
	      step: 25,
	      value: 100,
	      change: function(event, ui) {
	        return scale_graph(ui.value);
	      },
	      slide: function(event, ui) {
	        return scale_graph(ui.value);
	      }
	    });
	  };
	
	  UIView.prototype.showApplication = function() {
	    var delay_intro;
	    delay_intro = 500;
	    $("body > header").delay(delay_intro).hide();
	    $("#sidebar").delay(delay_intro).show();
	    $("#container-wrapper").delay(delay_intro).show();
	    return this.trigger("renderConnections");
	  };
	
	  UIView.prototype.onUiWindowResize = function() {
	    var margin_bottom, margin_right;
	    margin_bottom = 20;
	    margin_right = 25;
	    if (this.layout.south.state.isClosed === false) {
	      margin_bottom += $("#timeline").innerHeight();
	    }
	    if (this.layout.east.state.isClosed === false) {
	      margin_right += $("#library").innerWidth();
	    }
	    $("#bottom-toolbox").attr("style", "bottom: " + margin_bottom + "px !important; right: " + margin_right + "px");
	    return $("#webgl-window").css({
	      right: margin_right
	    });
	  };
	
	  UIView.prototype.animate = function() {
	    this.trigger("render");
	    return requestAnimationFrame(this.animate);
	  };
	
	  return UIView;
	
	})(Backbone.View);
	
	module.exports = UIView;


/***/ }),
/* 92 */
/***/ (function(module, exports) {

	module.exports = "<div id='container-wrapper' class=\"ui-layout-center\">\n  <div id='container'>\n    <div id='graph'></div>\n  </div>\n  <div id=\"breadcrumb\"></div>\n</div>\n<div id='sidebar' class=\"ui-layout-west\">\n  <ul class=\"ui-layout-north\">\n    <li><a href='#tab-new'>New</a></li>\n    <li><a href='#tab-attribute'>Attributes</a></li>\n    <!-- <li><a href='#tab-list'>List</a></li> -->\n  </ul>\n  <div class=\"container ui-layout-center\">\n    <div id='tab-attribute'></div>\n    <div id='tab-new'>\n      <!-- <input id='node_filter' name='search-node' placeholder='Search' type='input' /> -->\n    </div>\n    <!-- <div id='tab-list'></div> -->\n  </div>\n</div>\n<div id=\"library\" class=\"ui-layout-east\"></div>\n<div id=\"timeline\" class=\"ui-layout-south\"></div>\n<input id='main_file_input_open' multiple='false' type='file' />\n";

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

	var Backbone, NodeSidebarView, Sidebar, TreeView, _,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(2);
	
	Backbone = __webpack_require__(3);
	
	NodeSidebarView = __webpack_require__(94);
	
	TreeView = __webpack_require__(95);
	
	__webpack_require__(18);
	
	
	/* Sidebar View */
	
	Sidebar = (function(superClass) {
	  extend(Sidebar, superClass);
	
	  function Sidebar() {
	    this.renderArrow = bind(this.renderArrow, this);
	    this.initNewNode = bind(this.initNewNode, this);
	    this.nodeClick = bind(this.nodeClick, this);
	    this.initSearch = bind(this.initSearch, this);
	    this.filterList = bind(this.filterList, this);
	    this.filterListItem = bind(this.filterListItem, this);
	    this.renderNodesAttributes = bind(this.renderNodesAttributes, this);
	    this.clearNodesAttributes = bind(this.clearNodesAttributes, this);
	    this.initTabs = bind(this.initTabs, this);
	    this.clearWorkspace = bind(this.clearWorkspace, this);
	    this.render = bind(this.render, this);
	    this.initTreeView = bind(this.initTreeView, this);
	    return Sidebar.__super__.constructor.apply(this, arguments);
	  }
	
	  Sidebar.prototype.initialize = function(options) {
	    Sidebar.__super__.initialize.apply(this, arguments);
	    this.settings = options.settings;
	    this.node_views = [];
	    this.initNewNode();
	    this.initSearch();
	    this.initTabs();
	    return this.layout = this.$el.layout({
	      scrollToBookmarkOnLoad: false,
	      north: {
	        closable: false,
	        resizable: false,
	        slidable: false,
	        resizerClass: "ui-layout-resizer-hidden",
	        spacing_open: 0,
	        spacing_closed: 0
	      },
	      center: {
	        size: "100%"
	      }
	    });
	  };
	
	  Sidebar.prototype.initTreeView = function() {
	    this.treeview = new TreeView({
	      el: $("#tab-list")
	    });
	    return this;
	  };
	
	  Sidebar.prototype.render = function(nodes) {
	    if (this.treeview) {
	      return this.treeview.render(nodes);
	    }
	  };
	
	  Sidebar.prototype.clearWorkspace = function() {};
	
	  Sidebar.prototype.initTabs = function() {
	    this.$el.tabs({
	      fx: {
	        opacity: 'toggle',
	        duration: 100
	      }
	    });
	    return this;
	  };
	
	  Sidebar.prototype.clearNodesAttributes = function() {
	    var $target, removeExistingNodes;
	    removeExistingNodes = (function(_this) {
	      return function() {
	        if (_this.node_views.length > 0) {
	          _.each(_this.node_views, function(view) {
	            return view.remove();
	          });
	          return _this.node_views = [];
	        }
	      };
	    })(this);
	    removeExistingNodes();
	    $target = $("#tab-attribute");
	    $target.html("");
	    return this;
	  };
	
	  Sidebar.prototype.renderNodesAttributes = function(nodes) {
	    var $target, i, len, node, nodes_grp, view;
	    $target = $("#tab-attribute");
	    if (!nodes || nodes.length < 1) {
	      return this;
	    }
	    for (i = 0, len = nodes.length; i < len; i++) {
	      node = nodes[i];
	      if (node.get("type") !== "Group") {
	        view = new NodeSidebarView({
	          model: node
	        });
	        $target.append(view.el);
	        this.node_views.push(view);
	      } else {
	        $target.append("<h3>" + (node.get("name")) + "</h3>");
	        nodes_grp = node.nodes.models;
	        this.renderNodesAttributes(nodes_grp);
	      }
	    }
	    return this;
	  };
	
	  Sidebar.prototype.filterListItem = function($item, value) {
	    var s;
	    s = $.trim($("a", $item).html()).toLowerCase();
	    if (s.indexOf(value) === -1) {
	      return $item.hide();
	    } else {
	      return $item.show();
	    }
	  };
	
	  Sidebar.prototype.filterList = function(ul, value) {
	    var has_visible_items, self, ul_title;
	    self = this;
	    ul_title = ul.prev();
	    has_visible_items = false;
	    $("li", ul).each(function() {
	      return self.filterListItem($(this), value);
	    });
	    if ($("li:visible", ul).length === 0) {
	      ul_title.hide();
	    } else {
	      ul_title.show();
	    }
	    return this;
	  };
	
	  Sidebar.prototype.initSearch = function() {
	    var self;
	    self = this;
	    $("#node_filter").keyup(function(e) {
	      var v;
	      v = $.trim($("#node_filter").val()).toLowerCase();
	      if (v === "") {
	        return $("#tab-new li, #tab-new h3").show();
	      } else {
	        return $("#tab-new ul").each(function() {
	          return self.filterList($(this), v);
	        });
	      }
	    });
	    return this;
	  };
	
	  Sidebar.prototype.nodeClick = function(e) {
	    var dir, rel;
	    dir = true;
	    rel = $(e.currentTarget).attr('rel');
	    if (rel === 'Direction') {
	      dir = true;
	    } else if (rel === 'NoDirection') {
	      dir = false;
	    }
	    this.settings.direction = dir;
	    return this.renderArrow();
	  };
	
	  Sidebar.prototype.initNewNode = function() {
	    var $container, group, group_name, i, len, node, nodes_by_group, ref, result, self;
	    self = this;
	    $container = $("#tab-new");
	    result = [];
	    nodes_by_group = {
	      Shape: [],
	      Arrow: [],
	      Base: [],
	      Conditional: [],
	      Math: [],
	      Code: [],
	      Utils: [],
	      Three: [],
	      Geometry: [],
	      Materials: [],
	      Lights: [],
	      PostProcessing: [],
	      Spread: [],
	      Particle: [],
	      "Particle-sparks": [],
	      "Particle-sparks-initializers": [],
	      "Particle-sparks-actions": [],
	      "Particle-sparks-zone": [],
	      "Constructive-Geometry": []
	    };
	    for (node in ThreeNodes.Core.nodes.models) {
	      if (ThreeNodes.Core.nodes.models[node].group_name) {
	        group_name = ThreeNodes.Core.nodes.models[node].group_name.replace(/\./g, "-");
	        if (!nodes_by_group[group_name]) {
	          nodes_by_group[group_name] = [];
	        }
	        nodes_by_group[group_name].push(node);
	      }
	    }
	    for (group in nodes_by_group) {
	      $container.append("<h3>" + group + "</h3><ul id='nodetype-" + group + "'></ul>");
	      ref = nodes_by_group[group];
	      for (i = 0, len = ref.length; i < len; i++) {
	        node = ref[i];
	        $("#nodetype-" + group, $container).append("<li><a class='button' rel='" + node + "' href='#'>" + ThreeNodes.Core.nodes.models[node].node_name + "</a></li>");
	      }
	    }
	    $("a.button", $container).draggable({
	      revert: "valid",
	      opacity: 0.7,
	      helper: "clone",
	      revertDuration: 0,
	      scroll: false,
	      containment: "document"
	    });
	    this.renderArrow();
	    $("#nodetype-Arrow li a").bind('click', this.nodeClick);
	    return this;
	  };
	
	  Sidebar.prototype.renderArrow = function() {
	    var rel;
	    rel = '';
	    if (this.settings.direction) {
	      rel = 'Direction';
	    } else {
	      rel = 'NoDirection';
	    }
	    $("#nodetype-Arrow a.button").css({
	      background: "#313638"
	    });
	    return $("#nodetype-Arrow a.button[rel='" + rel + "']").css({
	      background: '#191c1d'
	    });
	  };
	
	  return Sidebar;
	
	})(Backbone.View);
	
	module.exports = Sidebar;


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

	var Backbone, NodeSidebarView, _,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(2);
	
	Backbone = __webpack_require__(3);
	
	
	/* NodeSidebarView */
	
	NodeSidebarView = (function(superClass) {
	  extend(NodeSidebarView, superClass);
	
	  function NodeSidebarView() {
	    this.render = bind(this.render, this);
	    this.displayFields = bind(this.displayFields, this);
	    return NodeSidebarView.__super__.constructor.apply(this, arguments);
	  }
	
	  NodeSidebarView.prototype.initialize = function(options) {
	    NodeSidebarView.__super__.initialize.apply(this, arguments);
	    return this.render();
	  };
	
	  NodeSidebarView.prototype.displayFields = function(fields) {
	    var f, field, results, view, view_class;
	    results = [];
	    for (f in fields) {
	      field = fields[f];
	      view_class = field.constructor.VIEW;
	      if (view_class !== false) {
	        view = new view_class({
	          model: field
	        });
	        results.push(this.$el.append(view.el));
	      } else {
	        results.push(void 0);
	      }
	    }
	    return results;
	  };
	
	  NodeSidebarView.prototype.render = function() {
	    var $inputs_form, self;
	    return;
	    this.$el.html("<h2>" + (this.model.get('name')) + "</h2>");
	    this.displayFields(this.model.fields.inputs);
	    if (this.model.onCodeUpdate) {
	      self = this;
	      this.$el.append("<h2>Add custom fields</h2>");
	      $inputs_form = $('<form class="dynamic-fields__form"></form>');
	      $inputs_form.append('<input type="text" name="key" placeholder="key" />');
	      $inputs_form.append('<input type="text" name="type" placeholder="type" />');
	      $inputs_form.append('<input type="submit" value="Add input field" />');
	      this.$el.append($inputs_form);
	      $inputs_form.on('submit', function(e) {
	        var $form, $key, $type, key, type;
	        e.preventDefault();
	        $form = $(this);
	        $key = $(this).find('[name="key"]');
	        $type = $(this).find('[name="type"]');
	        type = 'Any';
	        if ($.trim($type.val()) !== '') {
	          type = $.trim($type.val());
	        }
	        key = $.trim($key.val());
	        if (key !== '') {
	          self.model.addCustomField(key, type, 'inputs');
	          $key.val('');
	          $type.val('');
	          return self.render();
	        }
	      });
	    }
	    return this;
	  };
	
	  return NodeSidebarView;
	
	})(Backbone.View);
	
	module.exports = NodeSidebarView;


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

	var Backbone, TreeView, _,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(2);
	
	Backbone = __webpack_require__(3);
	
	__webpack_require__(18);
	
	TreeView = (function(superClass) {
	  extend(TreeView, superClass);
	
	  function TreeView() {
	    this.render = bind(this.render, this);
	    return TreeView.__super__.constructor.apply(this, arguments);
	  }
	
	  TreeView.prototype.initialize = function(options) {
	    TreeView.__super__.initialize.apply(this, arguments);
	    return this.timeoutId = false;
	  };
	
	  TreeView.prototype.render = function(nodelist) {
	    var data, i, id, len, node, ref, renderNode, terminalNodes;
	    if (this.$el.data("tree")) {
	      this.$el.tree("destroy");
	    }
	    if (nodelist === false) {
	      this.$el.html("");
	      return this;
	    }
	    data = [];
	    terminalNodes = {};
	    ref = nodelist.models;
	    for (i = 0, len = ref.length; i < len; i++) {
	      node = ref[i];
	      if (node.hasOutConnection() === false) {
	        terminalNodes[node.attributes["id"]] = node;
	      }
	    }
	    renderNode = (function(_this) {
	      return function(node) {
	        var j, len1, result, upnode, upstreamNodes;
	        result = {};
	        result.label = node.get("name");
	        result.model = node;
	        result.children = [];
	        upstreamNodes = node.getUpstreamNodes();
	        for (j = 0, len1 = upstreamNodes.length; j < len1; j++) {
	          upnode = upstreamNodes[j];
	          result.children.push(renderNode(upnode));
	        }
	        return result;
	      };
	    })(this);
	    for (id in terminalNodes) {
	      data.push(renderNode(terminalNodes[id]));
	    }
	    this.$el.tree({
	      data: data,
	      autoOpen: true,
	      selectable: true
	    });
	    this.$el.bind("tree.click", (function(_this) {
	      return function(e) {
	        var selectable;
	        node = e.node.model;
	        $(".node").removeClass("ui-selected");
	        node.trigger("node:addSelectedClass");
	        selectable = $("#container").data("selectable");
	        selectable.refresh();
	        return selectable._mouseStop(null);
	      };
	    })(this));
	    return this;
	  };
	
	  return TreeView;
	
	})(Backbone.View);
	
	module.exports = TreeView;


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

	var Backbone, Breadcrumb, _,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(2);
	
	Backbone = __webpack_require__(3);
	
	Breadcrumb = (function(superClass) {
	  extend(Breadcrumb, superClass);
	
	  function Breadcrumb() {
	    this.onClick = bind(this.onClick, this);
	    this.set = bind(this.set, this);
	    this.reset = bind(this.reset, this);
	    return Breadcrumb.__super__.constructor.apply(this, arguments);
	  }
	
	  Breadcrumb.prototype.initialize = function() {
	    Breadcrumb.__super__.initialize.apply(this, arguments);
	    return this.$el.click(this.onClick);
	  };
	
	  Breadcrumb.prototype.reset = function() {
	    this.items = [];
	    return this.$el.html("");
	  };
	
	  Breadcrumb.prototype.set = function(items) {
	    var i, id, item, len, name, results;
	    this.items = items;
	    this.$el.html("<a href='#' data-id='global'>Global</a>");
	    results = [];
	    for (i = 0, len = items.length; i < len; i++) {
	      item = items[i];
	      name = item.get("name");
	      id = item.get("id");
	      results.push(this.$el.append(" ▶ " + ("<a href='#' class='grp' data-id='" + id + "'>" + name + "</a>")));
	    }
	    return results;
	  };
	
	  Breadcrumb.prototype.onClick = function(e) {
	    var id;
	    id = $(e.target).data("id");
	    if (id === "global") {
	      return this.trigger("click", "global");
	    }
	  };
	
	  return Breadcrumb;
	
	})(Backbone.View);
	
	module.exports = Breadcrumb;


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

	var Backbone, MenuBar, _, _view_menubar,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(2);
	
	Backbone = __webpack_require__(3);
	
	_view_menubar = __webpack_require__(98);
	
	__webpack_require__(99);
	
	MenuBar = (function(superClass) {
	  extend(MenuBar, superClass);
	
	  function MenuBar() {
	    this.onLinkClick = bind(this.onLinkClick, this);
	    return MenuBar.__super__.constructor.apply(this, arguments);
	  }
	
	  MenuBar.template = _view_menubar;
	
	  MenuBar.prototype.initialize = function() {
	    var self;
	    this.$el.menubar();
	    self = this;
	    $("a", this.$el).click(function(event) {
	      var url;
	      if ($(this).next().is("ul")) {
	        return false;
	      }
	      url = $(this).attr('href').substr(1);
	      return self.onLinkClick(event, this, url);
	    });
	    return $("#main_file_input_open").change((function(_this) {
	      return function(e) {
	        return _this.trigger("LoadFile", e);
	      };
	    })(this));
	  };
	
	  MenuBar.prototype.onLinkClick = function(event, link, url) {
	    var data_attr, data_event;
	    data_event = $(link).data("event");
	    data_attr = $(link).data("eventData");
	    if (data_event) {
	      this.trigger(data_event, data_attr);
	      switch (data_event) {
	        case "ClearWorkspace":
	          Backbone.history.navigate("", false);
	          break;
	        case "OpenFile":
	          $("#main_file_input_open").click();
	      }
	      return true;
	    }
	    return true;
	  };
	
	  return MenuBar;
	
	})(Backbone.View);
	
	module.exports = MenuBar;


/***/ }),
/* 98 */
/***/ (function(module, exports) {

	module.exports = "<ul id=\"main-menu-bar\" class=\"menubar ui-layout-north\">\n  <li>\n    <a href=\"#File\">File</a>\n    <ul>\n      <li><a href=\"#NewFile\" data-event=\"ClearWorkspace\">New</a></li>\n      <li><a href=\"#OpenFile\" data-event=\"OpenFile\">Open</a></li>\n      <li><a href=\"#SaveFile\" data-event=\"SaveFile\">Save</a></li>\n    </ul>\n  </li>\n  <li>\n    <a href=\"#Edit\">Edit</a>\n    <ul>\n      <li><a href=\"#AutoLayout\" data-event=\"AutoLayout\">AutoLayout</a></li>\n      <li><a href=\"#GroupSelectedNodes\" data-event=\"GroupSelectedNodes\">Group selected nodes</a></li>\n    </ul>\n  </li>\n  <li>\n    <a href=\"#View\">View</a>\n    <ul>\n      <li><a href=\"#Library\" data-event=\"ToggleLibrary\">Library</a></li>\n      <li><a href=\"#Attributes\" data-event=\"ToggleAttributes\">Attributes</a></li>\n    </ul>\n  </li>\n  <li class=\"expanded\">\n    <a href=\"#examples\">Examples</a>\n    <ul>\n      <li><a href=\"#example/rotating_cube1.json\">Eagle Eye</a></li>\n      <li><a href=\"#example/geometry_and_material1.json\">VVR</a></li>\n    </ul>\n  </li>\n</ul>\n";

/***/ }),
/* 99 */
/***/ (function(module, exports) {

	/*!
	 * jQuery UI Menubar @VERSION
	 * http://jqueryui.com
	 *
	 * Copyright 2013 jQuery Foundation and other contributors
	 * Released under the MIT license.
	 * http://jquery.org/license
	 *
	 * http://api.jqueryui.com/menubar/
	 *
	 * Depends:
	 *  jquery.ui.core.js
	 *  jquery.ui.widget.js
	 *  jquery.ui.position.js
	 *  jquery.ui.menu.js
	 */
	(function( $ ) {
	
	$.widget( "ui.menubar", {
	  version: "@VERSION",
	  options: {
	    items: "li",
	    menus: "ul",
	    icons: {
	      dropdown: "ui-icon-triangle-1-s"
	    },
	    position: {
	      my: "left top",
	      at: "left bottom"
	    },
	
	    // callbacks
	    select: null
	  },
	
	  _create: function() {
	    // Top-level elements containing the submenu-triggering elem
	    this.menuItems = this.element.children( this.options.items );
	
	    // Links or buttons in menuItems, triggers of the submenus
	    this.items = this.menuItems.children( "button, a" );
	
	    // Keep track of open submenus
	    this.openSubmenus = 0;
	
	    this._initializeWidget();
	    this._initializeMenuItems();
	    this._initializeItems();
	  },
	
	  _initializeWidget: function() {
	    this.element
	      .addClass( "ui-menubar ui-widget-header ui-helper-clearfix" )
	      .attr( "role", "menubar" );
	    this._on({
	      keydown: function( event ) {
	        var active;
	
	        // If we are in a nested sub-sub-menu and we see an ESCAPE
	        // we must close recursively.
	        if ( event.keyCode === $.ui.keyCode.ESCAPE &&
	            this.active &&
	            this.active.menu( "collapse", event ) !== true ) {
	          active = this.active;
	          this.active.blur();
	          this._close( event );
	          $( event.target ).blur().mouseleave();
	          active.prev().focus();
	        }
	      },
	      focusin: function() {
	        clearTimeout( this.closeTimer );
	      },
	      focusout: function( event ) {
	        this.closeTimer = this._delay( function() {
	          this._close( event );
	          this.items.attr( "tabIndex", -1 );
	          this.lastFocused.attr( "tabIndex", 0 );
	        }, 150 );
	      },
	      "mouseenter .ui-menubar-item": function() {
	        clearTimeout( this.closeTimer );
	      }
	    } );
	  },
	
	  _initializeMenuItems: function() {
	    var subMenus,
	      menubar = this;
	
	    this.menuItems
	      .addClass( "ui-menubar-item" )
	      .attr( "role", "presentation" )
	      // TODO why do these not work when moved to CSS?
	      .css({
	        "border-width": "1px",
	        "border-style": "hidden"
	      });
	
	    subMenus = this.menuItems.children( menubar.options.menus ).menu({
	      position: {
	        within: this.options.position.within
	      },
	      select: function( event, ui ) {
	        // TODO don't hardcode markup selectors
	        ui.item.parents( "ul.ui-menu:last" ).hide();
	        menubar._close();
	        ui.item.parents( ".ui-menubar-item" ).children().first().focus();
	        menubar._trigger( "select", event, ui );
	      },
	      menus: this.options.menus
	    })
	      .hide()
	      .attr({
	        "aria-hidden": "true",
	        "aria-expanded": "false"
	      });
	
	    this._on( subMenus, {
	      keydown: function( event ) {
	        // TODO why is this needed?
	        $( event.target ).attr( "tabIndex", 0 );
	        var parentButton,
	          menu = $( this );
	        // TODO why are there keydown events on a hidden menu?
	        if ( menu.is( ":hidden" ) ) {
	          return;
	        }
	        switch ( event.keyCode ) {
	        case $.ui.keyCode.LEFT:
	          // TODO why can't this call menubar.previous()?
	          parentButton = menubar.active.prev( ".ui-button" );
	
	          if ( this.openSubmenus ) {
	            this.openSubmenus--;
	          } else if ( this._hasSubMenu( parentButton.parent().prev() ) ) {
	            menubar.active.blur();
	            menubar._open( event, parentButton.parent().prev().find( ".ui-menu" ) );
	          } else {
	            parentButton.parent().prev().find( ".ui-button" ).focus();
	            menubar._close( event );
	            this.open = true;
	          }
	
	          event.preventDefault();
	          // TODO same as above where it's set to 0
	          $( event.target ).attr( "tabIndex", -1 );
	          break;
	        case $.ui.keyCode.RIGHT:
	          this.next( event );
	          event.preventDefault();
	          break;
	        }
	      },
	      focusout: function( event ) {
	        // TODO why does this have to use event.target? Is that different from currentTarget?
	        $( event.target ).removeClass( "ui-state-focus" );
	      }
	    });
	
	    this.menuItems.each(function( index, menuItem ) {
	      menubar._identifyMenuItemsNeighbors( $( menuItem ), menubar, index );
	    });
	
	  },
	
	  _hasSubMenu: function( menuItem ) {
	    return $( menuItem ).children( this.options.menus ).length > 0;
	  },
	
	  // TODO get rid of these - currently still in use in _move
	  _identifyMenuItemsNeighbors: function( menuItem, menubar, index ) {
	    var collectionLength = this.menuItems.length,
	      isFirstElement = ( index === 0 ),
	      isLastElement = ( index === ( collectionLength - 1 ) );
	
	    if ( isFirstElement ) {
	      menuItem.data( "prevMenuItem", $( this.menuItems[collectionLength - 1]) );
	      menuItem.data( "nextMenuItem", $( this.menuItems[index+1]) );
	    } else if ( isLastElement ) {
	      menuItem.data( "nextMenuItem", $( this.menuItems[0]) );
	      menuItem.data( "prevMenuItem", $( this.menuItems[index-1]) );
	    } else {
	      menuItem.data( "nextMenuItem", $( this.menuItems[index+1]) );
	      menuItem.data( "prevMenuItem", $( this.menuItems[index-1]) );
	    }
	  },
	
	  _initializeItems: function() {
	    var menubar = this;
	
	    this._focusable( this.items );
	    this._hoverable( this.items );
	
	    // let only the first item receive focus
	    this.items.slice(1).attr( "tabIndex", -1 );
	
	    this.items.each(function( index, item ) {
	      menubar._initializeItem( $( item ), menubar );
	    });
	  },
	
	  _initializeItem: function( anItem ) {
	    var menuItemHasSubMenu = this._hasSubMenu( anItem.parent() );
	
	    anItem
	      .addClass( "ui-button ui-widget ui-button-text-only ui-menubar-link" )
	      .attr( "role", "menuitem" )
	      .wrapInner( "<span class='ui-button-text'></span>" );
	
	    this._on( anItem, {
	      focus:  function( event ){
	        anItem.attr( "tabIndex", 0 );
	        anItem.addClass( "ui-state-focus" );
	        event.preventDefault();
	      },
	      focusout:  function( event ){
	        anItem.attr( "tabIndex", -1 );
	        this.lastFocused = anItem;
	        anItem.removeClass( "ui-state-focus" );
	        event.preventDefault();
	      }
	    } );
	
	    if ( menuItemHasSubMenu ) {
	      this._on( anItem, {
	        click: this._mouseBehaviorForMenuItemWithSubmenu,
	        focus: this._mouseBehaviorForMenuItemWithSubmenu,
	        mouseenter: this._mouseBehaviorForMenuItemWithSubmenu
	      });
	
	      this._on( anItem, {
	        keydown: function( event ) {
	          switch ( event.keyCode ) {
	          case $.ui.keyCode.SPACE:
	          case $.ui.keyCode.UP:
	          case $.ui.keyCode.DOWN:
	            this._open( event, $( event.target ).next() );
	            event.preventDefault();
	            break;
	          case $.ui.keyCode.LEFT:
	            this.previous( event );
	            event.preventDefault();
	            break;
	          case $.ui.keyCode.RIGHT:
	            this.next( event );
	            event.preventDefault();
	            break;
	          case $.ui.keyCode.TAB:
	            break;
	          }
	        }
	      });
	
	      anItem.attr( "aria-haspopup", "true" );
	      if ( this.options.icons ) {
	        anItem.append( "<span class='ui-button-icon-secondary ui-icon " + this.options.icons.dropdown + "'></span>" );
	        anItem.removeClass( "ui-button-text-only" ).addClass( "ui-button-text-icon-secondary" );
	      }
	    } else {
	      this._on( anItem, {
	        click: function() {
	          if ( this.active ) {
	            this._close();
	          } else {
	            this.open = true;
	            this.active = $( anItem ).parent();
	          }
	        },
	        mouseenter: function() {
	          if ( this.open ) {
	            this.stashedOpenMenu = this.active;
	            this._close();
	          }
	        },
	        keydown: function( event ) {
	          if ( event.keyCode === $.ui.keyCode.LEFT ) {
	            this.previous( event );
	            event.preventDefault();
	          } else if ( event.keyCode === $.ui.keyCode.RIGHT ) {
	            this.next( event );
	            event.preventDefault();
	          }
	        }
	      });
	    }
	  },
	
	  // TODO silly name, too much complexity
	  // TODO why is this used for three types of events?
	  _mouseBehaviorForMenuItemWithSubmenu: function( event ) {
	    var isClickingToCloseOpenMenu, menu;
	
	    // ignore triggered focus event
	    if ( event.type === "focus" && !event.originalEvent ) {
	      return;
	    }
	    event.preventDefault();
	
	    menu = $(event.target).parents( ".ui-menubar-item" ).children( this.options.menus );
	
	    // If we have an open menu and we see a click on the menuItem
	    // and the menu thereunder is the same as the active menu, close it.
	    // Succinctly: toggle menu open / closed  on the menuItem
	    isClickingToCloseOpenMenu = event.type === "click" &&
	      menu.is( ":visible" ) &&
	      this.active &&
	      this.active[0] === menu[0];
	
	    if ( isClickingToCloseOpenMenu ) {
	      this._close();
	      return;
	    }
	    if ( event.type === "mouseenter" ) {
	      this.element.find( ":focus" ).focusout();
	      if ( this.stashedOpenMenu ) {
	        this._open( event, menu);
	      }
	      this.stashedOpenMenu = undefined;
	    }
	    // If we already opened a menu and then changed to be "over" another MenuItem ||
	    // we clicked on a new menuItem (whether open or not) or if we auto expand (i.e.
	    // we expand regardless of click if there is a submenu
	    if ( ( this.open && event.type === "mouseenter" ) || event.type === "click" ) {
	      clearTimeout( this.closeTimer );
	      this._open( event, menu );
	      // Stop propagation so that menuItem mouseenter doesn't fire.  If it does it
	      // takes the "selected" status off off of the first element of the submenu.
	      event.stopPropagation();
	    }
	  },
	
	  _destroy : function() {
	    this.menuItems
	      .removeClass( "ui-menubar-item" )
	      .removeAttr( "role" )
	      .css({
	        "border-width": "",
	        "border-style": ""
	      });
	
	    this.element
	      .removeClass( "ui-menubar ui-widget-header ui-helper-clearfix" )
	      .removeAttr( "role" )
	      .unbind( ".menubar" );
	
	    this.items
	      .unbind( ".menubar" )
	      .removeClass( "ui-button ui-widget ui-button-text-only ui-menubar-link ui-state-default" )
	      .removeAttr( "role" )
	      .removeAttr( "aria-haspopup" )
	      .children( ".ui-icon" ).remove();
	
	    // TODO fix this
	    if ( false ) {
	      // Does not unwrap
	      this.items.children( "span.ui-button-text" ).unwrap();
	    } else {
	      // Does "unwrap"
	      this.items.children( "span.ui-button-text" ).each( function(){
	        var item = $( this );
	        item.parent().html( item.html() );
	      });
	    }
	
	    this.element.find( ":ui-menu" )
	      .menu( "destroy" )
	      .show()
	      .removeAttr( "aria-hidden" )
	      .removeAttr( "aria-expanded" )
	      .removeAttr( "tabindex" )
	      .unbind( ".menubar" );
	  },
	
	  _collapseActiveMenu: function() {
	    if ( !this.active.is( ":ui-menu" ) ) {
	      return;
	    }
	    this.active
	      .menu( "collapseAll" )
	      .hide()
	      .attr({
	        "aria-hidden": "true",
	        "aria-expanded": "false"
	      })
	      .closest( this.options.items ).removeClass( "ui-state-active" );
	  },
	
	  _close: function() {
	    if ( !this.active ) {
	      return;
	    }
	
	    this._collapseActiveMenu();
	
	    this.active = null;
	    this.open = false;
	    this.openSubmenus = 0;
	  },
	
	  _open: function( event, menu ) {
	    var menuItem = menu.closest( ".ui-menubar-item" );
	
	    if ( this.active && this.active.length &&
	        this._hasSubMenu( this.active.closest( this.options.items ) ) ) {
	          this._collapseActiveMenu();
	    }
	
	    menuItem.addClass( "ui-state-active" );
	    // workaround when clicking a non-menu item, then hovering a menu, then going back
	    // this way afterwards its still possible to tab back to a menubar, even if its
	    // the wrong item
	    // see also "click menu-less item, hover in and out of item with menu" test in menubar_core
	    if ( !this.lastFocused ) {
	      this.lastFocused = menu.prev();
	    }
	
	    this.active = menu
	      .show()
	      .position( $.extend({
	        of: menuItem
	      }, this.options.position ) )
	      .removeAttr( "aria-hidden" )
	      .attr( "aria-expanded", "true" )
	      .menu( "focus", event, menu.children( ".ui-menu-item" ).first()  )
	      .focus();
	
	    this.open = true;
	  },
	
	  next: function( event ) {
	    function shouldOpenNestedSubMenu() {
	      return this.active &&
	        this._hasSubMenu( this.active.closest( this.options.items ) ) &&
	        this.active.data( "uiMenu" ) &&
	        this.active.data( "uiMenu" ).active &&
	        this.active.data( "uiMenu" ).active.has( ".ui-menu" ).length;
	    }
	
	    if ( this.open ) {
	      if ( shouldOpenNestedSubMenu.call( this ) ) {
	        // Track number of open submenus and prevent moving to next menubar item
	        this.openSubmenus++;
	        return;
	      }
	    }
	    this.openSubmenus = 0;
	    this._move( "next", event );
	  },
	
	  previous: function( event ) {
	    if ( this.open && this.openSubmenus ) {
	      // Track number of open submenus and prevent moving to previous menubar item
	      this.openSubmenus--;
	      return;
	    }
	    this.openSubmenus = 0;
	    this._move( "prev", event );
	  },
	
	  _move: function( direction, event ) {
	    var closestMenuItem = $( event.target ).closest( ".ui-menubar-item" ),
	      nextMenuItem = closestMenuItem.data( direction + "MenuItem" ),
	      focusableTarget = nextMenuItem.find( ".ui-button" );
	
	    if ( this.open ) {
	      if ( this._hasSubMenu( nextMenuItem ) ) {
	        this._open( event, nextMenuItem.children( ".ui-menu" ) );
	      } else {
	        this._collapseActiveMenu();
	        nextMenuItem.find( ".ui-button" ).focus();
	        this.open = true;
	      }
	    } else {
	      closestMenuItem.find( ".ui-button" );
	      focusableTarget.focus();
	    }
	  }
	
	});
	
	}( jQuery ));


/***/ }),
/* 100 */
/***/ (function(module, exports) {

	/**
	 * Provides requestAnimationFrame in a cross browser way.
	 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	 */
	
	if ( !window.requestAnimationFrame ) {
	
		window.requestAnimationFrame = ( function() {
	
			return window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
	
				window.setTimeout( callback, 1000 / 60 );
	
			};
	
		} )();
	
	}


/***/ }),
/* 101 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_101__;

/***/ }),
/* 102 */
/***/ (function(module, exports) {

	/*
	 * transform: A jQuery cssHooks adding cross-browser 2d transform capabilities to $.fn.css() and $.fn.animate()
	 *
	 * limitations:
	 * - requires jQuery 1.4.3+
	 * - Should you use the *translate* property, then your elements need to be absolutely positionned in a relatively positionned wrapper **or it will fail in IE678**.
	 * - transformOrigin is not accessible
	 *
	 * latest version and complete README available on Github:
	 * https://github.com/louisremi/jquery.transform.js
	 *
	 * Copyright 2011 @louis_remi
	 * Licensed under the MIT license.
	 *
	 * This saved you an hour of work?
	 * Send me music http://www.amazon.co.uk/wishlist/HNTU0468LQON
	 *
	 */
	(function( $, window, document, Math, undefined ) {
	
	/*
	 * Feature tests and global variables
	 */
	var div = document.createElement("div"),
		divStyle = div.style,
		suffix = "Transform",
		testProperties = [
			"O" + suffix,
			"ms" + suffix,
			"Webkit" + suffix,
			"Moz" + suffix
		],
		i = testProperties.length,
		supportProperty,
		supportMatrixFilter,
		supportFloat32Array = "Float32Array" in window,
		propertyHook,
		propertyGet,
		rMatrix = /Matrix([^)]*)/,
		rAffine = /^\s*matrix\(\s*1\s*,\s*0\s*,\s*0\s*,\s*1\s*(?:,\s*0(?:px)?\s*){2}\)\s*$/,
		_transform = "transform",
		_transformOrigin = "transformOrigin",
		_translate = "translate",
		_rotate = "rotate",
		_scale = "scale",
		_skew = "skew",
		_matrix = "matrix";
	
	// test different vendor prefixes of these properties
	while ( i-- ) {
		if ( testProperties[i] in divStyle ) {
			$.support[_transform] = supportProperty = testProperties[i];
			$.support[_transformOrigin] = supportProperty + "Origin";
			continue;
		}
	}
	// IE678 alternative
	if ( !supportProperty ) {
		$.support.matrixFilter = supportMatrixFilter = divStyle.filter === "";
	}
	
	// px isn't the default unit of these properties
	$.cssNumber[_transform] = $.cssNumber[_transformOrigin] = true;
	
	/*
	 * fn.css() hooks
	 */
	if ( supportProperty && supportProperty != _transform ) {
		// Modern browsers can use jQuery.cssProps as a basic hook
		$.cssProps[_transform] = supportProperty;
		$.cssProps[_transformOrigin] = supportProperty + "Origin";
	
		// Firefox needs a complete hook because it stuffs matrix with "px"
		if ( supportProperty == "Moz" + suffix ) {
			propertyHook = {
				get: function( elem, computed ) {
					return (computed ?
						// remove "px" from the computed matrix
						$.css( elem, supportProperty ).split("px").join(""):
						elem.style[supportProperty]
					);
				},
				set: function( elem, value ) {
					// add "px" to matrices
					elem.style[supportProperty] = /matrix\([^)p]*\)/.test(value) ?
						value.replace(/matrix((?:[^,]*,){4})([^,]*),([^)]*)/, _matrix+"$1$2px,$3px"):
						value;
				}
			};
		/* Fix two jQuery bugs still present in 1.5.1
		 * - rupper is incompatible with IE9, see http://jqbug.com/8346
		 * - jQuery.css is not really jQuery.cssProps aware, see http://jqbug.com/8402
		 */
		} else if ( /^1\.[0-5](?:\.|$)/.test($.fn.jquery) ) {
			propertyHook = {
				get: function( elem, computed ) {
					return (computed ?
						$.css( elem, supportProperty.replace(/^ms/, "Ms") ):
						elem.style[supportProperty]
					);
				}
			};
		}
		/* TODO: leverage hardware acceleration of 3d transform in Webkit only
		else if ( supportProperty == "Webkit" + suffix && support3dTransform ) {
			propertyHook = {
				set: function( elem, value ) {
					elem.style[supportProperty] =
						value.replace();
				}
			}
		}*/
	
	} else if ( supportMatrixFilter ) {
		propertyHook = {
			get: function( elem, computed, asArray ) {
				var elemStyle = ( computed && elem.currentStyle ? elem.currentStyle : elem.style ),
					matrix, data;
	
				if ( elemStyle && rMatrix.test( elemStyle.filter ) ) {
					matrix = RegExp.$1.split(",");
					matrix = [
						matrix[0].split("=")[1],
						matrix[2].split("=")[1],
						matrix[1].split("=")[1],
						matrix[3].split("=")[1]
					];
				} else {
					matrix = [1,0,0,1];
				}
	
				if ( ! $.cssHooks[_transformOrigin] ) {
					matrix[4] = elemStyle ? parseInt(elemStyle.left, 10) || 0 : 0;
					matrix[5] = elemStyle ? parseInt(elemStyle.top, 10) || 0 : 0;
	
				} else {
					data = $._data( elem, "transformTranslate", undefined );
					matrix[4] = data ? data[0] : 0;
					matrix[5] = data ? data[1] : 0;
				}
	
				return asArray ? matrix : _matrix+"(" + matrix + ")";
			},
			set: function( elem, value, animate ) {
				var elemStyle = elem.style,
					currentStyle,
					Matrix,
					filter,
					centerOrigin;
	
				if ( !animate ) {
					elemStyle.zoom = 1;
				}
	
				value = matrix(value);
	
				// rotate, scale and skew
				Matrix = [
					"Matrix("+
						"M11="+value[0],
						"M12="+value[2],
						"M21="+value[1],
						"M22="+value[3],
						"SizingMethod='auto expand'"
				].join();
				filter = ( currentStyle = elem.currentStyle ) && currentStyle.filter || elemStyle.filter || "";
	
				elemStyle.filter = rMatrix.test(filter) ?
					filter.replace(rMatrix, Matrix) :
					filter + " progid:DXImageTransform.Microsoft." + Matrix + ")";
	
				if ( ! $.cssHooks[_transformOrigin] ) {
	
					// center the transform origin, from pbakaus's Transformie http://github.com/pbakaus/transformie
					if ( (centerOrigin = $.transform.centerOrigin) ) {
						elemStyle[centerOrigin == "margin" ? "marginLeft" : "left"] = -(elem.offsetWidth/2) + (elem.clientWidth/2) + "px";
						elemStyle[centerOrigin == "margin" ? "marginTop" : "top"] = -(elem.offsetHeight/2) + (elem.clientHeight/2) + "px";
					}
	
					// translate
					// We assume that the elements are absolute positionned inside a relative positionned wrapper
					elemStyle.left = value[4] + "px";
					elemStyle.top = value[5] + "px";
	
				} else {
					$.cssHooks[_transformOrigin].set( elem, value );
				}
			}
		};
	}
	// populate jQuery.cssHooks with the appropriate hook if necessary
	if ( propertyHook ) {
		$.cssHooks[_transform] = propertyHook;
	}
	// we need a unique setter for the animation logic
	propertyGet = propertyHook && propertyHook.get || $.css;
	
	/*
	 * fn.animate() hooks
	 */
	$.fx.step.transform = function( fx ) {
		var elem = fx.elem,
			start = fx.start,
			end = fx.end,
			pos = fx.pos,
			transform = "",
			precision = 1E5,
			i, startVal, endVal, unit;
	
		// fx.end and fx.start need to be converted to interpolation lists
		if ( !start || typeof start === "string" ) {
	
			// the following block can be commented out with jQuery 1.5.1+, see #7912
			if ( !start ) {
				start = propertyGet( elem, supportProperty );
			}
	
			// force layout only once per animation
			if ( supportMatrixFilter ) {
				elem.style.zoom = 1;
			}
	
			// replace "+=" in relative animations (-= is meaningless with transforms)
			end = end.split("+=").join(start);
	
			// parse both transform to generate interpolation list of same length
			$.extend( fx, interpolationList( start, end ) );
			start = fx.start;
			end = fx.end;
		}
	
		i = start.length;
	
		// interpolate functions of the list one by one
		while ( i-- ) {
			startVal = start[i];
			endVal = end[i];
			unit = +false;
	
			switch ( startVal[0] ) {
	
				case _translate:
					unit = "px";
				case _scale:
					unit || ( unit = "");
	
					transform = startVal[0] + "(" +
						Math.round( (startVal[1][0] + (endVal[1][0] - startVal[1][0]) * pos) * precision ) / precision + unit +","+
						Math.round( (startVal[1][1] + (endVal[1][1] - startVal[1][1]) * pos) * precision ) / precision + unit + ")"+
						transform;
					break;
	
				case _skew + "X":
				case _skew + "Y":
				case _rotate:
					transform = startVal[0] + "(" +
						Math.round( (startVal[1] + (endVal[1] - startVal[1]) * pos) * precision ) / precision +"rad)"+
						transform;
					break;
			}
		}
	
		fx.origin && ( transform = fx.origin + transform );
	
		propertyHook && propertyHook.set ?
			propertyHook.set( elem, transform, +true ):
			elem.style[supportProperty] = transform;
	};
	
	/*
	 * Utility functions
	 */
	
	// turns a transform string into its "matrix(A,B,C,D,X,Y)" form (as an array, though)
	function matrix( transform ) {
		transform = transform.split(")");
		var
				trim = $.trim
			, i = -1
			// last element of the array is an empty string, get rid of it
			, l = transform.length -1
			, split, prop, val
			, prev = supportFloat32Array ? new Float32Array(6) : []
			, curr = supportFloat32Array ? new Float32Array(6) : []
			, rslt = supportFloat32Array ? new Float32Array(6) : [1,0,0,1,0,0]
			;
	
		prev[0] = prev[3] = rslt[0] = rslt[3] = 1;
		prev[1] = prev[2] = prev[4] = prev[5] = 0;
	
		// Loop through the transform properties, parse and multiply them
		while ( ++i < l ) {
			split = transform[i].split("(");
			prop = trim(split[0]);
			val = split[1];
			curr[0] = curr[3] = 1;
			curr[1] = curr[2] = curr[4] = curr[5] = 0;
	
			switch (prop) {
				case _translate+"X":
					curr[4] = parseInt(val, 10);
					break;
	
				case _translate+"Y":
					curr[5] = parseInt(val, 10);
					break;
	
				case _translate:
					val = val.split(",");
					curr[4] = parseInt(val[0], 10);
					curr[5] = parseInt(val[1] || 0, 10);
					break;
	
				case _rotate:
					val = toRadian(val);
					curr[0] = Math.cos(val);
					curr[1] = Math.sin(val);
					curr[2] = -Math.sin(val);
					curr[3] = Math.cos(val);
					break;
	
				case _scale+"X":
					curr[0] = +val;
					break;
	
				case _scale+"Y":
					curr[3] = val;
					break;
	
				case _scale:
					val = val.split(",");
					curr[0] = val[0];
					curr[3] = val.length>1 ? val[1] : val[0];
					break;
	
				case _skew+"X":
					curr[2] = Math.tan(toRadian(val));
					break;
	
				case _skew+"Y":
					curr[1] = Math.tan(toRadian(val));
					break;
	
				case _matrix:
					val = val.split(",");
					curr[0] = val[0];
					curr[1] = val[1];
					curr[2] = val[2];
					curr[3] = val[3];
					curr[4] = parseInt(val[4], 10);
					curr[5] = parseInt(val[5], 10);
					break;
			}
	
			// Matrix product (array in column-major order)
			rslt[0] = prev[0] * curr[0] + prev[2] * curr[1];
			rslt[1] = prev[1] * curr[0] + prev[3] * curr[1];
			rslt[2] = prev[0] * curr[2] + prev[2] * curr[3];
			rslt[3] = prev[1] * curr[2] + prev[3] * curr[3];
			rslt[4] = prev[0] * curr[4] + prev[2] * curr[5] + prev[4];
			rslt[5] = prev[1] * curr[4] + prev[3] * curr[5] + prev[5];
	
			prev = [rslt[0],rslt[1],rslt[2],rslt[3],rslt[4],rslt[5]];
		}
		return rslt;
	}
	
	// turns a matrix into its rotate, scale and skew components
	// algorithm from http://hg.mozilla.org/mozilla-central/file/7cb3e9795d04/layout/style/nsStyleAnimation.cpp
	function unmatrix(matrix) {
		var
				scaleX
			, scaleY
			, skew
			, A = matrix[0]
			, B = matrix[1]
			, C = matrix[2]
			, D = matrix[3]
			;
	
		// Make sure matrix is not singular
		if ( A * D - B * C ) {
			// step (3)
			scaleX = Math.sqrt( A * A + B * B );
			A /= scaleX;
			B /= scaleX;
			// step (4)
			skew = A * C + B * D;
			C -= A * skew;
			D -= B * skew;
			// step (5)
			scaleY = Math.sqrt( C * C + D * D );
			C /= scaleY;
			D /= scaleY;
			skew /= scaleY;
			// step (6)
			if ( A * D < B * C ) {
				A = -A;
				B = -B;
				skew = -skew;
				scaleX = -scaleX;
			}
	
		// matrix is singular and cannot be interpolated
		} else {
			// In this case the elem shouldn't be rendered, hence scale == 0
			scaleX = scaleY = skew = 0;
		}
	
		// The recomposition order is very important
		// see http://hg.mozilla.org/mozilla-central/file/7cb3e9795d04/layout/style/nsStyleAnimation.cpp#l971
		return [
			[_translate, [+matrix[4], +matrix[5]]],
			[_rotate, Math.atan2(B, A)],
			[_skew + "X", Math.atan(skew)],
			[_scale, [scaleX, scaleY]]
		];
	}
	
	// build the list of transform functions to interpolate
	// use the algorithm described at http://dev.w3.org/csswg/css3-2d-transforms/#animation
	function interpolationList( start, end ) {
		var list = {
				start: [],
				end: []
			},
			i = -1, l,
			currStart, currEnd, currType;
	
		// get rid of affine transform matrix
		( start == "none" || isAffine( start ) ) && ( start = "" );
		( end == "none" || isAffine( end ) ) && ( end = "" );
	
		// if end starts with the current computed style, this is a relative animation
		// store computed style as the origin, remove it from start and end
		if ( start && end && !end.indexOf("matrix") && toArray( start ).join() == toArray( end.split(")")[0] ).join() ) {
			list.origin = start;
			start = "";
			end = end.slice( end.indexOf(")") +1 );
		}
	
		if ( !start && !end ) { return; }
	
		// start or end are affine, or list of transform functions are identical
		// => functions will be interpolated individually
		if ( !start || !end || functionList(start) == functionList(end) ) {
	
			start && ( start = start.split(")") ) && ( l = start.length );
			end && ( end = end.split(")") ) && ( l = end.length );
	
			while ( ++i < l-1 ) {
				start[i] && ( currStart = start[i].split("(") );
				end[i] && ( currEnd = end[i].split("(") );
				currType = $.trim( ( currStart || currEnd )[0] );
	
				append( list.start, parseFunction( currType, currStart ? currStart[1] : 0 ) );
				append( list.end, parseFunction( currType, currEnd ? currEnd[1] : 0 ) );
			}
	
		// otherwise, functions will be composed to a single matrix
		} else {
			list.start = unmatrix(matrix(start));
			list.end = unmatrix(matrix(end))
		}
	
		return list;
	}
	
	function parseFunction( type, value ) {
		var
			// default value is 1 for scale, 0 otherwise
			defaultValue = +(!type.indexOf(_scale)),
			scaleX,
			// remove X/Y from scaleX/Y & translateX/Y, not from skew
			cat = type.replace( /e[XY]/, "e" );
	
		switch ( type ) {
			case _translate+"Y":
			case _scale+"Y":
	
				value = [
					defaultValue,
					value ?
						parseFloat( value ):
						defaultValue
				];
				break;
	
			case _translate+"X":
			case _translate:
			case _scale+"X":
				scaleX = 1;
			case _scale:
	
				value = value ?
					( value = value.split(",") ) &&	[
						parseFloat( value[0] ),
						parseFloat( value.length>1 ? value[1] : type == _scale ? scaleX || value[0] : defaultValue+"" )
					]:
					[defaultValue, defaultValue];
				break;
	
			case _skew+"X":
			case _skew+"Y":
			case _rotate:
				value = value ? toRadian( value ) : 0;
				break;
	
			case _matrix:
				return unmatrix( value ? toArray(value) : [1,0,0,1,0,0] );
				break;
		}
	
		return [[ cat, value ]];
	}
	
	function isAffine( matrix ) {
		return rAffine.test(matrix);
	}
	
	function functionList( transform ) {
		return transform.replace(/(?:\([^)]*\))|\s/g, "");
	}
	
	function append( arr1, arr2, value ) {
		while ( value = arr2.shift() ) {
			arr1.push( value );
		}
	}
	
	// converts an angle string in any unit to a radian Float
	function toRadian(value) {
		return ~value.indexOf("deg") ?
			parseInt(value,10) * (Math.PI * 2 / 360):
			~value.indexOf("grad") ?
				parseInt(value,10) * (Math.PI/200):
				parseFloat(value);
	}
	
	// Converts "matrix(A,B,C,D,X,Y)" to [A,B,C,D,X,Y]
	function toArray(matrix) {
		// remove the unit of X and Y for Firefox
		matrix = /([^,]*),([^,]*),([^,]*),([^,]*),([^,p]*)(?:px)?,([^)p]*)(?:px)?/.exec(matrix);
		return [matrix[1], matrix[2], matrix[3], matrix[4], matrix[5], matrix[6]];
	}
	
	$.transform = {
		centerOrigin: "margin"
	};
	
	})( jQuery, window, document, Math );


/***/ }),
/* 103 */
/***/ (function(module, exports) {

	/**
	 * ScrollView - jQuery plugin 0.1
	 *
	 * This plugin supplies contents view by grab and drag scroll.
	 *
	 * Copyright (c) 2009 Toshimitsu Takahashi
	 *
	 * Released under the MIT license.
	 *
	 * == Usage =======================
	 *   // apply to block element.
	 *   $("#map").scrollview();
	 *   
	 *   // with setting grab and drag icon urls.
	 *   //   grab: the cursor when mouse button is up.
	 *   //   grabbing: the cursor when mouse button is down.
	 *   //
	 *   $("#map".scrollview({
	 *     grab : "images/openhand.cur",
	 *     grabbing : "images/closedhand.cur"
	 *   });
	 * ================================
	 */
	(function() {
	    function ScrollView(){ this.initialize.apply(this, arguments) }
	    ScrollView.prototype = {
	        initialize: function(container, config){
	                // setting cursor.
	                var gecko = navigator.userAgent.indexOf("Gecko/") != -1;
	                var opera = navigator.userAgent.indexOf("Opera/") != -1;
	                var mac = navigator.userAgent.indexOf("Mac OS") != -1;
	                if (opera) {
	                    this.grab = "default";
	                    this.grabbing = "move";
	                } else if (!(mac && gecko) && config) {
	                    if (config.grab) {
	                       this.grab = "url(\"" + config.grab + "\"),default";
	                    }
	                    if (config.grabbing) {
	                       this.grabbing = "url(" + config.grabbing + "),move";
	                    }
	                } else if (gecko) {
	                    this.grab = "-moz-grab";
	                    this.grabbing = "-moz-grabbing";
	                } else {
	                    this.grab = "default";
	                    this.grabbing = "move";
	                }
	                
	                // Get container and image.
	                this.m = $(container);
	                this.i = this.m.children().css("cursor", this.grab);
	                
	                this.isgrabbing = false;
	                
	                // Set mouse events.
	                var self = this;
	                this.i.mousedown(function(e){
	                  // todo: make the first condition an option and submit a patch when it's done
	                        if (e.target != $("svg", $(container))[0]) {
	                          return false;
	                        }
	                        self.startgrab();
	                        this.xp = e.pageX;
	                        this.yp = e.pageY;
	                        return false;
	                }).mousemove(function(e){
	                        if (!self.isgrabbing) return true;
	                        self.scrollTo(this.xp - e.pageX, this.yp - e.pageY);
	                        this.xp = e.pageX;
	                        this.yp = e.pageY;
	                        return false;
	                })
	                .mouseout(function(){ self.stopgrab() })
	                .mouseup(function(){ self.stopgrab() });
	                
	                this.centering();
	        },
	        centering: function(){
	                var _m = this.m;
	                var w = this.i.width() - _m.width();
	                var h = this.i.height() - _m.height();
	                _m.scrollLeft(w / 2).scrollTop(h / 2);
	        },
	        startgrab: function(){
	                this.isgrabbing = true;
	                this.i.css("cursor", this.grabbing);
	        },
	        stopgrab: function(){
	                this.isgrabbing = false;
	                this.i.css("cursor", this.grab);
	        },
	        scrollTo: function(dx, dy){
	                var _m = this.m;
	                var x = _m.scrollLeft() + dx;
	                var y = _m.scrollTop() + dy;
	                _m.scrollLeft(x).scrollTop(y);
	        }
	    };
	    
	    jQuery.fn.scrollview = function(config){
	        return this.each(function(){
	            new ScrollView(this, config);
	        });
	    };
	})(jQuery);


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

	var Backbone, ConnectionView, GroupView, Workspace, _,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(2);
	
	Backbone = __webpack_require__(3);
	
	ConnectionView = __webpack_require__(105);
	
	GroupView = __webpack_require__(106);
	
	__webpack_require__(18);
	
	
	/* Workspace View */
	
	Workspace = (function(superClass) {
	  extend(Workspace, superClass);
	
	  function Workspace() {
	    this.initDrop = bind(this.initDrop, this);
	    this.renderGroup = bind(this.renderGroup, this);
	    this.renderConnection = bind(this.renderConnection, this);
	    this.renderNode = bind(this.renderNode, this);
	    this.destroy = bind(this.destroy, this);
	    this.render = bind(this.render, this);
	    this.initialize = bind(this.initialize, this);
	    return Workspace.__super__.constructor.apply(this, arguments);
	  }
	
	  Workspace.prototype.initialize = function(options) {
	    Workspace.__super__.initialize.apply(this, arguments);
	    this.settings = options.settings;
	    this.initDrop();
	    this.views = [];
	    this.nodes = core.nodes;
	    this.connections = core.connections;
	    this.groups = core.groups;
	    this.nodes.bind("add", this.renderNode);
	    this.connections.bind("add", this.renderConnection);
	    return this.groups.bind("add", this.renderGroup);
	  };
	
	  Workspace.prototype.render = function() {};
	
	  Workspace.prototype.clearView = function() {
	    _.each(this.views, function(view) {
	      return view.remove();
	    });
	    return this.views = [];
	  };
	
	  Workspace.prototype.destroy = function() {
	    _.each(this.views, function(view) {
	      return view.remove();
	    });
	    this.nodes.unbind("add", this.renderNode);
	    this.connections.unbind("add", this.renderConnection);
	    delete this.views;
	    delete this.settings;
	    return this.remove();
	  };
	
	  Workspace.prototype.renderNode = function(node) {
	    var $nodeEl, nodename, view, viewclass;
	    nodename = node.constructor.name;
	    if (ThreeNodes.Core.nodes.views[nodename]) {
	      viewclass = ThreeNodes.Core.nodes.views[nodename];
	    } else {
	      viewclass = ThreeNodes.Core.nodes.views.NodeView;
	    }
	    $nodeEl = $("<div class='node'></div>").appendTo(this.$el);
	    view = new viewclass({
	      model: node,
	      el: $nodeEl
	    });
	    view.$el.data("id", node.get("id"));
	    view.$el.data("object", node);
	    return this.views.push(view);
	  };
	
	  Workspace.prototype.renderConnection = function(connection) {
	    var view;
	    if (this.settings.test === true) {
	      return false;
	    }
	    view = new ConnectionView({
	      model: connection,
	      settings: this.settings
	    });
	    return this.views.push(view);
	  };
	
	  Workspace.prototype.renderGroup = function(group) {
	    var $groupEl, view;
	    $groupEl = $("<div class='group'></div>").appendTo(this.$el);
	    view = new GroupView({
	      model: group,
	      el: $groupEl
	    });
	    this.views.push(view);
	    return view.$el.data("object", group);
	  };
	
	  Workspace.prototype.initDrop = function() {
	    var self;
	    self = this;
	    $("#container").droppable({
	      accept: "#tab-new a.button, #library .definition",
	      activeClass: "ui-state-active",
	      hoverClass: "ui-state-hover",
	      drop: function(event, ui) {
	        var container, definition, dx, dy, nodename, offset;
	        offset = $("#container-wrapper").offset();
	        definition = false;
	        if (ui.draggable.hasClass("definition")) {
	          nodename = "Group";
	          container = $("#library");
	          definition = ui.draggable.data("model");
	          offset.left -= container.offset().left;
	        } else {
	          nodename = ui.draggable.attr("rel");
	          container = $("#sidebar .ui-layout-center");
	        }
	        dx = ui.position.left + $("#container-wrapper").scrollLeft() - offset.left - 10;
	        dy = ui.position.top + $("#container-wrapper").scrollTop() - container.scrollTop() - offset.top;
	        if (self.nodes) {
	          self.nodes.createNode({
	            type: nodename,
	            x: dx,
	            y: dy,
	            definition: definition
	          });
	        }
	        return $("#sidebar").show();
	      }
	    });
	    return this;
	  };
	
	  return Workspace;
	
	})(Backbone.View);
	
	module.exports = Workspace;


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

	var Backbone, ConnectionView, _,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(2);
	
	Backbone = __webpack_require__(3);
	
	__webpack_require__(18);
	
	
	/* Connection View */
	
	ConnectionView = (function(superClass) {
	  extend(ConnectionView, superClass);
	
	  function ConnectionView() {
	    return ConnectionView.__super__.constructor.apply(this, arguments);
	  }
	
	  ConnectionView.prototype.initialize = function() {
	    ConnectionView.__super__.initialize.apply(this, arguments);
	    this.container = $("#graph");
	    this.svg = ThreeNodes.UI.UIView.svg;
	    this.curve = this.svg.path().attr({
	      stroke: "#555"
	    });
	    this.triangle = this.svg.path().attr({
	      stroke: "#555",
	      fill: "#555"
	    });
	    this.el = this.svg.node;
	    this.model.bind("render", (function(_this) {
	      return function() {
	        return _this.render();
	      };
	    })(this));
	    this.model.bind("destroy", (function(_this) {
	      return function() {
	        return _this.remove();
	      };
	    })(this));
	    this.model.bind("remove", (function(_this) {
	      return function() {
	        return _this.remove();
	      };
	    })(this));
	    return this.render();
	  };
	
	  ConnectionView.prototype.remove = function() {
	    if (this.curve) {
	      this.curve.remove();
	      delete this.curve;
	    }
	    if (this.triangle) {
	      this.triangle.remove();
	      delete this.triangle;
	    }
	    return true;
	  };
	
	  ConnectionView.prototype.render = function() {
	    if (this.svg) {
	      this.renderCurve(this.model);
	      this.renderTriangle();
	    }
	    return this;
	  };
	
	  ConnectionView.prototype.getNodePosition = function(model, type) {
	    var height, o1, width, x, y;
	    x = model.get('x');
	    y = model.get('y');
	    width = model.get('width');
	    height = model.get('height');
	    switch (type) {
	      case 'left':
	        o1 = {
	          left: x,
	          top: y + height / 2
	        };
	        break;
	      case 'right':
	        o1 = {
	          left: x + width,
	          top: y + height / 2
	        };
	        break;
	      case 'up':
	        o1 = {
	          left: x + width / 2,
	          top: y
	        };
	        break;
	      case 'down':
	        o1 = {
	          left: x + width / 2,
	          top: y + height
	        };
	        break;
	      case 'center':
	        o1 = {
	          left: x + width / 2,
	          top: y + height / 2
	        };
	    }
	    return o1;
	  };
	
	  ConnectionView.prototype.renderTriangle = function() {
	    var len, obj;
	    return;
	    len = this.curve.getTotalLength();
	    obj = this.curve.getPointAtLength(len - 13);
	    return this.triangle.attr({
	      path: ["M", 0, 0, "L", 1.732, -1, "L", 1.732, 1].join(',')
	    }).transform('t' + obj.x + ',' + obj.y + 's5, 5' + 'r' + obj.alpha);
	  };
	
	  ConnectionView.prototype.renderCurve = function(drawModel) {
	    var diffx, diffy, f1, f2, min_diff, offset, ofx, ofy, x1, x2, x3, x4, y1, y2, y3, y4;
	    f1 = this.getNodePosition(drawModel.from, drawModel.fromType);
	    f2 = this.getNodePosition(drawModel.to, drawModel.toType);
	    offset = $("#container-wrapper").offset();
	    ofx = $("#container-wrapper").scrollLeft() - offset.left;
	    ofy = $("#container-wrapper").scrollTop() - offset.top;
	    x1 = f1.left;
	    y1 = f1.top;
	    x4 = f2.left;
	    y4 = f2.top;
	    min_diff = 42;
	    diffx = Math.max(min_diff, x4 - x1);
	    diffy = Math.max(min_diff, y4 - y1);
	    x2 = x1 + diffx * 0.5;
	    y2 = y1;
	    x3 = x4 - diffx * 0.5;
	    y3 = y4;
	    return this.curve.attr({
	      path: ["M", x1.toFixed(3), y1.toFixed(3), "L", x4.toFixed(3), y4.toFixed(3)].join(",")
	    });
	  };
	
	  return ConnectionView;
	
	})(Backbone.View);
	
	module.exports = ConnectionView;


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

	var Backbone, Group, _, _view_group_context_menu, _view_group_template, namespace,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(2);
	
	Backbone = __webpack_require__(3);
	
	namespace = __webpack_require__(16).namespace;
	
	_view_group_template = __webpack_require__(107);
	
	_view_group_context_menu = __webpack_require__(108);
	
	__webpack_require__(17);
	
	__webpack_require__(18);
	
	
	/* Node View */
	
	Group = (function(superClass) {
	  extend(Group, superClass);
	
	  function Group() {
	    this.makeDraggable = bind(this.makeDraggable, this);
	    this.remove = bind(this.remove, this);
	    this.addSelectedClass = bind(this.addSelectedClass, this);
	    this.computeNodePosition = bind(this.computeNodePosition, this);
	    this.render = bind(this.render, this);
	    this.onViewDetail = bind(this.onViewDetail, this);
	    this.initContextMenus = bind(this.initContextMenus, this);
	    this.makeElement = bind(this.makeElement, this);
	    return Group.__super__.constructor.apply(this, arguments);
	  }
	
	  Group.prototype.className = "group";
	
	  Group.prototype.initialize = function(model) {
	    this.makeElement();
	    this.render();
	    this.initContextMenus();
	    this.makeDraggable();
	    this.initNodeClick();
	    this.initTitleClick();
	    return this.model.on('remove', (function(_this) {
	      return function() {
	        return _this.remove();
	      };
	    })(this));
	  };
	
	  Group.prototype.makeElement = function() {
	    this.template = _.template(_view_group_template, this.model);
	    this.$el.html(this.template);
	    this.$el.addClass("type-group");
	    this.$el.addClass("node-Group");
	    return this.addHandlerListener();
	  };
	
	  Group.prototype.initContextMenus = function() {
	    var self;
	    self = this;
	    if ($("#group-context-menu").length < 1) {
	      $("body").append(_.template(_view_group_context_menu, {}));
	    }
	    return this.$el.find(".head").contextMenu({
	      menu: "group-context-menu"
	    }, (function(_this) {
	      return function(action, el, pos) {
	        if (action === "remove_group") {
	          self.model.remove();
	        }
	        if (action === "view_detail") {
	          return self.onViewDetail();
	        }
	      };
	    })(this));
	  };
	
	  Group.prototype.onViewDetail = function() {
	    return $(document).trigger('view_group_detail', [this.model]);
	  };
	
	  Group.prototype.render = function() {
	    this.$el.css({
	      left: parseInt(this.model.get("x")),
	      top: parseInt(this.model.get("y"))
	    });
	    this.$el.find("> .head span").text(this.model.get("name"));
	    return this.$el.find("> .head span").show();
	  };
	
	  Group.prototype.computeNodePosition = function() {
	    var offset, pos;
	    pos = $(this.el).position();
	    offset = $("#container-wrapper").offset();
	    return this.model.set({
	      x: pos.left + $("#container-wrapper").scrollLeft(),
	      y: pos.top + $("#container-wrapper").scrollTop()
	    });
	  };
	
	  Group.prototype.addHandlerListener = function() {
	    var getPath, self, start_offset_x, start_offset_y;
	    self = this;
	    start_offset_x = 0;
	    start_offset_y = 0;
	    getPath = function(start, end, offset) {
	      var ofx, ofy;
	      ofx = $("#container-wrapper").scrollLeft();
	      ofy = $("#container-wrapper").scrollTop();
	      return "M" + (start.left + offset.left + 2) + " " + (start.top + offset.top + 2) + " L" + (end.left + offset.left + ofx - start_offset_x) + " " + (end.top + offset.top + ofy - start_offset_y);
	    };
	    $('.handler', this.$el).draggable({
	      helper: function() {
	        return $("<div class='ui-widget-drag-helper'></div>");
	      },
	      scroll: true,
	      cursor: 'pointer',
	      cursorAt: {
	        left: 0,
	        top: 0
	      },
	      start: function(event, ui) {
	        start_offset_x = $("#container-wrapper").scrollLeft();
	        start_offset_y = $("#container-wrapper").scrollTop();
	        if (ThreeNodes.UI.UIView.connecting_line) {
	          return ThreeNodes.UI.UIView.connecting_line.attr({
	            opacity: 1
	          });
	        }
	      },
	      stop: function(event, ui) {
	        if (ThreeNodes.UI.UIView.connecting_line) {
	          return ThreeNodes.UI.UIView.connecting_line.attr({
	            opacity: 0
	          });
	        }
	      },
	      drag: function(event, ui) {
	        var node_pos, pos;
	        if (ThreeNodes.UI.UIView.connecting_line) {
	          pos = $(this).position();
	          node_pos = {
	            left: self.model.get("x"),
	            top: self.model.get("y")
	          };
	          ThreeNodes.UI.UIView.connecting_line.attr({
	            path: getPath(pos, ui.position, node_pos)
	          });
	          return true;
	        }
	      }
	    });
	    return $(".handler", this.$el).droppable({
	      accept: '.handler',
	      activeClass: "ui-state-active",
	      hoverClass: "ui-state-hover",
	      tolerance: "pointer",
	      drop: function(event, ui) {
	        var from_node, from_type, to_node, to_type;
	        from_node = $(ui.draggable).parent().data('object');
	        from_type = $(ui.draggable).attr('data-attr');
	        to_node = self.model;
	        to_type = $(this).attr('data-attr');
	        self.model.trigger("connection:create", {
	          from: $(ui.draggable).parent().data('object'),
	          fromType: $(ui.draggable).attr('data-attr'),
	          to: self.model,
	          toType: $(this).attr('data-attr')
	        });
	        return this;
	      }
	    });
	  };
	
	  Group.prototype.addSelectedClass = function() {
	    return this.$el.addClass("ui-selected");
	  };
	
	  Group.prototype.remove = function() {
	    $(".field", this.el).destroyContextMenu();
	    if (this.$el.data("draggable")) {
	      this.$el.draggable("destroy");
	    }
	    $(this.el).unbind();
	    this.undelegateEvents();
	    return Group.__super__.remove.apply(this, arguments);
	  };
	
	  Group.prototype.initNodeClick = function() {
	    var self;
	    self = this;
	    $(this.el).click(function(e) {
	      var selectable;
	      if (e.metaKey === false) {
	        $(".group").removeClass("ui-selected");
	        $(".node").removeClass("ui-selected");
	        $(this).addClass("ui-selecting");
	      } else {
	        if ($(this).hasClass("ui-selected")) {
	          $(this).removeClass("ui-selected");
	        } else {
	          $(this).addClass("ui-selecting");
	        }
	      }
	      selectable = $("#container").data("ui-selectable");
	      if (!selectable) {
	        return;
	      }
	      return selectable.refresh();
	    });
	    return this;
	  };
	
	  Group.prototype.initTitleClick = function() {
	    var $input, $title_span, self;
	    self = this;
	    $title_span = this.$el.find("> .head span");
	    $input = $("<input type='text' />");
	    this.$el.find("> .head").append($input);
	    $input.hide();
	    $input.on('mousedown', function(e) {
	      return e.stopPropagation();
	    });
	    $title_span.dblclick(function(e) {
	      var apply_input_result, prev;
	      prev = $(this).html();
	      $input.val(prev);
	      $title_span.hide();
	      $input.show();
	      apply_input_result = function() {
	        self.model.set('name', $input.val());
	        $input.hide();
	        return $title_span.show();
	      };
	      $input.blur(function(e) {
	        return apply_input_result();
	      });
	      $("#graph").click(function(e) {
	        return apply_input_result();
	      });
	      return $input.keydown(function(e) {
	        if (e.keyCode === 13) {
	          return apply_input_result();
	        }
	      });
	    });
	    return this;
	  };
	
	  Group.prototype.makeDraggable = function() {
	    var nodes_offset, selected_nodes, self;
	    self = this;
	    nodes_offset = {
	      top: 0,
	      left: 0
	    };
	    selected_nodes = $([]);
	    $(this.el).draggable({
	      start: function(ev, ui) {
	        if ($(this).hasClass("ui-selected")) {
	          selected_nodes = $(".ui-selected").each(function() {
	            return $(this).data("offset", $(this).offset());
	          });
	        } else {
	          selected_nodes = $([]);
	          $(".node").removeClass("ui-selected");
	        }
	        return nodes_offset = $(this).offset();
	      },
	      drag: function(ev, ui) {
	        var dl, dt;
	        dt = ui.position.top - nodes_offset.top;
	        dl = ui.position.left - nodes_offset.left;
	        selected_nodes.not(this).each(function() {
	          var dx, dy, el, offset;
	          el = $(this);
	          offset = el.data("offset");
	          dx = offset.top + dt;
	          dy = offset.left + dl;
	          el.css({
	            top: dx,
	            left: dy
	          });
	          return el.data("object").trigger("node:computePosition");
	        });
	        self.computeNodePosition();
	        return self.model.trigger('node:renderConnections', self.model);
	      },
	      stop: function() {}
	    });
	    return this;
	  };
	
	  return Group;
	
	})(Backbone.View);
	
	module.exports = Group;


/***/ }),
/* 107 */
/***/ (function(module, exports) {

	module.exports = "<div class='head'><span><%= get(\"name\") %></span></div>\n<div class='options'>\n  <div class='inputs'></div>\n  <div class='center'></div>\n  <div class='outputs'></div>\n</div>\n\n<div class=\"up handler\" data-attr='up'></div>\n<div class=\"down handler\" data-attr='down'></div>\n<div class=\"left handler\" data-attr='left'></div>\n<div class=\"right handler\" data-attr='right'></div>\n<div class=\"center handler\" data-attr='center'></div>\n";

/***/ }),
/* 108 */
/***/ (function(module, exports) {

	module.exports = "<ul id=\"group-context-menu\" class=\"context-menu\">\n  <li><a href=\"#remove_group\">Remove group</a></li>\n  <li><a href=\"#view_detail\">View detail</a></li>\n</ul>";

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

	var AppTimeline, Backbone, _,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(2);
	
	Backbone = __webpack_require__(3);
	
	
	/* Timeline View */
	
	AppTimeline = (function(superClass) {
	  extend(AppTimeline, superClass);
	
	  function AppTimeline() {
	    this.update = bind(this.update, this);
	    this.resize = bind(this.resize, this);
	    this.remove = bind(this.remove, this);
	    this.onNodeRemove = bind(this.onNodeRemove, this);
	    this.selectAnims = bind(this.selectAnims, this);
	    this.initialize = bind(this.initialize, this);
	    return AppTimeline.__super__.constructor.apply(this, arguments);
	  }
	
	  AppTimeline.prototype.initialize = function(options) {
	    var self;
	    AppTimeline.__super__.initialize.apply(this, arguments);
	    localStorage["timeline.js.settings.canvasHeight"] = this.$el.innerHeight();
	    this.$el.html("");
	    self = this;
	    this.timeline = new Timeline({
	      element: this.el,
	      displayOnlySelected: true,
	      colorBackground: "#313638",
	      colorButtonBackground: "#313638",
	      colorButtonStroke: "#aeb7bb",
	      colorScrollbar: "#313638",
	      colorScrollbarThumb: "#656c6f",
	      colorTimelineLabel: "#999",
	      colorTimelineTick: "#656c6f",
	      colorTimeScale: "#666",
	      colorHeaderBorder: "#313638",
	      colorTimeTicker: "#f00",
	      colorTrackBottomLine: "#555",
	      colorPropertyLabel: "#999",
	      onGuiSave: (function(_this) {
	        return function() {
	          return self.trigger("OnUIResize");
	        };
	      })(this),
	      setPropertyValue: function(propertyAnim, t) {
	        return propertyAnim.target[propertyAnim.propertyName].setValue(t);
	      },
	      applyPropertyValue: function(propertyAnim, t) {
	        return propertyAnim.target[propertyAnim.propertyName].setValue(propertyAnim.startValue + (propertyAnim.endValue - propertyAnim.startValue) * t);
	      },
	      getPropertyValue: function(propertyAnim) {
	        var val;
	        val = propertyAnim.target[propertyAnim.propertyName].attributes["value"];
	        if ($.type(val) !== "array") {
	          return val;
	        } else {
	          return val[0];
	        }
	      },
	      onTrackRebuild: (function(_this) {
	        return function() {
	          return _this.trigger("trackRebuild");
	        };
	      })(this),
	      onStop: (function(_this) {
	        return function() {
	          return _this.trigger("stopSound");
	        };
	      })(this),
	      onPlay: (function(_this) {
	        return function(time) {
	          return _this.trigger("startSound", time);
	        };
	      })(this)
	    });
	    Timeline.globalInstance = this.timeline;
	    this.timeline.loop(-1);
	    this.time = 0;
	    if (options.ui) {
	      this.ui = options.ui;
	      this.ui.on("render", this.update);
	      this.ui.on("selectAnims", this.selectAnims);
	      this.ui.on("timelineResize", this.resize);
	    }
	    return this.trigger("OnUIResize");
	  };
	
	  AppTimeline.prototype.selectAnims = function(nodes) {
	    if (this.timeline) {
	      return this.timeline.selectAnims(nodes);
	    }
	  };
	
	  AppTimeline.prototype.onNodeRemove = function(node) {
	    return this.selectAnims([]);
	  };
	
	  AppTimeline.prototype.remove = function() {
	    this.undelegateEvents();
	    if (this.ui) {
	      this.ui.off("render", this.update);
	      this.ui.off("selectAnims", this.selectAnims);
	      this.ui.off("timelineResize", this.resize);
	      delete this.ui;
	    }
	    this.timeline.destroy();
	    delete this.timeline;
	    return this.time = null;
	  };
	
	  AppTimeline.prototype.resize = function(height) {
	    if (this.timeline) {
	      this.timeline.canvasHeight = height;
	      this.timeline.tracksScrollY = 0;
	      this.timeline.tracksScrollThumbPos = 0;
	      return this.timeline.save();
	    }
	  };
	
	  AppTimeline.prototype.update = function() {
	    var dt, n;
	    n = Date.now();
	    if (this.timeline) {
	      dt = n - this.time;
	      this.timeline.update(dt / 1000);
	    }
	    return this.time = n;
	  };
	
	  return AppTimeline;
	
	})(Backbone.View);
	
	module.exports = AppTimeline;


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

	var Backbone, UrlHandler,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	Backbone = __webpack_require__(3);
	
	UrlHandler = (function(superClass) {
	  extend(UrlHandler, superClass);
	
	  function UrlHandler() {
	    this.onPlayExample = bind(this.onPlayExample, this);
	    this.onExample = bind(this.onExample, this);
	    this.onPlay = bind(this.onPlay, this);
	    this.onDefault = bind(this.onDefault, this);
	    return UrlHandler.__super__.constructor.apply(this, arguments);
	  }
	
	  UrlHandler.prototype.routes = {
	    "": "onDefault",
	    "play": "onPlay",
	    "example/:file": "onExample",
	    "play/example/:file": "onPlayExample"
	  };
	
	  UrlHandler.prototype.onDefault = function() {
	    return this.trigger("SetDisplayModeCommand", false);
	  };
	
	  UrlHandler.prototype.onPlay = function() {
	    return this.trigger("SetDisplayModeCommand", true);
	  };
	
	  UrlHandler.prototype.onExample = function(file, player_mode) {
	    var self;
	    if (player_mode == null) {
	      player_mode = false;
	    }
	    self = this;
	    this.trigger("SetDisplayModeCommand", player_mode);
	    this.trigger("ClearWorkspace");
	    return $.ajax({
	      url: "examples/" + file,
	      dataType: 'text',
	      success: function(data) {
	        return self.trigger("LoadJSON", data);
	      }
	    });
	  };
	
	  UrlHandler.prototype.onPlayExample = function(file) {
	    return this.onExample(file, true);
	  };
	
	  return UrlHandler;
	
	})(Backbone.Router);
	
	module.exports = UrlHandler;


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

	var Backbone, CodeExporter, FileHandler, Utils, _,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(2);
	
	Backbone = __webpack_require__(3);
	
	Utils = __webpack_require__(5);
	
	CodeExporter = __webpack_require__(112);
	
	__webpack_require__(81);
	
	__webpack_require__(82);
	
	FileHandler = (function(superClass) {
	  extend(FileHandler, superClass);
	
	  function FileHandler(core) {
	    this.core = core;
	    this.loadLocalFile = bind(this.loadLocalFile, this);
	    this.loadFromJsonData = bind(this.loadFromJsonData, this);
	    this.saveLocalFile = bind(this.saveLocalFile, this);
	    _.extend(FileHandler.prototype, Backbone.Events);
	  }
	
	  FileHandler.prototype.saveLocalFile = function() {
	    var blob, fileSaver, result_string;
	    result_string = this.core.dump();
	    blob = new Blob([result_string], {
	      "text/plain;charset=utf-8": "text/plain;charset=utf-8"
	    });
	    return fileSaver = saveAs(blob, "nodes.json");
	  };
	
	  FileHandler.prototype.loadFromJsonData = function(txt) {
	    var loaded_data;
	    loaded_data = JSON.parse(txt);
	    return this.core.setNodes(loaded_data);
	  };
	
	  FileHandler.prototype.loadLocalFile = function(e) {
	    var file, reader, self;
	    this.trigger("ClearWorkspace");
	    file = e.target.files[0];
	    reader = new FileReader();
	    self = this;
	    reader.onload = function(e) {
	      var txt;
	      txt = e.target.result;
	      return self.loadFromJsonData(txt);
	    };
	    return reader.readAsText(file, "UTF-8");
	  };
	
	  return FileHandler;
	
	})(Backbone.Events);
	
	module.exports = FileHandler;


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

	var Backbone, CodeExporter, _,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
	
	_ = __webpack_require__(2);
	
	Backbone = __webpack_require__(3);
	
	CodeExporter = (function() {
	  function CodeExporter() {
	    this.nodeToCode = bind(this.nodeToCode, this);
	    this.toCode = bind(this.toCode, this);
	  }
	
	  CodeExporter.prototype.toCode = function(json) {
	    var connection, i, j, len, len1, node, ref, ref1, res;
	    res = "//\n";
	    res += "// code exported from ThreeNodes.js (github.com/idflood/ThreeNodes.js)\n";
	    res += "//\n\n";
	    res += "require.config({paths: {jQuery: 'loaders/jquery-loader',Underscore: 'loaders/Underscore-loader',Backbone: 'loaders/backbone-loader'}});";
	    res += "require(['threenodes/App', 'libs/jquery-1.6.4.min', 'libs/Underscore-min', 'libs/backbone'], function(App) {";
	    res += "\n\n";
	    res += '"use strict";\n';
	    res += "var app = new App();\n";
	    res += "var nodes = app.nodes;\n\n";
	    res += "//\n";
	    res += "// nodes\n";
	    res += "//\n";
	    ref = json.nodes;
	    for (i = 0, len = ref.length; i < len; i++) {
	      node = ref[i];
	      res += this.nodeToCode(node);
	    }
	    res += "\n";
	    res += "//\n";
	    res += "// connections\n";
	    res += "//\n\n";
	    ref1 = json.connections;
	    for (j = 0, len1 = ref1.length; j < len1; j++) {
	      connection = ref1[j];
	      res += this.connectionToCode(connection);
	    }
	    res += "\n\n";
	    res += "// set player mode\n";
	    res += "app.setDisplayMode('SetDisplayModeCommand', true);\n";
	    res += "});";
	    return res;
	  };
	
	  CodeExporter.prototype.nodeToCode = function(node) {
	    var anim_to_code, fields_to_code, res;
	    anim_to_code = function(anims) {
	      var anim, i, len, propName, ref, res;
	      res = "{\n";
	      for (propName in anims) {
	        res += "\t\t" + ("'" + propName + "' : [\n");
	        ref = anims[propName];
	        for (i = 0, len = ref.length; i < len; i++) {
	          anim = ref[i];
	          res += "\t\t\t" + ("{time: " + anim.time + ", value: " + anim.value + ", easing: '" + anim.easing + "'},\n");
	        }
	        res += "\t\t" + "],\n";
	      }
	      res += "\t}";
	      return res;
	    };
	    fields_to_code = function(fields) {
	      var field, i, len, ref, res;
	      res = "{'in': [\n";
	      ref = fields["in"];
	      for (i = 0, len = ref.length; i < len; i++) {
	        field = ref[i];
	        if (field.val) {
	          res += "\t\t{name: '" + field.name + "', val: " + field.val + "},\n";
	        } else {
	          res += "\t\t{name: '" + field.name + "'},\n";
	        }
	      }
	      res += "\t]}";
	      return res;
	    };
	    res = "\n// node: " + node.name + "\n";
	    res += "var node_" + node.id + "_data = {\n";
	    res += "\t" + ("id: " + node.id + ",\n");
	    res += "\t" + ("name: '" + node.name + "',\n");
	    res += "\t" + ("type: '" + node.type + "',\n");
	    res += "\t" + ("x: " + node.x + ",\n");
	    res += "\t" + ("y: " + node.y + ",\n");
	    res += "\t" + ("fields: " + (fields_to_code(node.fields)) + ",\n");
	    res += "\t" + ("anim: " + (anim_to_code(node.anim)) + "\n");
	    res += "};\n";
	    res += "var node_" + node.id + " = nodes.createNode(node_" + node.id + "_data);\n";
	    return res;
	  };
	
	  CodeExporter.prototype.connectionToCode = function(connection) {
	    var res;
	    res = "var connection_" + connection.id + "_data = {\n";
	    res += "\t" + ("id: " + connection.id + ",\n");
	    res += "\t" + ("from_node: " + connection.from_node + ", from: '" + connection.from + "',\n");
	    res += "\t" + ("to_node: " + connection.to_node + ", to: '" + connection.to + "'\n");
	    res += "};\n";
	    res += "var connection_" + connection.id + " = nodes.createConnectionFromObject(connection_" + connection.id + "_data);\n";
	    return res;
	  };
	
	  return CodeExporter;
	
	})();
	
	module.exports = CodeExporter;


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

	var Backbone, NodeView, WebGLRenderer, _,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;
	
	_ = __webpack_require__(2);
	
	Backbone = __webpack_require__(3);
	
	__webpack_require__(4);
	
	NodeView = __webpack_require__(38);
	
	WebGLRenderer = (function(superClass) {
	  extend(WebGLRenderer, superClass);
	
	  function WebGLRenderer() {
	    this.apply_size = bind(this.apply_size, this);
	    this.add_renderer_to_dom = bind(this.add_renderer_to_dom, this);
	    this.create_preview_view = bind(this.create_preview_view, this);
	    this.create_popup_view = bind(this.create_popup_view, this);
	    this.add_mouse_handler = bind(this.add_mouse_handler, this);
	    this.remove = bind(this.remove, this);
	    this.update = bind(this.update, this);
	    this.initialize = bind(this.initialize, this);
	    return WebGLRenderer.__super__.constructor.apply(this, arguments);
	  }
	
	  WebGLRenderer.prototype.initialize = function(options) {
	    WebGLRenderer.__super__.initialize.apply(this, arguments);
	    this.preview_mode = true;
	    this.creating_popup = false;
	    this.win = false;
	    this.old_bg = false;
	    $("body").append("<div id='webgl-window'></div>");
	    this.webgl_container = $("#webgl-window");
	    this.apply_size();
	    this.apply_bg_color();
	    this.add_mouse_handler();
	    this.model.on("on_compute", this.update);
	    return this.webgl_container.bind("click", (function(_this) {
	      return function(e) {
	        if (_this.model.settings.player_mode === false) {
	          return _this.create_popup_view();
	        }
	      };
	    })(this));
	  };
	
	  WebGLRenderer.prototype.update = function() {
	    if (this.creating_popup === true && !this.win) {
	      return;
	    }
	    this.creating_popup = false;
	    if (!this.model.settings.test) {
	      this.add_renderer_to_dom();
	    }
	    this.apply_size();
	    return this.apply_bg_color();
	  };
	
	  WebGLRenderer.prototype.remove = function() {
	    if (this.win && this.win !== false) {
	      this.win.close();
	    }
	    this.webgl_container.unbind();
	    this.webgl_container.remove();
	    delete this.webgl_container;
	    delete this.win;
	    return WebGLRenderer.__super__.remove.apply(this, arguments);
	  };
	
	  WebGLRenderer.prototype.add_mouse_handler = function() {
	    $(this.model.ob.domElement).unbind("mousemove");
	    $(this.model.ob.domElement).bind("mousemove", function(e) {
	      ThreeNodes.renderer.mouseX = e.clientX;
	      return ThreeNodes.renderer.mouseY = e.clientY;
	    });
	    return this;
	  };
	
	  WebGLRenderer.prototype.create_popup_view = function() {
	    var h, w;
	    this.preview_mode = false;
	    this.creating_popup = true;
	    w = this.model.fields.getField('width').getValue();
	    h = this.model.fields.getField('height').getValue();
	    this.win = window.open('', 'win' + this.model.id, "width=" + w + ",height=" + h + ",scrollbars=false,location=false,status=false,menubar=false");
	    $("body", $(this.win.document)).append(this.model.ob.domElement);
	    $("*", $(this.win.document)).css({
	      padding: 0,
	      margin: 0
	    });
	    this.win.onbeforeunload = (function(_this) {
	      return function() {
	        _this.preview_mode = true;
	        _this.win.onbeforeunload = false;
	        _this.win = false;
	        _this.webgl_container.append(_this.model.ob.domElement);
	        _this.apply_bg_color(true);
	        _this.apply_size(true);
	      };
	    })(this);
	    this.apply_bg_color(true);
	    this.apply_size(true);
	    this.add_mouse_handler();
	    return this;
	  };
	
	  WebGLRenderer.prototype.create_preview_view = function() {
	    this.preview_mode = true;
	    this.webgl_container.append(this.model.ob.domElement);
	    this.apply_bg_color(true);
	    this.apply_size(true);
	    this.add_mouse_handler();
	    return this;
	  };
	
	  WebGLRenderer.prototype.add_renderer_to_dom = function() {
	    if (this.preview_mode && $("canvas", this.webgl_container).length === 0) {
	      this.create_preview_view();
	    }
	    if (this.preview_mode === false && this.win === false) {
	      this.create_popup_view();
	    }
	    return this;
	  };
	
	  WebGLRenderer.prototype.apply_bg_color = function(force_refresh) {
	    var new_val;
	    if (force_refresh == null) {
	      force_refresh = false;
	    }
	    new_val = this.model.fields.getField('bg_color').getValue().getStyle();
	    if (this.old_bg === new_val && force_refresh === false) {
	      return false;
	    }
	    this.model.ob.setClearColor(this.model.fields.getField('bg_color').getValue(), 1);
	    this.webgl_container.css({
	      background: new_val
	    });
	    if (this.win) {
	      $(this.win.document.body).css({
	        background: new_val
	      });
	    }
	    return this.old_bg = new_val;
	  };
	
	  WebGLRenderer.prototype.apply_size = function(force_refresh) {
	    var dh, dw, h, maxw, r, w;
	    if (force_refresh == null) {
	      force_refresh = false;
	    }
	    w = this.model.fields.getField('width').getValue();
	    h = this.model.fields.getField('height').getValue();
	    dw = w;
	    dh = h;
	    if (this.win === false && this.model.settings.player_mode === false) {
	      maxw = 220;
	      r = w / h;
	      dw = maxw;
	      dh = dw / r;
	    }
	    if (dw !== this.model.width || dh !== this.model.height || force_refresh) {
	      this.model.ob.setSize(dw, dh);
	      if (this.win && this.win !== false) {
	        this.win.resizeTo(dw, dh + 52);
	      }
	    }
	    this.model.width = dw;
	    return this.model.height = dh;
	  };
	
	  return WebGLRenderer;
	
	})(NodeView);
	
	ThreeNodes.Core.addNodeView('WebGLRenderer', WebGLRenderer);
	
	module.exports = WebGLRenderer;


/***/ })
/******/ ])
});
;
//# sourceMappingURL=ThreeNodes.UI.js.map