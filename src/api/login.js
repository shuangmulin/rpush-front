import fetch from '@/utils/fetch'
export function login (data) {
  return fetch({
    url: '/administrator/login',
    method: 'post',
    data: data
  })
}
