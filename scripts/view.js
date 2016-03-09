(function view(){
	var force;
	var svg = d3.select('svg');
	App.model.observe(update);
	function update(model){
		console.log(model.data);
		console.log(model.data.nodes[0], model.data.edges[0]);
		force = d3.layout.force()
			.on('tick', function tick(){
				svg.selectAll('circle')
					.attr('cx', (d)=>d.x)
					.attr('cy', (d)=>d.y)
				svg.selectAll('line')
					.attr('x1', (d)=>d.source.x)
					.attr('y1', (d)=>d.source.y)
					.attr('x2', (d)=>d.target.x)
					.attr('y2', (d)=>d.target.y)
			})
			.size([svg.attr('width'), svg.attr('height')])
			.nodes(App.model.data.nodes)
			.links(App.model.data.edges)
			.start();

		var nodeSelection = svg.selectAll('circle').data(model.data.nodes, (d)=>d.id)
		nodeSelection.enter().append('circle')
			.attr('r', 20)
			.call(force.drag)
			.attr('opacity', 0.2)
			.attr('fill', 'red');
		nodeSelection.exit().remove();

		var edgeSelection = svg.selectAll('line').data(model.data.edges, (d)=>d.source.id+'->'+d.target.id)
		edgeSelection.enter().append('line')
			.attr('stroke', 'black')
			.attr('stroke-width', 2);
		edgeSelection.exit().remove();
	}
})();