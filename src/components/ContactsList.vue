<template>
  <div class="full-height flex column">
    <q-toolbar class="bg-primary text-white">
      <q-toolbar-title>Contacts</q-toolbar-title>
    </q-toolbar>
    <q-scroll-area class="scroll-area">
      <q-list>
        <q-item
          v-for="[name, contact] in contactsToShow"
          :key="name"
          clickable
          v-ripple
          @click="$emit('select', name)"
        >
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">
              {{ name[0] }}
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ name }}</q-item-label>
            <q-item-label caption>{{ contact.lastMessage }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-badge rounded color="red" :label="contact.count" v-if="contact.count" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </div>
</template>

<script setup lang="ts">
import {computed, defineEmits} from 'vue';
import type {IContact} from 'src/types';

const props = defineProps<{ contacts: Map<string, IContact> }>();
defineEmits(['select']);
const contactsToShow = computed(() => {
  return Array.from(props.contacts).reverse()
})
</script>

<style lang="scss" scoped>
.scroll-area {
  height: calc(100vh - 70px);
}
</style>
