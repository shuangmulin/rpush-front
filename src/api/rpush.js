import fetch from '@/utils/rpush_fetch'

export function login (data) {
  data.grant_type = 'client_credentials'
  data.scope = 'all'
  return fetch({
    url: '/oauth/token',
    method: 'get',
    params: data
  })
}

/*
 * @Description: 查询平台
 */
export function platformList (data) {
  return fetch({
    url: '/rpush-platform-config/platform',
    method: 'get',
    params: data
  })
}

export function queryConfig (platform, data) {
  return fetch({
    url: '/rpush-platform-config/' + platform + '/config',
    method: 'get',
    params: data
  })
}

export function queryConfigField (platform) {
  return fetch({
    url: '/rpush-platform-config/' + platform + '/config/field',
    method: 'get'
  })
}

export function getConfig (platform, configId) {
  return fetch({
    url: '/rpush-platform-config/' + platform + '/config/' + configId,
    method: 'get'
  })
}

export function updateConfig (data) {
  return fetch({
    url: '/rpush-platform-config/config/',
    method: 'post',
    data: data
  })
}

export function setConfigDefault (configId, defaultFlag) {
  return fetch({
    url: '/rpush-platform-config/setDefault',
    method: 'get',
    params: {
      configId: configId,
      defaultFlag: defaultFlag
    }
  })
}

export function deleteConfig (configId) {
  return fetch({
    url: '/rpush-platform-config/config/' + configId,
    method: 'delete'
  })
}

// --------------接收人分组-------------
export function queryGroup (platform, data) {
  return fetch({
    url: '/rpush-template-receiver-group/' + platform,
    method: 'post',
    data: data
  })
}

export function getGroup (platform, groupId) {
  return fetch({
    url: '/rpush-template-receiver-group/' + platform + '/' + groupId,
    method: 'get'
  })
}

export function updateGroup (data) {
  return fetch({
    url: '/rpush-template-receiver-group/',
    method: 'post',
    data: data
  })
}

export function deleteGroup (groupId, success) {
  return fetch({
    url: '/rpush-template-receiver-group/' + groupId,
    method: 'delete'
  }).then(function (response) {
    success && success()
  })
}

// --------------模板管理-------------
export function queryTemplate (platform, data) {
  return fetch({
    url: '/rpush-template/' + platform,
    method: 'post',
    data: data
  })
}

export function getTemplate (platform, groupId) {
  return fetch({
    url: '/rpush-template/' + platform + '/' + groupId,
    method: 'get'
  })
}

export function updateTemplate (data) {
  return fetch({
    url: '/rpush-template/',
    method: 'post',
    data: data
  })
}

export function deleteTemplate (templateId, success) {
  return fetch({
    url: '/rpush-template/' + templateId,
    method: 'delete'
  }).then(function (response) {
    success && success()
  })
}

// --------------接收人管理-------------
export function queryReceiver (platform, data) {
  return fetch({
    url: '/rpush-template-receiver/' + platform,
    method: 'post',
    data: data
  })
}

export function getReceiver (platform, id) {
  return fetch({
    url: '/rpush-template-receiver/' + platform + '/' + id,
    method: 'get'
  })
}

export function updateReceiver (data) {
  return fetch({
    url: '/rpush-template-receiver/',
    method: 'post',
    data: data
  })
}

export function deleteReceiver (id, success) {
  return fetch({
    url: '/rpush-template-receiver/' + id,
    method: 'delete'
  }).then(function (response) {
    success && success()
  })
}

// --------------发消息-------------
export function sendMessage (data) {
  return fetch({
    url: '/message/push',
    method: 'post',
    data: data
  })
}

export function queryHisDetail (data) {
  return fetch({
    url: '/rpush-message-his-detail',
    method: 'post',
    data: data
  })
}

export function listMessageType (platform) {
  return fetch({
    url: '/rpush-message-scheme/type?platform=' + platform,
    method: 'get'
  })
}

export function listMessageTypeField (messageType) {
  return fetch({
    url: '/rpush-message-scheme/field?messageType=' + messageType,
    method: 'get'
  })
}

// --------------方案管理-------------
export function listScheme (messageType, success) {
  return fetch({
    url: '/rpush-message-scheme/list?messageType=' + messageType,
    method: 'get'
  }).then(function (response) {
    success && success(response)
  })
}

export function schemeDetail (schemeId) {
  return fetch({
    url: '/rpush-message-scheme/detail?schemeId=' + schemeId,
    method: 'get'
  })
}

export function deleteScheme (schemeId) {
  return fetch({
    url: '/rpush-message-scheme?schemeId=' + schemeId,
    method: 'delete'
  })
}

export function updateOrSaveScheme (data, success) {
  return fetch({
    url: '/rpush-message-scheme/update',
    method: 'post',
    data: data
  }).then(function (response) {
    success && success(response)
  })
}
