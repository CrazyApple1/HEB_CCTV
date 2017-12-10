var optMap = {};
var urlParam = {};
var cctvchannel = null; //��ǰ���ŵ� channel ͨ����
/**
 *  ���Եķ���
 */
function log(m){
    logstr=$("#lblInfo").val();
    logstr=m+"\n"+logstr;
    $("#lblInfo").val(logstr);
};
//������Ƶ
function startPlay(cctvchannel){
	try{
		if(cctvchannel != null){
			mediaplayerobj.ITMS_CCTV_StopPreview(0);
		}
		this.cctvchannel = cctvchannel;
	    mediaplayerobj.ITMS_CCTV_Preview(0,cctvchannel,6000, "", 0, "");
	    log("���ڲ��� " + cctvchannel,"����");
	}catch(e){
		log(e,"����");
	}
};
//����ִ�лص�����
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
//�ص�����������
function fnCallback4Save(data){
	//�ص��ɹ���������ݣ�
	emptySelectData();
	//�ɹ������ʾ��
	myDialog("winTipDiaScreen1","lblPosition",data.detail);

}
//�ص������������б�
function fnCallback4Class(data){
	var arr = data.content;
	$.each(arr,function(i,item){
		var value = item["classId"];
		var text = item["className"];
		if(value != "03"){
			//key ,value��ֵ��Ӧ��
			optMap["class"+value] = {value:value,text:text};
		}
	});
    getItems4Type(); //��ȡϸ����Ϣ
};
//�ص�������ϸ���б�
function fnCallback4Type(data){
	var arr = data.content;
	$.each(arr,function(i,item){
		var value = item["typeId"];
		var text = item["typeName"];
		var fid = item["classId"];
		var mapClassObj = optMap["class"+fid];
		//Ҫ���ж�Ƕ��ǰ���map���ڲŽ��д�����һ��map
		if(mapClassObj && !mapClassObj.map){
			mapClassObj.map = new Object(); //����map
		}
		if(mapClassObj && mapClassObj.map){
			mapClassObj.map["type"+value] = {value:value,text:text};
		}
	});
    getItems4EventLevel(); //��ȡ�¼�������Ϣ
};
//�ص��������¼������б�
function fnCallback4EventLevel(data){
	var arr = data.content;
	$.each(arr,function(i,item){
		var value = item["planLevel"];
		var text = item["codeName"];
		var fid = item["planTypeId"]; //���ڵ� id
		var gfid = fid.substring(0,2); //үү�ڵ� id
		var mapClassObj = optMap["class"+gfid];
		//Ҫ���ж�Ƕ��ǰ���map���ڲŽ��д�����һ��map
		if(mapClassObj && mapClassObj.map){
			var mapTypeObj = mapClassObj.map["type"+fid];
			if(mapTypeObj && !mapTypeObj.map){
				mapTypeObj.map = new Object(); //����map
			}
			if(mapTypeObj && mapTypeObj.map){
				mapTypeObj.map["level"+value] = {value:value,text:text};
			}
		}
	});
	//��̨���ݳ�ʼ�����
	initSels(); //ִ��������������
	//ע�� change �¼�
	$("#selClass").change(function(){
		var val = $("#selClass option:selected").val();
		$("#selType").html(""); //���ϸ���б�
		$("#selType").append("<option value=''>-- ��ѡ�� --</option>");
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
		$("#selLevel").html(""); //����¼������б�
		$("#selLevel").append("<option value=''>-- ��ѡ�� --</option>");
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
	//�ύ��ť����
	$("#btnSubmit").click(function(){
		saveAlertList(); //����
	});
	//���ð�ť����
	$("#btnReset").click(function(){
		emptySelectData()
	});
};

//��ʼ��������
function initSels(){
	$("#selClass").html(""); //�������
	$("#selClass").append("<option value=''>-- ��ѡ�� --</option>");
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

//�����̨��ȡ����
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
//����
function saveAlertList(){
	var classId = $("#selClass option:selected").val();
	var typeId = $("#selType option:selected").val();
	var levelId = $("#selLevel option:selected").val();
	var levelDesc = $("#selLevel option:selected").text(); //ȡ�ı�
	var content = $("#txaContent").val();
	//�ж����Ƿ���д������Ϊ��
	if(!(classId&&typeId&&levelId&&levelDesc)){
		return myDialog("winTipDiaScreen2","lblPosition","�뽫��Ϣ��д������");
		//return alert("�뽫��Ϣ��д����!");
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
	//�����������ݣ��ص���������ݣ����ǲ�����������html������ѡ��ķ�ʽ����Ч��
	doJsonp(url,paramStr,"fnCallback4Save");
}
function emptySelectData(){
	//����պ�ѡ�񣬷�ֹ��������
	$("#selClass option").attr("selected",false);
	$("#selClass option[value='']").attr("selected",true);
	$("#selType option").attr("selected",false);
	$("#selType option[value='']").attr("selected",true);
	$("#selLevel option").attr("selected",false);
	$("#selLevel option[value='']").attr("selected",true);
	$("#txaContent").text("")
	myDialog("winTipDiaScreen3","lblPosition","��Ϣ���óɹ���");

};
/**
 * ����Զ���ĶԻ����װ��
 * @param singleId ȷ��Ψһ��id
 * @param positionId ȷ��λ�õ�id
 * @param content	ȷ�����ݵ�id
 */
function myDialog(singleId,positionId,content){
	var d = dialog({
		id:singleId,
		align:"right bottom",
		padding:10,
		width:150,
		height:50,
		content: content,
		quickClose: true// ����հ״����ٹر�
	});
	//��λ����label���棬�ֲ�����ʾ�򣬱����ظ����
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
	//�õ�ocx�Ŀؼ�
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
	//��ȡ��תǰ����ҳ���ݵ���Ϣ
    function queryStringByName(queryName) {
        var str = location.href; //ȡ��������ַ��
        //alert(str);
        if (str.indexOf("?") > -1) {
            var queryParam = str.substring(str.indexOf("?") + 1);
            //����ж������
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
    	startPlay(urlParam.channel); //��ʼ����
    });
	/**
	 *��ʾ���Ե���Ϣ
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
            //������ʱֹͣ
			//ֹͣ
			log("ֹͣ��Ƶ�ɹ���"+"����(1/4)");
			mediaplayerobj.ITMS_CCTV_StopPreview(0);
			//ע��
			mediaplayerobj.ITMS_CCTV_MediaUnRegister();
			log("ע�� OCX �ɹ���"+"����(2/4)");
			//�ͷ�
			mediaplayerobj.ITMS_CCTV_FreeScreen();
			log("�ͷ���Ļ�ɹ���","����(3/4)");
			//�ͷ�
			mediaplayerobj.ITMS_CCTV_MediaFree();
			log("�ͷ�ý��ɹ���"+"����(4/4)");
        }
        catch (e) {
            log(e,"�˳�OCX�쳣");
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
            log("�������ô�С���ɹ���"+"2/4.��ʼ�� ITMS_CCTV_ReSizeVideoDlg");
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
     * ý���ʼ��
     */
    function mediaplayinit() {
        try {

            mediaplayerobj.ITMS_CCTV_MediaInit(ocx_userid, ocx_clientip, ocx_clientport, ocx_userpwd, ocx_serverip, ocx_serverid, ocx_serverport);
            log("ý���ʼ���ɹ���"+"1/4.��ʼ�� ITMS_CCTV_MediaInit");
            bodyResize();
            mediaplayerobj.ITMS_CCTV_ScreenSwitch(1, 0);
            log("ý�廭���л��ɹ���"+"3/4.��ʼ�� ITMS_CCTV_ScreenSwitch");
            mediaplayerobj.ITMS_CCTV_MediaRegister(1800);
            log("ý�廭��ע��ɹ���"+"4/4.��ʼ�� ITMS_CCTV_MediaRegister");
            setTimeout(function(){
				mediaplayerobj.ITMS_CCTV_Preview(0, urlParam.channel,6000, "", 0, "");
			},1);
			log("������Ƶ�ɹ�4/4.��ʼ�� ITMS_CCTV_Preview");
            /*
			
			
			*/
            
			//11010000001310000018 channel
            //mediaplayerobj.ITMS_CCTV_RegisterAndPreview(1800, 0,channel, 6000, "",0, "");
			//log("������Ƶ�ɹ�4/4.��ʼ�� ITMS_CCTV_RegisterAndPreview");
			//bodyResize();
		} catch (e) {
            log(e+"��ʼ��");
        }
    }

	/**
	 * �û����豸���Ƶ���ʾ��Ϣ
	 */
	function dataInit(){
		$("#lblUserId").text(oUserId);
		$(".lblName_top").text(cctvdevicename);
	}

    $("#btn1").click(function(){
    	loadOptionsMap();
    });
	//��Ƶ�ؼ���ʼ��
    mediaplayinit();
    //��ʼ��������
    loadOptionsMap();
    //��ʼ��������ʾ����
	dataInit();
    
})