// JavaScript Document
var mapClass = {};
mapClass.mark_bj = true; //感应边界开关
mapClass.mark_tdBzb = {};

function inval(val,max_v,min_v){
	var max_x = max_v>min_v?max_v:min_v,
		min_x = max_v>min_v?min_v:max_v;
	return val>max_x?max_x:val<min_x?min_x:val;
}
var oMouse=function(e){
	if(e.pageX || e.pageY){
		return {x:e.pageX, y:e.pageY}; 
	}else{//IE
		return{x:e.clientX,y:e.clientY};
	};
}
//地图拖动事件
function mosemove(main,movebox,config){
	var cfg = config || {};
	var map_main = main || $("#map_main"),
		move_box = movebox || map_main.find("#move_box");
	$(document).on("mousemove",function(e){
		if(!mapClass.mark_td){return;}
		var oM = oMouse(e||window.event);
		var to_x = mapClass.mark_tdBzb.offset.x+(oM.x)
		var to_y = mapClass.mark_tdBzb.offset.y+(oM.y)
		if(mapClass.mark_bj){
			var min_x = 0;
			var max_x = map_main[0].clientWidth-move_box[0].offsetWidth;
			var min_y = 0;
			var max_y = map_main[0].clientHeight-move_box[0].offsetHeight;
			to_x = inval(to_x,min_x,max_x);
			to_y = inval(to_y,max_y,min_y);
		};
		/*var html_ = "鼠标：" + oM.x + " * " + oM.y + "<br>"
					+ "鼠标：" + (oM.x+(document.documentElement.scrollLeft+document.body.scrollLeft)) + " * " + (oM.y+(document.documentElement.scrollTop+document.body.scrollTop)) + "<br>"
					+ to_x +  " * " + to_y;
		$("#time_bd").html(html_);*/
		move_box.css({"left":to_x+"px","top":to_y+"px"});
		if(cfg.move){
			typeof(cfg.move) == "function" && cfg.move(to_x,to_y);
		}
		e.returnValue=false;
	});
	//禁用选择文本;
	/*if(document.all){
	   map_main[0].onselectstart= function(){return false;}; //for ie
	}*/
	map_main.on("mousedown",function(e){
		var oM = oMouse(e||window.event);
		mapClass.mark_tdjb = setTimeout(function(){
			mapClass.mark_td = true;
			move_box.addClass("cur_p");
			var offset = move_box.position();
			mapClass.mark_tdBzb.offset = {
				"x":offset.left - (oM.x),
				"y":offset.top - (oM.y)
			};
		},50)
	})
	$(document).on("mouseup",function(){
		clearTimeout(mapClass.mark_tdjb);
		mapClass.mark_td = false;
		move_box.removeClass("cur_p");
	})
}
