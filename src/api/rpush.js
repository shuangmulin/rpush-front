import fetch from '@/utils/rpush_fetch'

let RPUSH_ROUTE = "/rpush-route"
let RPUSH_SCHEDULER = "/rpush-scheduler"

export function login (data) {
  data.grant_type = 'client_credentials'
  data.scope = 'all'
  return fetch({
    url: RPUSH_ROUTE + '/oauth/token',
    method: 'get',
    params: data
  })
}

/*
 * @Description: 查询平台
 */
export function platformList (data) {
  return fetch({
    url: RPUSH_ROUTE + '/rpush-platform-config/platform',
    method: 'get',
    params: data
  })
}

export function messageTypeList (data) {
  return fetch({
    url: RPUSH_ROUTE + '/rpush-platform-config/message-type',
    method: 'get',
    params: data
  })
}

export function queryConfig (platform, data) {
  return fetch({
    url: RPUSH_ROUTE + '/rpush-platform-config/' + platform + '/config',
    method: 'get',
    params: data
  })
}

export function queryConfigField (platform) {
  return fetch({
    url: RPUSH_ROUTE + '/rpush-platform-config/' + platform + '/config/field',
    method: 'get'
  })
}

export function getConfig (platform, configId) {
  return fetch({
    url: RPUSH_ROUTE + '/rpush-platform-config/' + platform + '/config/' + configId,
    method: 'get'
  })
}

export function updateConfig (data) {
  return fetch({
    url: RPUSH_ROUTE + '/rpush-platform-config/config/',
    method: 'post',
    data: data
  })
}

export function setConfigDefault (configId, defaultFlag) {
  return fetch({
    url: RPUSH_ROUTE + '/rpush-platform-config/setDefault',
    method: 'get',
    params: {
      configId: configId,
      defaultFlag: defaultFlag
    }
  })
}

export function deleteConfig (configId) {
  return fetch({
    url: RPUSH_ROUTE + '/rpush-platform-config/config/' + configId,
    method: 'delete'
  })
}

// --------------接收人分组-------------
export function queryGroup (platform, data) {
  return fetch({
    url: RPUSH_ROUTE + '/rpush-template-receiver-group/' + platform,
    method: 'post',
    data: data
  })
}

export function getGroup (platform, groupId) {
  return fetch({
    url: RPUSH_ROUTE + '/rpush-template-receiver-group/' + platform + '/' + groupId,
    method: 'get'
  })
}

export function updateGroup (data) {
  return fetch({
    url: RPUSH_ROUTE + '/rpush-template-receiver-group/',
    method: 'post',
    data: data
  })
}

export function deleteGroup (groupId, success) {
  return fetch({
    url: RPUSH_ROUTE + '/rpush-template-receiver-group/' + groupId,
    method: 'delete'
  }).then(function (response) {
    success && success()
  })
}

// --------------模板管理-------------
export function queryTemplate (platform, data) {
  return fetch({
    url: RPUSH_ROUTE + '/rpush-template/' + platform,
    method: 'post',
    data: data
  })
}

export function getTemplate (platform, groupId) {
  return fetch({
    url: RPUSH_ROUTE + '/rpush-template/' + platform + '/' + groupId,
    method: 'get'
  })
}

export function updateTemplate (data) {
  return fetch({
    url: RPUSH_ROUTE + '/rpush-template/',
    method: 'post',
    data: data
  })
}

export function deleteTemplate (templateId, success) {
  return fetch({
    url: RPUSH_ROUTE + '/rpush-template/' + templateId,
    method: 'delete'
  }).then(function (response) {
    success && success()
  })
}

// --------------接收人管理-------------
export function queryReceiver (platform, data) {
  return fetch({
    url: RPUSH_ROUTE + '/rpush-template-receiver/' + platform,
    method: 'post',
    data: data
  })
}

export function getReceiver (platform, id) {
  return fetch({
    url: RPUSH_ROUTE + '/rpush-template-receiver/' + platform + '/' + id,
    method: 'get'
  })
}

export function updateReceiver (data) {
  return fetch({
    url: RPUSH_ROUTE + '/rpush-template-receiver/',
    method: 'post',
    data: data
  })
}

export function deleteReceiver (id, success) {
  return fetch({
    url: RPUSH_ROUTE + '/rpush-template-receiver/' + id,
    method: 'delete'
  }).then(function (response) {
    success && success()
  })
}

export function importReceiver (formData, success) {
  fetch.post('/rpush-template-receiver/import', formData, {
    'Content-Type': 'multipart/form-data'
  }).then(res => {
    success && success(res)
  })
}

export function listDepartment (data) {
  return fetch({
    url: RPUSH_ROUTE + '/wechat/cp/department',
    method: 'get',
    params: data
  })
}

export function cpImportReceiver (data) {
  return fetch({
    url: RPUSH_ROUTE + '/wechat/cp/import',
    method: 'post',
    data: data
  })
}

// --------------发消息-------------
export function sendMessage (data) {
  return fetch({
    url: RPUSH_ROUTE + '/message/push',
    method: 'post',
    data: data
  })
}

export function sendMessageSync (data, success) {
  return fetch({
    url: RPUSH_ROUTE + '/message/push',
    method: 'post',
    data: data
  }).then(function (response) {
    success && success(response)
  })
}

export function queryHisDetail (data) {
  return fetch({
    url: RPUSH_ROUTE + '/rpush-message-his-detail',
    method: 'post',
    data: data
  })
}

export function listMessageType (platform, success) {
  return fetch({
    url: RPUSH_ROUTE + '/rpush-message-scheme/type?platform=' + platform,
    method: 'get',
  })
}

export function listMessageTypeSync (platform, success) {
  return fetch({
    url: RPUSH_ROUTE + '/rpush-message-scheme/type?platform=' + platform,
    method: 'get',
  }).then(function (response) {
    success && success(response)
  })
}

export function listMessageTypeField (messageType) {
  return fetch({
    url: RPUSH_ROUTE + '/rpush-message-scheme/field?messageType=' + messageType,
    method: 'get'
  })
}

// --------------方案管理-------------
export function listScheme (messageType, success) {
  return fetch({
    url: RPUSH_ROUTE + '/rpush-message-scheme/list?messageType=' + messageType,
    method: 'get'
  }).then(function (response) {
    success && success(response)
  })
}

export function schemeDetail (schemeId) {
  return fetch({
    url: RPUSH_ROUTE + '/rpush-message-scheme/detail?schemeId=' + schemeId,
    method: 'get'
  })
}

export function deleteScheme (schemeId) {
  return fetch({
    url: RPUSH_ROUTE + '/rpush-message-scheme?schemeId=' + schemeId,
    method: 'delete'
  })
}

export function updateOrSaveScheme (data, success) {
  return fetch({
    url: RPUSH_ROUTE + '/rpush-message-scheme/update',
    method: 'post',
    data: data
  }).then(function (response) {
    success && success(response)
  })
}

// --------------下载-------------
export function download (path, filename, params) {
  fetch({
    method: 'get',
    url: RPUSH_ROUTE + '/rpush-template-receiver/download/' + path,
    data: params,
    responseType: 'arraybuffer'
  }).then(res => {
    const hrefUrl = window.URL.createObjectURL(new Blob([res.data]))
    const a = window.document.createElement('a')
    a.setAttribute('href', hrefUrl)
    a.setAttribute('download', filename || path)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    // 释放blob URL地址
    window.URL.revokeObjectURL(hrefUrl)
  })
}

// --------------定时任务-------------
export function queryTask (data) {
  return fetch({
    url: RPUSH_SCHEDULER + '/rpush-scheduler-task/page',
    method: 'post',
    data: data
  })
}

export function getTask (taskId) {
  return fetch({
    url: RPUSH_SCHEDULER + '/rpush-scheduler-task/detail/' + taskId,
    method: 'get'
  })
}

export function deleteTask (taskId, success) {
  return fetch({
    url: RPUSH_SCHEDULER + '/rpush-scheduler-task/delete/' + taskId,
    method: 'delete'
  }).then(function (response) {
    success && success(response)
  })
}

export function addTask (data) {
  return fetch({
    url: RPUSH_SCHEDULER + '/rpush-scheduler-task/add',
    method: 'post',
    data: data
  })
}

export function updateTask (data) {
  return fetch({
    url: RPUSH_SCHEDULER + '/rpush-scheduler-task/update',
    method: 'put',
    data: data
  })
}
