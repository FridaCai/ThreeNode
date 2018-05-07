db = null

    
class DB
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
        param.groups.map((gParam)=>
            g = @groups.find((_g)=>
                return _g.id == gParam.get('id')
            )
            g.x = gParam.get('x')
            g.y = gParam.get('y')
            g.width = gParam.get('width')
            g.height = gParam.get('height')
        , @)

        param.nodes.map((nParam)=>
            n = @nodes.find((_n)=>
                return _n.id == nParam.id
            )
            n.x = nParam.get('x')
            n.y = nParam.get('y')
            n.width = nParam.get('width')
            n.height = nParam.get('height')
        , @)



    createGroup: ()=>

        


    dump: ()=>
        return {
            id: @id
            nodes: @nodes
            groups: @groups
            connections: @connections
        }

    @getInstance = ()=>
        if(!db)
            db = new DB()
        return db

module.exports = DB
