<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from "vue";
import PageNav from "./../components/PageNav.vue";
import { AppConfig } from "../config";
import AppQuitConfirm from "../components/AppQuitConfirm.vue";

const appQuitConfirm = ref<InstanceType<typeof AppQuitConfirm> | null>(null);
const platformName = ref("");

const doQuit = async () => {
  await appQuitConfirm.value?.show();
};

onBeforeMount(() => {
  platformName.value = window.$mapi?.app?.platformName() as any;
});

onMounted(() => {
  // document.body.setAttribute('arco-theme', 'dark')
});
</script>
<template>
  <div class="window-container">
    <div
      class="flex items-center h-10 border-b border-gray-200 border-solid window-header dark:border-gray-800"
    >
      <div class="flex flex-grow items-center window-header-title">
        <div class="py-2 pl-2">
          <img src="/logo.svg" class="w-4 t-4" />
        </div>
        <div class="flex-grow p-2">
          {{ AppConfig.name }}
          <!-- {{ $t('社区版') }} -->
        </div>
      </div>
      <div class="p-1 leading-4">
        <div
          class="inline-block mr-1 w-6 h-6 leading-6 cursor-pointer hover:text-primary"
          @click="$mapi.app.windowMin()"
        >
          <i class="text-sm iconfont icon-min"></i>
        </div>
        <div
          class="inline-block mr-1 w-6 h-6 leading-6 cursor-pointer hover:text-primary"
          @click="$mapi.app.windowMax()"
        >
          <i class="text-sm iconfont icon-max"></i>
        </div>
        <div
          class="inline-block w-6 h-6 leading-6 cursor-pointer hover:text-red-500"
          @click="doQuit"
        >
          <i class="text-sm iconfont icon-close"></i>
        </div>
      </div>
    </div>
    <div class="window-body">
      <div class="flex page-container">
        <div
          class="flex-shrink-0 w-16 h-full text-white"
          style="background-color: var(--color-bg-page-nav)"
        >
          <PageNav />
        </div>
        <div class="overflow-y-auto flex-grow">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
  <AppQuitConfirm ref="appQuitConfirm" />
</template>
