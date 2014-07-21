define([
	'jquery',
	'app/common',
	'app/util',
	'jqtmpl',
	'pkg/DatePicker/app',
	'pkg/DateFormat/app',
	'json',
	'artDialog',
	'iframe',
	'poshytip'
], function($, common) {

	"use strict";

	/**********收费记录********************************/
	var Record = {
		init: function() {
			$('#patientName').showlist({
				width: 300,
				keyID: 'patientId',
				bindSub: $('#patientId'),
				selectCallBack: function(d) {
					$('#patientId').val(d.patientId);
				},
				buildHtml: function(ds) {
					var html = '<table cellpadding="0" cellspacing="1" class="table-list ab-table-div-title"></tbody>';
					for (var i = 0; i < ds.length; i++) {
						var item = ds[i];
						html += '<tr data-name="' + item.patientName + '" data-id="' + item.patientId + '" class="tr-hover"><td style="width:50px;">' + item.patientName + '</td><td style="width:80px;">' + item.mobile + '</td><td style="width:20px;">' + item.sexName + '</td><td style="width:20px;">' + item.age + '</td></tr>';
					}
					html += '</tbody></table>';
					return html;
				}
			});


			// 限制输入的小数
			var controlNum = function() {
				var _val = $(this).val();
				var i = _val.indexOf('.');
				if (i !== -1) {
					var sub = _val.substr(i + 1);
					if (sub.length > 2) {
						$(this).val(_val.substring(0, i + 3));
						art.dialog({
							content: "最多只能输入两位小数！",
							icon: 'face-sad',
							time: 1,
							lock: true
						});
					}
				}
			};

			$(document).delegate('.money', 'input propertychange', controlNum)
				.delegate('.money', 'blur', function() {
					var total = parseFloat($('#total').text());
					var pay = 0;
					$('.money').each(function() {
						var num = parseFloat($(this).val());
						if (isNaN(num))
							return;
						pay += num;
					});
					if ((pay - total) >= 0) {
						$('#change').removeClass('red-font').text((pay - total).toFixed(2));
					} else {
						$('#change').addClass('red-font').text((pay - total).toFixed(2));
					}
				});


			$(document).delegate('#confirm-charge', 'click', function() {
				var total = parseFloat($('#total').text());
				if (total < 0) {
					art.dialog.alert('无收费项目，不能进行收费！');
					return;
				}

				if (isNaN(parseInt($('#invoiceNo').text(), 10))) {
					art.dialog.alert('请先领用费用票据');
					return;
				}

				var api = $(this).attr('data-href') + '/' + $('#printType').children('option:selected').val() + '/' + $('#invoiceNo').text();
				/*$.ajax(common.ajaxCall({
					url: api,
					data: {
						invoiceNo: $('#invoiceNo').text(),
						printType: $('#printType').children('option:selected').val()
					},
					success: function() {

					},
					error: function() {}
				}));*/
				$.ajax({
					url: api,
					cache: false,
					success: function(html) {
						art.dialog({
							content: html,
							width: 380,
							height: 420,
							lock: true,
							title: '确认收费',
							padding: '0 0'
						});
					},
					error: function(msg) {
						alert(msg);
					}
				});
				/*art.dialog.open(api, {
					width: 380,
					height: 420,
					lock: true,
					title: '确认收费'
				});*/
			})
				.delegate('#Charge', 'click', function() {
					var tarForm = $('#form-charge');
					var change = parseFloat($('#change').text());
					if (isNaN(change)) {
						art.dialog.alert("应付款不足，请重新付款！");
						return;
					}
					var api = $(this).attr('data-action');
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						data: tarForm.serialize(),
						success: function(data) {
							var print = $('#Charge').data('print');
							var href = $('#Charge').data('href');
							// art.dialog.close();
							var feeRecordNo = data.ds;
							$.ajax({
								url: print,
								data: {
									feeRecordNo: feeRecordNo
								},
								cache: false,
								success: function(html) {
									$('body').empty().append(html);
									window.print();
									top.location.href = href;
								},
								error: function(msg) {
									alert(msg);
								}
							});
							// top.location.href = $('#Charge').data('href');
						},
						error: function(msg) {
							alert(msg);
						}
					}));
				})
				.delegate('#cancel', 'click', function() {
					art.dialog.close();
				})
				.delegate('#Retype', 'click', function() {
					var api = $(this).attr('data-href');
					art.dialog.open(api, {
						width: 400,
						height: 280,
						lock: true,
						title: '补打发票'
					});
				})
				.delegate('#retype-invoice', 'click', function() {
					var tarForm = $('#form-retype-invoice');
					if (!tarForm.doValidate())
						return;
					var api = $(this).attr('data-action');
					$.ajax(common.ajaxCall({
						url: api,
						type: 'post',
						data: tarForm.serialize(),
						success: function() {
							art.dialog.close();
						},
						error: function(msg) {
							alert(msg);
						}
					}));

				});


			// 若无发票号提示
			if ($('#invoiceNo')[0] && !$('#invoiceNo').text()) {
				var url = $('#getReceipt').val();
				art.dialog.alert('当前无发票号码，请领用发票！', function() {
					top.location.href = url;
				});
			}

			// 发票跳号
			$('#changeInvoice').click(function() {
				var invoiceNo = parseInt($('#invoiceNo').text(), 10);
				if (isNaN(invoiceNo)) {
					art.dialog.alert('无可用发票号！');
					return;
				}
				var api = $(this).attr('data-action');
				$.ajax(common.ajaxCall({
					url: api,
					success: function(data) {
						$('#invoiceNo').text(data.ds);
					},
					error: function(msg) {
						alert(msg);
					}
				}));
				/*var max = parseInt($('#max-num').val(), 10);
				invoiceNo++;
				if (max < invoiceNo)
					return;
				$('#invoiceNo').text(invoiceNo);*/
			});



			var startDate = $('#start-date');
			var endDate = $('#end-date');
			startDate.datePicker({
				dateFmt: 'yyyy-MM-dd'
			});
			endDate.datePicker({
				dateFmt: 'yyyy-MM-dd'
			});


			// 打印
			$('#print').click(function() {
				/*var content = $('body').clone(true);
				// var printContent = $('.print-area').clone().find('.list-bottom-div').remove().end().show();
				$.post($('#preview-print').attr('data-href'), function(html) {
					$('body').empty().append(html);
					$('.list-bottom-div').remove();
					window.print();
					setTimeout(function() {
						$('body').empty().append(content);
					}, 0.001);
				});*/
				window.print();

			});

			$('#preview-print').printPreview({
				tit: '打印预览'
			});
		}
	};

	/***********票据领用**********************************/
	var Ticket = {
		init: function() {
			$(document).delegate('#addTicket', 'click', function() {
				var api = $(this).attr('data-href');
				art.dialog.open(api, {
					width: 390,
					height: 520,
					lock: true,
					title: '新增票据'
				});
			})
				.delegate('.edit', 'click', function() {
					var api = $(this).attr('data-href');
					art.dialog.open(api, {
						width: 390,
						height: 520,
						lock: true,
						title: '编辑票据'
					});
				});
			$('#receive').datePicker({
				dateFmt: 'yyyy-MM-dd'
			});


			$('#start').blur(function() {
				if ($('#end').val()) {
					if (parseInt($(this).val(), 10) >= parseInt($('#end').val(), 10)) {
						art.dialog.alert('结束票号不能小于开始票号');
						$(this).val('');
						return;
					}
				}
				if ($('#current').val())
					return;
				$('#current').val($.trim($(this).val()));
			});

			$('#end').blur(function() {
				if (!$('#start').val())
					return;
				if (parseInt($(this).val(), 10) <= parseInt($('#start').val(), 10)) {
					art.dialog.alert('结束票号不能小于开始票号');
					$(this).val('');
				}
			});

			$('#status').change(function() {
				if ($('#status').attr('exist') === 'false')
					return;
				if ($(this).children('option:selected').val() === '1')
					$(this).children('option[value="2"]').prop('selected', true);
			});

			$('#saveTicket').click(function() {
				var tarForm = $('#form-add-ticket');
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
			});
		}
	};


	/**********发票补打******************************************************/
	var Invoice = {
		init: function() {
			// 点击查看发票详情
			$('#receipt-submit').click(function() {
				var o = $('#oldreceipt');
				if (!o.val()) {
					o.poshytip({
						className: 'tip-yellowsimple',
						content: '请输入原发票号',
						showOn: 'focus',
						showTimeout: 1,
						alignTo: 'target',
						alignX: 'center',
						offsetY: 5,
						allowTipHover: false
					});
					o.focus();
					o.css("border", "1px solid red");
					return false;
				} else {
					o.css("border", "");
				}
				var api = $(this).attr('data-action');
				$.ajax(common.ajaxCall({
					url: api,
					data: $(this).parents('form:first').serialize(),
					success: function(data) {
						var list = data.ds.list;
						var html = '<thead><input type="hidden" id="receiptNo" value="' + data.ds.receiptNo + '"><input type="hidden" id="receiptType" value="' + data.ds.receiptType + '"><input type="hidden" id="oldreceiptNo" value="' + data.ds.oldreceiptNo + '"><tr><td width="12%">项目编号</td><td width="17%">项目名称</td><td width="8%">单位</td><td width="8%">单价</td><td width="8%">数量</td><td width="12%">总金额</td><td width="12%">费用类型</td><td width="12%">接诊医生</td><td width="11%">接诊时间</td></tr></thead>';
						for (var i = list.length - 1; i >= 0; i--) {
							var item = list[i];
							html += '<tr class="tr-hover"><td>' + item.itemCode + '</td><td>' + item.itemName + '</td><td>' + item.unit + '</td><td>' + item.price + '</td><td>' + item.num + '</td><td>' + item.totalamt + '</td><td>' + item.feeItemName + '</td><td>' + item.doctorName + '</td><td>' + item.consulttime + '</td></tr>';
						}
						$('.table-list').empty().append(html);
					},
					error: function(msg) {
						art.dialog.alert(msg);
					}
				}));
				return false;
			});


			// 发票重打
			$('#reprint').click(function() {
				var len = $('.table-list tbody').length;
				if (len === 0)
					return;
				var api = $(this).attr('data-action');
				$.ajax(common.ajaxCall({
					url: api,
					data: {
						status: $('#status').val(),
						receiptType: $('#receiptType').val(),
						oldreceiptNo: $('#oldreceiptNo').val()
					},
					success: function() {
						location.reload();
					}
				}));
			});
		}
	};

	/******入口****************************************/
	var Main = {
		init: function() {
			Record.init();
			Ticket.init();
			Invoice.init();
		}
	};
	Main.init();
	$('.numeral').numeral();
	// textarea  lt9 不支持maxlength属性
	$('textarea').limitLength();
});