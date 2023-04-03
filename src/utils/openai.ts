import { Configuration, OpenAIApi } from "openai";
/**
 * 依赖请求方法
 * @param openaiKey openai的key
 * @param openaiModel 模型 default gpt-3.5-turbo
 * @param openaiPrompt 消息对话内容
 */
export const openaiFn = async(openaiKey: string, openaiModel: string = 'gpt-3.5-turbo', openaiPrompt: string) => {
    const configuration = new Configuration({
        apiKey: openaiKey,
    });
    const openai = new OpenAIApi(configuration);
    try {
        const response = await openai.createCompletion({
            model: openaiModel,
            prompt: openaiPrompt,
          });
        console.log(response);
    } catch (error: any) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
            } else {
            console.log(error.message);
        }
    }
}
