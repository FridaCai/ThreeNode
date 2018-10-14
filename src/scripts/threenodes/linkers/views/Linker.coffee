Backbond = require 'Backbone'

class Linker extends Backbone.View

    initialize: (options) ->
        @render()
        @addEventListener()
        # @initContextMenus()

        @model.on('change', @render)
        @model.on('remove', () => @remove())


    addEventListener: ()=>
        self = @

        $(@el).find('canvas').click (e) ->
            # never work

        $(@el).find('canvas').mousedown (e) ->
            console.log(e)
            x = e.offsetX
            y = e.offsetY
            isHit = self.isHit(x,y)
            console.log(isHit)

        $(@el).find('canvas').mouseup (e) ->
            # only work once

        $(@el).find('canvas').mousemove (e) ->
            console.log('canvas mousemove')



	 # 获取连接线上的点
	 # @param {} linker
	 # @return {}
	getLinkerLinePoints: () ->
        points = [];
        points.push(linker.get('from'));
        points = points.concat(@model.get('points'));
        points.push(linker.get('to'));
        return points;
    
    pointInLinker: (point, linker, radius) ->
        points = @getLinkerLinePoints();
        linex1 = {
            x: point.x - radius, 
            y: point.y
        };
        linex2 = {
            x: point.x + radius, 
            y: point.y
        };
        liney1 = {
            x: point.x, 
            y: point.y - radius
        };
        liney2 = {
            x: point.x, 
            y: point.y + radius
        };
		
		
        for p in points
            if(_i==0)
                continue
            p1 = points[_i-1]
            p2 = points[_i]
            cross = @checkCross(linex1, linex2, p1, p2);
            if(cross)
                return _i;
            cross = @checkCross(liney1, liney2, p1, p2);
            if(cross)
                return _i;  
        return -1;

    pointInRect: (px, py, rect) ->
        if(px >= rect.x && px <= rect.x + rect.w)
            if(py >= rect.y && py <= rect.y + rect.h)
                return true
        return false
    
    checkCross: (p1, p2, p3, p4) ->
        d = (p2.x-p1.x)*(p4.y-p3.y) - (p2.y-p1.y)*(p4.x-p3.x);
        if(d!=0)
            r = ((p1.y-p3.y)*(p4.x-p3.x)-(p1.x-p3.x)*(p4.y-p3.y))/d;
            s = ((p1.y-p3.y)*(p2.x-p1.x)-(p1.x-p3.x)*(p2.y-p1.y))/d;
            if((r>=0) && (r <= 1) && (s >=0) && (s<=1))
                return true;
    	    return false
	
    isHit: (x, y)=>
        focusShapes = [];

        shapeId = @model.get('id')
        shapeBox = $("#" + shapeId);

        shape = @model
        #计算出相对于图形画布的x,y坐标
        shapeBoxPos = shapeBox.position();

        relativeX = x - shapeBoxPos.left;
        relativeY = y - shapeBoxPos.top;

        canvasRect = {
            x: shapeBoxPos.left, 
            y: shapeBoxPos.top, 
            w: shapeBox.width(), 
            h: shapeBox.height()
        };

        shapeCanvas = shapeBox.find(".shape_canvas")[0];
        shapeCtx = shapeCanvas.getContext("2d");
        inCanvas = @pointInRect(x, y, canvasRect);


        if(!inCanvas)
            return null
        
        
        #如果图形是连接线
        #先判断是否在连线的端点上
        radius = 10;
        rect = {
            x: x - radius, 
            y: y - radius, 
            w: radius * 2, 
            h: radius * 2
        }
        
        if(@pointInRect(shape.get('to').x, shape.get('to').y, rect))
            result = {type: "linker_point", point: "end", shape: shape};
            return result
            
        else if(this.pointInRect(shape.get('from').x, shape.get('from').y, rect))
            result = {type: "linker_point", point: "from", shape: shape};
            return result
        else
            # 判断是否在连接线的文本上
            # textCanvas = shapeBox.find(".text_canvas");
            # textCanvasPos = textCanvas.position();
            # rect = {x: textCanvasPos.left, y: textCanvasPos.top, w: textCanvas.width(), h: textCanvas.height()};
            # if(this.pointInRect(relativeX, relativeY, rect)){
            #     result = {type: "linker_text", shape: shape};
            #     focusShapes.push(result);
            #     continue;
            # }
            
            #判断是否在连接线上，判断坐标点放射出的两条直线是否与线相交
            radius = 7;
            inLinker = @pointInLinker({
                x: x.restoreScale(), 
                y: y.restoreScale()
            }, shape, radius);

            if(inLinker > -1)
                result = {type: "linker", shape: shape, pointIndex: inLinker};
                return result

		

    initContextMenus: ()=>

    render: () =>
        linkerId = @model.get('id') 
        linkerBox = $("#" + linkerId);
        if(linkerBox.length == 0)
            linkerBox = $("<div id='"+linkerId+"' class='shape_box linker_box'><canvas class='shape_canvas'></canvas></div>").appendTo(@$el)

        box = @calcBox()
        
        linkerCanvas = linkerBox.find(".shape_canvas")
        linkerCanvas.attr({
            width: (box.w + 20)
            height: (box.h + 20)
        })
        linkerBox.css({
            position: 'absolute'
            left: (box.x - 10),
            top: (box.y - 10),
            width: (box.w + 20),
            height: (box.h + 20)
        });
        ctx = linkerCanvas[0].getContext("2d")
        # ctx.scale(Designer.config.scale, Designer.config.scale);
        ctx.translate(10, 10);
        style = @model.get('lineStyle');
        ctx.lineWidth = style.lineWidth;
        ctx.strokeStyle = "rgb("+style.lineColor+")";
        ctx.fillStyle = "rgb("+style.lineColor+")";
        ctx.save();

        from = @model.get('from');
        to = @model.get('to')
        begin = {x: from.x - box.x, y: from.y - box.y};
        end = {x: to.x - box.x, y: to.y - box.y};
        ctx.save();
        
        ctx.beginPath();
        ctx.moveTo(begin.x, begin.y);
        
        points = @model.get('points')

        for point in points
            #如果是折线，会有折点
            ctx.lineTo(point.x - box.x, point.y - box.y);
        
        ctx.lineTo(end.x, end.y);

        if(@$el.hasClass('ui-selected'))
            #如果是选中了，绘制阴影
            # ctx.shadowBlur = 4;
            # ctx.shadowColor = "#833";
            ctx.shadowBlur = 10;
            ctx.shadowColor = "yellow";
            
            
            
        
        ctx.stroke();
        ctx.restore(); #还原虚线样式和阴影
        ctx.restore();

    calcBox: () =>
        points = @model.get('points');
        from = @model.get('from');
        to = @model.get('to');
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

    remove: ()=>
        console.log('remove')
        $("#" + @model.get('id')).remove();

module.exports = Linker