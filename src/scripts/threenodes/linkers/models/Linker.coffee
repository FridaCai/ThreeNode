Backbond = require 'Backbone'

class Linker extends Backbone.Model
	defaults:
		id: ''
		name: 'linker'
		text: ''
		points: []
		from: {
			x: 0
			y: 0
			angle: 0
			id: ''
		}
		to: {
			x: 0
			y: 0
			angle: 0
			id: ''
		}
		lineStyle: {
			lineWidth: 2,
			lineColor: "255,0,0",
			lineStyle: "solid",
			beginArrowStyle: "none",
			endArrowStyle: "solidArrow"
		}

	initialize: (model, param)=>
		super
		# id = obj.id || indexer.getUID() 
		id = indexer.getUID()
		@set('id', id)


	@moveLinker: (linker, point, x, y) => 
		newPos = {
		  x: x
		  y: y 
		  angle: null
		}
		linkedShape = null
		linker.set('to', {
			x: newPos.x
			y: newPos.y
			id: linkedShape
			angle: newPos.angle
		})

		if(!linkedShape)
			to = linker.get('to')
			from = linker.get('from')

			if((newPos.x < from.x - 6) || (newPos.x > from.x + 6))
			else
				to.x = from.x
			
			if(newPos.y < from.y - 6 || newPos.y > from.y + 6)
			else
				to.y = from.y;
			
			linker.to= to
		
		Linker.render(linker, true)
	


	@render: (linker, pointChanged) => 
		if(pointChanged)
			linker.set('points', Linker.getLinkerPoints(linker))

		box = Linker.calcBox(linker)

		linkerBox = $("#" + linker.id);
		if(linkerBox.length == 0)
			superCanvas = $("#graph");
			linkerBox = $("<div id='"+linker.id+"' class='shape_box linker_box'><canvas class='shape_canvas'></canvas></div>").appendTo(superCanvas);
		


		linkerCanvas = linkerBox.find(".shape_canvas");
		linkerCanvas.attr({
			width: (box.w + 20)
			height: (box.h + 20)
		});
		linkerBox.css({
			position: 'absolute'
			left: (box.x - 10),
			top: (box.y - 10),
			width: (box.w + 20),
			height: (box.h + 20)
		});
		ctx = linkerCanvas[0].getContext("2d");
		# ctx.scale(Designer.config.scale, Designer.config.scale);
		ctx.translate(10, 10);
		style = linker.get('lineStyle');
		ctx.lineWidth = style.lineWidth;
		ctx.strokeStyle = "rgb("+style.lineColor+")";
		ctx.fillStyle = "rgb("+style.lineColor+")";
		ctx.save();

		from = linker.get('from');
		to = linker.get('to')
		begin = {x: from.x - box.x, y: from.y - box.y};
		end = {x: to.x - box.x, y: to.y - box.y};
		ctx.save();
		
		ctx.beginPath();
		ctx.moveTo(begin.x, begin.y);
		
		points = linker.get('points')

		console.log(points)
		for point in points
			#如果是折线，会有折点
			ctx.lineTo(point.x - box.x, point.y - box.y);
		
		ctx.lineTo(end.x, end.y);

		# selected = Utils.isSelected(linker.id);
		# if(selected)
		# 	#如果是选中了，绘制阴影
		# 	ctx.shadowBlur = 4;
		# 	ctx.shadowColor = "#833";
			
			
		
		ctx.stroke();
		ctx.restore(); #还原虚线样式和阴影
		ctx.restore();
	

	@calcBox: (linker) => 
		points = linker.get('points');
		from = linker.get('from');
		to = linker.get('to');
		minX = to.x;
		minY = to.y;
		maxX = from.x;
		maxY = from.y;
		if(to.x < from.x)
			minX = to.x;
			maxX = from.x;
		else
			minX = from.x;
			maxX = to.x;
		
		if(to.y < from.y)
			minY = to.y;
			maxY = from.y;
		else
			minY = from.y;;
			maxY = to.y;

		for point in points
			if(point.x < minX)
				minX = point.x;
			else if(point.x > maxX)
				maxX = point.x;
			
			if(point.y < minY)
				minY = point.y;
			else if(point.y > maxY)
				maxY = point.y;
		
		return {
			x: minX,
			y: minY,
			w: maxX - minX,
			h: maxY - minY
		}
	
	@getLinkerPoints: (linker)=>
		points = [];

		pi = Math.PI;
		from = linker.get('from');
		to = linker.get('to');
		xDistance = Math.abs(to.x - from.x);
		yDistance = Math.abs(to.y - from.y);
		minDistance = 30; #最小距离，比如起点向上，终点在下方，则先要往上画minDistance的距离
		
		if(from.id && to.id)
		else if(from.id || to.id)
			#只有起点或终点连接了形状
			#连接了形状的端点被认为是固定点，另一点被认为是活动的点
			fixed = null
			active = null 
			reverse = null

			angle = null

			if(from.id)
				fixed = from;
				active = to;
				reverse = false;
				angle = from.angle
			else
				fixed = to;
				active = from;
				reverse = true; #如果固定点是终点，需要把得到的点逆序，因为绘制时是从起点开始的，而此处计算获得的点将是从终点开始
				angle = to.angle
			
			if(angle >= pi / 4 && angle < pi / 4 * 3)
			else if(angle >= pi / 4 * 3 && angle < pi / 4 * 5)
			else if(angle >= pi / 4 * 5 && angle < pi / 4 * 7)
				#起点角度为向下
				if(active.y > fixed.y)
					console.log('Frida Test 4');
					if(xDistance >= yDistance)
						points.push({x: fixed.x, y: active.y});
					else
						half = yDistance / 2;
						points.push({x: fixed.x, y: fixed.y + half});
						points.push({x: active.x, y: fixed.y + half});
			console.log(points)
			return points;
	@removeLinker: (linker)=>
		$("#" + linker.id).remove();
module.exports = Linker
