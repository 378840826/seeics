import request from '@/router/axios';
import website from "@/config/website";
//
export const loginByUsername = (tenantId, deptId, roleId, username, password, type, key, code) => request({
  url: '/api/blade-auth/oauth/token',
  method: 'post',
  headers: {
    'Tenant-Id': tenantId,
    'Dept-Id': (website.switchMode ? deptId : ''),
    'Role-Id': (website.switchMode ? roleId : ''),
    'Captcha-Key': key,
    'Captcha-Code': code,
  },
  params: {
    tenantId,
    username,
    password,
    grant_type: (website.captchaMode ? "captcha" : "password"),
    scope: "all",
    type
  }
});
//重新发送邮箱激活
export const sendEmailAgain = (email) => request({
  url: '/api/blade-user/re-send-activate',
  method: 'get',
  params: {
    tenantId: "000000",
    email,
  }
});
//判断邮件是否存在
export const isEmail = (email) => request({
  url: '/api/blade-user/exist-email',
  method: 'get',
  params: {
    tenantId: "000000",
    email,
  }
});
//忘记密码(发送重置邮件)
export const sendresetpswEmail = (email,captchaCode,captchaKey) => request({
  url: '/api/blade-user/forgot-password',
  method: 'get',
  params: {
    tenantId: '000000',
    email,
    captchaKey,
    captchaCode,
  }
});
//重置密码
export const resetPassword = (markId,password) => request({
  url: '/api/blade-user/reset-password',
  method: 'get',
  params: {
    markId,
    password,   
  }
});
//激活
export const activateAccount = (activateId) => request({
  url: '/api/blade-user/activate',
  method: 'get',
  params: {
    activateId   
  }
});

//后端要求激活一下数据
export const activationData = () => request({
  url: '/api/seeics-analysis/seeics-analysis/keyword-analyze/initialization',
  method: 'post',
});

export const loginBySocial = (tenantId, source, code, state) => request({
  url: '/api/blade-auth/oauth/token',
  method: 'post',
  headers: {
    'Tenant-Id': tenantId
  },
  params: {
    tenantId,
    source,
    code,
    state,
    grant_type: "social",
    scope: "all",
  }
})

export const refreshToken = (refresh_token, tenantId) => request({
  url: '/api/blade-auth/oauth/token',
  method: 'post',
  headers: {
    'Tenant-Id': tenantId
  },
  params: {
    tenantId,
    refresh_token,
    grant_type: "refresh_token",
    scope: "all",
  }
});

export const registerGuest = (form, oauthId) => request({
  url: '/api/blade-user/register-guest',
  method: 'post',
  params: {
    tenantId: form.tenantId,
    name: form.name,
    account: form.account,
    password: form.password,
    oauthId
  }
});

export const getButtons = () => request({
  url: '/api/blade-system/menu/buttons',
  method: 'get'
});

export const getCaptcha = () => request({
  url: '/api/blade-auth/oauth/captcha',
  method: 'get'
});

export const logout = () => request({
  url: '/api/blade-auth/oauth/logout',
  method: 'get'
});

export const getUserInfo = () => request({
  url: '/api/blade-auth/oauth/user-info',
  method: 'get'
});

export const sendLogs = (list) => request({
  url: '/api/blade-auth/oauth/logout',
  method: 'post',
  data: list
});

export const clearCache = () => request({
  url: '/api/blade-auth/oauth/clear-cache',
  method: 'get'
});
