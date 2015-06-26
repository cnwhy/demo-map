/*
* 市场地图_地图类
* 汪航洋
* 2013年5月23日16时51分37秒
*/

cscMap.Map = function(boxid){
	this.map_main = $(boxid); //地图容器;
	this.id = Math.guid();//生成唯一标识;
	cscMap.MapList[this.id]=this;//引入cscMap全局对像中,暂无作用
	this.map_main.css("overflow","hidden");
	if(this.map_main.css("position") != "absolute"){
		this.map_main.css("position","relative");
	}
}

//实例化后,需要调用初始化方法实现
cscMap.Map.prototype.info = function(config){
	var cfg = $.extend({},{zoomMaxFn:function(){},zoomMinFn:function(){},Buffer_size:[0,0],zoom:0},config);
	/*待优化点1*/
	this.config = $.extend({},cscMap.areas[config.area],cfg);
	$.extend(this.config,this.config.zooms[this.config.zoom]);
	/*待优化点1end*/
	this.Buffer_bgimg = {};//地图缓存图片,同步对像;
	if(!this.bind){this.htmlInfo();} //填充必要的地图HMTL结构;
	this.mapInfo();  //初始化地图必要参数;
	if(!this.bind){
		if(true) this.moveInfo(); //实现拖动效果;
		if(true) this.mousewheelInfo(); //实现滚轮放大,缩小效果;
		this.bind = 1;
	}
}

//插入必要的地图HMTL结构;
cscMap.Map.prototype.htmlInfo = function(){
	this.map_main.html(cscMap.Public.MapHtml.replace(/\{thisID\}/g,this.id));
	this.move_box = $("#"+this.id+"move_box").css("position","absolute");
	return;
};

//初始化地图必要参数,变量;
cscMap.Map.prototype.mapInfo = function(){
	this.center_point = [this.config.Center_point[0]*this.config.proportion,this.config.Center_point[1]*this.config.proportion];
	this.sizeInfo(); 
}

//改变缩放级别后,地图初始化(后期private化);
cscMap.Map.prototype.zoomInfo = function(point){
	this.center_point = [point[0]*this.config.proportion,point[1]*this.config.proportion];
	this.sizeInfo();	
}

//根据配置给内部对像赋值等;
cscMap.Map.prototype.sizeInfo = function(){
	this.map_main_size = [this.map_main.innerWidth(),this.map_main.innerHeight()];
	this.base_point = [-1*(this.center_point[0]-this.map_main_size[0]),-1*(this.center_point[1]-this.map_main_size[1])];
	this.img_munb = [
		Math.ceil((this.map_main_size[0]+this.config.Buffer_size[0])/this.config.bg_size[0]+1),
		Math.ceil((this.map_main_size[1]+this.config.Buffer_size[1])/this.config.bg_size[1]+1)
	];
	this.move_box.css({//地图背景;
        "overflow":"hidden",
		"width":this.config.map_size[0]*this.config.proportion+"px",
		"height":this.config.map_size[1]*this.config.proportion+"px",
		"left":-1*this.center_point[0]+(this.map_main_size[0]/2)+"px",
		"top":-1*this.center_point[1]+(this.map_main_size[1]/2)+"px"
	});
	this.img_bg();
    cscMap.Public.Dbug(this);
}

cscMap.Map.prototype.centerInfo = function(point){
    var o = this;
    this.center_point = [point[0]*this.config.proportion,point[1]*this.config.proportion];
    this.move_box.animate({//地图背景;
        "left":-1*this.center_point[0]+(this.map_main_size[0]/2)+"px",
        "top":-1*this.center_point[1]+(this.map_main_size[1]/2)+"px"
    },100,function(){
        o.img_bg();
        cscMap.Public.Dbug(o);
    });
}

//载入移动效果;
cscMap.Map.prototype.moveInfo = function(){
	var o = this;
    new cscMap.Move(this.map_main,this.move_box,{
        fn_move:function(x,y){
            o.img_bg();
            var py = o.move_box.position();
            o.center_point = [py.left*-1+(o.map_main_size[0]/2),py.top*-1+(o.map_main_size[1]/2)];
            cscMap.Public.Dbug(o);
            console.log("...");
        },
        fn_up:function(){
            console.log("移动结束!");
        }
    })
}

//滚轮效果
cscMap.Map.prototype.mousewheelInfo = function(){
	var o = this;
	var mousewheel = function(e){
		e = e || window.event;
		var ev = e.originalEvent || e;
		var delta = ev.wheelDelta ? (ev.wheelDelta / 120) : (- ev.detail / 3);
        var zoom = (o.config.zoom - 0 + (delta));//滚轮向上为放大,向下为缩小;
		var sb_p = cscMap.oMouse(ev,1);
		var yd = o.move_box.position();//原点位置
		var offset = o.map_main.offset();//地图相对页面的位置
		    offset.left += o.map_main[0].clientLeft;//增加边框等值
		    offset.top += o.map_main[0].clientTop;//增加边框等值
		var dxmap = [sb_p.x-offset.left,sb_p.y-offset.top]; //计算相对地图元素位置的偏移

		if(o.config.zooms[zoom]){//如果存此缩放级别
			var newcenter = [dxmap[0]-yd.left,dxmap[1]-yd.top] // 相对地图的偏移
            var xdpy = [o.center_point[0] - newcenter[0],o.center_point[1] - newcenter[1]]; //相对中心点的偏移
            var zszb = [newcenter[0] / o.config.proportion, newcenter[1] / o.config.proportion]; //滚轮位置的真实坐标
            var zoom_ = o.config.zooms[zoom];
            var new_center_point = [zszb[0] + xdpy[0]/zoom_.proportion,zszb[1] + xdpy[1]/zoom_.proportion]; //之后的中心点坐标
            o.setZoom(zoom,new_center_point);
        }else if(zoom <= -1){
			//o.config.zoomMinFn(o);
			if(o.config.z_map){
				o.info({area:o.config.z_map,zoom:cscMap.areas[o.config.z_map].zooms.length-1})
			};
			return false;
		}else if(zoom >= o.config.zooms.length){
			//o.config.zoomMaxFn(o);
			if(o.config.f_map){
				o.info({area:o.config.f_map,zoom:0});
			};
			return false;
		}
		return false;
	}
	this.map_main.bind('mousewheel',mousewheel).bind('DOMMouseScroll',mousewheel);
}
//实时加载背景图片;
cscMap.Map.prototype.img_bg = function(){
	var py = this.move_box.position();
	var img_base = [py.left*-1-this.config.Buffer_size[0],py.top*-1-this.config.Buffer_size[1]]
	var beginX = Math.floor(img_base[0]/this.config.bg_size[0]);
	var beginY = Math.floor(img_base[1]/this.config.bg_size[1]);
	var maxX = Math.ceil(this.move_box.innerWidth()/this.config.bg_size[0])-1;
	var maxY = Math.ceil(this.move_box.innerHeight()/this.config.bg_size[1])-1;
	var bgmap = $("#"+this.id+"map_bg_imgs");
	for(var y=0;y<this.img_munb[1];y++){
		for(var x=0;x<this.img_munb[0];x++){
			var key = this.config.zoom + "_" +(beginX+x) + "_" + (beginY+y);
			if(!this.Buffer_bgimg[key] && (beginX+x)<=maxX && (beginY+y)<=maxY && (beginX+x)>=0 && (beginY+y)>=0 ){
				
				var t_img = $("<div></div>");
				t_img.css("backgroundImage","url("+this.config.bg_img_route.replace("{zoom}",this.config.zoom).replace("{x}",beginX+x).replace("{y}",beginY+y)+")");
				
				//var t_img = $("<img>")				//t_img.attr("src",this.config.bg_img_route.replace("{zoom}",this.config.zoom).replace("{x}",beginX+x).replace("{y}",beginY+y));					
				t_img.css({"left":(beginX+x)*this.config.bg_size[0]+"px","top":(beginY+y)*this.config.bg_size[1]+"px"});
				bgmap.append(t_img);
				this.Buffer_bgimg[key]=true;
			}
			//bg_img_route.replase()
		}
	}
}

/**以下为常用API**/

/*设置地图重新定位
    zoom : {number} 新的缩放级别
    point : {Array} 缩放后的中心点位置
*/
cscMap.Map.prototype.setZoom = function(zoom,point){
	var new_center_point = point || this.getCenter();
    if(zoom == this.config.zoom){
        this.centerInfo(point);
    }else{
		/*
		if(o.config.zooms[zoom]){//如果存此缩放级别
		
        }else if(zoom <= -1){
			//o.config.zoomMinFn(o);
			if(o.config.z_map){
				o.info({area:o.config.z_map,zoom:cscMap.areas[o.config.z_map].zooms.length-1})
			};
			return false;
		}else if(zoom >= o.config.zooms.length){
			//o.config.zoomMaxFn(o);
			if(o.config.f_map){
				o.info({area:o.config.f_map,zoom:0});
			};
			return false;
		}
		*/
        $.extend(this.config ,this.config.zooms[zoom]);
        this.config.zoom = zoom;
        this.Buffer_bgimg = {};
        $("#"+this.id+"map_bg_imgs").html("");
        this.zoomInfo(new_center_point);
    }
}

/*获取当前中心点信息
    return {Array} : 反回当前地图的中心点坐标
*/

cscMap.Map.prototype.getCenter = function(){
    return [this.center_point[0]/this.config.proportion,this.center_point[1]/this.config.proportion];
}

/*获取当前地图信息
	
*/
cscMap.Map.prototype.getMapinfo = function(){
	return {point:[this.center_point[0]/this.config.proportion,this.center_point[1]/this.config.proportion],zoom:this.config.zoom,area:this.config.area};
}

/*设置中心点坐标
    point : {Array} 新中心点的坐标数组;
*/
cscMap.Map.prototype.setPoint = function(point){
    this.centerInfo(point);
}


cscMap.Map.prototype.Click = function(fun){
	var o = this;
	var ev = {};
	this.move_box.on("click",function(e){
		e.Point = o.getMousePoint(e);
		e.zoom = o.config.zoom;
		fun.call(o,e);
	});
}


cscMap.Map.prototype.getMousePoint = function(e){
	e = e || window.event;
	var sb_p = cscMap.oMouse(e,1);
	var offset = this.map_main.offset();//地图相对页面的位置
		offset.left += this.map_main[0].clientLeft;//增加边框等值
		offset.top += this.map_main[0].clientTop;//增加边框等值
	var dxmap = [sb_p.x-offset.left,sb_p.y-offset.top]; //计算相对地图元素位置的偏移
	var yd = this.move_box.position();//原点位置
	var newcenter = [dxmap[0]-yd.left,dxmap[1]-yd.top] // 相对地图的偏移
	//var xdpy = [this.center_point[0] - newcenter[0],this.center_point[1] - newcenter[1]]; //相对中心点的偏移
	var zszb = [newcenter[0] / this.config.proportion, newcenter[1] / this.config.proportion]; //滚轮位置的真实坐标
	//console.log(zszb);
	return zszb;
}