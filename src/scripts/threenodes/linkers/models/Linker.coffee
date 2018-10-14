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
		status: 0 #0:normal, 1:selected

	initialize: (model, param)=>
		super
		self = @

		# id = obj.id || indexer.getUID() 
		id = indexer.getUID()
		@set('id', id)

		@on("change:from change:to", (model, from, to)=>
			@set('points', @getLinkerPoints())
			
			# if(!@get('to').id)
			# 	to = @get('to')
			# 	from = @get('from')

			# 	if(to.x < from.x - 6 || to.x > from.x + 6)
			# 	else
			# 		to.x = from.x

			# 	if(to.y < from.y - 6 || to.y > from.y + 6)
			# 	else
			# 		to.y = from.y;
			# 	@set('to', to) # will cause endless loop?
		)

	getAngleDir: (angle)=>
		pi = Math.PI;
		if(angle >= pi / 4 && angle < pi / 4 * 3)
			return 1;#上
		else if(angle >= pi / 4 * 3 && angle < pi / 4 * 5)
			return 2;#右
		else if(angle >= pi / 4 * 5 && angle < pi / 4 * 7)
			return 3;#下
		else
			return 4;#左

	getLinkerPoints: ()=>
		points = [];

		pi = Math.PI;
		from = @get('from');
		to = @get('to');
		xDistance = Math.abs(to.x - from.x);
		yDistance = Math.abs(to.y - from.y);
		minDistance = 30; #最小距离，比如起点向上，终点在下方，则先要往上画minDistance的距离
		
		if(from.id && to.id)

			#起点和终点都连接了形状
			fromDir = @getAngleDir(from.angle); #起点方向
			toDir = @getAngleDir(to.angle); #终点方向
			
			
			fixed = null;
			active = null;
			reverse = null; #固定点、移动点、是否需要逆序

			#以起点为判断依据，可以涵盖所有情况
			if(fromDir == 1 && toDir == 1)
				#情况1：两个点都向上
				if(from.y < to.y)
					fixed = from;
					active = to;
					reverse = false;
				else
					fixed = to;
					active = from;
					reverse = true;
				
				fixedProps = {
					x: fixed.x
					y: fixed.y
					w: 90
					h: 26
				}
				activeProps = {
					x: active.x
					y: active.y
					w: 90
					h: 26
				}
				if(active.x >= fixedProps.x - minDistance && active.x <= fixedProps.x + fixedProps.w + minDistance)
					x;
					if(active.x < fixedProps.x + fixedProps.w / 2)
						x = fixedProps.x - minDistance;
					else
						x = fixedProps.x + fixedProps.w + minDistance;
					
					y = fixed.y - minDistance;
					points.push({x: fixed.x, y: y});
					points.push({x: x, y: y});
					y = active.y - minDistance;
					points.push({x: x, y: y});
					points.push({x: active.x, y: y});
				else
					y = fixed.y - minDistance;
					points.push({x: fixed.x, y: y});
					points.push({x: active.x, y: y});
				
			else if(fromDir == 3 && toDir == 3)
				#情况2：两个点都向下
				if(from.y > to.y)
					fixed = from;
					active = to;
					reverse = false;
				else
					fixed = to;
					active = from;
					reverse = true;
				
				fixedProps = {
					x: fixed.x
					y: fixed.y
					w: 90
					h: 26
				}
				activeProps = {
					x: active.x
					y: active.y
					w: 90
					h: 26
				}

				if(active.x >= fixedProps.x - minDistance && active.x <= fixedProps.x + fixedProps.w + minDistance)
					y = fixed.y + minDistance;
					x;
					if(active.x < fixedProps.x + fixedProps.w / 2)
						x = fixedProps.x - minDistance;
					else
						x = fixedProps.x + fixedProps.w + minDistance;
					
					points.push({x: fixed.x, y: y});
					points.push({x: x, y: y});
					y = active.y + minDistance;
					points.push({x: x, y: y});
					points.push({x: active.x, y: y});
				else
					y = fixed.y + minDistance;
					points.push({x: fixed.x, y: y});
					points.push({x: active.x, y: y});
				
			else if(fromDir == 2 && toDir == 2)
				#情况3：两点都向右
				if(from.x > to.x)
					fixed = from;
					active = to;
					reverse = false;
				else
					fixed = to;
					active = from;
					reverse = true;

				fixedProps = {
					x: fixed.x
					y: fixed.y
					w: 90
					h: 26
				}
				activeProps = {
					x: active.x
					y: active.y
					w: 90
					h: 26
				}
				
				if(active.y >= fixedProps.y - minDistance && active.y <= fixedProps.y + fixedProps.h + minDistance)
					x = fixed.x + minDistance;
					y;
					if(active.y < fixedProps.y + fixedProps.h / 2)
						y = fixedProps.y - minDistance;
					else
						y = fixedProps.y + fixedProps.h + minDistance;
					
					points.push({x: x, y: fixed.y});
					points.push({x: x, y: y});
					x = active.x + minDistance;
					points.push({x: x, y: y});
					points.push({x: x, y: active.y});
				else
					x = fixed.x + minDistance;
					points.push({x: x, y: fixed.y});
					points.push({x: x, y: active.y});
				
			else if(fromDir == 4 && toDir == 4)
				#情况4：两点都向左
				if(from.x < to.x)
					fixed = from;
					active = to;
					reverse = false;
				else
					fixed = to;
					active = from;
					reverse = true;
				
				fixedProps = {
					x: fixed.x
					y: fixed.y
					w: 90
					h: 26
				}
				activeProps = {
					x: active.x
					y: active.y
					w: 90
					h: 26
				}

				if(active.y >= fixedProps.y - minDistance && active.y <= fixedProps.y + fixedProps.h + minDistance)
					x = fixed.x - minDistance;
					y;
					if(active.y < fixedProps.y + fixedProps.h / 2)
						y = fixedProps.y - minDistance;
					else
						y = fixedProps.y + fixedProps.h + minDistance;
					
					points.push({x: x, y: fixed.y});
					points.push({x: x, y: y});
					x = active.x - minDistance;
					points.push({x: x, y: y});
					points.push({x: x, y: active.y});
				else
					x = fixed.x - minDistance;
					points.push({x: x, y: fixed.y});
					points.push({x: x, y: active.y});
				
			else if((fromDir == 1 && toDir == 3) || (fromDir == 3 && toDir == 1))
				#情况5：一个点向上，一个点向下
				if(fromDir == 1)
					fixed = from;
					active = to;
					reverse = false;
				else
					fixed = to;
					active = from;
					reverse = true;
				
				fixedProps = {
					x: fixed.x
					y: fixed.y
					w: 90
					h: 26
				}
				activeProps = {
					x: active.x
					y: active.y
					w: 90
					h: 26
				}
				if(active.y <= fixed.y)
					y = fixed.y - yDistance / 2;
					points.push({x: fixed.x, y: y});
					points.push({x: active.x, y: y});
				else
					fixedRight = fixedProps.x + fixedProps.w;
					activeRight = activeProps.x + activeProps.w;
					y = fixed.y - minDistance;
					x;
					if(activeRight >= fixedProps.x && activeProps.x <= fixedRight)
						#x轴重叠的情况
						half = fixedProps.x + fixedProps.w / 2;
						if(active.x < half)
							#从左边绕
							x = fixedProps.x < activeProps.x ? fixedProps.x - minDistance : activeProps.x - minDistance;
						else
							#从右边绕
							x = fixedRight > activeRight ? fixedRight + minDistance : activeRight + minDistance;
						
						if(activeProps.y < fixed.y)
							y = activeProps.y - minDistance;
						
					else
						if(active.x < fixed.x)
							x = activeRight + (fixedProps.x - activeRight) / 2;
						else
							x = fixedRight + (activeProps.x - fixedRight) / 2;
						
					
					points.push({x: fixed.x, y: y});
					points.push({x: x, y: y});
					y = active.y + minDistance;
					points.push({x: x, y: y});
					points.push({x: active.x, y: y});
				
			else if((fromDir == 2 && toDir == 4) || (fromDir == 4 && toDir == 2))
				#情况6：一个点向右，一个点向左
				if(fromDir == 2)
					fixed = from;
					active = to;
					reverse = false;
				else
					fixed = to;
					active = from;
					reverse = true;
				
				fixedProps = {
					x: fixed.x
					y: fixed.y
					w: 90
					h: 26
				}
				activeProps = {
					x: active.x
					y: active.y
					w: 90
					h: 26
				}
				if(active.x > fixed.x)
					x = fixed.x + xDistance / 2;
					points.push({x: x, y: fixed.y});
					points.push({x: x, y: active.y});
				else
					fixedBottom = fixedProps.y + fixedProps.h;
					activeBottom = activeProps.y + activeProps.h;
					x = fixed.x + minDistance;
					y;
					if(activeBottom >= fixedProps.y && activeProps.y <= fixedBottom)
						#y轴重叠的情况
						half = fixedProps.y + fixedProps.h / 2;
						if(active.y < half)
							#从上边绕
							y = fixedProps.y < activeProps.y ? fixedProps.y - minDistance : activeProps.y - minDistance;
						else
							#从下边绕
							y = fixedBottom > activeBottom ? fixedBottom + minDistance : activeBottom + minDistance;
						
						if(activeProps.x + activeProps.w > fixed.x)
							x = activeProps.x + activeProps.w + minDistance;
						
					else
						if(active.y < fixed.y)
							y = activeBottom + (fixedProps.y - activeBottom) / 2;
						else
							y = fixedBottom + (activeProps.y - fixedBottom) / 2;
						
					
					points.push({x: x, y: fixed.y});
					points.push({x: x, y: y});
					x = active.x - minDistance;
					points.push({x: x, y: y});
					points.push({x: x, y: active.y});
				
			else if((fromDir == 1 && toDir == 2) || (fromDir == 2 && toDir == 1))
				#情况7：一个点向上，一个点向右
				if(fromDir == 2)
					fixed = from;
					active = to;
					reverse = false;
				else
					fixed = to;
					active = from;
					reverse = true;
				
				fixedProps = {
					x: fixed.x
					y: fixed.y
					w: 90
					h: 26
				}
				activeProps = {
					x: active.x
					y: active.y
					w: 90
					h: 26
				}
				if(active.x > fixed.x && active.y > fixed.y)
					points.push({x: active.x, y: fixed.y});
				else if(active.x > fixed.x && activeProps.x > fixed.x)
					x;
					if(activeProps.x - fixed.x < minDistance * 2)
						x = fixed.x + (activeProps.x - fixed.x) / 2;
					else
						x = fixed.x + minDistance;
					
					y = active.y - minDistance;
					points.push({x: x, y: fixed.y});
					points.push({x: x, y: y});
					points.push({x: active.x, y: y});
				else if(active.x <= fixed.x && active.y > fixedProps.y + fixedProps.h)
					fixedBottom = fixedProps.y + fixedProps.h;
					x = fixed.x + minDistance;
					y
					if(active.y - fixedBottom < minDistance * 2)
						y = fixedBottom + (active.y - fixedBottom) / 2;
					else
						y = active.y - minDistance;
					
					points.push({x: x, y: fixed.y});
					points.push({x: x, y: y});
					points.push({x: active.x, y: y});
				else
					x;
					activeRight = activeProps.x + activeProps.w;
					if(activeRight > fixed.x)
						x = activeRight + minDistance;
					else
						x = fixed.x + minDistance;
					
					y;
					if(active.y < fixedProps.y)
						y = active.y - minDistance;
					else
						y = fixedProps.y - minDistance;
					
					points.push({x: x, y: fixed.y});
					points.push({x: x, y: y});
					points.push({x: active.x, y: y});
				
			else if((fromDir == 1 && toDir == 4) || (fromDir == 4 && toDir == 1))
				#情况8：一个点向上，一个点向左
				if(fromDir == 4)
					fixed = from;
					active = to;
					reverse = false;
				else
					fixed = to;
					active = from;
					reverse = true;
				
				fixedProps = {
					x: fixed.x
					y: fixed.y
					w: 90
					h: 26
				}
				activeProps = {
					x: active.x
					y: active.y
					w: 90
					h: 26
				}
				activeRight = activeProps.x + activeProps.w;
				if(active.x < fixed.x && active.y > fixed.y)
					points.push({x: active.x, y: fixed.y});
				else if(active.x < fixed.x && activeRight < fixed.x)
					x;
					if(fixed.x - activeRight < minDistance * 2)
						x = activeRight + (fixed.x - activeRight) / 2;
					else
						x = fixed.x - minDistance;
					
					y = active.y - minDistance;
					points.push({x: x, y: fixed.y});
					points.push({x: x, y: y});
					points.push({x: active.x, y: y});
				else if(active.x >= fixed.x && active.y > fixedProps.y + fixedProps.h)
					fixedBottom = fixedProps.y + fixedProps.h;
					x = fixed.x - minDistance;
					y
					if(active.y - fixedBottom < minDistance * 2)
						y = fixedBottom + (active.y - fixedBottom) / 2;
					else
						y = active.y - minDistance;
					
					points.push({x: x, y: fixed.y});
					points.push({x: x, y: y});
					points.push({x: active.x, y: y});
				else
					x;
					if(activeProps.x < fixed.x)
						x = activeProps.x - minDistance;
					else
						x = fixed.x - minDistance;
					
					y;
					if(active.y < fixedProps.y)
						y = active.y - minDistance;
					else
						y = fixedProps.y - minDistance;
					
					points.push({x: x, y: fixed.y});
					points.push({x: x, y: y});
					points.push({x: active.x, y: y});
				
			else if((fromDir == 2 && toDir == 3) || (fromDir == 3 && toDir == 2))
				#情况9：一个点向右，一个点向下
				if(fromDir == 2)
					fixed = from;
					active = to;
					reverse = false;
				else
					fixed = to;
					active = from;
					reverse = true;
				
				fixedProps = {
					x: fixed.x
					y: fixed.y
					w: 90
					h: 26
				}
				activeProps = {
					x: active.x
					y: active.y
					w: 90
					h: 26
				}
				if(active.x > fixed.x && active.y < fixed.y)
					points.push({x: active.x, y: fixed.y});
				else if(active.x > fixed.x && activeProps.x > fixed.x)
					x;
					if(activeProps.x - fixed.x < minDistance * 2)
						x = fixed.x + (activeProps.x - fixed.x) / 2;
					else
						x = fixed.x + minDistance;
					
					y = active.y + minDistance;
					points.push({x: x, y: fixed.y});
					points.push({x: x, y: y});
					points.push({x: active.x, y: y});
				else if(active.x <= fixed.x && active.y < fixedProps.y)
					x = fixed.x + minDistance;
					y
					if(fixedProps.y - active.y < minDistance * 2)
						y = active.y + (fixedProps.y - active.y) / 2;
					else
						y = active.y + minDistance;
					
					points.push({x: x, y: fixed.y});
					points.push({x: x, y: y});
					points.push({x: active.x, y: y});
				else
					x;
					activeRight = activeProps.x + activeProps.w;
					if(activeRight > fixed.x)
						x = activeRight + minDistance;
					else
						x = fixed.x + minDistance;
					
					y;
					if(active.y > fixedProps.y + fixedProps.h)
						y = active.y + minDistance;
					else
						y = fixedProps.y + fixedProps.h + minDistance;
					
					points.push({x: x, y: fixed.y});
					points.push({x: x, y: y});
					points.push({x: active.x, y: y});
				
			else if((fromDir == 3 && toDir == 4) || (fromDir == 4 && toDir == 3))
				#情况10：一个点向下，一个点向左
				if(fromDir == 4)
					fixed = from;
					active = to;
					reverse = false;
				else
					fixed = to;
					active = from;
					reverse = true;
				
				fixedProps = {
					x: fixed.x
					y: fixed.y
					w: 90
					h: 26
				}
				activeProps = {
					x: active.x
					y: active.y
					w: 90
					h: 26
				}
				activeRight = activeProps.x + activeProps.w;
				if(active.x < fixed.x && active.y < fixed.y)
					points.push({x: active.x, y: fixed.y});
				else if(active.x < fixed.x && activeRight < fixed.x)
					x;
					if(fixed.x - activeRight < minDistance * 2)
						x = activeRight + (fixed.x - activeRight) / 2;
					else
						x = fixed.x - minDistance;
					
					y = active.y + minDistance;
					points.push({x: x, y: fixed.y});
					points.push({x: x, y: y});
					points.push({x: active.x, y: y});
				else if(active.x >= fixed.x && active.y < fixedProps.y)
					x = fixed.x - minDistance;
					y
					if(fixedProps.y - active.y < minDistance * 2)
						y = active.y + (fixedProps.y - active.y) / 2;
					else
						y = active.y + minDistance;
					
					points.push({x: x, y: fixed.y});
					points.push({x: x, y: y});
					points.push({x: active.x, y: y});
				else
					x;
					if(activeProps.x < fixed.x)
						x = activeProps.x - minDistance;
					else
						x = fixed.x - minDistance;
					
					y;
					if(active.y > fixedProps.y + fixedProps.h)
						y = active.y + minDistance;
					else
						y = fixedProps.y + fixedProps.h + minDistance;
					
					points.push({x: x, y: fixed.y});
					points.push({x: x, y: y});
					points.push({x: active.x, y: y});

			if(reverse)
				points.reverse();
			

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
					points.push({x: fixed.x, y: fixed.y + minDistance}); 
					if(xDistance >= yDistance)
						if(active.x >= props.x - minDistance)
							if(active.x <= props.x + props.w + minDistance)
							 	shapeHalf = props.x + props.w / 2;
								if(active.x < shapeHalf)
									points.push({x: props.x - minDistance, y: fixed.y + minDistance});
									points.push({x: props.x - minDistance, y: active.y});
								else
									points.push({x: props.x + props.w + minDistance, y: fixed.y + minDistance});
									points.push({x: props.x + props.w + minDistance, y: active.y});
						else
							if(active.x < props.x)
								points.push({x: active.x + minDistance, y: fixed.y + minDistance});
								points.push({x: active.x + minDistance, y: active.y});
							else
								points.push({x: active.x - minDistance, y: fixed.y + minDistance});
								points.push({x: active.x - minDistance, y: active.y});
					else
						if(active.x >= props.x - minDistance)
							if(active.x <= props.x + props.w + minDistance)
							 	shapeHalf = props.x + props.w / 2;
								if(active.x < shapeHalf)
									points.push({x: props.x - minDistance, y: fixed.y + minDistance});
									points.push({x: props.x - minDistance, y: active.y + minDistance});
									points.push({x: active.x, y: active.y + minDistance});
								else
									points.push({x: props.x + props.w + minDistance, y: fixed.y + minDistance});
									points.push({x: props.x + props.w + minDistance, y: active.y + minDistance});
									points.push({x: active.x, y: active.y + minDistance});
						else
							points.push({x: active.x, y: fixed.y + minDistance});
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

module.exports = Linker
