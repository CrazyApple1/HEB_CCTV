var zNodes = [];// 设备的节点
var devicelistjson;             //设备列表
var devicevidiomap = new Common.Map();     //设备编号与视频对应的编号；单击视频设备的时候需要set；视频轮播的时候也需要更新；
//设备列表请求URL

var urlDeviceBase=urlBaseRest + "servlet/CctvDeviceServlet";
var urlDevicePoll=urlBaseRest + "servlet/CctvLbfaServlet";
//获取、添加、删除锁定设备的地址URL
var lockProps = {
    urlGet:urlBaseRedis+"cctvsssy/get",
    urlAdd:urlBaseRedis+"cctvsssy/add",
    urlRmv:urlBaseRedis+"cctvsssy/remove"
};

var devicepollrul;               //轮播请求列表
var deviceplaystate = 0;        //0为正常的播放状态，1为轮播状态；
var mediaplayerobj;
var pDeviceID;          //当前控制的设备编号
var pCurselectVideoDlg; // 当前设备的视窗号
var serversenturl;      //server sent 网址
var portplay = 5061;

//将轮播的设备存进map集合中
var oMap = new Common.Map();
//调用轮播的方法
var oServiceLogicDevicePoll = new ServiceLogic.DevicePoll();
//将轮播的设备信息存入Array中，请设置测试的有效设备的id大于等于4
var oArray =null;
//分屏数默认为初始化视频为4
var oVeiwNumber = 4;
//休眠时间默认为10s
var oSleep = 10000;
//选定分屏下的播放的位子，视频播放控件
var positionTag = 0;
var isStartTag=true;//互斥的按钮
var divideScreenTag=0;//防止点击同一个分屏的时候重复相同分屏数
var currentChannel="";//当前的选中的channel号，判断是否是同一个
var recordTreeNode="";//记录当前的树节点；
var curentArray=new Array();//记录当前播放的数组列表，使得不能重复播放同一个视频
var tagIsViewChange=false;//判断屏幕是否变化，清空数组,默认为不分屏
//记录设备的id用于防止重复加载同一个视频的直播
var positionArrID = [];
//获取选中的屏幕位置
var tagHolder;
//预置位记录
var positionPreSet;
// 用户的id
var oUserId;
//打开的页面的长度；
//var openWindowLen=0;
//var openWinArr=new Array();
//设置图标路径相对路径，相对 index.html 页面路径
var iconPath_unlock = "image/tree/cctv_normal.png";
var iconPath_lock_self = "image/tree/lock_self.png";
var iconPath_lock_other = "image/tree/lock.png";
var iconPath_refresh="image/tree/refresh.gif"; 
var iconPath_loading="image/tree/loading.gif"; 
var iconPath_error="image/tree/error.png";
var playUtil = null; //轮播工具类

//树右键菜单
var sbbhTreeNewWeb = "";
var channelTreeNewWeb = "";
var cctvdevicenameTreeNewWeb = "";
//拖拽是的位子坐标
var dragPlace={
    startDX: 0,
    startDY: 0,
    centDX: 0,
    centDY: 0,
    endDX: 0,
    endDY: 0
}

//树操作的全局变量
var treeNodeGlb = {
    idFirstClick: true,
    oldTreeNode: "",
    cntTreeNode: "",
    isDragPlay: false
}

//锁定列表的引用
var lockRightLi= {
    cntLi: ""
}

