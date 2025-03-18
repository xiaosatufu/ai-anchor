<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { t } from "../lang";
import { TabContentScroller } from "../lib/ui";
import SettingBasic from "../components/Setting/SettingBasic.vue";
import SettingEnv from "../components/Setting/SettingEnv.vue";
import SettingAbout from "../components/Setting/SettingAbout.vue";

let tabContentScroller: TabContentScroller | null = null;
const contentContainer = ref<HTMLElement | null>(null);
const tabContainer = ref<HTMLElement | null>(null);
onMounted(() => {
  tabContentScroller = new TabContentScroller(
    tabContainer.value as HTMLElement,
    contentContainer.value as HTMLElement,
    {
      activeClass: "menu-active",
    },
  );
});
onBeforeUnmount(() => {
  tabContentScroller?.destroy();
});
</script>

<style lang="less" scoped>
.menu-active {
  --tw-bg-opacity: 1;
  background-color: rgb(243 244 246 / var(--tw-bg-opacity));
}

[data-theme="dark"] {
  .menu-active {
    background-color: var(--color-bg-page-nav-active);
  }
}
</style>

<template>
  <div class="flex select-none">
    <div
      ref="tabContainer"
      class="flex-shrink-0 p-8 w-56 border-r border-gray-100 border-solid dark:border-gray-600"
    >
      <div
        data-section="basic"
        class="p-2 mr-2 mb-4 rounded-lg cursor-pointer menu-active"
      >
        <div class="text-base">
          <icon-settings />
          {{ t("基础设置") }}
        </div>
      </div>
      <div
        v-if="0"
        data-section="env"
        class="p-2 mr-2 mb-4 rounded-lg cursor-pointer"
      >
        <div class="text-base">
          <icon-code />
          {{ t("环境设置") }}
        </div>
      </div>
      <div data-section="about" class="p-2 mr-2 mb-4 rounded-lg cursor-pointer">
        <div class="text-base">
          <icon-user />
          {{ t("关于软件") }}
        </div>
      </div>
    </div>
    <div class="flex-grow">
      <div
        ref="contentContainer"
        class="overflow-y-auto p-8 leading-8"
        style="height: calc(100vh - var(--window-header-height))"
      >
        <div data-section="basic" class="scroll-mt-4">
          <div class="mb-4 text-base font-bold">{{ t("基础设置") }}</div>
          <div>
            <SettingBasic />
          </div>
        </div>
        <div v-if="0" class="my-6 border-b border-gray-200 border-solid"></div>
        <div v-if="0" data-section="env" class="scroll-mt-4">
          <div class="mb-4 text-base font-bold">{{ t("环境设置") }}</div>
          <div>
            <SettingEnv />
          </div>
        </div>
        <div
          class="my-6 border-b border-gray-200 border-solid dark:border-gray-700"
        ></div>
        <!-- <div data-section="about" class="scroll-mt-4">
                    <div class="mb-4 text-base font-bold">
                        {{ t('关于软件') }}
                    </div>
                    <div class="">
                        <SettingAbout/>
                    </div>
                </div> -->
      </div>
    </div>
  </div>
</template>
