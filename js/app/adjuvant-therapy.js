define([
	'jquery',
	'app/common',
	'app/util',
	'jqtmpl',
	'pkg/DatePicker/app',
	'pkg/DateFormat/app',
	'pkg/Uploadify/app',
	'json',
	'artDialog',
	'iframe'
], function($, common) {

	"use strict";

	/*****************约诊列表**********************************/
	var AppointmentList = {
		init: function() {

			$('#file_upload').uploadify({
				height: 25,
				width: 100,
				'buttonText': '上传文件',
				'multi': false,
				'fileTypeExts': '*.doc; *.docx; *.xls; *.xlsx; *.pdf',
				'swf': $('#swf').val(),
				'uploader': $('#file_upload').attr('data-action'),
				'onUploadError': function(file, errorCode, errorMsg, errorString) {
					art.dialog({
						content: '上传失败！请重试！',
						icon: 'error',
						time: 1
					});
					// art.dialog.tips('上传失败！请重试！', 1.5);
				},
				'onSelectError': function(file) {
					var fn = file.name;
					var exts = ['doc', 'docx', 'xls', 'xlsx', 'pdf'];
					var ext = fn.lastIndexOf('.');
					ext = fn.substring(ext + 1);
					if ($.inArray(ext, exts) === -1)
						art.dialog.alert('只允许上传 doc,docx,xls,xlsx,pdf 类型的文件！');
				},
				'onUploadSuccess': function(file, data, response) {
					var re = JSON.parse(data);
					var msg = re.status;

					if (msg.split('|')[0] == 1) {
						// $('.uploadify').css('visibility', 'hidden');
						/*setTimeout(function() {
							$('.uploadify').hide();
						}, 100);*/

						$('.upload-tip').hide();
						$('.file-oper').show();
						$('#file-url').val(msg.split('|')[1]);

						art.dialog.data('fileUrl', re.fileUrl);
					} else {
						art.dialog({
							content: re.status.msg,
							icon: 'error',
							time: 1
						});
						// art.dialog.tips(re.status.msg, 1.5);
					}
				}
			});

			var startDate = $('#start-date');
			var endDate = $('#end-date');
			if (startDate.length > 0) {
				if (!startDate.val()) {
					/*var d = (new Date()).getDate() - 7;
					d = (new Date()).setDate(d);*/
					startDate.val($.formatDate(new Date(), 'yyyy-MM-dd'));
				}
				if (endDate.length > 0) {
					startDate.datePicker({
						// minDate: '#F{$dp.$D(\'end-date\',{d:-7})}',
						maxDate: '#F{$dp.$D(\'end-date\')}',
						onpicked: function() {
							if ($('#end-date').val() === "")
								$dp.$('end-date').focus();
						},
						dateFmt: 'yyyy-MM-dd'
					});
				} else {
					startDate.datePicker({
						dateFmt: 'yyyy-MM-dd'
					});
				}
			}

			if (endDate.length > 0) {
				if (!endDate.val()) {
					endDate.val($.formatDate(new Date(), 'yyyy-MM-dd'));
				}
				if (startDate.length > 0) {
					endDate.datePicker({
						minDate: '#F{$dp.$D(\'start-date\')}',
						// maxDate: '#F{$dp.$D(\'start-date\',{d:7})}',
						onpicked: function() {
							if ($('#start-date').val() === "")
								$dp.$('start-date').focus();
						},
						dateFmt: 'yyyy-MM-dd'
					});
				} else {
					endDate.datePicker({
						dateFmt: 'yyyy-MM-dd'
					});
				}
			}

			$('.edit').click(function() {
				var url = $(this).attr('data-href');
				art.dialog.open(url, {
					title: '编辑约诊',
					height: 600,
					widht: 400,
					lock: true
				});
			});

			$('.appointment').click(function() {
				var url = $(this).attr('data-href');
				art.dialog.open(url, {
					title: '新增约诊',
					height: 600,
					widht: 400,
					lock: true
				});
			});

			$('#date').datePicker({
				dateFmt: 'yyyy-MM-dd'
			});

			// 根据科室选择医生
			$('#departments').change(function() {
				var api = $(this).attr('data-href');
				var department = $(this).children('option:selected').text();
				var departmentId = $(this).children('option:selected').val();
				$.ajax(common.ajaxCall({
					url: api,
					data: {
						departmentId: departmentId
					},
					type: 'post',
					success: function(data) {
						var ds = data.ds;
						var str = '<option value="0">请选择</option>';
						for (var i = ds.length - 1; i >= 0; i--) {
							var item = ds[i];
							if (item.departmentId == departmentId) {
								str += '<option value="' + item.doctorId + '">' + item.doctorName + '</option>';
							}
						}
						$('#doctor').empty().append(str);
						var doctorId = $('#doctorId').val();
						$('#doctor').children('option[value="' + doctorId + '"]').prop('selected', true);
					},
					error: function(msg) {
						alert(msg);
					}
				}));
			}).trigger('change');

			$(document).delegate('#saveAppointment', 'click', function() {
				var tarForm = $('#include-edit-appointment');
				if (!tarForm.doValidate())
					return;

				var api = $(this).attr('data-action');
				$.ajax(common.ajaxCall({
					url: api,
					data: tarForm.serialize(),
					type: 'post',
					success: function() {
						top.location.reload();
					},
					error: function(msg) {
						alert(msg);
					}
				}));
			})
				.delegate('#cancel', 'click', function() {
					art.dialog.close();
				})
				.delegate('.delete-item', 'click', function() {
					var api = $(this).attr('data-action');
					var callback = function() {
						$.ajax(common.ajaxCall({
							url: api,
							type: 'post',
							success: function() {
								top.location.reload();
							},
							error: function(msg) {
								alert(msg);
							}
						}));
					};
					$(this).dialogConfirm(callback);
				});


			$('#home_scheme').change(function() {
				var schemeId = $(this).children('option:selected').val();
				var patientId = $(this).attr('data');
				var api = $(this).attr('data-action');
				$.ajax(common.ajaxCall({
					url: api,
					data: {
						schemeId: schemeId,
						patientId: patientId
					},
					success: function(data) {
						var ds = data.ds;
						$('#doctor').text(ds[0].doctorName);
						$('#times').text(ds[0].treateCourseNum);
					},
					error: function(msg) {
						alert(msg);
					}
				}));
			});

			// 全选
			$('#checkAll').click(function() {
				var ck = this.checked;
				$('.tr-hover input:checkbox').prop("checked", ck);
			});

			// 确认
			$('#confirm').click(function() {
				var api = $(this).attr('data-action');
				var data = [];
				$('.tr-hover input:checkbox:checked').each(function() {
					data.push($(this).attr('data-id'));
				});

				$.ajax(common.ajaxCall({
					url: api,
					data: {
						resultJson: JSON.stringify(data)
					},
					success: function() {
						location.reload();
					},
					error: function(msg) {
						alert(msg);
					}
				}));
			});
		}
	};

	/****************患者列表********************************/
	var PatientList = {
		init: function() {

		},
		homePage: function() {


		},
		record: function() {
			$('#add_record').click(function() {
				var url = $(this).attr('data-href');
				art.dialog.open(url, {
					width: 400,
					height: 280,
					title: '新增医疗记录',
					lock: true
				});
			});
			$('.add').click(function() {
				top.location.href = $(this).attr('data-href');
			});

			// 回到顶部
			$(document).delegate('.return-top', 'click', function() {
				// document.body.scrollTop = document.documentElement.scrollTop = 0;
				$('body,html').animate({
					scrollTop: 0
				}, 1000);
				return false;
			})
				.delegate('.navigator', 'click', function() {
					$(this).siblings().removeClass('now').end().addClass('now');
				})
				.delegate('.remark', 'click', function() {
					var remark = $(this).parent().next('li');
					if (remark.is(':hidden')) {
						$(this).text('取消备注');
						remark.show(400, 'swing');
					} else {
						$(this).text('添加备注');
						remark.hide(400).children().val('');
					}
				});

			// 添加面诊
			var disease = $('#disease-item');
			if (disease.length > 0) {
				var templateId = $('#templateId').val();
				var medicalrecordId = $('#medicalrecordId').val();
				var api = disease.attr('data-action');
				$.ajax(common.ajaxCall({
					url: api,
					type: 'post',
					data: {
						templateId: templateId,
						medicalrecordId: medicalrecordId
					},
					success: function(data) {
						var ds = data.ds;
						var a = [],
							b = [];
						for (var i = 0; i < ds.length; i++) {
							var item = ds[i];
							switch (item.label) {
								case 0:
									a.push(item);
									break;
								case 1:
									b.push(item);
									break;
							}
						}
						var html = '',
							str = '';
						for (i = 0; i < a.length; i++) {
							if (html.indexOf(a[i].catlogName) > -1) {
								continue;
							}
							html += '<a href="#tit_' + i + '" class="navigator">' + a[i].catlogName + '</a>';
							str += '<div class="hr-div mar-t10" data-catlogId="' + a[i].catlogId + '"><span id="tit_' + i + '" name="tit_' + i + '">' + a[i].catlogName + '</span><hr/></div><div class="h-auto mar-t10"></div>';
						}
						html += '<a href="javascript:;" class="last-no return-top" title="返回顶部"></a>';
						$('.fixed-nav').empty().append(html).after(str);
						var answerCat = function(demo) {
							var html;
							switch (demo.answerCatlog) {
								case '文本框':
									html = '<ul data-cfg={"catlogId":' + demo.catlogId + ',"problemDesc":"' + demo.problemDesc + '","answerCatlog":"' + demo.answerCatlog + '","templateId":' + demo.templateId + ',"problemId":' + demo.problemId + '} class="question-list mar-t10"><li>' + demo.problemDesc + '</li><li><textarea name="" cols="" rows="" class="result">' + demo.defaultValue + '</textarea></li></ul>';
									break;
								case '是/否':
									html = '<ul data-cfg={"catlogId":' + demo.catlogId + ',"problemDesc":"' + demo.problemDesc + '","answerCatlog":"' + demo.answerCatlog + '","templateId":' + demo.templateId + ',"problemId":' + demo.problemId + '} class="question-list mar-t10"><li>' + demo.problemDesc + '</li><li><label class="f-l"><select name="" class="result"><option value="1" ' + (demo.defaultValue == "1" ? "selected" : "") + '>是</option><option value="0" ' + (demo.defaultValue == "0" ? "selected" : "") + '>否</option></select></label></li></ul>';
									break;
								case '数字':
									html = '<ul data-cfg={"catlogId":' + demo.catlogId + ',"problemDesc":"' + demo.problemDesc + '","answerCatlog":"' + demo.answerCatlog + '","templateId":' + demo.templateId + ',"problemId":' + demo.problemId + '} class="question-list mar-t10"><li>' + demo.problemDesc + '</li><li><textarea name="" cols="" rows="" class="result" class="numeral">' + demo.defaultValue + '</textarea></li></ul>';
									break;
								case '日期':
									html = '<ul data-cfg={"catlogId":' + demo.catlogId + ',"problemDesc":"' + demo.problemDesc + '","answerCatlog":"' + demo.answerCatlog + '","templateId":' + demo.templateId + ',"problemId":' + demo.problemId + '} class="question-list mar-t10"><li>' + demo.problemDesc + '</li><li><label class="f-l"><input class="Wdate result selectDate" name="" value="' + demo.defaultValue + '" style="" type="text"></label></li></ul>';
									break;
								case '单选择下拉框':
									var value = demo.chooseValue.split(';');
									html = '<ul data-cfg={"catlogId":' + demo.catlogId + ',"problemDesc":"' + demo.problemDesc + '","answerCatlog":"' + demo.answerCatlog + '","templateId":' + demo.templateId + ',"problemId":' + demo.problemId + '} class="question-list mar-t10"><li>' + demo.problemDesc + '</li><li><label class="f-l"><select name="" class="result">';
									for (var j = 0; j < value.length; j++) {
										html += '<option value="' + value[j] + '"' + (demo.defaultValue == value[j] ? "selected" : "") + '>' + value[j] + '</option>';
									}
									html += '</select></label><a href="javascript:;" class="f-r green-but remark">取消备注</a></li><li><textarea name="" cols="" rows="" class="note"></textarea></li></ul>';
									break;
							}
							return html;
						};
						for (i = 0; i < a.length; i++) {
							if (!a[i].problemDesc)
								continue;
							html = answerCat(a[i]);
							$('.hr-div[data-catlogId=' + a[i].catlogId + ']').next().append(html);
						}
						for (i = 0; i < b.length; i++) {
							if ($('.hr-div[data-catlogId=' + b[i].preCatlogId + ']').next().children('h3').text().indexOf(b[i].catlogName) > -1)
								continue;
							$('.hr-div[data-catlogId=' + b[i].preCatlogId + ']').next().append('<h3 data-catlogId="' + b[i].catlogId + '"><a href="javascript:;" class="green-font">' + b[i].catlogName + '：</a></h3>');
						}
						for (i = 0; i < b.length; i++) {
							if (!b[i].problemDesc)
								continue;
							html = answerCat(b[i]);
							$('.hr-div[data-catlogId=' + b[i].preCatlogId + ']').next().children('h3[data-catlogId=' + b[i].catlogId + ']').after(html);
						}
						$('.selectDate').datePicker({
							dateFmt: 'yyyy-MM-dd'
						});
					},
					error: function(msg) {
						alert(msg);
					}
				}));
			}

			// 编辑面诊
			var editDiagnose = $('#disease-item-update');
			if (editDiagnose.length > 0) {
				templateId = $('#templateId').val();
				medicalrecordId = $('#medicalrecordId').val();
				var flag = $('#flag').val();
				var consultRecordId = $('#consultRecordId').val();
				var url = editDiagnose.attr('data-action');
				$.ajax(common.ajaxCall({
					url: url,
					type: 'post',
					data: {
						templateId: templateId,
						medicalrecordId: medicalrecordId
					},
					success: function(data) {
						var ds = data.ds;
						var a = [],
							b = [];
						for (var i = 0; i < ds.length; i++) {
							var item = ds[i];
							switch (item.label) {
								case 0:
									a.push(item);
									break;
								case 1:
									b.push(item);
									break;
							}
						}
						var html = '',
							str = '';
						for (i = 0; i < a.length; i++) {
							if (html.indexOf(a[i].catlogName) > -1) {
								continue;
							}
							html += '<a href="#tit_' + i + '" class="navigator">' + a[i].catlogName + '</a>';
							str += '<div class="hr-div mar-t10" data-catlogId="' + a[i].catlogId + '"><span id="tit_' + i + '" name="tit_' + i + '">' + a[i].catlogName + '</span><hr/></div><div class="h-auto mar-t10"></div>';
						}
						html += '<a href="javascript:;" class="last-no return-top" title="返回顶部"></a>';
						$('.fixed-nav').empty().append(html).after(str);
						var answerCat = function(demo) {
							var html;
							if ($('#isEdit').val() == 'false') {
								switch (demo.answerCatlog) {
									case '文本框':
										html = '<ul data-cfg={"catlogId":' + demo.catlogId + ',"problemDesc":"' + demo.problemDesc + '","answerCatlog":"' + demo.answerCatlog + '","templateId":' + demo.templateId + ',"problemId":' + demo.problemId + '} class="question-list mar-t10"><li>' + demo.problemDesc + '</li><li><textarea name="" cols="" rows="" class="result" readonly>' + demo.result + '</textarea></li></ul>';
										break;
									case '是/否':
										html = '<ul data-cfg={"catlogId":' + demo.catlogId + ',"problemDesc":"' + demo.problemDesc + '","answerCatlog":"' + demo.answerCatlog + '","templateId":' + demo.templateId + ',"problemId":' + demo.problemId + '} class="question-list mar-t10"><li>' + demo.problemDesc + '</li><li><label class="f-l"><select name="" class="result" disabled><option value="1" ' + (demo.result == "1" ? "selected" : "") + '>是</option><option value="0" ' + (demo.result == "0" ? "selected" : "") + '>否</option></select></label></li></ul>';
										break;
									case '数字':
										html = '<ul data-cfg={"catlogId":' + demo.catlogId + ',"problemDesc":"' + demo.problemDesc + '","answerCatlog":"' + demo.answerCatlog + '","templateId":' + demo.templateId + ',"problemId":' + demo.problemId + '} class="question-list mar-t10"><li>' + demo.problemDesc + '</li><li><textarea name="" cols="" rows="" class="result" class="numeral" readonly>' + demo.result + '</textarea></li></ul>';
										break;
									case '日期':
										html = '<ul data-cfg={"catlogId":' + demo.catlogId + ',"problemDesc":"' + demo.problemDesc + '","answerCatlog":"' + demo.answerCatlog + '","templateId":' + demo.templateId + ',"problemId":' + demo.problemId + '} class="question-list mar-t10"><li>' + demo.problemDesc + '</li><li><label class="f-l"><input class="Wdate" class="result selectDate" name="" value="' + demo.result + '" style="" type="text" readonly></label></li></ul>';
										break;
									case '单选择下拉框':
										var value = demo.chooseValue.split(';');
										html = '<ul data-cfg={"catlogId":' + demo.catlogId + ',"problemDesc":"' + demo.problemDesc + '","answerCatlog":"' + demo.answerCatlog + '","templateId":' + demo.templateId + ',"problemId":' + demo.problemId + '} class="question-list mar-t10"><li>' + demo.problemDesc + '</li><li><label class="f-l"><select name="" class="result" disabled>';
										for (var j = 0; j < value.length; j++) {
											html += '<option value="' + value[j] + '"' + (demo.result == value[j] ? "selected" : "") + '>' + value[j] + '</option>';
										}
										html += '</select></label></li>';
										if (demo.note) {
											html += '<li><textarea name="" cols="" rows="" class="note" readonly>' + demo.note + '</textarea></li></ul>';
										}
										break;
								}
							} else {
								switch (demo.answerCatlog) {
									case '文本框':
										html = '<ul data-cfg={"catlogId":' + demo.catlogId + ',"problemDesc":"' + demo.problemDesc + '","answerCatlog":"' + demo.answerCatlog + '","templateId":' + demo.templateId + ',"problemId":' + demo.problemId + '} class="question-list mar-t10"><li>' + demo.problemDesc + '</li><li><textarea name="" cols="" rows="" class="result">' + demo.result + '</textarea></li></ul>';
										break;
									case '是/否':
										html = '<ul data-cfg={"catlogId":' + demo.catlogId + ',"problemDesc":"' + demo.problemDesc + '","answerCatlog":"' + demo.answerCatlog + '","templateId":' + demo.templateId + ',"problemId":' + demo.problemId + '} class="question-list mar-t10"><li>' + demo.problemDesc + '</li><li><label class="f-l"><select name="" class="result"><option value="1" ' + (demo.result == "1" ? "selected" : "") + '>是</option><option value="0" ' + (demo.result == "0" ? "selected" : "") + '>否</option></select></label></li></ul>';
										break;
									case '数字':
										html = '<ul data-cfg={"catlogId":' + demo.catlogId + ',"problemDesc":"' + demo.problemDesc + '","answerCatlog":"' + demo.answerCatlog + '","templateId":' + demo.templateId + ',"problemId":' + demo.problemId + '} class="question-list mar-t10"><li>' + demo.problemDesc + '</li><li><textarea name="" cols="" rows="" class="result" class="numeral">' + demo.result + '</textarea></li></ul>';
										break;
									case '日期':
										html = '<ul data-cfg={"catlogId":' + demo.catlogId + ',"problemDesc":"' + demo.problemDesc + '","answerCatlog":"' + demo.answerCatlog + '","templateId":' + demo.templateId + ',"problemId":' + demo.problemId + '} class="question-list mar-t10"><li>' + demo.problemDesc + '</li><li><label class="f-l"><input class="Wdate" class="result selectDate" name="" value="' + demo.result + '" style="" type="text"></label></li></ul>';
										break;
									case '单选择下拉框':
										var value = demo.chooseValue.split(';');
										html = '<ul data-cfg={"catlogId":' + demo.catlogId + ',"problemDesc":"' + demo.problemDesc + '","answerCatlog":"' + demo.answerCatlog + '","templateId":' + demo.templateId + ',"problemId":' + demo.problemId + '} class="question-list mar-t10"><li>' + demo.problemDesc + '</li><li><label class="f-l"><select name="" class="result">';
										for (var j = 0; j < value.length; j++) {
											html += '<option value="' + value[j] + '"' + (demo.result == value[j] ? "selected" : "") + '>' + value[j] + '</option>';
										}
										html += '</select></label><a href="javascript:;" class="f-r green-but remark">取消备注</a></li><li><textarea name="" cols="" rows="" class="note">' + demo.note + '</textarea></li></ul>';
										break;
								}
							}
							return html;
						};
						for (i = 0; i < a.length; i++) {
							if (!a[i].problemDesc)
								continue;
							html = answerCat(a[i]);
							$('.hr-div[data-catlogId=' + a[i].catlogId + ']').next().append(html);
						}
						for (i = 0; i < b.length; i++) {
							if ($('.hr-div[data-catlogId=' + b[i].preCatlogId + ']').next().children('h3').text().indexOf(b[i].catlogName) > -1)
								continue;
							$('.hr-div[data-catlogId=' + b[i].preCatlogId + ']').next().append('<h3 data-catlogId="' + b[i].catlogId + '"><a href="javascript:;" class="green-font">' + b[i].catlogName + '：</a></h3>');
						}
						for (i = 0; i < b.length; i++) {
							if (!b[i].problemDesc)
								continue;
							html = answerCat(b[i]);
							$('.hr-div[data-catlogId=' + b[i].preCatlogId + ']').next().children('h3[data-catlogId=' + b[i].catlogId + ']').after(html);
						}

					},
					error: function(msg) {
						alert(msg);
					}
				}));
				if ($('#isEdit').val() == 'false') {
					$('#saveDiagnose').hide();
				}
			}

			$('#saveDiagnose').click(function() {
				var msg = [],
					item;
				$('.problem-item ul').each(function() {
					var result, note = '';
					item = $.parseJSON($(this).attr('data-cfg'));
					if (item.answerCatlog === '文本框' || item.answerCatlog === '数字' || item.answerCatlog === '日期') {
						result = $(this).find('.result').val();
					}
					if (item.answerCatlog === '是/否')
						result = $(this).find('.result').children('option:selected').val();
					if (item.answerCatlog === '单选择下拉框') {
						result = $(this).find('.result').children('option:selected').val();
						note = $(this).find('.note').val();
					}
					var ms = {
						catlogId: item.catlogId,
						problemDesc: item.problemDesc,
						problemId: item.problemId,
						result: result,
						note: note
					};
					msg.push(ms);
				});
				var data = {
					templateId: $('#templateId').val(),
					templateName: $('#templateName').val(),
					consultId: $('#consultId').val(),
					problems: msg
				};
				var tarForm = $('#form-patient-info');

				var api = $(this).attr('data-action');
				$.ajax(common.ajaxCall({
					url: api,
					type: 'post',
					data: {
						scheme: tarForm.serialize(),
						resultJson: JSON.stringify(data)
					},
					success: function() {
						$(this).tips('success', '保存成功！');
						setTimeout(function() {
							location.href = $('#saveDiagnose').attr('data-href');
						}, 500);
					},
					error: function(msg) {
						alert(msg);
					}
				}));
			});


		},
		process: function() { //治疗过程

			$('.add-ylfa-list h3').click(function() {
				if ($(this).hasClass('bg-f5')) {
					$('.hov-bg-green').removeClass('hov-bg-green').addClass('bg-f5').next('ul').hide(400);
					$(this).next('ul').show(400);
				} else {
					$(this).next('ul').hide(400);
				}
				$(this).toggleClass('hov-bg-green').toggleClass('bg-f5');
			});

			var dateObj = ['#first_day', '#check_date', '#effect_date', '#luteal', '#collect_date', '#re_live_date', '#move_date', '#pregnant_check_date', '#pregnant_confirm_date', '#expected_date', '#cancel_date', '#project_date', '#plan_date'];
			$.each(dateObj, function(i, v) {
				$(v).datePicker({
					dateFmt: 'yyyy-MM-dd'
				});
			});
			$('#terapy_start_date').datePicker({
				dateFmt: 'yyyy-MM-dd',
				onpicked: function() {
					$dp.$('terapy_start_date_hou').value = (new Date()).getHours();
					$dp.$('terapy_start_date_min').value = (new Date()).getMinutes();
				}
			});
			$('#deal_start_date').datePicker({
				dateFmt: 'yyyy-MM-dd',
				onpicked: function() {
					$dp.$('deal_start_date_hou').value = (new Date()).getHours();
					$dp.$('deal_start_date_min').value = (new Date()).getMinutes();
				}
			});

			// 取消治疗
			$(document).delegate('#cancel_terapy', 'click', function() {
				if (this.checked)
					$('#cancel_date,#cancel_reason').removeAttr('disabled');
				else
					$('#cancel_date,#cancel_reason').val('').attr('disabled', true);
			})
				.delegate('#checkAll', 'click', function() {
					var ck = this.checked;
					$('.tr-hover input[type="checkbox"]').prop('checked', ck);
				})
				.delegate('#saveTerpay', 'click', function() {
					var tarForm = $('#form-add-terpay');
					if (!tarForm.doValidate())
						return;


					var data = [];
					$('.table-list .tr-hover').each(function() {
						var _parents = $(this);
						var ms = {
							stageId: _parents.find('.stageid').val(),
							date: _parents.find('.date').text(),
							processDay: _parents.find('.processday').text(),
							hour: _parents.find('.hour').text(),
							min: _parents.find('.min').text(),
							typeId: _parents.find('.typeid').val(),
							itemId: _parents.find('.itemid').val(),
							result: _parents.find('.result').text(),
							agentsId: _parents.find('.agentsid').val(),
							useMethodId: _parents.find('.usemethodid').val(),
							drugTimes: _parents.find('.drugtimes').val(),
							singleDose: _parents.find('.singledose').val(),
							unitId: _parents.find('.unitid').val(),
							note: _parents.find('.note').val(),
							status: _parents.find('.status').text()
						};
						data.push(ms);
					});

					var url = $(this).attr('data-href');
					var api = $(this).attr('data-action');
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						data: {
							project: tarForm.serialize(),
							detail: JSON.stringify(data)
						},
						success: function() {
							$(this).tips('success', '保存成功！', 500);
							setTimeout(function() {
								location.href = url;
							}, 500);
						},
						error: function(msg) {
							alert(msg);
						}
					}));
				})
				.delegate('#clinic_bill', 'click', function() {
					var tarForm = $('#form-add-terpay');
					if (!tarForm.doValidate())
						return false;


					var data = [],
						saveData = [],
						order = [];
					$('.table-list .tr-hover').each(function() {
						var _parents = $(this);
						var ms = {
							stageId: _parents.find('.stageid').val(),
							date: _parents.find('.date').text(),
							processDay: _parents.find('.processday').text(),
							hour: _parents.find('.hour').text(),
							min: _parents.find('.min').text(),
							typeId: _parents.find('.typeid').val(),
							itemId: _parents.find('.itemid').val(),
							result: _parents.find('.result').text(),
							agentsId: _parents.find('.agentsid').val(),
							useMethodId: _parents.find('.usemethodid').val(),
							drugTimes: _parents.find('.drugtimes').val(),
							singleDose: _parents.find('.singledose').val(),
							unitId: _parents.find('.unitid').val(),
							note: _parents.find('.note').val(),
							status: _parents.find('.status').text()
						};
						saveData.push(ms);
						if (!$(this).find('input:checkbox').prop('checked'))
							return;
						var slms = {
							typeId: parseInt(_parents.find('.typeid').val(), 10),
							itemId: parseInt(_parents.find('.itemid').val(), 10)
						};
						data.push(slms);
						order.push(_parents.find('.typeid').val());
					});

					var url = $(this).attr('data-href');
					// 根据typeId确定跳转到门诊开单对应的tab
					order.sort();
					var tab = order[0] ? (order[0] - 1) : 0;
					/*if(url.indexOf('?') !== -1)
						url = url + '&tab=' + tab;
					else
						url = url + '?tab=' + tab;*/

					var api = $(this).attr('data-action');
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						data: {
							project: tarForm.serialize(),
							detail: JSON.stringify(saveData),
							items: JSON.stringify(data)
						},
						success: function() {
							// $(this).tips('success', '保存成功！', 500);
						},
						error: function(msg) {
							alert(msg);
							return false;
						}
					}));
				})
				.delegate('#addProject', 'click', function() {
					var date = [];
					date[0] = $('#terapy_start_date').val();
					date[1] = $('#first_day').val();
					date[2] = $('#deal_start_date').val();
					date[3] = $('#luteal').val();

					art.dialog.data('date', date);
					var url = $(this).attr('data-href');
					art.dialog.open(url, {
						title: '新增项目',
						width: 400,
						height: 780,
						lock: true,
						init: function() {
							var date = art.dialog.data('date');
							var _iframe = this.iframe.contentWindow.document;
							$('#step', _iframe).change(function() {
								$('#project_date,#deal_days', _iframe).val('');
								$('#deal_days', _iframe).val('').removeAttr('readonly');
							});
							$('#project_date', _iframe).blur(function() {
								var stepDate = date[parseInt($('#step', _iframe).children('option:selected').val(), 10) - 1];
								stepDate = $.parseDate(stepDate);
								if (!stepDate)
									return;

								var project_date = $.parseDate($(this).val());
								if (project_date) {
									var day = $.dateDiff('d', stepDate, project_date);
									if ($('#step', _iframe).children('option:selected').val() !== '4')
										day = day + 1;
									$('#deal_days', _iframe).val(day).attr('readonly', true);
								} else {
									$('#deal_days', _iframe).val('').removeAttr('readonly');
								}
							});
							$('#deal_days', _iframe).blur(function() {
								var stepDate = date[parseInt($('#step', _iframe).children('option:selected').val(), 10) - 1];
								stepDate = $.parseDate(stepDate);
								if (!stepDate)
									return;

								var deal_days = parseInt($('#deal_days', _iframe).val(), 10);
								if (deal_days) {
									if ($('#step', _iframe).children('option:selected').val() !== '4')
										$('#project_date', _iframe).val($.formatDate(new Date(stepDate.setDate(stepDate.getDate() + (deal_days - 1))), 'yyyy-MM-dd'));
									else
										$('#project_date', _iframe).val($.formatDate(new Date(stepDate.setDate(stepDate.getDate() + deal_days)), 'yyyy-MM-dd'));
								}
							});
							/*$('#type', _iframe).change(function() {
								var typeId = $(this).children('option:selected').val();

								if (typeId === '1') {
									$('#medicineunit', _iframe).show();
									$('#itemunit', _iframe).hide();
								} else {
									$('#itemunit', _iframe).show();
									$('#medicineunit', _iframe).hide();
								}

								var api = $(this).attr('data-action');
								$.ajax(common.ajaxCall({
									url: api,
									type: 'post',
									data: {
										param: typeId
									},
									success: function(data) {
										var ds = data.ds;
										var html = '<option value="0">请选择</option>';
										for (var i = ds.length - 1; i >= 0; i--) {
											var item = ds[i];
											html += '<option value="' + item.itemId + '">' + item.itemName + '</option>';
										}
										$('#project', _iframe).empty().append(html);
									},
									error: function(msg) {
										alert(msg);
									}
								}));
							}).trigger('change');*/


						}
					});
				})
				.delegate('.editProject', 'click', function() {
					var date = [];
					date[0] = $('#terapy_start_date').val();
					date[1] = $('#first_day').val();
					date[2] = $('#deal_start_date').val();
					date[3] = $('#luteal').val();

					$('.tr-hover').removeClass('flag');
					var _parents = $(this).parents('.tr-hover:first');
					_parents.addClass('flag');
					var data = {
						stageid: _parents.find('.stageid').val(),
						date: _parents.find('.date').text(),
						processday: _parents.find('.processday').text(),
						hour: _parents.find('.hour').text(),
						min: _parents.find('.min').text(),
						typeid: _parents.find('.typeid').val(),
						item: _parents.find('.item').text(),
						itemid: _parents.find('.itemid').val(),
						result: _parents.find('.result').text(),
						agentsid: _parents.find('.agentsid').val(),
						usemethodid: _parents.find('.usemethodid').val(),
						drugtimes: _parents.find('.drugtimes').val(),
						singledose: _parents.find('.singledose').val(),
						unitid: _parents.find('.unitid').val(),
						note: _parents.find('.note').val(),
						status: _parents.find('.status').text()
					};
					var test = _parents.find('.project_date').text();
					art.dialog.data('project', data);
					art.dialog.data('date', date);
					var url = $(this).attr('data-href');
					art.dialog.open(url, {
						title: '编辑项目',
						width: 400,
						height: 780,
						lock: true,
						init: function() {
							var project = art.dialog.data('project');
							var iframe = this.iframe.contentWindow.document;
							$('#step', iframe).children('option[value=' + project.stageid + ']').prop('selected', true);
							$('#project_date', iframe).val(project.date);
							$('#deal_days', iframe).val(project.processday);
							$('#date_hours', iframe).val(project.hour);
							$('#date_minutes', iframe).val(project.min);
							$('#type', iframe).children('option[value=' + project.typeid + ']').prop('selected', true);
							$('#project', iframe).val(project.item);
							$('#projectId', iframe).val(project.itemid);
							$('#medicinesType', iframe).children('option[value=' + project.agentsid + ']').prop('selected', true);
							$('#usemethod', iframe).children('option[value=' + project.usemethodid + ']').prop('selected', true);
							$('#drugTimes', iframe).val(project.drugtimes);
							$('#singledose', iframe).val(project.singledose);
							$('.unit:visible', iframe).children('option[value=' + project.unitid + ']').prop('selected', true);
							$('#result', iframe).text(project.result);
							$('#note', iframe).val(project.note);
							$('#state', iframe).val(project.status);
							// 编辑模式
							$('#editModul', iframe).val('true');

							var date = art.dialog.data('date');
							$('#step', iframe).change(function() {
								$('#project_date,#deal_days', iframe).val('');
								$('#deal_days', iframe).val('').removeAttr('readonly');
							});
							$('#project_date', iframe).blur(function() {
								var stepDate = date[parseInt($('#step', iframe).children('option:selected').val(), 10) - 1];
								stepDate = $.parseDate(stepDate);
								if (!stepDate)
									return;

								var project_date = $.parseDate($(this).val());
								if (project_date) {
									var day = $.dateDiff('d', stepDate, project_date);
									if ($('#step', iframe).children('option:selected').val() !== '4')
										day = day + 1;
									$('#deal_days', iframe).val(day).attr('readonly', true);
								} else {
									$('#deal_days', iframe).val('').removeAttr('readonly');
								}
							});
							$('#deal_days', iframe).blur(function() {
								var stepDate = date[parseInt($('#step', iframe).children('option:selected').val(), 10) - 1];
								stepDate = $.parseDate(stepDate);
								if (!stepDate)
									return;

								var deal_days = parseInt($('#deal_days', iframe).val(), 10);
								if (deal_days) {
									if ($('#step', iframe).children('option:selected').val() !== '4')
										$('#project_date', iframe).val($.formatDate(new Date(stepDate.setDate(stepDate.getDate() + (deal_days - 1))), 'yyyy-MM-dd'));
									else
										$('#project_date', iframe).val($.formatDate(new Date(stepDate.setDate(stepDate.getDate() + deal_days)), 'yyyy-MM-dd'));
								}
							});
							/*$('#type', iframe).change(function() {
								var typeId = $(this).children('option:selected').val();
								var api = $(this).attr('data-action');
								$.ajax(common.ajaxCall({
									url: api,
									type: 'post',
									data: {
										param: typeId
									},
									success: function(data) {
										var ds = data.ds;
										var html = '<option value="0">请选择</option>';
										for (var i = ds.length - 1; i >= 0; i--) {
											var item = ds[i];
											if (item.itemId == project.itemid) {
												html += '<option value="' + item.itemId + '" selected>' + item.itemName + '</option>';
												continue;
											}
											html += '<option value="' + item.itemId + '">' + item.itemName + '</option>';
										}
										$('#project', iframe).empty().append(html);
									},
									error: function(msg) {
										alert(msg);
									}
								}));
							}).trigger('change');*/
						}
					});

					// alert($('#date_hours').val());
				})
				.delegate('#chooseTemplate', 'click', function() {
					var date = [];
					date[0] = $('#terapy_start_date').val();
					date[1] = $('#first_day').val();
					date[2] = $('#deal_start_date').val();
					date[3] = $('#luteal').val();
					art.dialog.data('date', date);
					var url = $(this).attr('data-href');
					art.dialog.open(url, {
						title: '选择医疗计划模板',
						width: 400,
						height: 370,
						lock: true,
						init: function() {
							var date = art.dialog.data('date');
							var _iframe = this.iframe.contentWindow.document;
							$('#step', _iframe).change(function() {
								var stepDate = date[parseInt($(this).children('option:selected').val(), 10) - 1];
								if (!stepDate) {
									$('#plan_date', _iframe).val('');
									return;
								}
								$('#plan_date', _iframe).val(stepDate);
							}).trigger('change');
						}
					});
				});


			// 计算结果/剂量
			$('#drugTimes,#singledose').blur(function() {
				var frequency = parseInt($('#drugTimes').val(), 10);
				var dose = parseInt($('#singledose').val(), 10);
				if (!frequency || !dose) {
					$('#result').text('');
					return;
				}
				var total = frequency * dose;
				$('#result').text(total);
			});

			$('#type').change(function() {
				if ($(this).children('option:selected').val() === '1') {
					$('#medicinesType').parents('li:first').show();
					$('#usemethod').parents('li:first').show();
					$('#drugTimes').parents('li:first').show();
					$('#singledose').parents('li:first').show();
					$('#medicineunit').show();
					$('#itemunit').hide();
				} else {
					$('#medicinesType').parents('li:first').hide();
					$('#usemethod').parents('li:first').hide();
					$('#drugTimes').parents('li:first').hide();
					$('#singledose').parents('li:first').hide();
					$('#medicineunit').hide();
					$('#itemunit').show();
				}
			}).trigger('change');

			$('.delete-item').die('click').live('click', function() {
				$(this).parents('.tr-hover:first').remove();
			});

			$('#project').showlist({
				width: 250,
				keyID: 'itemId',
				bindSub: $('#projectId'),
				extraParams: function() {
					var type;
					$('#type').change(function() {
						type = $('#type').children('option:selected').val();
					}).trigger('change');
					return {
						type: type
					};
				},
				selectCallBack: function(d) {
					$('#projectId').val(d.projectId);
				},
				buildHtml: function(ds) {
					var html = '<table cellpadding="0" cellspacing="1" class="table-list ab-table-div-title"><thead><tr><td>项目名称</td><td>单位</td></tr></thead><tbody>';
					for (var i = 0; i < ds.length; i++) {
						var item = ds[i];
						html += '<tr data-id="' + item.itemId + '" data-name="' + item.itemName + '" class="tr-hover"><td>' + item.itemName + '</td><td>' + item.unit + '</td></tr>';
					}
					html += '</tbody></table>';
					return html;
				}
			});

			// var htmlTmpl = '<tr class="tr-hover"><td><input name="" type="checkbox" value=""></td><td class="red-font text-l"><i class="red-block"></i>上官云飞</td><td>2012/12/13</td><td>99</td><td>17:00</td><td>99</td><td></td><td></td><td></td><td><a href="javascript:;" data-href="include-add-terapy.php" class="green-but editProject" title="编辑">编辑</a><a href="javascript:;" class="red-but delete-item" title="删除" data-action="js/mock-data/include-data-example.json">删除</a></td></tr>';

			$('#saveProject').click(function() {

				var tarForm = $('#form-add-project');
				if (!tarForm.doValidate())
					return;
				$('.flag', top.document).remove();
				var data = {
					stage: $('#step').children('option:selected').text(),
					stageid: $('#step').children('option:selected').val(),
					date: $('#project_date').val(),
					processday: $('#deal_days').val(),
					hour: $('#date_hours').val(),
					min: $('#date_minutes').val(),
					type: $('#type').children('option:selected').text(),
					typeid: $('#type').children('option:selected').val(),
					item: $('#project').val(),
					itemid: $('#projectId').val(),
					agentsid: $('#medicinesType').children('option:selected').val(),
					usemethodid: $('#usemethod').children('option:selected').val(),
					drugtimes: $('#drugTimes').val(),
					singledose: $('#singledose').val(),
					unitid: $('.unit:visible').children('option:selected').val(),
					result: $('#result').text(),
					note: $('#note').val(),
					status: $('#state').val()
				};
				$('#compile', top.document).tmpl(data).prependTo($('.table-list', top.document));
				art.dialog.close();
			});

			$('#savePlan').click(function() {
				var tarForm = $('#form-choose-plan');
				var api = $(this).attr('data-action');
				$.ajax(common.ajaxCall({
					url: api,
					data: tarForm.serialize(),
					type: 'post',
					success: function(data) {
						var ds = data.ds;
						for (var i = ds.length - 1; i >= 0; i--) {
							var item = ds[i];
							$('#compile', top.document).tmpl(item).prependTo($('.table-list', top.document));
						}
						art.dialog.close();
					},
					error: function(msg) {
						alert(msg);
					}
				}));
			});
			// 确认项目
			$('#confirm_project').click(function() {
				$('.tr-hover input[type="checkbox"]:checked').each(function() {
					$(this).parents('.tr-hover:first').find('.status').text('确认');
				});
			});

		},
		assay: function() { //化验分析

			$(document).delegate('#chooseTemplate', 'click', function() {
				if ($('#choose_scheme').children('option:selected').val() === '0') {
					art.dialog.alert('请先添加疗程方案！');
					return;
				}
				var url = $(this).attr('data-href');
				art.dialog.open(url, {
					title: '选择医疗计划模板',
					width: 400,
					height: 370,
					lock: true
				});
			})
				.delegate('#addProject', 'click', function() {
					if ($('#choose_scheme').children('option:selected').val() === '0') {
						art.dialog.alert('请先添加疗程方案！');
						return;
					}
					var url = $(this).attr('data-href');
					art.dialog.open(url, {
						title: '新增化验项目',
						width: 400,
						height: 500,
						lock: true
					});
				})
				.delegate('#savePlan', 'click', function() {
					var tarForm = $('#form-choose-plan');
					var api = $(this).attr('data-action');
					var url = $(this).attr('data-href');
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						data: tarForm.serialize(),
						success: function() {
							top.location.href = url;
						},
						error: function(msg) {
							alert(msg);
						}
					}));
				})
				.delegate('#saveProgram', 'click', function() {
					var tarForm = $('#form-add-program');
					if (!tarForm.doValidate())
						return;
					var api = $(this).attr('data-action');
					var url = $(this).attr('data-href');
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						data: tarForm.serialize(),
						success: function() {
							top.location.href = url;
						},
						error: function(msg) {
							alert(msg);
						}
					}));
				})
				.delegate('#checkAll', 'click', function() {
					var ck = this.checked;
					$('.tr-hover input[type="checkbox"]').prop('checked', ck);
				})
				.delegate('#confirm_project', 'click', function() {
					var data = [];
					$('.tr-hover input[type="checkbox"]:checked').each(function() {
						data.push($(this).attr('data-id'));
					});
					var schemeId = $('#choose_scheme').children('option:selected').val();

					var api = $(this).attr('data-action');
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						data: {
							Id: schemeId,
							resultJson: JSON.stringify(data)
						},
						success: function() {
							location.reload();
						},
						error: function(msg) {
							alert(msg);
						}
					}));
				})
				.delegate('#clinic_bill', 'click', function() {
					var data = [];
					$('.table-list .tr-hover').each(function() {
						if (!$(this).find('input:checkbox').prop('checked'))
							return;
						data.push($(this).data('itemid'));
					});
					// var url = $(this).attr('data-href');
					var api = $(this).attr('data-action');
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						data: {
							patientId: parseInt($('#patientId').val(), 10),
							items: JSON.stringify(data)
						},
						success: function() {
							// location.href = url;
						},
						error: function(msg) {
							alert(msg);
							return false;
						}
					}));
				});

			$('#project').showlist({
				width: 250,
				keyID: 'itemId',
				bindSub: $('#projectId'),
				selectCallBack: function(d) {
					$('#projectId').val(d.itemId);
				},
				buildHtml: function(ds) {
					var html = '<table cellpadding="0" cellspacing="1" class="table-list ab-table-div-title"><thead><tr><td>项目名称</td><td>单位</td></tr></thead><tbody>';
					for (var i = 0; i < ds.length; i++) {
						var item = ds[i];
						html += '<tr data-id="' + item.itemId + '" data-name="' + item.itemName + '" class="tr-hover"><td>' + item.itemName + '</td><td>' + item.unit + '</td></tr>';
					}
					html += '</tbody></table>';
					return html;
				},
				extraParams: function() {
					return {
						type: $('#type').val()
					};
				}
			});

			$('.edit').unbind('click').bind('click', function() {
				var url = $(this).attr('data-href');
				art.dialog.open(url, {
					title: '编辑化验项目',
					width: 400,
					height: 500,
					lock: true
				});
			});
		},
		medicines: function() { //治疗药物
			$(document).delegate('#addMedicines', 'click', function() {
				if ($('#choose_scheme').children('option:selected').val() === '0') {
					art.dialog.alert('请先添加疗程方案！');
					return;
				}
				var url = $(this).attr('data-href');
				art.dialog.open(url, {
					title: '新增治疗药物',
					width: 400,
					height: 700,
					lock: true
				});
			})
				.delegate('#chooseTemplate', 'click', function() {
					if ($('#choose_scheme').children('option:selected').val() === '0') {
						art.dialog.alert('请先添加疗程方案！');
						return;
					}
					var url = $(this).attr('data-href');
					art.dialog.open(url, {
						title: '选择医疗计划模板',
						width: 400,
						height: 370,
						lock: true,
						init: function() {
							var _iframe = this.iframe.contentWindow.document;
							$('#treat_step', _iframe).change(function() {
								var stageid = $(this).children('option:selected').val();
								var api = $(this).attr('data-action');
								$.ajax(common.ajaxCall({
									url: api,
									type: 'post',
									data: {
										stageid: stageid
									},
									success: function(data) {
										var ds = data.ds;
										$('#date', _iframe).val(ds);
									},
									error: function(msg) {
										alert(msg);
									}
								}));
							}).trigger('change');
						}
					});
				})
				.delegate('#savePlan', 'click', function() {
					var tarForm = $('#form-choose-plan');
					var api = $(this).attr('data-action');
					var url = $(this).attr('data-href');
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						data: tarForm.serialize(),
						success: function() {
							top.location.href = url;
						},
						error: function(msg) {
							alert(msg);
						}
					}));
				})
				.delegate('#saveMedicines', 'click', function() {
					var tarForm = $('#form-add-medicines');
					var api = $(this).attr('data-action');
					var url = $(this).attr('data-href');
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						data: tarForm.serialize(),
						success: function() {
							top.location.href = url;
						},
						error: function(msg) {
							alert(msg);
						}
					}));
				})
				.delegate('#checkAll', 'click', function() {
					var ck = this.checked;
					$('.tr-hover input[type="checkbox"]').prop('checked', ck);
				})
				.delegate('#confirm_project', 'click', function() {
					var data = [];
					$('.tr-hover input[type="checkbox"]:checked').each(function() {
						data.push($(this).attr('data-id'));
					});
					var schemeId = $('#choose_scheme').children('option:selected').val();

					var api = $(this).attr('data-action');
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						data: {
							Id: schemeId,
							resultJson: JSON.stringify(data)
						},
						success: function() {
							location.reload();
						},
						error: function(msg) {
							alert(msg);
						}
					}));
				})
				.delegate('#clinic_bill', 'click', function() {
					var data = [];
					$('.table-list .tr-hover').each(function() {
						if (!$(this).find('input:checkbox').prop('checked'))
							return;
						data.push($(this).data('medicinesid'));
					});
					// var url = $(this).attr('data-href');
					var api = $(this).attr('data-action');
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						data: {
							patientId: parseInt($('#patientId').val(), 10),
							items: JSON.stringify(data)
						},
						success: function() {
							// location.href = url;
						},
						error: function(msg) {
							alert(msg);
						}
					}));
				});

			$('#frequency,#dose').blur(function() {
				var frequency = parseInt($('#frequency').val(), 10);
				var dose = parseInt($('#dose').val(), 10);
				if (!frequency || !dose) {
					$('#total').text('');
					$('#totalResult').val('');
					return;
				}
				var total = frequency * dose;
				$('#total').text(total);
				$('#totalResult').val(total);
			});

			$('.edit').unbind('click').bind('click', function() {
				var url = $(this).attr('data-href');
				art.dialog.open(url, {
					title: '编辑治疗药物',
					width: 400,
					height: 700,
					lock: true
				});
			});
		},
		ultrasonic: function() { //治疗项目
			$(document).delegate('#addProgram', 'click', function() {
				if ($('#choose_scheme').children('option:selected').val() === '0') {
					art.dialog.alert('请先添加疗程方案！');
					return;
				}
				var url = $(this).attr('data-href');
				art.dialog.open(url, {
					title: '新增B超',
					width: 380,
					height: 460,
					lock: true
				});
			})
				.delegate('#saveProgram', 'click', function() {
					var url = $(this).attr('data-href');
					var tarForm = $('#form-add-ultrasonic');
					var api = $(this).attr('data-action');
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						data: tarForm.serialize(),
						success: function() {
							top.location.href = url;
						},
						error: function(msg) {
							alert(msg);
						}
					}));
				})
				.delegate('#checkAll', 'click', function() {
					var ck = this.checked;
					$('.tr-hover input[type="checkbox"]').prop('checked', ck);
				})
				.delegate('#confirm_project', 'click', function() {
					var data = [];
					$('.tr-hover input[type="checkbox"]:checked').each(function() {
						data.push($(this).attr('data-id'));
					});
					var schemeId = $('#choose_scheme').children('option:selected').val();

					var api = $(this).attr('data-action');
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						data: {
							Id: schemeId,
							resultJson: JSON.stringify(data)
						},
						success: function() {
							location.reload();
						},
						error: function(msg) {
							alert(msg);
						}
					}));
				});
			/*.delegate('#clinic_bill', 'click', function() {
					var data = [];
					$('.table-list .tr-hover').each(function() {
						if (!$(this).find('input:checkbox').prop('checked'))
							return;
						data.push($(this).attr('data-id'));
					});
					var url = $(this).attr('data-href');
					var api = $(this).attr('data-action');
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						data: {
							resultJson: JSON.stringify(data)
						},
						success: function() {
							location.href = url;
						},
						error: function(msg) {
							alert(msg);
						}
					}));
				});*/

			$('#treat-project').showlist({
				width: 250,
				keyID: 'itemId',
				bindSub: $('#projectId'),
				selectCallBack: function(d) {
					$('#projectId').val(d.itemId);
				},
				buildHtml: function(ds) {
					var html = '<table cellpadding="0" cellspacing="1" class="table-list ab-table-div-title"><thead><tr><td>项目名称</td><td>单位</td></tr></thead><tbody>';
					for (var i = 0; i < ds.length; i++) {
						var item = ds[i];
						html += '<tr data-id="' + item.itemId + '" data-name="' + item.itemName + '" class="tr-hover"><td>' + item.itemName + '</td><td>' + item.unit + '</td></tr>';
					}
					html += '</tbody></table>';
					return html;
				},
				extraParams: function() {
					return {
						type: $('#type').val()
					};
				}
			});

			$('.edit').unbind('click').bind('click', function() {
				var url = $(this).attr('data-href');
				art.dialog.open(url, {
					title: '编辑B超',
					width: 380,
					height: 460,
					lock: true
				});
			});
		},
		embryology: function() { //胚胎学

			var editEnable = true;


			$('#addCollect').click(function() {
				var schemeId = $('#choose_scheme').children('option:selected').val();
				if (schemeId === '0') {
					art.dialog.alert('请先添加疗程方案！');
					return false;
				}
				var url = $(this).attr('data-href') + '/' + schemeId;
				location.href = url;
			});

			$('#first_days').datePicker({
				dateFmt: 'yyyy-MM-dd'
			});

			$('#start_dates,#start_date').datePicker({
				dateFmt: 'yyyy-MM-dd',
				onpicked: function() {
					$dp.$('start_date_hou').value = (new Date()).getHours();
					$dp.$('start_date_min').value = (new Date()).getMinutes();
				}
			});

			$('#first_days,#start_dates').blur(function() {
				var first_day = $('#first_days').val();
				var start_date = $('#start_dates').val();
				if (!first_day || !start_date)
					return;
				// var d = $.dateDiff('d', new Date(Date.parse(first_day)), new Date(Date.parse(start_date)));
				var d = $.dateDiff('d', $.parseDate(first_day), $.parseDate(start_date));
				$('#deal_days').text(d);
				$('#save_days').val(d);
			});

			$('#start_date').blur(function() {
				var first_day = $('#first_day').val();
				var start_date = $('#start_date').val();
				if (!first_day || !start_date)
					return;
				// var d = $.dateDiff('d', new Date(Date.parse(first_day)), new Date(Date.parse(start_date)));
				var d = $.dateDiff('d', $.parseDate(first_day), $.parseDate(start_date));
				$('#deal_days').text(d);
				$('#save_days').val(d);
			});
			$('#collect_num').blur(function() {
				var num = parseInt($(this).val(), 10);
				if ($('#dispatcher').attr('data-edit')) { //编辑模式
					var total = parseInt($(this).attr('data-num'), 10);
					var api = $(this).attr('data-action');
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						success: function(data) {
							editEnable = data.ds;
							if (editEnable == true && num < total) {
								art.dialog.alert('请填写大于当前收集卵数目！', function() {
									$('#collect_num').val('');
								});
								return;
							}
							if (num <= total) {
								$('.table-list .tr-hover:gt(' + (num - 1) + ')').remove();
								$('#collect_num').attr('data-num', num);
							}
							if (num >= total) {
								var html = '';
								for (var i = total; i < num; i++) {
									html += '<tr class="tr-hover"><td>' + (i + 1) + '</td><td><input name="" type="text" class="w94-100" value=""></td></tr>';
								}
								$('.table-list tbody').append(html);
							}
						},
						error: function(msg) {
							alert(msg);
						}
					}));
				} else {
					if (num <= 0)
						return;
					var html = '';
					for (var i = 0; i < num; i++) {
						html += '<tr class="tr-hover"><td>' + (i + 1) + '</td><td><input name="" type="text" class="w94-100" value=""></td></tr>';
					}
					$('.table-list tbody').empty().append(html);
				}
			});
			$('#saveCollect').click(function() {
				var tarForm = $('#form-add-collect');
				if (!tarForm.doValidate())
					return;

				var data = [];
				if ($('#dispatcher').attr('data-edit')) {
					$('.table-list tbody tr').each(function() {
						var ms = {
							id: parseInt($(this).attr('data-id') || 0, 10),
							voumCode: parseInt($(this).children('td:first').text(), 10),
							note: $(this).find('input').val()
						};
						data.push(ms);
					});
				} else {
					$('.table-list tbody tr').each(function() {
						var ms = {
							voumCode: parseInt($(this).children('td:first').text(), 10),
							note: $(this).find('input').val()
						};
						data.push(ms);
					});
				}
				var url = $(this).attr('data-href');
				var api = $(this).attr('data-action');
				$.ajax(common.ajaxCall({
					url: api,
					type: 'post',
					data: {
						info: tarForm.serialize(),
						resultJson: JSON.stringify(data)
					},
					success: function() {
						location.href = url;
					},
					error: function(msg) {
						alert(msg);
					}
				}));
			});

			$('#addOperator').click(function() {
				if ($('#choose_scheme').children('option:selected').val() === '0') {
					art.dialog.alert('请先添加疗程方案！');
					return false;
				}
			});

			$(document).delegate('#save_event_one', 'click', function() {
				var tarForm = $('#form-add-embryology');
				if (!tarForm.doValidate())
					return;
				var data = [];
				if ($('#dispatcher').attr('data-edit')) {
					$('.table-list .tr-hover').each(function() {
						var ms = {
							id: parseInt($(this).attr('data-id') || 0, 10),
							voumCode: parseInt($(this).find('.number').text(), 10),
							maturity: parseInt($(this).find('.mature').children('option:selected').val(), 10),
							status: parseInt($(this).find('.status').children('option:selected').val(), 10),
							destiny: parseInt($(this).find('.fate').children('option:selected').val(), 10),
							witness: $(this).find('.witness').val(),
							note: $(this).find('.note').val()
						};
						data.push(ms);
					});
				} else {
					$('.table-list .tr-hover').each(function() {
						var ms = {
							voumCode: parseInt($(this).find('.number').text(), 10),
							maturity: parseInt($(this).find('.mature').children('option:selected').val(), 10),
							status: parseInt($(this).find('.status').children('option:selected').val(), 10),
							destiny: parseInt($(this).find('.fate').children('option:selected').val(), 10),
							witness: $(this).find('.witness').val(),
							note: $(this).find('.note').val()
						};
						data.push(ms);
					});
				}
				var url = $(this).attr('data-href');
				var api = $(this).attr('data-action');
				$.ajax(common.ajaxCall({
					url: api,
					type: 'post',
					data: {
						info: tarForm.serialize(),
						resultJson: JSON.stringify(data)
					},
					success: function() {
						location.href = url;
					},
					error: function(msg) {
						art.dialog.alert(msg);
					}
				}));
			})
				.delegate('#save_event_two', 'click', function() {
					var tarForm = $('#form-add-embryology');
					if (!tarForm.doValidate())
						return;
					var data = [];
					if ($('#dispatcher').attr('data-edit')) {
						$('.table-list .tr-hover').each(function() {
							var ms = {
								id: parseInt($(this).attr('data-id') || 0, 10),
								voumCode: parseInt($(this).find('.number').text(), 10),
								spermConcentration: $(this).find('.concentration').val(),
								spermMotility: $(this).find('.vitality').val(),
								note: $(this).find('.note').val()
							};
							data.push(ms);
						});
					} else {
						$('.table-list .tr-hover').each(function() {
							var ms = {
								voumCode: parseInt($(this).find('.number').text(), 10),
								spermConcentration: $(this).find('.concentration').val(),
								spermMotility: $(this).find('.vitality').val(),
								note: $(this).find('.note').val()
							};
							data.push(ms);
						});
					}
					var url = $(this).attr('data-href');
					var api = $(this).attr('data-action');
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						data: {
							info: tarForm.serialize(),
							resultJson: JSON.stringify(data)
						},
						success: function() {
							location.href = url;
						},
						error: function(msg) {
							art.dialog.alert(msg);
						}
					}));
				})
				.delegate('#save_event_three', 'click', function() {
					var tarForm = $('#form-add-embryology');
					if (!tarForm.doValidate())
						return;
					var data = [];
					if ($('#dispatcher').attr('data-edit')) {
						$('.table-list .tr-hover').each(function() {
							var ms = {
								id: parseInt($(this).attr('data-id') || 0, 10),
								voumCode: parseInt($(this).find('.number').text(), 10),
								survival: parseInt($(this).find('.live').children('option:selected').val(), 10),
								operationStatus: parseInt($(this).find('.operator').children('option:selected').val(), 10),
								destiny: parseInt($(this).find('.fate').children('option:selected').val(), 10),
								witness: $(this).find('.witness').val(),
								note: $(this).find('.note').val()
							};
							data.push(ms);
						});
					} else {
						$('.table-list .tr-hover').each(function() {
							var ms = {
								voumCode: parseInt($(this).find('.number').text(), 10),
								survival: parseInt($(this).find('.live').children('option:selected').val(), 10),
								operationStatus: parseInt($(this).find('.operator').children('option:selected').val(), 10),
								destiny: parseInt($(this).find('.fate').children('option:selected').val(), 10),
								witness: $(this).find('.witness').val(),
								note: $(this).find('.note').val()
							};
							data.push(ms);
						});
					}
					var url = $(this).attr('data-href');
					var api = $(this).attr('data-action');
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						data: {
							info: tarForm.serialize(),
							resultJson: JSON.stringify(data)
						},
						success: function() {
							location.href = url;
						},
						error: function(msg) {
							art.dialog.alert(msg);
						}
					}));
				})
				.delegate('#save_event_four', 'click', function() {
					var tarForm = $('#form-add-embryology');
					if (!tarForm.doValidate())
						return;
					var data = [];
					if ($('#dispatcher').attr('data-edit')) {
						$('.table-list .tr-hover').each(function() {
							var ms = {
								id: parseInt($(this).attr('data-id') || 0, 10),
								voumCode: parseInt($(this).find('.number').text(), 10),
								fertilizationType: parseInt($(this).find('.impregnation').children('option:selected').val(), 10),
								status: parseInt($(this).find('.status').children('option:selected').val(), 10),
								destiny: parseInt($(this).find('.fate').children('option:selected').val(), 10),
								witness: $(this).find('.witness').val(),
								note: $(this).find('.note').val()
							};
							data.push(ms);
						});
					} else {
						$('.table-list .tr-hover').each(function() {
							var ms = {
								voumCode: parseInt($(this).find('.number').text(), 10),
								fertilizationType: parseInt($(this).find('.impregnation').children('option:selected').val(), 10),
								status: parseInt($(this).find('.status').children('option:selected').val(), 10),
								destiny: parseInt($(this).find('.fate').children('option:selected').val(), 10),
								witness: $(this).find('.witness').val(),
								note: $(this).find('.note').val()
							};
							data.push(ms);
						});
					}
					var url = $(this).attr('data-href');
					var api = $(this).attr('data-action');
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						data: {
							info: tarForm.serialize(),
							resultJson: JSON.stringify(data)
						},
						success: function() {
							location.href = url;
						},
						error: function(msg) {
							alert(msg);
						}
					}));
				})
				.delegate('#save_event_five', 'click', function() {
					var tarForm = $('#form-add-embryology');
					if (!tarForm.doValidate())
						return;
					var data = [];
					if ($('#dispatcher').attr('data-edit')) {
						$('.table-list .tr-hover').each(function() {
							var ms = {
								id: parseInt($(this).attr('data-id') || 0, 10),
								voumCode: parseInt($(this).find('.number').text(), 10),
								developingStage: parseInt($(this).find('.stage').children('option:selected').val(), 10),
								grade: parseInt($(this).find('.level').children('option:selected').val(), 10),
								status: parseInt($(this).find('.status').children('option:selected').val(), 10),
								destiny: parseInt($(this).find('.fate').children('option:selected').val(), 10),
								witness: $(this).find('.witness').val(),
								note: $(this).find('.note').val()
							};
							data.push(ms);
						});
					} else {
						$('.table-list .tr-hover').each(function() {
							var ms = {
								voumCode: parseInt($(this).find('.number').text(), 10),
								developingStage: parseInt($(this).find('.stage').children('option:selected').val(), 10),
								grade: parseInt($(this).find('.level').children('option:selected').val(), 10),
								status: parseInt($(this).find('.status').children('option:selected').val(), 10),
								destiny: parseInt($(this).find('.fate').children('option:selected').val(), 10),
								witness: $(this).find('.witness').val(),
								note: $(this).find('.note').val()
							};
							data.push(ms);
						});
					}
					var url = $(this).attr('data-href');
					var api = $(this).attr('data-action');
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						data: {
							info: tarForm.serialize(),
							resultJson: JSON.stringify(data)
						},
						success: function() {
							location.href = url;
						},
						error: function(msg) {
							alert(msg);
						}
					}));
				})
				.delegate('#save_event_six', 'click', function() {
					var tarForm = $('#form-add-embryology');
					if (!tarForm.doValidate())
						return;
					var data = [];
					if ($('#dispatcher').attr('data-edit')) {
						$('.table-list .tr-hover').each(function() {
							var ms = {
								id: parseInt($(this).attr('data-id') || 0, 10),
								voumCode: parseInt($(this).find('.number').text(), 10),
								developingStage: parseInt($(this).find('.stage').children('option:selected').val(), 10),
								grade: parseInt($(this).find('.level').children('option:selected').val(), 10),
								nitrogenCanister: $(this).find('.nitrogen').val(),
								casingColor: $(this).find('.sleeve_color').val(),
								strawCode: $(this).find('.sleeve_number').val(),
								strawColor: $(this).find('.sleeve_darkness').val(),
								witness: $(this).find('.witness').val(),
								note: $(this).find('.note').val()
							};
							data.push(ms);
						});
					} else {
						$('.table-list .tr-hover').each(function() {
							var ms = {
								voumCode: parseInt($(this).find('.number').text(), 10),
								developingStage: parseInt($(this).find('.stage').children('option:selected').val(), 10),
								grade: parseInt($(this).find('.level').children('option:selected').val(), 10),
								nitrogenCanister: $(this).find('.nitrogen').val(),
								casingColor: $(this).find('.sleeve_color').val(),
								strawCode: $(this).find('.sleeve_number').val(),
								strawColor: $(this).find('.sleeve_darkness').val(),
								witness: $(this).find('.witness').val(),
								note: $(this).find('.note').val()
							};
							data.push(ms);
						});
					}
					var url = $(this).attr('data-href');
					var api = $(this).attr('data-action');
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						data: {
							info: tarForm.serialize(),
							resultJson: JSON.stringify(data)
						},
						success: function() {
							location.href = url;
						},
						error: function(msg) {
							alert(msg);
						}
					}));
				})
				.delegate('#save_event_seven', 'click', function() {
					var tarForm = $('#form-add-embryology');
					if (!tarForm.doValidate())
						return;
					var data = [];
					if ($('#dispatcher').attr('data-edit')) {
						$('.table-list .tr-hover').each(function() {
							var ms = {
								id: parseInt($(this).attr('data-id') || 0, 10),
								voumCode: parseInt($(this).find('.number').text(), 10),
								embryonicPeriod: $(this).find('.stage').val(),
								grade: parseInt($(this).find('.level').children('option:selected').val(), 10),
								transplantationTubeNo: $(this).find('.sleeve_number').val(),
								witness: $(this).find('.witness').val(),
								note: $(this).find('.note').val()
							};
							data.push(ms);
						});
					} else {
						$('.table-list .tr-hover').each(function() {
							var ms = {
								voumCode: parseInt($(this).find('.number').text(), 10),
								embryonicPeriod: $(this).find('.stage').val(),
								grade: parseInt($(this).find('.level').children('option:selected').val(), 10),
								transplantationTubeNo: $(this).find('.sleeve_number').val(),
								witness: $(this).find('.witness').val(),
								note: $(this).find('.note').val()
							};
							data.push(ms);
						});
					}
					var url = $(this).attr('data-href');
					var api = $(this).attr('data-action');
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						data: {
							info: tarForm.serialize(),
							resultJson: JSON.stringify(data)
						},
						success: function() {
							location.href = url;
						},
						error: function(msg) {
							alert(msg);
						}
					}));
				})
				.delegate('#save_event_eight', 'click', function() {
					var tarForm = $('#form-add-embryology');
					if (!tarForm.doValidate())
						return;
					var data = [];
					if ($('#dispatcher').attr('data-edit')) {
						$('.table-list .tr-hover').each(function() {
							var ms = {
								id: parseInt($(this).attr('data-id') || 0, 10),
								voumCode: parseInt($(this).find('.number').text(), 10),
								embryonicPeriod: $(this).find('.stage').val(),
								grade: parseInt($(this).find('.level').children('option:selected').val(), 10),
								recoveryStatus: $(this).find('.status').children('option:selected').val(),
								destiny: parseInt($(this).find('.fate').children('option:selected').val(), 10),
								witness: $(this).find('.witness').val(),
								note: $(this).find('.note').val()
							};
							data.push(ms);
						});
					} else {
						$('.table-list .tr-hover').each(function() {
							var ms = {
								voumCode: parseInt($(this).find('.number').text(), 10),
								embryonicPeriod: $(this).find('.stage').val(),
								grade: parseInt($(this).find('.level').children('option:selected').val(), 10),
								recoveryStatus: $(this).find('.status').children('option:selected').val(),
								destiny: parseInt($(this).find('.fate').children('option:selected').val(), 10),
								witness: $(this).find('.witness').val(),
								note: $(this).find('.note').val()
							};
							data.push(ms);
						});
					}
					var url = $(this).attr('data-href');
					var api = $(this).attr('data-action');
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						data: {
							info: tarForm.serialize(),
							resultJson: JSON.stringify(data)
						},
						success: function() {
							location.href = url;
						},
						error: function(msg) {
							alert(msg);
						}
					}));
				})
				.delegate('.fate', 'change', function() {
					var flag = $(this).attr('data-flag');
					if (flag === 'false')
						return;
					var tips = $(this).attr('tips');
					art.dialog.tips(tips);
					$(this).children(':first').prop('selected', true);
				});
		},
		freeze: function() { //胚胎冷冻信息
			$('.straw_number').blur(function() {
				if (!$.trim($(this).val()) || $(this).parents('.tr-hover:first').next('.tr-hover')[0])
					return;
				$(this).parents('.table-list:first').find('.backups').clone(true).removeClass('backups').show().appendTo($(this).parents('.table-list:first'));
			});

			$('.delete-item').die('click').live('click', function() {
				if ($(this).parents('.table-list:first').find('.tr-hover:visible').length === 1)
					return;
				$(this).parents('.tr-hover:first').remove();
			});

			// 保存
			$('#saveInfo').click(function() {
				var tarForm = $('#form-embryo-info');
				var storage = [],
					anabiosis = [],
					storRec = [],
					recoRec = [],
					flag = true;
				$('.storage-info .tr-hover:visible').each(function() {
					if ($(this).find('.straw_number').val() === '')
						return;
					// 获取每条记录的麦管编号和胚胎编号
					var record = $.trim($(this).find('.straw_number').val()) + ',' + $.trim($(this).find('.embryo_number').val());
					storRec.push(record);

					var ms = {
						storageid: parseInt($(this).find('.storageid').val(), 10),
						straw_number: $(this).find('.straw_number').val(),
						embryo_number: $(this).find('.embryo_number').val(),
						level: $(this).find('.level').children('option:selected').val(),
						stage: $(this).find('.stage').val(),
						nitrogen: $(this).find('.nitrogen').val(),
						sleeve_color: $(this).find('.sleeve_color').val(),
						label_color: $(this).find('.label_color').val()
					};
					storage.push(ms);
				});
				$('.recovery-info .tr-hover:visible').each(function() {
					if ($(this).find('.straw_number').val() === '')
						return;

					// 获取每条记录的麦管编号和胚胎编号
					var record = $.trim($(this).find('.straw_number').val()) + ',' + $.trim($(this).find('.embryo_number').val());
					recoRec.push(record);

					var ms = {
						recoveryid: parseInt($(this).find('.recoveryid').val(), 10),
						straw_number: $(this).find('.straw_number').val(),
						embryo_number: $(this).find('.embryo_number').val(),
						status: $(this).find('.status').children('option:selected').val(),
						date: $(this).find('.date').val(),
						time: $(this).find('.time').val(),
						anabiosis: $(this).find('.anabiosis').val(),
						sample: $(this).find('.sample').val(),
						mark: $(this).find('.mark').val(),
						abandon: $(this).find('.abandon').val()
					};
					anabiosis.push(ms);
				});

				// 存储编号和复苏编号匹配
				for (var i = recoRec.length - 1; i >= 0; i--) {
					for (var j = storRec.length - 1; j >= 0; j--) {
						if (recoRec[i] === storRec[j])
							break;
					}
					if (j < 0) {
						var pnt = $('.recovery-info .tr-hover:visible').eq(i);
						pnt.find('.straw_number').addClass('error-area');
						pnt.find('.embryo_number').addClass('error-area');
						if ($('.error-text').is(":hidden")) {
							$('.error-text').show();
						}
						$('.error-text').html('麦管编号或胚胎编号不存在！');
						flag = false;
					}
				}
				if (!flag)
					return;


				var api = $(this).attr('data-action');
				$.ajax(common.ajaxCall({
					url: api,
					type: 'post',
					data: {
						info: tarForm.serialize(),
						storageInfo: JSON.stringify(storage),
						anabiosisInfo: JSON.stringify(anabiosis)
					},
					success: function() {
						$(this).tips('success', '保存成功！', 1);
						$('.error-area').removeClass('error-area');
						$('.error-text').hide();
					},
					error: function(msg) {
						alert(msg);
					}
				}));
			});
		},
		analysis: function() { //精液分析

			$('#data').datePicker({
				dateFmt: 'yyyy-MM-dd'
			});

			$(document).delegate('#addSperm', 'click', function() {
				if ($('#choose_scheme').children('option:selected').val() === '0') {
					art.dialog.alert('请先添加疗程方案！');
					return;
				}
				var url = $(this).attr('data-href') + '/' + $('#choose_scheme').children('option:selected').val();
				art.dialog.open(url, {
					title: '新增样精收集',
					width: 380,
					height: 460,
					lock: true
				});
			})
				.delegate('#saveSperm', 'click', function() {
					var tarForm = $('#form-collect-sperm');
					if (!tarForm.doValidate())
						return;
					var api = $(this).attr('data-action');
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						data: tarForm.serialize(),
						success: function() {
							top.location.reload();
						},
						error: function(msg) {
							alert(msg);
						}
					}));
				})
				.delegate('#addRecord', 'click', function() {
					var url = $(this).attr('data-href');
					art.dialog.open(url, {
						title: '新增操作记录',
						width: 380,
						height: 320,
						lock: true
					});
				});

			$('.edit').unbind('click').bind('click', function() {
				var url = $(this).attr('data-href');
				art.dialog.open(url, {
					title: '编辑样精收集',
					width: 380,
					height: 460,
					lock: true
				});
			});

			$('.add').click(function() {
				top.location = $(this).attr('data-href');
			});

			$('#saveInfo').click(function() {
				var tarForm = $('#form-sperm-analysis');
				var url = $(this).attr('data-href');
				var api = $(this).attr('data-action');
				$.ajax(common.ajaxCall({
					url: api,
					type: 'post',
					data: tarForm.serialize(),
					success: function() {
						$(this).tips('success', '保存成功！', 1);
						setTimeout(function() {
							location.href = url;
						}, 500);
					},
					error: function(msg) {
						alert(msg);
					}
				}));
			});
		},
		result: function() { //治疗效果
			$('#saveResult').click(function() {
				var tarForm = $('#form-add-result');
				var api = $(this).attr('data-action');
				$.ajax(common.ajaxCall({
					url: api,
					type: 'post',
					data: tarForm.serialize(),
					success: function() {
						$(this).tips('success', '保存成功！', 1);
					},
					error: function(msg) {
						alert(msg);
					}
				}));
			});
		},
		personInfo: function() { //个人信息
			$("#closeDialog").on("click", function() {
				art.dialog.list["uploadHdpicDialog"].close();
			});

			$('#birthday').datePicker({
				dateFmt: 'yyyy-MM-dd'
			});
			$("#spouse-birthday").datePicker({
				dateFmt: 'yyyy-MM-dd'
			});


			// 上传头像
			if ($('#avaUpload').length > 0) {
				$("#avaUpload,#avaPhoto").on("click", function() {
					var urlUploadHdpic = $(this).attr("data-href");
					$.ajax({
						type: "GET",
						url: urlUploadHdpic,
						cache: false,
						// data : {r : Math.random()},
						success: function(resp) {
							$("#dialogContent").empty().html(resp);
							art.dialog({
								id: "uploadHdpicDialog",
								lock: true,
								background: '#000',
								width: 690,
								height: 510,
								esc: true,
								drag: true,
								padding: 3,
								resize: false,
								opacity: 0.75,
								title: '上传头像',
								content: document.getElementById('dialogContent'),
								cancel: false
							});
						},
						error: function(xhr, s, err) {
							return false;
						}
					});
				});
			}

			// 点击关闭弹窗
			$("#closeDialog").on("click", function() {
				art.dialog.close();
			});

			$(document).delegate('#spouse-register', 'click', function() {
				var registerNum = $('#registerNum').val();
				if (registerNum.charAt(registerNum.length - 1) === 'M' || registerNum.charAt(registerNum.length - 1) === 'F')
					return;

				if (registerNum === '') {
					if ($('.error-text').is(":hidden")) {
						$('.error-text').show();
					}
					$('.error-text').html("请注册主联系人的注册证号!");
					$('#registerNum').addClass('error-area');
				} else {
					var sex = $('#spouse-sex').children('option:selected').text();
					var str = '';
					if (sex === '男') {
						str = 'M';
					} else {
						str = 'F';
					}
					$('#spouse-registerNum').val(registerNum + str);
				}
			})
				.delegate('#saveInfor', 'click', function() {
					var tarForm = $("#form-person-info");
					if (!tarForm.doValidate())
						return;

					if ($("#registerCredentialsNum").validateCredentials('registerCredentials') === false)
						return;

					if ($('#spouse-registerCredentialsNum').is(':visible')) {
						if ($('#spouse-registerCredentialsNum').validateCredentials('spouse-registerCredentials') === false)
							return;
					}

					$('#doctorName').val($('#doctor').children('option:selected').text());

					var data = [];
					$('.table-list .tr-hover:visible').each(function() {
						if (!$(this).find('.relationId').val())
							return;
						var ms = {
							relationmanid: $(this).find('.relationId').val(),
							relationtypeid: $(this).find('.relationType').children('option:selected').val()
						};
						data.push(ms);
					});

					var api = $(this).attr("data-action");
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						data: {
							info: tarForm.serialize(),
							relationMan: JSON.stringify(data)
						},
						success: function(data) {
							$(this).dialogSuccess('保存成功！');
						},
						error: function(msg) {
							$(this).dialogError(msg);
						}

					}));
				})
				.delegate('.add', 'click', function() {
					$('.spouse-info').show();
					$('.add-family-but').addClass('bg-f5');
					$('.delete').show();
					$('#spouseFlag').val(1);
				})
				.delegate('.delete', 'click', function() {
					$('.spouse-info').hide();
					$('.add-family-but').removeClass('bg-f5');
					$('.delete').hide();
					$('#spouseFlag').val(0);
				});

			$('.relationship').showlist({
				width: 500,
				keyID: 'patientId',
				selectCallBack: function(d) {
					if (!d)
						return;
					var _parents = $('.demo').parents('.tr-hover:first');
					if (!_parents.next('.tr-hover')[0]) {
						$('.backups').clone(true).removeClass('backups').show().appendTo($('.table-list'));
					}
					_parents.find('.relationId').val(d.patientId);
				},
				buildHtml: function(ds) {
					var html = '<table cellpadding="0" cellspacing="1" class="table-list ab-table-div-title"></tbody>';
					for (var i = 0; i < ds.length; i++) {
						var item = ds[i];
						html += '<tr data-id="' + item.patientId + '" data-name="' + item.patientName + '" class="tr-hover"><td>' + item.patientName + '</td><td>' + item.registerCardNum + '</td><td>' + item.mobile + '</td></tr>';
					}
					html += '</tbody></table>';
					return html;
				}
			});


			$('.delete-item').die('click').live('click', function() {
				if ($(this).parents('.table-list:first').find('.tr-hover:visible').length === 1)
					return;
				$(this).parents('.tr-hover:first').remove();
			});


			// 根据科室选择医生
			$('#department').change(function() {
				var api = $(this).attr('data-href');
				var department = $(this).children('option:selected').text();
				var departmentId = $(this).children('option:selected').val();
				$.ajax(common.ajaxCall({
					url: api,
					data: {
						departmentId: departmentId
					},
					type: 'post',
					success: function(data) {
						var ds = data.ds;
						var str = '';
						for (var i = ds.length - 1; i >= 0; i--) {
							var item = ds[i];
							if (item.departmentId == departmentId) {
								str += '<option value="' + item.doctorId + '">' + item.doctorName + '</option>';
							}
						}
						$('#doctor').empty().append(str).trigger('change');
						var doctorId = $('#doctorId').val();
						$('#doctor').children('option[value="' + doctorId + '"]').prop('selected', true);
					},
					error: function(msg) {
						alert(msg);
					}
				}));
			}).trigger('change');


			// 删除附件
			$('.delete-file').click(function() {
				var api = $(this).attr('data-action');
				$.ajax(common.ajaxCall({
					url: api,
					success: function() {
						art.dialog.tips("删除成功！");
						setTimeout(function() {
							top.location.reload();
						}, 500);
					}
				}));
			});



			// 编辑
			var display = $('#display');
			if (!display[0])
				return;
			var ds = display.val();
			if (ds === 'true') {
				$('.add').html('<b></b>&nbsp;编辑配偶信息');
				$('.add').trigger('click');
				$('.add-family-but').removeClass('bg-f5');
				$('.delete').hide();
				$('.add').die('click');
			}
		}


	};

	/********************入口***********************************/
	var Main = {
		init: function() {

			// 约诊列表
			AppointmentList.init();

			// 主页
			if ($('.patientList-homepage')[0])
				PatientList.homePage();


			// 治疗过程
			if ($('.patientList-process')[0])
				PatientList.process();

			// 个人信息
			if ($('.patientList-personInfo')[0])
				PatientList.personInfo();

			// 医疗记录
			if ($('.patientList-record')[0])
				PatientList.record();

			// 化验分析
			if ($('.patientList-assay')[0])
				PatientList.assay();

			// 治疗药物
			if ($('.patientList-medicines')[0])
				PatientList.medicines();

			// 治疗项目
			if ($('.patientList-ultrasonic')[0])
				PatientList.ultrasonic();

			// 胚胎学
			if ($('.patientList-embryology')[0])
				PatientList.embryology();

			// 精液分析
			if ($('.patientList-analysis')[0])
				PatientList.analysis();

			// 胚胎冷冻信息
			if ($('.patientList-freeze')[0])
				PatientList.freeze();

			// 治疗结果
			if ($('.patientList-result')[0])
				PatientList.result();


			$('.numeral').numeral();


			// 选择诊疗方案
			$('#choose_scheme').change(function() {
				$('#scheme').submit();
			});

			// 左侧点击
			var menuItem = $("#leftmenu").attr("menuItem");
			if (!menuItem)
				return;
			$("#leftmenu a").each(function(i, n) {
				if ((i + 1) == menuItem) {
					$(this).addClass("now");
					return;
				}
			});

		}
	};

	Main.init();

	// textarea  lt9 不支持maxlength属性
	$('textarea').limitLength();
});