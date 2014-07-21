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

	/*******************门诊开单**********************************/
	var Bill = {
		init: function() {

			var me = this;

			// 搜索患者信息
			$('#patientName').showlist({
				width: 500,
				keyID: 'patientId',
				bindSub: $('#patientId'),
				selectCallBack: function(d) {
					$('#patientId').val(d.patientId);
					$('.middle-tab').attr('rel-value', d.patientId);
				},
				buildHtml: function(ds) {
					var html = '<table cellpadding="0" cellspacing="1" class="table-list ab-table-div-title"></tbody>';
					for (var i = 0; i < ds.length; i++) {
						var item = ds[i];
						html += '<tr data-id="' + item.patientId + '" data-name="' + item.patientName + '" class="tr-hover"><td>' + item.patientName + '</td><td>' + item.mobile + '</td><td>' + item.sexName + '</td><td>' + item.age + '</td></tr>';
					}
					html += '</tbody></table>';
					return html;
				}
			});

			var startDate = $('#start-date');
			var endDate = $('#end-date');
			startDate.datePicker({
				dateFmt: 'yyyy-MM-dd'
			});
			endDate.datePicker({
				dateFmt: 'yyyy-MM-dd'
			});


			$('#addBill').die('click').live('click', function() {
				var content = $('.backups').clone(true).find('.billDate').text($.formatDate(new Date(), 'yyyy-MM-dd')).end().removeClass('backups').show();
				$('.backups').after(content);
				content.find('.open').trigger('click');
			});


			$('.open,.close').die('click').live('click', function() {
				if ($(this).hasClass('open')) {
					$('.close:visible').removeClass('close').addClass('open').parents('.w958-border').find('.pad5').hide(400);
					$(this).parents('.w958-border:first').find('.pad5').show(400);
				} else {
					$(this).parents('.w958-border:first').find('.pad5').hide(400);
				}
				$(this).toggleClass('open').toggleClass('close');
			});


			// 减少一个
			$(document).delegate('.less-text', 'click', function() {
				var numNode = $(this).next('.Num');
				var num = parseFloat(numNode.val(), 10) - 1;
				if (num < 0 || isNaN(num))
					num = 0;
				numNode.val(num);
				me.countPrice(this);
			})
			// 增加一个
				.delegate('.add-text', 'click', function() {
					var numNode = $(this).prev('.Num');
					var num = parseFloat(numNode.val(), 10) + 1;
					if (isNaN(num))
						num = 1;
					numNode.val(num);
					me.countPrice(this);
				})
				.delegate('.delete-item', 'click', function() {
					if ($(this).parents('.table-list:first').find('.tr-hover:visible').length === 1)
						return;
					$(this).parents('.tr-hover:first').remove();
				})
				.delegate('.delete-all', 'click', function() {
					var _this = $(this);
					var diagnoseNo = _this.parents('.bill-list-title:first').find('.diagnoseNo').text();
					if (diagnoseNo === '') {
						_this.parents('.w958-border:first').remove();
					} else {
						var api = _this.attr('data-action');
						$.ajax(common.ajaxCall({
							url: api,
							type: 'post',
							data: {
								diagnoseNo: diagnoseNo
							},
							success: function() {
								$(this).tips('success', '删除成功！');
								setTimeout(function() {
									top.location.reload();
								}, 500);
							}
						}));
					}
				});
			$('.Num').die('input propertychange').live('input propertychange', function() {
				me.countPrice(this);
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

			// 点击选择项目
			$('..middle-tab a').click(function() {
				$(this).siblings().removeClass('now').end().addClass('now');
				var patientId = $('.middle-tab').attr('rel-value');
				var api = $(this).attr('data-href');
				$.post(common.refreshPage(api), {
					patientId: patientId
				}, function(html) {
					$('.middle-tab').nextAll().remove();
					$('.middle-tab').after(html);
					if ($('.now:last').attr('data-id') == 1) {
						var flag = true;
						Prescription.init(flag);
					} else {
						otherProject.init();
					}
				});

			});

			$('.list-seach input[type="submit"]').click(function() {
				$('#rel-patientId').val($('#patientId').val());
			});

		},
		showProduct: function() { // 项目名称自动完成
			$('.medicinesName').showlist({
				width: 800,
				keyID: 'feeItemId',
				bindSub: $($(this).attr('data-id') + '-medicinesId'),
				selectCallBack: function(d) {
					if (!d)
						return;
					if (!$('.demo').parents('.tr-hover:first').next('.tr-hover')[0]) {
						var text = $('.copy:first').clone(true).removeClass('copy').show();
						$('.demo').parents('.table-list:first').append(text);
					}
					var _parents = $('.demo').parents('.tr-hover:first');
					_parents.find('.medicinesId').val(d.feeItemId);
					_parents.find('.price').text(d.amt);
					_parents.find('.unit').text(d.unit);
					_parents.find('.unitId').val(d.unitId);
				},
				buildHtml: function(ds) {
					var html = '<table cellpadding="0" cellspacing="1" class="table-list ab-table-div-title"><thead><tr><td width="50%">项目名称</td><td width="20%">单价</td><td width="20%">单位</td></tr></thead>';
					for (var i = 0; i < ds.length; i++) {
						var item = ds[i];
						html += '<tr data-id="' + item.feeItemId + '" data-name="' + item.feeName + '" class="tr-hover"><td>' + item.feeName + '</td><td>' + item.amt + '</td><td>' + item.unit + '</td></tr>';
					}
					html += '</table>';
					return html;
				}
			});
			$('.Num').bind('input propertychange', function() {
				me.countPrice(this);
			});
		},
		edit: function() {

			if (!$('#editBill').val())
				return;

			var me = this;
			$.get(common.refreshPage(window.PageCallBack.DetailPage($)), function(html) {
				$('.edit').append(html);
				me.showProduct();
			});
			/*var api = $('#editBill').val();
			$.ajax(common.ajaxCall({
				url: api,
				type: 'post',
				success: function(data) {
					var ds = data.ds,
						flag;
					for (var i = ds.length; i >= 0; i--) {
						var item = ds[i];
						if (('/;' + item.diagnoseNo + ';/').test(flag)) {

						} else {
							flag += item.diagnoseNo + ';';
							var bill = $('.backups').clone(true).removeClass('.backups').show();
							bill.find('diagnoseNo').text(item.diagnoseNo);
						}
					}
				},
				error: function(msg) {
					alert(msg);
				}
			}));*/
		},
		saveBill: function() { //保存
			var flag = true;
			$('.saveBill').die('click').live('click', function() {
				// 防止连续点击
				if(!flag)
					return;
				flag = false;
				setTimeout(function() {
					flag = true;
				},1000);
				var _parents = $(this).parents('.w958-border:first');
				var details = [];
				_parents.find('.tr-hover:visible').each(function() {
					var _this = $(this);
					if (!_this.find('.medicinesName').val())
						return;
					var item = {
						feeItemName: $('.now').text(),
						feeItemId: parseFloat($('.now').attr('data-id')),					
						itemName: _this.find('.medicinesName').val(),
						itemId: parseFloat(_this.find('.medicinesId').val()),
						price: parseFloat(_this.find('.price').text()),
						num: parseFloat(_this.find('.Num').val()),
						amount: parseFloat(_this.find('.totalAmt').text()),
						unitName: _this.find('.unit').text(),
						unitId: parseFloat(_this.find('.unitId').val())
					};
					details.push(item);
				});
				var diagnoseNo = _parents.find('.diagnoseNo').text();
				var note = _parents.find('.note').val();
				var data = {
					treateBillNo: diagnoseNo,					
					patientId: parseFloat($('.middle-tab').attr('rel-value')),
					note: note,
					details: details
				};


				var api = $(this).attr('data-action');
				$.ajax(common.ajaxCall({
					url: api,
					type: 'post',
					data: {
						resultJson: JSON.stringify(data)
					},
					success: function(data) {
						$(this).tips('success', '保存成功！');
						_parents.find('.diagnoseNo').html(data.ds);

					},
					error: function(msg) {
						alert(msg);
					}
				}));
			});
		},
		countPrice: function(th) {
			// 计算总价
			var _parents = $(th).parents('.tr-hover:first');
			var total = parseFloat(_parents.find('.price').text()) * parseFloat(_parents.find('.Num').val());
			if (!isNaN(total)) {
				_parents.find('.totalAmt').text(total.toFixed(2));
			} else {
				_parents.find('.totalAmt').text('');
			}
		}
		/*
		showPage: function() {
			var me = this;
			var patientId = $('#patientId').val();
			var api = $('.now').attr('data-href');
			$.post(common.refreshPage(api), {
				patientId: patientId
			}, function(html) {
				$('.appendPage').append(html);
			});
		}*/
	};

	/***************药物处方**********************************/
	var Prescription = {
		init: function(flag) {

			var loc = location.href;
			var ind = parseInt(loc.slice(loc.indexOf('tab=') + 4), 10);

			// 编辑和新增的时候显示药物处方
			if (!$('.middle-tab').next()[0] && isNaN(ind)) {
				$('.middle-tab a:first').trigger('click');
			}
			
			// 跳转至门诊开单具体tab
			
			if(!isNaN(ind) && flag == undefined) {
				$('.middle-tab a:eq('+ ind +')').trigger('click');
			}

			$('.medicinesName').showlist({
				width: 800,
				keyID: 'medicinesId',
				bindSub: $($(this).attr('data-id') + '-medicinesId'),
				selectCallBack: function(d) {
					if (!d)
						return;
					if (!$('.demo').parents('.tr-hover:first').next('.tr-hover')[0]) {
						var text = $('.copy:first').clone(true).removeClass('copy').show();
						$('.demo').parents('.table-list:first').append(text);
					}
					var _parents = $('.demo').parents('.tr-hover:first');
					_parents.find('.medicinesId').val(d.medicinesId);
					_parents.find('.price').text(d.marketPrice);
				},
				buildHtml: function(ds) {
					var html = '<table cellpadding="0" cellspacing="1" class="table-list ab-table-div-title"><thead><tr><td>品名</td><td>单价</td><td>单位</td></tr></thead>';
					for (var i = 0; i < ds.length; i++) {
						var item = ds[i];
						html += '<tr data-id="' + item.medicinesId + '" data-name="' + item.medicinesName + '" class="tr-hover"><td>' + item.medicinesName + '</td><td>' + item.marketPrice + '</td><td>' + item.unit + '</td></tr>';
					}
					html += '</table>';
					return html;
				}
			});
		
			var mark = true;
			$('.saveBill').die('click').live('click', function() {
				// 防止连续点击
				if(!mark)
					return;
				mark = false;
				setTimeout(function() {
					mark = true;
				},1000);
				var _parents = $(this).parents('.w958-border:first');
				var details = [];
				_parents.find('.tr-hover:visible').each(function() {
					var _this = $(this);
					if (!_this.find('.medicinesName').val())
						return;
					var method =  _this.find('.methods');
					var frequency =  _this.find('.frequency');
					var item = {
						feeItemName: $('.now').text(),
						feeItemId: parseFloat($('.now').attr('data-id')),				
						itemName: _this.find('.medicinesName').val(),
						itemId: parseFloat(_this.find('.medicinesId').val()),
						price: parseFloat(_this.find('.price').text()),
						num: parseFloat(_this.find('.Num').val()),
						amount: parseFloat(_this.find('.totalAmt').text()),
					    usage: method.children("option:selected").val()==""?"":method.children("option:selected").text(),
						frequency:frequency.children("option:selected").val()==""?"":frequency.children("option:selected").text(),
						dosage: _this.find('.dosage').val()
					};
					details.push(item);
				});
				var diagnoseNo = _parents.find('.diagnoseNo').text();
				var note = _parents.find('.note').val();
				var data = {
					treateBillNo: diagnoseNo,				
					patientId: parseFloat($('.middle-tab').attr('rel-value')),
					note: note,
					details: details
				};


				var api = $(this).attr('data-action');
				$.ajax(common.ajaxCall({
					url: api,
					type: 'post',
					data: {
						resultJson: JSON.stringify(data)
					},
					success: function(data) {
						$(this).tips('success', '保存成功！');
						_parents.find('.diagnoseNo').html(data.ds);
					},
					error: function(msg) {
						alert(msg);
					}
				}));
			});
			$('.Num').bind('input propertychange', function() {
				Bill.countPrice(this);
				// alert(11);
			});

			Bill.edit();

		}
	};

	/****************生化检验/治疗项目/其他项目************************************/
	var otherProject = {
		init: function() {

			Bill.showProduct();
			Bill.saveBill();
			Bill.edit();
		}
	};



	/***********************入口********************************************/
	var Main = {
		init: function() {
			Bill.init();
			Prescription.init();

			$('.Num').numeral();
		}
	};
	Main.init();
});