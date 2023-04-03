import axios from 'axios'

axios.defaults.timeout = 300000000 // 超时时间ms

/**
 * 请求配置
 */
axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    console.log('请求异常：' + JSON.stringify(error));
    return Promise.reject(error);
  }
);

/**
 * 响应配置
 */
axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  console.log('响应出错：' + error)
  return Promise.reject(error)
})


const base = {
  axios: axios,
  baseUrl: import.meta.env.VITE_APP_API_URL
}

export default base
