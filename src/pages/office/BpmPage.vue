<template>
    <q-page class="bpm-page">
        <!-- =====================================================
         LIST VIEW
    ====================================================== -->
        <template v-if="view === 'list'">
            <section class="page-header">
                <div>
                    <h5>BPM</h5>
                    <p>Record and monitor employee blood pressure readings.</p>
                </div>

                <q-btn unelevated no-caps icon="add" label="Add BPM" class="add-btn" @click="openAddDialog" />
            </section>

            <q-card flat class="bpm-card">
                <!-- YEAR + QUARTER + MONTH + WEEK FILTER -->
                <div class="filter-section">
                    <div class="filter-selects">
                        <q-select v-model="yearFilter" :options="yearFilterOptions" outlined dense clearable
                            label="Year" class="filter-select" />

                        <q-select v-model="quarter" :options="quarterOptions" emit-value map-options outlined dense
                            label="Quarter" class="filter-select" @update:model-value="monthFilter = null" />

                        <q-select v-model="monthFilter" :options="monthFilterOptions" emit-value map-options outlined
                            dense clearable label="Month" class="filter-select" />

                        <q-select v-model="weekFilter" :options="weekFilterOptions" emit-value map-options outlined
                            dense clearable label="Week" class="filter-select" />
                    </div>

                    <q-btn flat no-caps icon="filter_alt_off" label="Clear" class="clear-btn" @click="clearFilters" />
                </div>

                <!-- TABLE (server-side pagination) -->
                <div class="table-wrapper">
                    <q-table flat :rows="rows" :columns="columns" row-key="id"
                        v-model:pagination="tablePagination"
                        :rows-per-page-options="[10, 20, 50]"
                        :loading="loading"
                        class="app-table"
                        @request="onRequest">
                        <template #body-cell-actions="props">
                            <q-td :props="props">
                                <div class="action-buttons">
                                    <q-btn flat round dense icon="visibility" class="action-view"
                                        :loading="isViewLoading(props.row.id)"
                                        :disable="isAnyViewLoading() && !isViewLoading(props.row.id)"
                                        @click="openView(props.row)">
                                        <q-tooltip>View</q-tooltip>
                                    </q-btn>
                                    <q-btn flat round dense icon="edit" class="action-edit"
                                        :loading="isEditLoading(props.row.id)"
                                        :disable="isAnyEditLoading() && !isEditLoading(props.row.id)"
                                        @click="openEdit(props.row)">
                                        <q-tooltip>Edit</q-tooltip>
                                    </q-btn>
                                    <q-btn flat round dense icon="delete" class="action-delete"
                                        :loading="isDeleteLoading(props.row.id)"
                                        :disable="isAnyDeleteLoading() && !isDeleteLoading(props.row.id)"
                                        @click="deleteBpm(props.row)">
                                        <q-tooltip>Delete</q-tooltip>
                                    </q-btn>
                                </div>
                            </q-td>
                        </template>

                        <template #no-data>
                            <div class="app-table-empty">No BPM records found.</div>
                        </template>
                    </q-table>
                </div>
            </q-card>
        </template>

        <!-- =====================================================
         ADD (form) + EDIT (form) + VIEW (read-only): iisang q-table
    ====================================================== -->
        <template v-else>
            <section class="page-header">
                <div class="form-title-wrap">
                    <q-btn flat round dense icon="arrow_back" @click="backToList" />
                    <div>
                        <h5>{{ pageTitle }}</h5>
                        <p>{{ headerLabel }}</p>
                    </div>
                </div>

                <div class="form-header-actions">
                    <template v-if="isForm">
                        <q-btn flat no-caps label="Cancel" class="cancel-btn" @click="backToList" />
                        <q-btn unelevated no-caps icon="check" :label="isEdit ? 'Update' : 'Submit'" class="save-btn"
                            @click="openConfirm" />
                    </template>
                    <q-btn v-else flat no-caps icon="arrow_back" label="Back" class="cancel-btn" @click="backToList" />
                </div>
            </section>

            <q-card flat class="bpm-card">
                <q-table flat :rows="detailRows" :columns="detailColumns" row-key="id" hide-pagination
                    :rows-per-page-options="[0]" class="app-table bpm-qtable">
                    <template #body="props">
                        <!-- GROUP HEADER ROW -->
                        <q-tr v-if="props.row.groupStart" class="group-row">
                            <q-td :colspan="detailColumns.length">
                                {{ props.row.group }}
                                <span class="group-total">TOTAL: {{ props.row.groupTotal }} LISTED</span>
                            </q-td>
                        </q-tr>

                        <!-- EMPLOYEE ROW -->
                        <q-tr :props="props">
                            <q-td key="no" :props="props" class="col-no">{{ props.row.no }}</q-td>
                            <q-td key="name" :props="props"><strong>{{ props.row.name }}</strong></q-td>
                            <q-td key="office_abbr" :props="props" class="muted">{{ props.row.office_abbr }}</q-td>
                            <q-td key="designation" :props="props" class="muted">{{ props.row.designation }}</q-td>
                            <q-td key="sex" :props="props"><strong>{{ props.row.sex }}</strong></q-td>
                            <q-td key="age" :props="props" class="muted">{{ props.row.age }}</q-td>
                            <q-td key="history" :props="props">
                                <span class="history-chip" :class="{ 'history-none': props.row.history === 'NONE' }">
                                    {{ props.row.history }}
                                </span>
                            </q-td>
                            <q-td key="bp" :props="props" class="col-bp">
                                <!-- ADD / EDIT: input -->
                                <div v-if="isForm" class="bp-inputs">
                                    <input v-model="props.row.sys" type="number" min="0" max="300" placeholder=" "
                                        class="bp-input" :class="bpClass(props.row)" />
                                    <span>/</span>
                                    <input v-model="props.row.dia" type="number" min="0" max="200" placeholder=" "
                                        class="bp-input" :class="bpClass(props.row)" />
                                </div>

                                <!-- VIEW: read-only -->
                                <template v-else>
                                    <span v-if="isFilled(props.row.sys) && isFilled(props.row.dia)" class="bp-chip"
                                        :class="bpClass(props.row)">
                                        {{ props.row.sys }} / {{ props.row.dia }}
                                    </span>
                                    <span v-else class="bp-empty">—</span>
                                </template>
                            </q-td>
                        </q-tr>
                    </template>

                    <template #no-data>
                        <div class="app-table-empty">No employees found.</div>
                    </template>
                </q-table>

                <div v-if="!isForm" class="table-footer">
                    <span>
                        <strong>{{ viewSummary.withBp }}</strong> of
                        <strong>{{ viewSummary.total }}</strong> employees have BP recorded
                    </span>
                </div>
            </q-card>
        </template>

        <!-- =====================================================
         ADD BPM DIALOG (month + week picker)
    ====================================================== -->
        <q-dialog v-model="showAddDialog">
            <q-card class="bpm-dialog">
                <q-card-section class="dialog-header">
                    <div>
                        <div class="dialog-title">Add BPM</div>
                        <div class="dialog-sub">Select the month and week to record.</div>
                    </div>
                    <q-btn flat round dense icon="close" v-close-popup />
                </q-card-section>

                <q-separator />

                <q-card-section class="dialog-body">
                    <div class="section-label">Month</div>
                    <div class="form-grid">
                        <q-select v-model="addMonth" :options="monthOptions" emit-value map-options outlined dense
                            label="Month" @update:model-value="onPeriodChange" />
                        <q-select v-model="addYear" :options="yearOptions" outlined dense label="Year"
                            @update:model-value="onPeriodChange" />
                    </div>

                    <div class="section-label">Week</div>
                    <div class="week-grid">
                        <div v-for="w in weekOptions" :key="w.no" class="week-opt"
                            :class="{ 'week-opt--active': selectedWeek === w.no }" role="button" tabindex="0"
                            @click="selectedWeek = w.no" @keydown.enter="selectedWeek = w.no">
                            <div class="week-opt-name">Week {{ w.no }}</div>
                            <div class="week-opt-range">{{ w.start }} - {{ w.end }}</div>
                        </div>
                    </div>
                </q-card-section>

                <q-card-actions align="right" class="dialog-actions">
                    <q-btn flat no-caps label="Cancel" class="cancel-btn" v-close-popup />
                    <q-btn unelevated no-caps label="OK" class="save-btn" :disable="!selectedWeek" :loading="loading"
                        @click="proceedToForm" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script>
import { defineComponent, computed, ref, watch, onMounted } from "vue";
import { useQuasar } from "quasar";
import Swal from "sweetalert2";
// ayusin ang path ayon sa kung saan nakalagay ang store mo
import { useBpmStore } from "src/stores/office/bpm/bpmStore";
import { useRowLoading } from "src/composables/useRowLoading";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const MONTHS_SHORT = MONTHS.map((m) => m.slice(0, 3));

// Weeks of a month: 1-7, 8-14, 15-21, 22-28, 29-end
const weeksOf = (year, month) => {
    const last = new Date(year, month + 1, 0).getDate();
    const weeks = [];
    for (let start = 1, no = 1; start <= last; start += 7, no++) {
        weeks.push({ no, start, end: Math.min(start + 6, last) });
    }
    return weeks;
};

// Grupo ng empleyado ayon sa status galing API
const GROUP_DEFS = [
    {
        title: "1. PERMANENT / COTERMINOUS / TEMPORARY",
        statuses: ["REGULAR", "PERMANENT", "COTERMINOUS", "TEMPORARY", "ELECTIVE"],
    },
    {
        title: "2. CASUAL EMPLOYEES",
        statuses: ["CASUAL"],
    },
    {
        title: "3. JOB ORDER / HONORARIUM",
        statuses: ["CONTRACTUAL", "JOB ORDER", "HONORARIUM"],
    },
];

const lastWord = (name = "") => name.trim().split(/\s+/).pop() || "";

const isFilled = (v) => v !== "" && v !== null && v !== undefined;

// Columns ng q-table para sa Add, Edit at View (BP label may week)
const makeDetailColumns = (week) => [
    { name: "no", label: "No.", align: "center", field: "no" },
    { name: "name", label: "Name", align: "left", field: "name" },
    { name: "office_abbr", label: "Office", align: "left", field: "office_abbr" },
    { name: "designation", label: "Designation", align: "left", field: "designation" },
    { name: "sex", label: "Sex", align: "center", field: "sex" },
    { name: "age", label: "Age", align: "center", field: "age" },
    { name: "history", label: "Medical History", align: "center", field: "history" },
    { name: "bp", label: `BP (Week ${week})`, align: "center", field: "bp" },
];

// Gumagawa ng flat rows para sa q-table (may group info sa bawat row).
// Importante: hindi kinokopya ang objects, para gumana ang v-model sa BP inputs.
const buildRows = (list) => {
    const groups = GROUP_DEFS.map((g) => ({ ...g, employees: [] }));
    const others = { title: "4. OTHERS", statuses: [], employees: [] };

    list.forEach((e) => {
        const status = (e.status || "").toUpperCase();
        const group = groups.find((g) => g.statuses.includes(status)) || others;

        group.employees.push({
            id: e.ControlNo,
            ControlNo: e.ControlNo,
            name: e.name,
            office_abbr: e.office_abbr,
            designation: e.designation,
            sex: (e.sex || "").charAt(0).toUpperCase(), // MALE -> M
            age: e.age,
            history: "NONE", // placeholder muna
            sys: isFilled(e.systolic_pressure) ? e.systolic_pressure : "",
            dia: isFilled(e.diastolic_pressure) ? e.diastolic_pressure : "",
        });
    });

    return [...groups, others]
        .filter((g) => g.employees.length)
        .flatMap((g) => {
            const sorted = [...g.employees].sort((a, b) =>
                lastWord(a.name).localeCompare(lastWord(b.name))
            );

            return sorted.map((emp, i) =>
                Object.assign(emp, {
                    no: i + 1,
                    group: g.title,
                    groupStart: i === 0,
                    groupTotal: sorted.length,
                })
            );
        });
};

export default defineComponent({
    name: "BpmPage",

    setup() {
        const $q = useQuasar();
        const store = useBpmStore();

        const { isLoading: isViewLoading, isAnyLoading: isAnyViewLoading, run: runView } = useRowLoading();
        const { isLoading: isEditLoading, isAnyLoading: isAnyEditLoading, run: runEdit } = useRowLoading();
        const { isLoading: isDeleteLoading, isAnyLoading: isAnyDeleteLoading, run: runDelete } = useRowLoading();

        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        const currentQuarter = Math.floor(currentMonth / 3) + 1;
        const loading = computed(() => store.loading);

        // ---------------------------------------------------------------
        // VIEW STATE
        // ---------------------------------------------------------------
        const view = ref("list"); // 'list' | 'form' (add) | 'view' | 'edit'
        const isEdit = computed(() => view.value === "edit");
        // may BP inputs sa add at edit
        const isForm = computed(() => view.value === "form" || view.value === "edit");
        const editingId = ref(null); // bpm_date_id na ine-edit

        // ---------------------------------------------------------------
        // LIST + FILTERS + PAGINATION (server-side, q-table)
        // ---------------------------------------------------------------

        // I-normalize ang galing sa API (month name -> index, year/week -> number)
        const rows = computed(() =>
            store.bpmList.map((r) => {
                const month = MONTHS.indexOf(r.month);
                const year = Number(r.year);
                const week = Number(r.week);
                const w = weeksOf(year, month).find((x) => x.no === week);

                return {
                    id: r.bpm_date_id,
                    year,
                    month,
                    week,
                    start: w ? w.start : "",
                    end: w ? w.end : "",
                    submitted: (r.created_at || "").trim(),
                };
            })
        );

        // Default filters: current year, quarter, month at week
        const yearFilter = ref(currentYear);
        const quarter = ref(currentQuarter); // 0 = all
        const monthFilter = ref(currentMonth); // null = lahat ng buwan
        const weekFilter = ref(null); // null = lahat ng week

        // Pagination state ng q-table
        const tablePagination = ref({
            page: 1,
            rowsPerPage: 10,
            rowsNumber: 0, // kailangan ito para gumana ang server-side
        });

        const yearFilterOptions = [currentYear + 1, currentYear, currentYear - 1, currentYear - 2];

        const quarterOptions = [
            { label: "All Quarters", value: 0 },
            { label: "1st Quarter (Jan - Mar)", value: 1 },
            { label: "2nd Quarter (Apr - Jun)", value: 2 },
            { label: "3rd Quarter (Jul - Sep)", value: 3 },
            { label: "4th Quarter (Oct - Dec)", value: 4 },
        ];

        // Buwan na pwedeng piliin ayon sa napiling quarter
        const monthFilterOptions = computed(() => {
            const start = quarter.value ? (quarter.value - 1) * 3 : 0;
            const count = quarter.value ? 3 : 12;
            return MONTHS.slice(start, start + count).map((label, i) => ({
                label,
                value: start + i,
            }));
        });

        const weekFilterOptions = [1, 2, 3, 4, 5].map((n) => ({
            label: `Week ${n}`,
            value: n,
        }));

        // Params na ipapadala sa API (undefined = hindi isasama)
        const buildParams = () => ({
            year: yearFilter.value ?? undefined,
            quarter: quarter.value || undefined, // 0 = all, hindi ipapadala
            month: monthFilter.value !== null ? MONTHS[monthFilter.value] : undefined, // index -> "October"
            week: weekFilter.value ?? undefined,
            page: tablePagination.value.page,
            per_page: tablePagination.value.rowsPerPage,
        });

        const loadList = async () => {
            await store.fetchBpmList(buildParams());

            // I-sync ang q-table sa sagot ng server
            tablePagination.value = {
                ...tablePagination.value,
                page: store.pagination.currentPage,
                rowsPerPage: store.pagination.perPage,
                rowsNumber: store.pagination.total,
            };
        };

        // Tinatawag ng q-table kapag nag-change page o rows per page
        const onRequest = (props) => {
            tablePagination.value.page = props.pagination.page;
            tablePagination.value.rowsPerPage = props.pagination.rowsPerPage;
            loadList();
        };

        // Kapag nagbago ang filter, bumalik sa page 1
        watch([yearFilter, quarter, monthFilter, weekFilter], () => {
            tablePagination.value.page = 1;
            loadList();
        });

        // Clear = ipakita lahat ng records
        const clearFilters = () => {
            yearFilter.value = null;
            quarter.value = 0;
            monthFilter.value = null;
            weekFilter.value = null;
        };

        const columns = [
            {
                name: "month",
                label: "Month",
                align: "left",
                field: (r) => MONTHS[r.month],
            },
            {
                name: "year",
                label: "Year",
                align: "left",
                field: (r) => r.year,
            },
            {
                name: "date",
                label: "Date",
                align: "left",
                field: (r) =>
                    `Week ${r.week} (${MONTHS_SHORT[r.month]} ${r.start} - ${r.end})`,
            },
            {
                name: "submitted",
                label: "Submitted Date",
                align: "left",
                field: (r) => r.submitted,
            },
            { name: "actions", label: "Action", align: "center" },
        ];

        // ---------------------------------------------------------------
        // ADD DIALOG (month + week)
        // ---------------------------------------------------------------
        const showAddDialog = ref(false);
        const addMonth = ref(currentMonth);
        const addYear = ref(currentYear);
        const selectedWeek = ref(null);

        const monthOptions = MONTHS.map((label, value) => ({ label, value }));
        const yearOptions = [currentYear - 1, currentYear, currentYear + 1];

        const weekOptions = computed(() => weeksOf(addYear.value, addMonth.value));

        // Default week: current week kung current month, else Week 1
        const defaultWeek = () =>
            addYear.value === currentYear && addMonth.value === currentMonth
                ? Math.ceil(today.getDate() / 7)
                : 1;

        const onPeriodChange = () => {
            selectedWeek.value = defaultWeek();
        };

        const openAddDialog = () => {
            addMonth.value = currentMonth; // default: current month
            addYear.value = currentYear;
            selectedWeek.value = defaultWeek();
            showAddDialog.value = true;
        };

        // ---------------------------------------------------------------
        // ADD FORM (employee list)
        // ---------------------------------------------------------------
        const formRows = ref([]);

        const selectedWeekInfo = computed(() =>
            weekOptions.value.find((w) => w.no === selectedWeek.value)
        );

        const periodLabel = computed(() => {
            const w = selectedWeekInfo.value;
            if (!w) return "";
            return `${MONTHS[addMonth.value]} ${addYear.value} - Week ${w.no} (${MONTHS_SHORT[addMonth.value]} ${w.start} - ${w.end})`;
        });

        const proceedToForm = async () => {
            // Iwas duplicate: i-check sa server dahil page lang ang laman ng rows
            let duplicate = false;
            try {
                duplicate = await store.existsBpm(
                    addYear.value,
                    MONTHS[addMonth.value],
                    selectedWeek.value
                );
            } catch (err) {
                $q.notify({
                    type: "negative",
                    message: err.response?.data?.message || "Failed to check existing BPM.",
                    position: "top",
                });
                return;
            }

            if (duplicate) {
                $q.notify({
                    type: "warning",
                    message: "BPM for this month and week was already submitted.",
                    position: "top",
                });
                return;
            }

            await store.fetchEmployee();

            if (store.error || !store.employee.length) {
                $q.notify({
                    type: "negative",
                    message: store.error || "No employees found.",
                    position: "top",
                });
                return;
            }

            formRows.value = buildRows(store.employee);
            showAddDialog.value = false;
            editingId.value = null;
            view.value = "form";
        };

        const backToList = () => {
            editingId.value = null;
            view.value = "list";
        };

        // Kulay ng BP: green normal, amber elevated, red high
        const bpClass = (emp) => {
            const s = Number(emp.sys);
            const d = Number(emp.dia);
            if (!s || !d) return "";
            if (s >= 140 || d >= 90) return "bp-high";
            if (s >= 120 || d >= 80) return "bp-elevated";
            return "bp-normal";
        };

        // ---------------------------------------------------------------
        // VIEW + EDIT (galing sa viewBpm)
        // ---------------------------------------------------------------
        const viewRows = ref([]);
        const viewMeta = ref(null); // { month, year, week, start, end }
        const viewingId = ref(null); // para sa loading ng View button

        const viewPeriodLabel = computed(() => {
            const m = viewMeta.value;
            if (!m) return "";
            return `${MONTHS[m.month]} ${m.year} - Week ${m.week} (${MONTHS_SHORT[m.month]} ${m.start} - ${m.end})`;
        });

        // Shared loader para sa View at Edit
        const loadRecord = async (id, mode) => {
            const res = await store.viewBpm(id);

            if (!res.success) {
                $q.notify({ type: "negative", message: res.message, position: "top" });
                return;
            }

            const record = res.data;

            const month = MONTHS.indexOf(record.month);
            const year = Number(record.year);
            const week = Number(record.week);
            const w = weeksOf(year, month).find((x) => x.no === week);

            viewMeta.value = {
                month,
                year,
                week,
                start: w ? w.start : "",
                end: w ? w.end : "",
            };
            viewRows.value = buildRows(record.employees || []);
            editingId.value = mode === "edit" ? id : null;
            view.value = mode;
        };

        const openView = (row) => runView(row.id, () => loadRecord(row.id, "view"));
        const openEdit = (row) => runEdit(row.id, () => loadRecord(row.id, "edit"));

        // ---------------------------------------------------------------
        // ISANG q-table PARA SA ADD, EDIT AT VIEW
        // ---------------------------------------------------------------
        // Add -> formRows; View at Edit -> viewRows
        const sourceRows = computed(() =>
            view.value === "form" ? formRows.value : viewRows.value
        );
        const detailRows = sourceRows;

        const detailColumns = computed(() =>
            makeDetailColumns(
                view.value === "form"
                    ? selectedWeek.value
                    : viewMeta.value
                        ? viewMeta.value.week
                        : ""
            )
        );

        const pageTitle = computed(() =>
            isEdit.value ? "Edit BPM" : view.value === "form" ? "Add BPM" : "View BPM"
        );

        const headerLabel = computed(() =>
            view.value === "form" ? periodLabel.value : viewPeriodLabel.value
        );

        const viewSummary = computed(() => ({
            total: viewRows.value.length,
            withBp: viewRows.value.filter((e) => isFilled(e.sys) && isFilled(e.dia)).length,
        }));

        // ---------------------------------------------------------------
        // SUBMIT / UPDATE (with SweetAlert confirmation)
        // ---------------------------------------------------------------
        const confirmSummary = computed(() => ({
            total: sourceRows.value.length,
            withBp: sourceRows.value.filter((e) => isFilled(e.sys) && isFilled(e.dia)).length,
        }));

        const buildPayload = () => {
            const employee = sourceRows.value.map((e) => ({
                controlNo: e.ControlNo,
                systolic_pressure: isFilled(e.sys) ? Number(e.sys) : null,
                diastolic_pressure: isFilled(e.dia) ? Number(e.dia) : null,
            }));

            // Edit: BP values lang, hindi na papalitan ang period
            return isEdit.value
                ? { employee }
                : {
                    month: MONTHS[addMonth.value], // "October"
                    year: addYear.value,
                    week: selectedWeek.value,
                    employee,
                };
        };

        const openConfirm = async () => {
            // Validate muna: kapag isa lang sa SYS/DIA ang may laman
            const incomplete = sourceRows.value.find(
                (e) => isFilled(e.sys) !== isFilled(e.dia)
            );

            if (incomplete) {
                $q.notify({
                    type: "warning",
                    message: `Incomplete BP for ${incomplete.name}. Fill both SYS and DIA.`,
                    position: "top",
                });
                return;
            }

            const editing = isEdit.value;

            const result = await Swal.fire({
                icon: "question",
                title: editing ? "Save changes?" : "Are you sure you want to submit?",
                html: `
                    <div style="font-size:14px;color:#5c6b73">${headerLabel.value}</div>
                    <div style="font-size:13px;color:#87949a;margin-top:6px">
                        <b>${confirmSummary.value.withBp}</b> of
                        <b>${confirmSummary.value.total}</b> employees have BP recorded.
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: editing ? "Yes, update" : "Yes, submit",
                cancelButtonText: "Cancel",
                confirmButtonColor: "#16a84a",
                cancelButtonColor: "#718089",
                reverseButtons: true,
                showLoaderOnConfirm: true,
                allowOutsideClick: () => !Swal.isLoading(),
                // Tumatakbo habang may loader; kapag nag-error, nasa loob pa rin ng alert ang message
                preConfirm: async () => {
                    const res = editing
                        ? await store.editBpm(editingId.value, buildPayload())
                        : await store.storeBpm(buildPayload());

                    if (!res.success) {
                        const firstError = res.errors ? Object.values(res.errors).flat()[0] : null;
                        Swal.showValidationMessage(firstError || res.message);
                        return false;
                    }
                    return res;
                },
            });

            if (result.isConfirmed) {
                await Swal.fire({
                    icon: "success",
                    title: editing ? "Updated!" : "Submitted!",
                    text: editing ? "BPM record updated." : "BPM record added.",
                    timer: 1800,
                    showConfirmButton: false,
                });
                await loadList();
                editingId.value = null;
                view.value = "list";
            }
        };

        // ---------------------------------------------------------------
        // DELETE
        // ---------------------------------------------------------------
        const deleteBpm = async (row) => {
            const { isConfirmed } = await Swal.fire({
                title: "Delete BPM record?",
                text: `${MONTHS[row.month]} ${row.year} - Week ${row.week} will be permanently deleted.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete",
                cancelButtonText: "Cancel",
                confirmButtonColor: "#d83d3d",
                cancelButtonColor: "#9e9e9e",
                reverseButtons: true,
                scrollbarPadding: false,
                heightAuto: false,
            });
            if (!isConfirmed) return;

            return runDelete(row.id, async () => {
                const res = await store.deleteBpm(row.id);

                if (!res.success) {
                    Swal.fire({
                        icon: "error",
                        title: "Delete failed",
                        text: res.message,
                        scrollbarPadding: false,
                    });
                    return;
                }

                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "success",
                    title: "BPM record deleted.",
                    showConfirmButton: false,
                    timer: 2500,
                    timerProgressBar: true,
                    scrollbarPadding: false,
                });

                // Kapag huling record na sa page, umatras para hindi mapunta sa walang lamang page
                if (rows.value.length === 1 && tablePagination.value.page > 1) {
                    tablePagination.value.page--;
                }
                await loadList();
            });
        };

        onMounted(() => {
            loadList();
        });

        return {
            view,
            isForm,
            isEdit,
            loading,
            rows,

            yearFilter,
            yearFilterOptions,
            quarter,
            quarterOptions,
            monthFilter,
            monthFilterOptions,
            weekFilter,
            weekFilterOptions,
            clearFilters,
            columns,

            tablePagination,
            onRequest,

            showAddDialog,
            addMonth,
            addYear,
            selectedWeek,
            monthOptions,
            yearOptions,
            weekOptions,
            onPeriodChange,
            openAddDialog,

            periodLabel,
            proceedToForm,
            backToList,
            bpClass,
            isFilled,

            viewingId,
            viewPeriodLabel,
            viewSummary,

            pageTitle,
            headerLabel,
            detailRows,
            detailColumns,

            openConfirm,

            isViewLoading,
            isAnyViewLoading,

            isEditLoading,
            isAnyEditLoading,

            isDeleteLoading,
            isAnyDeleteLoading,
            openView,
            openEdit,
            deleteBpm,
        };
    },
});
</script>

<style scoped>
/* =========================================================
   PAGE
========================================================= */

.bpm-page {
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

.add-btn {
    min-height: 42px;
    padding: 0 18px;
    border-radius: 9px;
    color: #ffffff;
    background: linear-gradient(135deg, #18b64d, #0ca344);
    font-size: 12px;
    font-weight: 650;
    box-shadow: 0 4px 10px rgba(16, 167, 70, 0.18);
}

.form-title-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
}

.form-header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

/* =========================================================
   CARD
========================================================= */

.bpm-card {
    overflow: hidden;
    border-radius: 13px;
    background: #ffffff;
    box-shadow: 0 3px 12px rgba(225, 228, 226, 0.055);
}

/* =========================================================
   FILTERS
========================================================= */

.filter-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 13px 20px;
    border-top: 1px solid #edf1ef;
    border-bottom: 1px solid #edf1ef;
    background: #fcfdfc;
}

.filter-selects {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    gap: 10px;
}

.filter-select {
    width: 200px;
    max-width: 100%;
}

.filter-select :deep(.q-field__control) {
    border-radius: 8px;
}

.clear-btn {
    color: #6f8087;
    font-size: 10px;
}

/* =========================================================
   TABLE (list)
========================================================= */

.table-wrapper {
    padding: 0 12px;
}

.action-buttons {
    display: flex;
    justify-content: center;
    gap: 2px;
}

.action-view {
    color: #4b7c94;
}

.action-edit {
    color: #16a84a;
}

.action-delete {
    color: #d35d5d;
}

.app-table-empty {
    width: 100%;
    padding: 20px;
    text-align: center;
    color: #87949a;
    font-size: 12px;
}

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
   Add / Edit / View q-table
========================================================= */

.bpm-qtable :deep(table) {
    min-width: 900px;
}

.bpm-qtable :deep(thead th) {
    padding: 12px 10px;
    color: #141414;
    background: #ffffff;
    font-size: 12px;
    font-weight: 650;
    letter-spacing: 0.3px;
    text-transform: uppercase;
}

.bpm-qtable :deep(tbody td) {
    padding: 9px 10px;
    font-size: 11px;
}

.bpm-qtable :deep(.col-no) {
    width: 44px;
    color: #718089;
}

.bpm-qtable :deep(.col-bp) {
    width: 170px;
}

.bpm-qtable :deep(.muted) {
    color: #000000;
    font-size: 12px;
}

.bpm-qtable :deep(.group-row td) {
    padding: 12px 14px 8px;
    background: #ffffff;
    color: #151616;
    font-size: 11px;
    font-weight: 700;
    text-align: left;
}

.group-total {
    margin-left: 10px;
    color: #000000;
    font-size: 10px;
    font-weight: 600;
}

.history-chip {
    display: inline-block;
    padding: 3px 10px;
    border: 1px solid #f1c9a8;
    border-radius: 6px;
    color: #c0392b;
    background: #fff4ea;
    font-size: 10px;
    font-weight: 600;
}

.history-chip.history-none {
    border-color: #e4e8ea;
    color: #7b8b94;
    background: #f3f5f6;
}

.bp-inputs {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    color: #7b8b94;
}

.bp-input {
    width: 100px;
    padding: 6px 4px;
    border: 1px solid #d8e0dc;
    border-radius: 6px;
    background: #ffffff;
    color: #19354a;
    font-size: 12px;
    text-align: center;
    outline: none;
    -moz-appearance: textfield;
    appearance: textfield;
}

.bp-input::-webkit-outer-spin-button,
.bp-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.bp-input:focus {
    border-color: #16b84d;
}

.bp-normal {
    border-color: #9edbb3;
    background: #e8f8ed;
}

.bp-elevated {
    border-color: #f0d58a;
    background: #fff6dc;
}

.bp-high {
    border-color: #ee9a9a;
    background: #fde8e8;
}

/* BP display sa View (read-only) */
.bp-chip {
    display: inline-block;
    min-width: 84px;
    padding: 4px 12px;
    border: 1px solid #d8e0dc;
    border-radius: 6px;
    color: #19354a;
    background: #ffffff;
    font-size: 12px;
    font-weight: 650;
}

.bp-empty {
    color: #b6c1c6;
    font-size: 12px;
}

/* =========================================================
   DIALOG
========================================================= */

.bpm-dialog {
    width: 480px;
    max-width: 92vw;
    border-radius: 14px;
}

.dialog-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 16px 18px;
}

.dialog-title {
    color: #19354a;
    font-size: 16px;
    font-weight: 750;
}

.dialog-sub {
    margin-top: 2px;
    color: #839097;
    font-size: 10px;
}

.dialog-body {
    padding: 16px 18px;
}

.dialog-actions {
    padding: 10px 18px;
    background: #fcfdfc;
}

.cancel-btn {
    color: #718089;
    font-size: 11px;
}

.save-btn {
    min-height: 35px;
    padding: 0 16px;
    border-radius: 8px;
    color: #ffffff;
    background: linear-gradient(135deg, #18b64d, #0ca344);
    font-size: 11px;
}

.section-label {
    margin: 14px 0 8px;
    color: #8a989e;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.4px;
    text-transform: uppercase;
}

.section-label:first-of-type {
    margin-top: 0;
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.form-grid :deep(.q-field__control) {
    border-radius: 8px;
}

.week-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
}

.week-opt {
    padding: 10px;
    border: 1px solid #e2e9e5;
    border-radius: 9px;
    text-align: center;
    cursor: pointer;
    user-select: none;
    transition: border-color 0.15s, background 0.15s;
}

.week-opt:hover {
    border-color: #9edbb3;
}

.week-opt--active {
    border-color: #16b84d;
    background: #e8f8ed;
}

.week-opt-name {
    color: #19354a;
    font-size: 12px;
    font-weight: 700;
}

.week-opt-range {
    margin-top: 2px;
    color: #718089;
    font-size: 11px;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 650px) {
    .bpm-page {
        padding: 14px;
    }

    .page-header {
        flex-wrap: wrap;
        gap: 12px;
    }

    .table-wrapper {
        overflow-x: auto;
    }

    .app-table {
        min-width: 560px;
    }

    .form-grid {
        grid-template-columns: 1fr;
    }

    .week-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>