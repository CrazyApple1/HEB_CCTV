//���ڵ��������
var treeSetting = {
//			async: {
//				enable: true,
//				type: "GET",
//				contentType: "application/json;charset=utf-8",
//				dataType: "jsonp",
//				url: urlDeviceBase,
//				dataFilter:filterTreeData, //���ڵ�����ת������
//				otherParam: ["userId", oUserId] //��Ҫ�û�������ID
//			},
    data: {
        simpleData: {
            enable: true
        }
    },
    view: {
        //showLine:false,
        selectedMulti:false, //��ѡ���ڵ�
        fontCss: getFontCss //�豸ѡ�к����ʽ�仯
    }, //ע�����˫�����Ҽ��¼�
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
//�����������б��ֲ�
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
                alertMy("����ʧ�ܺ��״̬:" + textStatus);
            }
        });
	}
}
/**
 * loadSelPlayList��jsonp�ص�������
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
        var statusPic = iconPath_unlock; //״̬ͼ��
        if(vitem.status!="0"){
        	statusPic = iconPath_error;
        }
        str = str + "<li title='�豸����"+vitem.cctvdevicename+"'xh='"+index+"' channel='"+vitem.channel+"' sbbh='"+vitem.sbbh+"' cctvdevicename='"+vitem.cctvdevicename+"' status='"+vitem.status+"'>"
        + "<div style='float:left;width:80%;'><img id='imgDev"+vitem.sbbh+"' src='"+statusPic+"'/>" + vitem.cctvdevicename + "</div><div style='float:left;width:20%;text-align:right'></div>"
        + "</li>";
        //map�д�������
        //oMap.put(data[index].cctvdeviceid, data[index].cctvdevicename);
        //�����д�������
        for (var i = 0; i < data.length; i++) {
        	oArray[i] = data[index].channel;
        }
    });
    $("#olPlayList").html(str);
    $("#turnPlayList").html(str);
    playUtil.changePlayList();  //cc 2017-01-10 ���tab�л�֮�����ڲ��ŵ��豸û�б�ʶ����������
    $("#olPlayList li").mouseup(function(event){
        //���Ƴ�Ĭ���Զ�����¼������
        $("#olPlayList li").each(function(){
            $(this).attr("selected",false);
        });
        $(this).attr("selected",true);
        // �ҳ��¼�Դ������
        var channel = $(this).attr("channel");
        var sbbh=$(this).attr("sbbh");
        var cctvdevicename=$(this).attr("cctvdevicename");
        //��ӵ�attr��������
        $("#liRotationNewWeb").attr("channel",channel);
        $("#liRotationNewWeb").attr("sbbh",sbbh);
        $("#liRotationNewWeb").attr("cctvdevicename",cctvdevicename);
        var clkButton=event.button;
        if(clkButton!=2){
            //�ж�����Ҽ�
            return;
        }
        var x=event.clientX;
        var y=event.clientY;
        //���y���ڵ�λ���ھ���ײ��ľ���С��60px��ʱ��yֵ���¸�ֵ��li�ĸ߶�Ĭ������Ϊ64px;
        //��ߵ�Ĭ��width��250�������ǷŴ����С�����Ŀ�ȵ���ʾ�����li�Ŀ��Ĭ������Ϊ107��
        var changePlaceTagY=$(window).height()-y;
        var changePlaceTagX=250-x;
        if(changePlaceTagY<=60){
            y=y-50;
        };
        if(changePlaceTagX<=107){
            //��Ϊ�̶���
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
        //���Ƴ�Ĭ���Զ�����¼������
        $("#turnPlayList li").each(function(){
            $(this).attr("selected",false);
        });
        $(this).attr("selected",true);
        // �ҳ��¼�Դ������
        var channel = $(this).attr("channel");
        var sbbh=$(this).attr("sbbh");
        var cctvdevicename=$(this).attr("cctvdevicename");
        //��ӵ�attr��������
        $("#liRotationNewWeb").attr("channel",channel);
        $("#liRotationNewWeb").attr("sbbh",sbbh);
        $("#liRotationNewWeb").attr("cctvdevicename",cctvdevicename);
        var clkButton=event.button;
        if(clkButton!=2){
            //�ж�����Ҽ�
            return;
        }
        var x=event.clientX;
        var y=event.clientY;
        //���y���ڵ�λ���ھ���ײ��ľ���С��60px��ʱ��yֵ���¸�ֵ��li�ĸ߶�Ĭ������Ϊ64px;
        //��ߵ�Ĭ��width��250�������ǷŴ����С�����Ŀ�ȵ���ʾ�����li�Ŀ��Ĭ������Ϊ107��
        var changePlaceTagY=$(window).height()-y;
        var changePlaceTagX=250-x;
        if(changePlaceTagY<=60){
            y=y-50;
        };
        if(changePlaceTagX<=107){
            //��Ϊ�̶���
            x=130;
        };
        if($("#divRotationRMenu ul li").length > 0){
	        $("#divRotationRMenu").css({"top":y+"px","left":x+"px","display":"inline-block","position":"absolute"});
	        $("#divRotationRMenu").show();
        }
    });
    
    //});
    //ע��html�ļ����¼���������հ״���ʱ�������Ҽ���div
    $("html").click(function(){
        $("#divRotationRMenu").hide();
    });
    $("#liRotationNewWeb").unbind("mouseup");
    $("#liRotationNewWeb").mouseup(function(event){
        var sbbh=$(this).attr("sbbh");
        var channel=$(this).attr("channel");
        var cctvdevicename=$(this).attr("cctvdevicename");
        //������ʾ
        alertMy(sbbh);
        $("#divRotationRMenu").hide();
        //�����µ���ҳ��������
        var url = "singleScreenControl.html?oUserId="+oUserId+"&sbbh="+sbbh+"&channel="+channel+"&cctvdevicename="+cctvdevicename;
        //������ֲ��б��������ڲ��ŲŽ�����ת,��������ı䣬ɾ���޶�
        //if(playUtil&&playUtil.playing){}
        //ȫ�ֱ���openWindowLen,�򿪵���ҳ����
        window.open(url);
    });
    $("#liRotationState").unbind("mouseup");
    $("#liRotationState").mouseup(function(event){

        $("#divRotationRMenu").hide();
        //2.������ʾ��Ȩ���ŵ�ǰ�Ѿ��������������ˣ���Ȩ���ſ���
        //var htmlStr = "<img src='"+treeNode.icon+"'/>"+treeNode.name;
        //htmlStr += "���Ѿ��� " + lockedArr[0].syr + " ���أ�����Ȩ���в�����";
        var htmlStr="<select><option  value=''>�豸���ź�</option><option value=''>�豸����Ƶ</option><option  value=''>�ź��쳣</option><option  value=''>ǰ������</option></select>"
        var d = dialog({
            id:"XTip",
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
        d.show($( "#lblTimeInfo" )[0]);
    });
    alertMy("��ѯ�����鳤�ȣ�"+oArray.length);
}

//���ڵ�����ת��
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
            nodeData.channel = arrData[i].channel; //ͨ����
            nodeData.syr = arrData[i].syr; //ʹ���ˣ����������ˣ�
            nodeData.bksd = arrData[i].bksd; //����ʱ�Σ����������������ٺ��룩
            nodeData.kssj = arrData[i].kssj; //������ʼʱ��
            var syr = nodeData.syr;
            var icon = "";
            //Ҷ�ӽڵ㻻ͼ��
            if(!nodeData.isParent){
            	//�ж�����
                if(syr != undefined && syr != null && syr != ""){
                	if(syr != oUserId){
                		icon = iconPath_lock_other;
                	}else{
                		icon = iconPath_lock_self;
                	}
                }else{
                	icon = iconPath_unlock;
                }
                //״̬�Ǻû��ǻ���ֻ�ж� 0 ��1��0Ϊ������1Ϊ������ʽ��⵽����ֻ�ı���ʾЧ����
                if(arrData[i].status==0){
                    icon = iconPath_error;
                }
                nodeData.icon = icon;
            }
            childNodes.push(nodeData);
        }
        $("#btnRefreshTree").attr("title","ˢ�³ɹ�!");
        $("#btnRefreshTree").attr("src",iconPath_refresh); //�ð�ť���Բ�ѯ
	}else{
		$("#btnRefreshTree").attr("src",iconPath_error); //�ð�ť��ʾ����
        $("#btnRefreshTree").attr("title","ˢ��ʧ��!");
        setTimeout(function(){
        	$("#btnRefreshTree").attr("src",iconPath_refresh); //�ð�ť���Բ�ѯ
        },2000);
	}
	return childNodes;
}

//�ɷ������������� 2016.05.01,����ʹ��
var mapNewNodes = {}; //�µĽڵ����
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
        	//��ǰ����ѡ�еĽڵ�
        	var selectedNodes = treeObj.getSelectedNodes();
        	mapNewNodes = {}; //����µ� map
        	var boolInitLoad = (zNodes == null || zNodes.length == 0);
            $.each(data, function (index, jsValue) {
                    for (var i = 0; i < data.result.length; i++) {
                    	var nodeid = data.result[i].id; //�ڵ������ id
                        zNodes[i] = {};
                        mapNewNodes["node"+nodeid] = zNodes[i]; //Ψһ��λ�ڵ����
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
                        zNodes[i].channel = data.result[i].channel; //ͨ����
                        zNodes[i].syr = data.result[i].syr; //ʹ���ˣ����������ˣ�
                        zNodes[i].bksd = data.result[i].bksd; //����ʱ�Σ����������������ٺ��룩
                        zNodes[i].kssj = data.result[i].kssj; //������ʼʱ��
                        var syr = zNodes[i].syr;
                        var icon = "";
                        //Ҷ�ӽڵ㻻ͼ��
                        if(!zNodes[i].isParent){
                        	//�ж�����
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
                            //�Լ�����
                            if(syr == oUserId){
                                icon = iconPath_lock_self;
                            }
                            //����������
                            if(syr != oUserId){
                                icon = iconPath_lock_other;
                            }
                            //û��
                            if(syr == ""){
                                //״̬�Ǻû��ǻ���ֻ�ж� 0 ��1��0Ϊ������1Ϊ������ʽ��⵽����ֻ�ı���ʾЧ����
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
            //���´���ˢ��������
            if(boolInitLoad){ //����ǳ�ʼ���������������ˢ��������
            	$.fn.zTree.init($("#treedevice"), treeSetting, zNodes);
            }else{
            	//���򣬸��ݽڵ������������ͼ��
            	//1.ɾ�����޵ģ���������ڵ����飬���Ҳ����� map ����ģ��������������Ƴ�����
            	for(var i = zNodes.length - 1; i > 0; i --){
            		var nodeData = zNodes[i];
            		var nodeid = nodeData.id;
            		var existNode = mapNewNodes["node"+nodeid];
            		if(existNode == null || existNode == undefined){
            			var treeNodes = treeObj.getNodesByParam("id",nodeid,null);
            			if(treeNodes != null && treeNodes.length > 0){
            				treeObj.removeNode(treeNodes[0]); //�Ƴ����ڵ�
            			}
            			zNodes.splice(i, 1); //�Ƴ������Ԫ��
            		}
            	}
            	//1.����ԭ�еģ������� map���ڵ������о͸ýڵ�͸��£�û�о���ӣ�
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
            					var treeNode = treeNodes[0]; //���µ�һ��
            					treeNode.icon = nodedata.icon; //����ͼ�꣬��̬����ͼ��
            					treeNode.bksd = nodedata.bksd; //����ʱ��
            					treeNode.syr = nodedata.syr; //������
            					treeNode.kssj = nodedata.kssj; //����ʱ��
                                treeNode.status = nodedata.status; //״̬����
            					treeObj.updateNode(treeNode);
            				}
            				boolExist = true;
            				break;
            			}
            		}
            		//������½ڵ㣬�������ĸ��ڵ���ӽ�ȥ
            		if(!boolExist){
            			//���ҵ����ڵ㣬Ȼ���ڸ��ڵ������һ���ӽڵ�
            			var pid = nodedata.pId; //���ڵ� id
            			var nodeParents = treeObj.getNodesByParam("pId",pId,null);
            			var nodeParent = null; //���ڵ�
            			if(!nodeParents && nodeParents.length > 0){
            				nodeParent = nodeParents[0];
            			}
            			treeObj.addNodes(nodeParent,nodedata); //����ֽڵ����ڵ�Ķ���
            		}
            	}
//            	treeObj.refresh();//ˢ�����ڵ�,ˢ�½ڵ�ᵼ��������
            	//���õ�ǰѡ�е����ڵ�
            	/*
            	if(selectedNodes != null && selectedNodes.length > 0){
            		var selectedNode = selectedNodes[0];
            		treeObj.selectNode(selectedNode); //���õ���ѡ��
            	}
            	*/
            }
            $("#btnRefreshTree").attr("src",iconPath_refresh); //�ð�ť���Բ�ѯ
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alertMy("����ʧ�ܺ��״̬:" + textStatus);
            $("#btnRefreshTree").attr("src",iconPath_error); //�ð�ť��ʾ����
            $("#btnRefreshTree").attr("title","ˢ��ʧ��!");
            setTimeout(function(){
            	$("#btnRefreshTree").attr("src",iconPath_refresh); //�ð�ť���Բ�ѯ
            },2000);
        }
    });
}
//������ڵ��λ�ӵĳ�ʼ��
function positionInitFirst(channelID) {
        //positionTag=getCurViewNumb();
        var curViewNumb=mediaplayerobj.ITMS_CCTV_GetCurSelectVideoDlg();
        if(oVeiwNumber==4){
            if(curViewNumb>-1){
                //ѡ���ˣ�������Ϊ��ǰ��λ��
                positionTag=curViewNumb;
                //alert("oVeiwNumber "+oVeiwNumber+"  positionTag "+positionTag);
            }
        }
        var p = positionTag % oVeiwNumber;
        //�����쳣�ж����������bug
        try{
            mediaplayerobj.ITMS_CCTV_StopPreview(p);
        }
        catch(e){
            alert(e.message+"StopPreview");
        }
        alertMy("���ڲ��Ŵ��� "+p+"��������:"+oVeiwNumber+" channel:"+channelID);
        try{
            mediaplayerobj.ITMS_CCTV_Preview(p, channelID, 6000, "", 0, "");
        }catch(e){
            alert(e.message+"Preview");
        }
    positionTag = positionTag + 1;
}

function setCurtArr(channel){
    if(tagIsViewChange){
        curentArray=[];//�����ÿ�
        tagIsViewChange=false;//�������
    }
    var len=4;
    var tag=false;//�������Ԫ���Ƿ����
    //ֻ�����ķ��������
    if(curentArray.length>0){
        for(var i= 0;i<curentArray.length;i++){
            if(channel==curentArray[i]){
                tag=true;//����
            }
        }
    }
    //�����ڣ��ҳ���С�ڷ�����
    if(!tag&&curentArray.length<len){
        curentArray.push(channel);//��ӵ������ĩβ,��һ�����ȵ���len����������һ����������ִ�У������˲�ϣ���õ��Ľ��
    }
    if(!tag&&curentArray.length>len){
        curentArray.push(channel);//��ӵ�����ĩβ
        curentArray.shift();//ɾ������ĵ�һ��
    }
    return tag;
};
//ÿ���ڵ��˫���¼����м���
function zTreeOnDblClick(event, treeId, treeNode) {
    var treeNodeEvent = event;
    //���������һ��bug
    try{
        //�ж��Ƿ��ǿջ����Ǹ��ڵ�
        if(treeNode == null || treeNode.isParent){
            return;
        }
        if(treeNode.status=="1"){
            myDialog("lblPosition",100,40,"�豸����,�޷����ţ�",treeNodeEvent);
            return;
        }
        //��֤�Ƿ����ڿ�ʼ�ֲ�
        if(playUtil!=null && playUtil.playing){
            var d = dialog({
                id:"winTip",
                align:"left bottom",
                padding:0,
                width:200,
                height:50,
                content: '�ֲ��嵥���ڲ����У����ȹر��ֲ���',
                quickClose: true// ����հ״����ٹر�
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
        //��ʼ�������ڵ������
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
        alertMy("zTreeOnDblClick�쳣"+e);
    };

}
//ÿ���ڵ��˫���¼����м������ص�����
function zTreeOnDblClickBack(data){
    var lockedArr = data.result; //������Ϣ����
    var lockedBySelf = false; //�Ƿ����Լ�������
    var locked = false; //�Ƿ��Ѿ�������
    if(lockedArr != null && lockedArr.length != 0){
        locked = true; //�Ѿ�������
        for(var i in lockedArr){
            if(lockedArr[i].syr == oUserId){
                lockedBySelf = true; //���Լ�������
                break;
            }
        }
    }else{
        locked = false; //û�б�������
    }
    //1.������Լ������Ļ���û����������˫������
    if(lockedBySelf || !locked){
        positionInitFirst(recordTreeNode.channel);
    }else{
        //2.������ʾ��Ȩ���ŵ�ǰ�Ѿ��������������ˣ���Ȩ���ſ���
        var htmlStr = "<img src='"+recordTreeNode.icon+"'/>"+recordTreeNode.name;
        htmlStr += "���Ѿ��� " + lockedArr[0].syr + " ���أ�����Ȩ���в�����";
        var d = dialog({
            id:"winTip",
            align:"left bottom",
            padding:0,
            width:120,
            content: htmlStr,
            quickClose: true// ����հ״����ٹر�
        });
        //�ҵ���ǰ�Ľڵ�
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
    var boolLocked = false; //�Ƿ��Ѿ�����
    var boolLockedBySelf = false; //�ǲ��ǵ�ǰ�û�������
    if(result != null && result.length > 0){
        vdata = data.result[0];
        //����ɹ�������ܲ��ţ��ж����������û������������û��������Լ�Ҳ���ܲ��ţ��Լ��������ܲ��ţ�
        boolLocked = true;
        //alertMy("zTreeOnRightClick=�ɹ�");
        //alertMy("zTreeOnRightClick=�ɹ�ȡ�����鳤����"+data.result.length);
        //alertMy("data.syr="+vdata.syr);
    }

    //�ж����ݲ�Ϊ��,id��ͬ������һ������
    if(vdata != null){
        var len = result.length;
        for(var i = 0; i < len; i ++){
            if(oUserId==data.result[i].syr){
                boolLockedBySelf = true;
                break;
            }
        }
    }else{
        vdata = {}; //��ֹ����ʱ�� null ����
    }
    //��ʾ�Ҽ��˵�
    var treeNode = selectedNode;
    if(treeNode != null){
        treeNode.bksd = vdata.bksd; //����ʱ��
        treeNode.syr = vdata.syr; //������
        treeNode.kssj = vdata.kssj; //����ʱ��

        var x = eventMenu.clientX;
        var y = eventMenu.clientY;
        //�ص��Ľ�����ܳɹ�ʧ�ܣ����Ȱ�btnRightStr��Ϊ�գ���ʵ����ʧ�ܵ��������Ϊ�ɹ���ʱ�������¸ı�������ֵ
        var btnRightStr = "";
        if(boolLocked){
            if(boolLockedBySelf){
                //����ͼ��
                treeNode.icon=iconPath_lock_self;
                btnRightStr = "#liTreeRemove,#liTreeView,#liTreeNewWeb,#liTreeState"; //���ֽ���
            }else{
                //����ͼ��
                treeNode.icon=iconPath_lock_other;
                btnRightStr = "#liTreeView"; //���������ģ�ֻ�ܲ鿴
            }
            //ˢ�����нڵ㣬��ʵ������updateNode�������������
            //treeObj.refresh();
            treeObj.updateNode(treeNode);
        }else{
            //����ͼ��
            if(treeNode.status == "1"){
                treeNode.icon = iconPath_error;
            }
            if(treeNode.status == "0"){
                treeNode.icon=iconPath_unlock;
            }
            //treeObj.refresh();
            treeObj.updateNode(treeNode);
            //û������
            btnRightStr = "#liTreeAdd,#liTreeView,#liTreeNewWeb,#liTreeState"; //��������
        }
        treeNode = selectedNode;
        //treeObj.selectNode(treeNode);
        //$("#treedevice_50").offset().top;[
        showRMenu(x,y,treeNode,btnRightStr);
    }
}
var mSbbh = "";
	//���������飬�������Լ��������豸�������飬�����ֲ�ʱ��ҳ���ұߵ���̨���ư�ť����
	var othersLockArray;
function olBreakdownCallback(data){
	othersLockArray=new Array();
    $("#olPlayList li").remove();
    $("#turnPlayList li").remove();
    var str = "";
    var data = data.result;
    $.each(data, function (index, jsValue) {
        var vitem = data[index];
        //״̬����ʱ���Ԫ�أ��ı�ͼ��
        if(vitem.syr == oUserId){
            var cntTitle="�����ˣ�"+vitem.syrName+" ID��"+vitem.syr+" �豸����"+vitem.sbmc;
            str = str + "<li class='ui-state-default' title='"+cntTitle+"'  channel='"+vitem.channel+"' sbmc='"+vitem.sbmc+"'>"+
                "<div style='float:left;width:90%;'><img src='"+iconPath_lock_self+"'/><label mSyc='"+vitem.syr+"' sbbh='"+vitem.sbbh+"' status='"+vitem.status+"'>"+vitem.sbmc+"</label> </div>"
            "</li>";
        }
        //״̬����ʱ���Ԫ�أ��ı�ͼ��
        if(vitem.syr != oUserId){
        	//�������Լ��������豸��������
        	othersLockArray.push(vitem.channel);
            var cntTitle="�����ˣ�"+vitem.syrName+" ID��"+vitem.syr+" �豸����"+vitem.sbmc;
            str = str + "<li class='ui-state-default' title='"+cntTitle+"'  channel='"+vitem.channel+"' sbmc='"+vitem.sbmc+"'>"+
                "<div style='float:left;width:90%;'><img src='"+iconPath_lock_other+"'/><label mSyc='"+vitem.syr+"' sbbh='"+vitem.sbbh+"' status='"+vitem.status+"'>"+vitem.sbmc+"</label> </div>"
            "</li>";
        }
    });
    $("#olPlayList").html(str);//font-family: "΢���ź�", "����", "����";   "border": "1px solid #d3d3d3",
  
    $("#olPlayList li").css({
        "font-family":"΢���ź�",
        "font-weight":"normal",
        "border": "1px solid white",
        "color": "#555",
    });
    $("#turnPlayList li").css({
        "font-family":"΢���ź�",
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
                myDialog("lblPosition2",60,30,"���𻵣�","");
            }
            if( status == "0" ){
                positionInitFirst( cntChannel );
            }
		}
        if( mSyc != oUserId ){
            myDialog("lblPosition2",60,30,"��Ȩ�ޣ�","");
        }
    });
//   
    $( "#turnPlayList li div label" ).dblclick(function(){
        var mSyc = $( this ).attr("mSyc");
        var status = $( this ).attr("status");
        var cntChannel = $( this ).parent().parent().attr( "channel" );
		if( mSyc == oUserId ){
            if( status == "1" ){
                myDialog("lblPosition2",60,30,"���𻵣�","");
            }
            if( status == "0" ){
                positionInitFirst( cntChannel );
            }
		}
        if( mSyc != oUserId ){
            myDialog("lblPosition2",60,30,"��Ȩ�ޣ�","");
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
    //������ɣ�ˢ�������б�
    initBreakdownOL();
}
//ÿ���ڵ���Ҽ�����¼����м���
function zTreeOnRightClick(event, treeId, treeNode) {
    //var cutY=Math.floor(event.clientY);
    ////alert(cutY);
    //$( "#divLiContainer" ).scrollTop(1000);
	$("#divTreeRMenu").hide(); //���ز˵�
	treeObj=$.fn.zTree.getZTreeObj("treedevice");
    treeObj.selectNode(treeNode,false,true);//��һ���ڵ�ѡ�У����������������
    selectedNode = treeNode; //ѡ�е����ڵ�
    treeNodeGlb.cntTreeNode = treeNode;
    eventMenu=event;
    //�������Ĵ����ǿհ׵�λ�ӣ�ֱ�ӷ���
    if(treeNode==null){
        return ;
    }
    if(treeNode.isParent){
        queryInSubTree();
    }
    if(!treeNode.isParent){
        //��¼����¼�����Ϣ
        sbbhTreeNewWeb=treeNode.sbbh;
        channelTreeNewWeb=treeNode.channel;
        cctvdevicenameTreeNewWeb=treeNode.cctvdevicename;
        alertMy("�Ҽ� "+ treeNode.sbbh);
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
        //�ڶԶԻ��������ʹ��ԭ����dom����
        var mHtml = document.getElementById('divQS');
        var d = dialog({
            id:"XTipTree",
            align:"left bottom",
            padding:0,
            margin:0,
            width:120,
            title:"�ڵ�������",
            content: mHtml,
            okValue: '����',
            ok: function () {
                //searchNode();
                var searchKey; //�����Ĺؼ���
                //ȡ��input��ģ��ƥ���ֵ
                searchKey = document.getElementById('ipQS').value;
                /** �ر�ǰһ�ڵ�ĸ��� */
                if(treeNodeGlb.idFirstClick != true){
                    if(treeNodeGlb.cntTreeNode != treeNodeGlb.oldTreeNode){
                        var oldLeafNodes = treeObj.getNodesByFilter(filterNode,false,treeNodeGlb.oldTreeNode);
                        $.each(oldLeafNodes,function(index,itemData){
                            oldLeafNodes[index].highlight = false;
                        });
                        treeObj.updateNode(oldLeafNodes);
                    }
                }
                treeNodeGlb.idFirstClick = false; //����Ϊ���״ν���
                treeObj.expandAll(false); //�۵����нڵ�
                var leafNodes = treeObj.getNodesByFilter(filterNode,false,treeNode); // ���ҵ�ǰ�ڵ㼯��
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
                //ˢ������Ⱦ ���ر�ȫ���ĸ��ڵ㣬�������ø���
                treeObj.refresh();
                document.getElementById('ipQS').value="";
            },
            quickClose: true// ����հ״����ٹر�
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
        myDialog("lblPosition",100,60,"�豸���𻵻������޷���ק���ţ�","");
        return false;
    }
    var cntSyr = treeNodes[0].syr;

    if(treeNodes[0].status=="0"){
        if(cntSyr == ""|| cntSyr == oUserId){
            myDialog("lblPosition",60,30,"��ѡ����","");
            return true;
        }else{
            myDialog("lblPosition",100,60,"�豸���𻵻������޷���ק���ţ�","");
            return false;
        }

    }
}

//��ק�¼�����ǰ�����¼�
function zTreeBeforeDrop(treeId, treeNodes, targetNode, moveType){
    if(treeNodes[0].isParent){
        return false;
    }
    if(targetNode.name !== ""){
        return false;
    }
    return true;
}
//��ק�����¼�,��ȡ�ڵ����ݣ�������Ƶ
function zTreeOnDrop(event, treeId, treeNodes, targetNode, moveType){
    //alert("end = "+"eventX: "+event.clientX+" "+ "eventY: "+event.clientY);
    //var startDX = 0, startDY = 0, endOffsetDX = 0, endOffsetDY = 0;//��ק�ǵ�λ������
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
        //���ϣ���һ���������귶Χ
        if(cutX > dragPlace.startDX && cutX < dragPlace.centDX){
            if(cunY > dragPlace.startDY && cunY< dragPlace.centDY){
                playInOcx(0,treeNodes[0]);
            }
        }
        //���ϣ��ڶ����������귶Χ
        if(cutX > dragPlace.centDX && cutX < dragPlace.endDX){
            if(cunY > dragPlace.startDY && cunY< dragPlace.centDY){
                playInOcx(2,treeNodes[0]);
            }
        }
        //���ϣ��������������귶Χ
        if(cutX > dragPlace.startDX && cutX < dragPlace.centDX){
            if(cunY > dragPlace.centDY && cunY < dragPlace.endDY){
                playInOcx(1,treeNodes[0]);
            }
        }
        //���£����ĸ��������귶Χ
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
    //���y���ڵ�λ���ھ���ײ��ľ���С��60px��ʱ��yֵ���¸�ֵ��
    var changePlaceTagY=$(window).height()-y;
    var changePlaceTagX=250-x;
    if(changePlaceTagY<=120){
        dY=120-changePlaceTagY;
        y=y-dY-10;
    };
    if(changePlaceTagX<=107){
        //��Ϊ�̶���
        x=110;
    };
	$("#divTreeRMenu").css({"top":y+"px", "left":(x+10)+"px", "display":"block"});
    alertMy("x:"+x+" y:"+y);
	var  sbbh=treeNode.sbbh;
    alertMy("oUserId �û���ţ�"+oUserId);
    alertMy("��������豸���ű���ǣ�"+treeNode.channel);
    alertMy("��������豸����ǣ�"+treeNode.sbbh);
    //����ǿյĻ�����������������ʧ�ܣ���Ȩ����
    if(btnRightStr == ""){
        alertMy("��Ȩ����");
        //�����Ȩ�޵Ļ��Ž����Ҽ����ã����򵯳�һ���Ի�����ʾ�޴�Ȩ��
        var d = dialog({
        	id:"winTip",
        	align:"left bottom",
        	padding:0,
        	width:200,
        	height:50,
            content: '��ǰ״̬����Ȩ�������豸���š�������������',
            quickClose: true// ����հ״����ٹر�
        });
        d.show($("#lblPosition")[0]);
        $("#divTreeRMenu").hide(); //���ز˵�
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
//�Ҽ��ص�����

//ѡ�к���ʽ�ı仯
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
        quickClose: true// ����հ״����ٹر�
    });
    //�ҵ���ǰ�Ľڵ�
    d.show($("#"+id)[0]);
    setTimeout(function () {
        d.close().remove();
    }, 1000);
}



