var ocxIsNotInit = true; //ocx �Ƿ��Ѿ���ʼ��

//�ص���Ϣ
function ITMS_CCTV_RecordQuery_Handler(pxml){
	try{
	//	alert(pxml);
		//js ���� flex �Ŀؼ�����
		var ocx = window.top.document.getElementById("index");
		var xmlStr = pxml;
		//var xml = ocx.findVedioHandler(xmlStr);
		var xml = ocx[window.top.fnForFlex](xmlStr);
		log("¼��ʱ�β�ѯ���","��ѯ¼���б�ɹ�");
	}catch(e){
		alert("ocx �ص��쳣��"+e.message);
		log(e.message,"��ѯ¼���б��쳣");
	}
}
//��¼��־�ķ���
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
//��ʼ�� ocx
function initOcx() {
    try {
    	if(ocxIsNotInit){
            bocoVedioOcx.ITMS_CCTV_MediaInit(ocx_userid, ocx_clientip, ocx_clientport, ocx_userpwd, ocx_serverip, ocx_serverid, ocx_serverport);
            log("ý���ʼ���ɹ���","1/4.��ʼ�� ITMS_CCTV_MediaInit");
            /*
            bocoVedioOcx.ITMS_CCTV_ScreenSwitch(1, 0);
             log("ý�廭���л����ɹ���","3/4.��ʼ�� ITMS_CCTV_ScreenSwitch");
             bocoVedioOcx.ITMS_CCTV_MediaRegister(1800);
             log("OCX ע��ɹ���","4/4.��ʼ��ITMS_CCTV_MediaRegister");
             */
             /*
            setTimeout(function(){
                
            },500);
			*/
			ocxIsNotInit = false;
    	}
    } catch (e) {
        log(e,"��ʼ��");
        ocxIsNotInit = false;
    }
}

//��ѯ¼���б�ӿ� 2016.08.09 mgg ��ӣ��� Flex ���������� ocx��Ȼ�� ocx �¼����� js ���ص�ǰ��
//arrParam ������ͨ���ţ��豸���ƣ���ѯ��ʼʱ�䣬��ѯ����ʱ��
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
   		log("��ѯ��"+vcode,"ocx ��ѯ¼��");
   		//���濪ʼ�����첽���ã��¼��᷵�أ����������¼�
   	}catch(e){
   		log("�쳣��"+e.message,"ocx ��ѯ¼��");
   	}
}