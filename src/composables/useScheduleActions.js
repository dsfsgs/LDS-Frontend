import Swal from "sweetalert2";
import { useScheduleStore } from "src/stores/event/schedule/scheduleStore";
import { useEventStore } from "src/stores/eventStore";

export function useScheduleActions() {
  const scheduleStore = useScheduleStore();
  const eventStore = useEventStore();

  async function deleteSchedule(item, eventId) {
    const result = await Swal.fire({
      title: "Delete Schedule",
      text: "Are you sure you want to delete this schedule?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d83d3d",
      cancelButtonColor: "#9e9e9e",
      reverseButtons: true,
      scrollbarPadding: false,
      heightAuto: false,
    });

    if (!result.isConfirmed) return;

    try {
      const deleteResult = await scheduleStore.deleteSchedule(item.scheduleId);

      if (deleteResult?.success) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Schedule deleted successfully.",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
          scrollbarPadding: false,
        });
        await eventStore.fetchEventById(eventId);
      } else {
        Swal.fire({
          title: "Failed",
          text: deleteResult?.message || "Unable to delete schedule.",
          icon: "error",
          scrollbarPadding: false,
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: error?.message || "Unable to delete schedule.",
        icon: "error",
        scrollbarPadding: false,
      });
    }
  }

  return { deleteSchedule };
}