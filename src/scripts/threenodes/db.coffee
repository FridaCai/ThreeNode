db = null

    
class DB
    constructor:() ->
        @reset()
    
    reset: ()=>
        @nodes = []
        @connections = []
        @groups = []
        @id = null

    loadFromJson: (json)=>
        @reset()
        
        @id = json.id
        @nodes = json.nodes
        @groups = json.groups
        @connections = json.connections

    
    updateProperty: (param)=>
        # no need to update connections
        @id = param.id
        param.groups.map((gParam)=>
            if(!@groups.length)
                @groups.push(gParam.toJSON())
            else               
                g = @groups.find((_g)=>
                    return _g.id == gParam.get('id')
                )
                if(g)
                    g.x = gParam.get('x')
                    g.y = gParam.get('y')
                    g.width = gParam.get('width')
                    g.height = gParam.get('height')
                else
                    @groups.push(gParam.toJSON())
        , @)

        param.nodes.map((nParam)=>
            if(!@nodes.length)
                @nodes.push(nParam.toJSON())
            else
                n = @nodes.find((_n)=>
                    return _n.id == nParam.id
                )
                if(n)
                    n.x = nParam.get('x')
                    n.y = nParam.get('y')
                    n.width = nParam.get('width')
                    n.height = nParam.get('height')
                else
                    @nodes.push(nParam.toJSON())
        , @)
        
        @connections = [];
        param.connections.map((cParam)=>
            @connections.push(cParam.toJSON())
        , @)

    calculatePos: (nodes) ->
        min_x = 0
        min_y = 0
        max_x = 0
        max_y = 0
        for node in nodes
            min_x = Math.min(min_x, node.get("x"))
            max_x = Math.max(max_x, node.get("x"))
            min_y = Math.min(min_y, node.get("y"))
            max_y = Math.max(max_y, node.get("y"))

        dx = (min_x + max_x) / 2
        dy = (min_y + max_y) / 2
        return {x: dx, y: dy}


    createGroup: (nodes, index)=>
        pos = @calculatePos(nodes)
        nodesObj = nodes.map((n)=>
            return n.toJSON()
        )
        @groups.push({
            id: index
            x: pos.x
            y: pos.y
            width: 90
            height: 26
            nodes: nodesObj
        })


        @nodes = @nodes.filter((n)->
            nodeIds = nodes.map((_n)->
                return _n.id
            )
            return !nodeIds.includes(n.id)
        ,@)

module.exports = DB

window.db = new DB()