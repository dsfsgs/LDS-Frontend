<template>
  <q-page class="reports-page">
    <section class="page-header">
      <h5>Reports</h5>
      <p>View learning and development reports.</p>
    </section>

    <q-card flat bordered class="reports-card">
      <q-icon name="bar_chart" size="42px" color="green-7" />
      <div class="reports-title">Reports module</div>
      <div class="reports-description">
        Select or generate a report from the available report tools.
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ReportsPage",
});
</script>

<style scoped>
.reports-page {
  padding: 24px;
}

.page-header h5 {
  margin: 0;
  color: #172b3a;
}

.page-header p {
  margin: 6px 0 20px;
  color: #6b7a83;
}

.reports-card {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-align: center;
}

.reports-title {
  font-weight: 700;
  color: #172b3a;
}

.reports-description {
  color: #6b7a83;
  font-size: 13px;
}
</style>
