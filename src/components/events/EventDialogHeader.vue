<template>
  <q-card-section class="event-dialog-header">
    <div>
      <div class="dialog-title">{{ title }}</div>
      <div v-if="subtitle" class="dialog-subtitle">{{ subtitle }}</div>
    </div>

    <q-btn flat round dense icon="close" v-close-popup />
  </q-card-section>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "EventDialogHeader",

  props: {
    title: {
      type: String,
      required: true,
    },

    subtitle: {
      type: String,
      default: "",
    },
  },
});
</script>

<style scoped>
.event-dialog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  padding: 17px 19px;
}

.dialog-title {
  color: #222222;

  font-size: 15px;
  font-weight: 700;
}

.dialog-subtitle {
  margin-top: 3px;

  color: #999999;

  font-size: 10px;
}
</style>
