import * as _ from "./utils";
import Keep from "./Keep";
import mixer from "./mixer";
import { bindMethods } from "./bindMethods";
import { default as StoreMethods } from "./StoreMethods";
import { default as PublisherMethods } from "./PublisherMethods";
import { default as ListenerMethods } from "./ListenerMethods";

var allowed = { preEmit: 1, shouldEmit: 1 };

/**
 * Creates an event emitting Data Store. It is mixed in with functions
 * from the `ListenerMethods` and `PublisherMethods` mixins. `preEmit`
 * and `shouldEmit` may be overridden in the definition object.
 *
 * @param {Object} definition The data store object definition
 * @returns {Store} A data store instance
 */
export default function createStore(definition) {

    definition = definition || {};

    for(var a in StoreMethods){
        if (!allowed[a] && (PublisherMethods[a] || ListenerMethods[a])){
            throw new Error("Cannot override API method " + a +
                " in Reflux.StoreMethods. Use another method name or override it on Reflux.PublisherMethods / Reflux.ListenerMethods instead."
            );
        }
    }

    for(var d in definition){
        if (!allowed[d] && (PublisherMethods[d] || ListenerMethods[d])){
            throw new Error("Cannot override API method " + d +
                " in store creation. Use another method name or override it on Reflux.PublisherMethods / Reflux.ListenerMethods instead."
            );
        }
    }

    definition = mixer(definition);

    function Store() {
        var i = 0, arr;
        this.subscriptions = [];
        this.emitter = new _.EventEmitter();
        this.eventLabel = "change";
        bindMethods(this, definition);
        if (this.init && _.isFunction(this.init)) {
            this.init();
        }
        if (this.listenables){
            arr = [].concat(this.listenables);
            for(; i < arr.length; i++){
                this.listenToMany(arr[i]);
            }
        }
    }

    _.extend(Store.prototype, ListenerMethods, PublisherMethods, StoreMethods, definition);

    var store = new Store();
    Keep.createdStores.push(store);

    return store;
}
