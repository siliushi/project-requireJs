/*globals require*/

require.config({
    urlArgs: "version=1.0.1",
    paths: {
        'jquery': 'lib/jquery.min',
        'jqtmpl': 'lib/jquery.tmpl.min',
        'json': 'pkg/JSON/app',
        'dateformat': 'pkg/DateFormat/app',
        'placeholder': 'pkg/PlaceHolder/app',
        'flashAvatar': 'lib/flashAvatar/main',
        'swfobject': 'lib/swfobject/swfobject',
        'datepicker': 'pkg/DatePicker/app',
        'iframe': 'pkg/artDialog/plugins/iframeTools',
        'artDialog': 'pkg/artDialog/artDialog.source',
        'poshytip': 'pkg/poshytip/src/jquery.poshytip.min'
        /*'upload': 'lib/upload/main',
        'jcrop': 'lib/jcrop/src/jquery.jcrop.js'*/
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'dateformat': {
            deps: ['jquery']
        },
        'placeholder': {
            deps: ['jquery']
        },
        'jqtmpl': {
            deps: ['jquery']
        },
        'validator': {
            deps: ['jquery']
        },
        'datepicker': {
            deps: ['jquery']
        },
        'artDialog': {
            deps: ['jquery']
        },
        'iframe': {
            deps: ['artDialog']
        }
    }
});

/* preload */
require(['validate-msg']);
require(['app/dispatcher']);