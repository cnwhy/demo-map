/*
* 市场地图_移动类(用于地图移动,标记点移动)
* 汪航洋
* 2013年5月23日16时51分37秒
*/
(function(){
    var DConfig = {
        mark_bj:true,
        fn_move:function(){},
        fn_up:function(){}
    }
    var MouseMove = function(e){
        if(!this.mark_td){return;}
        var oM = cscMap.oMouse(e||window.event);
        var to_x = this.mark_tdBzb.offset.x+(oM.x);
        var to_y = this.mark_tdBzb.offset.y+(oM.y);
        if(this.config.mark_bj){
            var min_x = 0;
            var max_x = this.map_main[0].clientWidth-this.move_box[0].offsetWidth;
            var min_y = 0;
            var max_y = this.map_main[0].clientHeight-this.move_box[0].offsetHeight;
            to_x = Math.inval(to_x,min_x,max_x);
            to_y = Math.inval(to_y,max_y,min_y);
        };
        this.move_box.css({"left":to_x+"px","top":to_y+"px"});
        typeof(this.config.fn_move) == "function" && this.config.fn_move(to_x,to_y);
        e.returnValue=false;
    }
    cscMap.Move = function(main,movebox,config){
        config = config || {};
        this.mark_td = false;
        this.map_main = $(main);
        this.move_box = $(movebox);
        this.mark_tdBzb = {};
        this.config = $.extend({},DConfig,config);
        this.info();
    };
    cscMap.Move.prototype.info = function(){
        var o = this;
        o.map_main.on("mousedown",function(e){
            var oM = cscMap.oMouse(e||window.event);
            var Move = function(e){
                return MouseMove.call(o,e);
            }
            $(document).on("mouseup",function(e){
                clearTimeout(o.mark_tdjb);
                o.mark_td = false;
                o.move_box.removeClass("cur_p");
                $(document).off("mousemove",Move);
                typeof(o.config.fn_up) == "function" && o.config.fn_up();
            });
            o.mark_tdjb = setTimeout(function(){
                o.mark_td = true;
                o.move_box.addClass("cur_p");
                var offset = o.move_box.position();
                o.mark_tdBzb.offset = {
                    "x":offset.left - (oM.x),
                    "y":offset.top - (oM.y)
                };
                $(document).on("mousemove",Move);
            },100)
        })
    }
})(window,$);