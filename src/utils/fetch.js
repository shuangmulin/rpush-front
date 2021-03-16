/*
 * @Author: JamesWong
 * @Description: 请求拦截器
 * @Date: 2018-09-26 15:05:22
 * @Last Modified by: chutao.fang
 * @Last Modified time: 2020-07-30 13:46:41
 */
import axios from 'axios'
import {
  Message,
  MessageBox,
  Loading
} from 'element-ui'
import router from '../router/index'

// 创建axios实例
const service = axios.create({
  // baseURL: '/', // api的base_url
  baseURL: process.env.BASE_URL_EXCHANGE, // 本地调试时
  timeout: 30000 // 请求超时时间
})

let loading

// request拦截器
service.interceptors.request.use(
  config => {
    let token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = token
      console.log('interceptors config=', config)
    }
    loading = Loading.service({
      fullscreen: true
    })
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
  }
)

// respone拦截器
service.interceptors.response.use(
  response => {
    loading.close()
    const res = response.data
    if (res.code === 401) {
      MessageBox.alert('登录信息过期，请重新登录', '提示信息', {
        confirmButtonText: '确定',
        callback: action => {
          router.replace({
            path: '/login'
          })
        }
      })
      return res
    } else if (res.code === 0) {
      return res
    } else {
      Message({
        message: res.msg || '服务器异常',
        type: 'error'
      })
      return res
    }
  }
)

export default service
