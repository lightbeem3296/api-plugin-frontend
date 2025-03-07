"use client";

import { customAlert, CustomAlertType } from "@/components/ui/alert";
import { axiosHelper } from "@/lib/axios";
import { ApiGeneralResponse } from "@/types/api";
import { FetchDataType, fetchDataTypeCodes, fetchDataTypeMap, FetchMethod, fetchMethodCodes, fetchMethodMap, FetchTokenType, TaskConfig, TaskEditPageMode } from "@/types/task";
import { lookupValue } from "@/utils/record";
import { faArrowLeft, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function TaskEditPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const modeFromParams = searchParams?.get("mode");
  const pageMode = Object.values(TaskEditPageMode).includes(modeFromParams as TaskEditPageMode) ? modeFromParams : TaskEditPageMode.EDIT;
  const taskID = searchParams?.get("id");
  const [loading, setLoading] = useState(false);

  const [task, setTask] = useState<TaskConfig>({
    user_id: "string",
    task_name: "string",
    description: "string",
    fetch_config: {
      method: FetchMethod.GET,
      url: "string",
      auth_token: {
        type: FetchTokenType.HEADER_TOKEN,
        token: {
          additionalProp1: "string",
          additionalProp2: "string",
          additionalProp3: "string"
        }
      },
      data_type: FetchDataType.JSON,
      success_code: 200
    },
    enigx_config: {
      tenant_id: "string",
      project_id: "string",
      bearer_token: "string"
    },
    interval_secs: 0,
  });

  const fetchTask = async () => {
    const response = await axiosHelper.get<TaskConfig>(`/task/get/${taskID}`);
    if (response) {
      setTask(response);
    }
  }

  // UI Handlers
  const handleClickBack = () => {
    router.push("/main/tasks");
  }

  const handleChangeFetchMethod = (value: string) => {
    setTask({ ...task, fetch_config: { ...task.fetch_config, method: value as FetchMethod } })
  }

  const handleChangeDataType = (value: string) => {
    setTask({ ...task, fetch_config: { ...task.fetch_config, data_type: value as FetchDataType } })
  }

  const handleSave = async () => {
    setLoading(true);
    try {
      if (pageMode === TaskEditPageMode.CREATE) {
        const response = await axiosHelper.post<TaskConfig, ApiGeneralResponse>(`/task/create`, task, undefined);
        if (response) {
          customAlert({
            type: CustomAlertType.SUCCESS,
            message: "Created successfully.",
          });
          router.push("/main/tasks");
        }
      } else if (pageMode === TaskEditPageMode.EDIT) {
        const response = await axiosHelper.put<TaskConfig, ApiGeneralResponse>(`/task/update/${taskID}`, task);
        if (response) {
          customAlert({
            type: CustomAlertType.SUCCESS,
            message: "Updated successfully.",
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
        </div>
      </div>
      <div className="h-fit min-h-[calc(100vh-11.4rem)]">
        <div className="w-full flex flex-col gap-4">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Task Name */}
            <fieldset>
              <legend className="fieldset-legend">Task Name</legend>
              <label className="input input-sm input-bordered flex items-center gap-2 w-60">
                <input
                  type="text"
                  className="grow"
                  disabled={loading}
                  value={task.task_name}
                  onChange={(e) => setTask({ ...task, task_name: e.target.value })}
                />
              </label>
            </fieldset>

            {/* Task Description */}
            <fieldset>
              <legend className="fieldset-legend">Description</legend>
              <label className="input input-sm input-bordered flex items-center gap-2 w-60">
                <input
                  type="text"
                  className="w-full"
                  disabled={loading}
                  value={task.description}
                  onChange={(e) => setTask({ ...task, description: e.target.value })}
                />
              </label>
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
                    onChange={(e) => handleChangeFetchMethod(e.target.value)}
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
                  <label className="input input-sm input-bordered flex items-center gap-2 w-60">
                    <input
                      type="text"
                      className="grow"
                      disabled={loading}
                      value={task.fetch_config.url}
                      onChange={(e) => setTask({ ...task, fetch_config: { ...task.fetch_config, url: e.target.value } })}
                    />
                  </label>
                </fieldset>
                <fieldset>
                  <legend className="fieldset-legend">Auth Token</legend>
                  <label className="input input-sm input-bordered flex items-center gap-2 w-60">
                    <input
                      type="text"
                      className="grow"
                      disabled={loading}
                      value={task.fetch_config.auth_token.type}
                      onChange={(e) => setTask({ ...task, fetch_config: { ...task.fetch_config, auth_token: { ...task.fetch_config.auth_token, type: e.target.value as FetchTokenType } } })}
                    />
                  </label>
                </fieldset>
                <fieldset>
                  <legend className="fieldset-legend">Data Type</legend>
                  <select
                    className="select select-bordered select-sm w-60"
                    value={task.fetch_config.data_type}
                    onChange={(e) => handleChangeDataType(e.target.value)}
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
                  <label className="input input-sm input-bordered flex items-center gap-2 w-60">
                    <input
                      type="text"
                      className="grow"
                      disabled={loading}
                      value={task.fetch_config.success_code}
                      onChange={(e) => setTask({ ...task, fetch_config: { ...task.fetch_config, success_code: parseInt(e.target.value) } })}
                    />
                  </label>
                </fieldset>
              </div>
            </div>

            {/* Enigx Config */}
            <div className="col-span-1">
              <span className="fieldset-legend">Enigx Config</span>
              <div className="flex flex-col gap-4 p-4 border border-base-content/20 rounded-md">
                <fieldset>
                  <legend className="fieldset-legend">Tenant ID</legend>
                  <label className="input input-sm input-bordered flex items-center gap-2 w-60">
                    <input
                      type="text"
                      className="grow"
                      disabled={loading}
                      value={task.enigx_config.tenant_id}
                      onChange={(e) => setTask({ ...task, enigx_config: { ...task.enigx_config, tenant_id: e.target.value } })}
                    />
                  </label>
                </fieldset>
                <fieldset>
                  <legend className="fieldset-legend">Project ID</legend>
                  <label className="input input-sm input-bordered flex items-center gap-2 w-60">
                    <input
                      type="text"
                      className="grow"
                      disabled={loading}
                      value={task.enigx_config.project_id}
                      onChange={(e) => setTask({ ...task, enigx_config: { ...task.enigx_config, project_id: e.target.value } })}
                    />
                  </label>
                </fieldset>
                <fieldset>
                  <legend className="fieldset-legend">Bearer Token</legend>
                  <label className="input input-sm input-bordered flex items-center gap-2 w-60">
                    <input
                      type="text"
                      className="grow"
                      disabled={loading}
                      value={task.enigx_config.bearer_token}
                      onChange={(e) => setTask({ ...task, enigx_config: { ...task.enigx_config, bearer_token: e.target.value } })}
                    />
                  </label>
                </fieldset>
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="w-full flex">
            <button
              className="btn btn-primary btn-sm text-gray-100 px-8 w-20"
              onClick={handleSave}
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