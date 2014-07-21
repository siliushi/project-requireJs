// 表单校验提示信息
var SuperValidator = {
    // 登记注册-登记
    'form_register': {
        'patientName': {
            required: "请输入病人姓名",
            registerValidate: function(v) {
                if (v && v.length > 5) {
                    return '姓名长度不超过5个！';
                }
                return true;
            }
        },
        'credentialsType': {
            required: "请选择证件类型"
        },
        'credentialsNum': {
            required: "请输入证件号码！"
        },
        'phone': {
            registerValidate: function(v) {
                if (v && !/^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$|^[(]\d{3,4}[)]\d{7,8}$|^\d{3,4}[-]\d{7,8}$/.test(v)) {
                    return "请输入正确的手机号！";
                }
                return true;
            }
        },
        'birthday': {
            required: "请输入出生日期！",
            registerValidate: function(v) {
                if (v && !/^[0-9\-]*$/.test(v)) {
                    return "日期格式不对！";
                }
                return true;
            }
        },
        'doctor': {
            required: "请选择面诊医生！"
        }
    },
    'form-login': {
        'username': {
            required: "请输入用户名！"
        },
        'password': {
            required: "请输入密码！"
        },
        'verificationCode': {
            required: "请输入验证码！"
        }
    },
    'form-patient-login': {
        'name': {
            required: '请输入姓名！',
            registerValidate: function(v) {
                if (v && v.length > 5) {
                    return '姓名长度不超过5个！';
                }
                return true;
            }
        },
        'birthday': {
            required: "请输入出生日期！"
        },
        'registerNum': {
            required: '请输入注册证号'
        },
        'phone': {
            required: "请输入联系电话",
            customValidate: function(v) {
                if (v && !/^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/.test(v)) {
                    return "请输入正确的手机号！";
                }
                return true;
            }
        },
        'registerCredentialsNum': {
            required: '请输入证件号码！'
        },
        'doctor': {
            required: "请选主治医生！"
        },
        'spouse-name': {
            required: '请输入配偶姓名！'
        },
        'spouse_birthday': {
            required: '请输入配偶出生日期！'
        },
        'spouse-registerNum': {
            required: '请输入配偶注册证号！'
        },
        'spouse_registerCredentialsNum': {
            required: '请输入配偶证件号码！'
        },
        'spouse-phone': {
            required: '请输入配偶手机号',
            customValidate: function(v) {
                if (v && !/^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/.test(v)) {
                    return "请输入正确的手机号！";
                }
                return true;
            }
        }
    },
    'add-Type': {
        'typeName': {
            required: '请输入字典类别名称！'
        },
        'typeValue': {
            required: '请输入字典类别值！'
        }
    },
    'add-Dictionary': {
        'dictionaryName': {
            required: '请输入字典名称！'
        },
        'dictionaryValue': {
            required: '请输入字典值！'
        }
    },
    'form-template': {
        'credentialsNum': {
            required: '请输入模板名称！'
        }
    },
    'form-add-patient': {
        'account': {
            required: '请输入账号！'
        },
        'password': {
            required: '请输入密码！'
        },
        'repassword': {
            required: '请再次输入密码！'
        },
        'name': {
            required: '请输入姓名！'
        },
        'tellphone': {
            required: '请输入手机号!',
            patientPhone: function(v) {
                if (v && !/^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/.test(v)) {
                    return "请输入正确的手机号！";
                }
                return true;
            }
        },
        'phone': {
            officePhone: function(v) {
                if (v && !/^[(]\d{3,4}[)]\d{7,8}$|^\d{3,4}[-]\d{7,8}$/.test(v)) {
                    return "格式不对，只能输入数字、特殊字符-、(、)！";
                }
                return true;
            }
        },
        'email': {
            patientEmail: function(v) {
                if (v && !/^[a-z]([a-z0-9]*[-_\.]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/.test(v)) {
                    return "请输入正确格式的电子邮箱！";
                }
                return true;
            }
        },
        'address': {
            required: '请输入家庭住址！'
        }
    },
    'form-add-category': {
        'name': {
            required: '请输入科室名称！'
        },
        'spell': {
            required: '请输入拼音码！'
        }
    },
    'form-add-template': {
        'name': {
            required: '请输入问题类别！'
        },
        'orderNum': {
            required: '请输入类别排序！',
            number: function(v) {
                if (v && !/^[0-9]+$/.test(v)) {
                    return "类别排序只能输入数字";
                }
                return true;
            }
        }
    },
    'form-add-templateName': {
        'templateName': {
            required: '请输入模板名称！'
        }
    },
    'form-add-problem': {
        'title': {
            required: '请输入问题标题！'
        }
    },
    'form-edit-patient': {
        'name': {
            required: '请输入姓名！'
        },
        'phone': {
            required: "请输入电话！",
            customValidate: function(v) {
                if (v && !/^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/.test(v)) {
                    return "格式不对，只能输入数字、特殊字符-、(、)";
                }
                return true;
            }
        }
    },
    'form-add-medicine': {
        'medicineName': {
            required: '请输入药品名称！'
        },
        'standard': {
            required: '请输入规格！'
        },
        'retail-price': {
            required: '请输入零售价！'
        },
        'trade-price': {
            required: '请输入批发价！'
        },
        'producing-area': {
            required: '请输入药品产地！'
        },
        'vendor': {
            required: '请输入生产厂商！'
        },
        'code': {
            validata: function(v) {
                if (v && !/^[a-zA-Z]+$/.test(v)) {
                    return '格式输入错误';
                }
                return true;
            }
        },
        'max': {
            required: '请输入库存上限！',
            validate: function(v) {
                if (v && !/^[1-9]{1}[0-9]*$/.test(v)) {
                    return '只能输入数字！';
                }
                return true;
            }
        },
        'min': {
            required: '请输入库存上限！',
            validate: function(v) {
                if (v && !/^[1-9]{1}[0-9]*$/.test(v)) {
                    return '只能输入数字！';
                }
                return true;
            }
        }
    },
    'form-edit-info': {
        'account': {
            required: '请输入旧密码！'
        },
        'password': {
            required: '请输入新密码！'
        },
        'repassword': {
            required: '请输入旧密码！'
        }
    },
    'form-add-charge': {
        'chargeName': {
            required: '请输入收费名称！'
        },
        'price': {
            required: '请输入单价！'
        }
    },
    'form-add-storage': {
        'storageNum': {
            required: '请输入仓库编号！'
        },
        'storageName': {
            required: '请输入仓库名称！'
        },
        'phone': {
            required: '请输入联系电话！',

            validate: function(v) {
                if (v && !/^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$|^[(]\d{3,4}[)]\d{7,8}$|^\d{3,4}[-]\d{7,8}$/.test(v)) {
                    return "请输入正确的手机号！";
                }
                return true;
            }
        }
    },
    'form-add-parameter': {
        'paramName': {
            required: '请输入参数名称！'
        },
        'paramValue': {
            required: '请输入参数值！'
        }
    },
    'form-add-supplier': {
        'supplierCode': {
            required: '请输入供应商编码！'
        },
        'supplierName': {
            required: '请输入供应商名称！'
        },
        'phone': {
            required: "请输入联系电话",
            supplierValidate: function(v) {
                if (v && !/^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$|^[(]\d{3,4}[)]\d{7,8}$|^\d{3,4}[-]\d{7,8}$/.test(v)) {
                    return "格式不对，只能输入数字、特殊字符-、(、)";
                }
                return true;
            }
        },
        'province': {
            required: "请选择省份！",
            dovalidate: function(v) {
                if (v && v === 0) {
                    return "请选择省份！";
                }
                return true;
            }
        },
        'city': {
            required: "请选择城市！",
            dovalidate: function(v) {
                if (v && v === 0) {
                    return "请选择城市！";
                }
                return true;
            }
        }
    },
    'form-add-bill': {
        'userName': {
            required: "请输入经办人！"
        },
        'importdate': {
            required: "请输入入库日期！"
        },
        'warehousename': {
            dovalidate: function(v) {
                if (v && v === '-') {
                    return "请选择仓库！";
                }
                return true;
            }
        },
        'supplier': {
            dovalidate: function(v) {
                if (v && v === '-') {
                    return "请选择供应商！";
                }
                return true;
            }
        }
    },
    'form-retype-invoice': {
        'invoice': {
            required: '请输入原发票号！'
        },
        'means': {
            dovalidate: function(v) {
                if (v && v == 0) {
                    return '请选择方式！';
                }
                return true;
            }
        }
    },
    'form-add-ticket': {
        'receive': {
            required: '请输入领用日期！'
        },
        'recipients': {
            validate: function(v) {
                if (v && v == 0) {
                    return '请选择领用人！';
                }
                return true;
            }
        },
        'type': {
            validate: function(v) {
                if (v && v == 0) {
                    return '请选择票据类型！';
                }
                return true;
            }
        },
        'start': {
            required: '请输入起始票号！'
        },
        'end': {
            required: '请输入结束票号！'
        },
        'current': {
            required: '请输入当前票号！'
        },
        'status': {
            validate: function(v) {
                if (v && v == 0) {
                    return '请选择单据状态！';
                }
                return true;
            }
        }
    },
    'form-add-role': {
        'role-code': {
            required: '请输入角色编码'
        },
        'role-name': {
            required: '请输入角色名称'
        }
    },
    'form-add-plan': {
        'deal-time': {
            required: '请输入处理天'
        },
        'treat-type': {
            validate: function(v) {
                if (v == 0) {
                    return '请选择治疗类型';
                }
                return true;
            }
        },
        'treat-project': {
            validate: function(v) {
                if (v == 0) {
                    return '请选择治疗项目';
                }
                return true;
            }
        }
    },
    'include-edit-appointment': {
        'phone': {
            required: '请输入手机号',
            phoneValidate: function(v) {
                if (v && !/^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/.test(v)) {
                    return "请输入正确的手机号！";
                }
                return true;
            }
        },
        'departments': {
            validate: function(v) {
                if (v == 0) {
                    return '请选择治疗科室！';
                }
                return true;
            }
        },
        'doctor': {
            validate: function(v) {
                if (v == 0) {
                    return '请选择主治医生';
                }
                return true;
            }
        },
        'project': {
            validate: function(v) {
                if (v == 0) {
                    return '请选择预约项目！';
                }
                return true;
            }
        },
        'date': {
            required: '请输入选择日期！'
        },
        'start-hours': {
            required: '请输入开始时间！'
        },
        'start-minutes': {
            required: '请输入开始时间！'
        }
    },
    'form-add-project': {
        'step': {
            validate: function(v) {
                if (v == 0) {
                    return '请选择阶段！';
                }
                return true;
            }
        },
        'project_date': {
            required: '请输入日期！'
        },
        'deal_days': {
            required: '请输入处理天！'
        },
        'type': {
            validate: function(v) {
                if (v == 0) {
                    return '请选择类型！';
                }
                return true;
            }
        },
        'project': {
            validate: function(v) {
                if (v == 0) {
                    return '请选择项目！';
                }
                return true;
            }
        }
    },
    'form-add-terpay': {
        'strategy': {
            validate: function(v) {
                if (v == 0) {
                    return '请选择疗程信息中的疗程方案！';
                }
                return true;
            }
        },
        'start_date': {
            required: '请输入疗程信息中的开始日期！'
        }
    },
    'form-add-collect': {
        'first_days': {required: '请输入黄体天数！'},
        'start_dates': {required: '请输入开始时间！'},
        'operator_people': {required: '请输入实验人员！'},
        'collect_num': {required: '请输入收集卵数目！'},
        'collect_people': {required: '请输入取卵人员！'}
    },
    'form-add-embryology': {
        'first_day': {required: '请输入黄体天数！'},
        'start_date': {required: '请输入开始时间！'},
        'operator_people': {required: '请输入实验人员！'}
    },
    'form-add-program': {
        'date': {required: '请输入日期！'},
        'handle-days': {required: '请输入处理天！'},
        'project': {required: '请输入化验项目！'}
    },
    'form-patient-info': {
        'patientName': {
            required: '请输入患者姓名！'
        },
        'birthday': {
            required: '请输入出生日期！'
        }
    },
    'form-collect-sperm': {
        'date': {
            required: '请选择日期！'
        },
        'number': {
            required: '请输入样精号！'
        },
        'type': {
            valid: function(v){
                if(v && v == 0) {
                    return '请选择精液类型！';
                }
                return true;
            }
        },
        'methods': {
            valid: function(v){
                if(v && v == 0) {
                    return '请选择收集方式！';
                }
                return true;
            }
        },
        'shipments': {
            required: '请输入分装数！'
        }
    },
    'form-person-info': {
        'name': {
            required: '请输入姓名！',
            registerValidate: function(v) {
                if (v && v.length > 5) {
                    return '姓名长度不超过5个！';
                }
                return true;
            }
        },
        'birthday': {
            required: "请输入出生日期！"
        },
        'registerNum': {
            required: '请输入注册证号'
        },
        'phone': {
            required: "请输入联系电话",
            customValidate: function(v) {
                if (v && !/^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/.test(v)) {
                    return "请输入正确的手机号！";
                }
                return true;
            }
        },
        'registerCredentialsNum': {
            required: '请输入证件号码！'
        },
        'doctor': {
            required: "请选主治医生！"
        },
        'marriage-license': {
            required: "请输入结婚证号"
        },
        'birth-control': {
            required: "请输入计划生育证明"
        },
        'spouse-name': {
            required: '请输入配偶姓名！'
        },
        'spouse-birthday': {
            required: '请输入配偶出生日期！'
        },
        'spouse-registerNum': {
            required: '请输入配偶注册证号！'
        },
        'spouse-registerCredentialsNum': {
            required: '请输入配偶证件号码！'
        },
        'spouse-phone': {
            required: '请输入配偶手机号',
            customValidate: function(v) {
                if (v && !/^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/.test(v)) {
                    return "请输入正确的手机号！";
                }
                return true;
            }
        },
        'spouse-marriage-license': {
            required: "请输入配偶结婚证号"
        },
        'spouse-birth-control': {
            required: "请输入配偶计划生育证明"
        }
    },
    'form-add-reagent': {
        'project_name': {required: "请输入产品名称！"},
        'supplier':     {required: "请输入供应商！"},
        'project_num':  {required: "请输入货号！"},
        'type':         {required: "请输入类型！"},
        'standard':     {required: "请输入规格！"},
        'storage':      {required: "请输入存放地！"}
    },
    'form-add-batch': {
        'batch': {required: "请输入产品批号！"},
        'arrive': {required: "请选择到货日期！"},
        'validity': {required: "请选择有效日期！"}
    },
    'form-add-tank': {
        'type': {required: "请输入类型编号！"},
        'bucket': {required: "请输入吊桶数！"},
        'drivepipe': {required: "请输入套管数！"},
        'straw': {required: "请输入麦管数！"}
    },
    'form-storage-record': {
        'medicinesNum': {required: "请输入医疗号！"},
        'name': {required: "请输入姓名！"},
        'birthday': {required: "请输入出生日期！"},
        'strawCode': {required: "请输入麦管编号！"},
        'strawColor': {
            valid: function(v) {
                if(v && v == 0) {
                    return "请选择麦管颜色！";
                }
                return true;
            }
        }
    },
    'form-embryo-info': {
        'name': {required: "请输入姓名！"},
        'code': {required: "请输入编号！"},
        'freeze': {required: "请输入冷冻年限！"},
        'charge': {required: "请输入缴费年限！"},
        'fertilization-way': {
            valid: function(v) {
                if(v && v == 0) {
                    return "请选择受精方式！";
                }
                return true;
            }
        },
        'freezing-method': {
            valid: function(v) {
                if(v && v == 0) {
                    return "请选择冷冻方式！";
                }
                return true;
            }
        },
        'date': {required: "请输入采卵日期！"}
    },
    'form-oper-info': {
        'frozen-date': {required: "请输入冷冻日期！"},
        'hour': {required: "请输入时间！"},
        'minute': {required: "请输入日期！"},
        'frozen-personnel': {required: "请输入冷冻人员！"},
        'attesting-officer': {required: "请输入见证人员！"},
        'development-days': {required: "请输入发育天数！"},
        'frozen-days': {required: "请输入冷冻数目！"}
    },
    'form-basic-info': {
        'birthday': {required: "请输入出生日期！"},
        'storage_date': {required: "请输入存储年限！"},
        'collect_date': {required: "请输入采卵日期！"},
        'forzen_date': {required: "请输入冷冻日期！"},
        'forzen_oper': {required: "请输入冷冻人员！"},
        'forzen_method': {required: "请输入冷冻方式！"}
    },
    'form-total-info': {
        'treatment_cycle': {required: "请输入治疗周期！"},
        'take_date': {required: "请输入取精日期！"}
    },
    'form-embryo-transplant': {
        'date': {required: "请输入日期！"},
        'hour': {required: "请输入时间！"},
        'minute': {required: "请输入时间！"},
        'time_consuming': {required: "请输入移植耗时！"},
        'embryo_expert': {required: "请输入胚胎专家！"},
        'seccode': {required: "请输入记录验证！"},
        'validation': {required: "请输入培养皿验证！"},
        'abandoned_validation': {required: "请输入遗弃验证！"},
        'clinician': {required: "请输入临床医生！"},
        'device_batch': {required: "请输入装置批号！"},
        'extractive': {required: "请输入夫精/供精！"},
        'assisted_hatching': {
            valid: function(v) {
                if(v && v == 0) {
                    return "请选择胚胎孵化！";
                }
                return true;
            }
        },
        'signature': {required: "请输入签名时间！"}
    }
};