// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"app.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __values = this && this.__values || function (o) {
  var s = typeof Symbol === "function" && Symbol.iterator,
      m = s && o[s],
      i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function next() {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};

var container = document.getElementById('root');
var NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
var CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';
var store = {
  currentPage: 1,
  feeds: []
}; // 믹스인 상속 코드
// targetClass로 제공된 class에 baseClasses로 제공된 n개의 class의 기능들을 합성시키는 코드

function applyApiMixins(targetClass, baseClasses) {
  baseClasses.forEach(function (baseClass) {
    Object.getOwnPropertyNames(baseClass.prototype).forEach(function (name) {
      var descriptor = Object.getOwnPropertyDescriptor(baseClass.prototype, name);

      if (descriptor) {
        Object.defineProperty(targetClass.prototype, name, descriptor);
      }
    });
  });
}

var Api =
/** @class */
function () {
  function Api(url) {
    this.ajax = new XMLHttpRequest();
    this.url = url;
  }

  Api.prototype.getRequest = function () {
    // 긁어올 페이지를 오픈
    this.ajax.open('GET', this.url, false); // 데이터를 전송

    this.ajax.send(); // 함수처리의 결과물을 반환

    return JSON.parse(this.ajax.response);
  };

  return Api;
}();

var NewsFeedApi =
/** @class */
function (_super) {
  __extends(NewsFeedApi, _super);

  function NewsFeedApi() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  NewsFeedApi.prototype.getData = function () {
    return this.getRequest();
  };

  return NewsFeedApi;
}(Api);

var NewsDetailApi =
/** @class */
function (_super) {
  __extends(NewsDetailApi, _super);

  function NewsDetailApi() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  NewsDetailApi.prototype.getData = function () {
    return this.getRequest();
  };

  return NewsDetailApi;
}(Api);

applyApiMixins(NewsFeedApi, [Api]);
applyApiMixins(NewsDetailApi, [Api]);

var View =
/** @class */
function () {
  function View(containerId, template) {
    var containerElement = document.getElementById(containerId); // containerElement가 null로 반환될 수 있기에 예외처리

    if (!containerElement) {
      throw '최상위 컨테이너가 없어 UI를 진행하지 못합니다';
    } // 초기화


    this.container = containerElement;
    this.template = template;
    this.renderTemplate = template;
    this.htmlList = [];
  }

  View.prototype.updateView = function () {
    this.container.innerHTML = this.renderTemplate;
    this.renderTemplate = this.template;
  };

  View.prototype.addHtml = function (htmlString) {
    this.htmlList.push(htmlString);
  };

  View.prototype.getHtml = function () {
    var snapshot = this.htmlList.join('');
    this.clearHtmlList();
    return snapshot;
  };

  View.prototype.setTemplateData = function (key, value) {
    this.renderTemplate = this.renderTemplate.replace("{{__".concat(key, "__}}"), value);
  };

  View.prototype.clearHtmlList = function () {
    this.htmlList = [];
  };

  return View;
}();

var Router =
/** @class */
function () {
  function Router() {
    // window객체
    // hashchange를 화면전환을 위한 트리거로 사용
    // route메소드를 인자로 연결. Router의 인스턴스로 사용하기 위해 bind로 고정
    window.addEventListener('hashchange', this.route.bind(this));
    this.routeTable = [];
    this.defaultPage = null;
  }

  Router.prototype.setDefaultPage = function (page) {
    this.defaultPage = {
      path: '',
      page: page
    };
  };

  Router.prototype.addRoutePath = function (path, page) {
    this.routeTable.push({
      path: path,
      page: page
    });
  };

  Router.prototype.route = function () {
    var e_1, _a; // hash 알아내기


    var routePath = location.hash; // defaultpage 체크

    if (routePath === '' && this.defaultPage) {
      this.defaultPage.page.render();
    }

    try {
      for (var _b = __values(this.routeTable), _c = _b.next(); !_c.done; _c = _b.next()) {
        var routeInfo = _c.value;

        if (routePath.indexOf(routeInfo.path) >= 0) {
          routeInfo.page.render();
          break;
        }
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
  };

  return Router;
}();

var NewsFeedView =
/** @class */
function (_super) {
  __extends(NewsFeedView, _super);

  function NewsFeedView(containerId) {
    var _this = this;

    var template = "\n    <div class=\"bg-gray-600 min-h-screen\">\n    <div class=\"bg-white text-xl\">\n    <div class=\"mx-auto px-4\">\n          <div class=\"flex justify-between items-center py-6\">\n            <div class=\"flex justify-start\">\n              <h1 class=\"font-extrabold\">Hacker News</h1>\n            </div>\n            <div class=\"items-center justify-end\">\n              <a href=\"#/page/{{__prev_page__}}\" class=\"text-gray-500\">\n                Previous\n              </a>\n              <a href=\"#/page/{{__next_page__}}\" class=\"text-gray-500 ml-4\">\n                Next\n              </a>\n            </div>\n          </div> \n        </div>\n      </div>\n      <div class=\"p-4 text-2xl text-gray-700\">\n        {{__news_feed__}}        \n      </div>\n      </div>\n    ";
    _this = _super.call(this, containerId, template) || this;
    _this.api = new NewsFeedApi(NEWS_URL); // 매번 페이지 전체 글들을 긁어오는것은 비효율적이므로, 읽은 글은 읽었다고 처리하고 저장하도록

    _this.feeds = store.feeds; // 최초실행시, news_url의 데이터를 가져옴

    if (_this.feeds.length === 0) {
      _this.feeds = store.feeds = _this.api.getData();

      _this.makeFeeds();
    }

    return _this;
  }

  NewsFeedView.prototype.render = function () {
    // 1페이지가 디폴트 페이지
    store.currentPage = Number(location.hash.substring(7) || 1);

    for (var i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
      var _a = this.feeds[i],
          id = _a.id,
          title = _a.title,
          comments_count = _a.comments_count,
          user = _a.user,
          points = _a.points,
          time_ago = _a.time_ago,
          read = _a.read; // 목록 UI
      // 읽은 적이 있으면, 배경이 빨강색으로 처리되도록

      this.addHtml("\n          <div class=\"p-6 ".concat(read ? 'bg-red-500' : 'bg-white', " mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100\">\n          <div class=\"flex\">\n            <div class=\"flex-auto\">\n              <a href=\"#/show/").concat(id, "\">").concat(title, "</a>  \n            </div>\n            <div class=\"text-center text-sm\">\n              <div class=\"w-10 text-white bg-green-300 rounded-lg px-0 py-2\">").concat(comments_count, "</div>\n            </div>\n          </div>\n          <div class=\"flex mt-3\">\n            <div class=\"grid grid-cols-3 text-sm text-gray-500\">\n              <div><i class=\"fas fa-user mr-1\"></i>").concat(user, "</div>\n              <div><i class=\"fas fa-heart mr-1\"></i>").concat(points, "</div>\n              <div><i class=\"far fa-clock mr-1\"></i>").concat(time_ago, "</div>\n            </div>  \n          </div>\n        </div>  \n        "));
    } // 템플릿 안에 마킹해놓은 자리에 for문으로 만들어진 코드를 집어넣기


    this.setTemplateData('news_feed', this.getHtml());
    this.setTemplateData('prev_page', String(store.currentPage > 1 ? store.currentPage - 1 : 1));
    this.setTemplateData('next_page', String(store.currentPage + 1));
    this.updateView();
  }; // 읽음처리 로직


  NewsFeedView.prototype.makeFeeds = function () {
    for (var i = 0; i < this.feeds.length; i++) {
      this.feeds[i].read = false;
    }
  };

  return NewsFeedView;
}(View);

var NewsDetailView =
/** @class */
function (_super) {
  __extends(NewsDetailView, _super);

  function NewsDetailView(containerId) {
    var template = "\n      <div class=\"bg-gray-600 min-h-screen\">\n        <div class=\"bg-white text-xl\">\n          <div class=\"mx-auto px-4\">\n            <div class=\"flex justify-between items-center py-6\">\n              <div class=\"flex justify-start\">\n                <h1 class=\"font-extrabold\">Hacker News</h1>\n              </div>\n              <div class=\"items-center justify-end\">\n                <a href=\"#/page/{{__currentPage__}}\" class=\"text-gray-500\">\n                  <i class=\"fa fa-times\"></i>\n                </a>\n              </div>\n            </div> \n          </div>\n        </div>\n\n        <div class=\"h-full border rounded-xl bg-white m-6 p-4\">\n          <h2>{{__title__}}</h2>\n          <div class=\"text-gray-400 h-20\">\n            {{__content__}}\n          </div>   \n\n          {{__comments__}}\n\n        </div>\n      </div>\n    ";
    return _super.call(this, containerId, template) || this;
  }

  NewsDetailView.prototype.render = function () {
    var id = location.hash.substring(7);
    var api = new NewsDetailApi(CONTENT_URL.replace('@id', id));
    var newsDetail = api.getData();

    for (var i = 0; i < store.feeds.length; i++) {
      if (store.feeds[i].id === Number(id)) {
        store.feeds[i].read = true;
        break;
      }
    }

    this.setTemplateData('{{__comments__}}', this.makeComment(newsDetail.comments));
    this.setTemplateData('currentPage', String(store.currentPage));
    this.setTemplateData('title', newsDetail.title);
    this.setTemplateData('content', newsDetail.content);
    this.updateView();
  }; // 댓글기능


  NewsDetailView.prototype.makeComment = function (comments) {
    for (var i = 0; i < comments.length; i++) {
      var comment = comments[i]; // 배열에 html형식으로 작성
      // 댓글에 댓글이 달릴때마다 indent 공간이 커지도록

      this.addHtml("\n        <div style=\"padding-left: ".concat(comment.level * 40, "px;\" class=\"mt-4\">\n          <div class=\"text-gray-400\">\n            <i class=\"fa fa-sort-up mr-2\"></i>\n            <strong>").concat(comment.user, "</strong> ").concat(comment.time_ago, "\n          </div>\n          <p class=\"text-gray-700\">").concat(comment.content, "</p>\n        </div>   \n      ")); // 대댓글 내용들을 재귀함수 형태로 push
      // i번째 대댓글의 댓글이 존재하면

      if (comment.comments.length > 0) {
        this.addHtml(this.makeComment(comment.comments));
      }
    } // push 내용을 하나의 문자열로 집어넣기


    return this.getHtml();
  };

  return NewsDetailView;
}(View);

var router = new Router();
var newsFeedView = new NewsFeedView('root');
var newsDetailView = new NewsDetailView('root');
router.setDefaultPage(newsFeedView);
router.addRoutePath('./page', newsFeedView);
router.addRoutePath('./page', newsDetailView); //최초 진입시 라우터 함수 직접 실행(처음엔 혼자 작동하지 X)

router.route();
},{}],"../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62961" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","app.ts"], null)
//# sourceMappingURL=/app.c61986b1.js.map