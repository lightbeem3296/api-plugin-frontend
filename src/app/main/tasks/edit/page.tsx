"use client";

import { customAlert, CustomAlertType } from "@/components/ui/alert";
import { axiosHelper } from "@/lib/axios";
import { loadCurrentUser } from "@/services/authService";
import { ApiGeneralResponse } from "@/types/api";
import { FetchDataType, fetchDataTypeCodes, fetchDataTypeMap, FetchMethod, fetchMethodCodes, fetchMethodMap, FetchTokenType, fetchTokenTypeCodes, fetchTokenTypeMap, TaskConfig, TaskEditPageMode, TaskType, taskTypeCodes, taskTypeMap } from "@/types/task";
import { lookupValue } from "@/utils/record";
import { faArrowLeft, faEye, faEyeSlash, faPlay, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function TaskEditPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const modeFromParams = searchParams?.get("mode");
  const pageMode = Object.values(TaskEditPageMode).includes(modeFromParams as TaskEditPageMode) ? modeFromParams : TaskEditPageMode.EDIT;
  const taskID = searchParams?.get("id");
  const currentUser = loadCurrentUser();
  const [showBearerToken, setShowBearerToken] = useState(false);
  const [showToken, setShowToken] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState<TaskConfig>({
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
          key: "value",
        }
      },
      data_type: FetchDataType.JSON,
      success_code: 200
    },
    enigx_config: {
      tenant_id: "tenant-id",
      project_id: "project-id",
      bearer_token: "Bearer xxxxxxxxxxxxxxxx",
    },
    interval_secs: 60,
  });

  const fetchTask = async () => {
    const response = await axiosHelper.get<TaskConfig>(`/task-config/get/${taskID}`);
    if (response) {
      setTask(response);
      const tokenLength = Object.entries(response.fetch_config.auth_token.token).length;
      setShowToken(Array<boolean>(tokenLength).fill(false));
    }
  }

  // UI Handlers
  const handleClickBack = () => {
    router.push("/main/tasks");
  }

  const handleClickRun = () => {
    router.push("/main/tasks/run?id=" + taskID);
  }

  const handleChangeTaskType = (value: string) => {
    setTask({
      ...task,
      task_type: value as TaskType,
      fetch_config: {
        ...task.fetch_config,
        method: value === TaskType.SPITZECO ? FetchMethod.GET : task.fetch_config.method,
        url: value === TaskType.SPITZECO ? "https://api.spitzeco.dk/kb" : task.fetch_config.url,
        auth_token: {
          ...task.fetch_config.auth_token,
          type: value === TaskType.SPITZECO ? FetchTokenType.HEADER_TOKEN : task.fetch_config.auth_token.type,
          token: value === TaskType.SPITZECO
            ? { "ocp-apim-subscription-key": "" }
            : task.fetch_config.auth_token.token,
        },
        data_type: value === TaskType.SPITZECO ? FetchDataType.JSON : task.fetch_config.data_type,
        success_code: value === TaskType.SPITZECO ? 200 : task.fetch_config.success_code,
      }
    });

  }

  const handleAddToken = () => {
    setTask({
      ...task,
      fetch_config: {
        ...task.fetch_config,
        auth_token: {
          ...task.fetch_config.auth_token,
          token: {
            ...task.fetch_config.auth_token.token,
            [`additionalProp${Object.keys(task.fetch_config.auth_token.token).length + 1}`]: `value${Object.keys(task.fetch_config.auth_token.token).length + 1}`
          }
        }
      }
    });
    setShowToken([...showToken, false]);
  }

  const handleDeleteToken = (index: number) => {
    setTask({
      ...task,
      fetch_config: {
        ...task.fetch_config,
        auth_token: {
          ...task.fetch_config.auth_token,
          token: Object.fromEntries(
            Object.entries(task.fetch_config.auth_token.token).filter((_, i) => i !== index)
          )
        }
      }
    });
    setShowToken(showToken.filter((_, i) => i !== index));
  }

  const handleChangeTokenKey = (index: number, value: string) => {
    setTask({
      ...task,
      fetch_config: {
        ...task.fetch_config,
        auth_token: {
          ...task.fetch_config.auth_token,
          token: Object.fromEntries(
            Object.entries(task.fetch_config.auth_token.token).map(([key, val], i) =>
              i === index
                ? [value, val]
                : [key, val])
          )
        }
      }
    });
  }

  const handleChangeTokenValue = (index: number, value: string) => {
    setTask({
      ...task,
      fetch_config: {
        ...task.fetch_config,
        auth_token: {
          ...task.fetch_config.auth_token,
          token: Object.fromEntries(
            Object.entries(task.fetch_config.auth_token.token).map(([key, val], i) =>
              i === index
                ? [key, value]
                : [key, val])
          )
        }
      }
    });
  }

  const handleSaveToken = async () => {
    setLoading(true);
    try {
      if (pageMode === TaskEditPageMode.CREATE) {
        const response = await axiosHelper.post<TaskConfig, ApiGeneralResponse>(`/task-config/create`, task, undefined);
        if (response) {
          customAlert({
            type: CustomAlertType.SUCCESS,
            message: "Created successfully",
          });
          router.push("/main/tasks");
        }
      } else if (pageMode === TaskEditPageMode.EDIT) {
        const response = await axiosHelper.put<TaskConfig, ApiGeneralResponse>(`/task-config/update/${taskID}`, task);
        if (response) {
          customAlert({
            type: CustomAlertType.SUCCESS,
            message: "Updated successfully",
          });
        }
      } else {
        customAlert({
          type: CustomAlertType.ERROR,
          title: "URL Error",
          message: `Unhandled mode: ${pageMode}`,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  // Hooks
  useEffect(() => {
    if (pageMode !== TaskEditPageMode.CREATE) {
      fetchTask();
    }
  }, []); // eslint-disable-line

  return (
    <div>
      <div className="flex justify-between py-4">
        <p className="text-lg font-medium text-base-content/80">
          {
            pageMode === TaskEditPageMode.CREATE
              ? "Create New Task"
              : pageMode === TaskEditPageMode.EDIT
                ? "Edit Task"
                : "View Task"
          }
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="btn btn-info btn-sm text-gray-100"
            onClick={() => handleClickBack()}
          >
            <FontAwesomeIcon icon={faArrowLeft} width={12} /> Back to Tasks
          </button>
          {
            pageMode === TaskEditPageMode.CREATE
              ? null
              : <button
                className="btn btn-info btn-sm text-gray-100"
                onClick={() => handleClickRun()}
              >
                <FontAwesomeIcon icon={faPlay} width={12} /> Run
              </button>
          }
        </div>
      </div>
      <div className="h-fit min-h-[calc(100vh-11.4rem)]">
        <div className="w-full flex flex-col gap-4">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Task Name */}
            <fieldset>
              <legend className="fieldset-legend">Task Name</legend>
              <input
                type="text"
                className="input input-sm w-60"
                disabled={loading}
                value={task.task_name}
                onChange={(e) => setTask({ ...task, task_name: e.target.value })}
              />
            </fieldset>

            {/* Task Description */}
            <fieldset>
              <legend className="fieldset-legend">Description</legend>
              <input
                type="text"
                className="input input-sm w-full"
                disabled={loading}
                value={task.description}
                onChange={(e) => setTask({ ...task, description: e.target.value })}
              />
            </fieldset>

            {/* Interval Seconds */}
            <fieldset>
              <legend className="fieldset-legend">Interval Seconds</legend>
              <input
                type="number"
                className="input input-sm"
                disabled={loading}
                value={task.interval_secs}
                onChange={(e) => setTask({ ...task, interval_secs: Number(e.target.value) })}
              />
              <legend className="fieldset-label">
                This value is used for task scheduling. Scheduled task will run every {task.interval_secs} seconds
              </legend>
            </fieldset>

            {/* Task Type */}
            <fieldset>
              <legend className="fieldset-legend">Task Type</legend>
              <select
                className="select select-bordered select-sm w-60"
                value={task.task_type}
                onChange={(e) => handleChangeTaskType(e.target.value)}
              >
                <option disabled value="">Select task type</option>
                {taskTypeCodes.map((key) => (
                  <option key={key} value={key}>
                    {lookupValue(taskTypeMap, key)}
                  </option>
                ))}
              </select>
            </fieldset>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fetch Config */}
            <div className="col-span-1">
              <span className="fieldset-legend">Fetch Config</span>
              <div className="flex flex-col gap-4 p-4 border border-base-content/20 rounded-md">
                <fieldset>
                  <legend className="fieldset-legend">Method</legend>
                  <select
                    className="select select-bordered select-sm w-60"
                    value={task.fetch_config.method}
                    onChange={(e) => setTask({ ...task, fetch_config: { ...task.fetch_config, method: e.target.value as FetchMethod } })}
                  >
                    <option disabled value="">Select fetch method</option>
                    {fetchMethodCodes.map((key) => (
                      <option key={key} value={key}>
                        {lookupValue(fetchMethodMap, key)}
                      </option>
                    ))}
                  </select>
                </fieldset>
                <fieldset>
                  <legend className="fieldset-legend">URL</legend>
                  <input
                    type="text"
                    className="input input-sm w-60"
                    disabled={loading}
                    value={task.fetch_config.url}
                    onChange={(e) => setTask({ ...task, fetch_config: { ...task.fetch_config, url: e.target.value } })}
                  />
                </fieldset>
                <fieldset>
                  <legend className="fieldset-legend">Data Type</legend>
                  <select
                    className="select select-bordered select-sm w-60"
                    value={task.fetch_config.data_type}
                    onChange={(e) => setTask({ ...task, fetch_config: { ...task.fetch_config, data_type: e.target.value as FetchDataType } })}
                  >
                    <option disabled value="">Select data type</option>
                    {fetchDataTypeCodes.map((key) => (
                      <option key={key} value={key}>
                        {lookupValue(fetchDataTypeMap, key)}
                      </option>
                    ))}
                  </select>
                </fieldset>
                <fieldset>
                  <legend className="fieldset-legend">Success Code</legend>
                  <input
                    type="text"
                    className="input input-sm w-60"
                    disabled={loading}
                    value={task.fetch_config.success_code}
                    onChange={(e) => setTask({ ...task, fetch_config: { ...task.fetch_config, success_code: parseInt(e.target.value) } })}
                  />
                </fieldset>
                <fieldset>
                  <legend className="fieldset-legend">Auth Token Type</legend>
                  <select
                    className="select select-bordered select-sm w-60"
                    value={task.fetch_config.auth_token.type}
                    onChange={(e) => setTask({ ...task, fetch_config: { ...task.fetch_config, auth_token: { ...task.fetch_config.auth_token, type: e.target.value as FetchTokenType } } })}
                  >
                    <option disabled value="">Select token type</option>
                    {fetchTokenTypeCodes.map((key) => (
                      <option key={key} value={key}>
                        {lookupValue(fetchTokenTypeMap, key)}
                      </option>
                    ))}
                  </select>
                </fieldset>
                <div className="w-full flex flex-col gap-2">
                  <div className="flex w-full items-center justify-between">
                    <legend className="fieldset-legend">Auth Tokens</legend>
                    <button
                      className="btn btn-xs btn-info btn-outline"
                      onClick={() => handleAddToken()}
                    >
                      + Add token
                    </button>
                  </div>
                  {Object.entries(task.fetch_config.auth_token.token).length > 0
                    ? Object.entries(task.fetch_config.auth_token.token).map(([key, value], index) => (
                      <div key={index} className="grid grid-cols-6 gap-4">
                        <input
                          type="text"
                          className="input input-sm col-span-2 w-full"
                          disabled={loading}
                          value={key}
                          onChange={(e) => handleChangeTokenKey(index, e.target.value)}
                        />
                        <label className="input input-sm col-span-3 w-full">
                          <input
                            type={showToken[index] ? "text" : "password"}
                            className="grow"
                            disabled={loading}
                            value={value}
                            onChange={(e) => handleChangeTokenValue(index, e.target.value)}
                          />
                          <button
                            type="button"
                            className={value ? "isible" : "hidden"}
                            onClick={() => setShowToken({ ...showToken, [index]: !showToken[index] })}
                          >
                            {showToken[index]
                              ? <FontAwesomeIcon icon={faEyeSlash} width={12} />
                              : <FontAwesomeIcon icon={faEye} width={12} />}
                          </button>
                        </label>
                        <button
                          className="btn btn-sm col-span-1 btn-error btn-outline"
                          onClick={() => handleDeleteToken(index)}
                        >
                          <FontAwesomeIcon icon={faTrash} width={12} />
                        </button>
                      </div>
                    ))
                    : <span className="label italic">No tokens yet</span>
                  }
                </div>
              </div>
            </div>

            {/* Enigx Config */}
            <div className="col-span-1">
              <span className="fieldset-legend">Enigx Config</span>
              <div className="flex flex-col gap-4 p-4 border border-base-content/20 rounded-md">
                <fieldset>
                  <legend className="fieldset-legend">Tenant ID</legend>
                  <input
                    type="text"
                    className="input input-sm w-60"
                    disabled={loading}
                    value={task.enigx_config.tenant_id}
                    onChange={(e) => setTask({ ...task, enigx_config: { ...task.enigx_config, tenant_id: e.target.value } })}
                  />
                </fieldset>
                <fieldset>
                  <legend className="fieldset-legend">Project ID</legend>
                  <input
                    type="text"
                    className="input input-sm w-60"
                    disabled={loading}
                    value={task.enigx_config.project_id}
                    onChange={(e) => setTask({ ...task, enigx_config: { ...task.enigx_config, project_id: e.target.value } })}
                  />
                </fieldset>
                <fieldset>
                  <legend className="fieldset-legend">Bearer Token</legend>
                  <label className="input input-sm flex items-center gap-2 w-60">
                    <input
                      type={showBearerToken ? "text" : "password"}
                      className="grow"
                      disabled={loading}
                      value={task.enigx_config.bearer_token}
                      onChange={(e) => setTask({ ...task, enigx_config: { ...task.enigx_config, bearer_token: e.target.value } })}
                    />
                    <button
                      type="button"
                      className={task.enigx_config.bearer_token ? "" : "hidden"}
                      onClick={() => setShowBearerToken(!showBearerToken)}
                    >
                      {showBearerToken
                        ? <FontAwesomeIcon icon={faEyeSlash} width={12} />
                        : <FontAwesomeIcon icon={faEye} width={12} />}
                    </button>
                  </label>
                </fieldset>
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="w-full flex">
            <button
              className="btn btn-primary btn-sm text-gray-100 px-8 w-20"
              onClick={handleSaveToken}
            >
              <FontAwesomeIcon icon={faSave} width={12} /> Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TaskEditPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TaskEditPageContent />
    </Suspense>
  )
}