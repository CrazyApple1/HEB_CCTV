


var ServiceLogicDemo = {};
ServiceLogicDemo.DevicePollDemo=function(v_devicelist,v_veiw,v_sleep,v_mediaplay,ulListID) {

    this.devicelist = v_devicelist;
    this.view=v_veiw;
    this.sleep = v_sleep;
    this.ulListID=null;
    var curtView=0;
    var tagIntervalFunction;
    var deviceid="";
    this.setDevicelist=function(num){
        this.devicelist = num;
    };
    this.setVeiw=function(num){
        this.veiw = num;
    };

    this.setSleep = function (num) {
        this.sleep = num;}

    this.setMediaplay=function(num){
        this.mediaplay = num;
    };
    this.setulListID=function(num){
        this.ulListID=num;
    };

    that=this;

    this.setParameter=function(v_devicelist,v_veiw,v_sleep,v_mediaplay,v_ulListID){
        this.devicelist=v_devicelist;
        this.veiw = v_veiw;
        this.sleep = v_sleep;
        this.mediaplay = v_mediaplay;
        this.ulListID=v_ulListID;
        alert(this.ulListID);
        var isp=this.ulListID+" li";
        alert(isp);
        alert("长度是"+$(isp).length);
        alert("v_devicelist的长度是"+this.devicelist.length);
    };
    this.clearParameter=function(){
        this.devicelist=null;
        this.veiw = null;
        this.sleep = null;
        this.mediaplay = null;
        this.ulListID=null;
    };
    this.openD3=function(){
        play();

        tagIntervalFunction=setInterval(function () {
            for(var j=0;j<that.veiw;j++){
                that.mediaplay.ITMS_CCTV_StopPreview(j);
            }
            play();
        },that.sleep);
    };
    this.close= function () {
        this.devicelist=null;
        clearInterval(tagIntervalFunction);
        this.devicelist = null;
        for (var i = 0; i < this.view; i++) {
            this.mediaplay.ITMS_CCTV_StopPreview(i);
        }
    };

    this.stopdeviceid = function (deviceid) {

        for (i = 0; i < this.devicelist.length; i++) {

        }
    };
    this.stopDemo=function(){
        if(clock != null){
            clearInterval(clock);
        }
    };
    this.startDemo=function(){

        switchPlay();
        var sbbhs = "";
        if(curList != null){
            $.each(curList,function(){
                sbbhs += $(this).val()+ ",";//attr("sbbh")
                alert("循环的sbbh是="+sbbhs);
            });
        }
    };
    var curInd = 0; //播放起始索引，从 0 开始
    var pageSize = 4; //每页播几个，用于取得数据
    var clock = null; //定时器编号
    var curList = null; //当前的播放队列
    //
    var switchPlay=function(){
        curList = new Array(); //清空数组
        var total = $("#ulListID li").length; //li 的总数
        var indBegin = curInd;
        //截取集合段
        var arrPart1 = $("#ulListID li").slice(indBegin,indBegin+pageSize);
        $.each(arrPart1,function(){
            curList.push(this);
        });
        curInd += pageSize;
        //判断是不是断尾
        if(curInd > total){
            var tmpPageSize = curInd - total;
            curInd = 0;
            indBegin = curInd;
            var arrPart2 = $("#ulListID li").slice(indBegin,indBegin+tmpPageSize); //获取集合的下标范围段
            curInd += tmpPageSize;
            $.each(arrPart2,function(){
                curList.push(this);
            });
        }
        $("#ulListID li").css("background-color","white");  //全部标白
        $(curList).css("background-color","green"); //播放列表标绿
        $("#btnGet").click();  //触发按钮显示当前的播放列表设备编号
    };
    //点击开始播放
    var play=function(){
        for(var i=0;i<that.veiw;i++){
            deviceid = that.devicelist.shift();
            that.mediaplay.ITMS_CCTV_Preview(i,deviceid,6000, "", 0, "");

            that.devicelist.push(deviceid);
        }
    };

};

