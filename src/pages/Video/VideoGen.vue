<script setup lang="ts">

import VideoTemplateDialog from "../../components/Video/VideoTemplateDialog.vue";
import {onBeforeUnmount, onMounted, ref} from "vue";
import VideoGenCreate from "../../components/Video/VideoGenCreate.vue";
import {VideoGenRecord, VideoGenService} from "../../service/VideoGenService";
import {TaskChangeType, useTaskStore} from "../../store/modules/task";
import VideoGenActionDownload from "../../components/Video/VideoGenActionDownload.vue";
import TaskBizStatus from "../../components/common/TaskBizStatus.vue";
import VideoGenActionDelete from "../../components/Video/VideoGenActionDelete.vue";
import VideoPlayer from "../../components/common/VideoPlayer.vue";
import VideoDuration from "../../components/Video/VideoDuration.vue";
import ServerTaskResultParam from "../../components/Server/ServerTaskResultParam.vue";
import AudioPlayer from "../../components/common/AudioPlayer.vue";

const videoTemplateDialog = ref<InstanceType<typeof VideoTemplateDialog> | null>(null)
const videoGenCreate = ref<InstanceType<typeof VideoGenCreate> | null>(null)

const records = ref<VideoGenRecord[]>([])
const taskStore = useTaskStore()

const doRefresh = async () => {
    records.value = await VideoGenService.list()
}

const taskChangeCallback = (bizId: string, type: TaskChangeType) => {
    setTimeout(doRefresh, 1000)
}

onMounted(async () => {
    await doRefresh()
    taskStore.onChange('VideoGen', taskChangeCallback)
})
onBeforeUnmount(() => {
    taskStore.offChange('VideoGen', taskChangeCallback)
})

</script>

<template>
    <div class="p-5">
        <div class="mb-4 flex items-center">
            <div class="text-3xl font-bold flex-grow">
                {{ $t('视频合成') }}
            </div>
            <div class="flex items-center">
                <a-button class="ml-1"
                          @click="videoTemplateDialog?.show()">
                    <template #icon>
                        <i class="iconfont icon-video-template"></i>
                    </template>
                    {{ $t('视频模板') }}
                </a-button>
                <a-tooltip v-if="0"
                           :content="$t('清空历史')" position="right">
                    <a-button class="ml-1">
                        <template #icon>
                            <icon-delete/>
                        </template>
                    </a-button>
                </a-tooltip>
            </div>
        </div>
        <div>
            <VideoGenCreate ref="videoGenCreate" @submitted="doRefresh"/>

            <div>
                <div v-for="r in records" :key="r.id">
                    <div class="rounded-xl shadow border p-4 mt-4 hover:shadow-lg">
                        <div class="flex items-center">
                            <div class="flex-grow flex items-center">
                                <div class="inline-block mr-2 bg-blue-100 rounded-lg px-2 leading-8 h-8">
                                    #{{ r.id }}
                                </div>
                                <div class="inline-block mr-2 bg-blue-100 rounded-lg px-2 leading-8 h-8">
                                    <i class="iconfont icon-server mr-1"></i>
                                    {{ r.serverTitle }}
                                    v{{ r.serverVersion }}
                                </div>
                                <ServerTaskResultParam :record="r as any"/>
                            </div>
                            <div class="ml-1">
                                <VideoDuration :start="r.startTime" :end="r.endTime"/>
                            </div>
                            <div class="ml-1">
                                <TaskBizStatus :status="r.status" :status-msg="r.statusMsg"/>
                            </div>
                        </div>
                        <div class="pt-4 flex">
                            <div class="flex-grow">
                                <div class="flex mb-3">
                                    <div class="mr-2 flex-shrink-0">
                                        <div class="bg-gray-100 px-3 py-1 leading-6 rounded">
                                            <i class="iconfont icon-video-template"></i>
                                            {{ $t('视频模板') }}
                                        </div>
                                    </div>
                                    <div class="pt-1">
                                        {{ r.videoTemplateName }}
                                    </div>
                                </div>
                                <div v-if="r.soundType==='soundTts'" class="flex">
                                    <div class="mr-2 flex-shrink-0">
                                        <div class="bg-gray-100 px-3 py-1 leading-6 rounded">
                                            <i class="iconfont icon-sound"></i>
                                            {{ $t('声音合成') }}
                                        </div>
                                    </div>
                                    <div class="pt-1">
                                        {{ r.soundTtsText }}
                                    </div>
                                </div>
                                <div v-if="r.soundType==='soundClone'" class="flex items-center">
                                    <div class="bg-gray-100 px-3 py-1 leading-6 rounded mr-2">
                                        <i class="iconfont icon-video-template"></i>
                                        {{ $t('声音克隆') }}
                                    </div>
                                    <div>
                                        {{ r.soundCloneText }}
                                    </div>
                                </div>
                                <div v-if="r.soundType==='soundCustom'" class="flex items-start">
                                    <div class="bg-gray-100 px-3 py-1 leading-6 rounded mr-2">
                                        <icon-file/>
                                        {{ $t('本地文件') }}
                                    </div>
                                    <div class="flex-grow">
                                        <AudioPlayer :url="`file://${r.soundCustomFile}`" />
                                    </div>
                                </div>
                            </div>
                            <div class="flex-shrink-0 ml-8">
                                <div class="p-2 rounded shadow bg-gray-300" v-if="1||r.resultMp4">
                                    <div class="w-48 h-48" v-if="1||r.resultMp4">
                                        <VideoPlayer :url="'file://'+r.resultMp4"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="0">
                            <pre>{{ r }}</pre>
                        </div>
                        <div class="pt-4">
                            <VideoGenActionDownload :record="r"/>
                            <VideoGenActionDelete :record="r" @update="doRefresh"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <VideoTemplateDialog ref="videoTemplateDialog" @update="videoGenCreate?.refresh('videoTemplate')"/>
</template>

<style scoped>

</style>
