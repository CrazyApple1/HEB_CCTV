/**
 * Created by Administrator on 2016/4/4.
 */
var treeObj;
var selectedNode;
$(document).ready(function () {
    //获取当前用户
    oUserId=queryStringByName("userId");
    //获取左侧要显示的列表信息
    tab=queryStringByName("tab");
    //是否隐藏头部
    closeHead=queryStringByName("closeHead");
    mediaplayerobj = document.getElementById("mediaplayerid");
    //查询用户权限
    queryRights();
    //更新ocx控件
    updateVersion();
    $(window).on("resize", function (){
    	//树容器的高度随窗口自适应 
    	var treeHeight = $(window).height()-125;
    	$("#divTreeContainer").height(treeHeight);
        $("#divLiContainer").height(treeHeight);
//        setTimeout(bodyResize(),100);	
        bodyResize();
        initOcxDrag();
        $("#turnPlayList").height(treeHeight);
    });
    $(window).resize();
    
    //布局部分,树的建立应当在最前面，以避免你初始化数据没地方放的情况
    myLayout = $('body').layout({
        west__size: 250
        , east__size: 250
        , north__size: 50
        , closable: true	// pane can open & close
        , resizable: true	// when open, pane can be resized
        , slidable: true	// when closed, pane can 'slide' open over other panes - closes on 		   			                                                   mouse-out
        , livePaneResizing: true
        , onresize: bodyResize    //尺寸改变时更改控件大小
//        ,north__initClosed:true
    });
    
    $(document).bind("contextmenu",function(e){
    	$("#divTreeRMenu").hide(); //隐藏菜单
        return false;
    });
    $("#imgDebug").dblclick(function(){
       $("#lblInfo").toggle();
    });
    $(document).bind("click",function(e){
    	$("#divTreeRMenu").hide(); //隐藏菜单
    });
    //刷新树节点
    $("#btnRefreshTree").click(function(){
    	alertMy("刷新树节点");
    	$(this).attr("src",iconPath_loading); //开始加载
//    	treeObj.reAsyncChildNodes(null, "refresh"); //强制异步刷新树数据
    	loadTreeData(oUserId); //开始加载树
    });
    //点击锁定列表显示刷新按钮
    $("#tabsleft2").click(function(){
    	$("#btnRefreshTree1").show();
    	$("#tabs-2").show();
    	$("#tabs-3").hide();
    	$("#turnplayTime").hide();
    	$("#saveWin").hide();
    	initBreakdownOL();
    });
    $("#tabsleft1").click(function(){
    	$("#btnRefreshTree1").hide();
    	$("#turnplayTime").hide();
    	$("#saveWin").hide();
       	loadTreeData(oUserId);
    });
    $("#tabsleft3").click(function(){
    	$("#btnRefreshTree1").hide();
    	$("#tabs-2").hide();
    	$("#tabs-3").show();
    	$("#turnplayTime").show();
    	$("#saveWin").hide();
    	loadTreeData(oUserId);
    	//cc 2016-12-29 解决tab切换之后视频轮播下面的列表为空的问题
    	var selPlayListVal = $("#selPlayList option:selected").val();
        if(selPlayListVal == ""){
            devicepollinit(); //如果是选择初始化，则重新加载下拉框列表
        }
        loadSelPlayList(); //加载预览列表
    })
    //手动刷新锁定设备列表
    $("#btnRefreshTree1").click(function(){
    	$(this).attr("src",iconPath_loading); //开始加载
    	//loadTreeData(oUserId);
    	setTimeout(function(){
    		initBreakdownOL();
    		$("#btnRefreshTree1").attr("src","image/tree/refresh.gif");
    	},1000);
    });
    //锁定列表中锁定解锁
    $( "#liLockSelf" ).click(function(){
        var mUrl = lockProps.urlRmv;
        var param = "userId=" + oUserId + "&sbbh=" + mSbbh;
        $.ajax({
            type: "get",
            async: false,
            data: param,
            url: mUrl,
            dataType: "jsonp",
            jsonpCallback:"olBKRmenuCallback"
        });
    });
    //锁定列表中锁定解锁，隐藏菜单
    $( "body" ).click(function(){
        $( "#divLock").css("display", "none");
    });
    //查看树节点详情
    $("#liTreeView").on("click",function(){
    	var sbbh = selectedNode.sbbh; //设备编号
    	var name = selectedNode.name; //设备名称
    	var syr = selectedNode.syr; //使用人
    	var channel = selectedNode.channel; //通道号
    	var kssj = selectedNode.kssj; //锁控开始时间
    	var bksd = selectedNode.bksd; //布控时段（毫秒数）
    	var icon = selectedNode.icon; //图标
    	var titleStr = '"'+name+'"详情';
    	var htmlStr = "";
    	htmlStr += "设备编号：" + sbbh + "<br/>";
    	htmlStr += "设备名称：<br/>" + "<img src='"+icon+"'/>" + name + "<br/>";    	
    	htmlStr += "通道号：<br/>" + channel + "<br/>";
    	if(syr != undefined && syr != null && syr != ''){
    		htmlStr += "<hr /><b>锁控信息</b><br/>";
	    	htmlStr += "锁控人：" + syr + "<br/>";
	    	htmlStr += "时间：" + kssj + "<br/>";
	    	htmlStr += "时长（秒）：" + bksd/1000.0 + "<br/>";
	    }
        var d = dialog({
            id:'winTit',//添加单例的窗口
            width:200,
            title: titleStr,
            content:htmlStr,
            okValue: '确定',
            ok: function () {},
            padding: 0,
            skin: 'min-dialog tips'
        });
        //Modal其他的不可被点击
        d.show(document.getElementById('lblPosition'));
    });
    $("#liTreeAdd").on("click",function(){
        alertMy("liTreeAdd"+"click");
        var sksd=0;
        //产生对话框添加锁定时间
        var d = dialog({
            id:'winTit',//添加单例的窗口
            title: '请输入锁定时间：',
            content:'<select id="selectTime" style="width:150px;font-size:12px;"><option value="60000">1分钟</option><option value="300000">5分钟</option> <option value="900000">15分钟</option> <option value="1800000">30分钟</option> <option value="3600000">1个小时</option> <option value="21600000">6个小时</option> <option value="86400000">一天</option> <option value="604800000">一周</option> <option value="18144000000">一个月</option></select>',
            //'<input id="input_time" style="width:100px;"placeholder="分钟" autofocus value="1"/>',
            okValue: '确定',
            ok: function () {
                this.title('提交中…');
                //获取锁定的时间
                var sksd=$("#selectTime option:selected").val();
                //已经转换成毫秒进行传给后台
                alertMy(sksd+"ms");
                var treeNode = selectedNode;
                if(treeNode != null) {
                    var sbbh = treeNode.sbbh;
                    var geturl = lockProps.urlAdd;
                    var param = "userId=" + oUserId + "&sbbh=" + sbbh + "&sksd=" + sksd;
                    //网络请求
                    $.ajax({
                        type: "GET",
                        url: geturl,
                        contentType: "application/json;charset=utf-8",
                        processData: false,
                        async: true,
                        data: param,
                        dataType: "jsonp",
                        success: function (data) {
                        	try{
                        		//更换图标
                        		treeNode.icon=iconPath_lock_self;
                            	//treeObj.refresh();
                                treeObj.updateNode(treeNode);
                        	}catch(e){
                        		
                        	}
                            alertMy("树的右键 添加 锁定设定成功");
                            $("#divTreeRMenu").hide();
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alertMy("请求失败后的状态:" + textStatus);
                            $("#divTreeRMenu").hide();
                        }
                    });
                    this.remove();
                }
            },
            padding: 0,
            skin: 'min-dialog tips',
            cancelValue: '取消',
            cancel: function () {}
        });
        //Modal其他的不可被点击
        d.show(document.getElementById('lblPosition'));
    });
    $("#liTreeRemove").on("click",function(){
        alertMy("liTreeRemove"+"click");
        var treeNode = selectedNode;
        if(treeNode != null) {
            var geturl = lockProps.urlRmv;
            var param = "userId=" + oUserId + "&sbbh=" + treeNode.sbbh;
            $.ajax({
                type: "GET",
                url: geturl,
                contentType: "application/json;charset=utf-8",
                processData: false,
                async: false,
                data: param,
                dataType: "jsonp",
                success: function (data) {
                    data = data.result;
                    alertMy("树的右键 删除 锁定设定成功");
                    //更新图标
                    if(treeNode.status == "1"){
                        treeNode.icon = iconPath_error;
                    }
                    if(treeNode.status == "0"){
                        treeNode.icon = iconPath_unlock;
                    }
                	//treeObj.refresh();
                    treeObj.updateNode(treeNode);
                    $("#divTreeRMenu").hide();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alertMy("请求失败后的状态:" + textStatus);
                    $("#divTreeRMenu").hide();
                }
            });
        }
    });
    
    $(".imagesetscreen").dblclick(function(){
        var d = dialog({
            id:"winTipDiaScreen",
            align:"right bottom",
            padding:0,
            width:120,
            height:40,
            content: '请单击!&nbsp;&nbsp;避免重复分屏。',
            quickClose: true// 点击空白处快速关闭
        });
        //其位子在label后面，轮播的提示框，避免重复点击
        d.show($("#positionDiaScreen")[0]);
        setTimeout(function () {
            d.close().remove();
        }, 2000);
    });

    $("#lblUserId").text(oUserId);
    //对unloading函数进行监听事件
    $("#tabsleft").tabs({active: 0});


    //网页关闭的时候释放ocx组件的方法,不应当用unload方法
    $(window).on("beforeunload", function () {
        alertMy("unload");
        try {
            mediaplayerobj.ITMS_CCTV_StopPreview(0);
        }
        catch (e) {
            alertMy("停止失败");
        }
        try {
            mediaplayerobj.ITMS_CCTV_MediaUnRegister();
        }
        catch (e) {
            alertMy("注销失败");
        }
        try {
            mediaplayerobj.ITMS_CCTV_FreeScreen();
        }
        catch (e) {
            alertMy("释放失败");
        }
        try {
            mediaplayerobj.ITMS_CCTV_MediaFree();
        }
        catch (e) {
            alertMy("释放失败");
        }

        alertMy("离开视频监控平台");
    });
   
    //对图片的点击事件，设置轮播的分屏
    $(".imagesetscreen").on("click", function () {
        changeImg(this);

    });
    //界面的显示效果的初始化
    initView();
    //视频控件初始化
    alertMy("视频控件初始化");
    mediaplayinit();

    alertMy("视频控件初始化 end");

    //视频设备树状结构初始化
    deviceinit();
    treeObj=$.fn.zTree.getZTreeObj("treedevice");
    //alertMy("执行到了3");

    //轮播列表初始化；点击切换分屏的话，需要重新选中轮播的方案
    devicepollinit();

    //云台监听
    pTziinit();

    //预置位的监听
    preSetinit();

    //ocx响应拖拽事件
    initOcxDrag()

    //让默认的对话框不可见
    $("#dialogDiv").hide();

    //服务端监听
    // var es = new EventSource(serversenturl);
    // es.addEventListener("message", severlisten, false);
    // 初始化tree

    //监听服务端消息，主要用于视频权限控制（分层控制）
    function severlisten(e) {
        //监听到剥夺控制权限后，对相应的视频进行停止播放，轮播及视频树形菜单从新请求；
        //如果是轮播状态则停止播放并从相应的轮播列表里清除；
        //document.getElementById("x").innerHTML += "\n" + e.data;
    }

    /**********控件尺寸改变时调用更改控件尺寸：一个是body.resize,一个是layout改变尺寸时***********/
    function bodyResize() {
        try{
            var width = $(".ui-layout-center").width();
            var height = $(".ui-layout-center").height();
            mediaplayerobj.ITMS_CCTV_ReSizeVideoDlg(0, 0, width, height);
        }catch(e){};

    }

    //视频控件的初始化
    function mediaplayinit() {
        try {
            alertMy("进入了mediaplayinit");

            mediaplayerobj.ITMS_CCTV_MediaInit(ocx_userid, "", ocx_clientport, ocx_userpwd, ocx_serverip, ocx_serverid, ocx_serverport);

            ////默认为四个分屏居中显示，显示主几个主要的地点的监控
            //mediaplayerobj.ITMS_CCTV_ScreenSwitch(1, 2);
            //初始化屏幕数量的标记
            oVeiwNumber = 1;
            //向SIp服务器注册
            mediaplayerobj.ITMS_CCTV_MediaRegister(1800);
            //每次初始化的时候重新测量下屏幕设置参数
            bodyResize();
            //主动触发一分屏的情况11010000004000000001
            $("#imagesetscreen1").click();
            //mediaplayerobj.ITMS_CCTV_Preview(1, "11010000001300000002",6000, "", 0, "");
            //测试的通道号
            //mediaplayerobj.ITMS_CCTV_RegisterAndPreview(1800, 0,"11010000001310000001", 6000, "",0, "");
            /**下边需要完成视频控件的初始化*/
            //var nViewDlg = axMediaPlayerVideo.ITMS_CCTV_GetCurSelectVideoDlg();
        } catch (e) {
            alertMy("视频控件初始化异常：" + e);
        }
    }

    /****************播放视频函数*****************/
    function playview(deviceid, view) {
        portplay = portplay + 1;
        var res = mediaplayerobj.ITMS_CCTV_Preview(view, deviceid, portplay, "", 0, "");
    }

    function devicepollinit() {
        var viewn = 0;
        //添加select的选项
        var str = "<option value='' lbl='-- 请选择轮播列表 --'>-- 请选择轮播列表 --</option>";
        var tabBtn = $("btnStartPlayList");
        //userId=013292&operation=getfamc
        //&lbbh=1&operation=getdevice
        var paramObj = "userid="+oUserId+"&operation=getfamc";
        //alertMy("进入了devicepollinit");
        $.ajax({
            type: "GET",
            url: urlDevicePoll,
            contentType: "application/json;charset=utf-8",
            processData: false,
            async: true,
            data: paramObj,
            dataType: "jsonp",
            success: function (data) {
                data = data.result;
                $.each(data, function (index, jsValue) {
                    //播放列表
                	var item = data[index];
                	var lbmc = item.lbmc;
                	var lbbh = item.lbbh;
                    str = str + "<option value='"+lbbh+"' lbl='" + lbmc + "'>" + lbmc + "</option>";
                    $('#selPlayList').html(str);
                });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alertMy("轮播方案失败后的状态:" + textStatus);
            }
        });
        //轮播下拉框 change 事件
    }

    function deviceinit() {

        $.fn.zTree.init($("#treedevice"), treeSetting, zNodes);
        //加载树数据
        loadTreeData(oUserId);

        //比较树节点对象，获取查找符合条件的数据
        function fnTreeFilter(node){
        	var bool = false;
        	bool = !node.isParent;
        	return bool;
        }
        //查找设备
        $("#btnSearch").click(function () {
            var searchKey; //搜索的关键字
            //取得input的模糊匹配的值
            searchKey = $("#txtSearch").val();
            treeObj.expandAll(false); //折叠所有节点
            var leafNodes = treeObj.getNodesByFilter(fnTreeFilter); // 查找节点集合
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
            //刷新树渲染
            treeObj.refresh();
        });
        //添加input的回车键监听
        initBreakdownOL();

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
// 
    //轮播下拉框 change 事件
    $("#selPlayList").on("change",function(){
        alertMy("加载 options");
        var selPlayListVal = $("#selPlayList option:selected").val();
        if(selPlayListVal == ""){
            devicepollinit(); //如果是选择初始化，则重新加载下拉框列表
        }
        loadSelPlayList(); //加载预览列表
    });
    
    //刷新方案列表
    $("#btnRefreshPlayList").on("click",function(){
        devicepollinit(); //刷新列表
        $("#turnPlayList").html(""); //清理列表
    });
//    //鼠标移动上去
//    $("#btnCloseVedio").on("mouseover",function(){
//      try{
//          //先停止，后播放
//          var curIndex=mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
//          if(curIndex != -1){
//              $("#btnCloseVedio").text("关闭选中的视频 "+(curIndex+1));
//          }else{
//              $("#btnCloseVedio").text("未知选中视频");
//          }
//      }catch(e){
//          $("#btnCloseVedio").text("未知选中视频");
//      }
//    });
    
    //关闭视频窗口
    $("#btnCloseVedio").on("click",function(){
        //设置提示窗口
        var btnCloseVedio = document.getElementById('btnCloseVedio');
        var winColose = {
            id:'winCloseVedio',//添加单例的窗口
            width:150,
            content:"",
            quickClose: true,
            padding: 0,
            skin: 'min-dialog tips'
        };
        var dlg = null; //弹出窗口
        try{
            //先停止，后播放
            var curIndex=mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
            alertMy("准备关闭视频："+curIndex);
            if(curIndex == -1){
                return;
            }
//          winColose.content = "正在关闭视频 "+(curIndex+1)+"……";
//          dlg = dialog(winColose);
//          dlg.show(btnCloseVedio);
//          dlg.close().remove();
//          setTimeout(function () {
//              dlg.close().remove();
//            }, 1000);
            mediaplayerobj.ITMS_CCTV_StopPreview(curIndex);
          
            winColose.content = "完成关闭视频 "+(curIndex+1)+"";
            dlg = dialog(winColose);
            dlg.show(btnCloseVedio);
            setTimeout(function () {
                dlg.close().remove();
            }, 1000);
        }catch(e){
            winColose.content = "关闭视频异常："+e.message;
            dlg = dialog(winColose);
            dlg.show(btnCloseVedio);
            setTimeout(function () {
                dlg.close().remove();
            }, 1000);
        }
    });
    
    $("#btnCloseVedio").button();




    //拖拽获取ocx位子
    function initOcxDrag(){
        dragPlace.startDX = $( "#ocxContain" ).offset().left;
        dragPlace.startDY = $( "#ocxContain" ).offset().top;
        var endOffsetDX = $( "#ocxContain" ).width();
        var endOffsetDY = $( "#ocxContain" ).height();
        dragPlace.centDX = dragPlace.startDX + endOffsetDX/2;
        dragPlace.centDY = dragPlace.startDY+ endOffsetDY/2;
        dragPlace.endDX = dragPlace.startDX + endOffsetDX;
        dragPlace.endDY = dragPlace.startDY + endOffsetDY;
    }
// 
    function zTreeOnClick(event, treeId, treeNode) {
        alert(treeNode.tId + ", " + treeNode.name);
    };

    //设备列表返回结果
    function deviceinitcallback(result) {
        alertMy(result);
        for (var i in result) {

        }
    };

    //改变图片为选中状态
    function changeImg(imgObj) {
        var imgSrcCurrent = imgObj.src;
        //重新初始化树节点的位子的标记
        positionTag = 0;
        //其他的按钮设置一般情况下的图片
        $(".imagesetscreen").each(function () {
            //遍历每一个
            var imgSrc = this.src;
            var indBegin = imgSrc.lastIndexOf("_");
            var indEnd = imgSrc.lastIndexOf(".");
            var urlBegin = imgSrc.substring(0, indBegin + 1);
            var urlEnd = imgSrc.substring(indEnd);
            var normalName = urlBegin + "normal" + urlEnd; //一般情况下的图片
            var pressName = urlBegin + "press" + urlEnd;  //按下去的图片
            //一直遍历遍历到不等的把它变成nomal,遍历到相等的把它变成press
            if (imgSrc != imgSrcCurrent) {
                this.src = normalName;
            } else {
                this.src = pressName;
            }
        });

        var btnId = imgObj.id;
        controlGrid(btnId);  //执行 ocx js 函数
        //alertMy(pressName);
    }
    //控制几分屏
    function controlGrid(btnId) {
        var btnPreName = "imagesetscreen";
        var cnt = btnId.substring(btnPreName.length);
        //执行几分屏代码
        oVeiwNumber = cnt;
        //让正在轮播的视频停止
        //if(oServiceLogicDevicePoll.getDevicelist()!=null||oServiceLogicDevicePoll.getDevicelist().length>0)
        oServiceLogicDevicePoll.close();
        //}
        if(divideScreenTag!=oVeiwNumber){
            //让正在播放的视频停止
            for(var i=0;i<oVeiwNumber;i++){
                mediaplayerobj.ITMS_CCTV_StopPreview(i);
                alertMy("让正在播放的视频停止"+i);
            }
            mediaplayerobj.ITMS_CCTV_ScreenSwitch(oVeiwNumber, 2);
            //将判断屏幕是否变化，置为true,在函数setCurtArr()重置
        }
//        if(!isStartTag){
//            $("#btnStartPlayList").html("开始轮播");
//        }
        divideScreenTag=oVeiwNumber;
        tagIsViewChange=true; //标记清空播放列表
        curentArray=[];//数组置空
    }

    function preSetinit(){
        //ptz:设置为30，其为注册事件；
        //设置预置位，设置预置位的编号是16；调用预置位的编号是17，查询预置位的编号是18，删除预置位的编号是19；
        var ptz=30;
        $( "#liSetPre" ).mouseup(function(){
            //获取选中的屏幕的位子
            var mediaGridNum = mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
            mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(ptz,mediaGridNum, 16);
        });
        //查询历史的预置位
        $( "#liCall").hover(function(){
            var mediaGridNum = mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
            var strPreHistory=mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(ptz,mediaGridNum, 18);
            //XXX格式转换
            //alert("ppp");
            //var liStr="<li> 调用历史1</li> <li>调用历史2</li> <li>调用历史3</li>";
            //$( "#ulCall" ).html(liStr);
        });
        //调用历史的预置位
        $( "#liQuery").hover(function(){
            var mediaGridNum = mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
            var strPreHistory=mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(ptz,mediaGridNum, 18);
            //XXX格式转换
            //var liStr="<li>历史111</li> <li>历史222</li> <li>历史333</li>";
            //$( "#ulQuery" ).html(liStr);
            $( "#ulQuery li" ).mouseup(function(){
               var strSure = $(this).attr("strSure");
                //字符串调用为预置位的方法
                mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(ptz,mediaGridNum, 17);
                //XXX调用
            });
        });
        //删除历史的预置位
        $( "#liDel").hover(function(){
            var mediaGridNum = mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
            var strPreHistory=mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(ptz,mediaGridNum, 18);
            //XXX格式转换，显示
            var liStr="<li>调用历史111</li> <li>调用历史222</li> <li>调用历史333</li>";
            $( "#ulDel li" ).mouseup(function(){
                var strSure = $(this).attr("strSure");
                //字符串删除预置位的方法
                mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(ptz,mediaGridNum, 19);
                //XXX调用
            });
        });
        $( ".selector" ).menu( "refresh" );
    };
    //更新版本
    function updateVersion(){
        try{
            //通过方法获得当前控件的版本，和服务器上更新的版本号对比
            var currentVersionStr=mediaplayerobj.ITMS_28181_GetVersion();
            //alert(currentVersionStr);
            if(ocx_version!==currentVersionStr){
                $("#mediaplayerid").hide();
                $("#spanOcxTag").html("提示：您当前的媒体播放器已经更新，请运行新的OCX媒体播放器控件。");
                //主动提示运行ocx控件
                //window.location.href="webEasy/setup.exe";
                ocx_version=currentVersionStr;
            }
        }catch(e){
        }
    };
    //对轮播时间的初始化化
    $("#btnCirTime").click(function () {
        var tag = $("#txtSleep").val();
        oSleep = tag*10;//转换成秒，初始化默认为10秒
        playUtil.setSleep(tag);
        //提示的对话框
        var d = dialog({
            id:"winTipDiaScreen",
            align:"right bottom",
            padding:0,
            width:120,
            height:40,
            content: '重新设置轮询时间为'+tag+'秒',
            quickClose: true// 点击空白处快速关闭
        });
        //其位子在label后面，轮播的提示框，避免重复点击
        d.show($("#positionDiaScreen")[0]);
        setTimeout(function () {
            d.close().remove();
        }, 2000);
        //调用设置轮播的函数
    });
    //对大小 ，光圈、焦距的初始化点击监听
    pertureaAndFocusClick();
    //对预置位的初始化监听
    $("#btnPreset").click(function () {
        var tag = $("#selectPreset").find("option:selected").text();
        //设置预置位
        positionPreSet=tag;
        var mediaGridNum = mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
        mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(1,mediaGridNum, 0);
    });
    //初始化轮播工具类，默认几分屏
    playUtil = new PlayListUtil(mediaplayerobj,"btnStartPlayList","selPlayList","turnPlayList",1,"txtSleep");

    //添加窗口快捷键
    //判断事件源是不是表单元素（可输入的表单元素）
    function isNotInput(event){
        var flag = true;
        var eventTargetType = event.target.type;
        var iptTypes = ["textarea","input","select-one"];
        var len = iptTypes.length;
        for(var i = 0;i < len; i ++){
            if(iptTypes[i] == eventTargetType){
                flag = false;
                break;
            }
        }
        return flag;
    };

    function initView(){
        //添加光圈的hover事件
        $("img[id^='imgLeft']" ).hover(function(){
            $(this).attr("src","image/subtract_blue.png");
        },function(){
            $(this).attr("src","image/subtract.png");
        });

        $( "img[id^='imgRight']" ).hover(function(){
            $(this).attr("src","image/add_blue.png");
        },function(){
            $(this).attr("src","image/add.png");
        });
        //树右键点击打开新界面
        $("#liTreeNewWeb").click(function(){
            var msbbh=sbbhTreeNewWeb;
            var mchannel=channelTreeNewWeb;
            var mcctvdevicename=cctvdevicenameTreeNewWeb;
            var url = "singleScreenControl.html?oUserId="+oUserId+"&sbbh="+msbbh+"&channel="+mchannel+"&cctvdevicename="+mcctvdevicename;
            window.open(url);
            $("#divTreeRMenu").hide();
        });
        //树右键点击设备状态信息录入
        $("#liTreeState").click(function(){
            $("#divTreeRMenu").hide();
            //2.否则，提示无权播放当前已经被其他人锁定了，无权播放控制
            //var htmlStr = "<img src='"+treeNode.icon+"'/>"+treeNode.name;
            //htmlStr += "，已经被 " + lockedArr[0].syr + " 锁控，您无权进行操作！";
            var htmlStr="<select><option  value=''>设备无信号</option><option value=''>设备无视频</option><option  value=''>信号异常</option><option  value=''>前端污损</option></select>"
            var d = dialog({
                id:"XTipTree",
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
            d.show($( "#lblPosition" )[0]);
        });
    };

    $(document).keyup(function(event){
    	if(!rights4Cctv.enableAlert){
    		//如果没有权限则按键录入警情没有反应
    		return;
    	}
        if(playUtil!=null && isNotInput(event) && playUtil.playing){
            var key = String.fromCharCode(event.keyCode);
            var ind = parseInt(key)-1;
            try{
                var screenCnt = playUtil.channelArr.length; //分屏数
                if(ind >= 0 && ind < screenCnt){
                    var channelInfo = playUtil.channelArr[ind];
                    var sbbh = channelInfo.sbbh;
                    var channel = channelInfo.channel;
                    var cctvdevicename = channelInfo.cctvdevicename;
                    var url = "singleScreenControl.html?oUserId="+oUserId+"&sbbh="+sbbh+"&channel="+channel+"&cctvdevicename="+cctvdevicename;
                    window.open(url);
                }
            }catch(e){

            }

        }
    });
    $("#btnStartPlayList").click(function(){
		playUtil.autoPlay();
	});
    //分屏的时候重新改变传入的屏幕数
	$(".imagesetscreen").click(function(){
		playUtil.setPageSize(parseInt($(this).attr("cnt")));
		$("#btnRefreshPlayList").show(); //cc 2017-01-20  设置切换分屏之后，显示刷新按钮
	});
	//监听选择框的变化
	$("#selPlayList").on("change",function(){
		playUtil.changePlayList();
		//cc 2017-01-17 重新选择方案后，停止轮播  bug420
		playUtil.autoStop();
		$("#btnRefreshPlayList").show(); //显示刷新按钮
	});
    /**
     * 预置位的ul样式的修改；
     */
    $(function() {
        //树右键的css设置
        $( "#menu" ).menu();
        $( "#menu").css( "border" , "1px solid #7C7C7C").css("border-radius","2px");
        $( ".ulInBorder").css( "border" , "1px solid #7C7C7C" );
        /*关闭指定位置视频 */
        $( "#btnCloseVideo").button();
        $( "#btnCloseVideo").click(function(){
            try{
                var curViewNumb=mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
                if(curViewNumb == -1 ){
                	alert("请选择要关闭的视频！"); 
                }else{
                	mediaplayerobj.ITMS_CCTV_StopPreview(curViewNumb);
                }
            }catch(e){
            }
        });
        /*设置预置位  17  */
        /*调用预置位  18  */
        /*查询预置位  19  */
        /*删除预置位  20  */
        $( "#radioPreSet" ).buttonset();
        $( "#radioPreSet label" ).css("font-size", "1.0em");
        $( "#radioPreCall" ).buttonset();
        $( "#radioPreCall label" ).css("font-size", "1.0em");
        //将设置预置位和调用预置位封装
        setCall();
    });
    //截图功能
    
    var myDateTimes = new Date();
	var myYears = myDateTimes.getFullYear();    //获取完整的年份(4位,1970-????)
	var myMonths = myDateTimes.getMonth()+1;       //获取当前月份(0-11,0代表1月)
	if(myMonths < 10){
		myMonths = "0" +  myMonths;
	}else{
		myMonths =  myMonths;
	}
	var myDates = myDateTimes.getDate();        //获取当前日(1-31)
	var myHours = myDateTimes.getHours();       //获取当前小时数(0-23)
	var myMinutes = myDateTimes.getMinutes();     //获取当前分钟数(0-59)
	var mySeconds = myDateTimes.getSeconds();     //获取当前秒数(0-59)
	
	var myPicName = myYears+ "" + myMonths+ ""  + myDates+ ""  + myHours+ ""  + myMinutes+ ""  + mySeconds ;
//	存放图片位置 
	var commonUrl = "I:\\videoImage\\";
//  预留参数
    var str_heb="heb";

    //点击截图

    $("#getPicShot").click(function(){
    	$("#saveWin").show();
    	var myDateTimes = new Date();
    	var myYears = myDateTimes.getFullYear();    //获取完整的年份(4位,1970-????)
    	var myMonths = myDateTimes.getMonth()+1;       //获取当前月份(0-11,0代表1月)
    	if(myMonths < 10){
    		myMonths = "0" +  myMonths;
    	}else{
    		myMonths =  myMonths;
    	}
    	var myDates = myDateTimes.getDate();        //获取当前日(1-31)
    	var myHours = myDateTimes.getHours();       //获取当前小时数(0-23)
    	var myMinutes = myDateTimes.getMinutes();     //获取当前分钟数(0-59)
    	var mySeconds = myDateTimes.getSeconds();     //获取当前秒数(0-59)
//    保存的图片名称
    	var myPicName = myYears+ "" + myMonths+ ""  + myDates+ ""  + myHours+ ""  + myMinutes+ ""  + mySeconds ;
    		$("#inputUrl").val(commonUrl + myPicName + ".jpg");
    	})
    	
    	//    获取当前点击的屏幕通道号
    		
    		
    	$("#cancel_Btn").click(function(){
    		try{
    			$("#saveWin").hide();
        		$("#inputUrl").val("");
    		}catch(e){
    			alert("异常" +e);
    		}
    		
    	})
    	
    	
    	$("#save_Btn").click(function(){
    		try{
    			var myDateTimes = new Date();
    	    	var myYears = myDateTimes.getFullYear();    //获取完整的年份(4位,1970-????)
    	    	var myMonths = myDateTimes.getMonth()+1;       //获取当前月份(0-11,0代表1月)
    	    	if(myMonths < 10){
    	    		myMonths = "0" +  myMonths;
    	    	}else{
    	    		myMonths =  myMonths;
    	    	}
    	    	var myDates = myDateTimes.getDate();        //获取当前日(1-31)
    	    	var myHours = myDateTimes.getHours();       //获取当前小时数(0-23)
    	    	var myMinutes = myDateTimes.getMinutes();     //获取当前分钟数(0-59)
    	    	var mySeconds = myDateTimes.getSeconds();     //获取当前秒数(0-59)
    	    	//    	    保存的图片名称
    	    	var myPicName = myYears+ "" + myMonths+ ""  + myDates+ ""  + myHours+ ""  + myMinutes+ ""  + mySeconds ;
    	    		$("#inputUrl").val(commonUrl + myPicName + ".jpg");
    			var selectedNumber = mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
    			$("#saveWin").hide();
    			//mediaplayerobj.ITMS_CCTV_K_SDK_GetSnapShot(commonUrl,selectedNumber, 1920, 1080, myPicName , str_heb);
    		
    			var result_Shot = mediaplayerobj.ITMS_CCTV_K_SDK_GetSnapShot(commonUrl,selectedNumber, 1920, 1080, myPicName , str_heb);
    			if(result_Shot == 0){
    				setTimeout(function(){
        				alert("截图成功！");
        			},100)
    			}
    		}catch(e){
    			alert("异常" +e);
    	}
    })
    	
    	
    //根据传入的参数确定页面显示内容
    if(tab=="splb" && closeHead){
		$("#tabs-1").hide();
		$("#tabs-2").hide();
		$("#tabsleft1").hide();
		$("#tabsleft2").hide();
		$("#tabsleft3").css("width","100%");
		$("#btnRefreshTree1").hide();
    	$("#tabs-2").hide();
    	$("#tabs-3").show();
    	$("#turnplayTime").show();
    	$("#saveWin").hide();
    	loadTreeData(oUserId);
    	$("div[class~='ui-layout-toggler-north']").removeClass("ui-layout-toggler-open ui-layout-toggler-north-open").addClass("ui-layout-toggler-closed ui-layout-toggler-north-closed")
	}
    
    //初始化之后给页面添加键盘监听事件
	document.onkeyup=keyEnter;
});

    function pertureaAndFocusClick(){
        //光圈-
        $("img[id^='imgLeft']").on("mousedown",function(){
            var ptz=$(this).attr("ptz");
            ptz=Number(ptz);
            //alert(ptz+typeof(ptz));
            var mediaGridNum = mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
            mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(ptz,mediaGridNum, 0);
            alertMy("开始光圈onmousedownPTZ --"+ptz);

        });
        $("img[id^='imgLeft']").on("mouseup",function(){
            var mediaGridNum = mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
            mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(6,mediaGridNum, 0);
            alertMy("停止光圈onmousedownPTZ --");
        });
        //光圈+
        $("img[id^='imgRight']").on("mousedown",function(){
            var ptz=$(this).attr("ptz");
            ptz=Number(ptz);
            //alert(ptz);
            var mediaGridNum = mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
            mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(ptz,mediaGridNum, 0);
            alertMy("开始光圈onmousedownPTZ ++"+ptz);
        });
        $("img[id^='imgRight']").on("mouseup",function(){
            var mediaGridNum = mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
            mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(6,mediaGridNum, 0);
            alertMy("结束光圈onmousedownPTZ ++");
        });
    };
    //设备被他人锁定时移除绑定事件
    function removePertureaAndFocusClick(){
    	 //光圈-
        $("img[id^='imgLeft']").off("mousedown");
        $("img[id^='imgLeft']").off("mouseup");
        //光圈+
        $("img[id^='imgRight']").off("mousedown");
        $("img[id^='imgRight']").off("mouseup");
    }


	//ptz图片效果的监听
    function pTziinit() {
        $("image[id^='PTZ']").on("mousedown", function () {
            var ptz = $(this).attr("ptz");
            onmousedownPTZ(ptz);
            alertMy("开始云台onmousedownPTZ"+ptz);
        });

        $("image[id^='PTZ']").on("mouseup", function () {
            alertMy("up");
            //var ptz = $(this).attr("ptz");
            alertMy("停止云台onmouseupPTZ");
            onmouseupPTZ();
        });

    }
    //移除ptz图片效果的监听
    function removePTziinit() {
        $("image[id^='PTZ']").off("mousedown");

        $("image[id^='PTZ']").off("mouseup");
    }

	
    /***************PTZ控制*************/
    function onmousedownPTZ(ptz) {
        try{
            //获取选中的屏幕的位子
        	var mediaGridNum = mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
            var str = mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(ptz,mediaGridNum, 0);
        }catch(e){
            alertMy("error:"+e);
        }
    }

    /*************结束PTZ控制**************/
    function onmouseupPTZ() {
        try{
            /******应该是用下边的代码获取当前的播放屏幕********/
            //    // pCurselectVideoDlg=ITMS_CCTV_GetCurSelectVideoDlg();
            //pCurselectVideoDlg = 0;
            //var device = devicevidiomap.get(pCurselectVideoDlg);
            var mediaGridNum = mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
            mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(6, mediaGridNum, 0);
        }catch(e){
            alertMy("error:"+e);
        }
    }


      //设置预置位，先删除，后设置
      function setCall(){
      	$( "input[id^='radioPreSet']").bind('click',function(){
            var cntInt = $(this).val();
            var mediaGridNum = mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
            var strPreHistory = mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(20,mediaGridNum, cntInt);//删除
            var strPreHistory = mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(17,mediaGridNum, cntInt);//设置
        });
        //直接调用
        $( "input[id^='radioPreCall']").bind('click',function(){
            var cntInt = $(this).val();
            var mediaGridNum = mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
            //var strPreHistory = mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(19,mediaGridNum, "");//查询
            var strPreHistory = mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(18,mediaGridNum,cntInt);//调用
        });
      }
      

	//禁用设置，调用按钮
      function removeSetCall(){
      	$( "input[id^='radioPreSet']").unbind('click');
        //直接调用
        $( "input[id^='radioPreCall']").unbind('click');
      }
      
	//监听键盘事件  cc 2016-12-21
    function keyDown() {
       var keycode = event.keyCode;
       switch(keycode){
       		case 37:
       			var ptzLeft = $("#PTZleft").attr("ptz");
            	onmousedownPTZ(ptzLeft);
            	alertMy("开始云台onmousedownPTZ"+ptzLeft);
            	break;
            case 38:
       			var ptzTop = $("#PTZtop").attr("ptz");
            	onmousedownPTZ(ptzTop);
            	alertMy("开始云台onmousedownPTZ"+ptzTop);
            	break;
            case 39:
       			var ptzRight = $("#PTZright").attr("ptz");
            	onmousedownPTZ(ptzRight);
            	alertMy("开始云台onmousedownPTZ"+ptzRight);
            	break;
            case 40:
       			var ptzBottom = $("#PTZbelow").attr("ptz");
            	onmousedownPTZ(ptzBottom);
            	alertMy("开始云台onmousedownPTZ"+ptzBottom);
            	break;
       }
    }
    
    function keyUp(){
    	var keycode=event.keyCode;
    	switch(keycode){
    		case 37:
    			alertMy("up");
	            alertMy("停止云台onmouseupPTZ");
	            onmouseupPTZ();
	        case 38:
    			alertMy("up");
	            alertMy("停止云台onmouseupPTZ");
	            onmouseupPTZ();
	        case 39:
    			alertMy("up");
	            alertMy("停止云台onmouseupPTZ");
	            onmouseupPTZ();
	        case 40:
    			alertMy("up");
	            alertMy("停止云台onmouseupPTZ");
	            onmouseupPTZ();
    	}
    }
    
    function keyEnter(){
    	var keycode=event.keyCode;
    	if(keycode==13){
    		playUtil.autoPlay();
    	}
    }
    
    function documentBindKeyEvent(){
    	$(document).bind('keydown',keyDown);
    	$(document).bind('keyup',keyUp);
    }
    
	function documentUnbindKeyEvent(){
    	$(document).unbind('keydown',keyDown);
    	$(document).unbind('keyup',keyUp);
    }