"use client";

import { customAlert, CustomAlertType } from "@/components/ui/alert";
import { axiosHelper } from "@/lib/axios";
import { loadCurrentUser } from "@/services/authService";
import { ApiGeneralResponse } from "@/types/api";
import { FetchDataType, FetchMethod, FetchTokenType, TaskConfigRead, TaskType, taskTypeMap } from "@/types/task";
import { lookupValue } from "@/utils/record";
import { faArrowLeft, faEdit, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function TaskRunPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const taskID = searchParams?.get("id");
  const currentUser = loadCurrentUser();
  const [loading, setLoading] = useState(false);

  const [task, setTask] = useState<TaskConfigRead>({
    _id: null,
    user_id: currentUser?._id || null,
    task_name: "New task",
    task_type: TaskType.NORMAL,
    description: "This is a new task",
    fetch_config: {
      method: FetchMethod.GET,
      url: "https://target.api.com/api/v1/endpoint",
      auth_token: {
        type: FetchTokenType.HEADER_TOKEN,
        token: {
          key1: "value1",
          key2: "value2",
          key3: "value3",
        }
      },
      data_type: FetchDataType.JSON,
      success_code: 200
    },
    enigx_config: {
      tenant_id: "tenant-id",
      project_id: "project-id",
      bearer_token: "brearer-token",
    },
    interval_secs: 60,
    next_run_time: null,
    is_scheduled: false,
    task_args: {},
  });

  const preRef = useRef<HTMLPreElement>(null);
  const [taskLog, setTaskLog] = useState<string>("");

  const fetchTask = async () => {
    const response = await axiosHelper.get<TaskConfigRead>(`/task-config/get/${taskID}`);
    if (response) {
      setTask(response);
    }
  }

  const fetchTaskLog = async () => {
    const response = await axiosHelper.get<string>(`/logs/get/${taskID}`);
    if (response) {
      setTaskLog(response);
    }
  }

  // UI Handlers
  const handleClickBack = () => {
    router.push("/main/tasks");
  }

  const handleClickEdit = () => {
    router.push("/main/tasks/edit?mode=edit&id=" + taskID);
  }

  const handleClickRun = async () => {
    try {
      setLoading(true)
      const response = await axiosHelper.get<ApiGeneralResponse>("/task/run/" + taskID);
      if (response) {
        customAlert({
          type: CustomAlertType.SUCCESS,
          title: "Success",
          message: response.message,
        });
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChangeSchedule = async (isScheduled: boolean) => {
    try {
      let response = null;
      let successMessage = "";
      if (isScheduled) {
        response = await axiosHelper.get<ApiGeneralResponse>("/scheduler/create/" + taskID);
        successMessage = "The task is scheduled successfully";
      } else {
        response = await axiosHelper.delete<ApiGeneralResponse>("/scheduler/delete/" + taskID);
        successMessage = "The task is unscheduled successfully";
      }
      if (response) {
        customAlert({
          type: CustomAlertType.SUCCESS,
          title: "Success",
          message: successMessage
        });
        fetchTask();
      }
    } catch {
      customAlert({
        type: CustomAlertType.SUCCESS,
        title: "Error",
        message: "Scheduling operation failed"
      });
    }
  }

  // Hooks
  useEffect(() => {
    fetchTask();
    const intervalId = setInterval(() => {
      fetchTaskLog();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []); // eslint-disable-line

  useEffect(() => {
    if (preRef.current) {
      preRef.current.scrollTop = preRef.current.scrollHeight;
    }
  }, [taskLog]);

  return (
    <div>
      <div className="flex justify-between py-4">
        <p className="text-lg font-medium text-base-content/80">
          Run Task
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="btn btn-info btn-sm text-gray-100"
            onClick={() => handleClickBack()}
          >
            <FontAwesomeIcon icon={faArrowLeft} width={12} /> Back to Tasks
          </button>
          <button
            className="btn btn-info btn-sm text-gray-100"
            onClick={() => handleClickEdit()}
          >
            <FontAwesomeIcon icon={faEdit} width={12} /> Edit
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full h-fit min-h-[calc(100vh-11.4rem)]">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            className="btn btn-info btn-sm text-gray-100 w-30"
            disabled={loading}
            onClick={() => handleClickRun()}
          >
            {loading
              ? <span className="loading loading-spinner loading-xs"></span>
              : <FontAwesomeIcon icon={faPlay} width={12} />}
            Run
          </button>
          <label className="fieldset-label">
            <input
              type="checkbox"
              className="toggle toggle-info"
              checked={task.is_scheduled}
              disabled={loading}
              onChange={(e) => handleChangeSchedule(e.target.checked)}
            />
            Schedule Task (Every {task.interval_secs} seconds)
          </label>
        </div>
        <div className="w-full overflow-auto">
          <table className="table table-md w-full min-w-xl">
            <tbody>
              <tr>
                <td>Task Name</td>
                <td>{task.task_name}</td>
              </tr>
              <tr>
                <td>Task Type</td>
                <td>{lookupValue(taskTypeMap, task.task_type)}</td>
              </tr>
              <tr>
                <td>Description</td>
                <td>{task.description}</td>
              </tr>
              <tr>
                <td>API Link</td>
                <td>{task.fetch_config.url}</td>
              </tr>
              <tr>
                <td>Tenant ID</td>
                <td>{task.enigx_config.tenant_id}</td>
              </tr>
              <tr>
                <td>Project ID</td>
                <td>{task.enigx_config.project_id}</td>
              </tr>
              <tr>
                <td>Next Run Time</td>
                <td>{task.next_run_time ? new Date(task.next_run_time).toLocaleString() : "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre
          ref={preRef}
          className="font-mono text-xs h-40 resize-y overflow-auto border border-base-300 bg-base-100"
        >
          {taskLog}
        </pre>
      </div>
    </div>
  )
}
