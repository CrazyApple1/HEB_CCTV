/**
 * Created by zxp on 2016/10/8.
 */
var v_cutTime=0;
var v_Multiple=1;//Ĭ�ϱ�����1
var PlayProgressCls=function(mId,mOcxId,mStartTime,mEndTime){
    var that=this;
    var v_totalTime=0;
    this.interval=null;
    this.init=function(){
        clearInterval(that.interval);//����ע������ʱ��
        v_cutTime=0;
        v_Multiple=1;//Ĭ�ϱ�����1
        v_totalTime=mEndTime-mStartTime;
        $( "#"+mId ).slider({
            option: "instance",
            range: "min",
            min:0,
            max:v_totalTime,
            //start:that.customProStart,
            stop: that.customProEnd
        });
        that.interval=window.setInterval(that.autofun,1000);//��ʼ��ʱ��
    }
    /*��ʱ���ĺ���*/
    this.autofun=function(){
        v_cutTime=v_cutTime+1*v_Multiple;//��ӵı���*1
        if(v_cutTime>=v_totalTime){
            v_cutTime=0;
            $( "#"+mId ).slider( "value" , v_totalTime );
            window.clearInterval(that.interval);
        }
        $( "#"+mId ).slider( "value" , v_cutTime );
        $( "#testH").html("�ܳ����ǣ�"+v_totalTime+"  ��ǰ�ĳ��ȣ�"+v_cutTime+"  ���ӵĳ��ȣ�"+v_Multiple);//���Խ�������׼�����
    }
    /*������������ʼʱ��ֹͣ��ʱ��*/
    this.customProStart=function(){
        window.clearInterval(that.interval);
    }

    /*��������������ʱ����ָ���㲥��*/
    this.customProEnd=function (){
        v_cutTime=$( "#"+mId ).slider( "value" );
        if(that.interval!=null){
            window.clearInterval(that.interval);
            that.interval=null;
        }
        that.interval=window.setInterval(that.autofun,1000);
        $( "#testH2").html("�ܳ����ǣ�"+v_totalTime+"  ��ǰ�ĳ��ȣ�"+v_cutTime+"  ���ӵĳ��ȣ�"+v_Multiple);//���Խ�������׼�����

        $("#"+mOcxId)[0].ITMS_CCTV_K_Playback_ControlCommand_Play(0,v_cutTime);//����ocx
    }

    this.pauseTime=function(){
        that.interval=window.clearInterval(that.interval);
    }
    this.playTime=function(){
        that.interval=window.setInterval(that.autofun,1000);
    }
    /*�����ٶ�*/
    this.playMultiple=function(m_Multiple){
        v_Multiple=m_Multiple;
    }
    /*
    * param m_Time ,��ʱ��
    * param m_Multiple ���ٶ�
    * */
    this.playBack=function(m_Time,m_Multiple){
        v_cutTime=v_cutTime-m_Time*m_Multiple;//Ĭ�ϻ���һ��
    }
    this.playForword=function(m_Time,m_Multiple){
        v_cutTime=v_cutTime+m_Time*m_Multiple;//Ĭ��ǰ��һ��
    }
}