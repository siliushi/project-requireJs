define([
	'jquery',
	'app/common',
	'app/util',
	'jqtmpl',
	'pkg/DatePicker/app',
	'pkg/DateFormat/app',
	'json',
	'artDialog',
	'iframe'
], function($, common) {

	"use strict";

	/***********发药*****************************************/
	var Drugstore = {
		init: function() {


			$(document).delegate('#confirm', 'click', function() {
				var drug = [];
				$('.tr-hover').each(function() {
					var item = {
						medicinesId: $(this).attr('data-id'),
						num: $(this).attr('data-num')
					};
					drug.push(item);
				});
				var data = {
					patientId: $('#patientId').val(),
					invoiceNo: $('#invoiceNo').text(),
					medicines: drug
				};
				var api = $(this).attr('data-action');
				$.ajax(common.ajaxCall({
					url: api,
					type: 'post',
					data: {
						resultJson: JSON.stringify(data)
					},
					success: function() {
						$(this).tips('success', '发药成功！');
						setTimeout(function() {
							location.href = $('#confirm').attr('data-href');
						}, 500);
					},
					error: function(msg) {
						alert(msg);
					}
				}));
			});
		}
	};

	/*************采购入库********************************************************/
	var InStorage = {
		init: function() {
			var me = this;


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



			$('#importdate').datePicker({
				dateFmt: 'yyyy-MM-dd'
			});
			$('#importdate').val($.formatDate(new Date(), 'yyyy-MM-dd'));
			/*var supplier = $('#supplier');
			if(supplier[0]) {
				var api = supplier.attr('data-href');
				$.ajax(common.ajaxCall({
					url: api,
					type:'post',
					success: function(data) {
						var ds = data.ds,html;
						for(var i = ds.length-1; i >= 0; i--) {
							var item = ds[i];
							html += '<option value="'+ item.userId +'">'+ item.userName +'</option>';
						}
						supplier.empty().append(html);
					}
				}));
			}*/


			// 编辑
			var details = $('#details');
			if (details[0]) {
				var stockCode = $('#stockCode').val();
				var api = details.val();
				$.ajax(common.ajaxCall({
					url: api,
					type: 'post',
					data: {
						stockCode: stockCode
					},
					success: function(data) {
						var ds = data.ds,
							html = '';
						for (var i = ds.length - 1; i >= 0; i--) {
							var item = ds[i];
							html += '<tr class="tr-hover in-storage"><td><a href="javascript:;" class="signImg-a flag"></a></td><td><label><input name="" type="text" data-href="http://10.1.18.41:8081/ARIS/stock/medicines" class="w94-100 input-add midicinesname" maxlength="24" value="' + item.medicinesName + '"><input type="hidden" class="micicinesid" value="' + item.medicinesId + '"></label></td><td><span class="w90-100 rule">' + item.rule + '</span></td><td><span class="unit" maxlength="1">' + item.unit + '</span><input type="hidden" class="unitId" value="' + item.unitId + '"></td><td><label><input name="" type="text" class="w90-100 numeral input-add price" maxlength="9" value="' + item.price + '"></label></td><td class="quantity-text"><a href="javascript:;" class="less-text" title="减少"></a><input name="" type="text" class="input-add numeral Num" maxlength="5" style="width:45px;" value="' + item.num + '"><a href="javascript:;" class="add-text" title="增加"></a></td><td><label><span class="w90-100 totalamt" maxlength="9">' + item.totalAmt + '</span></td><td><label><input name="" type="text" maxlength="12" class="w90-100 input-add productbatchnum" value="' + item.productBatchNum + '"></label></td><td><label><input name="" onClick="WdatePicker({dateFmt:\'yyyy-MM-dd\'})" type="text" class="w90-100 input-add Wdate validdate" value="' + item.validDate + '"></label></td><td><a href="javascript:;" class="red-but delete-item" title="删除">删除</a></td></tr>';
						}
						$('.storage-item tr:last').before(html);
						// $('.storage-item thead').after(html);
						me.showProduct();
						$('.price,.Num').bind('input propertychange', function() {
							count(this);
						});
					},
					error: function(msg) {
						alert(msg);
					}
				}));
			} else {
				me.showProduct();
			}


			// 经办人
			$("#userName").showlist({
				keyID: 'doctorId',
				bindSub: $('#userId'),
				selectCallBack: function(d) {
					$('#userId').val(d.doctorId);
				},
				buildHtml: function(ds) {
					var html = '<table cellpadding="0" cellspacing="1" class="table-list ab-table-div-title" style="background: #f9f9f9;"></tbody>';
					for (var i = 0; i < ds.length; i++) {
						var item = ds[i];
						html += '<tr data-id="' + item.doctorId + '" data-name="' + item.doctorName + '" class="tr-hover"><td>' + item.doctorName + '</td></tr>';
					}
					html += '</tbody></table>';
					return html;
				}
			});

			$(document).delegate('.flag', 'click', function() {
				$(this).toggleClass('signImg-a').toggleClass('signImg-b');
			});

			// 计算总价
			var count = function(th) {
				var _parents = $(th).parents('.in-storage:first');
				var total = parseFloat(_parents.find('.price').val()) * parseFloat(_parents.find('.Num').val());
				if (!isNaN(total)) {
					_parents.find('.totalamt').text(total.toFixed(2));
				}
			};
			$(document).delegate('.less-text', 'click', function() {
				var numNode = $(this).next('.Num');
				var num = parseFloat(numNode.val(), 10) - 1;
				if (num < 0 || isNaN(num))
					num = 0;
				numNode.val(num);
				count(this);
			})
				.delegate('.add-text', 'click', function() {
					var numNode = $(this).prev('.Num');
					var num = parseFloat(numNode.val(), 10) + 1;
					if (isNaN(num))
						num = 1;
					numNode.val(num);
					count(this);
				})
				.delegate('.storage-item .delete-item', 'click', function() {
					if ($('.in-storage').length === 2)
						return;
					$(this).parents('.in-storage:first').remove();
				})
				.delegate('.storage-list .delete-item', 'click', function() {
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
			$('.price,.Num').bind('input propertychange', function() {
				count(this);
			});



			// 点击保存
			$(document).delegate('#saveStroage', 'click', function() {
				// 药品明细
				var tarForm = $('#form-add-bill');
				if (!tarForm.doValidate())
					return;

				var num = 0;
				$('.price,.Num').each(function() {
					if (!$(this).parents('.in-storage:first').find('.midicinesname').val())
						return false;
					if (!$(this).val()) {
						$(this).focus().addClass('error-area');
						$(this).tips('error', '此处必填');
						num++;
					}
				});

				if (num > 0)
					return;

				// 药品
				var medicine = [];
				$('.in-storage').each(function() {
					var _this = $(this);
					if (!_this.find('.midicinesname').val())
						return;
					var item = {
						medicinesName: _this.find('.midicinesname').val(),
						medicinesId: _this.find('.micicinesid').val(),
						rule: _this.find('.rule').text(),
						unit: _this.find('.unit').text(),
						unitId: _this.find('.unitId').val(),
						price: _this.find('.price').val(),
						num: _this.find('.Num').val(),
						totalAmt: _this.find('.totalamt').text(),
						productBatchNum: _this.find('.productbatchnum').val(),
						validDate: _this.find('.validdate').val()
					};
					medicine.push(item);
				});
				var data;
				if ($('#details')[0]) {
					data = {
						stockCode: $('#stockCode').val(),
						processor: $('#userName').val(),
						processorId: $('#userId').val(),
						importDate: $('#importdate').val(),
						warehouseName: $('#warehousename').children('option:selected').text(),
						warehouseCode: $('#warehousename').children('option:selected').val(),
						supplierName: $('#supplier').children('option:selected').text(),
						supplierId: $('#supplier').children('option:selected').val(),
						invoiceNo: $('#invoiceNo').val(),
						note: $('#note').val(),
						medicines: medicine
					};
				} else {
					data = {
						processor: $('#userName').val(),
						processorId: $('#userId').val(),
						importDate: $('#importdate').val(),
						warehouseName: $('#warehousename').children('option:selected').text(),
						warehouseCode: $('#warehousename').children('option:selected').val(),
						supplierName: $('#supplier').children('option:selected').text(),
						supplierId: $('#supplier').children('option:selected').val(),
						invoiceNo: $('#invoiceNo').val(),
						note: $('#note').val(),
						medicines: medicine
					};
				}


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
							top.location.href = $('#saveStroage').attr('data-href');
						}, 500);
					},
					error: function(msg) {
						alert(msg);
					}
				}));
			});
		},
		showProduct: function() { // 品名自动完成
			$('.midicinesname').showlist({
				width: 500,
				keyID: 'medicinesId',
				bindSub: $($(this).attr('data-id') + '-medicinesId'),
				selectCallBack: function(d) {
					if (!d)
						return;
					if ($('.demo').parents('.in-storage:first').index() === ($('.in-storage').length - 1)) {
						// var text = $('.storage-item .in-storage:last').clone(true);
						var text = $('.copy:first').clone(true);
						// text.find('.demo').val('').removeClass('demo');
						text.appendTo($('.storage-item')).show();
					}
					var _parents = $('.demo').parents('.in-storage:first');
					_parents.find('.micicinesid').val(d.medicinesId);
					_parents.find('.rule').text(d.rule);
					_parents.find('.unit').text(d.unit);
					_parents.find('.unitId').val(d.unitId);
				},
				buildHtml: function(ds) {
					var html = '<table cellpadding="0" cellspacing="1" class="table-list ab-table-div-title"><thead><tr><td width="60%">品名</td><td width="20%">规格</td><td width="20%">单位</td></tr></thead>';
					for (var i = 0; i < ds.length; i++) {
						var item = ds[i];
						html += '<tr data-id="' + item.medicinesId + '" data-name="' + item.medicinesName + '" class="tr-hover"><td>' + item.medicinesName + '</td><td>' + item.rule + '</td><td>' + item.unit + '</td></tr>';
					}
					html += '</table>';
					return html;
				}
			});
		}
	};

	/***************库存盘点*******************************/
	var Storage = {
		init: function() {
			$('.endDate').datePicker({
				dateFmt: 'yyyy-MM-dd'
			});
		}
	};

	/**********入口*****************/
	var Main = {
		init: function() {
			Drugstore.init();
			InStorage.init();
			Storage.init();
		}
	};

	Main.init();

	$('.numeral').numeral();
	// textarea  lt9 不支持maxlength属性
	$('textarea').limitLength();
});