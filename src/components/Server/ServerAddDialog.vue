<script setup lang="ts">
import { computed, ref } from "vue";
import { Dialog } from "../../lib/dialog";
import { t } from "../../lang";
import { functionToLabels } from "../../lib/aigcpanel";
import { mapError } from "../../lib/error";
import { EnumServerType, ServerRecord } from "../../types/Server";
import { useServerStore } from "../../store/modules/server";
import { VersionUtil } from "../../lib/util";
import { AppConfig } from "../../config";

const cloudDialog = ref<InstanceType<typeof ServerCloudDialog>>();

const serverStore = useServerStore();
const visible = ref(false);
const loading = ref(false);
const modelInfo = ref({
  type: EnumServerType.LOCAL as EnumServerType,
  name: "",
  version: "",
  serverRequire: "",
  title: "",
  description: "",
  deviceDescription: "",
  path: "",
  platformName: "",
  platformArch: "",
  entry: "",
  functions: [],
  settings: [],
  setting: {},
  isSupport: false,
});
const isImporting = ref(false);
const logStatus = ref("");

const show = () => {
  emptyModelInfo();
  visible.value = true;
};

const platformInfo = computed(() => {
  return `${modelInfo.value.platformName} ${modelInfo.value.platformArch}`;
});
const functionLabels = computed(() => {
  return functionToLabels(modelInfo.value.functions);
});

const emptyModelInfo = () => {
  modelInfo.value.type = EnumServerType.LOCAL;
  modelInfo.value.name = "";
  modelInfo.value.version = "";
  modelInfo.value.title = "";
  modelInfo.value.description = "";
  modelInfo.value.serverRequire = "";
  modelInfo.value.deviceDescription = "";
  modelInfo.value.path = "";
  modelInfo.value.platformName = "";
  modelInfo.value.platformArch = "";
  modelInfo.value.entry = "";
  modelInfo.value.functions = [];
  modelInfo.value.settings = [];
  modelInfo.value.setting = {};
  modelInfo.value.isSupport = false;
};

const doSubmitLocalDir = async () => {
  await serverStore.add({
    key: serverStore.generateServerKey({
      name: modelInfo.value.name,
      version: modelInfo.value.version,
    } as any),
    name: modelInfo.value.name,
    title: modelInfo.value.title,
    version: modelInfo.value.version,
    type: modelInfo.value.type,
    functions: modelInfo.value.functions,
    localPath: modelInfo.value.path,
    settings: modelInfo.value.settings,
    setting: modelInfo.value.setting,
  } as ServerRecord);
};

const doSubmit = async () => {
  if (!modelInfo.value.path) {
    return;
  }
  const target = await window.$mapi.file.fullPath(
    `model/${modelInfo.value.name}-${modelInfo.value.version}`,
  );
  const targetAbsolute = window.$mapi.file.absolutePath(target);
  if (await window.$mapi.file.exists(targetAbsolute)) {
    Dialog.tipError(t("模型相同版本已存在"));
    return;
  }
  const exists = await serverStore.getByNameVersion(
    modelInfo.value.name,
    modelInfo.value.version,
  );
  if (exists) {
    Dialog.tipError(t("模型相同版本已存在"));
    return;
  }
  if (window.$mapi.app.platformName() !== modelInfo.value.platformName) {
    Dialog.tipError(t("模型平台不匹配"));
    return;
  }
  if (window.$mapi.app.platformArch() !== modelInfo.value.platformArch) {
    Dialog.tipError(t("模型架构不匹配"));
    return;
  }
  if (!VersionUtil.match(AppConfig.version, modelInfo.value.serverRequire)) {
    Dialog.tipError(t("软件不满足模型版本要求"));
    return;
  }
  isImporting.value = true;
  if (modelInfo.value.type === EnumServerType.LOCAL_DIR) {
    await doSubmitLocalDir();
  } else {
    Dialog.tipError(t("模型类型错误"));
    return;
  }
  Dialog.tipSuccess(t("模型添加成功"));
  visible.value = false;
  isImporting.value = false;
  emit("update");
};

const doSelectLocalDir = async () => {
  const configPath = await window.$mapi.file.openFile({
    filters: [{ name: "config.json", extensions: ["json"] }],
  });
  if (!configPath) {
    return;
  }
  if (!/^[a-zA-Z0-9\/:\-\\._]+$/.test(configPath)) {
    Dialog.tipError(t("模型路径不能包含非英文、空格等特殊字符"));
    return;
  }
  emptyModelInfo();
  loading.value = true;
  try {
    const content = await window.$mapi.file.read(configPath, {
      isFullPath: true,
    });
    const serverPath = configPath.replace(/[\/\\]config.json$/, "");
    const json = JSON.parse(content);
    modelInfo.value.type = EnumServerType.LOCAL_DIR;
    modelInfo.value.name = json.name || "";
    modelInfo.value.version = json.version || "";
    modelInfo.value.serverRequire = json.serverRequire || "*";
    modelInfo.value.deviceDescription = json.deviceDescription || "";
    modelInfo.value.title = json.title || "";
    modelInfo.value.description = json.description || "";
    modelInfo.value.path = serverPath;
    modelInfo.value.platformName = json.platformName || "";
    modelInfo.value.platformArch = json.platformArch || "";
    modelInfo.value.entry = json.entry || "";
    modelInfo.value.functions = json.functions || [];
    modelInfo.value.settings = json.settings || {};
    modelInfo.value.setting = json.setting || {};
    modelInfo.value.isSupport = await window.$mapi.server.isSupport({
      localPath: serverPath,
      name: modelInfo.value.name,
    } as any);
    logStatus.value = modelInfo.value.isSupport ? "" : t("模型不支持");
  } catch (e) {
    console.log("ServerImportLocalDialog.doSelectLocalDir.error", e);
    Dialog.tipError(t("模型目录识别失败，请选择正确的模型目录"));
  }
  loading.value = false;
};

const doSelectCloud = async () => {
  Dialog.tipError(t("请升级Pro版使用"));
};
defineExpose({
  show,
  doSelectCloud,
});

const emit = defineEmits({
  update: () => true,
});
</script>

<template>
  <a-modal
    v-model:visible="visible"
    width="40rem"
    :footer="false"
    :esc-to-close="false"
    :mask-closable="false"
    title-align="start"
  >
    <template #title>
      {{ $t("添加模型服务") }}
    </template>
    <div>
      <div class="select-none">
        <div v-if="!modelInfo.name">
          <div class="flex justify-center items-center">
            <div class="px-3 w-1/2">
              <div>
                <img
                  class="object-contain m-auto w-32 h-32"
                  src="./../../assets/image/server-folder.svg"
                />
              </div>
              <div>
                <a-button
                  @click="doSelectLocalDir"
                  class="block w-full"
                  :loading="loading"
                >
                  <template #icon>
                    <icon-folder />
                  </template>
                  {{ t("选择本地模型") }}
                </a-button>
              </div>
              <div class="mt-3 text-sm text-gray-400 rounded-lg">
                {{ $t("模型离线运行在本地，对电脑性能有要求") }}
                <!-- <a-tooltip
                  :content="
                    '①' +
                    $t('访问官方模型页面，下载模型到本地') +
                    ' ②' +
                    $t('解压模型压缩包，选择目录中的config.json文件')
                  "
                >
                  <icon-question-circle />
                </a-tooltip> -->
              </div>
            </div>
            <!-- <div class="px-3 w-1/2">
                            <div>
                                <img class="object-contain m-auto w-32 h-32"
                                     src="./../../assets/image/server-file.svg"/>
                            </div>
                            <div>
                                <a-button @click="doSelectCloud"
                                          class="block w-full"
                                          :loading="loading">
                                    <template #icon>
                                        <icon-desktop/>
                                    </template>
                                    {{ t('添加云端模型服务') }}
                                </a-button>
                            </div>
                            <div class="mt-3 text-sm text-gray-400 rounded-lg">
                                {{ $t('模型运行在云端，避免本地资源不足') }}
                            </div>
                        </div> -->
          </div>
        </div>
        <div v-else>
          <div class="py-4 leading-10 rounded-lg border">
            <div class="flex">
              <div class="pr-3 w-20 text-right">{{ t("名称") }}</div>
              <div>{{ modelInfo.title }}</div>
            </div>
            <div class="flex">
              <div class="pr-3 w-20 text-right">{{ t("版本") }}</div>
              <div>{{ modelInfo.version }}</div>
            </div>
            <div class="flex">
              <div class="pr-3 w-20 text-right">{{ t("标识") }}</div>
              <div>{{ modelInfo.name }}</div>
            </div>
            <div class="flex">
              <div class="flex-shrink-0 pr-3 w-20 text-right">
                {{ t("描述") }}
              </div>
              <div>{{ modelInfo.description }}</div>
            </div>
            <div class="flex">
              <div class="flex-shrink-0 pr-3 w-20 text-right">
                {{ $t("适配") }}
              </div>
              <div>{{ platformInfo }}</div>
            </div>
            <div class="flex">
              <div class="flex-shrink-0 pr-3 w-20 text-right">
                {{ $t("功能") }}
              </div>
              <div>
                <a-tag v-for="label in functionLabels" class="mr-1">
                  {{ label }}
                </a-tag>
              </div>
            </div>
            <div class="flex">
              <div class="flex-shrink-0 pr-3 w-20 text-right">
                {{ t("硬件要求") }}
              </div>
              <div>{{ modelInfo.deviceDescription }}</div>
            </div>
            <div class="flex">
              <div class="flex-shrink-0 pr-3 w-20 text-right">
                {{ t("版本要求") }}
              </div>
              <div>
                {{
                  modelInfo.serverRequire === "*"
                    ? t("无")
                    : modelInfo.serverRequire
                }}
              </div>
            </div>
          </div>
          <div class="flex items-center pt-4">
            <div>
              <a-button
                class="mr-2"
                type="primary"
                :disabled="!modelInfo.isSupport"
                :loading="isImporting"
                @click="doSubmit"
              >
                <template #icon>
                  <icon-check />
                </template>
                {{ $t("确认提交") }}
              </a-button>
              <a-button
                class="mr-2"
                v-if="!isImporting"
                @click="emptyModelInfo"
                :loading="loading"
              >
                <template #icon>
                  <icon-redo />
                </template>
                {{ $t("重新选择") }}
              </a-button>
            </div>
            <div class="flex-grow pl-3 text-sm truncate">
              {{ logStatus }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>
