/**
 * Created by Administrator on 2016/4/12.
 */
/*****************************************************************
 jQuery Ajax��װͨ����  (linjq)

 *****************************************************************/
    ///ˢ�»�ر�ҳ��ע���͹ر���Դ.
    function alertMy(msg) {
    	var logStr = $("#lblInfo").val();
    	var date = new Date();
		var timeStr = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+"."+date.getMilliseconds();
    	logStr =  timeStr + " " + msg + "\n" + logStr;
    	logStr = logStr.substring(0,2000);  //��ʾ��־��ǰ 2000 ���ַ�,�ı��������ʾ2000���ַ�
    	$("#lblInfo").val(logStr);
    }


  function a(){
    alert("�����˺���");
}
    /**
     * ajax��װ
     * url ��������ĵ�ַ
     * data ���͵������������ݣ�����洢���磺{"date": new Date().getTime(), "state": 1}
     * async Ĭ��ֵ: true��Ĭ�������£����������Ϊ�첽���������Ҫ����ͬ�������뽫��ѡ������Ϊ false��
     *       ע�⣬ͬ��������ס��������û�������������ȴ�������ɲſ���ִ�С�
     * type ����ʽ("POST" �� "GET")�� Ĭ��Ϊ "GET"
     * dataType Ԥ�ڷ��������ص��������ͣ����õ��磺xml��html��json��text
     * successfn �ɹ��ص�����
     * errorfn ʧ�ܻص�����
     */
    jQuery.ax=function(url, data, async, type, dataType, successfn, errorfn) {
        async = (async==null || async=="" || typeof(async)=="undefined")? "true" : async;
        type = (type==null || type=="" || typeof(type)=="undefined")? "post" : type;
        dataType = (dataType==null || dataType=="" || typeof(dataType)=="undefined")? "json" : dataType;
        data = (data==null || data=="" || typeof(data)=="undefined")? {"date": new Date().getTime()} : data;
        $.ajax({
            type: type,
            async: async,
            data: data,
            url: url,
            dataType: dataType,
            success: function(d){
                successfn(d);
            },
            error: function(e){
                errorfn(e);
            }
        });
    };

    function myJsonpFn(){
        alertMy("ok!");

    }
    /**
     * ajax��װ
     * url ��������ĵ�ַ
     * data ���͵������������ݣ�����洢���磺{"date": new Date().getTime(), "state": 1}
     * successfn �ɹ��ص�����
     */
    //jQuery.axs=
  function axs(url, data,type,successfn,errorfn) {
        //data = (data==null || data=="" || typeof(data)=="undefined")? {"date": new Date().getTime()} : data;
        $.ajax({
            type: type,
            async: true,
            data: data,
            url: url,
            dataType: "jsonp",
            success:successfn,
            error:errorfn,
            jsonpCallback:"myJsonpFn"
        });
    };

    /**
     * ajax��װ
     * url ��������ĵ�ַ
     * data ���͵������������ݣ�����洢���磺{"date": new Date().getTime(), "state": 1}
     * dataType Ԥ�ڷ��������ص��������ͣ����õ��磺xml��html��json��text
     * successfn �ɹ��ص�����
     * errorfn ʧ�ܻص�����
     */
    jQuery.axse=function(url, data, successfn, errorfn) {
        data = (data==null || data=="" || typeof(data)=="undefined")? {"date": new Date().getTime()} : data;
        $.ajax({
            type: "post",
            data: data,
            url: url,
            dataType: "json",
            success: function(d){
                successfn(d);
            },
            error: function(e){
                errorfn(e);
            }
        });
    };

function objjax(type,url,param,successfn,errorfn){
    $.ajax({
        type: type,
        url: url,
        contentType: "application/json;charset=utf-8",
        processData: false,
        async: true,
        data: param,
        dataType: "jsonp",
        success: successfn,
        error: errorfn
    });

}
// ��ѯ�û���ID
function queryStringByName(queryName) {
    var str = location.href; //ȡ��������ַ��
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
