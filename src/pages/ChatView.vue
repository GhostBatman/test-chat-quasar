<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="row fit">
        <div v-if="isLargeScreen || !selectedContact" class="contacts">
          <ContactsList @select="selectContact" :contacts="contactsMap" />
        </div>
        <div v-if="selectedContact || isLargeScreen" class="chat">
          <ChatDialog
            :contact="selectedContact"
            :messages="messages"
            @closeChat="onCloseChat"
            @newMessage="handleChatMessage($event, true)"
          />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, onUnmounted} from 'vue';
import {useQuasar} from 'quasar';
import ContactsList from 'src/components/ContactsList.vue';
import ChatDialog from 'src/components/ChatDialog.vue';
import type {IChatMessage, IContact, IMessage} from 'src/types';

const $q = useQuasar();
const selectedContact = ref<string | null>(null);
const messages = ref<IMessage[]>([]);
const isLargeScreen = computed(() => $q.screen.gt.sm);

const contactsMap = ref(new Map<string, IContact>());
const messagesMap = ref(new Map<string, IMessage[]>());

function selectContact(contact: string) {
  selectedContact.value = contact;
  messages.value = messagesMap.value.get(contact) || [];

  const selfContact = contactsMap.value.get(contact);
  if (selfContact) {
    selfContact.count = 0;
  }
}

function handleChatMessage(newMessage: IChatMessage, sent = false) {
  const {from, message} = newMessage;

  if (!contactsMap.value.has(from)) {
    messagesMap.value.set(from, []);
    contactsMap.value.set(from, {count: 0, lastMessage: message});
  }

  messagesMap.value.get(from)?.push({message, sent});

  const contact = contactsMap.value.get(from);
  if (contact) {
    contact.lastMessage = message;
  }
  if (contact && from !== selectedContact.value) {
    contact.count += 1;
  }

}

function newWSMessage(event: MessageEvent<string>) {
  const data = JSON.parse(event.data);
  if ('message' in data) {
    handleChatMessage(data.message as IChatMessage);
  }
}

function onCloseChat() {
  selectedContact.value = null;
  messages.value = [];
}

const ws = ref<WebSocket | null>(null);

onMounted(() => {
  ws.value = new WebSocket('ws://localhost:8181/ws');
  ws.value.onmessage = newWSMessage;
});

onUnmounted(() => {
  if (ws.value) {
    ws.value.close();
    ws.value = null;
  }
});

</script>

<style scoped>
.contacts {
  width: 300px;
  border-right: 1px solid #ccc;
  flex-shrink: 0;
}

.chat {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
</style>
