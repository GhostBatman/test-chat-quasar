<template>
  <q-toolbar class="bg-primary text-white">
    <q-btn
      v-if="!isLargeScreen"
      flat round dense icon="arrow_back"
      @click="$emit('closeChat')"
    />
    <q-toolbar-title>{{ contact }}</q-toolbar-title>
  </q-toolbar>
  <div class="full-width full-height flex column">
    <div class="q-pa-md q-gutter-y-md col-grow flex column justify-end">
      <q-chat-message
        v-for="({message, sent}, index) in messages"
        :key="index"
        :text="[message]"
        :sent="sent"
      />
    </div>
    <q-separator />
    <div class="q-pa-md row full-width">
      <q-input
        v-model="newMessage"
        outlined dense
        @keyup.enter="sendMessage"
        class="col q-mr-md"
      />
      <q-btn
        round
        color="secondary"
        icon="send"
        @click="sendMessage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import {useQuasar} from 'quasar';
import type {IMessage} from 'src/types';

const props = defineProps<{ contact: string | null, messages: IMessage[] }>();
const emit = defineEmits(['closeChat', 'newMessage']);
const newMessage = ref('');
const $q = useQuasar();
const isLargeScreen = computed(() => $q.screen.gt.sm);

function sendMessage() {
  emit('newMessage', {from: props.contact, message: newMessage.value});
  newMessage.value = '';
}
</script>
<style lang="scss" scoped>
.scroll-area {
  flex-grow: 1;
}
</style>
