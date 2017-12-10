var ocxIsNotInit = true; //ocx 是否已经初始化

//回调信息
function ITMS_CCTV_RecordQuery_Handler(pxml){
	try{
	//	alert(pxml);
		//js 调用 flex 的控件方法
		var ocx = window.top.document.getElementById("index");
		var xmlStr = pxml;
		//var xml = ocx.findVedioHandler(xmlStr);
		var xml = ocx[window.top.fnForFlex](xmlStr);
		log("录像时段查询完毕","查询录像列表成功");
	}catch(e){
		alert("ocx 回调异常！"+e.message);
		log(e.message,"查询录像列表异常");
	}
}
//记录日志的方法
function log(msg,title){
	if(!txaLog){
		return;
	}
	var date = new Date();
	var timeStr = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+"."+date.getMilliseconds();
	if(title){
		timeStr += "\r\n" + title + ":";
	}
	msg = "\r\n" + timeStr +"\r\n" + msg + "\r\n";
	var txaLog = document.getElementById("txaResult");
	var oldMsg = txaLog.value;
	msg += oldMsg;
	txaLog.value = msg;
}
//初始化 ocx
function initOcx() {
    try {
    	if(ocxIsNotInit){
            bocoVedioOcx.ITMS_CCTV_MediaInit(ocx_userid, ocx_clientip, ocx_clientport, ocx_userpwd, ocx_serverip, ocx_serverid, ocx_serverport);
            log("媒体初始化成功！","1/4.初始化 ITMS_CCTV_MediaInit");
            /*
            bocoVedioOcx.ITMS_CCTV_ScreenSwitch(1, 0);
             log("媒体画面切换化成功！","3/4.初始化 ITMS_CCTV_ScreenSwitch");
             bocoVedioOcx.ITMS_CCTV_MediaRegister(1800);
             log("OCX 注册成功！","4/4.初始化ITMS_CCTV_MediaRegister");
             */
             /*
            setTimeout(function(){
                
            },500);
			*/
			ocxIsNotInit = false;
    	}
    } catch (e) {
        log(e,"初始化");
        ocxIsNotInit = false;
    }
}

//查询录像列表接口 2016.08.09 mgg 添加，由 Flex 触发，调用 ocx，然后 ocx 事件调用 js 返回到前端
//arrParam 参数：通道号，设备名称，查询开始时间，查询结束时间
function findVedio(arrParam){
	try{
		initOcx();
		var channle = arrParam[0];
		var devicename = arrParam[1];
		var t1 = arrParam[2];
		var t2 = arrParam[3];
		window.top.fnForFlex = arrParam[4];
		t1 = t1.replace(" ","T");
		t2 = t2.replace(" ","T");
   		var vcode = bocoVedioOcx.ITMS_CCTV_RecordQuery(9, channle, t1, t2, "64010000002100000001", "Address1", channle, 0, 0);
   		log("查询："+vcode,"ocx 查询录像");
   		//下面开始进行异步调用，事件会返回，触发上述事件
   	}catch(e){
   		log("异常："+e.message,"ocx 查询录像");
   	}
}