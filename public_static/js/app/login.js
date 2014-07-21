/* globals define */

define([
	'jquery',
	'app/common',
	'app/util',
	'artDialog',
	'iframe'
	], function($, common) {

	"use strict";

	$('#username').focus();


	/*var center = function() {
		var marginTop = $(window).height() - $('#content').height();
		if(marginTop < 0)
			marginTop = 0;
		$('#content').css('margin-top', marginTop/2);
	};
	center();
	$(window).resize(center);*/

	$('#btn-login').click(function() {
		var me = $(this);
		var name = $.trim($('#username').val());
		var pwd = $.trim($('#password').val());
		var code = $.trim($("#verificationCode").val());

		var tarForm = $("#form-login");
		if(!tarForm.doValidate())
			return;

		var api = me.attr("data-href");
		$.ajax(common.ajaxCall({
			url: api,
			type: "POST",
			dataType: "json",
			data: tarForm.serialize(),
			success: function(data) {
					location.href = me.attr("data-action");
			},
			error: function(msg) {
				if($('.error-text').is(":hidden")) {
					$('.error-text').show();
				}
				$('.error-text').html(msg);
			}
		}));
		return false;
	});

	// 回车登陆
	$(document).keyup(function(ev) {
		if(ev.keyCode === 13) {
			$("#btn-login").trigger("click");
		}
	});


	// 刷新验证码
	$('#change').click(function() {
		var image = $(this).prev('img');
		var src = image.attr('src');
		var ad = src.indexOf('?');
		if(ad > -1) {
			src = src.substring(0,ad);
		}
		src = src + '?t=' + new Date().getTime();
		$(this).prev('img').attr('src',src);
	});



	// 修改个人资料
	$('#saveInfo').click(function() {
		var tarForm = $('#form-edit-info');
		if(!tarForm.doValidate())
			return;

		var api = $(this).attr('data-action');
		$.ajax(common.ajaxCall({
			url: api,
			type: 'post',
			data: tarForm.serialize(),
			success: function() {
				$('#logout').trigger('click');
			},
			error: function(msg) {
				if($('.error-text').is(":hidden")) {
					$('.error-text').show();
				}
				$('.error-text').html(msg);
			}
		}));
	});
});