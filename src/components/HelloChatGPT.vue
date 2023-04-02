<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import {
  getChatMessage
} from '@/api/openai'

import { ElMessage } from 'element-plus'
interface DataList {
  role?: string;
  content?: string;
}

const errorMessage = (err: string) => {
  ElMessage({
    showClose: true,
    message: err,
    type: 'error',
  })
}

const textarea = ref('');
const dataList: DataList[] = reactive([])

defineProps<{ msg: string }>()
const sendMessage = ()=> {
  if (!textarea.value) return errorMessage('不能为空')
  console.log(textarea.value);
  dataList.push({
    "role": 'user',
    "content": textarea.value
  })
  textarea.value = ''
  getChatMessageFn();
}

const getChatMessageFn = () => {
  console.log(dataList);
  getChatMessage({
    "model": "gpt-3.5-turbo",
    "messages": dataList,
    // "frequency_penalty": 0,
    // "max_tokens": 1000,
    // "presence_penalty": 0,
    // "stream": true,
    // "temperature": 1,
    // "top_p": 1,
  }).then((response: any) => {
    console.log(response);
    const reader = response.body.getReader();
    // console.log(reader);
    const readStream = async(reader: any): Promise<void>=> {
      const { done, value } = await reader.read()
      if (done) {
        return;
      }
      // console.log(value);
      const decoded = new TextDecoder().decode(value);
      // console.log(decoded);
      const jsonDecoded = JSON.parse(decoded);
      if (jsonDecoded.error) {
        return errorMessage(jsonDecoded.error.message)
      }
      // console.log(jsonDecoded);
      dataList.push(jsonDecoded.choices[0].message)
      // console.log(dataList);
      return readStream(reader)
    }
    readStream(reader)
  })
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
  width: 900px;
  display: flex;
  box-sizing: border-box;
}
.box .box_left {
  background: rgb(231, 248, 255);
  width: 260px;
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
