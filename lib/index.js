"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ActionMethods = require("./ActionMethods");

var _ActionMethods2 = _interopRequireDefault(_ActionMethods);

var _ListenerMethods = require("./ListenerMethods");

var _ListenerMethods2 = _interopRequireDefault(_ListenerMethods);

var _PublisherMethods = require("./PublisherMethods");

var _PublisherMethods2 = _interopRequireDefault(_PublisherMethods);

var _StoreMethods = require("./StoreMethods");

var _StoreMethods2 = _interopRequireDefault(_StoreMethods);

var _joins = require("./joins");

var _utils = require("./utils");

var _ = _interopRequireWildcard(_utils);

var _createAction = require("./createAction");

var _createAction2 = _interopRequireDefault(_createAction);

var _createStore = require("./createStore");

var _createStore2 = _interopRequireDefault(_createStore);

var _Keep = require("./Keep");

var _Keep2 = _interopRequireDefault(_Keep);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var version = {
    "reflux-core": "@VERSION"
};

var joinTrailing = (0, _joins.staticJoinCreator)("last");
var all = joinTrailing; // Reflux.all alias for backward compatibility
var joinLeading = (0, _joins.staticJoinCreator)("first");
var joinStrict = (0, _joins.staticJoinCreator)("strict");
var joinConcat = (0, _joins.staticJoinCreator)("all");

var utils = _;

/**
 * Convenience function for creating a set of actions
 *
 * @param definitions the definitions for the actions to be created
 * @returns an object with actions of corresponding action names
 */
var createActions = (function () {
    var reducer = function reducer(definitions, actions) {
        Object.keys(definitions).forEach(function (actionName) {
            var val = definitions[actionName];
            actions[actionName] = (0, _createAction2.default)(val);
        });
    };

    return function (definitions) {
        var actions = {};
        if (definitions instanceof Array) {
            definitions.forEach(function (val) {
                if (_.isObject(val)) {
                    reducer(val, actions);
                } else {
                    actions[val] = (0, _createAction2.default)(val);
                }
            });
        } else {
            reducer(definitions, actions);
        }
        return actions;
    };
})();

/**
 * Sets the eventmitter that Reflux uses
 */
function setEventEmitter(ctx) {
    _.EventEmitter = ctx;
}

/**
 * Sets the method used for deferring actions and stores
 */
function nextTick(nextTick) {
    _.nextTick = nextTick;
}

function use(pluginCb) {
    pluginCb(this);
}

/**
 * Provides the set of created actions and stores for introspection
 */
/*eslint-disable no-underscore-dangle*/
exports.default = {
    version: version,
    ActionMethods: _ActionMethods2.default,
    ListenerMethods: _ListenerMethods2.default,
    PublisherMethods: _PublisherMethods2.default,
    StoreMethods: _StoreMethods2.default,
    utils: utils,
    createAction: _createAction2.default,
    createStore: _createStore2.default,
    createActions: createActions,
    setEventEmitter: setEventEmitter,
    nextTick: nextTick,
    use: use,
    joinTrailing: joinTrailing,
    all: all,
    joinLeading: joinLeading,
    joinStrict: joinStrict,
    joinConcat: joinConcat,
    __keep: _Keep2.default
};
/*eslint-enable no-underscore-dangle*/

/**
 * Warn if Function.prototype.bind not available
 */

if (!Function.prototype.bind) {
    console.error("Function.prototype.bind not available. " + "ES5 shim required. " + "https://github.com/spoike/refluxjs#es5");
}