'use client';

import { customAlert, CustomAlertType } from "@/components/ui/alert";
import { DeleteButton, EditButton, NewButton } from "@/components/ui/datatable/button";
import { myTheme } from "@/components/ui/theme/agGrid";
import { axiosHelper } from "@/lib/axios";
import { ApiGeneralResponse } from "@/types/api";
import { ActionCellRenderParams, TaskRowData } from "@/types/datatable";
import { TaskConfigRead, TaskEditPageMode } from "@/types/task";
import { getTaskRowData } from "@/utils/types";
import type { CellValueChangedEvent, ColDef, ColGroupDef, GridReadyEvent, Theme } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function TaskPage() {
  const router = useRouter();
  const gridRef = useRef<AgGridReact>(null);
  const [rowDataList, setRowDataList] = useState<TaskRowData[]>();

  // UI Functions
  const onClickNewRow = async () => {
    router.push(`/main/tasks/edit?mode=${TaskEditPageMode.CREATE}`);
  }

  const onEdit = async (obj: TaskRowData) => {
    router.push(`/main/tasks/edit?mode=${TaskEditPageMode.EDIT}&id=${obj._id}`);
  }

  // CRUD Functions
  const fetchRowData = async () => {
    const response = await axiosHelper.get<TaskConfigRead[]>("/task/list");
    if (response) {
      const objList = [];

      for (let i = 0; i < response.length; i++) {
        const obj = getTaskRowData(response[i]);
        objList.push(obj);

        setRowDataList(objList);
      }
    }
  }

  const onDelete = async (obj: TaskRowData) => {
    let needRedraw = true;
    const response = await axiosHelper.delete<ApiGeneralResponse>(`/task/delete/${obj._id}`);
    if (response) {
      customAlert({
        type: CustomAlertType.SUCCESS,
        message: "Deleted successfully.",
      });
    } else {
      needRedraw = false;
    }
    if (needRedraw) {
      const newRowData: TaskRowData[] = [];
      gridRef.current?.api.forEachNode((node) => {
        if (node.data._id !== obj._id) {
          newRowData.push(node.data);
        }
      });
      setRowDataList(newRowData);
    }
  }

  // Table functions
  const [colDefs, setColDefs] = useState<(ColDef | ColGroupDef)[]>([ // eslint-disable-line
    {
      headerName: "Task Name",
      field: "task_name",
      width: 200,
    },
    {
      headerName: "Description",
      field: "description",
      minWidth: 200,
      flex: 1,
    },
    {
      headerName: "Is Scheduled",
      field: "is_scheduled",
      width: 140,
      cellRenderer: (params: any) => params.value ? "Yes" : "No", // eslint-disable-line
    },
    {
      headerName: "Interval",
      field: "interval",
      width: 120,
    },
    {
      headerName: "Next Run Time",
      field: "next_run_time",
      width: 160,
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 120,
      pinned: "right",
      filter: false,
      editable: false,
      sortable: false,
      cellRenderer: (params: ActionCellRenderParams<TaskRowData>) => (
        <div className="h-full flex items-center gap-1">
          <EditButton onClick={() => params.onEdit ? params.onEdit(params.data) : alert("click")} />
          <DeleteButton onClick={() => params.onDelete ? params.onDelete(params.data) : alert("click")} />
        </div>
      ),
      cellRendererParams: {
        onEdit: onEdit,
        onDelete: onDelete,
      },
    },
  ]);

  const defaultColDef: ColDef = {
    filter: true,
    editable: false,
  };

  const onGridReady = useCallback(async (params: GridReadyEvent) => { // eslint-disable-line
    await fetchRowData();
  }, []);

  const onCellValueChanged = (event: CellValueChangedEvent) => {
    event.data._is_modified = true;
    gridRef.current?.api.redrawRows();
  };

  const theme = useMemo<Theme | "legacy">(() => {
    return myTheme();
  }, []);

  return (
    <div>
      <div className="flex justify-between py-4">
        <p className="text-lg font-medium text-base-content/80">
          Tasks
        </p>
        <NewButton onClick={() => onClickNewRow()}>New Task</NewButton>
      </div>
      <div className="overflow-auto">
        <div className="h-[calc(100vh-11.4rem)] min-w-[600px] min-h-[450px]">
          <AgGridReact
            ref={gridRef}
            columnDefs={colDefs}
            rowData={rowDataList}
            theme={theme}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            onCellValueChanged={onCellValueChanged}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 25, 50]}
          />
        </div>
      </div>
    </div>
  );
};
