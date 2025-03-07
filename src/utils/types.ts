import { TaskRowData } from "@/types/datatable";
import { TaskConfigRead } from "@/types/task";

export function getTaskRowData(read_data: TaskConfigRead): TaskRowData {
  return {
    _id: read_data._id,
    task_name: read_data.task_name,
    description: read_data.description,
    is_scheduled: read_data.is_scheduled,
    interval: read_data.interval_secs,
    next_run_time: read_data.next_run_time,
  }
}