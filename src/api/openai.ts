import { ElMessage } from 'element-plus'

const openaiApi = import.meta.env.VITE_APP_OPENAI_API_URL
const openaiKey = import.meta.env.VITE_APP_OPENAI_KEY
sessionStorage.setItem('openaiKey', openaiKey)

/**
 * 错误消息封装
 * @param err 提示内容
 */
const errorMessage = (errType: any = 'info', err: string = '错误') => {
  ElMessage({
    showClose: true,
    message: err,
    type: errType,
  })
}

/**
 * 检查openai key
 */
const checkOpenAiKey = (key: string)=> {
  // 目前只检查有没有
  return key
}
/**
 * 获取openai接口数据
 * @params 参数
 * @openaiKeys openai的key
 */
export const getChatCompletions = (params: any, openaiKeys: string) => {
  openaiKeys = openaiKey
  return new Promise((resolve, reject) => {
    if(!checkOpenAiKey(openaiKeys)) return errorMessage('error', 'key不存在')
    fetch(
      openaiApi || 'https://api.openai.com' + '/v1/chat/completions', {
      'method': "POST",
      'body': JSON.stringify({
        ...params
      }),
      'headers': {
        "Authorization": 'Bearer ' + openaiKeys,
        "Content-Type": "application/json"
      },
    }).then(response => {
      resolve(response)
    }).catch((err) => {
      reject(err);
    })
  });
}

/**
 * 获取模型接口
 * @param openaiKeys openai的key
 * @returns 
 */
export const getModel = (openaiKeys: string) => {
  return new Promise((resolve, reject) => {
    if(!checkOpenAiKey(openaiKeys)) return errorMessage('error', 'key不存在')
    fetch(
      openaiApi || 'https://api.openai.com' + '/v1/models', {
      'method': "GET",
      'headers': {
        "Authorization": 'Bearer ' + openaiKeys
      },
    }).then(response => {
      resolve(response)
    }).catch((err) => {
      reject(err);
    })
  });
}