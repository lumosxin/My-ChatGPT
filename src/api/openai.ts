const apiUrl = import.meta.env.VITE_APP_API_URL

/**
 * 获取openai接口数据
 */
export const getChatMessage = (params: any, openaiKey: string) => {
  return new Promise((resolve, reject) => {
    fetch(
      apiUrl + '/v1/chat/completions', {
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