//��־���غ���
/*
function log(msg){
	var logStr = $("#txaLog").val();
	logStr =  new Date() + "  " + msg + "\n" + logStr;
	logStr = logStr.substring(0,1000);
	$("#txaLog").val(logStr);
}
*/
//�����б�����
var PlayListUtil = function(mediaplay,btnPlayId,selPlayListId,olListId,pageSize,txtSleepId){
	var validLi;//cc 2016-12-27ɸѡ������״̬���豸
	var that = this;
	var curInd = 0; //������ʼ�������� 0 ��ʼ
	var clock = null; //��ʱ�����
	var allChannelArr = new Array(); //�ֲ���������� li �б����ݣ�{channel:'xxx',sbbh:'xxx',cctvdevicename:'xxx'}
	var channelArr = new Array();; //��ǰ�Ĳ�������,{index:0,channel:'xxx',sbbh:'xxx',cctvdevicename:'xxx'}
	this.mediaplay = mediaplay;
	this.playing = false; //����״̬
	this.btnPlayId = btnPlayId; //���Ű�ť�����
	this.sleep = parseInt($("#"+txtSleepId).val())*1000; //��ѯ�������
	this.curInd = 0;
	this.pageSize = pageSize;//������
	this.channelArr = channelArr; //��ά����[{index:0,channel:'xxx'},...]
	this.clock = clock;
	this.currentLbfa = null; //��ǰ���ֲ�����
	this.fnPlay_lens=null; //�ֲ��ĳ���
	this.fnPlay_index = 0; //��ǰ���ŵ�����
	this.fnPlay_channel = null; //��ǰ���ŵ�ͨ����
	this.timeSec = 0; //��ǰ����ʱ������
	this.timer = null; //��ǰ����ʱ������
	//��ǰ�Ĳ���
	this.fnPlay = function(){
		try{
			that.fnPlay_channel = that.channelArr[that.fnPlay_index].channel;
	        mediaplayerobj .ITMS_CCTV_Preview(that.fnPlay_index,that.fnPlay_channel,6000, "", 0, "");
	        alertMy("play ��� "+(that.fnPlay_index+1)+"/"+that.fnPlay_lens+" ͨ���ţ�" + that.fnPlay_channel);
	    }catch(e){
	    	alertMy("play ��� "+(that.fnPlay_index+1)+"/"+that.fnPlay_lens+" ͨ���ţ�" + that.fnPlay_channel + "e:"+e);
	    };
	    //�Զ�������������һ��
	    that.fnPlay_index = that.fnPlay_index + 1;
	    //������ǲ��ŵ������һ�����ڣ��������һ�����ڲ���
	    if(that.fnPlay_index < that.fnPlay_lens){
	    	that.fnAutoPlay();
    	}
	};
	//��ǰ��ʼ�Զ�����
	this.fnAutoPlay = function(){
	    try{
	    	//�ص�һ����ʼ
	    	if(that.fnPlay_index == null || that.fnPlay_index >= that.fnPlay_lens){
	    		that.fnPlay_index = 0;
	    	}
	    	//��ֹͣ���󲥷�
	        mediaplayerobj.ITMS_CCTV_StopPreview(that.fnPlay_index);
	        alertMy("stop ��� "+(that.fnPlay_index+1)+"/"+that.fnPlay_lens);
//	        var strPlay_test = "fnPlay();";
	        setTimeout(that.fnPlay,0);
	    }catch(e){ 
	    	alertMy("stop ��� "+(that.fnPlay_index+1)+"/"+that.fnPlay_lens + "e:"+e);
	    }
	};
	this.setSleep = function(){
		that.sleep = parseInt($("#"+txtSleepId).val())*1000; //��ѯ�������
	};
	this.setPlaying = function(playing){
		that.playing = playing;
		if(!that.playing){
			$("#lblTimeInfo").text(" "); //��յ���ʱ
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
		/*cc 2017-01-20���84,85�У������л�����֮��ֹͣ�ֲ�������������Ⱦ�б�*/
		that.autoStop();
		that.changePlayList();
		if(that.playing){
			that.switchPlay(false); //����ִ��,����һ�����߳�
		}
	};
	//���õ�ǰ�ֲ�����
	this.setCurrentLbfa = function(currentLbfa){
		that.currentLbfa = currentLbfa;
		validLi = $("#"+olListId+" li[status='0']");
		allChannelArr = validLi; //ȫ�ֵ� li
		/*
		//���ò���ȫ��
		validLi.each(function(i){
			var channel = $(this).attr("channel");
			var sbbh = $(this).attr("sbbh");
			var cctvdevicename = $(this).attr("cctvdevicename");
			var status = $(this).attr("status"); //�豸״̬
			var channelInfo = {channel:channel,sbbh:sbbh,cctvdevicename:cctvdevicename,status:status};
			allChannelArr.push(channelInfo);
		});
		*/
	};
	//�л��ֲ�����
	this.changePlayList = function(){
		$("#"+selPlayListId+" option").each(function(){
			$(this).attr("playing",false);  //����Ϊû�����ڲ�����
			$(this).text($(this).attr("lbl")); //����Ϊԭ���ı�
		});
		if(that.playing){
			$("#"+selPlayListId+" option").each(function(){
				var lbfa = $(this).val();
				if(lbfa != "" && lbfa == that.currentLbfa){
					if(that.clock != null){
						$(this).text("�������С�"+$(this).attr("lbl"));
					}
				}
			});
		}
		that.renderLi(false); //������Ⱦ li,���ǲ�Ҫ����
		$("#"+btnPlayId).attr("disabled",false);
	};
	this.ocxPlay = function(){
		//1.ֹͣ���ŵ�ǰҳ�������б�
		//that.ocxStop();
		//2.���ŵ�ǰ�ļ���
		var len = that.channelArr.length;
		//���ڵ��ԣ�����ֲ����鳤��
		that.fnPlay_lens = len;
		that.fnPlay_index = 0; //�ӵ�һ������ʼ����
		that.fnAutoPlay(); //��ʼ�Զ�����
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
				alertMy("play ��� "+(i+1)+"/" + len +" ͨ���ţ� " + channel + " :" + e);
			}
		}
		*/
	};
	this.autoPlay = function(){
		var currentLbfa = $("#"+selPlayListId+" option:selected").val();
		if(currentLbfa == ""){
			alert("��ѡ���ֲ��б�");
			return;
		}
		that.setCurrentLbfa(currentLbfa);
		that.changePlayList(); //�����ֲ�����
		if(that.clock != null){
			that.autoStop(); //ֹͣ
			$("#"+selPlayListId).attr("disabled",false);
			$("#btnRefreshPlayList").show(); //��ʾˢ�°�ť
		}else{
			$("#"+selPlayListId).attr("disabled",false);
			$("#btnRefreshPlayList").hide(); //����ˢ�°�ť
			//�����β���
			if(currentLbfa != ""){
				//����ǰ���ڲ��ŵ��豸���currentp����true�������豸Ϊfalse
				$("#"+selPlayListId+" option:selected").attr("currentp","true").siblings().attr("currentp","false");
				that.switchPlay(true); //��������
			}
		}
		that.changePlayList(); //�����ֲ�����������ֵ
	};
	this.autoStop = function(){
		//�Զ�����
		if(that.clock != null){
			window.clearTimeout(that.clock);
		}
		that.clock = null;
		that.setPlaying(false);
	};
	//��Ⱦ li
	this.renderLi = function(boolPlayOcx){
		var channelArr = that.channelArr;
		if(channelArr == null){
			return;
		}
		var liList =$("#"+olListId+" li[status='0']");
		liList.find("div:nth-child(1)").css("width","100%"); //�����ֿ�
		liList.find("div:nth-child(2)").css("width","0%"); //�����ֿ�
		liList.css("background-color","white");  //ȫ�����
		liList.find("label:first").text(""); //�ÿմ�������
		//��ǲ����б���ɫ
		var selVal = $("#"+selPlayListId+" option:selected").val();
//		if(selVal != "" && that.currentLbfa == selVal){
		if(selVal != "" && ($("#"+selPlayListId+" option:selected").attr("currentp")=="true"||$("#"+selPlayListId+" option:selected").attr("currentp")==undefined)){
			var arrLen = channelArr.length;
			for(var j = 0; j < arrLen; j ++){
				var index = parseInt(channelArr[j].index);
				var liObj = $("#"+olListId+" li:nth-child("+(index+1)+")");
				liObj.css("background-color","#FFE6B0"); //�����б����
				var lbls = liObj.find("label:first");
				if(lbls == null || lbls.length == 0){
					$(liObj).find("div:nth-child(2)").append("<label style='right:0px;'></label>");
					lbls = liObj.find("label:first");
				}
				if(arrLen > 1){
					$(liObj).find("div:nth-child(1)").css("width","80%");
					$(liObj).find("div:nth-child(2)").css("width","20%");
					lbls.text("��"+(j+1)+"��");
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
		//��ʼ���ţ�ocx �������б��޹�
		if(boolPlayOcx){
			that.ocxPlay();
		}
		
	};
	
	this.switchPlay = function(boolNewThread){
		allChannelArr = validLi; //ȫ�ֵ� li
		if(allChannelArr == null || allChannelArr.length == 0){
			this.autoStop();
			return;
		}
		this.setPlaying(true);
		var pageSize = that.pageSize; //������
		var total = allChannelArr.length; //li ������
		//��ȡ���϶�
		that.channelArr = new Array();
		var cycleTime = 0; //��ǰ��ѭ������
		//that.curInd = ((that.curInd == 0 && pageSize > 1) || that.curInd+1 >= allChannelArr.length) ? 0 : (that.curInd+1);
		//����ѭ���Ƚ����⣬���ݷ�����������ɸѡ����������������ѭ������˳�
		for(var i = that.curInd; that.channelArr.length < pageSize;){
			if(cycleTime > pageSize){
				break;
			}
			var itemLi =  $(allChannelArr[i]);
			var channel = itemLi.attr("channel");
			var sbbh = itemLi.attr("sbbh");
			var cctvdevicename = itemLi.attr("cctvdevicename");
			var status = itemLi.attr("status");
			//�����豸���ֲ��б��е���� cc2016-12-29
			var xh=itemLi.attr("xh");
			var channelObj = {
				index:xh,
				channel:channel,
				sbbh:sbbh,
				cctvdevicename:cctvdevicename
			};
			
			//cc 2016-12-20
			//�жϵ�ǰ���ŵ�ͨ���Ƿ��Ǳ�����������
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
			//ֻ����״̬�������豸����
			if(status == "0") {
				that.channelArr.push(channelObj);
			}
			i ++;
			//cc 2016-12-26����������С�ڷ�����ʱ��Ӵ��ж�
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
		//�жϵ�ǰ
		if(that.curInd <= total){
			var begin = that.curInd;
			var index = begin; //��¼���б���±�����
			var end = begin + pageSize;
			end = (end > total) ? total : end; //����������ȣ��ͽ�ȡ��β��
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
		//������С������Ƶ����
		if(pageSize < total){
			//�ж��ǲ��Ƕ�β
			var arrLen = that.channelArr.length;
			//��ǰ���ŵ�����С����Ļ����
			if(arrLen < pageSize){
				var tmpPageSize = pageSize - arrLen;
				that.curInd = 0;
				var begin = that.curInd;
				var index = begin; //��¼���б���±�����
				var end = begin + tmpPageSize;
				var arrPart2 = allChannelArr.slice(begin,end); //��ȡ���ϵ��±귶Χ��
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
		alertMy("���ų���:"+that.channelArr.length);
		that.renderLi(true); //��Ⱦ����
		//�����������б����������ý�����һ�ε��ֲ��л�
		if(pageSize < total){
			if(boolNewThread || that.playing){ //����Ǵ����µ��̻߳��������ڲ����еģ���ʱ��һ��
				that.autoStop();
				$("#lblTimeInfo").text(that.sleep/1000);
				that.clock = window.setTimeout(function(){
					that.switchPlay(boolNewThread);
				},that.sleep); //�ݹ���ѯ
				that.timeSec = that.sleep/1000;
				//����ʱ��ʼ
				if(that.timer != null){
					window.clearInterval(that.timer);
					that.timer = null;
				}
				//��ʱ����ʱ
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
				},1000); //�����ӵ���ʱ
				
				that.setPlaying(true);
			}
		}else{
			that.autoStop();
			$("#"+btnPlayId).attr("disabled",true);
		}
	};
};