// JavaScript Document
var cscMap = {};//
	cscMap.MapList = {};
	cscMap.Public = {};
	cscMap.oMouse=function(e,s){
		var point = {};
		var Scroll = [document.documentElement.scrollLeft+document.body.scrollLeft,document.documentElement.scrollTop+document.body.scrollTop];
		var pz = s ? Scroll.slice(0) : [0,0] ;
		if(e.pageX || e.pageY){
			point = {x:e.pageX-Scroll[0]+pz[0], y:e.pageY-Scroll[1]+pz[1]}; 
		}else{//IE
			point = {x:e.clientX+pz[0],y:e.clientY+pz[1]};
		};
		return point;
	}
	
cscMap.Public.zooms = {//缩放级别属性(默认约束?)
    "10" : {proportion:0.15,bg_size:[200,200]},//{proportion:相对比例,bg_size:背景块大小}
    "20" : {proportion:0.2,bg_size:[200,200]},
    "30" : {proportion:0.3,bg_size:[200,200]},
    "40" : {proportion:0.4,bg_size:[200,200]},
    "50" : {proportion:0.5,bg_size:[200,200]},
    "60" : {proportion:0.6,bg_size:[200,200]},
    "70" : {proportion:0.7,bg_size:[200,200]},
    "80" : {proportion:0.8,bg_size:[200,200]},
    "90" : {proportion:0.9,bg_size:[200,200]},
    "100" : {proportion:1,bg_size:[200,200]}
}

cscMap.Public.zooms = [//缩放级别属性(默认约束?)
    {proportion:0.15,bg_size:[200,200]},//{proportion:相对比例,bg_size:背景块大小}
    {proportion:0.2,bg_size:[200,200]},
    {proportion:0.3,bg_size:[200,200]},
    {proportion:0.4,bg_size:[200,200]},
    {proportion:0.5,bg_size:[200,200]},
    {proportion:0.6,bg_size:[200,200]},
    {proportion:0.7,bg_size:[200,200]},
    {proportion:0.8,bg_size:[200,200]},
    {proportion:0.9,bg_size:[200,200]},
    {proportion:1,bg_size:[200,200]}
]

cscMap.Public.zooms = [//缩放级别属性(默认约束?)
    {proportion:0.25,bg_size:[200,200]},//{proportion:相对比例,bg_size:背景块大小}
    {proportion:0.50,bg_size:[200,200]},
    {proportion:1,bg_size:[200,200]},
]


cscMap.Public.Dbug = function(map){
    var o = map,
        py = o.move_box.position(),
        cneter_zb = o.getCenter();
    cneter_zb[0] = cneter_zb[0].toFixed(2);
    cneter_zb[1] = cneter_zb[1].toFixed(2);
    $("#msg_t1 div:eq(0)").html("原点偏移: " + py.left.toFixed(2) + "," + py.top.toFixed(2));
    $("#msg_t1 div:eq(1)").html("中心点: " + o.center_point[0].toFixed(2)+","+o.center_point[1].toFixed(2));
    $("#msg_t1 div:eq(2)").html("中心点坐标: " + cneter_zb);
    $("#comm").find("input[name='point']").val(cneter_zb.join(","));
    $("#tozoom").val(o.config.zoom);
}

Math.guid = function(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){
        var r = Math.random()*16|0,v=c=='x'?r:(r&0x3|0x8);
        return v.toString(16);
    }).toUpperCase();
}

Math.inval = function(val,min_v,max_v){
    var max_x = max_v>min_v?max_v:min_v,
        min_x = max_v>min_v?min_v:max_v;
    return val>max_x?max_x:val<min_x?min_x:val;
}

