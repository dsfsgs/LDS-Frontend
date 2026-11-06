<template>
    <q-page class="bpm-page">
        <!-- =====================================================
         LIST VIEW
    ====================================================== -->
        <template v-if="view === 'list'">
            <section class="page-header">
                <div>
                    <h5>BPM Submitted</h5>
                    <p>Monitor submitted employee blood pressure readings.</p>
                </div>
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
                                    <q-btn flat round dense icon="visibility" color="positive"
                                        :loading="isViewLoading(props.row.id)"
                                        :disable="isAnyViewLoading() && !isViewLoading(props.row.id)"
                                        @click="openView(props.row)">
                                        <q-tooltip>View</q-tooltip>
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
         VIEW (read-only)
    ====================================================== -->
        <template v-else>
            <section class="page-header">
                <div class="form-title-wrap">
                    <q-btn flat round dense icon="arrow_back" @click="backToList" />
                    <div>
                        <h5>View BPM</h5>
                        <p>{{ viewPeriodLabel }}</p>
                    </div>
                </div>

                <!-- <q-btn flat no-caps icon="arrow_back" label="Back" class="cancel-btn" @click="backToList" /> -->
            </section>

            <q-card flat class="bpm-card">
                <q-table flat :rows="viewRows" :columns="detailColumns" row-key="id" hide-pagination
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
                                <span v-if="isFilled(props.row.sys) && isFilled(props.row.dia)" class="bp-chip"
                                    :class="bpClass(props.row)">
                                    {{ props.row.sys }} / {{ props.row.dia }}
                                </span>
                                <span v-else class="bp-empty">—</span>
                            </q-td>
                        </q-tr>
                    </template>

                    <template #no-data>
                        <div class="app-table-empty">No employees found.</div>
                    </template>
                </q-table>

                <div class="table-footer">
                    <span>
                        <strong>{{ viewSummary.withBp }}</strong> of
                        <strong>{{ viewSummary.total }}</strong> employees have BP recorded
                    </span>
                </div>
            </q-card>
        </template>
    </q-page>
</template>

<script>
import { defineComponent, computed, ref, watch, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useBpmSubmittedStore } from "src/stores/administrator/bpm/bpmStore";
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
    name: "BpmSubmittedPage",

    setup() {
        const $q = useQuasar();
        const store = useBpmSubmittedStore();

        const { isLoading: isViewLoading, isAnyLoading: isAnyViewLoading, run: runView } = useRowLoading();

        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        const currentQuarter = Math.floor(currentMonth / 3) + 1;

        const loading = computed(() => store.loading);

        // ---------------------------------------------------------------
        // VIEW STATE
        // ---------------------------------------------------------------
        const view = ref("list"); // 'list' | 'view'

        // ---------------------------------------------------------------
        // LIST + FILTERS + PAGINATION (server-side, q-table)
        // ---------------------------------------------------------------
        const rows = computed(() =>
            store.bpmListSubmitted.map((r) => {
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
                    office: r.office || "",
                    submitted: (r.created_at || "").trim(),
                };
            })
        );

        const yearFilter = ref(currentYear);
        const quarter = ref(currentQuarter); // 0 = all
        const monthFilter = ref(currentMonth); // null = lahat ng buwan
        const weekFilter = ref(null); // null = lahat ng week

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

        const buildParams = () => ({
            year: yearFilter.value ?? undefined,
            quarter: quarter.value || undefined, // 0 = all, hindi ipapadala
            month: monthFilter.value !== null ? MONTHS[monthFilter.value] : undefined,
            week: weekFilter.value ?? undefined,
            page: tablePagination.value.page,
            per_page: tablePagination.value.rowsPerPage,
        });

        const loadList = async () => {
            await store.fetchBpmSubmitted(buildParams());

            tablePagination.value = {
                ...tablePagination.value,
                page: store.pagination.currentPage,
                rowsPerPage: store.pagination.perPage,
                rowsNumber: store.pagination.total,
            };
        };

        const onRequest = (props) => {
            tablePagination.value.page = props.pagination.page;
            tablePagination.value.rowsPerPage = props.pagination.rowsPerPage;
            loadList();
        };

        watch([yearFilter, quarter, monthFilter, weekFilter], () => {
            tablePagination.value.page = 1;
            loadList();
        });

        const clearFilters = () => {
            yearFilter.value = null;
            quarter.value = 0;
            monthFilter.value = null;
            weekFilter.value = null;
        };

        const columns = [
            { name: "office", label: "Office", align: "left", field: (r) => r.office },
            { name: "month", label: "Month", align: "left", field: (r) => MONTHS[r.month] },
            { name: "year", label: "Year", align: "left", field: (r) => r.year },
            {
                name: "date",
                label: "Date",
                align: "left",
                field: (r) => `Week ${r.week} (${MONTHS_SHORT[r.month]} ${r.start} - ${r.end})`,
            },
            { name: "submitted", label: "Submitted Date", align: "left", field: (r) => r.submitted },
            { name: "actions", label: "Action", align: "center" },
        ];

        // ---------------------------------------------------------------
        // VIEW (read-only)
        // ---------------------------------------------------------------
        const viewRows = ref([]);
        const viewMeta = ref(null); // { month, year, week, start, end }

        const viewPeriodLabel = computed(() => {
            const m = viewMeta.value;
            if (!m) return "";
            return `${MONTHS[m.month]} ${m.year} - Week ${m.week} (${MONTHS_SHORT[m.month]} ${m.start} - ${m.end})`;
        });

        const detailColumns = computed(() =>
            makeDetailColumns(viewMeta.value ? viewMeta.value.week : "")
        );

        const viewSummary = computed(() => ({
            total: viewRows.value.length,
            withBp: viewRows.value.filter((e) => isFilled(e.sys) && isFilled(e.dia)).length,
        }));

        const loadRecord = async (id) => {
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
            view.value = "view";
        };

        const openView = (row) => runView(row.id, () => loadRecord(row.id));

        const backToList = () => {
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

        onMounted(() => {
            loadList();
        });

        return {
            view,
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

            viewRows,
            viewPeriodLabel,
            viewSummary,
            detailColumns,
            backToList,
            bpClass,
            isFilled,

            isViewLoading,
            isAnyViewLoading,
            openView,
        };
    },
});
</script>

<style scoped>
.bpm-page {
    min-height: 100%;
    padding: 20px;
    color: #19354a;
}

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

.form-title-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
}

.bpm-card {
    overflow: hidden;
    border-radius: 13px;
    background: #ffffff;
    box-shadow: 0 3px 12px rgba(225, 228, 226, 0.055);
}

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

.table-wrapper {
    padding: 0 12px;
}

.action-buttons {
    display: flex;
    justify-content: center;
    gap: 2px;
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

.cancel-btn {
    color: #718089;
    font-size: 11px;
}

/* View q-table */
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
}
</style>