var zNodes = [];// �豸�Ľڵ�
var devicelistjson;             //�豸�б�
var devicevidiomap = new Common.Map();     //�豸�������Ƶ��Ӧ�ı�ţ�������Ƶ�豸��ʱ����Ҫset����Ƶ�ֲ���ʱ��Ҳ��Ҫ���£�
//�豸�б�����URL

var urlDeviceBase=urlBaseRest + "servlet/CctvDeviceServlet";
var urlDevicePoll=urlBaseRest + "servlet/CctvLbfaServlet";
//��ȡ����ӡ�ɾ�������豸�ĵ�ַURL
var lockProps = {
    urlGet:urlBaseRedis+"cctvsssy/get",
    urlAdd:urlBaseRedis+"cctvsssy/add",
    urlRmv:urlBaseRedis+"cctvsssy/remove"
};

var devicepollrul;               //�ֲ������б�
var deviceplaystate = 0;        //0Ϊ�����Ĳ���״̬��1Ϊ�ֲ�״̬��
var mediaplayerobj;
var pDeviceID;          //��ǰ���Ƶ��豸���
var pCurselectVideoDlg; // ��ǰ�豸���Ӵ���
var serversenturl;      //server sent ��ַ
var portplay = 5061;

//���ֲ����豸���map������
var oMap = new Common.Map();
//�����ֲ��ķ���
var oServiceLogicDevicePoll = new ServiceLogic.DevicePoll();
//���ֲ����豸��Ϣ����Array�У������ò��Ե���Ч�豸��id���ڵ���4
var oArray =null;
//������Ĭ��Ϊ��ʼ����ƵΪ4
var oVeiwNumber = 4;
//����ʱ��Ĭ��Ϊ10s
var oSleep = 10000;
//ѡ�������µĲ��ŵ�λ�ӣ���Ƶ���ſؼ�
var positionTag = 0;
var isStartTag=true;//����İ�ť
var divideScreenTag=0;//��ֹ���ͬһ��������ʱ���ظ���ͬ������
var currentChannel="";//��ǰ��ѡ�е�channel�ţ��ж��Ƿ���ͬһ��
var recordTreeNode="";//��¼��ǰ�����ڵ㣻
var curentArray=new Array();//��¼��ǰ���ŵ������б�ʹ�ò����ظ�����ͬһ����Ƶ
var tagIsViewChange=false;//�ж���Ļ�Ƿ�仯���������,Ĭ��Ϊ������
//��¼�豸��id���ڷ�ֹ�ظ�����ͬһ����Ƶ��ֱ��
var positionArrID = [];
//��ȡѡ�е���Ļλ��
var tagHolder;
//Ԥ��λ��¼
var positionPreSet;
// �û���id
var oUserId;
//�򿪵�ҳ��ĳ��ȣ�
//var openWindowLen=0;
//var openWinArr=new Array();
//����ͼ��·�����·������� index.html ҳ��·��
var iconPath_unlock = "image/tree/cctv_normal.png";
var iconPath_lock_self = "image/tree/lock_self.png";
var iconPath_lock_other = "image/tree/lock.png";
var iconPath_refresh="image/tree/refresh.gif"; 
var iconPath_loading="image/tree/loading.gif"; 
var iconPath_error="image/tree/error.png";
var playUtil = null; //�ֲ�������

//���Ҽ��˵�
var sbbhTreeNewWeb = "";
var channelTreeNewWeb = "";
var cctvdevicenameTreeNewWeb = "";
//��ק�ǵ�λ������
var dragPlace={
    startDX: 0,
    startDY: 0,
    centDX: 0,
    centDY: 0,
    endDX: 0,
    endDY: 0
}

//��������ȫ�ֱ���
var treeNodeGlb = {
    idFirstClick: true,
    oldTreeNode: "",
    cntTreeNode: "",
    isDragPlay: false
}

//�����б������
var lockRightLi= {
    cntLi: ""
}

