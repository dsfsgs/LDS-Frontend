<template>
  <q-page class="event-view-page">
    <!-- =========================================================
         LOADING
    ========================================================== -->
    <div v-if="eventStore.loading && !event" class="state-message">
      <q-spinner-dots size="32px" />
      <span>Loading event...</span>
    </div>

    <!-- =========================================================
         NOT FOUND
    ========================================================== -->
    <div v-else-if="!event" class="state-message">
      <q-icon name="event_busy" size="40px" />
      <div>Event not found.</div>
      <q-btn
        flat
        no-caps
        label="Back to Events"
        class="back-link"
        @click="goBack"
      />
    </div>

    <!-- =========================================================
         EVENT PAGE
    ========================================================== -->
    <template v-else>
      <!-- =======================================================
           PAGE HEADER
      ======================================================== -->
      <section class="page-header">
        <div class="header-left">
          <q-btn
            flat
            round
            dense
            icon="arrow_back"
            class="back-btn"
            @click="goBack"
          />
          <div>
            <h5>Event Information</h5>
            <div class="header-subtitle">
              {{ event.title_name || "Untitled Event" }}
            </div>
          </div>
        </div>
      </section>

      <!-- =======================================================
           MAIN TWO-COLUMN CONTENT
      ======================================================== -->
      <div class="event-layout">
        <!-- =====================================================
             LEFT: EVENT INFORMATION
        ====================================================== -->
        <q-card flat bordered class="event-info-card">
          <div class="section-title">Event</div>

          <!-- TITLE -->
          <div class="field-group">
            <div class="field-label">Title</div>
            <q-input
              v-model="event.title_name"
              outlined
              dense
              readonly
              class="field-input"
            />
          </div>

          <!-- TYPE -->
          <div class="field-group">
            <div class="field-label">Type</div>
            <q-input
              v-model="event.type_name"
              outlined
              dense
              readonly
              class="field-input"
            />
          </div>

          <!-- SOURCE -->
          <div class="field-group">
            <div class="field-label">Source</div>
            <q-input
              v-model="event.source_name"
              outlined
              dense
              readonly
              class="field-input"
            />
          </div>

          <!-- ===================================================
               ADDITIONAL EVENT INFORMATION
          ==================================================== -->
          <div class="event-meta-grid">
            <div class="meta-item">
              <div class="meta-label">Hours</div>
              <q-input
                v-model="event.hours"
                outlined
                dense
                readonly
                class="meta-input"
              />
            </div>

            <div class="meta-item">
              <div class="meta-label">Fee</div>
              <q-input
                v-model="event.fee"
                outlined
                dense
                readonly
                class="meta-input"
              />
            </div>
          </div>

          <!-- QUALIFICATIONS -->
          <div class="field-group">
            <div class="field-label">Qualifications</div>
            <q-input
              v-model="event.qualifications"
              outlined
              dense
              readonly
              class="field-input"
            />
          </div>

          <!-- ===================================================
               FORMS
          ==================================================== -->
          <div class="section-divider"></div>

          <div class="section-title forms-title">Forms</div>

          <div v-if="event.form && event.form.length" class="forms-list">
            <q-radio
              v-for="form in event.form"
              :key="form.formId"
              v-model="selectedForm"
              :val="form.formId"
              :label="form.form_name"
              color="green"
              size="sm"
            />
          </div>

          <div v-else class="empty-section">No forms assigned.</div>

          <!-- ===================================================
               OPTIONAL ASSESSMENTS
          ==================================================== -->
          <template v-if="event.assessments && event.assessments.length">
            <div class="section-divider"></div>
            <div class="section-title subsection-title">Assessment</div>
            <div class="assessment-list">
              <div
                v-for="assessment in event.assessments"
                :key="assessment.id || assessment.assessmentId"
                class="assessment-item"
              >
                {{ assessment.name || assessment.title }}
              </div>
            </div>
          </template>

          <!-- ===================================================
               OPTIONAL CERTIFICATE
          ==================================================== -->
          <template v-if="event.certificate">
            <div class="section-divider"></div>
            <div class="section-title subsection-title">Certificate</div>
            <q-input
              :model-value="
                event.certificate.name ||
                event.certificate.title ||
                event.certificate
              "
              outlined
              dense
              readonly
              class="field-input"
            />
          </template>

          <!-- CREATED -->
          <div class="created-info">
            <span>Created</span>
            <strong>{{ event.created_at || "—" }}</strong>
          </div>
        </q-card>

        <!-- =====================================================
             RIGHT: SCHEDULES
        ====================================================== -->
        <q-card flat bordered class="schedule-card">
          <!-- HEADER -->
          <div class="schedule-header">
            <div class="schedule-title">Schedules</div>
            <q-btn
              outline
              no-caps
              icon="calendar_month"
              label="Add Schedule"
              class="add-schedule-btn"
              @click="openAddSchedule"
            />
          </div>

          <!-- TABLE HEADER -->
          <div class="schedule-table-header">
            <div class="schedule-date-column">Date</div>
            <div class="schedule-time-column">Time</div>
            <div class="schedule-action-column">Action</div>
          </div>

          <!-- ===================================================
               SCHEDULE ROWS
          ==================================================== -->
          <div v-if="flattenedSchedules.length" class="schedule-list">
            <div
              v-for="item in flattenedSchedules"
              :key="item.uniqueKey"
              class="schedule-row"
            >
              <!-- DATE -->
              <div class="schedule-date-column schedule-date">
                <q-icon name="calendar_today" size="15px" />
                <span>{{ item.schedule_date }}</span>
              </div>

              <!-- TIME -->
              <div class="schedule-time-column schedule-time">
                <div
                  v-if="item.morning_in || item.morning_out"
                  class="time-line"
                >
                  <span class="time-label">Morning</span>
                  <span>
                    {{ item.morning_in || "—" }}
                    -
                    {{ item.morning_out || "—" }}
                  </span>
                </div>

                <div
                  v-if="item.afternoon_in || item.afternoon_out"
                  class="time-line"
                >
                  <span class="time-label">Afternoon</span>
                  <span>
                    {{ item.afternoon_in || "—" }}
                    -
                    {{ item.afternoon_out || "—" }}
                  </span>
                </div>

                <span
                  v-if="
                    !item.morning_in &&
                    !item.morning_out &&
                    !item.afternoon_in &&
                    !item.afternoon_out
                  "
                  class="no-time"
                >
                  Time not set
                </span>
              </div>

              <!-- ACTION -->
              <div class="schedule-action-column schedule-actions">
                <q-btn
                  flat
                  round
                  dense
                  icon="edit"
                  class="action-btn"
                  @click="editSchedule(item)"
                >
                  <q-tooltip>Edit Schedule</q-tooltip>
                </q-btn>

                <q-btn
                  flat
                  round
                  dense
                  icon="delete_outline"
                  class="action-btn delete-action"
                  @click="deleteSchedule(item)"
                >
                  <q-tooltip>Delete Schedule</q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>

          <!-- ===================================================
               EMPTY SCHEDULE
          ==================================================== -->
          <div v-else class="schedule-empty">
            <q-icon name="event_busy" size="34px" />
            <div class="empty-title">No schedules yet</div>
            <div class="empty-description">Add a schedule for this event.</div>
            <q-btn
              flat
              no-caps
              label="Add Schedule"
              icon="add"
              class="empty-add-btn"
              @click="openAddSchedule"
            />
          </div>
        </q-card>
      </div>
    </template>

    <!-- =========================================================
         ADD / EDIT SCHEDULE DIALOG
    ========================================================== -->
    <q-dialog v-model="showScheduleDialog">
      <q-card class="schedule-dialog">
        <!-- HEADER -->
        <q-card-section class="dialog-header">
          <div>
            <div class="dialog-title">
              {{ editingSchedule ? "Edit Schedule" : "Add Schedule" }}
            </div>
            <div class="dialog-subtitle">
              {{ event?.title_name }}
            </div>
          </div>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-separator />

        <!-- ERROR -->
        <q-banner
          v-if="eventStore.error"
          dense
          class="bg-red-1 text-red-8 q-ma-md"
        >
          {{ eventStore.error }}
        </q-banner>

        <!-- BODY -->
        <q-card-section class="dialog-body">
          <!-- VENUE -->
          <q-input
            v-model="scheduleForm.venue_name"
            outlined
            dense
            label="Venue"
            class="dialog-field"
          />

          <!-- MODE -->
          <q-input
            v-model="scheduleForm.mode_name"
            outlined
            dense
            label="Mode"
            class="dialog-field"
          />

          <!-- STATUS -->
          <q-select
            v-model="scheduleForm.status"
            outlined
            dense
            emit-value
            map-options
            label="Status"
            :options="statusOptions"
            class="dialog-field"
          />

          <!-- DATE -->
          <q-input
            v-model="scheduleForm.schedule_date"
            outlined
            dense
            label="Schedule Date"
            placeholder="August 20, 2026"
            class="dialog-field"
          />

          <!-- MORNING -->
          <div class="time-section">
            <div class="time-section-title">Morning</div>
            <div class="time-grid">
              <q-input
                v-model="scheduleForm.morning_in"
                outlined
                dense
                label="Time In"
                placeholder="08:00 AM"
              />
              <q-input
                v-model="scheduleForm.morning_out"
                outlined
                dense
                label="Time Out"
                placeholder="12:00 PM"
              />
            </div>
          </div>

          <!-- AFTERNOON -->
          <div class="time-section">
            <div class="time-section-title">Afternoon</div>
            <div class="time-grid">
              <q-input
                v-model="scheduleForm.afternoon_in"
                outlined
                dense
                label="Time In"
                placeholder="01:00 PM"
              />
              <q-input
                v-model="scheduleForm.afternoon_out"
                outlined
                dense
                label="Time Out"
                placeholder="05:00 PM"
              />
            </div>
          </div>
        </q-card-section>

        <!-- ACTIONS -->
        <q-card-actions align="right" class="dialog-actions">
          <q-btn flat no-caps label="Cancel" class="cancel-btn" v-close-popup />
          <q-btn
            unelevated
            no-caps
            :label="editingSchedule ? 'Save Changes' : 'Add Schedule'"
            class="save-btn"
            :loading="eventStore.loading"
            @click="saveSchedule"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useEventStore } from "stores/eventStore";

export default defineComponent({
  name: "EventViewPage",

  props: {
    id: {
      type: [String, Number],
      default: null,
    },
  },

  setup(props) {
    const $q = useQuasar();
    const route = useRoute();
    const router = useRouter();
    const eventStore = useEventStore();

    // =========================================================
    // EVENT ID
    // =========================================================
    const eventId = computed(() => {
      return props.id ?? route.query.id ?? route.params.id;
    });

    // =========================================================
    // EVENT
    // =========================================================
    const event = computed(() => {
      return eventStore.selectedEvent;
    });

    // =========================================================
    // FORM SELECTION
    // =========================================================
    const selectedForm = ref(null);

    // =========================================================
    // STATUS
    // =========================================================
    const statusOptions = [
      { label: "Created", value: "Created" },
      { label: "Ongoing", value: "Ongoing" },
      { label: "Completed", value: "Completed" },
      { label: "Cancelled", value: "Cancelled" },
    ];

    // =========================================================
    // FLATTEN SCHEDULE DATA
    // =========================================================
    const flattenedSchedules = computed(() => {
      const schedules = event.value?.schedule || [];

      return schedules.flatMap((schedule) => {
        const dates = schedule.schedule_date_time || [];

        if (!dates.length) {
          return [
            {
              uniqueKey: `${schedule.scheduleId}-empty`,
              scheduleId: schedule.scheduleId,
              event_schedule_id: schedule.scheduleId,
              venue_name: schedule.venue_name || "—",
              mode_name: schedule.mode_name || null,
              status: schedule.status || "Created",
              schedule_date: "—",
              morning_in: null,
              morning_out: null,
              afternoon_in: null,
              afternoon_out: null,
            },
          ];
        }

        return dates.map((date) => ({
          uniqueKey: `${schedule.scheduleId}-${date.id}`,
          scheduleId: schedule.scheduleId,
          event_schedule_id: schedule.scheduleId,
          venue_name: schedule.venue_name || "—",
          mode_name: schedule.mode_name || null,
          status: schedule.status || "Created",
          id: date.id,
          schedule_date: date.schedule_date || "—",
          morning_in: date.morning_in || null,
          morning_out: date.morning_out || null,
          afternoon_in: date.afternoon_in || null,
          afternoon_out: date.afternoon_out || null,
        }));
      });
    });

    // =========================================================
    // DIALOG
    // =========================================================
    const showScheduleDialog = ref(false);
    const editingSchedule = ref(false);
    const editingScheduleId = ref(null);

    // =========================================================
    // EMPTY FORM
    // =========================================================
    const emptyScheduleForm = () => ({
      venue_name: "",
      mode_name: "",
      status: "Created",
      schedule_date: "",
      morning_in: "08:00 AM",
      morning_out: "12:00 PM",
      afternoon_in: "01:00 PM",
      afternoon_out: "05:00 PM",
    });

    const scheduleForm = ref(emptyScheduleForm());

    // =========================================================
    // OPEN ADD
    // =========================================================
    function openAddSchedule() {
      editingSchedule.value = false;
      editingScheduleId.value = null;
      scheduleForm.value = emptyScheduleForm();
      eventStore.clearError();
      showScheduleDialog.value = true;
    }

    // =========================================================
    // EDIT
    // =========================================================
    function editSchedule(item) {
      editingSchedule.value = true;
      editingScheduleId.value = item.scheduleId;
      scheduleForm.value = {
        venue_name: item.venue_name === "—" ? "" : item.venue_name,
        mode_name: item.mode_name || "",
        status: item.status || "Created",
        schedule_date: item.schedule_date === "—" ? "" : item.schedule_date,
        morning_in: item.morning_in || "",
        morning_out: item.morning_out || "",
        afternoon_in: item.afternoon_in || "",
        afternoon_out: item.afternoon_out || "",
      };
      eventStore.clearError();
      showScheduleDialog.value = true;
    }

    // =========================================================
    // SAVE
    // =========================================================
    async function saveSchedule() {
      eventStore.clearError();

      if (!scheduleForm.value.schedule_date) {
        $q.notify({
          type: "warning",
          message: "Please enter a schedule date.",
          position: "top",
        });
        return;
      }

      const result = await eventStore.addSchedule(
        eventId.value,
        scheduleForm.value
      );

      if (result?.success) {
        showScheduleDialog.value = false;
        $q.notify({
          type: "positive",
          message: result.message || "Schedule saved successfully.",
          position: "top",
        });
        await eventStore.fetchEventById(eventId.value);
      } else {
        $q.notify({
          type: "negative",
          message: result?.message || "Unable to save schedule.",
          position: "top",
        });
      }
    }

    // =========================================================
    // DELETE
    // =========================================================
    function deleteSchedule(item) {
      $q.dialog({
        title: "Delete Schedule",
        message: "Are you sure you want to delete this schedule?",
        cancel: true,
        persistent: true,
        ok: {
          label: "Delete",
          color: "negative",
          unelevated: true,
          noCaps: true,
        },
      }).onOk(async () => {
        $q.notify({
          type: "info",
          message: "Connect your deleteSchedule API method here.",
          position: "top",
        });
      });
    }

    // =========================================================
    // BACK
    // =========================================================
    function goBack() {
      router.back();
    }

    // =========================================================
    // FETCH EVENT
    // =========================================================
    onMounted(async () => {
      if (!eventId.value) return;

      await eventStore.fetchEventById(eventId.value);

      if (eventStore.selectedEvent?.form?.length) {
        selectedForm.value = eventStore.selectedEvent.form[0].formId;
      }
    });

    // =========================================================
    // RETURN
    // =========================================================
    return {
      eventStore,
      event,
      eventId,
      selectedForm,
      flattenedSchedules,
      statusOptions,
      showScheduleDialog,
      editingSchedule,
      scheduleForm,
      openAddSchedule,
      editSchedule,
      deleteSchedule,
      saveSchedule,
      goBack,
    };
  },
});
</script>

<style scoped>
/* =========================================================
   PAGE
========================================================= */
.event-view-page {
  min-height: 100%;
  padding: 32px 20px 40px;
  color: #171717;
  background: #ffffff;
}

/* =========================================================
   STATE
========================================================= */
.state-message {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #8a8a8a;
  font-size: 13px;
  text-align: center;
}

.back-link {
  margin-top: 5px;
  color: #16b94a;
  font-size: 12px;
}

/* =========================================================
   PAGE HEADER
========================================================= */
.page-header {
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

.page-header h5 {
  margin: 0;
  color: #0b0b0b;
  font-size: 16px;
  font-weight: 650;
}

.header-subtitle {
  margin-top: 3px;
  color: #8b8b8b;
  font-size: 11px;
}

/* =========================================================
   MAIN LAYOUT
========================================================= */
.event-layout {
  display: grid;
  grid-template-columns: 346px minmax(0, 1fr);
  gap: 12px;
  align-items: stretch;
}

/* =========================================================
   CARDS
========================================================= */
.event-info-card,
.schedule-card {
  border: 2px solid #f0f1f5;
  border-radius: 0;
  background: #ffffff;
  box-shadow: none;
}

/* =========================================================
   LEFT EVENT INFORMATION
========================================================= */
.event-info-card {
  min-height: 680px;
  padding: 20px 22px;
}

.section-title {
  margin-bottom: 14px;
  color: #222222;
  font-size: 13px;
  font-weight: 650;
}

.forms-title {
  margin-bottom: 10px;
}

/* =========================================================
   EVENT FIELDS
========================================================= */
.field-group {
  margin-bottom: 12px;
}

.field-label {
  margin-bottom: 6px;
  color: #262626;
  font-size: 12px;
  font-weight: 600;
}

.field-input :deep(.q-field__control) {
  border-radius: 7px;
  background: #f8f9fa;
}

.field-input :deep(.q-field__native) {
  color: #333333;
  font-size: 12px;
}

/* =========================================================
   HOURS / FEE
========================================================= */
.event-meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  color: #5c5c5c;
  font-size: 11px;
  font-weight: 600;
}

.meta-input :deep(.q-field__control) {
  border-radius: 7px;
  background: #f8f9fa;
}

.meta-input :deep(.q-field__native) {
  color: #333333;
  font-size: 11px;
}

/* =========================================================
   DIVIDER
========================================================= */
.section-divider {
  height: 1px;
  margin: 15px 0 11px;
  background: #cfcfcf;
}

/* =========================================================
   FORMS
========================================================= */
.forms-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.forms-list :deep(.q-radio) {
  min-height: 30px;
}

.forms-list :deep(.q-radio__label) {
  color: #373737;
  font-size: 11px;
}

.forms-list :deep(.q-radio__inner) {
  font-size: 32px;
}

/* =========================================================
   OPTIONAL ASSESSMENTS
========================================================= */
.subsection-title {
  margin-top: 16px;
  margin-bottom: 7px;
}

.assessment-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.assessment-item {
  min-height: 31px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  border: 1px solid #999999;
  border-radius: 7px;
  color: #333333;
  font-size: 11px;
  background: #f8f9fa;
}

/* =========================================================
   EMPTY
========================================================= */
.empty-section {
  color: #999999;
  font-size: 11px;
}

/* =========================================================
   CREATED
========================================================= */
.created-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: 20px;
  color: #888888;
  font-size: 10px;
}

.created-info strong {
  color: #444444;
  font-size: 11px;
}

/* =========================================================
   SCHEDULE CARD
========================================================= */
.schedule-card {
  min-height: 680px;
  padding: 18px 20px;
}

/* =========================================================
   SCHEDULE HEADER
========================================================= */
.schedule-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
}

.schedule-title {
  color: #222222;
  font-size: 14px;
  font-weight: 650;
}

.add-schedule-btn {
  min-height: 40px;
  padding: 0 15px;
  border: 1px solid #d5d5d5;
  border-radius: 10px;
  color: #18b94b;
  font-size: 11px;
  background: #ffffff;
}

/* =========================================================
   TABLE HEADER
========================================================= */
.schedule-table-header,
.schedule-row {
  display: grid;
  grid-template-columns: minmax(180px, 1.2fr) minmax(280px, 2fr) 80px;
  align-items: center;
}

.schedule-table-header {
  min-height: 30px;
  padding: 0 12px;
  border-bottom: 1px solid #cfcfcf;
  color: #999999;
  font-size: 10px;
}

.schedule-date-column {
  min-width: 0;
}

.schedule-time-column {
  min-width: 0;
}

.schedule-action-column {
  text-align: center;
}

/* =========================================================
   SCHEDULE ROW
========================================================= */
.schedule-row {
  min-height: 62px;
  padding: 8px 12px;
  border-bottom: 1px solid #eeeeee;
}

.schedule-row:hover {
  background: #fbfdfb;
}

/* =========================================================
   DATE
========================================================= */
.schedule-date {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333333;
  font-size: 11px;
}

.schedule-date .q-icon {
  color: #222222;
}

/* =========================================================
   TIME
========================================================= */
.schedule-time {
  display: flex;
  flex-direction: column;
  gap: 3px;
  color: #333333;
  font-size: 10px;
}

.time-line {
  display: flex;
  align-items: center;
  gap: 7px;
}

.time-label {
  min-width: 58px;
  color: #999999;
  font-size: 9px;
}

.no-time {
  color: #999999;
}

/* =========================================================
   ACTIONS
========================================================= */
.schedule-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.action-btn {
  color: #777777;
}

.action-btn:hover {
  color: #18b94b;
}

.delete-action:hover {
  color: #d83d3d;
}

/* =========================================================
   EMPTY SCHEDULE
========================================================= */
.schedule-empty {
  min-height: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999999;
  text-align: center;
}

.schedule-empty .q-icon {
  margin-bottom: 8px;
}

.empty-title {
  color: #555555;
  font-size: 13px;
  font-weight: 600;
}

.empty-description {
  margin-top: 3px;
  font-size: 10px;
}

.empty-add-btn {
  margin-top: 10px;
  color: #18b94b;
  font-size: 11px;
}

/* =========================================================
   DIALOG
========================================================= */
.schedule-dialog {
  width: 520px;
  max-width: 92vw;
  border-radius: 13px;
}

.dialog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 18px 20px;
}

.dialog-title {
  color: #222222;
  font-size: 16px;
  font-weight: 700;
}

.dialog-subtitle {
  margin-top: 3px;
  color: #999999;
  font-size: 10px;
}

.dialog-body {
  padding: 18px 20px;
}

.dialog-field {
  margin-bottom: 12px;
}

.dialog-field :deep(.q-field__control) {
  border-radius: 8px;
}

.dialog-field :deep(.q-field__native),
.dialog-field :deep(.q-field__label) {
  font-size: 11px;
}

/* =========================================================
   TIME SECTION
========================================================= */
.time-section {
  margin-top: 15px;
}

.time-section-title {
  margin-bottom: 7px;
  color: #333333;
  font-size: 11px;
  font-weight: 650;
}

.time-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.time-grid :deep(.q-field__control) {
  border-radius: 8px;
}

.time-grid :deep(.q-field__native),
.time-grid :deep(.q-field__label) {
  font-size: 11px;
}

/* =========================================================
   DIALOG ACTIONS
========================================================= */
.dialog-actions {
  padding: 11px 20px;
  background: #fafafa;
}

.cancel-btn {
  color: #777777;
  font-size: 11px;
}

.save-btn {
  min-height: 36px;
  padding: 0 18px;
  border-radius: 8px;
  color: #ffffff;
  background: #18b94b;
  font-size: 11px;
}

.save-btn:deep(.q-btn__content) {
  font-weight: 500;
}

/* =========================================================
   RESPONSIVE
========================================================= */
@media (max-width: 900px) {
  .event-layout {
    grid-template-columns: 1fr;
  }

  .event-info-card,
  .schedule-card {
    min-height: auto;
  }

  .schedule-card {
    min-height: 500px;
  }
}

@media (max-width: 650px) {
  .event-view-page {
    padding: 18px 12px 30px;
  }

  .event-info-card,
  .schedule-card {
    padding: 16px;
  }

  .event-meta-grid {
    grid-template-columns: 1fr;
  }

  .schedule-table-header,
  .schedule-row {
    grid-template-columns: 1fr 1fr 55px;
  }

  .schedule-table-header {
    padding: 0 6px;
  }

  .schedule-row {
    padding: 8px 6px;
  }

  .time-line {
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
  }

  .time-label {
    min-width: auto;
  }

  .schedule-date {
    font-size: 10px;
  }

  .schedule-time {
    font-size: 9px;
  }

  .schedule-header {
    align-items: flex-start;
    gap: 10px;
  }

  .add-schedule-btn {
    padding: 0 10px;
  }

  .time-grid {
    grid-template-columns: 1fr;
  }
}
</style>
