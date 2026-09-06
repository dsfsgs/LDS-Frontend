<template>
  <q-page class="event-page">
    <!-- =====================================================
         PAGE HEADER
    ====================================================== -->
    <section class="page-header">
      <div>
        <h5> Events</h5>
        <p>Nomination for employee</p>
      </div>
    </section>

    <!-- =====================================================
         EVENTS CARD LIST
    ====================================================== -->
    <q-card flat class="events-card">
      <!-- ===================================================
           FILTERS
      ==================================================== -->
      <div class="filter-section">
        <q-input
          v-model="search"
          outlined
          dense
          clearable
          placeholder="Search by event name, venue, or status..."
          class="search-input"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <div class="status-filters">
          <q-checkbox
            v-for="option in STATUS_OPTIONS"
            :key="option.value"
            v-model="selectedStatuses"
            :val="option.value"
            :label="option.label"
            dense
            class="status-checkbox"
          />
        </div>

        <q-btn
          flat
          no-caps
          icon="filter_alt_off"
          label="Clear"
          class="clear-btn"
          @click="clearFilters"
        />
      </div>

      <!-- ===================================================
           LOADING STATE
      ==================================================== -->
      <div v-if="officeEventStore.loading" class="loading-state">
        Loading events...
      </div>

      <!-- ===================================================
           CARD LIST (job-listing style)
      ==================================================== -->
      <div v-else class="event-list">
        <q-card
          v-for="event in filteredRows"
          :key="event.scheduleId"
          flat
          bordered
          class="event-card"
          @click="goToEvent(event.event_id)"
        >
          <div class="card-top">
            <div class="event-title">{{ event.title_name }}</div>
            <span
              class="status-badge"
              :class="'status-' + event.computedStatus"
            >
              {{ event.computedStatus }}
            </span>
          </div>

          <!-- <div class="event-sub">Created {{ event.created_at }}</div> -->

          <div class="event-meta">
            <span>{{ event.venue }}</span>
            <span class="dot">•</span>
            <span>{{ event.mode_name }}</span>
            <span class="dot">•</span>
            <span>{{ event.fee }}</span>
            <span class="dot">•</span>
            <span>{{ event.dateRange }}</span>
          </div>

          <div class="tag-row">
            <span class="tag" v-if="event.type_name">{{ event.type_name }}</span>
            <span class="tag" v-if="event.category_name">{{ event.category_name }}</span>
          </div>

        
        </q-card>

      </div>


    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, computed, onMounted, ref } from "vue";

import { useOfficeEventStore } from "src/stores/office/event/eventStore";



export default defineComponent({
  name: "EventViewPage",

  setup() {
    const officeEventStore = useOfficeEventStore();

  
    const selectedStatuses = ref([]);
    const expandedIds = ref(new Set());

    // ---------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------
    function formatDateRange(dates) {
      if (!dates || !dates.length) return "—";
      if (dates.length === 1) return dates[0].schedule_date;
      return `${dates[0].schedule_date} – ${dates[dates.length - 1].schedule_date}`;
    }

    // ---------------------------------------------------------------
    // The API returns a FLAT array — one row per schedule, each with
    // its own nested `event` object. Rows can share the same event_id
    // (same event, different schedule) — but each is still its OWN
    // card, since the schedule details (dates, venue, fee, etc.)
    // differ per row.
    // ---------------------------------------------------------------
    const cardEvents = computed(() => {
      const rows = officeEventStore.officeEvents || [];

      return rows.map((row, index) => {
        const evt = row.event || {};

        return {
          no: index + 1,
          event_id: evt.event_id ?? row.event_id,
          scheduleId: row.scheduleId,
          title_name: evt.title_name || "—",
          created_at: evt.created_at || "—",

          venue: row.venue_name || "—",
          mode_name: row.mode_name || "—",
          fee: row.fee || "—",
          hours: row.hours || "—",
          qualifications: row.qualifications || "—",
          source_name: row.source_name || "—",
          conducted_by: row.conducted_by || "—",
          type_name: row.type_name || "—",
          category_name: row.category_name || "—",
          computedStatus: row.computedStatus || "—",

          dateRange: formatDateRange(row.schedule_date_time),
          offices: (row.office || []).map((o) => o.office_name),
        };
      });
    });

    // ---------------------------------------------------------------
    // Search + status filter
    // ---------------------------------------------------------------
    const filteredRows = computed(() => {
      const term = search.value?.toLowerCase().trim();

      return cardEvents.value.filter((row) => {
        const matchesStatus =
          !selectedStatuses.value.length ||
          selectedStatuses.value.includes(row.computedStatus);

        if (!matchesStatus) return false;
        if (!term) return true;

        return [row.title_name, row.venue, row.computedStatus, row.type_name]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(term));
      });
    });

    const totalCount = computed(() => cardEvents.value.length);

    function clearFilters() {
      search.value = "";
      selectedStatuses.value = [];
    }

    // ---------------------------------------------------------------
    // Expand / collapse "See More"
    // ---------------------------------------------------------------
    function toggleExpand(eventId) {
      const next = new Set(expandedIds.value);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      expandedIds.value = next;
    }

    function isExpanded(eventId) {
      return expandedIds.value.has(eventId);
    }

    // ---------------------------------------------------------------
    // Navigation — adjust route name/params to match your router
    // ---------------------------------------------------------------
    function goToEvent(eventId) {
      // Example:
      // router.push({ name: "event-details", params: { id: eventId } });
      console.log("go to event", eventId);
    }

    onMounted(() => {
      officeEventStore.fetchOfficeEvents();
    });

    return {
      officeEventStore,

      search,
      selectedStatuses,
      STATUS_OPTIONS,
      filteredRows,
      totalCount,
      clearFilters,

      toggleExpand,
      isExpanded,
      goToEvent,
    };
  },
});
</script>

<style scoped>
/* =========================================================
   PAGE
========================================================= */

.event-page {
  min-height: 100%;
  padding: 20px;
  color: #19354a;
}

/* =========================================================
   PAGE HEADER
========================================================= */

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.page-header h5 {
  margin: 5px 0 3px;
  color: #19354a;
  font-size: 18px;
  font-weight: 750;
}

.page-header p {
  margin: 0;
  color: #718089;
  font-size: 12px;
}

/* =========================================================
   EVENTS CARD (container)
========================================================= */

.events-card {
  overflow: hidden;
  border-radius: 13px;
  background: #ffffff;
  box-shadow: 0 3px 12px rgba(30, 70, 42, 0.055);
}

/* =========================================================
   FILTERS
========================================================= */

.filter-section {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 20px;
  border-bottom: 1px solid #edf1ef;
  background: #fcfdfc;
}

.search-input {
  flex: 1;
  max-width: 380px;
}

.search-input :deep(.q-field__control) {
  min-height: 38px;
  border-radius: 8px;
}

.search-input :deep(.q-field__native) {
  font-size: 11px;
}

.search-input :deep(.q-field__prepend) {
  color: #809097;
}

.clear-btn {
  color: #6f8087;
  font-size: 10px;
}

/* =========================================================
   STATUS CHECKBOX FILTERS
========================================================= */

.status-filters {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.status-checkbox :deep(.q-checkbox__label) {
  color: #425b68;
  font-size: 11px;
}

/* =========================================================
   LOADING / EMPTY
========================================================= */

.loading-state,
.table-empty {
  padding: 30px 0;
  text-align: center;
  color: #8a989e;
  font-size: 12px;
}

/* =========================================================
   EVENT LIST / CARDS  (job-listing style)
========================================================= */

.event-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 20px;
}

.event-card {
  padding: 16px 18px;
  border: 1px solid #edf1ef;
  border-radius: 10px;
  cursor: pointer;
  transition: box-shadow 0.15s ease, border-color 0.15s ease;
}

.event-card:hover {
  border-color: #d7e6da;
  box-shadow: 0 4px 14px rgba(30, 70, 42, 0.07);
}

.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.event-title {
  color: #19354a;
  font-size: 14px;
  font-weight: 750;
  line-height: 1.35;
}

.event-sub {
  margin-top: 4px;
  color: #8a989e;
  font-size: 10.5px;
  font-style: italic;
}

.event-meta {
  margin-top: 8px;
  color: #425b68;
  font-size: 11.5px;
}

.event-meta .dot {
  margin: 0 6px;
  color: #c3ccd0;
}

/* =========================================================
   TAGS
========================================================= */

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.tag {
  padding: 4px 10px;
  border-radius: 6px;
  background: #f1f4f2;
  color: #46595f;
  font-size: 10px;
  font-weight: 600;
}

/* =========================================================
   CARD ACTIONS
========================================================= */

.card-actions {
  margin-top: 8px;
}

.see-more {
  color: #2b6cb0;
  font-size: 11px;
  font-weight: 650;
  cursor: pointer;
}

.see-more:hover {
  text-decoration: underline;
}

/* =========================================================
   EXPANDED SCHEDULE LIST
========================================================= */

.schedule-list {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #e3e9e6;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.schedule-item {
  padding: 10px 12px;
  border-radius: 8px;
  background: #fafcfa;
}

.schedule-line {
  color: #19354a;
  font-size: 11.5px;
}

.schedule-sub {
  margin-top: 4px;
  color: #718089;
  font-size: 10.5px;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.schedule-office {
  margin-top: 4px;
  color: #8a989e;
  font-size: 10px;
}

/* =========================================================
   STATUS BADGE
========================================================= */

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.2px;
  text-transform: uppercase;
  white-space: nowrap;
}

.status-badge.small {
  padding: 2px 8px;
  font-size: 8px;
}

.status-created {
  color: #2b6cb0;
  background: #e7f0fb;
}

.status-up-coming {
  color: #b8860b;
  background: #fbf3df;
}

.status-ongoing {
  color: #087c42;
  background: #e1f7e7;
}

.status-completed {
  color: #5c6b73;
  background: #eef1f2;
}

.status-cancelled {
  color: #c73f3f;
  background: #fbe9e9;
}

/* =========================================================
   TABLE FOOTER
========================================================= */

.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 20px;
  border-top: 1px solid #edf1ef;
  color: #87949a;
  font-size: 10px;
}

.table-footer strong {
  color: #405967;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 900px) {
  .filter-section {
    flex-wrap: wrap;
  }

  .search-input {
    max-width: none;
    width: 100%;
    flex-basis: 100%;
  }
}

@media (max-width: 650px) {
  .event-page {
    padding: 14px;
  }

  .page-header {
    align-items: flex-start;
    gap: 15px;
    flex-direction: column;
  }
}
</style>