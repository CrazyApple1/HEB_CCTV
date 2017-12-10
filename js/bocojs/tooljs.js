/**
 * Created by Administrator on 2016/4/12.
 */
/*****************************************************************
 jQuery Ajax封装通用类  (linjq)

 *****************************************************************/
    ///刷新或关闭页面注销和关闭资源.
    function alertMy(msg) {
    	var logStr = $("#lblInfo").val();
    	var date = new Date();
		var timeStr = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+"."+date.getMilliseconds();
    	logStr =  timeStr + " " + msg + "\n" + logStr;
    	logStr = logStr.substring(0,2000);  //显示日志的前 2000 个字符,文本框最多显示2000个字符
    	$("#lblInfo").val(logStr);
    }


  function a(){
    alert("进入了函数");
}
    /**
     * ajax封装
     * url 发送请求的地址
     * data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(), "state": 1}
     * async 默认值: true。默认设置下，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为 false。
     *       注意，同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行。
     * type 请求方式("POST" 或 "GET")， 默认为 "GET"
     * dataType 预期服务器返回的数据类型，常用的如：xml、html、json、text
     * successfn 成功回调函数
     * errorfn 失败回调函数
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
     * ajax封装
     * url 发送请求的地址
     * data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(), "state": 1}
     * successfn 成功回调函数
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
     * ajax封装
     * url 发送请求的地址
     * data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(), "state": 1}
     * dataType 预期服务器返回的数据类型，常用的如：xml、html、json、text
     * successfn 成功回调函数
     * errorfn 失败回调函数
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
// 查询用户的ID
function queryStringByName(queryName) {
    var str = location.href; //取得整个地址栏
    if (str.indexOf("?") > -1) {
        var queryParam = str.substring(str.indexOf("?") + 1);
        //如果有多个参数
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
