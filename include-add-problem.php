<?php include("include-dialog-head.php"); ?>
<input type="hidden" id="dispatcher" value="admin">
<div class="pop-box h-auto bg-ff MedicalTemplate">
    <form id="form-add-problem">
        <input type="hidden" class="addTemplate">
	<ul class="three-list">
    	<li class="h65"><i>问题标题：</i><label><textarea name="" cols="" rows="" maxlength="36" id="title">12323</textarea></label></li>
        <li><i>所属类别：</i><label><select name=""><option>
        	所属类别
        </option></select></label></li>
        <li><i>答案类别：</i><label><select name="" id="answerType">
            <option value="">是/否</option>
            <option value="">单选择下拉框</option>
            <option value="" selected="selected">文本框</option>
            <option value="">数字</option>
            <option value="">日期</option>
        </select></label></li>
        <span id="selecteValue" style="display:none;"><li class="h65"><i>选择值：</i><label><textarea name="" cols="" rows="" maxlength="156">12323</textarea></label></li></span>
        <li><i>默认值：</i><label><select name="" id="default" style="display:none;"><option>
        	是
        </option><option>否</option></select><input type="text" name="default" id="text"><input class="Wdate" id="Date" name="" style="display:none;" type="text"></label></li>
        <!--<li><i>默认值：</i><label><input name="" type="text"></label></li>-->
        <li class="error-out"><span class="error-text" style="display:none;"></span></li>
    </ul>
    <div class="text-c mar-b20"><a href="#" class="green-but" id="determine" data-action="js/mock-data/include-add-problem.json">保存</a>&nbsp;<a href="#" class="black-but" id="cancel">取消</a></div>
</form>
</div>
<?php include("include-dialog-foot.php"); ?>