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

	# linker: target to move
	# point: to/from
	# x, y: position to move
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
			


			props = {
				x: fixed.x
				y: fixed.y
				w: 90
				h: 26
			}

			console.log('=======angle======')
			console.log(angle)
			if(angle >= pi / 4 and angle < pi / 4 * 3)
					#起点角度为向上
					if(active.y < fixed.y)
						#终点在起点图形上方
						if(xDistance >= yDistance)
							#如果终点离起点的水平距离较远，最终方向为水平，此情况下只有一个折点
							points.push({x: fixed.x, y: active.y});
						else
							#如果终点离起点的垂直距离较远，最终方向为向上，此情况下有两个折点
							half = yDistance / 2;
							points.push({x: fixed.x, y: fixed.y - half});
							points.push({x: active.x, y: fixed.y - half});
					else
						#终点在起点水平平行或下方的位置
						points.push({x: fixed.x, y: fixed.y - minDistance}); #先向上画一笔
						if(xDistance >= yDistance)
							#如果终点离起点的水平距离较远，最终方向为水平
							if(active.x >= props.x - minDistance and active.x <= props.x + props.w + minDistance)
								#如果终点在x轴上的坐标，在图形范围内，在判断终点与形状是偏左还是偏右
								shapeHalf = props.x + props.w / 2;
								if(active.x < shapeHalf)
									#偏左，第二点在形状左上角
									points.push({x: props.x - minDistance, y: fixed.y - minDistance});
									points.push({x: props.x - minDistance, y: active.y});
								else
									points.push({x: props.x + props.w + minDistance, y: fixed.y - minDistance});
									points.push({x: props.x + props.w + minDistance, y: active.y});
							else
								#如果终点在x轴上的坐标，在图形范围外，此时有三个点
								if(active.x < props.x)
									points.push({x: active.x + minDistance, y: fixed.y - minDistance})
									points.push({x: active.x + minDistance, y: active.y})
								else
									points.push({x: active.x - minDistance, y: fixed.y - minDistance})
									points.push({x: active.x - minDistance, y: active.y})
						else
							#如果终点离起点的垂直距离较远，最终方向为向下
							if(active.x >= props.x - minDistance)
								if (active.x <= props.x + props.w + minDistance)
									#如果终点在x轴上的坐标，在图形范围内，此时有四个点
									#在判断终点与形状是偏左还是偏右
									shapeHalf = props.x + props.w / 2;
									if(active.x < shapeHalf)
										#偏左，第二点在形状左上角
										points.push({x: props.x - minDistance, y: fixed.y - minDistance});
										points.push({x: props.x - minDistance, y: active.y - minDistance});
										points.push({x: active.x, y: active.y - minDistance});
									else
										points.push({x: props.x + props.w + minDistance, y: fixed.y - minDistance});
										points.push({x: props.x + props.w + minDistance, y: active.y - minDistance});
										points.push({x: active.x, y: active.y - minDistance});
									
							else
								#如果终点在x轴上的坐标，在图形范围外，此时有两个点
								points.push({x: active.x, y: fixed.y - minDistance});
			else if(angle >= pi / 4 * 3 && angle < pi / 4 * 5)
				console.log('hit')




				#起点角度为向右
				if(active.x > fixed.x)
					#终点在起点图形右方
					if(xDistance >= yDistance)
						#如果终点离起点的水平距离较远，最终方向为水平，此情况下有两个折点
						half = xDistance / 2;
						points.push({x: fixed.x + half, y: fixed.y});
						points.push({x: fixed.x + half, y: active.y});
					else
						#如果终点离起点的垂直距离较远，最终方向为垂直，此情况下只有一个折点
						points.push({x: active.x, y: fixed.y});
					
				else
					points.push({x: fixed.x + minDistance, y: fixed.y});
					if(xDistance >= yDistance)
						#如果终点离起点的水平距离较远，最终方向为水平
						if(active.y >= props.y - minDistance && active.y <= props.y + props.h + minDistance)
							#如果终点在y轴上的坐标，在图形范围内，在判断终点与形状是偏上还是偏下
							shapeHalf = props.y + props.h / 2;
							if(active.y < shapeHalf)
								#偏上，第二点在形状右上角
								points.push({x: fixed.x + minDistance, y: props.y - minDistance});
								points.push({x: active.x + minDistance, y: props.y - minDistance});
								points.push({x: active.x + minDistance, y: active.y});
							else
								points.push({x: fixed.x + minDistance, y: props.y + props.h + minDistance});
								points.push({x: active.x + minDistance, y: props.y + props.h + minDistance});
								points.push({x: active.x + minDistance, y: active.y});
						else
							points.push({x: fixed.x + minDistance, y: active.y});
					else
						#如果终点离起点的垂直距离较远，最终方向为向下
						if(active.y >= props.y - minDistance && active.y <= props.y + props.h + minDistance)
							shapeHalf = props.y + props.h / 2;
							if(active.y < shapeHalf)
								points.push({x: fixed.x + minDistance, y: props.y - minDistance});
								points.push({x: active.x, y: props.y - minDistance});
							else
								points.push({x: fixed.x + minDistance, y: props.y + props.h + minDistance});
								points.push({x: active.x, y: props.y + props.h + minDistance});
						else
							if(active.y < fixed.y)
								points.push({x: fixed.x + minDistance, y: active.y + minDistance});
								points.push({x: active.x, y: active.y + minDistance});
							else
								points.push({x: fixed.x + minDistance, y: active.y - minDistance});
								points.push({x: active.x, y: active.y - minDistance});
			else if(angle >= pi / 4 * 5 && angle < pi / 4 * 7)
				#起点角度为向下
				if(active.y > fixed.y)
					if(xDistance >= yDistance)
						points.push({x: fixed.x, y: active.y});
					else
						half = yDistance / 2;
						points.push({x: fixed.x, y: fixed.y + half});
						points.push({x: active.x, y: fixed.y + half});
			
			
			
			
			
			
			
			else
				#起点角度为向左
				if(active.x < fixed.x)
					if(xDistance >= yDistance)
						half = xDistance / 2;
						points.push({x: fixed.x - half, y: fixed.y});
						points.push({x: fixed.x - half, y: active.y});
					else
						points.push({x: active.x, y: fixed.y});
				else
					points.push({x: fixed.x - minDistance, y: fixed.y});
					if(xDistance >= yDistance)
						if(active.y >= props.y - minDistance && active.y <= props.y + props.h + minDistance)
							shapeHalf = props.y + props.h / 2;
							if(active.y < shapeHalf)
								points.push({x: fixed.x - minDistance, y: props.y - minDistance});
								points.push({x: active.x - minDistance, y: props.y - minDistance});
								points.push({x: active.x - minDistance, y: active.y});
							else
								points.push({x: fixed.x - minDistance, y: props.y + props.h + minDistance});
								points.push({x: active.x - minDistance, y: props.y + props.h + minDistance});
								points.push({x: active.x - minDistance, y: active.y});
						else
							points.push({x: fixed.x - minDistance, y: active.y});
					else
						#如果终点离起点的垂直距离较远，最终方向为向下
						if(active.y >= props.y - minDistance && active.y <= props.y + props.h + minDistance)
							shapeHalf = props.y + props.h / 2;
							if(active.y < shapeHalf)
								points.push({x: fixed.x - minDistance, y: props.y - minDistance});
								points.push({x: active.x, y: props.y - minDistance});
							else
								points.push({x: fixed.x - minDistance, y: props.y + props.h + minDistance});
								points.push({x: active.x, y: props.y + props.h + minDistance});
						else
							if(active.y < fixed.y)
								points.push({x: fixed.x - minDistance, y: active.y + minDistance});
								points.push({x: active.x, y: active.y + minDistance});
							else
								points.push({x: fixed.x - minDistance, y: active.y - minDistance});
								points.push({x: active.x, y: active.y - minDistance});
			
			
			
			
			
			
			
			
			
			
			
			
			return points;
	@removeLinker: (linker)=>
		$("#" + linker.id).remove();
module.exports = Linker
