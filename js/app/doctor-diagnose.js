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

	/****************医生面诊*****************/

	var Diagnose = {
		init: function() {


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



			// 添加面诊
			$('#addDisgnose').click(function() {

				var api = $(this).attr('data-href');
				art.dialog.open(api, {
					width: 400,
					height: 280,
					title: "添加面诊",
					lock: true
				});
			});
			$('.add').click(function() {
				top.location.href = $(this).attr('data-href');
			});

			$('.delete-item').click(function() {
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

			// 门诊开单/结束面诊
			$('#end-diagnose').click(function() {
				var url = $(this).attr('data-href');
				var api = $(this).attr('data-action');
				var patientId = $('#patientId').val();

				$.ajax(common.ajaxCall({
					url: api,
					type: 'post',
					data: {
						patientId: patientId
					},
					success: function() {
						location.href = url;
					},
					error: function(msg) {
						alert(msg);
					}
				}));
			});

			$('#clinic-bill').click(function() {
				var url = $(this).attr('data-href');
				var api = $(this).attr('data-action');
				var patientId = $('#patientId').val();

				$.ajax(common.ajaxCall({
					url: api,
					type: 'post',
					data: {
						patientId: patientId,
						ghId: $('#ghId').val()
					},
					success: function() {
						location.href = url;
					},
					error: function(msg) {
						alert(msg);
					}
				}));
			});

			// 上传附件
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
				var api = disease.attr('data-action') + '?templateId=' + templateId;
				$.ajax(common.ajaxCall({
					url: api,
					type: 'post',
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
							str += '<div class="hr-div mar-t10" data-catlogId="' + a[i].catlogId + '"><span id="tit_' + i + '" name="tit_' + i + '">' + a[i].catlogName + '</span><hr/></div><div class="h-auto disease-list mar-t10"></div>';
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
						/*var cur,str = '';
						for(i = 1; i <= a.length; i++) {
							cur = a[i-1];
							if(i === 1) {
								str += '<h3 name="basic"><a href="javascript:;" id="basic" name="basic" class="green-font">'+ cur.catlogName +'</a></h3>';
							}
							switch(cur.answerCatlog) {
								case 'a':
									str += '<ul class="question-list mar-t10"><li>'+ i +'.'+ cur.problemDesc +'</li><li><input class="Wdate" id="Date" name="" value="'+ cur.defaultValue +'" style="" type="text"></li></ul>';
									break;
								case 'b':
									str += '<ul class="question-list mar-t10"><li>'+ i +'.'+ cur.problemDesc +'</li><li class="h-auto"><label class="f-l"><select name="">';
									var answer = cur.chooseValue.split(';');
									for(var j = 0; j < answer.length; j++) {
										if(answer[j] == cur.defaultValue){
											str += '<option selected="selected">'+ answer[j] +'</option>';
											continue;
										}
										str += '<option>'+ answer[j] +'</option>';
									}
									str += '</select></label><a href="#" class="f-r green-but">添加备注</a></li><li><textarea name="" cols="" rows="">12313</textarea></li></ul>';
									break;
							}
						}
						$('#disease-item').empty().append(str);*/
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
				var flag = $('#flag').val();
				var consultRecordId = $('#consultRecordId').val();
				var url = editDiagnose.attr('data-action') + '?templateId=' + templateId + '&flag=' + flag + '&consultRecordId=' + consultRecordId;
				$.ajax(common.ajaxCall({
					url: url,
					type: 'post',
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
							str += '<div class="hr-div mar-t10" data-catlogId="' + a[i].catlogId + '"><span id="tit_' + i + '" name="tit_' + i + '">' + a[i].catlogName + '</span><hr/></div><div class="h-auto disease-list mar-t10"></div>';
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
				$('.disease-list ul').each(function() {
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
					ghId: $('#ghId').val(),
					file: $('#file-url').val(),
					note: $('#info-note').val(),
					patientId: $('#patientId').val(),
					templateId: $('#templateId').val(),
					templateName: $('#templateName').val(),
					consultId: $('#consultId').val(),
					problems: msg
				};
				var api = $(this).attr('data-action');
				$.ajax(common.ajaxCall({
					url: api,
					type: 'post',
					data: {
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

			// 点击选择面诊状态
			$('.list-seach input:checkbox').click(function() {
				$('#form-serch-diagnose').submit();
			});


		}
	};

	/**********入口************/
	var Main = {
		init: function() {
			Diagnose.init();
		}
	};

	Main.init();

	$('.numeral').numeral();
	// textarea  lt9 不支持maxlength属性
	$('textarea').limitLength();
});