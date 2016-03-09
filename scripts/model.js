App = {model: (function model(){
	var data;
	var observers = [];
	function observe(callback){
		if (observers.indexOf(callback) >= 0) console.warn('callback is already registered');
		else observers.push(callback);
	}
	function unobserve(callback){
		var index = observers.indexOf(callback);
		if (index < 0) console.warn('callback is not registered');
		else observers.splice(index, 1);
	}
	function notifyAll(){
		observers.forEach(((d)=>d(this)).bind(this));
	}
	return {
		get data() { return data },
		set data(newData) { data = newData; notifyAll.call(this); },
		observe: observe,
		unobserve: unobserve
	};
})()};