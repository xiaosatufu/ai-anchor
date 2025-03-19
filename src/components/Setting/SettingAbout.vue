<script setup lang="ts">
import { AppConfig } from "../../config";
import { t } from "../../lang";
import UpdaterButton from "../common/UpdaterButton.vue";
import { useSettingStore } from "../../store/modules/setting";
import FeedbackTicketButton from "../common/FeedbackTicketButton.vue";

const setting = useSettingStore();
const licenseYear = new Date().getFullYear();

const doOpenLog = async () => {
  await window.$mapi.file.openPath(window.$mapi.log.root());
};
</script>

<template>
  <div class="flex mb-3">
    <div class="w-20">{{ t("版本") }}</div>
    <div class="flex-grow">
      <div>
        <!-- {{ $t('社区版')}} -->
        v{{ AppConfig.version }} Build {{ setting.buildInfo.buildId }}
      </div>
      <div class="pt-2">
        <UpdaterButton />
      </div>
    </div>
  </div>
  <div class="flex items-center mb-3">
    <div class="w-20">{{ t("官网") }}</div>
    <div class="flex flex-grow items-center">
      <a :href="AppConfig.website" target="_blank" class="text-link">
        {{ AppConfig.website }}
      </a>
      <div class="inline-block ml-3">
        <FeedbackTicketButton />
      </div>
      <a-button class="ml-3" size="mini" @click="doOpenLog">
        <template #icon>
          <icon-file />
        </template>
        {{ t("日志") }}
      </a-button>
    </div>
  </div>
  <div class="flex items-center mb-3">
    <div class="w-20">{{ t("声明") }}</div>
    <div class="flex-grow">
      {{ t("本产品为开源软件，遵循 AGPL-3.0 license 协议。") }}
    </div>
  </div>
  <div class="mb-3">
    <a
      :href="AppConfig.websiteGithub"
      target="_blank"
      class="inline-flex items-center px-8 py-2 mr-1 mb-3 w-48 bg-gray-100 rounded-lg dark:bg-gray-700 hover:shadow-lg"
    >
      <img src="./../../assets/image/github.svg" class="mr-2 w-12 h-12" />
      <div class="flex-grow">Github</div>
    </a>
    <a
      :href="AppConfig.websiteGitee"
      target="_blank"
      class="inline-flex items-center px-8 py-2 mr-1 w-48 bg-gray-100 rounded-lg dark:bg-gray-700 hover:shadow-lg"
    >
      <img src="./../../assets/image/gitee.svg" class="mr-2 w-12 h-12" />
      <div class="flex-grow">Gitee</div>
    </a>
  </div>
  <div class="text-gray-400">&copy; {{ licenseYear }} {{ AppConfig.name }}</div>
</template>
