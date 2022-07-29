export default function (isPay) {
  return {
    tabs: true,
    tabsActive: 1,
    clearExclude: isPay ? [] : ['deptName', 'fullName'],
    group: [
      {
        label: '个人信息',
        prop: 'info',
        column: [{
          label: '头像',
          type: 'upload',
          listType: 'picture-img',
          propsHttp: {
            res: 'data',
            url: 'link',
          },
          canvasOption: {
            text: ' ',
            ratio: 0.1
          },
          action: '/api/blade-resource/oss/endpoint/put-file',
          tip: '只能上传jpg/png用户头像，且不超过500kb',
          span: 12,
          row: true,
          prop: 'avatar'
        }, {
          label: '姓名',
          span: 12,
          row: true,
          prop: 'realName',
          rules: [
            { required: true, message: '姓名不能为空', trigger: 'blur' },
            { min: 2, max: 5, message: '姓名长度在2到5个字符' },
          ]
        }, {
          label: '用户名',
          span: 12,
          row: true,
          prop: 'name',
          rules: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { min: 1, max: 50, message: '姓名长度在1到50个字符' },
          ]
        }, {
          label: '手机号',
          span: 12,
          row: true,
          prop: 'phone',
          rules: [
            { required: true, message: '手机号不能为空', trigger: 'blur' },
            { pattern: /^\d{11}$/, message: '手机号为11位数字', trigger: 'blur' },
          ]
        }, {
          label: '邮箱',
          prop: 'email',
          span: 12,
          row: true,
          rules: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            { pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/, message: '邮箱格式不正确', trigger: 'blur' },
          ]
        }, {
          label: '机构名称',
          span: 12,
          row: true,
          prop: 'deptName',
          disabled: !isPay,
          rules: [
            { required: true, message: '机构名称不能为空', trigger: 'blur' },
          ]
        }, {
          label: '机构全称',
          span: 12,
          row: true,
          prop: 'fullName',
          disabled: !isPay,
          rules: [
            { required: true, message: '机构全称不能为空', trigger: 'blur' },
          ]
        }]
      },
      {
        label: '修改密码',
        prop: 'password',
        column: [{
          label: '原密码',
          span: 12,
          row: true,
          type: 'password',
          prop: 'oldPassword'
        }, {
          label: '新密码',
          span: 12,
          row: true,
          type: 'password',
          prop: 'newPassword'
        }, {
          label: '确认密码',
          span: 12,
          row: true,
          type: 'password',
          prop: 'newPassword1'
        }]
      }
    ],
  };
}
