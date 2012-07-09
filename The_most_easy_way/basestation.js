/*
*	# BaseStation
*	# The Core Of This Lib
*	# To Broadcast Message To Other Component
*/
var BaseStation = function(){
	var base_station_debug = function(){
		// console.log or air.trace as desired
		if(console){
			console.dir(args);
		}
	};

	var components = {};

	var broadcast = function(event, args, context){
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
		name		: 'BaseStation',
		broadcast	: broadcast,
		add			: addComponent,
		remove		: removeComponent,
		get 		: getComponent,
		has			: has
	};
}();