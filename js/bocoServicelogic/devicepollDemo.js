


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
        alert("������"+$(isp).length);
        alert("v_devicelist�ĳ�����"+this.devicelist.length);
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
                alert("ѭ����sbbh��="+sbbhs);
            });
        }
    };
    var curInd = 0; //������ʼ�������� 0 ��ʼ
    var pageSize = 4; //ÿҳ������������ȡ������
    var clock = null; //��ʱ�����
    var curList = null; //��ǰ�Ĳ��Ŷ���
    //
    var switchPlay=function(){
        curList = new Array(); //�������
        var total = $("#ulListID li").length; //li ������
        var indBegin = curInd;
        //��ȡ���϶�
        var arrPart1 = $("#ulListID li").slice(indBegin,indBegin+pageSize);
        $.each(arrPart1,function(){
            curList.push(this);
        });
        curInd += pageSize;
        //�ж��ǲ��Ƕ�β
        if(curInd > total){
            var tmpPageSize = curInd - total;
            curInd = 0;
            indBegin = curInd;
            var arrPart2 = $("#ulListID li").slice(indBegin,indBegin+tmpPageSize); //��ȡ���ϵ��±귶Χ��
            curInd += tmpPageSize;
            $.each(arrPart2,function(){
                curList.push(this);
            });
        }
        $("#ulListID li").css("background-color","white");  //ȫ�����
        $(curList).css("background-color","green"); //�����б����
        $("#btnGet").click();  //������ť��ʾ��ǰ�Ĳ����б��豸���
    };
    //�����ʼ����
    var play=function(){
        for(var i=0;i<that.veiw;i++){
            deviceid = that.devicelist.shift();
            that.mediaplay.ITMS_CCTV_Preview(i,deviceid,6000, "", 0, "");

            that.devicelist.push(deviceid);
        }
    };

};

