//Ȩ�޴�����ѯ�û������ء�����¼�롢״̬¼��Ȩ��
var rights4Cctv = {
	enableLock:false,	//�Ƿ�ӵ������Ȩ��
	enableAlert:false,	//�Ƿ���¼��Ȩ��
	enableState:false	//�Ƿ�ӵ��״̬¼��Ȩ��
};

//��ѯ��Ƶ�û�Ȩ��
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
	        alertMy("����ʧ�ܺ��״̬:" + textStatus);
	    }
	});	
}
//�û�Ȩ�޲�ѯ��ľ��
function queryRightsHandler(data){
    data = data.result;
    $.each(data, function (index, jsValue) {
        var vitem = data[index];
        var key = vitem.functionid;
        rights4Cctv[key] = true; //����Ϊ��Ȩ��
    });
    alertMy("��ƵȨ�ޣ�"+$.param(rights4Cctv));
    //���ò˵�Ȩ��
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
