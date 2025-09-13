import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store";

import ArcoVue, {Message} from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import '@arco-design/web-vue/dist/arco.css'

import {i18n, t} from "./lang";

import './style.less'
import {Dialog} from "./lib/dialog";

import {CommonComponents} from "./components/common";
import {TaskManager} from "./task";
import {useSettingStore} from "./store/modules/setting";
import { OfflineMode } from "./lib/offline";

const settingStore = useSettingStore();

// Initialize offline mode detection
(async () => {
  try {
    await OfflineMode.autoDetect();
    if (OfflineMode.isOffline()) {
      console.log("AI-Anchor启动在离线模式 - 只能使用本地模型");
    }
  } catch (error) {
    console.warn("离线模式检测失败，默认启用离线模式:", error);
    OfflineMode.enable();
  }
})();

const app = createApp(App)
app.use(ArcoVue)
app.use(ArcoVueIcon)
app.use(CommonComponents)
app.use(i18n)
app.use(store)
app.use(router)
Message._context = app._context
app.config.globalProperties.$mapi = window.$mapi
app.config.globalProperties.$dialog = Dialog
app.config.globalProperties.$t = t as any
TaskManager.init()

app.mount('#app')
    .$nextTick(() => {
        postMessage({payload: 'removeLoading'}, '*')
    })
