<?php include("include-dialog-head.php"); ?>
<input type="hidden" id="dispatcher" value="clinic-charge">
<div class="pop-box h-auto bg-ff">
    <form id="form-retype-invoice">
	<ul class="three-list">
    	<li><i>原发票号：</i><label><input name="" type="text" class="validate" id="invoice"></label></li>        
        <li><i>选择方式：</i><label><select name="" class="validate" id="means"><option value="0">
        	请选择
        </option>
        <option selected>
            使用新发票
        </option>
        <option>
        	使用原发票
        </option></select></label></li>
        <li><i>打印内容：</i><label><select name="" class="validate" id="content"><option value="0">
        	请选择
        </option>
        <option>
            全部打印
        </option>
        </select></label></li>
        <li class="error-out"><span class="error-text" style="display:none;"></span></li>
    </ul>
    <div class="text-c mar-b20"><a href="javascript:;" data-action="js/mock-data/include-data-example.json" id="retype-invoice" class="green-but">确定</a></div>
</form>
</div>
<?php include("include-dialog-foot.php"); ?>