<script setup lang="ts">
import {
  ref,
  watch,
  defineEmits
} from 'vue'

const openai_key = ref('')

const toEmit = defineEmits<{
    (event: 'toEmit', value: string): any
}>()

watch(openai_key, (newVal, oldVal) => {
  toEmit('toEmit', newVal)
})
</script>

<template>
<div class="openai_key">
  <span class="openai_key_span">openai key：</span>
  <el-input
    v-model="openai_key"
    class="openai_key_input"
    placeholder="openai key"
  />
</div>
</template>

<style scoped>
.openai_key {
  display: flex;
  align-items: center;
  padding: 5px;
}
.openai_key .openai_key_span {
  width: 100px;
}
.openai_key .openai_key_input {
  flex: 1;
}
</style>