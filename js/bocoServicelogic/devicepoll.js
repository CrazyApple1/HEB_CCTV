/***
*��;���豸�ֲ�
����
*1���ֲ����豸�б������豸Ŀǰ��Ӧ����Ļ��-1��û�в��ţ�
*2���ֲ���ʱ�䣻
*3���ֲ��ķ�������

 
�ĸ���Ļ��ǰ���ŵ��豸-����Ļ���


����
*1����ʱ��������ʱ������Ļ����Ӧ�ģ�
*2���ڲ�������

******/
 

var ServiceLogic = {};
ServiceLogic.DevicePoll=function(v_devicelist,v_veiw,v_sleep,v_mediaplay) {

    ////////////////////��������
    this.devicelist = v_devicelist;     //�ֲ�������
    this.veiw = v_veiw;                 //�ֲ��ķ�����
    this.sleep = v_sleep;               //�ֲ��ļ�Ъʱ��
    this.mediaplay = v_mediaplay;       //��Ƶ�ؼ�
    this.UlList=null;
    var curtView=0;                       //�ֲ��Ŀ��Ʊ���
    var tagIntervalFunction;
    var deviceid="";//�ֲ����豸��ű仯id
    //�����ֲ�����
    this.setDevicelist=function(num){
        this.devicelist = num;
    }
    //������Ļ����
    this.setVeiw=function(num){
        this.veiw = num;
    };

    //�����ֲ�ʱ��
    this.setSleep = function (num) {
        this.sleep = num;
    };
    // ����ý�岥�ŵĶ���
    this.setMediaplay=function(num){
        this.mediaplay = num;
    };
    //���벥�ŵ��б�
    this.setUlList=function(num){
        this.UlList=num;
    };
    //���հ��ڵ�this���洢����
    that=this;

    //��ѯ������,���isStopΪtrue��ʱ���˳�ѭ����
    this.openD3=function(){
        play();
        //����ѭ���ֲ�
        tagIntervalFunction=setInterval(function () {
        for(var j=0;j<that.veiw;j++){
             that.mediaplay.ITMS_CCTV_StopPreview(j);
               //alert("��ʼ�ر��˵�" +j+"����Ƶ" );
             }
             play();
        },that.sleep);
    };
    function play(){
        for(var i=0;i<that.veiw;i++){
            deviceid = that.devicelist.shift(); //����ͷ��ɾ��
            that.mediaplay.ITMS_CCTV_Preview(i,deviceid,6000, "", 0, "");
            //alert("��ʼ�ֲ���,�豸�����"+deviceid+"����Ƶ"+"����ʱ����="+that.sleep);
            that.devicelist.push(deviceid);     //��ӵ�����ĩβ
        }
    }

    /*****
    *ֹͣ�ֲ�
    ******/
    this.close= function () {
        this.devicelist=null;
        clearInterval(tagIntervalFunction);
        this.devicelist = null;
        for (var i = 0; i < this.view; i++) {
            this.mediaplay.ITMS_CCTV_StopPreview(i);
        }
    };

    //������ֲ��Ĺ����������ص���Ƶ��ֹͣ��Ӧ����Ƶ
    this.stopdeviceid = function (deviceid) {

        //ɾ���ֲ������飻
        for (i = 0; i < this.devicelist.length; i++) {

        }
    };


};
