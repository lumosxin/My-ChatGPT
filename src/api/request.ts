

import base from './index'

const axios = base.axios
const baseUrl = base.baseUrl

export const postJsonRequest = async (url: string, params: any) => {
  const res = await axios({
    method: 'POST',
    baseURL: `${baseUrl}/${url}`,
    data: JSON.stringify({
      ...params
    }),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    }
  })
  console.log(res)
}