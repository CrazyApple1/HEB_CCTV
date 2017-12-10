$(document).ready(function() {
	$('#btnTransKK').bind('click', function() {
		//获取选取的卡口编号
		var kkbh=$('#kkh').children('option:selected').val();
		window.fff.getTdNumber(kkbh);
	})
})