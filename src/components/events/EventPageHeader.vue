<template>
  <section class="event-page-header">
    <div class="header-left">
      <q-btn
        flat
        round
        dense
        icon="arrow_back"
        class="back-btn"
        @click="$emit('back')"
      />

      <div>
        <h5>{{ title }}</h5>
        <div v-if="subtitle" class="header-subtitle">{{ subtitle }}</div>
      </div>
    </div>

    <div v-if="$slots.actions" class="header-actions">
      <slot name="actions" />
    </div>
  </section>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "EventPageHeader",

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

  emits: ["back"],
});
</script>

<style scoped>
.event-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 12px;
}

.header-left {
  display: flex;
  align-items: center;

  gap: 10px;
}

.back-btn {
  color: #202020;
}

.event-page-header h5 {
  margin: 0;

  color: #101044;

  font-size: 16px;
  font-weight: 650;
}

.header-subtitle {
  margin-top: 3px;

  color: #8b8b8b;

  font-size: 11px;
}

.header-actions {
  display: flex;
  align-items: center;

  gap: 10px;
}
</style>
