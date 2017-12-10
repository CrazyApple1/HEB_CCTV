/**
 * Created by Administrator on 2016/11/24.
 */
 var DHmediaplayerobj;

 function login(){
  try{
	  
        var ret = DHmediaplayerobj.DevLogin(dhocx_serverip,dhocx_serverport,dhocx_userid,dhocx_userpwd);
        if (ret == 0 ) {
            alert("登陆失败！")
        }
    }catch(e){
    }  
 }

//初始化界面上的按钮注册事件
 function initEventHandler(){
    // 开始实时监控
    $("#btnVideoPlay").bind("click",function(){
        try{
            DHmediaplayerobj.StartRealPlay(99);
        }catch(e){
            alert("异常："+e);
        }
        
    });

   


    // 停止实时
    $("#btnVideoStop").bind("click",function(){
        try{
             DHmediaplayerobj.StopRealPlay();
        }catch(e){
            alert("异常："+e);
        }     
    });

    $("#btnVideoPlayBack").click(function(){
        $("#historyWindow").show();
    });

    $("#cancel").click(function(){
        $("#historyWindow").hide();
    });

    // 确认历史回放
    $("#sure").click(function(){
// 获取设置的历史回放参数
    var dateTime = $("#J-xl").val().split("-");
    var DHyearsTime = parseInt(dateTime[0]),DHmonthsTime = parseInt(dateTime[1]),DHdaysTime = parseInt(dateTime[2]);
    var DHstarthours = parseInt($("#starthours").val());
    var DHstartminutes = parseInt($("#startminutes").val());
    var DHstartseconds = parseInt($("#startseconds").val());
    var DHendhours = parseInt($("#endhours").val());
    var DHendminutes = parseInt($("#endminutes").val());
    var DHendseconds = parseInt($("#endseconds").val());
    var DHchannelID = parseInt($("#channelID").val());
        try{
        var playBackRet = DHmediaplayerobj.PlayBackByTime(DHyearsTime,DHmonthsTime,DHdaysTime,DHstarthours,DHstartminutes,DHstartseconds,DHendhours,DHendminutes,DHendseconds,DHchannelID);
            $("#historyWindow").hide(); 
            if (playBackRet == 0 ) {
            alert("播放失败！")
        }
        }catch(e){
            alert("异常："+e);
        }
    });

    // 停止回放
     $("#btnVideoStopBack").bind("click",function(){
        try{
            $("#historyWindow").hide(); 
             DHmediaplayerobj.StopPlayBack();
        }catch(e){
            alert("异常："+e);
        }     
    });

    $("#btnChangeVideoSize").click(function(){
        $("#changeWindow").show();
    })
    $("#cancels").click(function(){
        $("#changeWindow").hide();
    })

    $("#sures").bind("click",function(){
        var widths = parseInt($("#changeWidth").val());
        var heights = parseInt($("#changeHeight").val())
        try{
            $("#changeWindow").hide();
            DHmediaplayerobj.SetPlayWndSize(widths,heights);
        }catch(e){
             alert("异常："+e);
        }
    })


 }
    //布局部分
    $(document).ready(function () {
        DHmediaplayerobj = document.getElementById("dhMediaPlayerId");

        $('body').layout({
            west__size: 300, 
            south__size: 80, 
            north__size: 50, 
            closable: true,	// pane can open & close
            resizable: true,// when open, pane can be resized
            slidable: true, // when closed, pane can 'slide' open over other panes - closes on 		   			                                                   mouse-out
            livePaneResizing: true
        });
   
        $('#divCenter').layout({
            south__size: 80, 
            closable: true, // pane can open & close
            resizable: true,// when open, pane can be resized
            slidable: true, // when closed, pane can 'slide' open over other panes - closes on                                                                     mouse-out
            livePaneResizing: true
        });

    // 日期控件
        laydate({
            elem: '#J-xl'
        });
   
        initEventHandler();
        setTimeout(bodyResize,100);
        setTimeout(login,1000);

        // setTimeout(change,100);
        
        
        //选择通道之后触发事件
        $("#channelSelect").change(function(){
			var sdhocx_serverip=$(this).children('option:selected').val();
			alert(sdhocx_serverip);
			try{
			   	var ret1 = DHmediaplayerobj.DevLogin(sdhocx_serverip,dhocx_serverport,dhocx_userid,dhocx_userpwd);
		        if (ret1 == 0 ) {
		            alert("登陆失败！")
		        }else{
		        	alert("准备播放")
		        	DHmediaplayerobj.StartRealPlay(0);
		        }
			}catch(e){
				alert(e);
			}
		})

    });
    $(window).on("resize", function (){
        //树容器的高度随窗口自适应
        bodyResize();
    });
    function bodyResize() {
        try{
            var width = $(window).width()-300;
            var height = $(window).height()-80;
            DHmediaplayerobj.SetPlayWndSize(width, height);
        }catch(e){};

    }
    



   


    
    

  /**********控件尺寸改变时调用更改控件尺寸：一个是body.resize,一个是layout改变尺寸时***********/
    //  function bodyResize() {
    //     try{
    //         var width = $(".ui-layout-center").width();
    //         var height = $(".ui-layout-center").height();
    //         DHmediaplayerobj.ITMS_CCTV_ReSizeVideoDlg(0, 0, width, height);
    //     }catch(e){};
    // }