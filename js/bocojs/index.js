/**
 * Created by Administrator on 2016/4/4.
 */
var treeObj;
var selectedNode;
$(document).ready(function () {
    //��ȡ��ǰ�û�
    oUserId=queryStringByName("userId");
    //��ȡ���Ҫ��ʾ���б���Ϣ
    tab=queryStringByName("tab");
    //�Ƿ�����ͷ��
    closeHead=queryStringByName("closeHead");
    mediaplayerobj = document.getElementById("mediaplayerid");
    //��ѯ�û�Ȩ��
    queryRights();
    //����ocx�ؼ�
    updateVersion();
    $(window).on("resize", function (){
    	//�������ĸ߶��洰������Ӧ 
    	var treeHeight = $(window).height()-125;
    	$("#divTreeContainer").height(treeHeight);
        $("#divLiContainer").height(treeHeight);
//        setTimeout(bodyResize(),100);	
        bodyResize();
        initOcxDrag();
        $("#turnPlayList").height(treeHeight);
    });
    $(window).resize();
    
    //���ֲ���,���Ľ���Ӧ������ǰ�棬�Ա������ʼ������û�ط��ŵ����
    myLayout = $('body').layout({
        west__size: 250
        , east__size: 250
        , north__size: 50
        , closable: true	// pane can open & close
        , resizable: true	// when open, pane can be resized
        , slidable: true	// when closed, pane can 'slide' open over other panes - closes on 		   			                                                   mouse-out
        , livePaneResizing: true
        , onresize: bodyResize    //�ߴ�ı�ʱ���Ŀؼ���С
//        ,north__initClosed:true
    });
    
    $(document).bind("contextmenu",function(e){
    	$("#divTreeRMenu").hide(); //���ز˵�
        return false;
    });
    $("#imgDebug").dblclick(function(){
       $("#lblInfo").toggle();
    });
    $(document).bind("click",function(e){
    	$("#divTreeRMenu").hide(); //���ز˵�
    });
    //ˢ�����ڵ�
    $("#btnRefreshTree").click(function(){
    	alertMy("ˢ�����ڵ�");
    	$(this).attr("src",iconPath_loading); //��ʼ����
//    	treeObj.reAsyncChildNodes(null, "refresh"); //ǿ���첽ˢ��������
    	loadTreeData(oUserId); //��ʼ������
    });
    //��������б���ʾˢ�°�ť
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
    	//cc 2016-12-29 ���tab�л�֮����Ƶ�ֲ�������б�Ϊ�յ�����
    	var selPlayListVal = $("#selPlayList option:selected").val();
        if(selPlayListVal == ""){
            devicepollinit(); //�����ѡ���ʼ���������¼����������б�
        }
        loadSelPlayList(); //����Ԥ���б�
    })
    //�ֶ�ˢ�������豸�б�
    $("#btnRefreshTree1").click(function(){
    	$(this).attr("src",iconPath_loading); //��ʼ����
    	//loadTreeData(oUserId);
    	setTimeout(function(){
    		initBreakdownOL();
    		$("#btnRefreshTree1").attr("src","image/tree/refresh.gif");
    	},1000);
    });
    //�����б�����������
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
    //�����б����������������ز˵�
    $( "body" ).click(function(){
        $( "#divLock").css("display", "none");
    });
    //�鿴���ڵ�����
    $("#liTreeView").on("click",function(){
    	var sbbh = selectedNode.sbbh; //�豸���
    	var name = selectedNode.name; //�豸����
    	var syr = selectedNode.syr; //ʹ����
    	var channel = selectedNode.channel; //ͨ����
    	var kssj = selectedNode.kssj; //���ؿ�ʼʱ��
    	var bksd = selectedNode.bksd; //����ʱ�Σ���������
    	var icon = selectedNode.icon; //ͼ��
    	var titleStr = '"'+name+'"����';
    	var htmlStr = "";
    	htmlStr += "�豸��ţ�" + sbbh + "<br/>";
    	htmlStr += "�豸���ƣ�<br/>" + "<img src='"+icon+"'/>" + name + "<br/>";    	
    	htmlStr += "ͨ���ţ�<br/>" + channel + "<br/>";
    	if(syr != undefined && syr != null && syr != ''){
    		htmlStr += "<hr /><b>������Ϣ</b><br/>";
	    	htmlStr += "�����ˣ�" + syr + "<br/>";
	    	htmlStr += "ʱ�䣺" + kssj + "<br/>";
	    	htmlStr += "ʱ�����룩��" + bksd/1000.0 + "<br/>";
	    }
        var d = dialog({
            id:'winTit',//��ӵ����Ĵ���
            width:200,
            title: titleStr,
            content:htmlStr,
            okValue: 'ȷ��',
            ok: function () {},
            padding: 0,
            skin: 'min-dialog tips'
        });
        //Modal�����Ĳ��ɱ����
        d.show(document.getElementById('lblPosition'));
    });
    $("#liTreeAdd").on("click",function(){
        alertMy("liTreeAdd"+"click");
        var sksd=0;
        //�����Ի����������ʱ��
        var d = dialog({
            id:'winTit',//��ӵ����Ĵ���
            title: '����������ʱ�䣺',
            content:'<select id="selectTime" style="width:150px;font-size:12px;"><option value="60000">1����</option><option value="300000">5����</option> <option value="900000">15����</option> <option value="1800000">30����</option> <option value="3600000">1��Сʱ</option> <option value="21600000">6��Сʱ</option> <option value="86400000">һ��</option> <option value="604800000">һ��</option> <option value="18144000000">һ����</option></select>',
            //'<input id="input_time" style="width:100px;"placeholder="����" autofocus value="1"/>',
            okValue: 'ȷ��',
            ok: function () {
                this.title('�ύ�С�');
                //��ȡ������ʱ��
                var sksd=$("#selectTime option:selected").val();
                //�Ѿ�ת���ɺ�����д�����̨
                alertMy(sksd+"ms");
                var treeNode = selectedNode;
                if(treeNode != null) {
                    var sbbh = treeNode.sbbh;
                    var geturl = lockProps.urlAdd;
                    var param = "userId=" + oUserId + "&sbbh=" + sbbh + "&sksd=" + sksd;
                    //��������
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
                        		//����ͼ��
                        		treeNode.icon=iconPath_lock_self;
                            	//treeObj.refresh();
                                treeObj.updateNode(treeNode);
                        	}catch(e){
                        		
                        	}
                            alertMy("�����Ҽ� ��� �����趨�ɹ�");
                            $("#divTreeRMenu").hide();
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alertMy("����ʧ�ܺ��״̬:" + textStatus);
                            $("#divTreeRMenu").hide();
                        }
                    });
                    this.remove();
                }
            },
            padding: 0,
            skin: 'min-dialog tips',
            cancelValue: 'ȡ��',
            cancel: function () {}
        });
        //Modal�����Ĳ��ɱ����
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
                    alertMy("�����Ҽ� ɾ�� �����趨�ɹ�");
                    //����ͼ��
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
                    alertMy("����ʧ�ܺ��״̬:" + textStatus);
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
            content: '�뵥��!&nbsp;&nbsp;�����ظ�������',
            quickClose: true// ����հ״����ٹر�
        });
        //��λ����label���棬�ֲ�����ʾ�򣬱����ظ����
        d.show($("#positionDiaScreen")[0]);
        setTimeout(function () {
            d.close().remove();
        }, 2000);
    });

    $("#lblUserId").text(oUserId);
    //��unloading�������м����¼�
    $("#tabsleft").tabs({active: 0});


    //��ҳ�رյ�ʱ���ͷ�ocx����ķ���,��Ӧ����unload����
    $(window).on("beforeunload", function () {
        alertMy("unload");
        try {
            mediaplayerobj.ITMS_CCTV_StopPreview(0);
        }
        catch (e) {
            alertMy("ֹͣʧ��");
        }
        try {
            mediaplayerobj.ITMS_CCTV_MediaUnRegister();
        }
        catch (e) {
            alertMy("ע��ʧ��");
        }
        try {
            mediaplayerobj.ITMS_CCTV_FreeScreen();
        }
        catch (e) {
            alertMy("�ͷ�ʧ��");
        }
        try {
            mediaplayerobj.ITMS_CCTV_MediaFree();
        }
        catch (e) {
            alertMy("�ͷ�ʧ��");
        }

        alertMy("�뿪��Ƶ���ƽ̨");
    });
   
    //��ͼƬ�ĵ���¼��������ֲ��ķ���
    $(".imagesetscreen").on("click", function () {
        changeImg(this);

    });
    //�������ʾЧ���ĳ�ʼ��
    initView();
    //��Ƶ�ؼ���ʼ��
    alertMy("��Ƶ�ؼ���ʼ��");
    mediaplayinit();

    alertMy("��Ƶ�ؼ���ʼ�� end");

    //��Ƶ�豸��״�ṹ��ʼ��
    deviceinit();
    treeObj=$.fn.zTree.getZTreeObj("treedevice");
    //alertMy("ִ�е���3");

    //�ֲ��б��ʼ��������л������Ļ�����Ҫ����ѡ���ֲ��ķ���
    devicepollinit();

    //��̨����
    pTziinit();

    //Ԥ��λ�ļ���
    preSetinit();

    //ocx��Ӧ��ק�¼�
    initOcxDrag()

    //��Ĭ�ϵĶԻ��򲻿ɼ�
    $("#dialogDiv").hide();

    //����˼���
    // var es = new EventSource(serversenturl);
    // es.addEventListener("message", severlisten, false);
    // ��ʼ��tree

    //�����������Ϣ����Ҫ������ƵȨ�޿��ƣ��ֲ���ƣ�
    function severlisten(e) {
        //�������������Ȩ�޺󣬶���Ӧ����Ƶ����ֹͣ���ţ��ֲ�����Ƶ���β˵���������
        //������ֲ�״̬��ֹͣ���Ų�����Ӧ���ֲ��б��������
        //document.getElementById("x").innerHTML += "\n" + e.data;
    }

    /**********�ؼ��ߴ�ı�ʱ���ø��Ŀؼ��ߴ磺һ����body.resize,һ����layout�ı�ߴ�ʱ***********/
    function bodyResize() {
        try{
            var width = $(".ui-layout-center").width();
            var height = $(".ui-layout-center").height();
            mediaplayerobj.ITMS_CCTV_ReSizeVideoDlg(0, 0, width, height);
        }catch(e){};

    }

    //��Ƶ�ؼ��ĳ�ʼ��
    function mediaplayinit() {
        try {
            alertMy("������mediaplayinit");

            mediaplayerobj.ITMS_CCTV_MediaInit(ocx_userid, "", ocx_clientport, ocx_userpwd, ocx_serverip, ocx_serverid, ocx_serverport);

            ////Ĭ��Ϊ�ĸ�����������ʾ����ʾ��������Ҫ�ĵص�ļ��
            //mediaplayerobj.ITMS_CCTV_ScreenSwitch(1, 2);
            //��ʼ����Ļ�����ı��
            oVeiwNumber = 1;
            //��SIp������ע��
            mediaplayerobj.ITMS_CCTV_MediaRegister(1800);
            //ÿ�γ�ʼ����ʱ�����²�������Ļ���ò���
            bodyResize();
            //��������һ���������11010000004000000001
            $("#imagesetscreen1").click();
            //mediaplayerobj.ITMS_CCTV_Preview(1, "11010000001300000002",6000, "", 0, "");
            //���Ե�ͨ����
            //mediaplayerobj.ITMS_CCTV_RegisterAndPreview(1800, 0,"11010000001310000001", 6000, "",0, "");
            /**�±���Ҫ�����Ƶ�ؼ��ĳ�ʼ��*/
            //var nViewDlg = axMediaPlayerVideo.ITMS_CCTV_GetCurSelectVideoDlg();
        } catch (e) {
            alertMy("��Ƶ�ؼ���ʼ���쳣��" + e);
        }
    }

    /****************������Ƶ����*****************/
    function playview(deviceid, view) {
        portplay = portplay + 1;
        var res = mediaplayerobj.ITMS_CCTV_Preview(view, deviceid, portplay, "", 0, "");
    }

    function devicepollinit() {
        var viewn = 0;
        //���select��ѡ��
        var str = "<option value='' lbl='-- ��ѡ���ֲ��б� --'>-- ��ѡ���ֲ��б� --</option>";
        var tabBtn = $("btnStartPlayList");
        //userId=013292&operation=getfamc
        //&lbbh=1&operation=getdevice
        var paramObj = "userid="+oUserId+"&operation=getfamc";
        //alertMy("������devicepollinit");
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
                    //�����б�
                	var item = data[index];
                	var lbmc = item.lbmc;
                	var lbbh = item.lbbh;
                    str = str + "<option value='"+lbbh+"' lbl='" + lbmc + "'>" + lbmc + "</option>";
                    $('#selPlayList').html(str);
                });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alertMy("�ֲ�����ʧ�ܺ��״̬:" + textStatus);
            }
        });
        //�ֲ������� change �¼�
    }

    function deviceinit() {

        $.fn.zTree.init($("#treedevice"), treeSetting, zNodes);
        //����������
        loadTreeData(oUserId);

        //�Ƚ����ڵ���󣬻�ȡ���ҷ�������������
        function fnTreeFilter(node){
        	var bool = false;
        	bool = !node.isParent;
        	return bool;
        }
        //�����豸
        $("#btnSearch").click(function () {
            var searchKey; //�����Ĺؼ���
            //ȡ��input��ģ��ƥ���ֵ
            searchKey = $("#txtSearch").val();
            treeObj.expandAll(false); //�۵����нڵ�
            var leafNodes = treeObj.getNodesByFilter(fnTreeFilter); // ���ҽڵ㼯��
            var len = leafNodes.length;
            for(var i = 0; i < len; i ++){
            	var leafNode = leafNodes[i];
            	var leafName = leafNode.name;
            	alertMy(leafName);
            	if(leafName.indexOf(searchKey) == -1 || searchKey == ""){
            		leafNode.highlight = false; //������
            	}else{
            		leafNode.highlight = true; //����
            		//չ�����ڵ�
                	var parentNode = leafNode.getParentNode(); //�ж��Ƿ���Ҫչ�����ڵ�
                	if(parentNode != null && !parentNode.open){
                		parentNode.open = true;
                	}
            	}
            }
            //ˢ������Ⱦ
            treeObj.refresh();
        });
        //���input�Ļس�������
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
    //�ֲ������� change �¼�
    $("#selPlayList").on("change",function(){
        alertMy("���� options");
        var selPlayListVal = $("#selPlayList option:selected").val();
        if(selPlayListVal == ""){
            devicepollinit(); //�����ѡ���ʼ���������¼����������б�
        }
        loadSelPlayList(); //����Ԥ���б�
    });
    
    //ˢ�·����б�
    $("#btnRefreshPlayList").on("click",function(){
        devicepollinit(); //ˢ���б�
        $("#turnPlayList").html(""); //�����б�
    });
//    //����ƶ���ȥ
//    $("#btnCloseVedio").on("mouseover",function(){
//      try{
//          //��ֹͣ���󲥷�
//          var curIndex=mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
//          if(curIndex != -1){
//              $("#btnCloseVedio").text("�ر�ѡ�е���Ƶ "+(curIndex+1));
//          }else{
//              $("#btnCloseVedio").text("δ֪ѡ����Ƶ");
//          }
//      }catch(e){
//          $("#btnCloseVedio").text("δ֪ѡ����Ƶ");
//      }
//    });
    
    //�ر���Ƶ����
    $("#btnCloseVedio").on("click",function(){
        //������ʾ����
        var btnCloseVedio = document.getElementById('btnCloseVedio');
        var winColose = {
            id:'winCloseVedio',//��ӵ����Ĵ���
            width:150,
            content:"",
            quickClose: true,
            padding: 0,
            skin: 'min-dialog tips'
        };
        var dlg = null; //��������
        try{
            //��ֹͣ���󲥷�
            var curIndex=mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
            alertMy("׼���ر���Ƶ��"+curIndex);
            if(curIndex == -1){
                return;
            }
//          winColose.content = "���ڹر���Ƶ "+(curIndex+1)+"����";
//          dlg = dialog(winColose);
//          dlg.show(btnCloseVedio);
//          dlg.close().remove();
//          setTimeout(function () {
//              dlg.close().remove();
//            }, 1000);
            mediaplayerobj.ITMS_CCTV_StopPreview(curIndex);
          
            winColose.content = "��ɹر���Ƶ "+(curIndex+1)+"";
            dlg = dialog(winColose);
            dlg.show(btnCloseVedio);
            setTimeout(function () {
                dlg.close().remove();
            }, 1000);
        }catch(e){
            winColose.content = "�ر���Ƶ�쳣��"+e.message;
            dlg = dialog(winColose);
            dlg.show(btnCloseVedio);
            setTimeout(function () {
                dlg.close().remove();
            }, 1000);
        }
    });
    
    $("#btnCloseVedio").button();




    //��ק��ȡocxλ��
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

    //�豸�б��ؽ��
    function deviceinitcallback(result) {
        alertMy(result);
        for (var i in result) {

        }
    };

    //�ı�ͼƬΪѡ��״̬
    function changeImg(imgObj) {
        var imgSrcCurrent = imgObj.src;
        //���³�ʼ�����ڵ��λ�ӵı��
        positionTag = 0;
        //�����İ�ť����һ������µ�ͼƬ
        $(".imagesetscreen").each(function () {
            //����ÿһ��
            var imgSrc = this.src;
            var indBegin = imgSrc.lastIndexOf("_");
            var indEnd = imgSrc.lastIndexOf(".");
            var urlBegin = imgSrc.substring(0, indBegin + 1);
            var urlEnd = imgSrc.substring(indEnd);
            var normalName = urlBegin + "normal" + urlEnd; //һ������µ�ͼƬ
            var pressName = urlBegin + "press" + urlEnd;  //����ȥ��ͼƬ
            //һֱ�������������ȵİ������nomal,��������ȵİ������press
            if (imgSrc != imgSrcCurrent) {
                this.src = normalName;
            } else {
                this.src = pressName;
            }
        });

        var btnId = imgObj.id;
        controlGrid(btnId);  //ִ�� ocx js ����
        //alertMy(pressName);
    }
    //���Ƽ�����
    function controlGrid(btnId) {
        var btnPreName = "imagesetscreen";
        var cnt = btnId.substring(btnPreName.length);
        //ִ�м���������
        oVeiwNumber = cnt;
        //�������ֲ�����Ƶֹͣ
        //if(oServiceLogicDevicePoll.getDevicelist()!=null||oServiceLogicDevicePoll.getDevicelist().length>0)
        oServiceLogicDevicePoll.close();
        //}
        if(divideScreenTag!=oVeiwNumber){
            //�����ڲ��ŵ���Ƶֹͣ
            for(var i=0;i<oVeiwNumber;i++){
                mediaplayerobj.ITMS_CCTV_StopPreview(i);
                alertMy("�����ڲ��ŵ���Ƶֹͣ"+i);
            }
            mediaplayerobj.ITMS_CCTV_ScreenSwitch(oVeiwNumber, 2);
            //���ж���Ļ�Ƿ�仯����Ϊtrue,�ں���setCurtArr()����
        }
//        if(!isStartTag){
//            $("#btnStartPlayList").html("��ʼ�ֲ�");
//        }
        divideScreenTag=oVeiwNumber;
        tagIsViewChange=true; //�����ղ����б�
        curentArray=[];//�����ÿ�
    }

    function preSetinit(){
        //ptz:����Ϊ30����Ϊע���¼���
        //����Ԥ��λ������Ԥ��λ�ı����16������Ԥ��λ�ı����17����ѯԤ��λ�ı����18��ɾ��Ԥ��λ�ı����19��
        var ptz=30;
        $( "#liSetPre" ).mouseup(function(){
            //��ȡѡ�е���Ļ��λ��
            var mediaGridNum = mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
            mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(ptz,mediaGridNum, 16);
        });
        //��ѯ��ʷ��Ԥ��λ
        $( "#liCall").hover(function(){
            var mediaGridNum = mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
            var strPreHistory=mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(ptz,mediaGridNum, 18);
            //XXX��ʽת��
            //alert("ppp");
            //var liStr="<li> ������ʷ1</li> <li>������ʷ2</li> <li>������ʷ3</li>";
            //$( "#ulCall" ).html(liStr);
        });
        //������ʷ��Ԥ��λ
        $( "#liQuery").hover(function(){
            var mediaGridNum = mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
            var strPreHistory=mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(ptz,mediaGridNum, 18);
            //XXX��ʽת��
            //var liStr="<li>��ʷ111</li> <li>��ʷ222</li> <li>��ʷ333</li>";
            //$( "#ulQuery" ).html(liStr);
            $( "#ulQuery li" ).mouseup(function(){
               var strSure = $(this).attr("strSure");
                //�ַ�������ΪԤ��λ�ķ���
                mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(ptz,mediaGridNum, 17);
                //XXX����
            });
        });
        //ɾ����ʷ��Ԥ��λ
        $( "#liDel").hover(function(){
            var mediaGridNum = mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
            var strPreHistory=mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(ptz,mediaGridNum, 18);
            //XXX��ʽת������ʾ
            var liStr="<li>������ʷ111</li> <li>������ʷ222</li> <li>������ʷ333</li>";
            $( "#ulDel li" ).mouseup(function(){
                var strSure = $(this).attr("strSure");
                //�ַ���ɾ��Ԥ��λ�ķ���
                mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(ptz,mediaGridNum, 19);
                //XXX����
            });
        });
        $( ".selector" ).menu( "refresh" );
    };
    //���°汾
    function updateVersion(){
        try{
            //ͨ��������õ�ǰ�ؼ��İ汾���ͷ������ϸ��µİ汾�ŶԱ�
            var currentVersionStr=mediaplayerobj.ITMS_28181_GetVersion();
            //alert(currentVersionStr);
            if(ocx_version!==currentVersionStr){
                $("#mediaplayerid").hide();
                $("#spanOcxTag").html("��ʾ������ǰ��ý�岥�����Ѿ����£��������µ�OCXý�岥�����ؼ���");
                //������ʾ����ocx�ؼ�
                //window.location.href="webEasy/setup.exe";
                ocx_version=currentVersionStr;
            }
        }catch(e){
        }
    };
    //���ֲ�ʱ��ĳ�ʼ����
    $("#btnCirTime").click(function () {
        var tag = $("#txtSleep").val();
        oSleep = tag*10;//ת�����룬��ʼ��Ĭ��Ϊ10��
        playUtil.setSleep(tag);
        //��ʾ�ĶԻ���
        var d = dialog({
            id:"winTipDiaScreen",
            align:"right bottom",
            padding:0,
            width:120,
            height:40,
            content: '����������ѯʱ��Ϊ'+tag+'��',
            quickClose: true// ����հ״����ٹر�
        });
        //��λ����label���棬�ֲ�����ʾ�򣬱����ظ����
        d.show($("#positionDiaScreen")[0]);
        setTimeout(function () {
            d.close().remove();
        }, 2000);
        //���������ֲ��ĺ���
    });
    //�Դ�С ����Ȧ������ĳ�ʼ���������
    pertureaAndFocusClick();
    //��Ԥ��λ�ĳ�ʼ������
    $("#btnPreset").click(function () {
        var tag = $("#selectPreset").find("option:selected").text();
        //����Ԥ��λ
        positionPreSet=tag;
        var mediaGridNum = mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
        mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(1,mediaGridNum, 0);
    });
    //��ʼ���ֲ������࣬Ĭ�ϼ�����
    playUtil = new PlayListUtil(mediaplayerobj,"btnStartPlayList","selPlayList","turnPlayList",1,"txtSleep");

    //��Ӵ��ڿ�ݼ�
    //�ж��¼�Դ�ǲ��Ǳ�Ԫ�أ�������ı�Ԫ�أ�
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
        //��ӹ�Ȧ��hover�¼�
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
        //���Ҽ�������½���
        $("#liTreeNewWeb").click(function(){
            var msbbh=sbbhTreeNewWeb;
            var mchannel=channelTreeNewWeb;
            var mcctvdevicename=cctvdevicenameTreeNewWeb;
            var url = "singleScreenControl.html?oUserId="+oUserId+"&sbbh="+msbbh+"&channel="+mchannel+"&cctvdevicename="+mcctvdevicename;
            window.open(url);
            $("#divTreeRMenu").hide();
        });
        //���Ҽ�����豸״̬��Ϣ¼��
        $("#liTreeState").click(function(){
            $("#divTreeRMenu").hide();
            //2.������ʾ��Ȩ���ŵ�ǰ�Ѿ��������������ˣ���Ȩ���ſ���
            //var htmlStr = "<img src='"+treeNode.icon+"'/>"+treeNode.name;
            //htmlStr += "���Ѿ��� " + lockedArr[0].syr + " ���أ�����Ȩ���в�����";
            var htmlStr="<select><option  value=''>�豸���ź�</option><option value=''>�豸����Ƶ</option><option  value=''>�ź��쳣</option><option  value=''>ǰ������</option></select>"
            var d = dialog({
                id:"XTipTree",
                align:"left bottom",
                padding:0,
                margin:0,
                width:120,
                title:"�豸״̬¼��",
                content: htmlStr,
                okValue: 'ȷ��',
                ok: function () {

                },
                quickClose: true// ����հ״����ٹر�
            });
            d.show($( "#lblPosition" )[0]);
        });
    };

    $(document).keyup(function(event){
    	if(!rights4Cctv.enableAlert){
    		//���û��Ȩ���򰴼�¼�뾯��û�з�Ӧ
    		return;
    	}
        if(playUtil!=null && isNotInput(event) && playUtil.playing){
            var key = String.fromCharCode(event.keyCode);
            var ind = parseInt(key)-1;
            try{
                var screenCnt = playUtil.channelArr.length; //������
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
    //������ʱ�����¸ı䴫�����Ļ��
	$(".imagesetscreen").click(function(){
		playUtil.setPageSize(parseInt($(this).attr("cnt")));
		$("#btnRefreshPlayList").show(); //cc 2017-01-20  �����л�����֮����ʾˢ�°�ť
	});
	//����ѡ���ı仯
	$("#selPlayList").on("change",function(){
		playUtil.changePlayList();
		//cc 2017-01-17 ����ѡ�񷽰���ֹͣ�ֲ�  bug420
		playUtil.autoStop();
		$("#btnRefreshPlayList").show(); //��ʾˢ�°�ť
	});
    /**
     * Ԥ��λ��ul��ʽ���޸ģ�
     */
    $(function() {
        //���Ҽ���css����
        $( "#menu" ).menu();
        $( "#menu").css( "border" , "1px solid #7C7C7C").css("border-radius","2px");
        $( ".ulInBorder").css( "border" , "1px solid #7C7C7C" );
        /*�ر�ָ��λ����Ƶ */
        $( "#btnCloseVideo").button();
        $( "#btnCloseVideo").click(function(){
            try{
                var curViewNumb=mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
                if(curViewNumb == -1 ){
                	alert("��ѡ��Ҫ�رյ���Ƶ��"); 
                }else{
                	mediaplayerobj.ITMS_CCTV_StopPreview(curViewNumb);
                }
            }catch(e){
            }
        });
        /*����Ԥ��λ  17  */
        /*����Ԥ��λ  18  */
        /*��ѯԤ��λ  19  */
        /*ɾ��Ԥ��λ  20  */
        $( "#radioPreSet" ).buttonset();
        $( "#radioPreSet label" ).css("font-size", "1.0em");
        $( "#radioPreCall" ).buttonset();
        $( "#radioPreCall label" ).css("font-size", "1.0em");
        //������Ԥ��λ�͵���Ԥ��λ��װ
        setCall();
    });
    //��ͼ����
    
    var myDateTimes = new Date();
	var myYears = myDateTimes.getFullYear();    //��ȡ���������(4λ,1970-????)
	var myMonths = myDateTimes.getMonth()+1;       //��ȡ��ǰ�·�(0-11,0����1��)
	if(myMonths < 10){
		myMonths = "0" +  myMonths;
	}else{
		myMonths =  myMonths;
	}
	var myDates = myDateTimes.getDate();        //��ȡ��ǰ��(1-31)
	var myHours = myDateTimes.getHours();       //��ȡ��ǰСʱ��(0-23)
	var myMinutes = myDateTimes.getMinutes();     //��ȡ��ǰ������(0-59)
	var mySeconds = myDateTimes.getSeconds();     //��ȡ��ǰ����(0-59)
	
	var myPicName = myYears+ "" + myMonths+ ""  + myDates+ ""  + myHours+ ""  + myMinutes+ ""  + mySeconds ;
//	���ͼƬλ�� 
	var commonUrl = "I:\\videoImage\\";
//  Ԥ������
    var str_heb="heb";

    //�����ͼ

    $("#getPicShot").click(function(){
    	$("#saveWin").show();
    	var myDateTimes = new Date();
    	var myYears = myDateTimes.getFullYear();    //��ȡ���������(4λ,1970-????)
    	var myMonths = myDateTimes.getMonth()+1;       //��ȡ��ǰ�·�(0-11,0����1��)
    	if(myMonths < 10){
    		myMonths = "0" +  myMonths;
    	}else{
    		myMonths =  myMonths;
    	}
    	var myDates = myDateTimes.getDate();        //��ȡ��ǰ��(1-31)
    	var myHours = myDateTimes.getHours();       //��ȡ��ǰСʱ��(0-23)
    	var myMinutes = myDateTimes.getMinutes();     //��ȡ��ǰ������(0-59)
    	var mySeconds = myDateTimes.getSeconds();     //��ȡ��ǰ����(0-59)
//    �����ͼƬ����
    	var myPicName = myYears+ "" + myMonths+ ""  + myDates+ ""  + myHours+ ""  + myMinutes+ ""  + mySeconds ;
    		$("#inputUrl").val(commonUrl + myPicName + ".jpg");
    	})
    	
    	//    ��ȡ��ǰ�������Ļͨ����
    		
    		
    	$("#cancel_Btn").click(function(){
    		try{
    			$("#saveWin").hide();
        		$("#inputUrl").val("");
    		}catch(e){
    			alert("�쳣" +e);
    		}
    		
    	})
    	
    	
    	$("#save_Btn").click(function(){
    		try{
    			var myDateTimes = new Date();
    	    	var myYears = myDateTimes.getFullYear();    //��ȡ���������(4λ,1970-????)
    	    	var myMonths = myDateTimes.getMonth()+1;       //��ȡ��ǰ�·�(0-11,0����1��)
    	    	if(myMonths < 10){
    	    		myMonths = "0" +  myMonths;
    	    	}else{
    	    		myMonths =  myMonths;
    	    	}
    	    	var myDates = myDateTimes.getDate();        //��ȡ��ǰ��(1-31)
    	    	var myHours = myDateTimes.getHours();       //��ȡ��ǰСʱ��(0-23)
    	    	var myMinutes = myDateTimes.getMinutes();     //��ȡ��ǰ������(0-59)
    	    	var mySeconds = myDateTimes.getSeconds();     //��ȡ��ǰ����(0-59)
    	    	//    	    �����ͼƬ����
    	    	var myPicName = myYears+ "" + myMonths+ ""  + myDates+ ""  + myHours+ ""  + myMinutes+ ""  + mySeconds ;
    	    		$("#inputUrl").val(commonUrl + myPicName + ".jpg");
    			var selectedNumber = mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
    			$("#saveWin").hide();
    			//mediaplayerobj.ITMS_CCTV_K_SDK_GetSnapShot(commonUrl,selectedNumber, 1920, 1080, myPicName , str_heb);
    		
    			var result_Shot = mediaplayerobj.ITMS_CCTV_K_SDK_GetSnapShot(commonUrl,selectedNumber, 1920, 1080, myPicName , str_heb);
    			if(result_Shot == 0){
    				setTimeout(function(){
        				alert("��ͼ�ɹ���");
        			},100)
    			}
    		}catch(e){
    			alert("�쳣" +e);
    	}
    })
    	
    	
    //���ݴ���Ĳ���ȷ��ҳ����ʾ����
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
    
    //��ʼ��֮���ҳ����Ӽ��̼����¼�
	document.onkeyup=keyEnter;
});

    function pertureaAndFocusClick(){
        //��Ȧ-
        $("img[id^='imgLeft']").on("mousedown",function(){
            var ptz=$(this).attr("ptz");
            ptz=Number(ptz);
            //alert(ptz+typeof(ptz));
            var mediaGridNum = mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
            mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(ptz,mediaGridNum, 0);
            alertMy("��ʼ��ȦonmousedownPTZ --"+ptz);

        });
        $("img[id^='imgLeft']").on("mouseup",function(){
            var mediaGridNum = mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
            mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(6,mediaGridNum, 0);
            alertMy("ֹͣ��ȦonmousedownPTZ --");
        });
        //��Ȧ+
        $("img[id^='imgRight']").on("mousedown",function(){
            var ptz=$(this).attr("ptz");
            ptz=Number(ptz);
            //alert(ptz);
            var mediaGridNum = mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
            mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(ptz,mediaGridNum, 0);
            alertMy("��ʼ��ȦonmousedownPTZ ++"+ptz);
        });
        $("img[id^='imgRight']").on("mouseup",function(){
            var mediaGridNum = mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
            mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(6,mediaGridNum, 0);
            alertMy("������ȦonmousedownPTZ ++");
        });
    };
    //�豸����������ʱ�Ƴ����¼�
    function removePertureaAndFocusClick(){
    	 //��Ȧ-
        $("img[id^='imgLeft']").off("mousedown");
        $("img[id^='imgLeft']").off("mouseup");
        //��Ȧ+
        $("img[id^='imgRight']").off("mousedown");
        $("img[id^='imgRight']").off("mouseup");
    }


	//ptzͼƬЧ���ļ���
    function pTziinit() {
        $("image[id^='PTZ']").on("mousedown", function () {
            var ptz = $(this).attr("ptz");
            onmousedownPTZ(ptz);
            alertMy("��ʼ��̨onmousedownPTZ"+ptz);
        });

        $("image[id^='PTZ']").on("mouseup", function () {
            alertMy("up");
            //var ptz = $(this).attr("ptz");
            alertMy("ֹͣ��̨onmouseupPTZ");
            onmouseupPTZ();
        });

    }
    //�Ƴ�ptzͼƬЧ���ļ���
    function removePTziinit() {
        $("image[id^='PTZ']").off("mousedown");

        $("image[id^='PTZ']").off("mouseup");
    }

	
    /***************PTZ����*************/
    function onmousedownPTZ(ptz) {
        try{
            //��ȡѡ�е���Ļ��λ��
        	var mediaGridNum = mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
            var str = mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(ptz,mediaGridNum, 0);
        }catch(e){
            alertMy("error:"+e);
        }
    }

    /*************����PTZ����**************/
    function onmouseupPTZ() {
        try{
            /******Ӧ�������±ߵĴ����ȡ��ǰ�Ĳ�����Ļ********/
            //    // pCurselectVideoDlg=ITMS_CCTV_GetCurSelectVideoDlg();
            //pCurselectVideoDlg = 0;
            //var device = devicevidiomap.get(pCurselectVideoDlg);
            var mediaGridNum = mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
            mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(6, mediaGridNum, 0);
        }catch(e){
            alertMy("error:"+e);
        }
    }


      //����Ԥ��λ����ɾ����������
      function setCall(){
      	$( "input[id^='radioPreSet']").bind('click',function(){
            var cntInt = $(this).val();
            var mediaGridNum = mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
            var strPreHistory = mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(20,mediaGridNum, cntInt);//ɾ��
            var strPreHistory = mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(17,mediaGridNum, cntInt);//����
        });
        //ֱ�ӵ���
        $( "input[id^='radioPreCall']").bind('click',function(){
            var cntInt = $(this).val();
            var mediaGridNum = mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
            //var strPreHistory = mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(19,mediaGridNum, "");//��ѯ
            var strPreHistory = mediaplayerobj.ITMS_CCTV_PTZ_CommandWithDlg(18,mediaGridNum,cntInt);//����
        });
      }
      

	//�������ã����ð�ť
      function removeSetCall(){
      	$( "input[id^='radioPreSet']").unbind('click');
        //ֱ�ӵ���
        $( "input[id^='radioPreCall']").unbind('click');
      }
      
	//���������¼�  cc 2016-12-21
    function keyDown() {
       var keycode = event.keyCode;
       switch(keycode){
       		case 37:
       			var ptzLeft = $("#PTZleft").attr("ptz");
            	onmousedownPTZ(ptzLeft);
            	alertMy("��ʼ��̨onmousedownPTZ"+ptzLeft);
            	break;
            case 38:
       			var ptzTop = $("#PTZtop").attr("ptz");
            	onmousedownPTZ(ptzTop);
            	alertMy("��ʼ��̨onmousedownPTZ"+ptzTop);
            	break;
            case 39:
       			var ptzRight = $("#PTZright").attr("ptz");
            	onmousedownPTZ(ptzRight);
            	alertMy("��ʼ��̨onmousedownPTZ"+ptzRight);
            	break;
            case 40:
       			var ptzBottom = $("#PTZbelow").attr("ptz");
            	onmousedownPTZ(ptzBottom);
            	alertMy("��ʼ��̨onmousedownPTZ"+ptzBottom);
            	break;
       }
    }
    
    function keyUp(){
    	var keycode=event.keyCode;
    	switch(keycode){
    		case 37:
    			alertMy("up");
	            alertMy("ֹͣ��̨onmouseupPTZ");
	            onmouseupPTZ();
	        case 38:
    			alertMy("up");
	            alertMy("ֹͣ��̨onmouseupPTZ");
	            onmouseupPTZ();
	        case 39:
    			alertMy("up");
	            alertMy("ֹͣ��̨onmouseupPTZ");
	            onmouseupPTZ();
	        case 40:
    			alertMy("up");
	            alertMy("ֹͣ��̨onmouseupPTZ");
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