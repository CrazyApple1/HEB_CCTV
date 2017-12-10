/***
*用途：设备轮播
属性
*1、轮播的设备列表，包括设备目前对应的屏幕，-1是没有播放；
*2、轮播的时间；
*3、轮播的分屏数；

 
哪个屏幕当前播放的设备-在屏幕类里；


方法
*1、定时函数，定时更新屏幕所对应的；
*2、内部方法、

******/
 

var ServiceLogic = {};
ServiceLogic.DevicePoll=function(v_devicelist,v_veiw,v_sleep,v_mediaplay) {

    ////////////////////公共属性
    this.devicelist = v_devicelist;     //轮播的数组
    this.veiw = v_veiw;                 //轮播的分屏数
    this.sleep = v_sleep;               //轮播的间歇时间
    this.mediaplay = v_mediaplay;       //视频控件
    this.UlList=null;
    var curtView=0;                       //轮播的控制变量
    var tagIntervalFunction;
    var deviceid="";//轮播的设备编号变化id
    //更新轮播数组
    this.setDevicelist=function(num){
        this.devicelist = num;
    }
    //更新屏幕数量
    this.setVeiw=function(num){
        this.veiw = num;
    };

    //更新轮播时间
    this.setSleep = function (num) {
        this.sleep = num;
    };
    // 传入媒体播放的对象
    this.setMediaplay=function(num){
        this.mediaplay = num;
    };
    //传入播放的列表
    this.setUlList=function(num){
        this.UlList=num;
    };
    //将闭包内的this，存储起来
    that=this;

    //轮询的设置,如果isStop为true的时候，退出循环，
    this.openD3=function(){
        play();
        //设置循环轮播
        tagIntervalFunction=setInterval(function () {
        for(var j=0;j<that.veiw;j++){
             that.mediaplay.ITMS_CCTV_StopPreview(j);
               //alert("开始关闭了第" +j+"个视频" );
             }
             play();
        },that.sleep);
    };
    function play(){
        for(var i=0;i<that.veiw;i++){
            deviceid = that.devicelist.shift(); //数组头部删除
            that.mediaplay.ITMS_CCTV_Preview(i,deviceid,6000, "", 0, "");
            //alert("开始轮播了,设备编号是"+deviceid+"的视频"+"休眠时间是="+that.sleep);
            that.devicelist.push(deviceid);     //添加到数组末尾
        }
    }

    /*****
    *停止轮播
    ******/
    this.close= function () {
        this.devicelist=null;
        clearInterval(tagIntervalFunction);
        this.devicelist = null;
        for (var i = 0; i < this.view; i++) {
            this.mediaplay.ITMS_CCTV_StopPreview(i);
        }
    };

    //如果是轮播的过程中有锁控的视频，停止响应的视频
    this.stopdeviceid = function (deviceid) {

        //删除轮播的数组；
        for (i = 0; i < this.devicelist.length; i++) {

        }
    };


};
