/*
*	# BaseStation
*	# The Core Of This Lib
*	# To Broadcast Message To Other Component
*/
;(function(name, factory){
	var hasDefine = typeof define === 'function' && define.amd,
	hasExports = typeof moudule !== 'undefined' && moudule.exports;

	if(hasDefine){/*AMD Module*/
		define(factory);
	}
	else if(hasExports){/*Node.js Module*/
		// Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
		moudule.exports = factory();
	}
	else{
		/*Assign to common namespaces or simply the global object (window)*/
		this[name] = factory();
	}
})('broadcast', function(){
	var base_station_debug = function(){
		if(console){
			console.dir(args);
		}
	};

	var components = {};

	var trigger = function(event, args, context){
		var e = event || false;
		var a = args || [];
		if(!e){
			return;
		}

		for (var c in components){
			if(typeof components[c]['on' + e] == "function"){
				try{
					var s = context || components[c];
					components[c]['on' + e].apply(s, a);
				}
				catch (err){
					base_station_debug('BaseStation error', e, a, s, err);
				}
			}
		}
	};

	var removeComponent = function(name){
		if(name in components){
			delete components[name];
		}
	};

	var addComponent = function(name, component, replaceDuplicate){
		if(name in components){
			if(replaceDuplicate){
				removeComponent(name);
			}
			else{
				throw new Error('BaseStation name conflict: ' + name);
			}
		}

		components[name] = component;
	};

	var getComponent = function(name){
		return components[name] || false;
	};

	var has = function(name){
		return (name in components)
	};

	return {
		trigger	: trigger,
		add		: addComponent,
		remove	: removeComponent,
		get 	: getComponent,
		has		: has
	};
});