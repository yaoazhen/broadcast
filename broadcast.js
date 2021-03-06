/*
 *	# BaseStation
 *	# The Core Of This Lib
 *	# To Broadcast Message To Other Component
 */
;(function (name, factory) {
    var hasDefine = typeof define === 'function' && define.amd,
        hasExports = typeof moudule !== 'undefined' && moudule.exports;

    if (hasDefine) {/*AMD Module*/
        define(factory);
    }
    else if (hasExports) {/*Node.js Module*/
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        moudule.exports = factory();
    }
    else {
        /*Assign to common namespaces or simply the global object (window)*/
        this[name] = factory();
    }
})('broadcast', function () {
    var _debug = function () {
        if (console) {
            console.dir(arguments);
        }
    };

    var nativeIsArray = Array.isArray;
    var isArray = nativeIsArray || function (obj) {
            return toString.call(obj) === '[object Array]';
        };

    var components = {};

    var trigger = function (event, args, context) {
        var e = event || false;
        var a = args || [];
        if (!isArray(a)) {
            a = [a];
        }

        if (!e) {
            return;
        }

        for (var c in components) {
            if (typeof components[c][e] == "function") {
                try {
                    var s = context || components[c];
                    components[c][e].apply(s, a);
                }
                catch (err) {
                    _debug('BaseStation error', e, a, s, err);
                }
            }
        }
    };

    var removeComponent = function (name) {
        if (name in components) {
            delete components[name];
        }
    };

    var addComponent = function (name, component, replaceDuplicate) {
        if (name in components) {
            if (replaceDuplicate) {
                removeComponent(name);
            }
            else {
                throw new Error('component name conflict: ' + name);
            }
        }

        components[name] = component;
    };

    var getComponent = function (name) {
        return components[name] || false;
    };

    var has = function (name) {
        return (name in components)
    };

    return {
        trigger: trigger,
        add: addComponent,
        remove: removeComponent,
        get: getComponent,
        has: has
    };
});