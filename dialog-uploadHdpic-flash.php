<?php include("include-dialog-head.php");
    $a = $_SERVER["QUERY_STRING"];
?>
    

    <input type="hidden" name="dialog_admin_dispatcher" id="dialog_admin_dispatcher" value="dialog-user-reg-info"
           data-upload-action="http://10.1.18.2/admin/user/upload.do"
           data-uploadify-dir="js/lib/upload-uploadify/src/"
           data-resource-dir="js/lib/flashAvatar/src/"
           data-avatar-uploads-to-dir="uploads/"
           data-form-action-url="mockup/?q=uploadavatar"
        />
    <div id="altContent"></div>
    <div id="avatar_priview"></div>
    <input type="hidden" id="test" value=<?php echo $a ?>>
    <script type="text/javascript" src="js/lib/swfobject/swfobject.js"></script>
    <script type="text/javascript">
        var _dispatcher = document.getElementById('dialog_admin_dispatcher'),
            _uploadify_dir = _dispatcher.getAttribute('data-uploadify-dir'),
            _uploadify_action = _dispatcher.getAttribute("data-upload-action"),
            _resource_dir = _dispatcher.getAttribute("data-resource-dir"),
            _avatar_uploads_to_dir = _dispatcher.getAttribute("data-avatar-uploads-to-dir"),
            _form_action_url = _dispatcher.getAttribute("data-form-action-url");
			function uploadevent(res) {
                //                status += '';
                if (res == "-1") { //取消上传
                } else if (res == "-2") {
                    alert('upload failed!');
                } else if (res == "2") {
                    if (confirm('js call upload')) {
                        return 1;
                    } else {
                        return 0;
                    }
                } else {
                    var _resArray = res.split("|");
                    if (_resArray[0].toString() == "1") {
//                        window.parent.window.location.reload();
                        var address = document.getElementById('test').value;
                        var param = address.split('&');
                        var atr = [];
                        for(var i = 0; i < 2; i++) {
                            atr[i] = param[i].split('=');
                        }
                        var id = atr[0][1];
                        var imageId = atr[1][1];
                        window.parent.document.getElementById(imageId).src = _resArray[1].toString();
                        window.parent.document.getElementById(id).value = _resArray[2].toString();
                    }
                }
                window.parent.document.getElementById("closeDialog").click();
            }
            var flashvars = {
                "jsfunc": "uploadevent",
                "imgUrl": _resource_dir + "default_avatar.png",
                "pid": "75642723",
                "uploadSrc": true,
                "showBrow": true,
                "showCame": true,
                "uploadUrl": _form_action_url
            };
            var params = {
                menu: "false",
                scale: "noScale",
                allowFullscreen: "true",
                allowScriptAccess: "always",
                wmode: "transparent",
                bgcolor: "#FFFFFF"
            };
            var attributes = {
                id: "TC_Capture"
            };
            // swfobject.embedSWF("js/lib/flashAvatar/src/TC_Capture.swf", "altContent", "680", "500", "9.0.0", "js/lib/flashAvatar/src/expressInstall.swf", flashvars, params, attributes);
            swfobject.embedSWF(_resource_dir + "TC_Capture.swf", "altContent", "680", "500",
            "9.0.0", _resource_dir + "expressInstall.swf", flashvars, params, attributes);
		</script>

<?php include("include-dialog-foot.php"); ?>