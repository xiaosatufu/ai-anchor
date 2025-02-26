<script setup lang="ts">
import {EnumServerStatus, ServerRecord} from "../../types/Server";
import {computed, ref, toRaw} from "vue";
import {useServerStore} from "../../store/modules/server";
import {Dialog} from "../../lib/dialog";
import {cloneDeep} from "lodash-es";
import {t} from "../../lang";

const serverStore = useServerStore()
const props = defineProps<{
    record: ServerRecord,
}>()
const visible = ref(false)
const settings = ref<any>([])
const setting = ref({})
const readonly = computed(() => {
    return ![
        EnumServerStatus.STOPPED,
        EnumServerStatus.ERROR,
    ].includes(props.record.status)
})
const gpus = ref<{
    id: string,
    name: string,
    size: number,
}[]>([])

const show = async () => {
    gpus.value = await window.$mapi.server.listGpus()
    visible.value = true
    settings.value = cloneDeep(props.record.settings)
    const settingValue = {}
    settings.value.forEach((s: any) => {
        settingValue[s.name] = s.default
        if (s.type === 'gpuSelector') {
            if ('' === settingValue[s.name] && gpus.value.length > 0) {
                settingValue[s.name] = gpus.value[0].id
            }
        }
    })
    setting.value = settingValue
}

const doSubmit = async () => {
    await serverStore.updateSetting(props.record.key, cloneDeep(toRaw(setting.value)))
    Dialog.tipSuccess(t('设置成功'))
    visible.value = false
}

defineExpose({
    show
})
</script>

<template>
    <a-modal v-model:visible="visible"
             width="40rem"
             title-align="start">
        <template #title>
            {{ $t('设置') }}
        </template>
        <template #footer>
            <a-button type="primary"
                      :disabled="readonly"
                      @click="doSubmit">{{ $t('确定') }}
            </a-button>
        </template>
        <div>
            <a-form :model="{}">
                <div v-for="fs in settings">
                    <a-form-item v-if="fs.type==='text'"
                                 :field="fs.name"
                                 :label="fs.title">
                        <a-input :placeholder="fs.placeholder"
                                 :readonly="readonly"
                                 v-model="setting[fs.name]"/>
                    </a-form-item>
                    <a-form-item v-else-if="fs.type==='radio'"
                                 :field="fs.name"
                                 :label="fs.title">
                        <a-radio-group v-model="setting[fs.name]"
                                       :disabled="readonly">
                            <a-radio v-for="option in fs.options"
                                     :key="option.value"
                                     :value="option.value">{{ option.label }}
                            </a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item v-else-if="fs.type==='gpuSelector'"
                                 :field="fs.name"
                                 :label="fs.title">
                        <a-select v-model="setting[fs.name]"
                                  :disabled="readonly">
                            <a-option v-for="gpu in gpus"
                                      :key="gpu.id"
                                      :value="gpu.id">{{ gpu.name }}
                            </a-option>
                        </a-select>
                    </a-form-item>
                </div>
            </a-form>
        </div>
    </a-modal>
</template>
