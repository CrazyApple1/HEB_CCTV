//日志记载函数
/*
function log(msg){
	var logStr = $("#txaLog").val();
	logStr =  new Date() + "  " + msg + "\n" + logStr;
	logStr = logStr.substring(0,1000);
	$("#txaLog").val(logStr);
}
*/
//播放列表工具类
var PlayListUtil = function(mediaplay,btnPlayId,selPlayListId,olListId,pageSize,txtSleepId){
	var validLi;//cc 2016-12-27筛选出正常状态的设备
	var that = this;
	var curInd = 0; //播放起始索引，从 0 开始
	var clock = null; //定时器编号
	var allChannelArr = new Array(); //轮播方案里面的 li 列表数据：{channel:'xxx',sbbh:'xxx',cctvdevicename:'xxx'}
	var channelArr = new Array();; //当前的播放数组,{index:0,channel:'xxx',sbbh:'xxx',cctvdevicename:'xxx'}
	this.mediaplay = mediaplay;
	this.playing = false; //播放状态
	this.btnPlayId = btnPlayId; //播放按钮　ｉｄ
	this.sleep = parseInt($("#"+txtSleepId).val())*1000; //轮询间隔秒数
	this.curInd = 0;
	this.pageSize = pageSize;//分屏数
	this.channelArr = channelArr; //二维数组[{index:0,channel:'xxx'},...]
	this.clock = clock;
	this.currentLbfa = null; //当前的轮播方案
	this.fnPlay_lens=null; //轮播的长度
	this.fnPlay_index = 0; //当前播放的索引
	this.fnPlay_channel = null; //当前播放的通道号
	this.timeSec = 0; //当前倒计时的秒数
	this.timer = null; //当前倒计时的闹钟
	//当前的播放
	this.fnPlay = function(){
		try{
			that.fnPlay_channel = that.channelArr[that.fnPlay_index].channel;
	        mediaplayerobj .ITMS_CCTV_Preview(that.fnPlay_index,that.fnPlay_channel,6000, "", 0, "");
	        alertMy("play 完成 "+(that.fnPlay_index+1)+"/"+that.fnPlay_lens+" 通道号：" + that.fnPlay_channel);
	    }catch(e){
	    	alertMy("play 完成 "+(that.fnPlay_index+1)+"/"+that.fnPlay_lens+" 通道号：" + that.fnPlay_channel + "e:"+e);
	    };
	    //自动增长，播放下一个
	    that.fnPlay_index = that.fnPlay_index + 1;
	    //如果不是播放到了最后一个窗口，则进行下一个窗口播放
	    if(that.fnPlay_index < that.fnPlay_lens){
	    	that.fnAutoPlay();
    	}
	};
	//当前开始自动播放
	this.fnAutoPlay = function(){
	    try{
	    	//重第一个开始
	    	if(that.fnPlay_index == null || that.fnPlay_index >= that.fnPlay_lens){
	    		that.fnPlay_index = 0;
	    	}
	    	//先停止，后播放
	        mediaplayerobj.ITMS_CCTV_StopPreview(that.fnPlay_index);
	        alertMy("stop 完成 "+(that.fnPlay_index+1)+"/"+that.fnPlay_lens);
//	        var strPlay_test = "fnPlay();";
	        setTimeout(that.fnPlay,0);
	    }catch(e){ 
	    	alertMy("stop 完成 "+(that.fnPlay_index+1)+"/"+that.fnPlay_lens + "e:"+e);
	    }
	};
	this.setSleep = function(){
		that.sleep = parseInt($("#"+txtSleepId).val())*1000; //轮询间隔秒数
	};
	this.setPlaying = function(playing){
		that.playing = playing;
		if(!that.playing){
			$("#lblTimeInfo").text(" "); //清空倒计时
		}
		var icon_play = "image/icon_play.png";
		var icon_stop = "image/icon_stop.png";
		var icon_path = that.playing ? icon_stop : icon_play;
		$("#"+btnPlayId).attr("src",icon_path);
		
		
	};
	this.setPageSize = function(vpageSize){
		that.curInd = 0;
		that.pageSize = vpageSize;
		that.channelArr = new Array();
		/*cc 2017-01-20添加84,85行，设置切换分屏之后停止轮播，并且重新渲染列表*/
		that.autoStop();
		that.changePlayList();
		if(that.playing){
			that.switchPlay(false); //立即执行,不启一动下线程
		}
	};
	//设置当前轮播方案
	this.setCurrentLbfa = function(currentLbfa){
		that.currentLbfa = currentLbfa;
		validLi = $("#"+olListId+" li[status='0']");
		allChannelArr = validLi; //全局的 li
		/*
		//设置播放全表
		validLi.each(function(i){
			var channel = $(this).attr("channel");
			var sbbh = $(this).attr("sbbh");
			var cctvdevicename = $(this).attr("cctvdevicename");
			var status = $(this).attr("status"); //设备状态
			var channelInfo = {channel:channel,sbbh:sbbh,cctvdevicename:cctvdevicename,status:status};
			allChannelArr.push(channelInfo);
		});
		*/
	};
	//切换轮播方案
	this.changePlayList = function(){
		$("#"+selPlayListId+" option").each(function(){
			$(this).attr("playing",false);  //设置为没有正在播放中
			$(this).text($(this).attr("lbl")); //设置为原来文本
		});
		if(that.playing){
			$("#"+selPlayListId+" option").each(function(){
				var lbfa = $(this).val();
				if(lbfa != "" && lbfa == that.currentLbfa){
					if(that.clock != null){
						$(this).text("【播放中】"+$(this).attr("lbl"));
					}
				}
			});
		}
		that.renderLi(false); //立即渲染 li,但是不要播放
		$("#"+btnPlayId).attr("disabled",false);
	};
	this.ocxPlay = function(){
		//1.停止播放当前页的所有列表
		//that.ocxStop();
		//2.播放当前的集合
		var len = that.channelArr.length;
		//便于调试，获得轮播数组长度
		that.fnPlay_lens = len;
		that.fnPlay_index = 0; //从第一个窗格开始播放
		that.fnAutoPlay(); //开始自动播放
		/*
		for(var i = 0; i < len; i ++){
			try{
				var channel = that.channelArr[i].channel;
				var tmpThat=that;
				//tmpThat.mediaplay.ITMS_CCTV_Preview(i,channel,6000, "", 0, "");
				var strPlay = "fnPlay_index="+i+";fnPlay_channel='"+channel+"';";
				strPlay += "fnAutoPlay();";
				//var strStop="fnPlay_index="+i+';';
				//strStop += "fnStop();";
				//setTimeout(strStop,i*1000);
				setTimeout(strPlay,(i+1)*1000);
			}catch(e){
				alertMy("play 完成 "+(i+1)+"/" + len +" 通道号： " + channel + " :" + e);
			}
		}
		*/
	};
	this.autoPlay = function(){
		var currentLbfa = $("#"+selPlayListId+" option:selected").val();
		if(currentLbfa == ""){
			alert("请选择轮播列表！");
			return;
		}
		that.setCurrentLbfa(currentLbfa);
		that.changePlayList(); //设置轮播方案
		if(that.clock != null){
			that.autoStop(); //停止
			$("#"+selPlayListId).attr("disabled",false);
			$("#btnRefreshPlayList").show(); //显示刷新按钮
		}else{
			$("#"+selPlayListId).attr("disabled",false);
			$("#btnRefreshPlayList").hide(); //隐藏刷新按钮
			//避免多次播放
			if(currentLbfa != ""){
				//给当前正在播放的设备添加currentp属性true，其他设备为false
				$("#"+selPlayListId+" option:selected").attr("currentp","true").siblings().attr("currentp","false");
				that.switchPlay(true); //立即调用
			}
		}
		that.changePlayList(); //设置轮播方案，更新值
	};
	this.autoStop = function(){
		//自动播放
		if(that.clock != null){
			window.clearTimeout(that.clock);
		}
		that.clock = null;
		that.setPlaying(false);
	};
	//渲染 li
	this.renderLi = function(boolPlayOcx){
		var channelArr = that.channelArr;
		if(channelArr == null){
			return;
		}
		var liList =$("#"+olListId+" li[status='0']");
		liList.find("div:nth-child(1)").css("width","100%"); //设置字宽
		liList.find("div:nth-child(2)").css("width","0%"); //设置字宽
		liList.css("background-color","white");  //全部标白
		liList.find("label:first").text(""); //置空窗口名字
		//标记播放列表颜色
		var selVal = $("#"+selPlayListId+" option:selected").val();
//		if(selVal != "" && that.currentLbfa == selVal){
		if(selVal != "" && ($("#"+selPlayListId+" option:selected").attr("currentp")=="true"||$("#"+selPlayListId+" option:selected").attr("currentp")==undefined)){
			var arrLen = channelArr.length;
			for(var j = 0; j < arrLen; j ++){
				var index = parseInt(channelArr[j].index);
				var liObj = $("#"+olListId+" li:nth-child("+(index+1)+")");
				liObj.css("background-color","#FFE6B0"); //播放列表标亮
				var lbls = liObj.find("label:first");
				if(lbls == null || lbls.length == 0){
					$(liObj).find("div:nth-child(2)").append("<label style='right:0px;'></label>");
					lbls = liObj.find("label:first");
				}
				if(arrLen > 1){
					$(liObj).find("div:nth-child(1)").css("width","80%");
					$(liObj).find("div:nth-child(2)").css("width","20%");
					lbls.text("【"+(j+1)+"】");
				}else{
					lbls.text("");
				}
			}
		}else{
			that.curInd=0;
		}
//		else if($("#"+selPlayListId+" option:selected").attr("currentp")=="false"){
//			that.channelArr=[];
//		}
		//开始播放，ocx 播放与列表无关
		if(boolPlayOcx){
			that.ocxPlay();
		}
		
	};
	
	this.switchPlay = function(boolNewThread){
		allChannelArr = validLi; //全局的 li
		if(allChannelArr == null || allChannelArr.length == 0){
			this.autoStop();
			return;
		}
		this.setPlaying(true);
		var pageSize = that.pageSize; //分屏数
		var total = allChannelArr.length; //li 的总数
		//截取集合段
		that.channelArr = new Array();
		var cycleTime = 0; //当前的循环次数
		//that.curInd = ((that.curInd == 0 && pageSize > 1) || that.curInd+1 >= allChannelArr.length) ? 0 : (that.curInd+1);
		//以下循环比较特殊，根据分屏填充的数据筛选，根据最大分屏次数循环完成退出
		for(var i = that.curInd; that.channelArr.length < pageSize;){
			if(cycleTime > pageSize){
				break;
			}
			var itemLi =  $(allChannelArr[i]);
			var channel = itemLi.attr("channel");
			var sbbh = itemLi.attr("sbbh");
			var cctvdevicename = itemLi.attr("cctvdevicename");
			var status = itemLi.attr("status");
			//正常设备在轮播列表中的序号 cc2016-12-29
			var xh=itemLi.attr("xh");
			var channelObj = {
				index:xh,
				channel:channel,
				sbbh:sbbh,
				cctvdevicename:cctvdevicename
			};
			
			//cc 2016-12-20
			//判断当前播放的通道是否是被别人锁定的
			if($.inArray(channelObj.channel,othersLockArray)>=0){
				removePertureaAndFocusClick();
				removePTziinit();
				removeSetCall();
				documentUnbindKeyEvent();
			}else{
				pertureaAndFocusClick();
				pTziinit();
				setCall();
				documentBindKeyEvent();
			}
			//只播放状态正常的设备画面
			if(status == "0") {
				that.channelArr.push(channelObj);
			}
			i ++;
			//cc 2016-12-26当播放总数小于分屏数时添加此判断
			if(total<=pageSize){
				if(i > total-1){
					break;
				}
			}
			if(i > total-1){
				i = 0;
				cycleTime ++;
			}
			that.curInd = i;
		}
		/*
		//判断当前
		if(that.curInd <= total){
			var begin = that.curInd;
			var index = begin; //记录总列表的下标索引
			var end = begin + pageSize;
			end = (end > total) ? total : end; //如果超出长度，就截取到尾部
			var arrPart1 = allChannelArr.slice(begin,end);
			$.each(arrPart1,function(i){
				var channelInfo = arrPart1[i];
				var channelObj = {index:index++,
					channel:channelInfo.channel,
					sbbh:channelInfo.sbbh,
					cctvdevicename:channelInfo.cctvdevicename};
				that.channelArr.push(channelObj);
			});
			alertMy("begin:"+begin+" end:"+end+" pageSize:"+pageSize);
			that.curInd = end;
			if(that.curInd >= total){
				that.curInd = 0;
			}
		}
		//分屏数小于总视频数；
		if(pageSize < total){
			//判断是不是断尾
			var arrLen = that.channelArr.length;
			//当前播放的数组小于屏幕数；
			if(arrLen < pageSize){
				var tmpPageSize = pageSize - arrLen;
				that.curInd = 0;
				var begin = that.curInd;
				var index = begin; //记录总列表的下标索引
				var end = begin + tmpPageSize;
				var arrPart2 = allChannelArr.slice(begin,end); //获取集合的下标范围段
				$.each(arrPart2,function(i){
					var channelInfo = arrPart2[i];
					var channelObj = {index:index++,
						channel:channelInfo.channel,
						sbbh:channelInfo.sbbh,
						cctvdevicename:channelInfo.cctvdevicename};
					that.channelArr.push(channelObj);
				});
				that.curInd = end;
			}
		}
		*/
		alertMy("播放长度:"+that.channelArr.length);
		that.renderLi(true); //渲染播放
		//分屏数大于列表总数，则不用进行下一次的轮播切换
		if(pageSize < total){
			if(boolNewThread || that.playing){ //如果是创建新的线程或者是正在播放中的，则定时下一轮
				that.autoStop();
				$("#lblTimeInfo").text(that.sleep/1000);
				that.clock = window.setTimeout(function(){
					that.switchPlay(boolNewThread);
				},that.sleep); //递归轮询
				that.timeSec = that.sleep/1000;
				//倒计时开始
				if(that.timer != null){
					window.clearInterval(that.timer);
					that.timer = null;
				}
				//定时倒计时
				that.timer = window.setInterval(function(){
					that.timeSec --;
					if(that.timeSec == 0){
						window.clearInterval(that.timer);
					}
					if(that.playing){
						$("#lblTimeInfo").text(that.timeSec);
					}else{
						if(that.timer != null){
							window.clearInterval(that.timer);
						}
						$("#lblTimeInfo").text(" ");
					}
				},1000); //按秒钟倒计时
				
				that.setPlaying(true);
			}
		}else{
			that.autoStop();
			$("#"+btnPlayId).attr("disabled",true);
		}
	};
};