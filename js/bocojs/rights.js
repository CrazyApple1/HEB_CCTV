//权限处理，查询用户的锁控、警情录入、状态录入权限
var rights4Cctv = {
	enableLock:false,	//是否拥有锁控权限
	enableAlert:false,	//是否警情录入权限
	enableState:false	//是否拥有状态录入权限
};

//查询视频用户权限
function queryRights(){
	var paramObj = "userid="+oUserId+"&operation=getCctvRights";
	$.ajax({
	    type: "GET",
	    url: urlDevicePoll,
	    contentType: "application/json;charset=utf-8",
	    processData: false,
	    async: true,
	    data: paramObj,
	    dataType: "jsonp",
	    jsonpCallback:"queryRightsHandler",
	    success: function (data) {},
	    error: function (XMLHttpRequest, textStatus, errorThrown) {
	        alertMy("请求失败后的状态:" + textStatus);
	    }
	});	
}
//用户权限查询后的句柄
function queryRightsHandler(data){
    data = data.result;
    $.each(data, function (index, jsValue) {
        var vitem = data[index];
        var key = vitem.functionid;
        rights4Cctv[key] = true; //设置为有权限
    });
    alertMy("视频权限："+$.param(rights4Cctv));
    //设置菜单权限
    if(!rights4Cctv.enableLock){
    	$("#liTreeAdd").remove();
    }
    if(!rights4Cctv.enableAlert){
    	$("#liTreeNewWeb").remove();
    	$("#liRotationNewWeb").remove();
    }
    if(!rights4Cctv.enableState){
    	$("#liTreeState").remove();
    	$("#liRotationState").remove();
    }
    
}
