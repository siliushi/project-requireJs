<?php include("include-dialog-head.php"); ?>
<input type="hidden" id="dispatcher" value="clinic-charge">
<div class="pop-box h-auto bg-ff">
    <form id="form-add-ticket">
	<ul class="three-list">
   		<li><i><b>*</b>领用日期：</i><label><input name="" id="receive" class="Wdate" type="text"></label></li>
    	<li><i><b>*</b>领用人：</i><label><select name="" id="recipients"><option value="0">
        	请选择
        </option><option>张三</option><option>李四</option></select></label></li>
        <li><i><b>*</b>票据类型：</i><label><select name="" id="type"><option value="0">
        	请选择
        </option><option>vip</option></select></label></li>
        <li><i><b>*</b>起始票号：</i><label><input name="" type="text" id="start"></label></li>
        <li><i><b>*</b>结束票号：</i><label><input name="" type="text" id="end"></label></li>
        <li><i><b>*</b>当前票号：</i><label><input name="" type="text" id="current" readonly></label></li>
        <li><i><b>*</b>单据状态：</i><label><select name="" id="status"><option value="0">
        	请选择
        </option><option>备用</option><option>再用</option></select></label></li>    
        <li class="error-out"><span class="error-text" style="display:none;"></span></li>        
    </ul>
    <div class="text-c mar-b20"><a href="javascript:;" data-action="js/mock-data/include-data-example.json" id="saveTicket" class="green-but">确定</a>&nbsp;<a href="javascript:;" class="black-but" id="cancel">取消</a></div>
    </form>
</div>
<?php include("include-dialog-foot.php"); ?>