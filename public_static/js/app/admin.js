﻿define('app/admin', [
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

	/****************系统配置-字典类别配置**************************/
	var Type = {
		init: function() {

			// 新增字典类别配置
			$(document).delegate('#addType', 'click', function() {
				art.dialog.open($(this).attr("data-href"), {
					width: 380,
					height: 270,
					title: '新增字典类别配置',
					lock: true
				});
			}).
			delegate('.edit', 'click', function() {
				art.dialog.open($(this).attr("data-href"), {
					width: 380,
					height: 270,
					title: '编辑字典类别',
					lock: true,
					init: function() {
						var iframe = this.iframe.contentWindow.document;
						var editable = $('#isEdit', iframe).val();
						if (editable == 'false')
							$('#typeValue', iframe).attr('readonly', true);
					}
				});
			});
			$("#determine").click(function() {
				var tarForm = $("#add-Type");
				if (!tarForm.doValidate())
					return;

				var api = $(this).attr("data-action");
				$.ajax(common.ajaxCall({
					url: api,
					type: 'post',
					data: tarForm.serialize(),
					success: function() {
						top.location.reload();
					},
					error: function(msg) {
						if ($('.error-text').is(":hidden")) {
							$('.error-text').show();
						}
						$('.error-text').html(msg);
					}
				}));
			});
			// 弹窗取消
			$("#cancel").click(function() {
				art.dialog.close();
			});

			// 点击删除
			$(document).delegate('.delete-item', 'click', function() {
				var api = $(this).attr('data-href');
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
		}
	};

	/****************系统配置-字典配置*************************/
	var Configure = {
		init: function() {

			// 新增字典配置
			$(document).delegate('#addConfigure', 'click', function() {
				art.dialog.open($(this).attr("data-href"), {
					width: 380,
					height: 320,
					title: '新增字典配置',
					lock: true
				});
			}).
			delegate('.edit', 'click', function() {
				art.dialog.open($(this).attr("data-href"), {
					width: 380,
					height: 320,
					title: '编辑字典配置',
					lock: true,
					init: function() {
						var iframe = this.iframe.contentWindow.document;
						var editable = $('#isEdit', iframe).val();
						if (editable == 'false')
							$('#dictionaryValue', iframe).attr('readonly', true);
					}
				});
			});
			$("#determine").click(function() {
				var tarForm = $("#add-Dictionary");
				if (!tarForm.doValidate())
					return;

				var api = $(this).attr("data-action");
				$.ajax(common.ajaxCall({
					url: api,
					type: 'post',
					data: tarForm.serialize(),
					success: function() {
						top.location.reload();
					},
					error: function(msg) {
						if ($('.error-text').is(":hidden")) {
							$('.error-text').show();
						}
						$('.error-text').html(msg);
					}
				}));
			});
			// 弹窗取消
			$("#cancel").click(function() {
				art.dialog.close();
			});

			// 点击删除
			$(document).delegate('.delete-item', 'click', function() {
				var api = $(this).attr('data-href');
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
		}
	};

	/****************系统配置-医疗模板*****************************/
	var MedicalTemplate = {
		init: function() {

			// 新增医疗模板
			var addTemplate = $('.addTemplate');
			if (addTemplate[0]) {
				$(document).delegate('#first-next', 'click', function() {
					var tarForm = $('#form-template');
					if (!tarForm.doValidate())
						return false;

					var api = $(this).attr('data-action');
					var name = $('#credentialsNum').val();
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						data: {
							templateName: name
						},
						success: function(data) {
							var ds = data.ds;
							var url = $('#first-next').attr('data-href') + '?templateId=' + ds[0].templateId;
							location.href = url;
						},
						error: function(msg) {
							alert(msg);
						}
					}));
				});
			}


			// 编辑医疗模板
			if (!addTemplate[0]) {
				$(document).delegate('#first-next', 'click', function() {
					var tarForm = $('#form-template');
					if (!tarForm.doValidate())
						return false;

					var api = $(this).attr('data-action');
					var name = $('#credentialsNum').val();
					var templateId = $('#templateId').val();
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						data: {
							templateId: templateId,
							templateName: name
						},
						success: function(data) {
							var url = $('#first-next').attr('data-href') + '?templateId=' + templateId;
							location.href = url;
						},
						error: function(msg) {
							alert(msg);
						}
					}));
				});
			}


			var tree = $('#template-tree');
			if (tree.length > 0) {
				var templateId = $('#templateId').val();
				var api = tree.attr('data-href') + '?templateId=' + templateId;
				$.ajax(common.ajaxCall({
					url: api,
					type: 'post',
					success: function(data) {
						var problemInfo = data.ds;
						var a = [];
						var b = [];
						var c = [];
						for (var i = 0; i < problemInfo.length; i++) {
							var item = problemInfo[i];
							switch (item.label) {
								case 0:
									a.push(item);
									break;
								case 1:
									b.push(item);
									break;
								case 2:
									c.push(item);
									break;
								default:
									break;
							}
						}
						$('.organize-tree').empty();
						for (var j = 0; j < a.length; j++) {
							$('.organize-tree').append('<dt data-id="' + a[j].catlogId + '" data-cfg={"catlogName":"' + a[j].catlogName + '","orderNum":"' + a[j].orderNum + '","preCatlogId":"' + a[j].preCatlogId + '","catlogId":"' + a[j].catlogId + '","label":"' + a[j].label + '","templateId":"' + a[j].templateId + '"}><span class="tree-more"><a href="javascript:;">' + a[j].catlogName + '</a></span></dt>');
						}
						for (var m = 0; m < b.length; m++) {
							$('.organize-tree dt[data-id=' + b[m].preCatlogId + ']').after('<dd data-id="' + b[m].catlogId + '"><span class="tree-more" data-cfg={"catlogName":"' + b[m].catlogName + '","orderNum":"' + b[m].orderNum + '","preCatlogId":"' + b[m].preCatlogId + '","catlogId":"' + b[m].catlogId + '","label":"' + b[m].label + '","templateId":"' + b[m].templateId + '"}><a href="javascript:;">' + b[m].catlogName + '</a></span>');
						}
						for (var n = 0; n < c.length; n++) {
							$('.organize-tree dd[data-id=' + c[n].preCatlogId + ']').append('<cite data-id="' + c[n].catlogId + '" data-cfg={"catlogName":"' + c[n].catlogName + '","orderNum":"' + c[n].orderNum + '","preCatlogId":"' + c[n].preCatlogId + '","catlogId":"' + c[n].catlogId + '","label":"' + c[n].label + '","templateId":"' + c[n].templateId + '"}><a href="javascript:;">' + c[n].catlogName + '</a></cite>');
						}
					},
					error: function(msg) {
						alert(msg);
					}
				}));
				$(document).delegate('.organize-tree dt,.organize-tree dd span,.organize-tree dd cite', 'click', function() {
					$('.organize-tree dt').removeClass('mark');
					$('.organize-tree dd').removeClass('mark');
					var message = $.parseJSON($(this).attr("data-cfg"));
					$('#name').val(message.catlogName);
					$('#previousNode').children('option[value="' + message.preCatlogId + '"]').prop('selected', true);
					$('#orderNum').val(message.orderNum);
					$('#catlogId').val(message.catlogId);
					$('#label').val(message.label);
					$('#templateId').val(message.templateId);
				}).
				delegate('.organize-tree dt', 'click', function() {
					$(this).addClass('mark').find('span').toggleClass('tree-more');
					var dd = $(this).nextUntil('dt');
					dd.toggle();

				}).
				delegate('.organize-tree dd span', 'click', function() {
					$(this).toggleClass('tree-more').addClass('mark');
					var cite = $(this).siblings('cite');
					cite.toggle();
				}).
				delegate('.organize-tree dd cite', 'click', function() {
					$('.organize-tree dd cite a').removeClass('now');
					$(this).children('a').addClass('now');
				});

				// 添加子类别
				$(document).delegate('#addCategory', 'click', function() {
					$('#name').val('');
					$('#catlogId').val('');
					$('#orderNum').val('');
					var mark = $('.organize-tree').find('.mark');
					if (mark.length > 0) {
						var item = $.parseJSON(mark.attr('data-cfg'));
						$('#previousNode').children('option[value="' + item.catlogId + '"]').prop('selected', true);
					}
				}) //保存
				.delegate('#saveProblem', 'click', function() {
					var tarForm = $('#form-add-template');
					if (!tarForm.doValidate())
						return false;
					var lab = $('#previousNode').children('option:selected').attr('data-label');
					$('#label').val(lab);
					var api = $(this).attr('data-href');
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						data: tarForm.serialize(),
						success: function() {
							location.reload();
						},
						error: function(msg) {
							// $(this).dialogError(msg);
							alert(msg);
						}
					}));
				}) //删除
				.delegate('#delete', 'click', function() {
					var callback = function() {
						var api = $("#delete").attr("data-href");
						var mark = $('.organize-tree').find('.mark');
						if (!mark[0])
							return;
						var item = $.parseJSON(mark.attr('data-cfg'));
						api = api + '?catlogId=' + item.catlogId + '&templateId=' + item.templateId;
						$.ajax(common.ajaxCall({
							url: api,
							type: 'post',
							success: function() {
								art.dialog({
									content: '操作成功！',
									icon: 'success',
									time: 1
								});
								setTimeout(function() {
									art.dialog.close();
									top.location.reload();
								}, 1200);
							},
							error: function(msg) {
								alert(msg);
							}
						}));

					};
					$(this).dialogConfirm(callback);
				});
			}

			$('#problem-type').change(function() {
				// var catlogId = $(this).children('option:selected').val();
				$('#problem').submit();
			});


			$("#addProblem").click(function() {
				art.dialog.open($(this).attr("data-href"), {
					width: 400,
					height: 500,
					title: '新增问题',
					lock: true
				});
			});
			$(".edit").click(function() {
				art.dialog.open($(this).attr("data-href"), {
					width: 400,
					height: 500,
					title: '编辑问题',
					lock: true,
					init: function() {
						/*var iframe = this.iframe.contentWindow.document;
							var username = iframe.document.getElementById('answerType');
							alert($('#answerType', iframe).children().length);*/
					}
				});
			});
			$('.delete-item').click(function() {
				var api = $(this).attr("data-href");
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

			var answerCatlog = $('#answerCatlog').val();
			var chooseValue = $('#chooseValue').val();
			var defaultValue = $('#defaultValue').val();
			if (answerCatlog)
				$('#answerType').children('option:contains(' + answerCatlog + ')').prop('selected', true);
			if (chooseValue)
				$('#selecteValue textarea').val(chooseValue).trigger('blur');
			if (defaultValue)
				$('#default').children('option[value="' + defaultValue + '"]').prop('selected', true);
			// 判断答案类别
			$('#answerType').change(function() {
				var answer = $(this).children('option:selected').text();
				if (answer === '是/否') {
					$('#selecteValue,#text,#Date').hide();
					$('#default').empty().append('<option value="1">是</option><option value="0">否</option>').show();
				} else if (answer === '文本框') {
					$('#selecteValue,#default,#Date').hide();
					// $('#defaultValue').empty().append('<input type="text" maxlength="36">');
					$('#text').show().attr('maxlength', 36).removeClass('numeral');
				} else if (answer === '数字') {
					$('#selecteValue,#default,#Date').hide();
					// $('#defaultValue').empty().append('<input type="text" maxlength="12" class="numeral">');
					$('#text').show().attr('maxlength', 12).addClass('numeral');
				} else if (answer === '日期') {
					$('#selecteValue,#default,#text').hide();
					$('#Date').show();
				} else {
					$('#selecteValue,#default').show();
					$('#Date,#text').hide();
					$('#selecteValue textarea').blur(function() {
						var str = '';
						var key = $(this).val();
						key = key.replace(/；/g, ";");
						var answer = key.split(';');
						for (var i = 0; i < answer.length; i++) {
							str += '<option value="' + answer[i] + '">' + answer[i] + '</option>';
						}
						$('#default').empty().append(str);
					});
				}
				if (chooseValue)
					$('#selecteValue textarea').trigger('blur');
				if ($('#default').is(':visible')) {
					var valu = $('#default').children('option:selected').val();
					$('#real-defaultvalue').val(valu);
				}
				if ($('#Date').is(':visible')) {
					$('#real-defaultvalue').val($('#Date').val());
				}
				if ($('#text').is(':visible')) {
					$('#real-defaultvalue').val($('#text').val());
				}
			}).trigger('change');


			var dt = $('#Date');
			dt.datePicker({
				dateFmt: 'yyyy-MM-dd'
			});

			/*if (!dt.val()) {
					dt.val($.formatDate(new Date(), 'yyyy-MM-dd'));
				}*/



			$(document).delegate('#determine', 'click', function() {
				var tarForm = $("#form-add-problem");
				if (!tarForm.doValidate())
					return;

				$('#real-defaultvalue').val($('#default').children('option:selected').val());

				var api = $(this).attr("data-action");
				$.ajax(common.ajaxCall({
					url: api,
					type: 'post',
					data: tarForm.serialize(),
					success: function() {
						top.location.reload();
					},
					error: function(msg) {
						if ($('.error-text').is(":hidden")) {
							$('.error-text').show();
						}
						$('.error-text').html(msg);
					}
				}));
			}).
			delegate('#cancel', 'click', function() {
				art.dialog.close();
			});


		}
	};

	/****************系统配置-用户管理******************************/
	var UserManagement = {
		init: function() {


			$('#resetPassword').click(function() {
				$('.add-user-system').show();
			});


			if ($('#avaUpload').length > 0) {
				$("#avaUpload").on("click", function() {
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


			$("#closeDialog").on("click", function() {
				art.dialog.list["uploadHdpicDialog"].close();
			});



			var birthday = $("#birthday");
			birthday.datePicker({
				dateFmt: 'yyyy-MM-dd'
			});

			$(document).delegate('#saveLogin', 'click', function() {
				var tarForm = $("#form-add-patient");
				if (!tarForm.doValidate())
					return;

				var text = $('#department').children('option:selected').text();
				$('#departmentName').val(text);

				var api = $(this).attr('data-action');
				$.ajax(common.ajaxCall({
					url: api,
					type: 'post',
					data: tarForm.serialize(),
					success: function() {
						$(this).dialogSuccess('操作成功！');
					},
					error: function(msg) {
						alert(msg);
					}
				}));
			})
				.delegate('#saveEditLogin', 'click', function() {
					var tarForm = $("#form-edit-patient");
					if (!tarForm.doValidate())
						return;

					$('#departmentName').val($('#department').children('option:selected').text());

					var api = $(this).attr('data-action');
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						data: tarForm.serialize(),
						success: function() {
							location.href = $('#saveEditLogin').attr('data-href');
						},
						error: function(msg) {
							alert(msg);
						}
					}));
				});


			// 点击删除
			$(document).delegate('.delete-item', 'click', function() {
				var api = $(this).attr('data-href');
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
			})
				.delegate('#sync', 'click', function() {
					var api = $(this).attr('data-action');
					$.ajax({
						url: api,
						cache: false,
						type: 'post',
						success: function(data) {
							data = JSON.parse(data);
							alert(data.status.msg);
						},
						error: function(xhr, textstatus, error) {
							alert(textstatus);
						}
					});
				});
		}
	};

	/****************系统配置-组织架构建设************************************/
	var Structure = {
		init: function() {


			// 树形结构
			var api = $('#structure-tree').attr('data-href');
			$.ajax(common.ajaxCall({
				url: api,
				type: 'post',
				success: function(data) {
					var orgInfo = data.ds;
					var a = [];
					var b = [];
					var c = [];
					for (var i = 0; i < orgInfo.length; i++) {
						var item = orgInfo[i];
						switch (item.label) {
							case 0:
								a.push(item);
								break;
							case 1:
								b.push(item);
								break;
							case 2:
								c.push(item);
								break;
							default:
								break;
						}
					}
					$('.organize-tree').empty();
					for (var j = 0; j < a.length; j++) {
						$('.organize-tree').append('<dt data-id="' + a[j].orgId + '" data-cfg={"orgName":"' + a[j].orgName + '","charCode":"' + a[j].charCode + '","preOrgName":"' + a[j].preOrgName + '","orgId":"' + a[j].orgId + '","label":"' + a[j].label + '"}><span class="tree-more"><a href="javascript:;">' + a[j].orgName + '</a></span></dt>');
					}
					for (var m = 0; m < b.length; m++) {
						$('.organize-tree dt[data-id=' + b[m].preOrgId + ']').after('<dd data-id="' + b[m].orgId + '"><span class="tree-more" data-cfg={"orgName":"' + b[m].orgName + '","charCode":"' + b[m].charCode + '","preOrgName":"' + b[m].preOrgName + '","orgId":"' + b[m].orgId + '","label":"' + b[m].label + '"}><a href="javascript:;">' + b[m].orgName + '</a></span>');
					}
					for (var n = 0; n < c.length; n++) {
						$('.organize-tree dd[data-id=' + c[n].preOrgId + ']').append('<cite data-id="' + c[n].orgId + '" data-cfg={"orgName":"' + c[n].orgName + '","charCode":"' + c[n].charCode + '","preOrgName":"' + c[n].preOrgName + '","orgId":"' + c[n].orgId + '","label":"' + c[n].label + '"}><a href="javascript:;">' + c[n].orgName + '</a></cite>');
					}
				},
				error: function(msg) {
					alert(msg);
				}
			}));
			$(document).delegate('.organize-tree dt,.organize-tree dd span,.organize-tree dd cite', 'click', function() {
				$('.organize-tree dt').removeClass('mark');
				$('.organize-tree dd').removeClass('mark');
				var message = $.parseJSON($(this).attr("data-cfg"));
				$('#name').text(message.orgName);
				$('#label').val(message.label);
				$('#orgId').val(message.orgId);
				$('#previousNode').text(message.preOrgName);
				$('#spell').text(message.charCode);
			}).
			delegate('.organize-tree dt', 'click', function() {
				$(this).addClass('mark').find('span').toggleClass('tree-more');
				var dd = $(this).nextUntil('dt');
				dd.toggle();

			}).
			delegate('.organize-tree dd span', 'click', function() {
				$(this).toggleClass('tree-more').addClass('mark');
				var cite = $(this).siblings('cite');
				cite.toggle();
			}).
			delegate('.organize-tree dd cite', 'click', function() {
				$('.organize-tree dd cite a').removeClass('now');
				$(this).children('a').addClass('now');
			}).
			delegate('#sync', 'click', function() {
				var api = $(this).attr('data-action');
				$.ajax({
					url: api,
					cache: false,
					type: 'post',
					success: function(data) {
						data = JSON.parse(data);
						alert(data.status.msg);
					},
					error: function(xhr, textstatus, error) {
						alert(textstatus);
					}
				});
			});

			/*// 添加子类别
			$(document).delegate('#addCategory', 'click', function() {
				$('#name').val('');
				$('#spell').val('');
				$('#orgId').val('');
				var mark = $('.organize-tree').find('.mark');
				if (mark.length > 0) {
					var item = $.parseJSON(mark.attr('data-cfg'));
					$('#previousNode').children('option[value="' + item.orgId + '"]').prop('selected', true);
				}
			}) //保存
			.delegate('#saveCategory', 'click', function() {
				var tarForm = $('#form-add-category');
				if (!tarForm.doValidate())
					return false;

				var label = '';
				var text = $('#previousNode').children('option:selected').text();
				if (text == '') {
					label = -1;
				} else {
					label = parseInt($('#previousNode').children('option:selected').attr('data-label'), 10);
				}
				$('#label').val(label);

				var api = $('#saveCategory').attr('data-action');
				$.ajax(common.ajaxCall({
					url: api,
					type: 'post',
					data: tarForm.serialize(),
					success: function(data) {
						$(this).dialogSuccess('操作成功！');
						return false;
					},
					error: function(msg) {
						alert(msg);
						return false;
					}
				}));
			}) //删除
			.delegate('#delete', 'click', function() {
				var callback = function() {
					var api = $("#delete").attr("data-href");
					var mark = $('.organize-tree').find('.mark');
					if (!mark[0])
						return;
					var item = $.parseJSON(mark.attr('data-cfg'));
					api += item.orgId;
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						success: function() {
							art.dialog({
								content: '操作成功！',
								icon: 'success',
								time: 1
							});
							setTimeout(function() {
								art.dialog.close();
								top.location.reload();
							}, 1100);
						},
						error: function(msg) {
							alert(msg);
						}
					}));

				};
				$(this).dialogConfirm(callback);
			});*/

		}
	};

	/******************************基本配置-药品管理*******************************************/
	var Medicine = {
		init: function() {


			$('#retail-price,#trade-price').on('propertychange input', function() {
				var valu = $(this).val();
				if (/\./.test(valu)) {
					var len = valu.substr(valu.indexOf('.') + 1).length;
					if (len > 2) {
						$(this).val(valu.substring(0, valu.indexOf('.') + 3));
						$(this).tips('error', '只能输入两位小数！');
					}
				}
			});


			// 点击保存
			$('#saveMedicine').click(function() {
				/*var min = parseFloat($("#min").val());
				var max = parseFloat($("#max").val());
				if(max && min && max <= min) {
					art.dialog.alert("库存下限不能大于等于库存上限！");
					return;
				}*/
				var tarForm = $('#form-add-medicine');
				if (!tarForm.doValidate())
					return;


				var feeType = $('#select-feeType').children('option:selected').text();
				var unit = $('#select-unit').children('option:selected').text();
				var defaultUsage = $('#select-defaultUsage').children('option:selected').text();
				var defaultFrequency = $('#select-defaultFrequency').children('option:selected').text();
				$('#feeType').val(feeType);
				$('#unit').val(unit);
				$('#defaultUsage').val(defaultUsage);
				$('#defaultFrequency').val(defaultFrequency);


				var api = $(this).attr('data-action');
				$.ajax(common.ajaxCall({
					url: api,
					type: 'post',
					data: tarForm.serialize(),
					success: function() {
						$(this).tips('success', '操作成功！');
						setTimeout(function() {
							top.location.href = $('#saveMedicine').attr('data-href');
						}, 500);
					},
					error: function(msg) {
						$(this).tips('error', msg);
					}
				}));
			});


			// 点击删除
			$('.delete-item').click(function() {
				var api = $(this).attr('data-href');
				var callback = function() {
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						success: function() {
							top.location.reload();
						},
						error: function() {
							$(this).dialogError(msg);
						}
					}));
				};
				$(this).dialogConfirm(callback);
			});
		}
		/*inputValue: function() {
			$("#min").blur(function() {
				var min = parseFloat($(this).val());
				var max = parseFloat($("#max").val());
				if (max) {
					if (max <= min) {
						art.dialog.alert("库存下限不能大于等于库存上限！");
						$("#min").val('');
					}
				}
			});
			$("#max").blur(function() {
				var min = parseFloat($("#min").val());
				var max = parseFloat($(this).val());
				if (min) {
					if (max <= min) {
						art.dialog.alert("库存上限不能小于等于库存下限！");
						$("#max").val('');
					}
				}
			});
		}*/
	};

	/********************基本配置-收费项目*********************************************/
	var Charge = {
		init: function() {

			$('#addCharge').click(function() {
				var url = $(this).attr('data-href');
				art.dialog.open(url, {
					width: 400,
					height: 370,
					title: '新增收费项目',
					lock: true
				});
			});

			$('.edit').click(function() {
				var url = $(this).attr('data-href');
				art.dialog.open(url, {
					width: 400,
					height: 370,
					title: '编辑收费项目',
					lock: true
				});
			});

			$('#saveCharge').click(function() {
				var tarForm = $('#form-add-charge');
				if (!tarForm.doValidate())
					return;

				var feeCatlogId = $('#feeCatlogId').children('option:selected').text();
				var unitId = $('#unitId').children('option:selected').text();
				$('#feeCatlog').val(feeCatlogId);
				$('#unit').val(unitId);

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
			});
			$(document).delegate('#cancel', 'click', function() {
				art.dialog.close();
			})
				.delegate('.delete-item', 'click', function() {
					var api = $(this).attr('data-href');
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

		}
	};

	/***********************基本配置-仓库管理*********************************************/
	var Storage = {
		init: function() {



			$('#select-departmentId').change(function() {
				var doctorId = $('#doctorId').val();
				var departmentId = $(this).children('option:selected').val();
				var api = $(this).attr('data-href');
				$.ajax(common.ajaxCall({
					url: api,
					type: 'post',
					data: {
						departmentId: departmentId
					},
					success: function(data) {
						var ds = data.ds,
							html;
						for (var i = 0; i < ds.length; i++) {
							var item = ds[i];
							if (item.doctorId == doctorId) {
								html += '<option value="' + item.doctorId + '" selected="selected">' + item.doctorName + '</option>';
								continue;
							}
							html += '<option value="' + item.doctorId + '">' + item.doctorName + '</option>';
						}
						$('#select-inChangedId').empty().append(html);
					},
					error: function(msg) {
						alert(msg);
					}
				}));
			}).trigger('change');



			$('#addStorage').click(function() {
				var url = $(this).attr('data-href');
				art.dialog.open(url, {
					width: 400,
					height: 420,
					title: "新增仓库管理",
					lock: true
				});
			});

			$(document).delegate('#saveStorage', 'click', function() {
				var tarForm = $('#form-add-storage');
				if (!tarForm.doValidate())
					return;

				$('#departmentName').val($('#select-departmentId').children('option:selected').text());
				$('#inChangedMan').val($('#select-inChangedId').children('option:selected').text());

				var api = $(this).attr('data-action');
				$.ajax(common.ajaxCall({
					url: api,
					type: 'post',
					data: tarForm.serialize(),
					success: function() {
						top.location.reload();
					},
					error: function(msg) {
						$(this).dialogError(msg);
					}
				}));
			})
				.delegate('#cancel', 'click', function() {
					art.dialog.close();
				})
				.delegate('.edit', 'click', function() {
					var url = $(this).attr('data-href');
					art.dialog.open(url, {
						width: 400,
						height: 420,
						title: "编辑仓库管理",
						lock: true,
						init: function() {
							var iframe = this.iframe.contentWindow.document;
							var doctorId = $('#doctorId', iframe).val();
							$('#select-inChangedId', iframe).children('option[value="' + doctorId + '"]').prop('selected', true);
						}
					});
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
		}
	};


	/******************基本配置-系统参数*****************************************************/
	var Parameter = {
		init: function() {
			$(document).delegate('#addParameter', 'click', function() {
				var url = $(this).attr('data-href');
				art.dialog.open(url, {
					width: 400,
					height: 400,
					title: '新增系统参数',
					lock: true
				});
			})
				.delegate('#saveParameter', 'click', function() {
					var tarForm = $('#form-add-parameter');
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
				.delegate('#cancel', 'click', function() {
					art.dialog.close();
				})
				.delegate('.edit', 'click', function() {
					var url = $(this).attr('data-href');
					art.dialog.open(url, {
						width: 400,
						height: 400,
						title: '编辑系统参数',
						lock: true
					});
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
		}
	};

	/*****************基本配置-供应商管理************************************************/
	var Supplier = {
		init: function() {


			//选择省
			if ($("#outProvince").length > 0)
				$("#outProvince").selectProvince();
			//选择地区
			if ($("#province").length > 0)
				$("#province").selectArea();

			$(document).delegate('#addSupplier', 'click', function() {
				var url = $(this).attr('data-href');
				art.dialog.open(url, {
					width: 400,
					height: 470,
					title: '新增供应商',
					lock: true
				});
			})
				.delegate('#saveSupplier', 'click', function() {
					var tarForm = $('#form-add-supplier');
					if (!tarForm.doValidate())
						return;

					var api = $(this).attr('data-action');
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						data: tarForm.serialize(),
						success: function() {
							$(this).tips('success', '添加成功！');
							setTimeout(function() {
								top.location.reload();
							}, 500);
						},
						error: function(msg) {
							alert(msg);
						}
					}));
				})
				.delegate('#cancel', 'click', function() {
					art.dialog.close();
				})
				.delegate('.edit', 'click', function() {
					var url = $(this).attr('data-href');
					art.dialog.open(url, {
						width: 400,
						height: 470,
						title: '编辑供应商',
						lock: true
					});
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

			var address = function() {
				$(".address").each(function() {
					var me = $(this);
					var api = me.attr("data-href");
					var code = me.attr("value");
					var provinceCode = code.substring(0, 3) + '000';
					code = parseInt(code, 10);
					provinceCode = parseInt(provinceCode, 10);
					$.ajax({
						url: api,
						dataType: 'json',
						cache: false,
						success: function(data) {
							me.next().empty();
							for (var key in data) {
								if (data[key].code == provinceCode) {
									var child = data[key].children;
									for (var ind in child) {
										if (child[ind].code == code) {
											me.next().text(data[key].name + '-' + child[ind].name);
										}
									}
								}

							}
						},
						error: function(xhr, textstatus) {
							// art.dialog.tips(textstatus);
							art.dialog({
								content: textstatus,
								icon: 'error',
								time: 1
							});
						}
					});
				});
			};
			address();
		}
	};


	/******************************权限配置***********************************/
	var Permission = {
		init: function() {

			var me = this;
			me.per();


			// 选择所有角色
			/*$('#check_all_role').click(function() {
				var ck = this.checked;
				$(this).parents('table:first').find('input[type="checkbox"]').prop('checked', ck);
			});*/


			$('.table-list input[type="radio"]').click(function() {
				$('.permissions input[type="checkbox"]').prop('checked', false);
				var api = $(this).attr('data-action');
				$.ajax(common.ajaxCall({
					url: api,
					type: 'post',
					success: function(data) {
						var ds = data.ds;
						for (var i = ds.length - 1; i >= 0; i--) {
							var item = ds[i];
							if (item.has_role == 0)
								continue;
							$('.permissions input[value="' + item.pk_tuiid + '"]').prop('checked', true);
						}
					},
					error: function(msg) {
						alert(msg);
					}
				}));
			});

			// 选择权限
			$('.permissions .f-l').each(function() {
				$(this).find('span input[type="checkbox"]').bind('click', function() {
					var ck = this.checked;
					$(this).parents('.f-l:first').find('input[type="checkbox"]').prop('checked', ck);
				});
				$(this).find('li input[type="checkbox"]').bind('click', function() {
					/*var ck = this.checked;*/
					if ($(this).parents('.f-l').find('li input:checked').length > 0)
						$(this).parents('.f-l:first').find('span input[type="checkbox"]').prop('checked', true);
					else
						$(this).parents('.f-l:first').find('span input[type="checkbox"]').prop('checked', false);
				});
			});

			// 点击保存
			$('#savePermission').click(function() {
				var tarForm = $('#form_add_permission');
				var api = $(this).attr('data-action');
				$.ajax(common.ajaxCall({
					url: api,
					data: tarForm.serialize(),
					success: function() {
						$(this).tips('success', '保存成功', 1);
					},
					error: function(msg) {
						alert(msg);
					}
				}));
			});

		},
		per: function() {
			var data = JSON.parse($('#menuData').val());
			var strHtml = '';
			var mid = '';
			var count = 0;
			for (var s in data) {
				if (data[s].ui_type == 'M') {
					count++;
					if (count == 1) {
						strHtml += '<div class="f-r h-auto permissions mar-b20">';
					}
					strHtml += '<ul class="f-l">' + '<span><label><input name="uiId" type="checkbox" value="' + data[s].pk_tuiid + '"></label><pojo>' + data[s].ui_common + '</pojo></span>';
					mid = data[s].ui_sid;
				}
				if (data[s].ui_type == 'P') {
					strHtml += '<li><label><input name="uiId" type="checkbox" value="' + data[s].pk_tuiid + '"></label><i>' + data[s].ui_common + '</i></li>';
				}
				if (parseInt(s, 10) + 1 < data.length && data[parseInt(s, 10) + 1].ui_type == 'M') {
					strHtml += '</ul>';
					if (count == 3) {
						strHtml += '</div>';
						count = 0;
					}
				}

			}
			$('#J_uiList').html(strHtml);
		}
	};

	/*********************角色管理***********************************/
	var RoleManage = {
		init: function() {

			var bindingUser = [],
				flag;

			$('#add_role').click(function() {
				var url = $(this).attr('data-href');
				art.dialog.open(url, {
					width: 400,
					height: 330,
					title: '新增角色',
					lock: true
				});
			});

			$('.edit').click(function() {
				var url = $(this).attr('data-href');
				art.dialog.open(url, {
					width: 400,
					height: 330,
					title: '编辑角色',
					lock: true
				});
			});

			$(document).delegate('#saveRole', 'click', function() {
				var tarForm = $('#form-add-role');
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
				});


			$('.blue-but').click(function() {
				var url = $(this).attr('data-href');
				art.dialog.open(url, {
					widht: 640,
					height: 620,
					title: '绑定员工',
					lock: true
				});
			});

			$(document).delegate('.all-close', 'click', function() {
				$(this).toggleClass('all-open').toggleClass('all-close');
				$(this).parents('.f-l:first').next().show().end().next().next().show();

			})
				.delegate('.all-open', 'click', function() {
					$(this).toggleClass('all-open').toggleClass('all-close');
					$(this).parents('.f-l:first').next().hide().end().next().next().hide();
				})
				.delegate('.binding-list li', 'mouseover', function() {
					$(this).find('em').show();
				})
				.delegate('.binding-list li', 'mouseout', function() {
					$(this).find('em').hide();
				})
				.delegate('.li-open p a', 'click', function() {
					var userId = $(this).attr('data-id');
					if (flag === undefined && bindingUser.length === 0) { //第一次点击记录所有id
						$('.binding-list li').each(function() {
							var id = $(this).attr('data-id');
							bindingUser.push(id);
							if (userId === id)
								flag = false;
						});
					} else {
						for (var i = 0; i < bindingUser.length; i++) {
							if (userId === bindingUser[i])
								flag = false;
						}
					}
					if (flag === false) {
						flag = true;
						return;
					}
					bindingUser.push(userId);
					var html = '<li data-id="' + userId + '"><i class="f-l">' + $(this).text() + '</i><em class="f-r" style="display:none;"><a href="javascript:;" class="red-but" title="删除">&times;</a></em></li>';
					$('.binding-list').append(html);
					flag = true;
				})
				.delegate('.li-open em a', 'click', function() {
					if (bindingUser.length === 0) {
						$('.binding-list li').each(function() {
							var id = $(this).attr('data-id');
							bindingUser.push(id);
						});
					}
					$(this).parents('.li-open:first').find('p a').each(function() {
						var userId = $(this).attr('data-id');
						for (var i = 0; i < bindingUser.length; i++) {
							if (userId === bindingUser[i])
								return;
						}
						bindingUser.push(userId);
						var html = '<li data-id="' + userId + '"><i class="f-l">' + $(this).text() + '</i><em class="f-r" style="display:none;"><a href="javascript:;" class="red-but" title="删除">&times;</a></em></li>';
						$('.binding-list').append(html);
					});
				})
				.delegate('.binding-list em', 'click', function() {
					if (bindingUser.length === 0) {
						$('.binding-list li').each(function() {
							var id = $(this).attr('data-id');
							bindingUser.push(id);
						});
					}
					var _parents = $(this).parents('li:first');
					var id = _parents.attr('data-id');
					for (var i = 0; i < bindingUser.length; i++) {
						if (bindingUser[i] == id)
							bindingUser.splice(i, 1);
					}
					_parents.remove();
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
				})
				.delegate('#saveMember', 'click', function() {

					if (bindingUser.length === 0) {
						$('.binding-list li').each(function() {
							var id = $(this).attr('data-id');
							bindingUser.push(id);
						});
					}
					var data = {
						role_code: $('#role_code').val(),
						member: bindingUser
					};
					var api = $(this).attr('data-action');
					$.ajax(common.ajaxCall({
						url: api,
						data: {
							resultJson: JSON.stringify(data)
						},
						type: 'post',
						success: function() {
							art.dialog.close();
						},
						error: function(msg) {
							alert(msg);
						}
					}));
				});

		}
	};

	/*****************治疗模板*********************************/
	var Treatment = {
		init: function() {

			$('#addPlan').click(function() {
				var url = $(this).attr('data-href');
				/*$.post(url,function(html) {
					art.dialog({
						content: html
					});
				});*/
				art.dialog.open(url, {
					width: 400,
					height: 690,
					title: '新增计划',
					lock: true,
					init: function() {
						var _iframe = this.iframe.contentWindow.document;

						// 治疗类型改变对应项隐藏
						$('#treat-type', _iframe).change(function() {
							var typeId = $(this).children('option:selected').val();
							/*var api = $(this).attr('data-action');
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
									$('#treat-project', _iframe).empty().append(html);
								},
								error: function(msg) {
									alert(msg);
								}
							}));*/
							if (typeId !== '1') {
								$('#medicines-type', _iframe).parents('li:first').hide();
								$('#method', _iframe).parents('li:first').hide();
								$('#frequency', _iframe).parents('li:first').hide();
								$('#singledose', _iframe).parents('li:first').hide();
								$('#medicineunit', _iframe).hide();
								$('#itemunit', _iframe).show();
							} else {
								$('#medicines-type', _iframe).parents('li:first').show();
								$('#method', _iframe).parents('li:first').show();
								$('#frequency', _iframe).parents('li:first').show();
								$('#singledose', _iframe).parents('li:first').show();
								$('#medicineunit', _iframe).show();
								$('#itemunit', _iframe).hide();
							}
						}).trigger('change');

						// 计算总量
						$('#frequency,#singledose', _iframe).blur(function() {
							var frequency = parseInt($('#frequency', _iframe).val(), 10);
							var dose = parseInt($('#singledose', _iframe).val(), 10);
							if (!frequency || !dose) {
								$('#totaldose', _iframe).text('');
								return;
							}
							var total = frequency * dose;
							$('#totaldose', _iframe).text(total);
						});

					}
				});
			});


			$('#treat-project').showlist({
				width: 250,
				keyID: 'itemId',
				bindSub: $('#projectId'),
				selectCallBack: function(d) {
					$('#projectId').val(d.itemId);
				},
				buildHtml: function(ds) {
					var html = '<table cellpadding="0" cellspacing="1" class="table-list ab-table-div-title"><thead><tr><td width="60%">项目名称</td><td width="30%">单位</td></tr></thead><tbody>';
					for (var i = 0; i < ds.length; i++) {
						var item = ds[i];
						html += '<tr data-id="' + item.itemId + '" data-name="' + item.itemName + '" class="tr-hover"><td width="60%">' + item.itemName + '</td><td width="30%">' + item.unit + '</td></tr>';
					}
					html += '</tbody></table>';
					return html;
				},
				extraParams: function() {
					return {
						type: $('#treat-type').children('option:selected').val()
					};
				}
			});


			$('.edit').live('click', function() {
				$('.tr-hover').removeClass('flag');
				var _parents = $(this).parents('.tr-hover:first');
				_parents.addClass('flag');
				var data = {
					dealTime: _parents.find('.deal_day').text(),
					hour: _parents.find('.hour').text(),
					minute: _parents.find('.minute').text(),
					treatId: _parents.find('.terapyId').val(),
					projectName: _parents.find('.projectName').text(),
					projectId: _parents.find('.projectId').val(),
					medicinesId: _parents.find('.medicinesId').val(),
					methodId: _parents.find('.methodId').val(),
					frequency: _parents.find('.frequency').text(),
					singledose: _parents.find('.singledose').text(),
					unitId: _parents.find('.unitId').val(),
					totaldose: _parents.find('.totaldose').text(),
					note: _parents.find('.note').val()
				};
				art.dialog.data('detail', data);
				var url = $(this).attr('data-href');
				art.dialog.open(url, {
					width: 400,
					height: 690,
					title: '编辑计划',
					lock: true,
					init: function() {
						var detail = art.dialog.data('detail');
						var _iframe = this.iframe.contentWindow.document;
						$('#deal-time', _iframe).val(detail.dealTime);
						$('#hour', _iframe).val(detail.hour);
						$('#minute', _iframe).val(detail.minute);
						$('#treat-type', _iframe).children('option[value=' + detail.treatId + ']').prop('selected', true);
						$('#treat-project', _iframe).val(detail.projectName);
						$('#projectId', _iframe).val(detail.projectId);
						$('#medicines-type', _iframe).children('option[value=' + detail.medicinesId + ']').prop('selected', true);
						$('#method', _iframe).children('option[value=' + detail.methodId + ']').prop('selected', true);
						$('#frequency', _iframe).val(detail.frequency);
						$('#singledose', _iframe).val(detail.singledose);
						$('.unit:visible', _iframe).children('option[' + detail.unitId + ']').prop('selected', true);
						$('#totaldose', _iframe).text(detail.totaldose);
						$('#note', _iframe).val(detail.note);

						// 治疗类型改变
						$('#treat-type', _iframe).change(function() {
							var typeId = $(this).children('option:selected').val();
							if (typeId !== '1') {
								$('#medicines-type', _iframe).parents('li:first').hide();
								$('#method', _iframe).parents('li:first').hide();
								$('#frequency', _iframe).parents('li:first').hide();
								$('#singledose', _iframe).parents('li:first').hide();
								$('#medicineunit', _iframe).hide();
								$('#itemunit', _iframe).show();
							} else {
								$('#medicines-type', _iframe).parents('li:first').show();
								$('#method', _iframe).parents('li:first').show();
								$('#frequency', _iframe).parents('li:first').show();
								$('#singledose', _iframe).parents('li:first').show();
								$('#medicineunit', _iframe).show();
								$('#itemunit', _iframe).hide();
							}
						}).trigger('change');

						$('#frequency,#singledose', _iframe).blur(function() {
							var frequency = parseInt($('#frequency', _iframe).val(), 10);
							var dose = parseInt($('#singledose', _iframe).val(), 10);
							if (!frequency || !dose) {
								$('#totaldose', _iframe).text('');
								return;
							}
							var total = frequency * dose;
							$('#totaldose', _iframe).text(total);
						});
					}
				});
			});

			$(document).delegate('#savePlan', 'click', function() {
				var tarForm = $('#form-add-plan');
				if (!tarForm.doValidate())
					return;
				$('.flag', top.document).remove();
				var data = {
					dealTime: $('#deal-time').val(),
					hour: $('#hour').val(),
					minute: $('#minute').val(),
					treatType: $('#treat-type').children('option:selected').text(),
					treatId: $('#treat-type').children('option:selected').val(),
					treatProject: $('#treat-project').val(),
					projectId: $('#projectId').val(),
					medicinesType: $('#medicines-type').children('option:selected').text(),
					medicinesId: $('#medicines-type').children('option:selected').val(),
					method: $('#method').children('option:selected').text(),
					methodId: $('#method').children('option:selected').val(),
					frequency: $('#frequency').val(),
					singledose: $('#singledose').val(),
					unit: $('.unit:visible').children('option:selected').text(),
					unitId: $('.unit:visible').children('option:selected').val(),
					totaldose: $('#totaldose').text(),
					note: $('#note').val()
				};
				$('#plan_template', top.document).tmpl(data).prependTo($('.table-list', top.document));
				art.dialog.close();
			})
				.delegate('#cancel', 'click', function() {
					art.dialog.close();
				})
				.delegate('.delete-item', 'click', function() {
					if ($(this).hasClass('delete')) {
						$(this).parents('.tr-hover:first').remove();
						return;
					}
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

			$('#saveInfo').click(function() {
				var tarForm = $('#form-template-info');
				var data = [];
				$('.table-list .tr-hover').each(function() {
					var _parents = $(this);
					var ms = {
						dealTime: _parents.find('.deal_day').text(),
						hour: _parents.find('.hour').text(),
						minute: _parents.find('.minute').text(),
						treatId: _parents.find('.terapyId').val(),
						projectId: _parents.find('.projectId').val(),
						medicinesId: _parents.find('.medicinesId').val(),
						methodId: _parents.find('.methodId').val(),
						frequency: _parents.find('.frequency').text(),
						singledose: _parents.find('.singledose').text(),
						unitId: _parents.find('.unitId').val(),
						totaldose: _parents.find('.totaldose').text(),
						note: _parents.find('.note').val()
					};
					data.push(ms);
				});
				var url = $(this).attr('data-href');
				var api = $(this).attr('data-action');
				$.ajax(common.ajaxCall({
					url: api,
					type: 'post',
					data: {
						Info: tarForm.serialize(),
						detail: JSON.stringify(data)
					},
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
		}
	};

	/***文档管理****/
	/**********************************************************/
	var File = {
		addModule: true,
		init: function() {
			var me = this;
			$('#addFile').click(function() {
				me.addModule = true;
				me.operFile(this);
			});

			$('.editFile').click(function() {
				me.addModule = false;
				me.operFile(this);
			});

			// 点击删除
			$('.delete').click(function() {
				var api = $(this).attr('data-action');
				$.ajax(common.ajaxCall({
					url: api,
					success: function() {
						$(this).tips('success', '删除成功！', 1);
						setTimeout(function() {
							location.reload();
						}, 1000);
					},
					error: function(msg) {
						alert(msg);
					}
				}));
			});
		},
		operFile: function(attr) {
			var me = this;
			var _this = $(attr);
			var api = _this.attr('data-href');
			$.ajax({
				url: api,
				cache: false,
				success: function(html, status, xhr) {
					me.showDialog(html);

					// 关闭弹窗
					$('#cancel').click(function() {
						art.dialog.list['addFile'].close();
					});

					// 点击确定
					$('#saveFile').click(function() {

						if ($('#filename').val() === '') {
							var obj = $('#filename');
							obj.focus();
							obj.addClass('error-area');
							if ($('.error-text').is(":hidden")) {
								$('.error-text').show();
							}
							$('.error-text').html('请输入上传文件名!');
							return false;
						}
						if ($('#file-url').val() === '') {
							if ($('.error-text').is(":hidden")) {
								$('.error-text').show();
							}
							$('.error-text').html('请上传文件!');
							return false;
						}
						var tarForm = $('#form-add-file');
						var api = $(this).attr('data-action');
						$.ajax(common.ajaxCall({
							url: api,
							data: tarForm.serialize(),
							success: function() {
								top.location.reload();
							},
							error: function(msg) {
								alert(msg);
							}
						}));
					});


				},
				error: function(xhr, textstatus, msg) {
					alert(textstatus);
				}
			});
		},
		showDialog: function(html) {
			var me = this;
			var tit = me.addModule ? '新增文档' : '编辑文档';
			art.dialog({
				id: 'addFile',
				content: html,
				width: 500,
				height: 220,
				padding: '0 0',
				title: tit,
				init: function() {
					// 文件上传
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
								setTimeout(function() {
									$('#loadFile').text(file.name).attr('href', re.path);
									$('#operFile').show().prev('li:first').hide();
								}, 1000);
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

					$('#delete').bind('click', function() {
						$('#operFile').hide().prev('li:first').show();
					});
				}
			});
		},
	};


	/*****试剂材料管理**********/
	/**************************************************************************/
	var Reagent = {
		addModule: true,
		init: function() {

			var me = this;
			// 点击新增
			$('#addReagent').click(function() {
				me.addModule = true;
				me.Ashow(this);
			});
			// 编辑
			$('.edit').click(function() {
				me.addModule = false;
				me.Ashow(this);
			});

			// 删除
			$('.delete').click(function() {
				var MaterialId = $(this).attr('data-id');
				var api = $(this).attr('data-action');
				var callback = function() {
					$.ajax(common.ajaxCall({
						url: api,
						data: {
							tubeMaterialId: MaterialId
						},
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
			// 详细页面删除
			$('.deleteDetail').click(function() {
				var Id = $(this).attr('data-id');
				var api = $(this).attr('data-action');
				var callback = function() {
					$.ajax(common.ajaxCall({
						url: api,
						data: {
							id: Id
						},
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

			// 新增产品
			$('#addProject').click(function() {
				me.addModule = true;
				me.Artshow(this);
			});
			// 编辑产品
			$('.editProject').click(function() {
				me.addModule = false;
				me.Artshow(this);
			});
		},
		Ashow: function(attr) {
			var me = this;
			var api = $(attr).attr('data-href');
			var tit = me.addModule ? "新增试管材料" : "编辑试管材料";
			$.ajax({
				url: api,
				cache: false,
				success: function(html, textstatus, xhr) {
					art.dialog({
						id: 'Reagent',
						content: html,
						title: tit,
						width: 380,
						height: 450,
						lock: true,
						init: function() {
							$("#supplier").showlist({
								keyID: 'id',
								bindSub: $('#supplierId'),
								selectCallBack: function(d) {
									$('#supplierId').val(d.id);
								},
								buildHtml: function(ds) {
									var html = '<table cellpadding="0" cellspacing="1" class="table-list ab-table-div-title" style="background: #f9f9f9;"></tbody>';
									for (var i = 0; i < ds.length; i++) {
										var item = ds[i];
										html += '<tr data-id="' + item.id + '" data-name="' + item.supplierName + '" class="tr-hover"><td>' + item.supplierName + '</td></tr>';
									}
									html += '</tbody></table>';
									return html;
								}
							});
						}
					});



					// 保存
					$('#saveReagent').click(function() {
						var tarForm = $('#form-add-reagent');
						if (!tarForm.doValidate())
							return;
						var api = $(this).attr('data-action');
						$.ajax(common.ajaxCall({
							url: api,
							data: tarForm.serialize(),
							success: function() {
								top.location.reload();
							},
							error: function(msg) {
								alert(msg);
							}
						}));

					});
					// 取消
					$('#cancel').click(function() {
						art.dialog.list['Reagent'].close();
					});
				},
				error: function(xhr, textstatus) {
					alert(textstatus);
				}
			});
		},
		Artshow: function(attr) {
			var me = this;
			var api = $(attr).attr('data-href');
			var tit = me.addModule ? "新增产品批号" : "编辑产品批号";
			$.ajax({
				url: api,
				cache: false,
				success: function(html, textstatus, xhr) {
					art.dialog({
						id: 'project',
						content: html,
						title: tit,
						width: 380,
						height: 450,
						lock: true
					});
					// 保存
					$('#saveProject').click(function() {
						var tarForm = $('#form-add-batch');
						if (!tarForm.doValidate())
							return;
						var api = $(this).attr('data-action');
						$.ajax(common.ajaxCall({
							url: api,
							data: tarForm.serialize(),
							success: function() {
								top.location.reload();
							},
							error: function(msg) {
								alert(msg);
							}
						}));

					});
					// 取消
					$('#cancel').click(function() {
						art.dialog.list['project'].close();
					});

					var dateObj = ['#arrive', '#validity', '#start_date', '#end_date'];
					$.each(dateObj, function(i, v) {
						$(v).datePicker({
							dateFmt: 'yyyy-MM-dd'
						});
					});
				},
				error: function(xhr, textstatus) {
					alert(textstatus);
				}
			});
		}
	};

	/********冷冻储存罐*************/
	/**************************************************************/
	var Tank = {
		addModule: true, //新增模式
		init: function() {

			var me = this;
			// 点击新增
			$('#addType').click(function() {
				me.addModule = true;
				me.Ashow(this);
			});
			// 编辑
			$('.edit').click(function() {
				me.addModule = false;
				me.Ashow(this);
			});

			// 删除
			$('.delete').click(function() {
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
		},
		Ashow: function(attr) {
			var me = this;
			var api = $(attr).attr('data-href');
			var tit = me.addModule ? "新增储存罐类型" : "编辑储存罐类型";
			$.ajax({
				url: api,
				cache: false,
				dataType: 'html',
				success: function(html, textstatus, xhr) {
					art.dialog({
						id: 'Tank',
						content: html,
						title: tit,
						width: 380,
						height: 314,
						lock: true,
						init: function() {
							$('#bucket').on('input propertychange', function(event) {
								var id = event.target.id;
								$('.' + id).text($(this).val());
							});
							$('#drivepipe,#straw').on('input propertychange', function(event) {
								var id = event.target.id;
								if (id === 'drivepipe') {
									var drivepipe = parseInt($('#bucket').val(), 10) * $('#drivepipe').val();
									$('.bucketNum').text(drivepipe);
									$('#bucketNum').val(drivepipe);
									$('.drivepipe').text(drivepipe);
								} else {
									var straw = parseInt($('#straw').val(), 10) * $('.drivepipe').text();
									$('.strawNum').text(straw);
									$('#strawNum').val(straw);
								}
							});
						}
					});
					// 保存
					$('#saveTank').click(function() {
						var tarForm = $('#form-add-tank');
						if (!tarForm.doValidate())
							return;
						var api = $(this).attr('data-action');
						$.ajax(common.ajaxCall({
							url: api,
							data: tarForm.serialize(),
							success: function() {
								top.location.reload();
							},
							error: function(msg) {
								alert(msg);
							}
						}));

					});
					// 取消
					$('#cancel').click(function() {
						art.dialog.list['Tank'].close();
					});
				},
				error: function(xhr, textstatus) {
					alert(textstatus);
				}
			});
		}
	};



	/****************入口*****************************************************/
	var Main = {
		init: function() {
			// 字典类别配置
			if ($('.Type').length > 0) {
				Type.init();
			}

			// 字典配置
			if ($('.Configure').length > 0) {
				Configure.init();
			}

			// 医疗模板
			if ($('.MedicalTemplate').length > 0) {
				MedicalTemplate.init();
			}

			// 用户管理
			if ($('.UserManagement').length > 0) {
				UserManagement.init();
			}

			// 组织架构建设
			if ($('.Structure').length > 0) {
				Structure.init();
			}

			// 药品管理
			if ($('.Medicine').length > 0) {
				Medicine.init();
			}

			// 收费项目
			if ($('.Charge').length > 0) {
				Charge.init();
			}

			// 仓库管理
			if ($('.Storage').length > 0) {
				Storage.init();
			}

			// 系统参数
			if ($('.Parameter').length > 0) {
				Parameter.init();
			}

			// 供应商
			if ($('.Supplier').length > 0) {
				Supplier.init();
			}

			// 权限配置
			if ($('.Permission').length > 0) {
				Permission.init();
			}

			// 角色管理
			if ($('.RoleManage').length > 0) {
				RoleManage.init();
			}

			// 治疗模板
			if ($('.Treatment').length > 0) {
				Treatment.init();
			}


			// 文档管理
			if ($('.File').length > 0) {
				File.init();
			}


			// 试剂材料管理
			if ($('.Reagent').length > 0) {
				Reagent.init();
			}

			// 冷冻储存罐类型
			if ($('.Tank').length > 0) {
				Tank.init();
			}

			// 只能输入数字
			$('.numeral').numeral();


			// textarea  lt9 不支持maxlength属性
			$('textarea').limitLength();
		}
	};

	Main.init();
});