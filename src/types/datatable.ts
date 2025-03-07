import { CustomCellRendererProps } from "ag-grid-react";

export interface ActionCellRenderParams<TRowData> extends CustomCellRendererProps {
  onSave?: (obj: TRowData) => void;
  onDelete?: (obj: TRowData) => void;
  onEdit?: (obj: TRowData) => void;
  onRun?: (obj: TRowData) => void;
}

export interface TaskRowData {
  _id: string;
  task_name: string;
  description: string;
  is_scheduled: boolean;
  interval: number;
  next_run_time: string | null;
}