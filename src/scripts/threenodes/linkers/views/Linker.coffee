Backbond = require 'Backbone'
_view_linker_context_menu = require '../templates/linker_context_menu.tmpl.html'

class Linker extends Backbone.View
   
    initialize: (options) ->
        @render()
        @addEventListener()
        @initContextMenus()

        @model.on('change', (linker, param)=>
            if(param.changes.text)
                return
            @render()
        )
        @model.on('remove', () => @remove())
    
    initContextMenus:()=>
        self = @
        if $("#linker-context-menu").length < 1
            linker_menu = _.template(_view_linker_context_menu, {})
            $("body").append(linker_menu)

        @$el.find('>div').contextMenu {menu: "linker-context-menu"}, (action, el, pos) =>
            if action == "remove_linker" then core.linkers.remove(self.model)
            if action == "edit_text" then self.editText()
    
    editText:()=>
        linkerContainer = $("#" + @model.get('id'));
        canvas = linkerContainer.find(".text_canvas");
        canvas.focus();
        canvas.unbind().bind('keyup', ()=>
            @model.set('text', canvas.text())
        )
    addEventListener: ()=>
        self = @

        begin = null
        now = null
        hit = null
        
        @el.addEventListener('mousedown', (e) ->
            isHit = self.isHit(e.offsetX, e.offsetY)
            if(!isHit)
                return
            
            core.linkers.unselectAll()
            self.model.set('status', 1)

            _index = isHit.pointIndex; #鼠标在第几个拐点之间，由此来判断是否可重置折线
            if(_index > 1 && _index <= self.model.get('points').length)
                hit = isHit
                begin = {
                    x: e.offsetX
                    y: e.offsetY
                } 
        )
        
        @el.addEventListener('mousemove', (e) ->
            now = {
                x: e.offsetX
                y: e.offsetY
            }

            if(hit)
                _index = hit.pointIndex;
                index = _index - 1
                p1 = self.model.get('points')[index - 1];
                p2 = self.model.get('points')[index];

                offset = {
                    x: now.x - begin.x, 
                    y: now.y - begin.y
                };
                  
                if(p1.x == p2.x)
                    p1.x += offset.x;
                    p2.x += offset.x;
                else
                    p1.y += offset.y;
                    p2.y += offset.y;

                self.render()
                begin = {
                    x: now.x
                    y: now.y
                };
            else
                $(this).css("cursor", "default")
                isHit = self.isHit(now.x, now.y)
                
                if(isHit)
                    $(this).css("cursor", "pointer");
                    _index = isHit.pointIndex; #鼠标在第几个拐点之间，由此来判断是否可重置折线
                    if(_index > 1 && _index <= self.model.get('points').length)
                        index = _index - 1
                        p1 = self.model.get('points')[index - 1];
                        p2 = self.model.get('points')[index];
                        if(p1.x == p2.x)
                            $(self.el).css("cursor", "e-resize");
                        else
                            $(self.el).css("cursor", "n-resize");
        )

        @el.addEventListener('mouseup', (e)=>
            begin = null
            now = null
            hit = null
        , true)
    


    isHit: (x, y)=>
        focusShapes = [];

        shapeId = @model.get('id')
        shapeBox = $("#" + shapeId);

        shape = @model
        #计算出相对于图形画布的x,y坐标
        shapeBoxPos = shapeBox.position();
        

        # relativeX = x - shapeBoxPos.left;
        # relativeY = y - shapeBoxPos.top;
        x = x + shapeBoxPos.left;
        y = y + shapeBoxPos.top;

        canvasRect = {
            x: shapeBoxPos.left, 
            y: shapeBoxPos.top, 
            w: shapeBox.width(), 
            h: shapeBox.height()
        };

        shapeCanvas = shapeBox.find(".shape_canvas")[0];
        shapeCtx = shapeCanvas.getContext("2d");
        # inCanvas = @pointInRect(x, y, canvasRect);


        # if(!inCanvas)
        #     return null
        
        
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
                x: x,
                y: y
            }, shape, radius);

            if(inLinker > -1)
                result = {type: "linker", shape: shape, pointIndex: inLinker};
                return result

    getLinkerLinePoints: () ->
        points = [];
        points.push(@model.get('from'));
        points = points.concat(@model.get('points'));
        points.push(@model.get('to'));
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
        
        
        for p, i in points
            if(i==0)
                continue
            p1 = points[i-1]
            p2 = points[i]
            cross = @checkCross(linex1, linex2, p1, p2);
            if(cross)
                return i;
            cross = @checkCross(liney1, liney2, p1, p2);
            if(cross)
                return i;  
        return -1;

    checkCross: (p1, p2, p3, p4) ->
        d = (p2.x-p1.x)*(p4.y-p3.y) - (p2.y-p1.y)*(p4.x-p3.x);
        if(d!=0)
            r = ((p1.y-p3.y)*(p4.x-p3.x)-(p1.x-p3.x)*(p4.y-p3.y))/d;
            s = ((p1.y-p3.y)*(p2.x-p1.x)-(p1.x-p3.x)*(p2.y-p1.y))/d;
            if((r>=0) && (r <= 1) && (s >=0) && (s<=1))
                return true;
    	    return false

    pointInRect: (px, py, rect) ->
        if(px >= rect.x && px <= rect.x + rect.w)
            if(py >= rect.y && py <= rect.y + rect.h)
                return true
        return false

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

        if(@model.get('status')==1)
            #如果是选中了，绘制阴影
            # ctx.shadowBlur = 4;
            # ctx.shadowColor = "#833";
            ctx.shadowBlur = 10;
            ctx.shadowColor = "yellow";
            
            
            
        
        ctx.stroke();
        ctx.restore(); #还原虚线样式和阴影
        ctx.restore();

        @renderText()

    renderText: () =>
        linkerContainer = $("#" + @model.get('id'));
        canvas = linkerContainer.find(".text_canvas");
        if(canvas.length == 0)
            canvas = $("<div class='text_canvas linker_text' contenteditable></div>")
                .appendTo(linkerContainer);

        fontStyle = @model.get('fontStyle');
        scale = "scale(1)";
        style = {
            "position":"absolute",
            "text-align":"center",
            "background":'#313638',
            "line-height": Math.round(fontStyle.size * 1.25) + "px",
            "font-size": fontStyle.size + "px",
            "font-family": fontStyle.fontFamily,
            "font-weight": fontStyle.bold ? "bold" : "normal",
            "font-style": fontStyle.italic ? "italic" : "normal",
            "text-align": fontStyle.textAlign,
            "color": "rgb(" + fontStyle.color + ")",
            "text-decoration": fontStyle.underline ? "underline" : "none",
            "-webkit-transform": scale,
            "-ms-transform": scale,
            "-o-transform": scale,
            "-moz-transform": scale,
            "transform": scale,
        };
        canvas.css(style);
        
        #设置位置
        canvas.show();
        text = @model.get('text').replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>");
        canvas.html(text + "<br/>");
        midpoint = @getLinkerMidpoint();
        containerPos = linkerContainer.position();
        canvas.css({
            left: midpoint.x - containerPos.left - canvas.width()/2,
            top: midpoint.y - containerPos.top - canvas.height()/2
        });
    
    measureDistance: (p1, p2) =>
        h = p2.y - p1.y;
        w = p2.x - p1.x;
        return Math.sqrt(Math.pow(h, 2) + Math.pow(w, 2));

    getLinkerMidpoint: ()=>
        point = {};
        
        #折线时，计算每一笔的长度，找中点
        points = [];
        points.push(@model.get('from'));
        points = points.concat(@model.get('points'));
        points.push(@model.get('to'));

        #先求连接线的全长
        totalLength = 0;

        for p,pi in points
            if(pi==0)
                continue

            p1 = points[pi - 1];
            p2 = points[pi];
            #计算一段的长
            d = @measureDistance(p1, p2);
            totalLength += d;

        halfLength = totalLength / 2; #连接线长度的一半
        growLength = 0;

        for p,pi in points
            if(pi ==0)
                continue
            p1 = points[pi - 1];
            p2 = points[pi];
            #计算一段的长
            d = @measureDistance(p1, p2);
            temp = growLength + d;
            if(temp > halfLength)
                #如果某一段的长度大于一半了，则中点在此段上
                t = (halfLength - growLength) / d;
                point = {
                    x: (1-t)*p1.x + t*p2.x,
                    y: (1-t)*p1.y + t*p2.y
                }
                break;
            growLength = temp;
        return point;
    
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
        $("#" + @model.get('id')).remove();

module.exports = Linker