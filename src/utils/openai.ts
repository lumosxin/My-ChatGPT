import { Configuration, OpenAIApi } from "openai";
export const openaiFn = async(openaiKey: string) => {
    const configuration = new Configuration({
        organization: "org-R6zvGeSy447EpW4RkGEM7uhw",
        apiKey: openaiKey,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.listEngines();
    console.log(response);
}
