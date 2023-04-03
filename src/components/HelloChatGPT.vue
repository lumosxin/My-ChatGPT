<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

import {
  getChatCompletions
} from '@/api/openai'

/**
 * props
 */
defineProps<{ msg: string }>()

/**
 * data
 */
// 消息内容
const textarea = ref('');

// 页面对话数组
interface DataList {
  role: string;
  content: string;
}
const dataList: DataList[] = reactive([])

// openai信息
interface Openai {
  key: string;
  model: string;
}
const openai: Openai = reactive({
  key: sessionStorage.getItem('openaiKey') || '',
  model: sessionStorage.getItem('openaiModel') || 'gpt-3.5-turbo'
});

/**
 * methods
 */
// 错误消息封装
const errorMessage = (errType: any = 'info', err: string = '错误') => {
  ElMessage({
    showClose: true,
    message: err,
    type: errType,
  })
}

// 发送消息
const sendMessage = ()=> {
  if (!textarea.value) return errorMessage('error', '消息不能为空')
  if (!openai.model) return errorMessage('error', 'model不能为空')
  console.log(textarea.value);
  console.log(openai.key);
  dataList.push({
    "role": 'user',
    "content": textarea.value
  })
  textarea.value = ''
  sessionStorage.setItem('openaiKey', openai.key)
  sessionStorage.setItem('openaiModel', openai.model)
  getChatMessageFn();
}

const getChatMessageFn = () => {
  console.log(dataList);
  getChatCompletions({
    "model": openai.model,
    "messages": dataList,
    // "frequency_penalty": 0,
    // "max_tokens": 1000,
    // "presence_penalty": 0,
    // "stream": true,
    // "temperature": 1,
    // "top_p": 1,
  }, openai.key).then((response: any) => {
    console.log(response);
    if(response !== 200) return errorMessage('error', response.statusText)
    const reader = response.body.getReader();
    console.log(reader);
    // TODO 实时文本输出
    const readStream = async(reader: any): Promise<void>=> {
      const { done, value } = await reader.read()
      if (done) {
        return;
      }
      console.log(value);
      const decoded = new TextDecoder().decode(value);
      console.log(decoded);
      const jsonDecoded = JSON.parse(decoded);
      if (jsonDecoded.error) {
        return errorMessage('error', jsonDecoded.error.message)
      }
      console.log(jsonDecoded);
      dataList.push(jsonDecoded.choices[0].message)
      console.log(dataList);
      return readStream(reader)
    }
    readStream(reader)
  }).catch(err => {
    errorMessage('error', err.toString())
  })
}

const toEmit = (key: string) => {
  openai.key = key
  console.log(openai.key);
}

onMounted(() => {
})

</script>

<template>
  <div class="box">
    <div class="box_left">
    </div>
    <div class="box_right">
      <div class="box_right_header">
        <Header 
          @toEmit="toEmit"
          :openaiKey="openai.key"
        />
      </div>
      <div class="box_right_content">
        <template v-for="item in dataList">
          <div class="box_right_content_right">
            <div v-if="item.role === 'user'" class="box_right_content_right_container">
              <span class="box_right_content_right_container_text">{{ item.content }}</span>
            </div>
          </div>
          <div v-if="item.role === 'assistant'" class="box_right_content_left">
            <div class="box_right_content_left_container">
              <v-md-preview :text="item.content"></v-md-preview>
            </div>
          </div>
        </template>
      </div>
      <div class="box_right_input">
        <el-input
          v-model="textarea"
          type="textarea"
          :autosize="{ minRows: 4 }"
          placeholder="Please input"
          resize="none"
        />
        <div class="box_right_input_send">
          <el-button 
            color="#626aef"
            @click="sendMessage"
          >发送</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.box {
  height: 700px;
  width: 1200px;
  display: flex;
  box-sizing: border-box;
}
.box .box_left {
  background: rgb(231, 248, 255);
  width: 280px;
  border-bottom: 1px solid rgb(133, 199, 214);
  border-top: 1px solid rgb(133, 199, 214);
  border-left: 1px solid rgb(133, 199, 214);
  border-top-left-radius: 2%;
  border-bottom-left-radius: 2%;
  box-sizing: border-box;
}
.box .box_right {
  flex: 1;
  background: rgb(255, 255, 255);
  border-bottom: 1px solid rgb(133, 199, 214);
  border-top: 1px solid rgb(133, 199, 214);
  border-right: 1px solid rgb(133, 199, 214);
  border-left: 2px solid rgb(218, 229, 232);
  border-top-right-radius: 2%;
  border-bottom-right-radius: 2%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.box .box_right .box_right_header {
  height: 100px;
  border-bottom: 1px solid rgb(168, 162, 162);
}
.box .box_right .box_right_content {
  flex: 1;
  overflow-y: scroll;
  box-sizing: border-box;
}
.box .box_right .box_right_content .box_right_content_right {
  display: flex;
  flex-direction: row-reverse;
  margin: 10px 18px 10px 0;
}
.box .box_right .box_right_content .box_right_content_right .box_right_content_right_container {
  text-align: left;
  max-width: 80%;
  background: rgb(231, 248, 255);
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid rgb(222, 222, 222);
  border-radius: 10px;
}
.box .box_right .box_right_content .box_right_content_right .box_right_content_right_container .box_right_content_right_container_text {
  box-sizing: border-box;
}
.box .box_right .box_right_content .box_right_content_left {
  display: flex;
  flex-direction: row;
  margin: 10px 0 10px 18px;
}
.box .box_right .box_right_content .box_right_content_left .box_right_content_left_container {
  text-align: left;
  max-width: 80%;
  background: rgb(231, 248, 255);
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid rgb(222, 222, 222);
  border-radius: 10px;
}
.box .box_right .box_right_content .box_right_content_left .box_right_content_left_container .box_right_content_left_container_text {
  box-sizing: border-box;
}
.box .box_right .box_right_input {
  height: 100px;
  padding: 18px;
  position: relative;
}
.box .box_right .box_right_input .box_right_input_send {
  position: absolute;
  right: 30px;
  top: 70px;
}
</style>
