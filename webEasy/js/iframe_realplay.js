/**
 * Created by Administrator on 2016/11/24.
 */
 var DHmediaplayerobj;
 
 //登录函数
 function login(serverip,serverport,userid,userpwd){
  try{
        var ret = DHmediaplayerobj.DevLogin(serverip,serverport,userid,userpwd);
        if (ret == 0 ) {
            alert("登录失败")
        }
    }catch(e){
    }  
 }

    //页面加载完成执行
    $(document).ready(function () {
    	//页面加载之后先把播放按钮设置为不允许播放
    	$('#btnRealPlay').attr('disabled',true);
        DHmediaplayerobj = document.getElementById("dhMediaPlayerId");
        setTimeout(bodyResize,100);

        //下拉框内容改变时，执行函数
		$("#td").change(function(){
			var tdName=$(this).children('option:selected').html();
			if(tdName.indexOf('正常')>0){
				$('#btnRealPlay').attr('disabled',false);
			}else{
				$('#btnRealPlay').attr('disabled',true);
			}
			
		})
		
		// 播放视频
	    $("#btnRealPlay").bind("click",function(){
	        try{
	          DHmediaplayerobj.StartRealPlay($("#td").children("option:selected").val());
	        }catch(e){
	            alert(e);
	        }    
	    });
    });
    
    //改变视口大小时，视频界面也做相应的调整
    $(window).on("resize", function (){
        //�������ĸ߶��洰������Ӧ
        bodyResize();
    });
    function bodyResize() {
        try{
            var width = $(document).width();
            var height = $(document).height();
            DHmediaplayerobj.SetPlayWndSize(width, height);
        }catch(e){};

    }
    
