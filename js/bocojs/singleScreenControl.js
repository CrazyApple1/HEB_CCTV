var optMap = {};
var urlParam = {};
var cctvchannel = null; //当前播放的 channel 通道号
/**
 *  调试的方法
 */
function log(m){
    logstr=$("#lblInfo").val();
    logstr=m+"\n"+logstr;
    $("#lblInfo").val(logstr);
};
//播放视频
function startPlay(cctvchannel){
	try{
		if(cctvchannel != null){
			mediaplayerobj.ITMS_CCTV_StopPreview(0);
		}
		this.cctvchannel = cctvchannel;
	    mediaplayerobj.ITMS_CCTV_Preview(0,cctvchannel,6000, "", 0, "");
	    log("正在播放 " + cctvchannel,"播放");
	}catch(e){
		log(e,"播放");
	}
};
//请求执行回调方法
function doJsonp(url,data,strCallbackName){
	$.ajax({
		url:url,
        processData:false,
        contentType: "application/json;charset=gb2312",
        data:data,
        dataType:"jsonp",
        jsonpCallback:strCallbackName,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	alert("error:"+errorThrown);
        }
    });
}
//回调函数：保存
function fnCallback4Save(data){
	//回调成功后清空数据；
	emptySelectData();
	//成功后的提示框
	myDialog("winTipDiaScreen1","lblPosition",data.detail);

}
//回调函数：大类列表
function fnCallback4Class(data){
	var arr = data.content;
	$.each(arr,function(i,item){
		var value = item["classId"];
		var text = item["className"];
		if(value != "03"){
			//key ,value的值对应；
			optMap["class"+value] = {value:value,text:text};
		}
	});
    getItems4Type(); //获取细类信息
};
//回调函数：细类列表
function fnCallback4Type(data){
	var arr = data.content;
	$.each(arr,function(i,item){
		var value = item["typeId"];
		var text = item["typeName"];
		var fid = item["classId"];
		var mapClassObj = optMap["class"+fid];
		//要先判断嵌套前面的map存在才进行创建下一个map
		if(mapClassObj && !mapClassObj.map){
			mapClassObj.map = new Object(); //创建map
		}
		if(mapClassObj && mapClassObj.map){
			mapClassObj.map["type"+value] = {value:value,text:text};
		}
	});
    getItems4EventLevel(); //获取事件级别信息
};
//回调函数：事件级别列表
function fnCallback4EventLevel(data){
	var arr = data.content;
	$.each(arr,function(i,item){
		var value = item["planLevel"];
		var text = item["codeName"];
		var fid = item["planTypeId"]; //父节点 id
		var gfid = fid.substring(0,2); //爷爷节点 id
		var mapClassObj = optMap["class"+gfid];
		//要先判断嵌套前面的map存在才进行创建下一个map
		if(mapClassObj && mapClassObj.map){
			var mapTypeObj = mapClassObj.map["type"+fid];
			if(mapTypeObj && !mapTypeObj.map){
				mapTypeObj.map = new Object(); //创建map
			}
			if(mapTypeObj && mapTypeObj.map){
				mapTypeObj.map["level"+value] = {value:value,text:text};
			}
		}
	});
	//后台数据初始化完成
	initSels(); //执行填充下拉框大类
	//注册 change 事件
	$("#selClass").change(function(){
		var val = $("#selClass option:selected").val();
		$("#selType").html(""); //清除细类列表
		$("#selType").append("<option value=''>-- 请选择 --</option>");
		try{
			var map = optMap["class"+val].map;
			if(map){
				for(var key in map){
					var optObj = map[key];
					var value = optObj.value;
					var text = optObj.text;
					if(value!="0000"){
						$("#selType").append("<option value='"+value+"'>"+text+"</option>");
					}
				}
			}
		}catch(e){
			
		}
	});
	$("#selType").change(function(){
		var valClass = $("#selClass option:selected").val();
		var valType = $("#selType option:selected").val();
		$("#selLevel").html(""); //清除事件级别列表
		$("#selLevel").append("<option value=''>-- 请选择 --</option>");
		try{
			var map = optMap["class"+valClass].map["type"+valType].map;
			if(map){
				for(var key in map){
					var optObj = map[key];
					var value = optObj.value;
					var text = optObj.text;
					$("#selLevel").append("<option value='"+value+"'>"+text+"</option>");
				}
			}
		}catch(e){
			
		}
	});
	//提交按钮监听
	$("#btnSubmit").click(function(){
		saveAlertList(); //保存
	});
	//重置按钮监听
	$("#btnReset").click(function(){
		emptySelectData()
	});
};

//初始化下拉框
function initSels(){
	$("#selClass").html(""); //清除大类
	$("#selClass").append("<option value=''>-- 请选择 --</option>");
	var map = optMap;
	if(map){
		for(var key in map){
			var optObj = map[key];
			var value = optObj.value;
			var text = optObj.text;
			$("#selClass").append("<option value='"+value+"'>"+text+"</option>");
		}
	}
}

//请求后台获取数据
function loadOptionsMap(){
	var url = urlBaseICMS+"servlet/CctvServlet?action=findAllAlarmClass";
	doJsonp(url,null,"fnCallback4Class");
}

function getItems4Type(){
	var url = urlBaseICMS+"servlet/CctvServlet?action=findAllAlarmType";
	doJsonp(url,null,"fnCallback4Type");
}

function getItems4EventLevel(){
	var url = urlBaseICMS+"servlet/CctvServlet?action=findAllEventLevel";
	doJsonp(url,null,"fnCallback4EventLevel");
}
//保存
function saveAlertList(){
	var classId = $("#selClass option:selected").val();
	var typeId = $("#selType option:selected").val();
	var levelId = $("#selLevel option:selected").val();
	var levelDesc = $("#selLevel option:selected").text(); //取文本
	var content = $("#txaContent").val();
	//判断你是否填写的内容为空
	if(!(classId&&typeId&&levelId&&levelDesc)){
		return myDialog("winTipDiaScreen2","lblPosition","请将信息填写完整！");
		//return alert("请将信息填写完整!");
	}
	var param = {
		userId:urlParam.userId,
		sbbh:urlParam.sbbh,
		classId:classId,
		typeId:typeId,
		eventLevel:levelId,
		levelDesc:levelDesc,
		content:content
	};
	var paramStr = $.param(param);
	var url = urlBaseICMS+"servlet/CctvServlet?action=saveAlertList";
	//请求网络数据，回调后清空数据，但是不能重新设置html，采用选择的方式才有效；
	doJsonp(url,paramStr,"fnCallback4Save");
}
function emptySelectData(){
	//先清空后选择，防止出现问题
	$("#selClass option").attr("selected",false);
	$("#selClass option[value='']").attr("selected",true);
	$("#selType option").attr("selected",false);
	$("#selType option[value='']").attr("selected",true);
	$("#selLevel option").attr("selected",false);
	$("#selLevel option[value='']").attr("selected",true);
	$("#txaContent").text("")
	myDialog("winTipDiaScreen3","lblPosition","信息重置成功！");

};
/**
 * 添加自定义的对话框封装；
 * @param singleId 确定唯一的id
 * @param positionId 确定位置的id
 * @param content	确定内容的id
 */
function myDialog(singleId,positionId,content){
	var d = dialog({
		id:singleId,
		align:"right bottom",
		padding:10,
		width:150,
		height:50,
		content: content,
		quickClose: true// 点击空白处快速关闭
	});
	//其位子在label后面，轮播的提示框，避免重复点击
	var id="#"+positionId;
	d.show($(id)[0]);
	setTimeout(function () {
		d.close().remove();
	}, 2000);
};
$(document).ready(function(){
	$("#lblInfo").val("");
	$("#imgDebug").dblclick(function(){
       $("#lblInfo").toggle();
    });
    //http://10.11.1.52:7001/HEB_ICMS_REST/servlet/CctvServlet?
    var urlBaseRest = urlBaseICMS+"servlet/CctvServlet";
	//得到ocx的控件
    mediaplayerobj = document.getElementById("mediaplayerid");
    var oUserId = queryStringByName("oUserId");
	var sbbh=queryStringByName("sbbh");
	var channel=queryStringByName("channel");
	var cctvdevicename=queryStringByName("cctvdevicename");
	urlParam.userId = oUserId;
    urlParam.sbbh = sbbh;
    urlParam.channel = channel;
	urlParam.cctvdevicename=cctvdevicename;
	//log(" oUserId= "+oUserId+" sbbh= "+sbbh+" channel= "+channel+" cctvdevicename= "+cctvdevicename);
	//获取跳转前的网页传递的信息
    function queryStringByName(queryName) {
        var str = location.href; //取得整个地址栏
        //alert(str);
        if (str.indexOf("?") > -1) {
            var queryParam = str.substring(str.indexOf("?") + 1);
            //如果有多个参数
            //if (queryParam.indexOf("&") > -1)
            var param = queryParam.split("&");
            for (var a = 0; a < param.length; a++) {
                var query = param[a].split("=");
                if (query[0] == queryName) {
                    return query[1];
                }
            }
        }
        return "";
    };
    $("#btnPlay").click(function(){
    	startPlay(urlParam.channel); //开始播放
    });
	/**
	 *显示调试的信息
	 */
    $("#lblh4").dblclick(function(){
        if($("#txtarea").is(":visible")){
            $("#txtarea").hide();
        }
        else{
            $("#txtarea").show();
        }

    });

    $(window).on("beforeunload", function () {
        try {
            //设置延时停止
			//停止
			log("停止视频成功！"+"销毁(1/4)");
			mediaplayerobj.ITMS_CCTV_StopPreview(0);
			//注销
			mediaplayerobj.ITMS_CCTV_MediaUnRegister();
			log("注销 OCX 成功！"+"销毁(2/4)");
			//释放
			mediaplayerobj.ITMS_CCTV_FreeScreen();
			log("释放屏幕成功！","销毁(3/4)");
			//释放
			mediaplayerobj.ITMS_CCTV_MediaFree();
			log("释放媒体成功！"+"销毁(4/4)");
        }
        catch (e) {
            log(e,"退出OCX异常");
        }
    });
    $(window).on("resize", function (){
        bodyResize();
    });
    function bodyResize() {
        var width = $("#divLeft").css("width");
        var height =$(window).height() - $("#divTitle").height()-5;
        $("#divLeft").width(width);
        $("#mediaplayerid").height(height);
        //$(".right").css("height",height+"px");
		//alert(width+" "+height);
        try{
            mediaplayerobj.ITMS_CCTV_ReSizeVideoDlg(0, 0, width, height);
            log("画面设置大小化成功！"+"2/4.初始化 ITMS_CCTV_ReSizeVideoDlg");
        }catch(e){
        	log(e.message);
        }
		//var width = $("#divViewMedia").width();
		//var height = $("#divViewMedia").height();
		//height = $(window).height()-$("#divCtrlPnl").height();
		//$("#divViewMedia").height(height);
		//$("#divViewMedia").width("100%");
    }

    /**
     * 媒体初始化
     */
    function mediaplayinit() {
        try {

            mediaplayerobj.ITMS_CCTV_MediaInit(ocx_userid, ocx_clientip, ocx_clientport, ocx_userpwd, ocx_serverip, ocx_serverid, ocx_serverport);
            log("媒体初始化成功！"+"1/4.初始化 ITMS_CCTV_MediaInit");
            bodyResize();
            mediaplayerobj.ITMS_CCTV_ScreenSwitch(1, 0);
            log("媒体画面切化成功！"+"3/4.初始化 ITMS_CCTV_ScreenSwitch");
            mediaplayerobj.ITMS_CCTV_MediaRegister(1800);
            log("媒体画面注册成功！"+"4/4.初始化 ITMS_CCTV_MediaRegister");
            setTimeout(function(){
				mediaplayerobj.ITMS_CCTV_Preview(0, urlParam.channel,6000, "", 0, "");
			},1);
			log("请求视频成功4/4.初始化 ITMS_CCTV_Preview");
            /*
			
			
			*/
            
			//11010000001310000018 channel
            //mediaplayerobj.ITMS_CCTV_RegisterAndPreview(1800, 0,channel, 6000, "",0, "");
			//log("请求视频成功4/4.初始化 ITMS_CCTV_RegisterAndPreview");
			//bodyResize();
		} catch (e) {
            log(e+"初始化");
        }
    }

	/**
	 * 用户，设备名称的提示消息
	 */
	function dataInit(){
		$("#lblUserId").text(oUserId);
		$(".lblName_top").text(cctvdevicename);
	}

    $("#btn1").click(function(){
    	loadOptionsMap();
    });
	//视频控件初始化
    mediaplayinit();
    //初始化下拉框
    loadOptionsMap();
    //初始化基本提示数据
	dataInit();
    
})