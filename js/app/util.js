/* globals define, require */

define([
	'jquery',
	'app/common',
	'artDialog',
	'iframe'
], function($, common) {

	"use strict";

	$.fn.extend({
		// 统计字符数
		countCharNum: function() {
			var me = $(this);
			var maxLength = me.attr('maxlength');
			if (!maxLength) {
				return;
			}
			/*var ctl = $('<div>还可以输入<span style="color: red">' + maxLength + '</span>个字符</div>').insertAfter(me).css({
				position: 'absolute',
				left: me.offset().left,
				top: me.offset().top + me.height()
			});*/
			me.bind('input propertychange', function(event) {
				var curValue = $(this).val();
				var curLength = curValue.length;
				if (curLength > maxLength) {
					$(this).val(curValue.substr(0, maxLength));
					// ctl.find('span').text('0');
				} else {
					// ctl.find('span').text(maxLength - curLength);
				}
			});
		},
		// 统计总额
		countPrice: function(ctx) {
			if ($(this).length === 0)
				return;
			ctx = ctx || $('body');
			var total = 0;
			ctx.find('.tab-content').find('.price-area').each(function() {
				total += parseFloat($(this).text());
			});
			$(this).html(total.toFixed(4));
		},
		// 只能输入数字
		numeral: function() {
			$(this).css("ime-mode", "disabled");
			this.live("keypress", function() {
				if (event.keyCode === 46) {
					if (this.value.indexOf(".") !== -1) {
						return false;
					}
				} else {
					return event.keyCode >= 46 && event.keyCode <= 57;
				}
			});
			this.live("blur", function() {
				if (this.value.lastIndexOf(".") === (this.value.length - 1)) {
					this.value = this.value.substr(0, this.value.length - 1);
				} else if (isNaN(this.value)) {
					this.value = "";
				}
			});
			this.live("paste", function() {
				var s = window.clipboardData.getData('text');
				if (!/\D/.test(s));
				this.value = s.replace(/^0*/, '');
				return false;
			});
			this.live("dragenter", function() {
				return false;
			});
			//this.bind("keyup", function() {
			//	if (/(^0+)/.test(this.value))
			//		this.value = this.value.replace(/^0*/, '');
			//});
		},
		// 自动完成功能
		showlist: function(options) {
			var me = $(this);
			if (me.length === 0)
				return;
			me.attr('autocomplete', 'off');
			var dsUrl = me.attr('data-href');
			var keyID = options.keyID;
			var ctlID = this[0].id;
			var ctl = $('.' + ctlID + '-panel');
			var cacheData = null;
			// 记录选择的值
			var selectedValue = null;

			var getData = function(keyword, callback) {
				var params = {
					param: keyword
				};
				$.extend(params, (options.extraParams && options.extraParams()) || {});
				$.ajax(common.ajaxCall({
					url: dsUrl,
					data: params,
					type: 'post',
					success: function(re) {
						cacheData = re.ds;
						callback(re.ds);
					}
				}));
			};
			var getDataByID = function(id) {
				for (var i = 0; i < cacheData.length; i++) {
					var d = cacheData[i];
					if (d[keyID] == id) {
						return d;
					}
				}
			};
			var showPanel = function(tar, ds) {
				var me = tar;
				if (!ds || ds.length === 0) {
					ctl.empty().hide();
					return;
				}

				if (ctl.length === 0 || me === null) {
					ctl = $('<div class="' + ctlID + '-panel ab-table-div"></div>').appendTo($('body'));
				}
				var html = options.buildHtml(ds);
				ctl.css({
					position: 'absolute',
					left: me.offset().left,
					top: me.offset().top + me.height() + 2.5,
					width: options.width || me.width() + 8,
					overflowX: 'hidden',
					backgroundColor: 'rgb(249,249,249)',
					'z-index': 99999
				});
				if (ds.length > 5) {
					ctl.css({
						height: 150,
						overflowY: 'scroll'
					});
				}
				ctl.empty().append(html).show();

			};

			var oldTime = 0;
			var timer = null;
			me.bind('input propertychange', function(event) {
				var ev = event.originalEvent;
				if (selectedValue !== null) {
					selectedValue = null;
					return;
				}
				if (ev.type === "click" && ctl.is(':visible'))
					return;
				else {
					if (ev.type !== "click" && $.browser.msie && (ev.propertyName && ev.propertyName.toLowerCase() !== "value"))
						return;
				}
				var keyWord = $(this).val();
				// 没有内容或者和上次选择的值一样则不处理
				if (keyWord == selectedValue)
					return;

				// 内容有变化则清除ID
				if (options.bindSub) {
					options.bindSub.val('');
				}
				if (!$(this).hasClass('demo')) {
					$('.demo').removeClass('demo');
					$(this).addClass('demo');
				}
				if (timer)
					clearTimeout(timer);
				var newTime = (new Date()).getTime();
				if (oldTime > 0 && (newTime - oldTime) < 200) {
					timer = setTimeout(function() {
						getData(keyWord, function(ds) {
							showPanel($('.demo'), ds);
						});
					}, 200);
					return;
				}

				oldTime = (new Date()).getTime();
				getData(keyWord, function(ds) {
					showPanel($('.demo'), ds);
				});
			});
			/*me.bind('keydown', function(event) {
				var ctn = $('.ab-table-div');
				var ctnHeight = ctn.height();
				var cur = $('.selected-item');
				var next = cur.next();
				var prev = cur.prev();
				var tar;
				var mark;
				if (event.keyCode === 40) {
					cur.removeClass('selected-item');
					tar = next;
					if (tar.length === 0 || cur.length === 0) {
						tar = $('.ab-table-div tbody tr:first');
						alert(tar.length);
					}
				} else if (event.keyCode === 38) {
					cur.removeClass('selected-item');
					tar = prev;
					if (tar.length === 0 || cur.length === 0) {
						tar = $('.ab-table-div tbody tr:last');
					}

				}
				if (tar) {
					tar.addClass('selected-item');
					// var diff = tar.attr('data-idx') * tar.height() - ctnHeight;
					var diff = (tar.index() + 1) * tar.height() - ctnHeight;
					if (diff < 0) {
						diff = 0;
					}
					ctn.scrollTop(diff);
				}
				if (event.keyCode == 13) {
					$('.selected-item').trigger('click');
					return false;
				}

			});*/

			me.bind("paste", function() {
				var s = window.clipboardData.getData('text');
				if (!/\D/.test(s));
				this.value = s.replace(/^0*/, '');
				$(this).trigger('input');
				return false;
			});

			// 点击选择
			$('.' + ctlID + '-panel tr[data-id]').die('click').live('click', function() {
				// var text = $(this).text();
				// selectedValue = text;
				var orgName = $(this).attr('data-name');
				if (orgName) {
					selectedValue = orgName;
					$('.demo').val(orgName);

				} else {
					// selectedValue = text;
					// me.val(text);
					me.val('');
				}
				var mark = $(this).attr("data-name");
				if (options.selectCallBack && !!mark) {
					options.selectCallBack(getDataByID($(this).attr('data-id')));
				}
				// ctl.hide();
				// $('body').trigger('click');
				$('.ab-table-div').hide();
			});
			$('body').unbind('click').bind('click', function(e) {
				var $tar = $(e.target);
				var pnt = $tar.parent();
				if ($tar.is(me) || pnt.hasClass('.ab-table-div') || pnt.parent().hasClass('.ab-table-div'))
					return;
				$('.ab-table-div').hide();
			});
		},
		printPreview: function(options) {
			var preview = function() {
				var changed = false;
				if ($('.print-area').height() > 600) {
					$('<div class="preview-container"></div>').appendTo('body');
					$('.print-area').clone().appendTo($('.preview-container')).css({
						height: 600,
						overflowY: 'scroll',
						paddingLeft: 50,
						paddingRight: 50
					}).addClass('preview-content noprint');
					changed = true;
				}
				var tar = changed ? $('.preview-content') : $('.print-area');
				art.dialog({
					width: 1000,
					height: '75%',
					title: options.tit,
					lock: true,
					content: tar[0],
					okVal: '打印',
					ok: function() {
						setTimeout(function() {
							$('.preview-container').empty();
							window.print();
						}, 500);
					},
					cancel: true,
					close: function() {
						setTimeout(function() {
							$('.preview-container').empty();
						}, 300);
					}
				});
			};
			$(this).live('click', function() {
				if ($(this).attr("data-href")) {
					$.get(common.refreshPage($(this).attr("data-href")), function(html) {
						$(".print-area").empty().append(html);
						preview();
					});
				} else {
					preview();
				}

			});
		},
		// 选择财务分类
		selectFinance: function() {
			var cacheData;
			var me = $(this);
			if (me.length === 0)
				return;
			var ctl = $('.finance-list');

			// 弹出弹出层
			var showPanel = function(ds) {
				if (!ds || ds.length === 0) {
					ctl.empty().hide();
					return;
				}
				// 有则直接显示
				if (ctl.length > 0) {
					ctl.show();
					return;
				}
				// 没有则创建
				ctl = $('<div class="finance-list"></div>').appendTo($('body'));
				ctl.css({
					position: 'absolute',
					left: me.offset().left,
					top: me.offset().top + me.height() + 3,
					width: me.width() + 8
				});
				if (ds.length > 5) {
					ctl.css({
						height: 150,
						overflowY: 'scroll'
					});
				}
				var html = '';
				html += '<div class="item"><input type="checkbox" class="sel-all" style="margin-left:10px"/>全选</div>';
				for (var i = 0; i < ds.length; i++) {
					var item = ds[i];
					html += '<div class="item"><input type="checkbox" value="' + item.financialClassId + '" style="margin-left:25px" class="sel"/>' + item.financialClassName + '</div>';
				}
				ctl.empty().append(html);
				var initValue = $('#finances').val();
				if (initValue) {
					initValue = initValue.split(',');
					for (var j = 0; j < initValue.length; j++) {
						$('.finance-list input[value=' + initValue[j] + ']').prop('checked', true);
					}
					// 全选
					if (initValue.length === cacheData.length) {
						$('.finance-list .sel-all').prop('checked', true);
					}
				}
				ctl.show();
			};

			// 绑定事件
			me.on('click', function() {
				if ($('.finance-list').is(':visible'))
					return;
				if (cacheData) {
					showPanel(cacheData);
				} else {
					$.ajax(common.ajaxCall({
						url: me.attr('data-ds'),
						success: function(re) {
							cacheData = re.ds;
							showPanel(re.ds);
						}
					}));
				}
			});

			// 选择
			$(document).delegate('.finance-list .sel', 'change', function() {
				var str = [];
				var ids = [];
				$('.finance-list .sel:checked').each(function() {
					str.push($(this).parent().text());
					ids.push($(this).val());
				});
				me.val(str.join(','));
				$('#finances').val(ids.join(','));

				$('.finance-list .sel-all').prop('checked', ids.length === cacheData.length);
			});

			// 全选
			$(document).delegate('.finance-list .sel-all', 'click', function() {
				$('.finance-list .sel').prop('checked', this.checked);
				$('.finance-list .sel').trigger('change');
			});

			// 隐藏
			$('body').on('click', function(e) {
				var $tar = $(e.target);
				var pnt = $tar.parent();
				if ($tar.is(me) || pnt.is(ctl) || pnt.parent().is(ctl))
					return;
				ctl.hide();
			});
		},
		// 表单校验
		doValidate: function() {
			var formID = $(this)[0].id;
			$('.validate').removeClass('error-area');
			$('.error-text').empty();
			if (!window.SuperValidator) {
				return true;
			}

			var showError = function(obj, msg) {
				obj.focus();
				obj.addClass('error-area');
				if ($('.error-text').is(":hidden")) {
					$('.error-text').show();
				}
				$('.error-text').html(msg);
				return false;
			};
			var valids = window.SuperValidator[formID];
			if (valids) {
				for (var id in valids) {
					var validator = valids[id];
					if (!validator) {
						continue;
					}
					var obj = $('#' + id);
					if (obj.is(":hidden")) {
						continue;
					}
					var msg = '';
					for (var k in validator) {

						if (k === "required") {
							if (!$.trim(obj.val())) {
								msg = validator[k];
								if (typeof(msg) === "string") {
									showError(obj, msg);
									return;
								}
							}
						} else if ($.isFunction(validator[k])) {
							msg = (validator[k])(obj.val());
							if (typeof(msg) === "string") {
								showError(obj, msg);
								return;
							}
						}
					}
				}
			}

			return true;
		},
		//选择省
		selectProvince: function() {
			var me = $(this);
			var api = me.attr("data-href");
			if ($("#hid-province").length > 0) {
				var code = $("#hid-province").val();
			}
			code = parseInt(code, 10);
			$.ajax({
				url: api,
				dataType: "json",
				success: function(data) {
					me.empty().append("<option value=''>请选择省份</option>");
					for (var key in data) {
						if (data[key].code == code) {
							me.append('<option value="' + data[key].code + '" selected>' + data[key].name + '</option>');
							continue;
						}
						me.append('<option value="' + data[key].code + '">' + data[key].name + '</option>');
					}
				},
				error: function(xhr, textstatus) {
					art.dialog.tips(textstatus);
				}
			});
		},
		selectArea: function() {
			var me = $(this);
			var api = me.attr("data-href");
			if ($("#areaCode").length > 0) {
				var code = $("#areaCode").val();
				if (code) {
					var provinceCode = code.substring(0, 3) + '000';
				}
				code = parseInt(code, 10);
				provinceCode = parseInt(provinceCode, 10);
			}
			$.ajax({
				url: api,
				dataType: "json",
				success: function(data) {
					me.empty().append("<option value=''>请选择省份</option>");
					for (var key in data) {
						if (data[key].code == provinceCode) {
							me.append('<option value="' + data[key].code + '" selected>' + data[key].name + '</option>');
							continue;
						}
						me.append('<option value="' + data[key].code + '">' + data[key].name + '</option>');
					}
					me.live("change", function() {
						if (me.children("option:selected").text() != "请选择省份") {
							var inde = me.has(":selected").val();
							var child = data[inde].children;
							me.next().empty().append("<option value=''>请选择城市</option>");
							for (var ind in child) {
								if (child[ind].code == code) {
									me.next().append('<option value="' + child[ind].code + '"  selected>' + child[ind].name + '</option>');
									continue;
								}
								me.next().append('<option value="' + child[ind].code + '">' + child[ind].name + '</option>');
							}
						} else {
							me.next().empty().append("<option value=''>请选择城市</option>");
						}
					});
					me.trigger("change");
				},
				error: function(xhr, textstatus) {
					art.dialog.tips(textstatus);
				}
			});
		},
		// confirm
		dialogConfirm: function(callback) {
			var theArt = art.dialog({
				content: '<div class="pop-box h-auto bg-ff"><p class="h-auto reg-p dele-choose text-c">是否确定删除当前记录？</p><div class="text-c mar-b20"><a href="javascript:;" class="green-but" id="confirm-determine">确定</a>&nbsp;<a href="javascript:;" class="black-but" id="cancel">取消</a></div></div>',
				width: 300,
				heigth: 134,
				title: '提示',
				lock: true,
				padding: '0 0'
			});
			//点击确定
			$("#confirm-determine").live('click', function() {
				if ($.isFunction(callback)) {
					callback();
				}
				// top.location.reload();
				theArt.close();
			});
			//点击取消
			$("#cancel").live('click', function() {
				theArt.close();
			});
		},
		tips: function(tipsType, str, tipsTime) {
			var type = tipsType || 'success';
			var time = tipsTime || 1;
			if (type === 'success') {
				art.dialog({
					content: '<div class="pop-box h-auto bg-ff"><p class="reg-p h-auto reg-ok text-c">' + str + '</p></div>',
					width: 300,
					title: '提示',
					lock: false,
					time: time,
					padding: '0 0'
				});
			} else {
				art.dialog({
					content: '<div class="pop-box h-auto bg-ff"><p class="reg-p h-auto reg-no text-c">' + str + '</p></div>',
					width: 300,
					title: '提示',
					lock: false,
					time: time,
					padding: '0 0'
				});
			}
		},
		//error
		dialogError: function(str) {
			var theArt = art.dialog({
				content: '<div class="pop-box h-auto bg-ff"><p class="reg-p h-auto reg-no text-c">' + str + '</p><div class="text-c mar-b20"><a href="#" class="black-but" id="error-determine">确定</a></div></div>',
				width: 300,
				heigth: 134,
				title: '提示',
				lock: true,
				padding: '0 0'
			});
			$("#error-determine").live('click', function() {
				theArt.close();
			});
		},
		dialogSuccess: function(str) {
			var theArt = art.dialog({
				content: '<div class="pop-box h-auto bg-ff"><p class="reg-p h-auto reg-ok text-c">' + str + '</p><div class="text-c mar-b20"><a href="#" class="black-but" id="success-determine">确定</a></div></div>',
				width: 300,
				heigth: 134,
				title: '提示',
				lock: true,
				padding: '0 0'
			});
			$("#success-determine").live('click', function() {
				top.location.reload();
				theArt.close();
			});

		},
		validateCredentials: function(type) { //根据证件类型判断证件号码
			var CredentialsType = $('#' + type + '').children('option:selected').text();
			var numbers = $(this).val();
			if (CredentialsType == '居民身份证') {
				if (numbers && !/^\d{15}$|^\d{17}([0-9]|X)$/.test(numbers)) {
					if ($('.error-text').is(":hidden")) {
						$('.error-text').show();
					}
					$('.error-text').html("请输入正确的证件号码");
					return false;
				}
				return;

			}

		},
		serializeObject: function() {
			var o = {};
			var a = this.serializeArray();
			$.each(a, function() {
				if (o[this.name]) {
					if (!o[this.name].push) {
						o[this.name] = [o[this.name]];
					}
					o[this.name].push(this.value || '');
				} else {
					o[this.name] = this.value || '';
				}
			});
			return o;
		},
		limitLength: function() {
			var me = $(this);
			me.bind('input propertychange', function(event) {
				var maxLength = $(this).attr('maxlength');
				if (!maxLength) {
					return this;
				}
				var ev = event.originalEvent;
				var tempEle = document.createElement("b");
				tempEle.innerHTML = "<!--[if lt IE 9]><i></i><![endif]-->";
				var ltIE9 = tempEle.getElementsByTagName("i").length === 1;
				/* IE9以下版本触发的是 propertychange 事件 */
				/* propertychange 是所有属性改变都会触发，我们只需要value变化的事件 */
				if (ltIE9 && ev.propertyName && ev.propertyName.toLowerCase() !== "value") {
					return;
				}
				var curValue = $(this).val();
				var curLength = curValue.length;
				if (curLength > maxLength) {
					$(this).val(curValue.substr(0, maxLength));
				}
			});

			return this;
		}

	});

});