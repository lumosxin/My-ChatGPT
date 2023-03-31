import App from './App.vue'
import { createApp } from 'vue'

import 'element-plus/dist/index.css'

import './style.css'

import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/base-editor.css';

/**
 * markdown主题
 */
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
// import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
// import '@kangc/v-md-editor/lib/theme/style/github.css';

import Prism from 'prismjs';

/**
 * 使用选一个替换
 * githubTheme
 * vuepressTheme
 */
VMdPreview.use(
  vuepressTheme,  // 当前使用的主题
  {
    Prism
  }
)

const app = createApp(App)

app.use(VMdPreview)
app.mount('#app')