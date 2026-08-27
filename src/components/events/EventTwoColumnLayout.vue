<template>
  <div class="event-two-column-layout">
    <q-card flat bordered class="event-card left-card">
      <slot name="left" />
    </q-card>

    <q-card flat bordered class="event-card right-card">
      <slot name="right" />
    </q-card>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "EventTwoColumnLayout",
});
</script>

<style scoped>
.event-two-column-layout {
  display: grid;

  grid-template-columns: 346px minmax(0, 1fr);

  gap: 12px;

  align-items: stretch;
}

.event-card {
  border: 2px solid #f0f1f5;

  border-radius: 0;

  background: #ffffff;

  box-shadow: none;
}

.left-card {
  min-height: 680px;

  padding: 20px 22px;
}

.right-card {
  min-height: 680px;

  padding: 20px 20px;
}

@media (max-width: 1000px) {
  .event-two-column-layout {
    grid-template-columns: 1fr;
  }

  .left-card,
  .right-card {
    min-height: auto;
  }
}
</style>