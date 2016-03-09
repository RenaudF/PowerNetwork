(function controller(){
	var accessorMap = {
		'IEEE300': {
			url: 'IEEE300busNum',
			accessors: {
				source: 'Source',
				target: 'Target',
				id: 'BusNum'
			}
		},
		'Ireland2013': {
			url: 'Ireland2013All',
			accessors: {
				source: 'Terminal i',
				target: 'Terminal j',
				id: 'Names'
			}
		}
	};
	// setup event listeners
	var selectedNetwork;
	Object.keys(accessorMap).forEach((network)=>{
		$('#'+network).click(function clickHandler(){
			if (selectedNetwork !== (selectedNetwork = network)) select(network);
		});
	});
	// on network selection change
	function select(network){
		console.log('selected '+network);
		$('#selectedNetwork').text(selectedNetwork);
		// async plumbing
		var nodeDeferred = defer(), nodePromise = nodeDeferred.promise.then(nodeTransform);
		var edgeDeferred = defer(), edgePromise = edgeDeferred.promise.then(edgeTransform);
		Promise.all([nodePromise, edgePromise])
			.then(formatGraphData)
			.then((graphData)=>App.model.data = graphData);
		// data fetch
		d3.tsv('data/'+accessorMap[selectedNetwork].url+'Nodes.tsv')
			.row(numberCast)
			.get((err, rows)=>{
				if (err) console.error(err);
				else nodeDeferred.resolve(rows);
			});
		d3.tsv('data/'+accessorMap[selectedNetwork].url+'Arcs.tsv')
			.row(numberCast)
			.get((err, rows)=>{
				if (err) console.error(err);
				else edgeDeferred.resolve(rows);
			});
	}
	// transformation functions
	function numberCast(d){
		Object.keys(d).forEach((key)=>{ if (!isNaN(d[key])) d[key] = +d[key]; });
		return d;
	}
	function nodeTransform(rows){
		return rows.map((row)=>{
			return {
				id: row[accessorMap[selectedNetwork].accessors.id],
				data: row
			};
		});
	}
	function edgeTransform(rows){
		return rows.map((row)=>{
			return {
				source: row[accessorMap[selectedNetwork].accessors.source],
				target: row[accessorMap[selectedNetwork].accessors.target],
				data: row
			};
		});
	}
	function formatGraphData(results){
		// d3 expects graph data in a particular format
		var nodes = results[0], edges = results[1];
		edges.forEach((edge)=>{
			edge.source = nodes.findIndex((node)=>node.id === edge.source);
			edge.target = nodes.findIndex((node)=>node.id === edge.target);
		});
		return {
			nodes: nodes,
			edges: edges
		}
	}
})();