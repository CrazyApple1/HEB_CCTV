/**
 * Created by zxp on 2016/10/8.
 */
var v_cutTime=0;
var v_Multiple=1;//默认倍速是1
var PlayProgressCls=function(mId,mOcxId,mStartTime,mEndTime){
    var that=this;
    var v_totalTime=0;
    this.interval=null;
    this.init=function(){
        clearInterval(that.interval);//避免注册多个定时器
        v_cutTime=0;
        v_Multiple=1;//默认倍速是1
        v_totalTime=mEndTime-mStartTime;
        $( "#"+mId ).slider({
            option: "instance",
            range: "min",
            min:0,
            max:v_totalTime,
            //start:that.customProStart,
            stop: that.customProEnd
        });
        that.interval=window.setInterval(that.autofun,1000);//开始定时器
    }
    /*定时器的函数*/
    this.autofun=function(){
        v_cutTime=v_cutTime+1*v_Multiple;//添加的倍速*1
        if(v_cutTime>=v_totalTime){
            v_cutTime=0;
            $( "#"+mId ).slider( "value" , v_totalTime );
            window.clearInterval(that.interval);
        }
        $( "#"+mId ).slider( "value" , v_cutTime );
        $( "#testH").html("总长度是："+v_totalTime+"  当前的长度："+v_cutTime+"  增加的长度："+v_Multiple);//测试进度条不准的情况
    }
    /*滑动监听，开始时，停止定时器*/
    this.customProStart=function(){
        window.clearInterval(that.interval);
    }

    /*滑动监听，结束时设置指定点播放*/
    this.customProEnd=function (){
        v_cutTime=$( "#"+mId ).slider( "value" );
        if(that.interval!=null){
            window.clearInterval(that.interval);
            that.interval=null;
        }
        that.interval=window.setInterval(that.autofun,1000);
        $( "#testH2").html("总长度是："+v_totalTime+"  当前的长度："+v_cutTime+"  增加的长度："+v_Multiple);//测试进度条不准的情况

        $("#"+mOcxId)[0].ITMS_CCTV_K_Playback_ControlCommand_Play(0,v_cutTime);//操作ocx
    }

    this.pauseTime=function(){
        that.interval=window.clearInterval(that.interval);
    }
    this.playTime=function(){
        that.interval=window.setInterval(that.autofun,1000);
    }
    /*设置速度*/
    this.playMultiple=function(m_Multiple){
        v_Multiple=m_Multiple;
    }
    /*
    * param m_Time ,延时秒
    * param m_Multiple ，速度
    * */
    this.playBack=function(m_Time,m_Multiple){
        v_cutTime=v_cutTime-m_Time*m_Multiple;//默认回退一秒
    }
    this.playForword=function(m_Time,m_Multiple){
        v_cutTime=v_cutTime+m_Time*m_Multiple;//默认前进一秒
    }
}