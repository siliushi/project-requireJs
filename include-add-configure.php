<?php include("include-dialog-head.php"); ?>
<input type="hidden" id="dispatcher" value="admin">
<!--新增字典-->
<div class="pop-box h-auto bg-ff Configure">
	<form method="" action="" id="add-Dictionary">
	<ul class="three-list">
    	<li><i>字典名称：</i><label><input name="" type="text" id="dictionaryName" class="validate" maxlength="36"></label></li>
        <li><i>字典值：</i><label><input name="" type="text" id="dictionaryValue" class="validate" maxlength="36"></label></li>
        <li><i>所属类别：</i><label><select name=""><option>
        	所属类别
        </option></select></label></li>
        <li><i>是否使用：</i><label><input name="radio" type="radio" checked="checked" value="" class="validate">&nbsp;是&nbsp;&nbsp;<input name="radio" type="radio" value="" class="validate">&nbsp;否</label></li>
        <li class="error-out"><span class="error-text" style="display:none"></span></li>
    </ul>
    <div class="text-c mar-b20"><a href="javascript:;" class="green-but" id="determine" data-action="js/mock-data/admin-add-dictionary.json">保存</a>&nbsp;<a href="javascript:;" class="black-but" id="cancel">取消</a></div>
    <input type="hidden" id="isEdit" value="false">
</form>
</div>
<?php include("include-dialog-foot.php"); ?>