<script setup lang="ts">
import { Repl, ReplStore } from "@refina/repl";
import Monaco from "@refina/repl/monaco-editor";
import {
  VTFlyout,
  VTIconChevronLeft,
  VTIconChevronRight,
  VTLink,
} from "@vue/theme";
import { computed, nextTick, ref, version } from "vue";
import { onHashChange, resolveSFCExample } from "../helpers/utils";
import { data } from "./tutorial.data";
import { useData } from "vitepress";

const { isDark } = useData();

const store = new ReplStore({
  defaultVueRuntimeURL: `https://unpkg.com/vue@${version}/dist/vue.esm-browser.js`,
});

const instruction = ref<HTMLElement>();

const currentStep = ref("");
const keys = Object.keys(data).sort((a, b) => {
  return Number(a.replace(/^step-/, "")) - Number(b.replace(/^step-/, ""));
});
const totalSteps = keys.length;

const titleRE = /<h1.*?>(.+?)<a class="header-anchor/;
const allSteps = keys.map((key, i) => {
  const desc = data[key]["description.md"] as string;
  return {
    text: `${i + 1}. ${desc.match(titleRE)![1]}`,
    link: `#${key}`,
  };
});

const currentDescription = computed(() => {
  return data[currentStep.value]?.["description.md"];
});

const currentStepIndex = computed(() => {
  return keys.indexOf(currentStep.value) + 1;
});

const prevStep = computed(() => {
  const match = currentStep.value.match(/\d+/);
  const prev = match && `step-${+match[0] - 1}`;
  if (prev && data.hasOwnProperty(prev)) {
    return prev;
  }
});

const nextStep = computed(() => {
  const match = currentStep.value.match(/\d+/);
  const next = match && `step-${+match[0] + 1}`;
  if (next && data.hasOwnProperty(next)) {
    return next;
  }
});

const showingHint = ref(false);

function updateExample(scroll = false) {
  let hash = location.hash.slice(1);
  if (!data.hasOwnProperty(hash)) {
    hash = "step-1";
    location.replace(`/tutorial/#${hash}`);
  }
  currentStep.value = hash;

  const content = showingHint.value ? data[hash]._hint! : data[hash];

  const tsconfig = store.state.files["tsconfig.json"];
  store.setFiles(
    {
      ...resolveSFCExample(content),
      "tsconfig.json": tsconfig.code,
    },
    "App.ts",
  );

  if (scroll) {
    nextTick(() => {
      instruction.value!.scrollTop = 0;
    });
  }
}

function toggleResult() {
  showingHint.value = !showingHint.value;
  updateExample();
}

onHashChange(() => {
  showingHint.value = false;
  updateExample(true);
});

updateExample();
</script>

<template>
  <section class="tutorial">
    <article class="instruction" ref="instruction">
      <VTFlyout :button="`${currentStepIndex} / ${totalSteps}`">
        <VTLink
          v-for="(step, i) of allSteps"
          class="vt-menu-link"
          :class="{ active: i + 1 === currentStepIndex }"
          :href="step.link"
          >{{ step.text }}</VTLink
        >
      </VTFlyout>
      <div class="vt-doc" v-html="currentDescription"></div>
      <div class="hint" v-if="data[currentStep]?._hint">
        <button @click="toggleResult">
          {{ showingHint ? "Reset" : "Show me!" }}
        </button>
      </div>
      <footer>
        <a v-if="prevStep" :href="`#${prevStep}`"
          ><VTIconChevronLeft class="vt-link-icon" style="margin: 0" /> Prev</a
        >
        <a class="next-step" v-if="nextStep" :href="`#${nextStep}`"
          >Next <VTIconChevronRight class="vt-link-icon"
        /></a>
      </footer>
    </article>
    <Repl
      class="repl"
      layout="vertical"
      :editor="Monaco"
      :store="store"
      :theme="isDark ? 'dark' : 'light'"
      :showCompileOutput="true"
      :clearConsole="false"
      :showImportMap="false"
      :showTsConfig="false"
      @keyup="showingHint = false"
    />
  </section>
</template>

<style scoped>
.vt-doc :deep(div[class*="language-"]) {
  background-color: var(--vp-code-block-bg) !important;
}

.tutorial {
  position: fixed;
  left: calc((100vw - var(--width)) / 2);
  top: calc(var(--vp-nav-height) + var(--vp-banner-height, 0px));
  width: var(--width);
  display: flex;
  margin: 0 auto;
  --width: calc(min(100vw, 1440px));
  --height: calc(100vh - var(--vp-nav-height) - var(--vp-banner-height, 0px));
}

.preference-switch {
  position: relative;
}

.instruction {
  width: 45%;
  height: var(--height);
  padding: 0 32px 24px;
  border-right: 1px solid var(--vp-c-divider-light);
  font-size: 15px;
  overflow-y: auto;
  position: relative;
  --vt-nav-height: 40px;
}

.vue-repl {
  width: 55%;
  height: var(--height);
}

.vt-flyout {
  z-index: 9;
  position: absolute;
  right: 20px;
}

.vt-menu-link.active {
  font-weight: 500;
  color: var(--vp-c-brand);
}

.vt-menu-link {
  text-decoration: none;
  color: var(--vp-c-text);
}

footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--vp-c-divider);
  margin-top: 1.5em;
  padding-top: 1em;
}

footer a {
  text-decoration: none;
  font-weight: 500;
  color: var(--vp-c-brand);
}

.next-step {
  margin-left: auto;
}

.vt-doc :deep(h1) {
  font-size: 1.4em;
  margin: 1em 0;
}

.vt-doc :deep(h2) {
  font-size: 1.1em;
  margin: 1.2em 0 0.5em;
  padding: 0;
  border-top: none;
}

.vt-doc :deep(.header-anchor) {
  display: none;
}

.vt-doc :deep(summary) {
  cursor: pointer;
}

.hint {
  padding-top: 1em;
}

button {
  background-color: var(--vp-c-brand);
  color: var(--vp-c-bg);
  padding: 4px 12px 3px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
}

@media (min-width: 1377px) {
  .vue-repl {
    border-right: 1px solid var(--vp-c-divider-light);
  }
}

@media (min-width: 1441px) {
  .tutorial {
    padding-right: 32px;
  }
}

:deep(.narrow) {
  display: none;
}

@media (max-width: 720px) {
  .tutorial {
    display: block;
  }
  .instruction {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--vp-c-divider-light);
    height: 30vh;
    padding: 0 24px 24px;
  }
  .vue-repl {
    width: 100%;
    height: calc(70vh - var(--vp-nav-height) - var(--vp-banner-height, 0px));
  }
  :deep(.wide) {
    display: none;
  }
  :deep(.narrow) {
    display: inline;
  }
}
</style>
