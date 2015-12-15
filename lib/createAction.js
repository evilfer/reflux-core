"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createAction;

var _utils = require("./utils");

var _ = _interopRequireWildcard(_utils);

var _ActionMethods = require("./ActionMethods");

var _ActionMethods2 = _interopRequireDefault(_ActionMethods);

var _PublisherMethods = require("./PublisherMethods");

var _PublisherMethods2 = _interopRequireDefault(_PublisherMethods);

var _Keep = require("./Keep");

var _Keep2 = _interopRequireDefault(_Keep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var allowed = { preEmit: 1, shouldEmit: 1 };

/**
 * Creates an action functor object. It is mixed in with functions
 * from the `PublisherMethods` mixin. `preEmit` and `shouldEmit` may
 * be overridden in the definition object.
 *
 * @param {Object} definition The action object definition
 */
function createAction(definition) {

    definition = definition || {};
    if (!_.isObject(definition)) {
        definition = { actionName: definition };
    }

    for (var a in _ActionMethods2.default) {
        if (!allowed[a] && _PublisherMethods2.default[a]) {
            throw new Error("Cannot override API method " + a + " in Reflux.ActionMethods. Use another method name or override it on Reflux.PublisherMethods instead.");
        }
    }

    for (var d in definition) {
        if (!allowed[d] && _PublisherMethods2.default[d]) {
            throw new Error("Cannot override API method " + d + " in action creation. Use another method name or override it on Reflux.PublisherMethods instead.");
        }
    }

    definition.children = definition.children || [];
    if (definition.asyncResult) {
        definition.children = definition.children.concat(["completed", "failed"]);
    }

    var i = 0,
        childActions = {};
    for (; i < definition.children.length; i++) {
        var name = definition.children[i];
        childActions[name] = createAction(name);
    }

    var context = _.extend({
        eventLabel: "action",
        emitter: new _.EventEmitter(),
        _isAction: true
    }, _PublisherMethods2.default, _ActionMethods2.default, definition);

    var functor = function () {
        var triggerType = functor.sync ? "trigger" : "triggerAsync";
        return functor[triggerType].apply(functor, arguments);
    };

    _.extend(functor, childActions, context);

    _Keep2.default.createdActions.push(functor);

    return functor;
}
