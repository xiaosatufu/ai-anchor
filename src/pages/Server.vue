<script setup lang="ts">

import ServerStatus from "../components/Server/ServerStatus.vue";
import {EnumServerType} from "../types/Server";
import ServerAddDialog from "../components/Server/ServerAddDialog.vue";
import {onMounted, ref} from "vue";
import {useServerStore} from "../store/modules/server";
import {AppConfig} from "../config";
import {t} from "../lang";
import ServerActionDelete from "../components/Server/ServerActionDelete.vue";
import ServerActionStartStop from "../components/Server/ServerActionStartStop.vue";
import ServerActionLog from "../components/Server/ServerActionLog.vue";
import ServerStartTime from "../components/Server/ServerStartTime.vue";
import ServerActionInfo from "../components/Server/ServerActionInfo.vue";
import ServerActionSetting from "../components/Server/ServerActionSetting.vue";
import {functionToLabels} from "../lib/aigcpanel";

const addDialog = ref<InstanceType<typeof ServerAddDialog> | null>(null)
const serverStore = useServerStore()
const helpShow = ref(false)

const doHelp = () => {
    window.$mapi.app.openExternalWeb(AppConfig.helpUrl)
}

const doRefresh = async () => {
    await serverStore.refresh()
}

const typeName = (type: string) => {
    if (EnumServerType.LOCAL === type) {
        return t('本地模型')
    } else if (EnumServerType.LOCAL_DIR === type) {
        return t('本地模型目录')
    } else if (EnumServerType.CLOUD === type) {
        return t('云端模型')
    }
}

</script>

<template>
    <div class="pb-device-container p-8 min-h-full relative select-none">
        <div class="mb-4 flex items-center">
            <div class="text-3xl font-bold flex-grow">
                {{ $t('模型') }}
            </div>
            <div class="flex items-center">
                <a-button v-if="serverStore.records.length>0"
                          class="ml-1"
                          @click="addDialog?.show()">
                    <template #icon>
                        <icon-plus/>
                    </template>
                    {{ $t('添加模型服务') }}
                </a-button>
                <a-button v-if="0" class="ml-1">
                    <template #icon>
                        <icon-apps/>
                    </template>
                    {{ $t('添加云端模型') }}
                </a-button>
            </div>
        </div>
        <div class="-mx-2">
            <div v-if="!serverStore.records.length" class="py-20">
                <div class="text-center">
                    <img class="h-32 m-auto opacity-50" src="./../assets/image/server-empty.svg"/>
                </div>
                <div class="mt-5 text-center text-gray-400">
                    <div>{{ $t('暂时还没有模型，请添加模型~') }}</div>
                </div>
                <div class="mt-5 text-center">
                    <a-button class="ml-1"
                              @click="addDialog?.show()">
                        <template #icon>
                            <icon-plus/>
                        </template>
                        {{ $t('添加模型服务') }}
                    </a-button>
                    <a-button v-if="0" class="ml-1">
                        <template #icon>
                            <icon-apps/>
                        </template>
                        {{ $t('添加云端模型') }}
                    </a-button>
                    <a-button class="mx-1" @click="helpShow=true">
                        <template #icon>
                            <icon-book class="mr-1"/>
                        </template>
                        {{ $t('如何添加模型？') }}
                    </a-button>
                </div>
                <div v-if="helpShow" class="pt-5 text-center">
                    <div class="inline-block bg-gray-100 text-left rounded-lg p-6 leading-8">
                        <div>① {{ $t('访问官方模型页面，下载模型到本地') }}</div>
                        <div>② {{ $t('解压模型压缩包，选择目录中的config.json文件') }}</div>
                        <div class="pt-3">
                            {{ $t('更多内容，请查看') }}
                            <a href="javascript:;" class="text-link" @click="doHelp">
                                <icon-book/>
                                {{ $t('在线文档') }}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="flex flex-wrap">
                <div v-for="record in serverStore.records"
                     class="w-full lg:w-1/2 2xl:w-1/3 p-3">
                    <div class="rounded-xl shadow border p-4">
                        <div class="flex items-center">
                            <div class="flex-grow">
                                <div class="inline-block mr-4">
                                    <a-tooltip :content="typeName(record.type as string)">
                                        <div class="inline-block">
                                            <i v-if="record.type===EnumServerType.CLOUD"
                                               class="iconfont icon-network"></i>
                                            <i v-else-if="record.type===EnumServerType.LOCAL"
                                               class="iconfont icon-desktop"></i>
                                            <i v-else-if="record.type===EnumServerType.LOCAL_DIR"
                                               class="iconfont icon-folder"></i>
                                        </div>
                                    </a-tooltip>
                                </div>
                                <div class="inline-block mr-4">
                                    {{ record.title }}
                                    <div class="inline-block rounded-3xl bg-gray-100 px-3">
                                        v{{ record.version }}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <ServerStatus :status="record.status"/>
                            </div>
                        </div>
                        <div class="h-12 pt-4">
                            <div class="text-gray-400 text-sm">
                                <a-tag v-for="label in functionToLabels(record.functions)" class="mr-1">
                                    {{ label }}
                                </a-tag>
                            </div>
                        </div>
                        <div class="pt-4 flex items-center">
                            <div class="flex-grow">
                                <ServerActionStartStop v-if="record.type===EnumServerType.LOCAL_DIR"
                                                       :record="record"/>
                                <ServerActionLog :record="record"/>
                                <ServerActionDelete :record="record" @update="doRefresh"/>
                                <ServerActionInfo :record="record"/>
                                <ServerActionSetting v-if="record.settings && Object.keys(record.settings).length>0"
                                                     :record="record"/>
                            </div>
                            <div>
                                <ServerStartTime :record="record"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <ServerAddDialog ref="addDialog" @update="doRefresh"/>
</template>

<style scoped>

</style>
