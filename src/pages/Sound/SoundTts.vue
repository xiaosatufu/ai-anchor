<script setup lang="ts">

import AudioPlayer from "../../components/common/AudioPlayer.vue";
import SoundTtsCreate from "../../components/Sound/SoundTtsCreate.vue";
import {onBeforeUnmount, onMounted, ref} from "vue";
import {SoundTtsRecord, SoundTtsService} from "../../service/SoundTtsService";
import TaskBizStatus from "../../components/common/TaskBizStatus.vue";
import {TaskChangeType, useTaskStore} from "../../store/modules/task";
import SoundTtsActionDelete from "../../components/Sound/SoundTtsActionDelete.vue";
import SoundTtsActionDownload from "../../components/Sound/SoundTtsActionDownload.vue";
import SoundDuration from "../../components/Sound/SoundDuration.vue";
import ServerTaskResultParam from "../../components/Server/ServerTaskResultParam.vue";

const records = ref<SoundTtsRecord[]>([])
const taskStore = useTaskStore()

const taskChangeCallback = (bizId: string, type: TaskChangeType) => {
    doRefresh()
}

onMounted(async () => {
    await doRefresh()
    taskStore.onChange('SoundTts', taskChangeCallback)
})
onBeforeUnmount(() => {
    taskStore.offChange('SoundTts', taskChangeCallback)
})

const doRefresh = async () => {
    records.value = await SoundTtsService.list()
}

</script>

<template>
    <div class="p-5">
        <div class="mb-4 flex items-center">
            <div class="text-3xl font-bold flex-grow">
                {{ $t('声音合成') }}
            </div>
            <div class="flex items-center" v-if="0">
                <a-tooltip :content="$t('清空历史')" position="right">
                    <a-button class="ml-1">
                        <template #icon>
                            <icon-delete/>
                        </template>
                    </a-button>
                </a-tooltip>
            </div>
        </div>
        <div>
            <SoundTtsCreate @submitted="doRefresh"/>
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
                                <div v-if="r.param.speaker"
                                     class="inline-block mr-2 bg-blue-100 rounded-lg px-2 leading-8 h-8">
                                    <i class="iconfont icon-speaker mr-1"></i>
                                    {{ r.param.speaker }}
                                </div>
                                <div v-if="r.param.speed"
                                     class="inline-block mr-2 bg-blue-100 rounded-lg px-2 leading-8 h-8">
                                    <i class="iconfont icon-speed mr-1"></i>
                                    <span class="">x{{ r.param.speed }}</span>
                                </div>
                                <ServerTaskResultParam :record="r as any"/>
                            </div>
                            <div class="ml-1">
                                <SoundDuration :start="r.startTime" :end="r.endTime"/>
                            </div>
                            <div class="ml-1">
                                <TaskBizStatus :status="r.status" :status-msg="r.statusMsg"/>
                            </div>
                        </div>
                        <div class="pt-4">
                            {{ r.text }}
                        </div>
                        <div class="pt-4" v-if="r.resultWav">
                            <AudioPlayer
                                show-wave
                                :url="'file://'+r.resultWav"/>
                        </div>
                        <div class="pt-4">
                            <SoundTtsActionDownload :record="r"/>
                            <SoundTtsActionDelete :record="r" @update="doRefresh"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
