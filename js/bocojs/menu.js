//树节点参数配置
var treeSetting = {
//			async: {
//				enable: true,
//				type: "GET",
//				contentType: "application/json;charset=utf-8",
//				dataType: "jsonp",
//				url: urlDeviceBase,
//				dataFilter:filterTreeData, //树节点数据转换函数
//				otherParam: ["userId", oUserId] //需要用户的数据ID
//			},
    data: {
        simpleData: {
            enable: true
        }
    },
    view: {
        //showLine:false,
        selectedMulti:false, //单选树节点
        fontCss: getFontCss //设备选中后的样式变化
    }, //注册鼠标双击和右键事件
    edit: {
        enable: true,
        showRemoveBtn: false,
        showRenameBtn: false
    },
    callback: {
        onDblClick: zTreeOnDblClick,
        onRightClick: zTreeOnRightClick,

        beforeDrag: zTreeBeforeDrag,
        beforeDrop: zTreeBeforeDrop,
        onDrop: zTreeOnDrop,

    }
};
function beforeDrag(treeId, treeNodes) {
    alert("p");
    return true;
}
//加载下拉框列表，轮播
function loadSelPlayList(){
	var opts = $("#selPlayList option:selected");
	if(opts != null && opts.length > 0){
		var lbbh = $("#selPlayList").val();
		var paramObj = "userid="+oUserId+"&lbbh="+lbbh+"&operation=getdevice";
		$.ajax({
            type: "GET",
            url: urlDevicePoll,
            contentType: "application/json;charset=utf-8",
            processData: false,
            async: true,
            data: paramObj,
            dataType: "jsonp",
            jsonpCallback:"loadSelJsonpCallback",
            success: function (data) {},
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alertMy("请求失败后的状态:" + textStatus);
            }
        });
	}
}
/**
 * loadSelPlayList的jsonp回调函数；
 * @param data
 */
function loadSelJsonpCallback(data){
    data = data.result;
    var str = "";
    $("#olPlayList").empty();
    $("#turnPlayList").empty();
    oArray = new Array();
    $.each(data, function (index, jsValue) {
        var vitem = data[index];
        var statusPic = iconPath_unlock; //状态图标
        if(vitem.status!="0"){
        	statusPic = iconPath_error;
        }
        str = str + "<li title='设备名："+vitem.cctvdevicename+"'xh='"+index+"' channel='"+vitem.channel+"' sbbh='"+vitem.sbbh+"' cctvdevicename='"+vitem.cctvdevicename+"' status='"+vitem.status+"'>"
        + "<div style='float:left;width:80%;'><img id='imgDev"+vitem.sbbh+"' src='"+statusPic+"'/>" + vitem.cctvdevicename + "</div><div style='float:left;width:20%;text-align:right'></div>"
        + "</li>";
        //map中存入数据
        //oMap.put(data[index].cctvdeviceid, data[index].cctvdevicename);
        //数组中存入数据
        for (var i = 0; i < data.length; i++) {
        	oArray[i] = data[index].channel;
        }
    });
    $("#olPlayList").html(str);
    $("#turnPlayList").html(str);
    playUtil.changePlayList();  //cc 2017-01-10 解决tab切换之后，正在播放的设备没有标识高亮的问题
    $("#olPlayList li").mouseup(function(event){
        //先移除默认自定义的事件再添加
        $("#olPlayList li").each(function(){
            $(this).attr("selected",false);
        });
        $(this).attr("selected",true);
        // 找出事件源的属性
        var channel = $(this).attr("channel");
        var sbbh=$(this).attr("sbbh");
        var cctvdevicename=$(this).attr("cctvdevicename");
        //添加到attr的属性中
        $("#liRotationNewWeb").attr("channel",channel);
        $("#liRotationNewWeb").attr("sbbh",sbbh);
        $("#liRotationNewWeb").attr("cctvdevicename",cctvdevicename);
        var clkButton=event.button;
        if(clkButton!=2){
            //判断鼠标右键
            return;
        }
        var x=event.clientX;
        var y=event.clientY;
        //如果y大于的位子在距离底部的距离小于60px的时候y值重新赋值；li的高度默认设置为64px;
        //左边的默认width是250，不考虑放大或缩小，他的宽度的显示情况；li的宽度默认设置为107；
        var changePlaceTagY=$(window).height()-y;
        var changePlaceTagX=250-x;
        if(changePlaceTagY<=60){
            y=y-50;
        };
        if(changePlaceTagX<=107){
            //设为固定的
            x=130;
        };
        if($("#divRotationRMenu ul li").length > 0){
	        $("#divRotationRMenu").css({"top":y+"px","left":x+"px","display":"inline-block","position":"absolute"});
	        $("#divRotationRMenu").show();
        }
    });
    
//  var selPlayListVal = $("#selPlayList option:selected").val();
//	playUtil.setCurrentLbfa(selPlayListVal);
    $("#turnPlayList li").mouseup(function(event){
        //先移除默认自定义的事件再添加
        $("#turnPlayList li").each(function(){
            $(this).attr("selected",false);
        });
        $(this).attr("selected",true);
        // 找出事件源的属性
        var channel = $(this).attr("channel");
        var sbbh=$(this).attr("sbbh");
        var cctvdevicename=$(this).attr("cctvdevicename");
        //添加到attr的属性中
        $("#liRotationNewWeb").attr("channel",channel);
        $("#liRotationNewWeb").attr("sbbh",sbbh);
        $("#liRotationNewWeb").attr("cctvdevicename",cctvdevicename);
        var clkButton=event.button;
        if(clkButton!=2){
            //判断鼠标右键
            return;
        }
        var x=event.clientX;
        var y=event.clientY;
        //如果y大于的位子在距离底部的距离小于60px的时候y值重新赋值；li的高度默认设置为64px;
        //左边的默认width是250，不考虑放大或缩小，他的宽度的显示情况；li的宽度默认设置为107；
        var changePlaceTagY=$(window).height()-y;
        var changePlaceTagX=250-x;
        if(changePlaceTagY<=60){
            y=y-50;
        };
        if(changePlaceTagX<=107){
            //设为固定的
            x=130;
        };
        if($("#divRotationRMenu ul li").length > 0){
	        $("#divRotationRMenu").css({"top":y+"px","left":x+"px","display":"inline-block","position":"absolute"});
	        $("#divRotationRMenu").show();
        }
    });
    
    //});
    //注册html的监听事件，当点击空白处的时候隐藏右键的div
    $("html").click(function(){
        $("#divRotationRMenu").hide();
    });
    $("#liRotationNewWeb").unbind("mouseup");
    $("#liRotationNewWeb").mouseup(function(event){
        var sbbh=$(this).attr("sbbh");
        var channel=$(this).attr("channel");
        var cctvdevicename=$(this).attr("cctvdevicename");
        //弹出提示
        alertMy(sbbh);
        $("#divRotationRMenu").hide();
        //弹出新的网页设置锁定
        var url = "singleScreenControl.html?oUserId="+oUserId+"&sbbh="+sbbh+"&channel="+channel+"&cctvdevicename="+cctvdevicename;
        //如果有轮播列表，并且正在播放才进行跳转,由于需求改变，删除限定
        //if(playUtil&&playUtil.playing){}
        //全局变量openWindowLen,打开的网页长度
        window.open(url);
    });
    $("#liRotationState").unbind("mouseup");
    $("#liRotationState").mouseup(function(event){

        $("#divRotationRMenu").hide();
        //2.否则，提示无权播放当前已经被其他人锁定了，无权播放控制
        //var htmlStr = "<img src='"+treeNode.icon+"'/>"+treeNode.name;
        //htmlStr += "，已经被 " + lockedArr[0].syr + " 锁控，您无权进行操作！";
        var htmlStr="<select><option  value=''>设备无信号</option><option value=''>设备无视频</option><option  value=''>信号异常</option><option  value=''>前端污损</option></select>"
        var d = dialog({
            id:"XTip",
            align:"left bottom",
            padding:0,
            margin:0,
            width:120,
            title:"设备状态录入",
            content: htmlStr,
            okValue: '确定',
            ok: function () {
            },
            quickClose: true// 点击空白处快速关闭
        });
        d.show($( "#lblTimeInfo" )[0]);
    });
    alertMy("轮询的数组长度："+oArray.length);
}

//树节点数据转换
function filterTreeData(treeId, parentNode, msgResult) {
	if (!msgResult) return null;
	var childNodes = new Array();
	if(msgResult.code == 0){
		var arrData = msgResult.result;
		var len = arrData.length;
        for (var i = 0; i < len; i++) {
            var nodeData = {};
            nodeData.cctvdeviceid = arrData[i].cctvdeviceid;
            nodeData.cctvdevicename = arrData[i].cctvdevicename;
            nodeData.id = arrData[i].id;
            nodeData.isParent = arrData[i].isParent;
            nodeData.jgbh = arrData[i].jgbh;
            nodeData.name = arrData[i].name;
            //nodeData.open = arrData[i].open;
            nodeData.orgname = arrData[i].orgname;
            nodeData.pId = arrData[i].pId;
            nodeData.sbbh = arrData[i].sbbh;
            nodeData.status = arrData[i].status;
            nodeData.syqx = arrData[i].syqx;
            nodeData.channel = arrData[i].channel; //通道号
            nodeData.syr = arrData[i].syr; //使用人（锁定它的人）
            nodeData.bksd = arrData[i].bksd; //布控时段，毫秒数（锁定多少毫秒）
            nodeData.kssj = arrData[i].kssj; //锁定开始时间
            var syr = nodeData.syr;
            var icon = "";
            //叶子节点换图标
            if(!nodeData.isParent){
            	//判断锁定
                if(syr != undefined && syr != null && syr != ""){
                	if(syr != oUserId){
                		icon = iconPath_lock_other;
                	}else{
                		icon = iconPath_lock_self;
                	}
                }else{
                	icon = iconPath_unlock;
                }
                //状态是好还是坏，只判断 0 ，1；0为正常，1为其他方式检测到错误，只改变显示效果。
                if(arrData[i].status==0){
                    icon = iconPath_error;
                }
                nodeData.icon = icon;
            }
            childNodes.push(nodeData);
        }
        $("#btnRefreshTree").attr("title","刷新成功!");
        $("#btnRefreshTree").attr("src",iconPath_refresh); //让按钮可以查询
	}else{
		$("#btnRefreshTree").attr("src",iconPath_error); //让按钮显示错误
        $("#btnRefreshTree").attr("title","刷新失败!");
        setTimeout(function(){
        	$("#btnRefreshTree").attr("src",iconPath_refresh); //让按钮可以查询
        },2000);
	}
	return childNodes;
}

//旧方法加载树数据 2016.05.01,现在使用
var mapNewNodes = {}; //新的节点对象
function loadTreeData(oUserId){
	var paramObj = "userId=" + oUserId;
    $.ajax({
        type: "GET",
        url: urlDeviceBase,
        contentType: "application/json;charset=utf-8",
        processData: false,
        async: false,
        data: paramObj,
        dataType: "jsonp",
        success: function (data) {
        	//当前树上选中的节点
        	var selectedNodes = treeObj.getSelectedNodes();
        	mapNewNodes = {}; //清空新的 map
        	var boolInitLoad = (zNodes == null || zNodes.length == 0);
            $.each(data, function (index, jsValue) {
                    for (var i = 0; i < data.result.length; i++) {
                    	var nodeid = data.result[i].id; //节点的数据 id
                        zNodes[i] = {};
                        mapNewNodes["node"+nodeid] = zNodes[i]; //唯一定位节点对象
                        zNodes[i].cctvdeviceid = data.result[i].cctvdeviceid;
                        zNodes[i].cctvdevicename = data.result[i].cctvdevicename;
                        zNodes[i].id = nodeid;
                        zNodes[i].isParent = data.result[i].isParent;
                        zNodes[i].jgbh = data.result[i].jgbh;
                        zNodes[i].name = data.result[i].name;
                        zNodes[i].open = data.result[i].open;
                        zNodes[i].orgname = data.result[i].orgname;
                        zNodes[i].pId = data.result[i].pId;
                        zNodes[i].sbbh = data.result[i].sbbh;
                        zNodes[i].status = data.result[i].status;
                        zNodes[i].syqx = data.result[i].syqx;
                        zNodes[i].channel = data.result[i].channel; //通道号
                        zNodes[i].syr = data.result[i].syr; //使用人（锁定它的人）
                        zNodes[i].bksd = data.result[i].bksd; //布控时段，毫秒数（锁定多少毫秒）
                        zNodes[i].kssj = data.result[i].kssj; //锁定开始时间
                        var syr = zNodes[i].syr;
                        var icon = "";
                        //叶子节点换图标
                        if(!zNodes[i].isParent){
                        	//判断锁定
                            //if(syr != undefined && syr != null && syr != ""){
                            	////
                            	//if(syr != oUserId){
                            	//	icon = iconPath_lock_other;
                            	//}else{
                            	//	icon = iconPath_lock_self;
                            	//}
                            //}else{
                            //
                            //}
                            //自己锁定
                            if(syr == oUserId){
                                icon = iconPath_lock_self;
                            }
                            //其他人锁定
                            if(syr != oUserId){
                                icon = iconPath_lock_other;
                            }
                            //没锁
                            if(syr == ""){
                                //状态是好还是坏，只判断 0 ，1；0为正常，1为其他方式检测到错误，只改变显示效果。
                                if( data.result[i].status == 1 ){
                                    icon = iconPath_error;
                                }
                                icon = iconPath_unlock;
                                if(data.result[i].status == 1){
                                    icon = iconPath_error;
                                }
                            }
                            zNodes[i].icon = icon;
                        }
                    }
                }
            );
            //以下代码刷新树数据
            if(boolInitLoad){ //如果是初始化加载树，则进行刷新整棵树
            	$.fn.zTree.init($("#treedevice"), treeSetting, zNodes);
            }else{
            	//否则，根据节点遍历更新树的图标
            	//1.删除现无的（倒序遍历节点数组，查找不在新 map 里面的，从树数据数组移除掉）
            	for(var i = zNodes.length - 1; i > 0; i --){
            		var nodeData = zNodes[i];
            		var nodeid = nodeData.id;
            		var existNode = mapNewNodes["node"+nodeid];
            		if(existNode == null || existNode == undefined){
            			var treeNodes = treeObj.getNodesByParam("id",nodeid,null);
            			if(treeNodes != null && treeNodes.length > 0){
            				treeObj.removeNode(treeNodes[0]); //移除树节点
            			}
            			zNodes.splice(i, 1); //移除数组的元素
            		}
            	}
            	//1.更新原有的（遍历新 map，节点数组有就该节点就更新，没有就添加）
            	for(var key in mapNewNodes){
            		var nodedata = mapNewNodes[key];
            		var nodeid = nodedata.id;
            		var boolExist = false;
            		for(var i = 0; i < zNodes.length; i ++){
            			var znodeid = zNodes[i].id;
            			if(nodeid == znodeid){
            				zNodes[i] = nodedata;
            				var treeNodes = treeObj.getNodesByParam("id",znodeid,null);
            				if(treeNodes != null || treeNodes.length > 0){
            					var treeNode = treeNodes[0]; //更新第一个
            					treeNode.icon = nodedata.icon; //更新图标，动态更新图标
            					treeNode.bksd = nodedata.bksd; //锁控时长
            					treeNode.syr = nodedata.syr; //锁控人
            					treeNode.kssj = nodedata.kssj; //锁控时间
                                treeNode.status = nodedata.status; //状态更新
            					treeObj.updateNode(treeNode);
            				}
            				boolExist = true;
            				break;
            			}
            		}
            		//如果是新节点，查找它的父节点添加进去
            		if(!boolExist){
            			//先找到父节点，然后在父节点下添加一个子节点
            			var pid = nodedata.pId; //父节点 id
            			var nodeParents = treeObj.getNodesByParam("pId",pId,null);
            			var nodeParent = null; //父节点
            			if(!nodeParents && nodeParents.length > 0){
            				nodeParent = nodeParents[0];
            			}
            			treeObj.addNodes(nodeParent,nodedata); //添加字节到父节点的顶上
            		}
            	}
//            	treeObj.refresh();//刷新树节点,刷新节点会导致树抖动
            	//设置当前选中的树节点
            	/*
            	if(selectedNodes != null && selectedNodes.length > 0){
            		var selectedNode = selectedNodes[0];
            		treeObj.selectNode(selectedNode); //设置单个选中
            	}
            	*/
            }
            $("#btnRefreshTree").attr("src",iconPath_refresh); //让按钮可以查询
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alertMy("请求失败后的状态:" + textStatus);
            $("#btnRefreshTree").attr("src",iconPath_error); //让按钮显示错误
            $("#btnRefreshTree").attr("title","刷新失败!");
            setTimeout(function(){
            	$("#btnRefreshTree").attr("src",iconPath_refresh); //让按钮可以查询
            },2000);
        }
    });
}
//点击树节点的位子的初始化
function positionInitFirst(channelID) {
        //positionTag=getCurViewNumb();
        var curViewNumb=mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
        if(oVeiwNumber==4){
            if(curViewNumb>-1){
                //选定了，就设置为当前的位子
                positionTag=curViewNumb;
                //alert("oVeiwNumber "+oVeiwNumber+"  positionTag "+positionTag);
            }
        }
        var p = positionTag % oVeiwNumber;
        //捕获异常判断是哪里出现bug
        try{
            mediaplayerobj.ITMS_CCTV_StopPreview(p);
        }
        catch(e){
            alert(e.message+"StopPreview");
        }
        alertMy("正在播放窗口 "+p+"，分屏数:"+oVeiwNumber+" channel:"+channelID);
        try{
            mediaplayerobj.ITMS_CCTV_Preview(p, channelID, 6000, "", 0, "");
        }catch(e){
            alert(e.message+"Preview");
        }
    positionTag = positionTag + 1;
}

function setCurtArr(channel){
    if(tagIsViewChange){
        curentArray=[];//数组置空
        tagIsViewChange=false;//标记重置
    }
    var len=4;
    var tag=false;//标记数组元素是否存在
    //只考虑四分屏的情况
    if(curentArray.length>0){
        for(var i= 0;i<curentArray.length;i++){
            if(channel==curentArray[i]){
                tag=true;//存在
            }
        }
    }
    //不存在，且长度小于分屏数
    if(!tag&&curentArray.length<len){
        curentArray.push(channel);//添加到数组的末尾,加一个长度等于len，其满足下一个条件并且执行，出现了不希望得到的结果
    }
    if(!tag&&curentArray.length>len){
        curentArray.push(channel);//添加到数组末尾
        curentArray.shift();//删除数组的第一个
    }
    return tag;
};
//每个节点的双击事件进行监听
function zTreeOnDblClick(event, treeId, treeNode) {
    var treeNodeEvent = event;
    //解决下树的一个bug
    try{
        //判断是否是空或者是父节点
        if(treeNode == null || treeNode.isParent){
            return;
        }
        if(treeNode.status=="1"){
            myDialog("lblPosition",100,40,"设备已损坏,无法播放！",treeNodeEvent);
            return;
        }
        //验证是否正在开始轮播
        if(playUtil!=null && playUtil.playing){
            var d = dialog({
                id:"winTip",
                align:"left bottom",
                padding:0,
                width:200,
                height:50,
                content: '轮播清单正在播放中，请先关闭轮播！',
                quickClose: true// 点击空白处快速关闭
            });
            d.show($("#lblPosition")[0]);
            setTimeout(function () {
                d.close().remove();
            }, 2000);
            return ;
        }
        recordTreeNode = treeNode;
        var geturl=lockProps.urlGet;
        var getdata="userId="+oUserId+"&sbbh="+treeNode.sbbh;
        //开始播放树节点的数据
        $.ajax({
            type:"GET",
            url: geturl,
            contentType: "application/json;charset=utf-8",
            processData: false,
            async: false,
            data: getdata,
            dataType: "jsonp",
            jsonpCallback:"zTreeOnDblClickBack"
        });
    }
    catch(e){
        alertMy("zTreeOnDblClick异常"+e);
    };

}
//每个节点的双击事件进行监听，回调函数
function zTreeOnDblClickBack(data){
    var lockedArr = data.result; //锁定信息集合
    var lockedBySelf = false; //是否是自己锁定的
    var locked = false; //是否已经锁定了
    if(lockedArr != null && lockedArr.length != 0){
        locked = true; //已经锁定了
        for(var i in lockedArr){
            if(lockedArr[i].syr == oUserId){
                lockedBySelf = true; //是自己锁定的
                break;
            }
        }
    }else{
        locked = false; //没有别人锁定
    }
    //1.如果是自己锁定的或者没有锁都可以双击播放
    if(lockedBySelf || !locked){
        positionInitFirst(recordTreeNode.channel);
    }else{
        //2.否则，提示无权播放当前已经被其他人锁定了，无权播放控制
        var htmlStr = "<img src='"+recordTreeNode.icon+"'/>"+recordTreeNode.name;
        htmlStr += "，已经被 " + lockedArr[0].syr + " 锁控，您无权进行操作！";
        var d = dialog({
            id:"winTip",
            align:"left bottom",
            padding:0,
            width:120,
            content: htmlStr,
            quickClose: true// 点击空白处快速关闭
        });
        //找到当前的节点
        var nodeId = recordTreeNode.tId+"_ico";
        d.show($("#"+nodeId)[0]);
        setTimeout(function () {
            d.close().remove();
        }, 2000);
    }
};

//function valibBackDataP(data)
var valibBackDataP=function(data) {
    alertMy("valibBackDataP!");
    this.myData=data;
    var vdata=null;
    var result = data.result;
    var boolLocked = false; //是否已经锁定
    var boolLockedBySelf = false; //是不是当前用户锁定的
    if(result != null && result.length > 0){
        vdata = data.result[0];
        //请求成功后就是能播放；判断有无其他用户锁定，其他用户锁定后自己也不能播放；自己锁定的能播放；
        boolLocked = true;
        //alertMy("zTreeOnRightClick=成功");
        //alertMy("zTreeOnRightClick=成功取得数组长度是"+data.result.length);
        //alertMy("data.syr="+vdata.syr);
    }

    //判断数据不为空,id相同才有下一步操作
    if(vdata != null){
        var len = result.length;
        for(var i = 0; i < len; i ++){
            if(oUserId==data.result[i].syr){
                boolLockedBySelf = true;
                break;
            }
        }
    }else{
        vdata = {}; //防止清理时报 null 对象
    }
    //显示右键菜单
    var treeNode = selectedNode;
    if(treeNode != null){
        treeNode.bksd = vdata.bksd; //锁控时长
        treeNode.syr = vdata.syr; //锁控人
        treeNode.kssj = vdata.kssj; //锁控时间

        var x = eventMenu.clientX;
        var y = eventMenu.clientY;
        //回调的结果不管成功失败，首先把btnRightStr置为空；其实就是失败的情况，因为成功的时候有重新改变了他的值
        var btnRightStr = "";
        if(boolLocked){
            if(boolLockedBySelf){
                //更新图标
                treeNode.icon=iconPath_lock_self;
                btnRightStr = "#liTreeRemove,#liTreeView,#liTreeNewWeb,#liTreeState"; //出现解锁
            }else{
                //更新图标
                treeNode.icon=iconPath_lock_other;
                btnRightStr = "#liTreeView"; //其他人锁的，只能查看
            }
            //刷新所有节点，其实可以用updateNode（）这个法方法
            //treeObj.refresh();
            treeObj.updateNode(treeNode);
        }else{
            //更新图标
            if(treeNode.status == "1"){
                treeNode.icon = iconPath_error;
            }
            if(treeNode.status == "0"){
                treeNode.icon=iconPath_unlock;
            }
            //treeObj.refresh();
            treeObj.updateNode(treeNode);
            //没有锁定
            btnRightStr = "#liTreeAdd,#liTreeView,#liTreeNewWeb,#liTreeState"; //出现锁定
        }
        treeNode = selectedNode;
        //treeObj.selectNode(treeNode);
        //$("#treedevice_50").offset().top;[
        showRMenu(x,y,treeNode,btnRightStr);
    }
}
var mSbbh = "";
	//定义新数组，将不是自己锁定的设备存入数组，用于轮播时将页面右边的云台控制按钮禁用
	var othersLockArray;
function olBreakdownCallback(data){
	othersLockArray=new Array();
    $("#olPlayList li").remove();
    $("#turnPlayList li").remove();
    var str = "";
    var data = data.result;
    $.each(data, function (index, jsValue) {
        var vitem = data[index];
        //状态正常时候的元素，改变图标
        if(vitem.syr == oUserId){
            var cntTitle="锁定人："+vitem.syrName+" ID："+vitem.syr+" 设备名："+vitem.sbmc;
            str = str + "<li class='ui-state-default' title='"+cntTitle+"'  channel='"+vitem.channel+"' sbmc='"+vitem.sbmc+"'>"+
                "<div style='float:left;width:90%;'><img src='"+iconPath_lock_self+"'/><label mSyc='"+vitem.syr+"' sbbh='"+vitem.sbbh+"' status='"+vitem.status+"'>"+vitem.sbmc+"</label> </div>"
            "</li>";
        }
        //状态正常时候的元素，改变图标
        if(vitem.syr != oUserId){
        	//将不是自己锁定的设备存入数组
        	othersLockArray.push(vitem.channel);
            var cntTitle="锁定人："+vitem.syrName+" ID："+vitem.syr+" 设备名："+vitem.sbmc;
            str = str + "<li class='ui-state-default' title='"+cntTitle+"'  channel='"+vitem.channel+"' sbmc='"+vitem.sbmc+"'>"+
                "<div style='float:left;width:90%;'><img src='"+iconPath_lock_other+"'/><label mSyc='"+vitem.syr+"' sbbh='"+vitem.sbbh+"' status='"+vitem.status+"'>"+vitem.sbmc+"</label> </div>"
            "</li>";
        }
    });
    $("#olPlayList").html(str);//font-family: "微软雅黑", "黑体", "宋体";   "border": "1px solid #d3d3d3",
  
    $("#olPlayList li").css({
        "font-family":"微软雅黑",
        "font-weight":"normal",
        "border": "1px solid white",
        "color": "#555",
    });
    $("#turnPlayList li").css({
        "font-family":"微软雅黑",
        "font-weight":"normal",
        "border": "1px solid white",
        "color": "#555",
    });
    var mSyc = "";
    $("#olPlayList li div label").mouseup(function(e){
        if(e.which == 3){
            mSyc = $( this ).attr("mSyc");
            mSbbh = $( this ).attr("sbbh");
            lockRightLi.cntLi = $( this ).parent().parent();
            if( mSyc == oUserId ){
                $( "#divLock").css({
                    "position": "absolute",
                    "left": e.clientX,
                    "top": e.clientY
                });
                $( "#liLockOther").css("display", "none");
                $( "#divLock,#liLockSelf").css("display", "block");
            }
            if( mSyc != oUserId ){
                $( "#divLock").css({
                    "position": "absolute",
                    "left": e.clientX,
                    "top": e.clientY
                });
                $( "#liLockSelf").css("display", "none");
                $( "#divLock,#liLockOther").css("display", "block");
            }
        }
    });
    
    $("#turnPlayList li div label").mouseup(function(e){
        if(e.which == 3){
            mSyc = $( this ).attr("mSyc");
            mSbbh = $( this ).attr("sbbh");
            lockRightLi.cntLi = $( this ).parent().parent();
            if( mSyc == oUserId ){
                $( "#divLock").css({
                    "position": "absolute",
                    "left": e.clientX,
                    "top": e.clientY
                });
                $( "#liLockOther").css("display", "none");
                $( "#divLock,#liLockSelf").css("display", "block");
            }
            if( mSyc != oUserId ){
                $( "#divLock").css({
                    "position": "absolute",
                    "left": e.clientX,
                    "top": e.clientY
                });
                $( "#liLockSelf").css("display", "none");
                $( "#divLock,#liLockOther").css("display", "block");
            }
        }
    });
    
//    
    $( "#olPlayList li div label" ).dblclick(function(){
        var mSyc = $( this ).attr("mSyc");
        var status = $( this ).attr("status");
        var cntChannel = $( this ).parent().parent().attr( "channel" );
		if( mSyc == oUserId ){
            if( status == "1" ){
                myDialog("lblPosition2",60,30,"已损坏！","");
            }
            if( status == "0" ){
                positionInitFirst( cntChannel );
            }
		}
        if( mSyc != oUserId ){
            myDialog("lblPosition2",60,30,"无权限！","");
        }
    });
//   
    $( "#turnPlayList li div label" ).dblclick(function(){
        var mSyc = $( this ).attr("mSyc");
        var status = $( this ).attr("status");
        var cntChannel = $( this ).parent().parent().attr( "channel" );
		if( mSyc == oUserId ){
            if( status == "1" ){
                myDialog("lblPosition2",60,30,"已损坏！","");
            }
            if( status == "0" ){
                positionInitFirst( cntChannel );
            }
		}
        if( mSyc != oUserId ){
            myDialog("lblPosition2",60,30,"无权限！","");
        }
    });
}
function initBreakdownOL(){
    //var paramObj ={
    //    getLockedDevice: oUserId
    //}
    //http://172.17.19.215:8080/HEB_CCTV_REDIS/cctvsssy/getLockedDevice?callback=jQuery18309214147966355757_1478155424972&userId=icmstest
    var lockUrl=urlBaseRedis+"cctvsssy/getLockedDevice"
    var paramObj="userId="+oUserId;
    $.ajax({
        type: "GET",
        url: lockUrl,
        contentType: "application/json;charset=utf-8",
        processData: false,
        async: true,
        data: paramObj,
        dataType: "jsonp",
        jsonpCallback:"olBreakdownCallback" 	
    });
}

function olBKRmenuCallback(){
    lockRightLi.cntLi.remove();
    //解锁完成，刷新锁定列表
    initBreakdownOL();
}
//每个节点的右键点击事件进行监听
function zTreeOnRightClick(event, treeId, treeNode) {
    //var cutY=Math.floor(event.clientY);
    ////alert(cutY);
    //$( "#divLiContainer" ).scrollTop(1000);
	$("#divTreeRMenu").hide(); //隐藏菜单
	treeObj=$.fn.zTree.getZTreeObj("treedevice");
    treeObj.selectNode(treeNode,false,true);//让一个节点选中，不会滚到可视区域；
    selectedNode = treeNode; //选中的树节点
    treeNodeGlb.cntTreeNode = treeNode;
    eventMenu=event;
    //如果点击的代码是空白的位子，直接返回
    if(treeNode==null){
        return ;
    }
    if(treeNode.isParent){
        queryInSubTree();
    }
    if(!treeNode.isParent){
        //记录警情录入的信息
        sbbhTreeNewWeb=treeNode.sbbh;
        channelTreeNewWeb=treeNode.channel;
        cctvdevicenameTreeNewWeb=treeNode.cctvdevicename;
        alertMy("右键 "+ treeNode.sbbh);
        var geturl=lockProps.urlGet;
        var getdata="userId="+oUserId+"&sbbh="+treeNode.sbbh;
        $.ajax({
            type:"GET",
            url: geturl,
            contentType: "application/json;charset=utf-8",
            processData: false,
            async: false,
            data: getdata,
            dataType: "jsonp",
            //jsonpCallback:"valibBackDataP",
            success: function (data) {
                alertMy("success!");
                valibBackDataP(data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alertMy("error!");
            },
            complete:function(XHR, TS){
                alertMy("comple!");
            }
        });
    }
    function queryInSubTree(){
        //在对对话框里最好使用原生的dom操作
        var mHtml = document.getElementById('divQS');
        var d = dialog({
            id:"XTipTree",
            align:"left bottom",
            padding:0,
            margin:0,
            width:120,
            title:"节点下搜索",
            content: mHtml,
            okValue: '搜索',
            ok: function () {
                //searchNode();
                var searchKey; //搜索的关键字
                //取得input的模糊匹配的值
                searchKey = document.getElementById('ipQS').value;
                /** 关闭前一节点的高亮 */
                if(treeNodeGlb.idFirstClick != true){
                    if(treeNodeGlb.cntTreeNode != treeNodeGlb.oldTreeNode){
                        var oldLeafNodes = treeObj.getNodesByFilter(filterNode,false,treeNodeGlb.oldTreeNode);
                        $.each(oldLeafNodes,function(index,itemData){
                            oldLeafNodes[index].highlight = false;
                        });
                        treeObj.updateNode(oldLeafNodes);
                    }
                }
                treeNodeGlb.idFirstClick = false; //设置为非首次进入
                treeObj.expandAll(false); //折叠所有节点
                var leafNodes = treeObj.getNodesByFilter(filterNode,false,treeNode); // 查找当前节点集合
                var len = leafNodes.length;
                for(var i = 0; i < len; i ++){
                    var leafNode = leafNodes[i];
                    var leafName = leafNode.name;
                    alertMy(leafName);
                    if(leafName.indexOf(searchKey) == -1 || searchKey == ""){
                        leafNode.highlight = false; //不高亮
                    }else{
                        leafNode.highlight = true; //高亮
                        //展开树节点
                        var parentNode = leafNode.getParentNode(); //判断是否需要展开父节点
                        if(parentNode != null && !parentNode.open){
                            parentNode.open = true;
                        }
                    }
                }
                //刷新树渲染 ，关闭全部的父节点，重新设置高亮
                treeObj.refresh();
                document.getElementById('ipQS').value="";
            },
            quickClose: true// 点击空白处快速关闭
        });
        d.show($( "#lblPosition" )[0]);

        //var x = $( "#positionDiaScreen").offset().left + 15;
        //var y = $( "#positionDiaScreen").offset().top + 130;
        //$("#divQS").css("left",x);
        //$("#divQS").css("top",y);
        //$("#divQS").show();
        //var keyVal = $( "#ipQS" ).val();
        //$( "#btnQSSub" ).button();
        //$( "#btnQSCancel" ).button();
        //$( "#btnQSCancel").click(function(){
        //    $( "#divQS").hide();
        //    $( "#ipQS").val("");
        //});
        //$( "#btnQSSub" ).click(function(){
        //});
        function  searchNode(){

        };
        function filterNode(node){
            var bool = false;
            bool = !node.isParent;
            return bool;
        }
    }
};
function zTreeBeforeDrag(treeId, treeNodes){
    if(treeNodes[0].isParent){
        return false;
    }
    if(treeNodes[0].status=="1"){
        myDialog("lblPosition",100,60,"设备已损坏或锁定无法拖拽播放！","");
        return false;
    }
    var cntSyr = treeNodes[0].syr;

    if(treeNodes[0].status=="0"){
        if(cntSyr == ""|| cntSyr == oUserId){
            myDialog("lblPosition",60,30,"已选定！","");
            return true;
        }else{
            myDialog("lblPosition",100,60,"设备已损坏或锁定无法拖拽播放！","");
            return false;
        }

    }
}

//拖拽事件结束前触发事件
function zTreeBeforeDrop(treeId, treeNodes, targetNode, moveType){
    if(treeNodes[0].isParent){
        return false;
    }
    if(targetNode.name !== ""){
        return false;
    }
    return true;
}
//拖拽结束事件,获取节点数据，播放视频
function zTreeOnDrop(event, treeId, treeNodes, targetNode, moveType){
    //alert("end = "+"eventX: "+event.clientX+" "+ "eventY: "+event.clientY);
    //var startDX = 0, startDY = 0, endOffsetDX = 0, endOffsetDY = 0;//拖拽是的位子坐标
    var cutX = event.clientX;
    var cunY = event.clientY;
    if(treeNodes[0].status=="1"){
        treeNodeGlb.isDragPlay = false;
        return;
    }

    if(oVeiwNumber == 1){
        if(cutX > dragPlace.startDX && cutX < dragPlace.endDX) {
            if (cunY > dragPlace.startDY && cunY < dragPlace.endDY) {
                playInOcx(0,treeNodes[0]);
            }
        }
    }
    if(oVeiwNumber == 4){
        //左上，第一个窗口坐标范围
        if(cutX > dragPlace.startDX && cutX < dragPlace.centDX){
            if(cunY > dragPlace.startDY && cunY< dragPlace.centDY){
                playInOcx(0,treeNodes[0]);
            }
        }
        //右上，第二个窗口坐标范围
        if(cutX > dragPlace.centDX && cutX < dragPlace.endDX){
            if(cunY > dragPlace.startDY && cunY< dragPlace.centDY){
                playInOcx(2,treeNodes[0]);
            }
        }
        //左上，第三个窗口坐标范围
        if(cutX > dragPlace.startDX && cutX < dragPlace.centDX){
            if(cunY > dragPlace.centDY && cunY < dragPlace.endDY){
                playInOcx(1,treeNodes[0]);
            }
        }
        //右下，第四个窗口坐标范围
        if(cutX > dragPlace.centDX && cutX < dragPlace.endDX){
            if(cunY > dragPlace.centDY && cunY< dragPlace.endDY){
                playInOcx(3,treeNodes[0]);
            }
        }
    }
}
function playInOcx(mCntNumber,mNode){
    //alert(mCntNumber);
    var defaultP = mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
    mediaplayerobj.ITMS_CCTV_StopPreview(mCntNumber);
    mediaplayerobj.ITMS_CCTV_Preview(mCntNumber, mNode.channel, 6000, "", 0, "");
    //$( "body").css("cursor","default");
}

function showRMenu(x, y,treeNode,btnRightStr) {
    alertMy("showRMenu");
    //treeObj
    //$("#treedevice_50").offset().top
    var changePlaceTag=$(window).height()-y;
    //如果y大于的位子在距离底部的距离小于60px的时候y值重新赋值；
    var changePlaceTagY=$(window).height()-y;
    var changePlaceTagX=250-x;
    if(changePlaceTagY<=120){
        dY=120-changePlaceTagY;
        y=y-dY-10;
    };
    if(changePlaceTagX<=107){
        //设为固定的
        x=110;
    };
	$("#divTreeRMenu").css({"top":y+"px", "left":(x+10)+"px", "display":"block"});
    alertMy("x:"+x+" y:"+y);
	var  sbbh=treeNode.sbbh;
    alertMy("oUserId 用户编号："+oUserId);
    alertMy("所加入的设备播放编号是："+treeNode.channel);
    alertMy("所加入的设备编号是："+treeNode.sbbh);
    //如果是空的话，即返回请求数据失败，无权操作
    if(btnRightStr == ""){
        alertMy("无权操作");
        //如果有权限的话才进行右键设置，否则弹出一个对话框提示无此权限
        var d = dialog({
        	id:"winTip",
        	align:"left bottom",
        	padding:0,
        	width:200,
        	height:50,
            content: '当前状态您无权操作此设备播放、锁定、解锁！',
            quickClose: true// 点击空白处快速关闭
        });
        d.show($("#lblPosition")[0]);
        $("#divTreeRMenu").hide(); //隐藏菜单
        setTimeout(function () {
            d.close().remove();
        }, 2000);
        return ;
    }else{
        $("#divTreeRMenu").show();
        $("#ulTreeRMenu li").hide();
        $(btnRightStr).show();
    }
}
//右键回调函数

//选中后样式的变化
function getFontCss(treeId, treeNode) {
    return (treeNode.highlight) ? {color: "#A60000", "font-weight": "bold"} : {
        color: "#333",
        "font-weight": "normal"
    };
}
function myDialog( id, widStr, heiStr, titStr, eventStr){
    var d = dialog({
        id:"winTip",
        align:"left bottom",
        padding:0,
        width:widStr,
        height:heiStr,
        content:titStr,
        quickClose: true// 点击空白处快速关闭
    });
    //找到当前的节点
    d.show($("#"+id)[0]);
    setTimeout(function () {
        d.close().remove();
    }, 1000);
}



