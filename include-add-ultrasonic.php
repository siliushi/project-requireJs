<?php include("include-dialog-head.php"); ?>
<input type="hidden" id="dispatcher" value="adjuvant-therapy">
<div class="pop-box h-auto bg-ff patientList-ultrasonic">
    <form id="form-add-ultrasonic">
	<ul class="three-list">
    	<li><i><b>*</b>治疗阶段：</i><label><select name=""><option>
        	阶段
        </option></select></label></li>
        <li><i><b>*</b>日期：</i><label><input name="" id="date" type="text" class="Wdate"></label></li>
        <li><i>时间：</i><label><input name="" type="text" class="w80">&nbsp;-&nbsp;<input name="" type="text" class="w80"></label></li>
        <li><i><b>*</b>处理天：</i><label><input name="" type="text"></label></li>
        <li><i><b>*</b>治疗项目：</i><label><input name="" id="treat-project" type="text" data-href="js/mock-data/get-project-list.json"><input type="hidden" id="projectId"></label></li>
        <li class="h65"><i>备注：</i><label><textarea name="" cols="" rows="">12323</textarea></label></li>
        <li><i>上传附件：</i><label>
            <input type="hidden" id="swf" value="images/uploadify.swf"/>
            <input type="hidden" id="file-url" name="fildUrl" value="weewew" />
            <input type="file" style="width:460px;" name="report-file" id="file_upload" data-action="js/mock-data/upload-report-file.json"/>
        </label></li>
        <li class="error-out"><span class="error-text" style="display: none;"></span></li>
    </ul>
    <div class="text-c mar-b20"><a href="javascript:;" data-action="js/mock-data/include-data-example.json" class="green-but" id="saveProgram">保存</a>&nbsp;<a href="javascript:;" class="black-but" id="cancel">取消</a></div>
</form>
</div>
<?php include("include-dialog-foot.php"); ?>