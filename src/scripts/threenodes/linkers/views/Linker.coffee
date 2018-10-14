Backbond = require 'Backbone'

class Linker extends Backbone.View

    initialize: (options) ->
        @render()
        # @addEventListener()
        # @initContextMenus()

        @model.on('change', @render)
        @model.on('remove', () => @remove())

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