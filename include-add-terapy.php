<?php include("include-dialog-head.php"); ?>
<input type="hidden" id="dispatcher" value="adjuvant-therapy">
<input type="hidden" id="editModul" value="false">
<div class="pop-box h-auto bg-ff patientList-process">
    <form id="form-add-project">
	<ul class="three-list">
    	<li><i><b>*</b>阶段：</i><label><select name="" id="step"><option value="1">
        	第一阶段
        </option><option value="2">第二阶段</option><option value="3">第三阶段</option><option value="4">第四阶段</option><option value="5">第五阶段</option></select></label></li>
        <li><i><b>*</b>日期：</i><label><input name="" id="project_date" class="Wdate" type="text"></label></li>
    	<li><i><b>*</b>处理天：</i><label><input name="" id="deal_days" type="text"></label></li>
        <li><i>时间：</i><label><input name="" id="date_hours" type="text" value="00" class="w80">&nbsp;-&nbsp;<input name="" value="00" id="date_minutes" type="text" class="w80"></label></li>
        <li><i><b>*</b>类型：</i><label><select id="type" name="" data-action="js/mock-data/include-data-project.json"><option value="1">
        	药物处方
        </option><option value="2">生化检验</option><option value="3">治疗项目</option><option value="4">其他项目</option></select></label></li>
        <li><i><b>*</b>项目：</i><label><input type="text" id="project" name=""data-href="js/mock-data/get-project-list.json"><input type="hidden" id="projectId"></label></li>
        <li><i>药剂类型：</i><label><select name="" id="medicinesType"><option value="1">
        	刘德华
        </option></select></label></li>
        <li><i>用药方法：</i><label><select name="" id="usemethod"><option value="1">
        	刘德华
        </option></select></label></li>
        <li><i>用药次数：</i><label><input name="" id="drugTimes" class="numeral" type="text"></label></li>
        <li><i>单次剂量：</i><label><input name="" id="singledose" class="numeral" type="text"></label></li>
        <li id="medicineunit"><i>单位：</i><label><select name="" class="unit"><option value="1">
        	刘德华
        </option><option>张三</option><option>李四</option></select></label></li>
        <li id="itemunit" style="display:none;"><i>单位：</i><label><select name="" class="unit"><option value="1">
            刘德华
        </option></select></label></li>
        <li><i>结果/剂量：</i><label><span id="result"></span></label></li>
        <li class="h65"><i>备注：</i><label><textarea name="" cols="" rows=""id="note" >12323</textarea></label></li>
        <li class="error-out"><span class="error-text" style="display:none;"></span></li>
        <input type="hidden" id="state" value="计划">
    </ul>
    <div class="text-c mar-b20"><a href="javascript:;" class="green-but" id="saveProject">保存</a>&nbsp;<a href="javascript:;" class="black-but" id="cancel">取消</a></div>
</form>
</div>
<?php include("include-dialog-foot.php"); ?>