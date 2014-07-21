/* globals define, require */

define(['jquery', 'app/common'], function($, common) {

	"use strict";

	var dispatcher = $("#dispatcher").val();
	switch (dispatcher) {
		case 'register':
			require(['app/register']);
			break;
		case 'clinic-bill':
			require(['app/clinic-bill']);
			break;
		case 'clinic-charge':
			require(['app/clinic-charge']);
			break;
		case 'clinic-drugstore':
			require(['app/clinic-drugstore']);
			break;
		case 'adjuvant-therapy':
			require(['app/adjuvant-therapy']);
			break;
		case 'doctor-diagnose':
			require(['app/doctor-diagnose']);
			break;
		case 'admin':
			require(['app/admin']);
			break;
		case 'login':
			require(['app/login']);
			break;
		case 'adjuvant-storage':
			require(['app/adjuvant-storage']);
			break;
		case 'adjuvant-freeze':
			require(['app/adjuvant-freeze']);
			break;
		default:
			break;
	}


	// 公共代码
	(function() {

		// var address = $('#address').val();
		// var address = 'http://10.1.18.41:8080/ARIS/';


		/*var nav = {
			"status": {
				"code": 0,
				"msg": "error"
			},
			"ds": [{
				"href": "javascript:;",
				"modid": "one",
				"name": "登记/注册",
				"navs": [{
					"href": address + "patient/checkin",
					"modid": 1,
					"name": "登记",
					"ordernum": 1
				}, {
					"href": address + "patient/reglist",
					"modid": 1,
					"name": "注册",
					"navs": [

					],
					"ordernum": 2
				}],
				"ordernum": 1
			}, {
				"href": "javascript:;",
				"modid": "two",
				"name": "门诊开单",
				"navs": [{
					"href": address + "order/list",
					"modid": 1,
					"name": "门诊开单",
					"ordernum": 1
				}],
				"ordernum": 1
			}, {
				"href": "javascript:;",
				"modid": "three",
				"name": "门诊收费",
				"navs": [{
					"href": address + "outpatient/charge",
					"modid": 1,
					"name": "门诊收费",
					"ordernum": 1
				}, {
					"href": address + "receipt/list",
					"modid": 1,
					"name": "票据领用",
					"ordernum": 2
				}],
				"ordernum": 1
			}, {
				"href": "javascript:;",
				"modid": "four",
				"name": "医生面诊",
				"navs": [{
					"href": address + "consult/list",
					"modid": 1,
					"name": "医生面诊",
					"ordernum": 1
				}],
				"ordernum": 1
			}, {
				"href": "javascript:;",
				"modid": "five",
				"name": "门诊药房",
				"navs": [{
					"href": address + "sendmedicines/list",
					"modid": 1,
					"name": "发药",
					"ordernum": 1
				}, {
					"href": address + "stock/list",
					"modid": 1,
					"name": "采购入库",
					"ordernum": 1
				}, {
					"href": address + "stockaccount/list",
					"modid": 1,
					"name": "库存总账",
					"ordernum": 2
				}, {
					"href": address + "stockalarm/list",
					"modid": 1,
					"name": "库存报警",
					"ordernum": 3
				}],
				"ordernum": 1
			}, {
				"href": "javascript:;",
				"modid": "six",
				"name": "基本配置",
				"navs": [{
					"href": address + "dict/catlog",
					"modid": 3,
					"name": "字典类别配置",
					"ordernum": 1
				}, {
					"href": address + "dict/dictionary",
					"modid": 3,
					"name": "字典配置",
					"navs": [

					],
					"ordernum": 2
				}, {
					"href": address + "template/list",
					"modid": 3,
					"name": "医疗模板配置",
					"ordernum": 3
				}, {
					"href": address + "doctor/list",
					"modid": 3,
					"name": "用户管理",
					"navs": [

					],
					"ordernum": 4
				}, {
					"href": address + "org/list",
					"modid": 3,
					"name": "组织架构设置",
					"ordernum": 5
				}, {
					"href": address + "medicines/list",
					"modid": 3,
					"name": "药品管理",
					"navs": [

					],
					"ordernum": 6
				}, {
					"href": address + "supplier/list",
					"modid": 3,
					"name": "供应商管理",
					"navs": [

					],
					"ordernum": 7
				}, {
					"href": address + "feeitem/list",
					"modid": 3,
					"name": "收费项目管理",
					"navs": [

					],
					"ordernum": 8
				}, {
					"href": address + "systemparam/list",
					"modid": 3,
					"name": "系统参数管理",
					"navs": [

					],
					"ordernum": 5
				}, {
					"href": address + "warehouse/list",
					"modid": 3,
					"name": "仓库管理",
					"navs": [

					],
					"ordernum": 5
				}],
				"ordernum": 3
			}]
		};*/

		/*var ds = nav.ds,
			html = '',
			top = '';
		var len = ds.length;
		for (var i = 0; i < len; i++) {
			var item = ds[i];
			var child = item.navs;
			var span = '';
			top += '<a href="' + item.href + '" id="' + item.modid + '">' + item.name + '</a>';
			var leng = child.length;
			for (var j = 0; j < leng; j++) {
				var list = child[j];
				span += '<span><a href="' + list.href + '">' + list.name + '</a></span>&nbsp;';
			}
			html += '<div class="content ' + item.modid + '" style="display:none">' + span + '</div>';
		}*/
		if ($('#dispatcher').val() !== 'login' && $('#navigate')[0]) {
			var api = $('#navigate').attr('data-href');
			$.ajax(common.ajaxCall({
				url: api,
				type: 'post',
				success: function(data) {
					var ds = data.ds,
						html = '',
						top = '';
					var len = ds.length;
					for (var i = 0; i < len; i++) {
						var item = ds[i];
						var span = '';
						if (item.ui_type == 'M') {
							top += '<a href="' + item.ui_url + '" id="' + item.ui_sid + '">' + item.ui_common + '</a>';
						}
						if (item.ui_type == 'P') {
							span += '<span><a href="' + item.ui_url + '">' + item.ui_common + '</a></span>&nbsp;';
							i++;
							for (; i < len; i++) {
								item = ds[i];
								if (item.ui_type == 'P') {
									span += '<span><a href="' + item.ui_url + '">' + item.ui_common + '</a></span>&nbsp;';
								} else {
									break;
								}
							}
							i--;
							item = ds[i];
							html += '<div class="content ' + item.ui_mid + '" style="display:none">' + span + '</div>';
						}

					}
					$('#top-tab').empty().append(top);
					$('#list-item').empty().append(html);
				},
				error: function(msg) {
					// alert(msg);
				}
			}));



			$('#top-tab a').live('mouseover', function() {
				$('#top-tab a').removeClass('now');
				$(this).addClass("now");
				var order = $(this).attr('id');
				$('#list-item,#list-item .content').hide();
				$('#list-item,#list-item .' + order + '').show();
			});


			$(document).click(function() {
				$('#list-item').hide();
			});

		}


		var totalNum = $("#page").attr("data-total");
		var pageSize = $("#page").attr("data-size");
		var current = $("#page").attr("data-current");
		var html = "";
		//获取页数
		var size = Math.ceil(totalNum / pageSize);
		size = (size == 0 ? 1 : size);
		//生成前面的条数和页数部分html代码
		html += "<span>共<i>" + totalNum + "条/" + size + "页</i></span>";
		//生成第一条数据连接
		html += "<span><a href='javascript:;' data-page='" + 1;
		if (current == 1) {
			html += "' class='now'>1</a></span>";
		} else {
			html += "'>1</a></span>";
		}
		if (size >= 1) {
			//大于两页时，下一页连接
			var nextPage;
			if (size == current) {
				nextPage = "<span><a href='javascript:;' data-page='" + size + "'>下一页</a></span>";
			} else {
				nextPage = "<span><a href='javascript:;' data-page='" + (parseInt(current) + 1) + "'>下一页</a></span>";
			}
			//算法
			html += page(size, current, nextPage);
		}
		$("#page").html(html);

		function page(size, current, nextpage) {
			var html = "";
			//大于4页，分页将进行...的显示
			if (size > 4) {
				//判断当前页和首页之间相差页数
				if ((parseInt(current) - 1) > 1) {
					if ((parseInt(current) - 1) > 2) {
						html += "<span>...</span>";
					}
					if ((current - 1) > 1) {
						html += "<span><a href='javascript:;' data-page='" + (parseInt(current) - 1) + "'>" + (parseInt(current) - 1) + "</a></span>";
					}
					html += "<span><a href='javascript:;' data-page='" + current + "' class='now'>" + current + "</a></span>";
				} else if (current > 1) {
					html += "<span><a href='javascript:;' data-page='" + current + "' class='now'>" + current + "</a></span>";
				}
				//当前页之后的部分
				if ((size - current) > 2) {
					html += "<span><a href='javascript:;' data-page='" + (parseInt(current) + 1) + "'>" + (parseInt(current) + 1) + "</a></span>";
					html += "<span>...</span>";
					html += "<span><a href='javascript:;' data-page='" + size + "'>" + size + "</a></span>";
					html += nextpage;
				} else {
					if (parseInt(current) + 2 == size) {
						html += "<span><a href='javascript:;' data-page='" + (parseInt(current) + 1) + "'>" + (parseInt(current) + 1) + "</a></span>";
						html += "<span><a href='javascript:;' data-page='" + size + "'>" + size + "</a></span>";
					} else if (parseInt(current) + 1 == size) {
						html += "<span><a href='javascript:;' data-page='" + size + "'>" + size + "</a></span>";
					}
					html += nextpage;
				}
			} else {
				if (current >= 1) {
					//补齐首页和current页中间的html代码
					for (var i = 2; i <= current; i++) {
						html += "<span><a href='javascript:;'data-page='" + i + "'";
						if (i == current) {
							html += " class='now' ";
						}
						html += ">" + i + "</a></span>"
					}
					//追加current和last也之间的html代码			
					for (i = parseInt(current) + 1; i <= size; i++) {
						html += "<span><a href='javascript:;'data-page='" + i + "'>" + i + "</a></span>"
					}
					html += nextpage;
				}
			}
			return html;
		}



		$('.page a').click(function() {
			var pageNum = $(this).attr('data-page');
			$('#offset').val(pageNum);
			$('#search').trigger('click');
			$('#problem,#searchform').submit();
		});


		// 退出
		$('#logout').on('click', function(event) {
			var api = $(this).attr('data-href');
			$.ajax(common.ajaxCall({
				url: api,
				type: 'post',
				success: function(data) {
					var ds = data.ds;
					location.href = ds[0].loginAddr;
				},
				error: function(msg) {
					alert(msg);
				}
			}));
		});


		// 占位字符
		require(['placeholder']);

		// 显示登录用户名
		/*if (!window.CommonAction) {
			return;
		}
		$.ajax(common.ajaxCall({
			url: window.CommonAction.Login(),
			success: function(re) {
				var ds = re.ds;
				var name = ds[1].username;
				if (!name) {
					return;
				}
				// $('.user-logined em').html(name);
			}
		}));*/



		// 跳转到特定页
		/*$('.go-page').click(function() {
			var pageNum = parseInt($.trim($('.page-num').val()), 10);
			if (!pageNum || isNaN(pageNum) || pageNum === 0) {
				art.dialog.tips('请输入大于0的数字！', 1.5);
				return false;
			} else {
				var action = $('form[name=paginator]').attr('action');
				action = action.split(/pageIndex=\d+/g);
				if(action.length === 0)
					return;
				action = action[0] + 'pageIndex=' + pageNum + (action[1]? action[1]: '');
				location.href = action;
				return false;
			}
		});*/



		// 导航条
		/*var api = $("#navigate").attr('data-href');
		$.ajax({
			url: api,
			cache: false,
			type: 'post',
			success: function(data) {
				var ds = data.ds,
					html = '',
					top = '';
				var len = ds.length;
				for (var i = 0; i < len; i++) {
					var item = ds[i];
					var child = item.navs;
					var span = '';
					top += '<a href="'+ item.href +'" id="'+ item.modid +'">'+ item.name +'</a>';
					var leng = child.length;
					for (var j = 0; j < leng; j++) {
						var list = child[j];
						span += '<span><a href="'+ list.href +'">'+ list.name +'</a></span>&nbsp;';
					}
					html += '<div class="content '+ item.modid +'" style="display:none">'+ span +'</div>';
				}
				$('#top-tab').empty().append(top);
				$('#list-item').empty().append(html);
			}
		});

		
		$('#top-tab a').live('mouseover', function() {
			var order = $(this).attr('id');
			$('#list-item .content').hide();
			$('#list-item .'+ order +'').show();
		});


		$(document).click(function() {
			$('#list-item .content').hide();
		});*/

	})();

});