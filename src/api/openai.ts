const openaiUrl = import.meta.env.VITE_APP_OPENAI_API_URL
const openaiKey = import.meta.env.VITE_APP_OPENAI_API_KEY

/**
 * 获取openai接口数据
 */
export const getChatMessage = (params: any) => {
  return new Promise((resolve, reject) => {
    fetch(
      openaiUrl + '/v1/chat/completions', {
      method: "POST",
      body: JSON.stringify({
        ...params
      }),
      headers: {
        "Authorization": 'Bearer ' + openaiKey,
        "Content-Type": "application/json"
      },
    }).then(response => {
      resolve(response)
    }).catch((err) => {
      reject(err);
    })
  });
}