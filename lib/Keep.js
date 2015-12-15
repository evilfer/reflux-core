"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var createdStores = [];

var createdActions = [];

function reset() {
    while (createdStores.length) {
        createdStores.pop();
    }
    while (createdActions.length) {
        createdActions.pop();
    }
}

exports.default = { createdStores: createdStores, createdActions: createdActions, reset: reset };