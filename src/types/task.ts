import { extractKeys } from "@/utils/record";

export interface EnigxConfig {
  tenant_id: string;
  project_id: string;
  bearer_token: string;
}

export enum FetchMethod {
  GET = "get",
  POST = "post",
}
export const fetchMethodMap: Record<string, string> = {
  "get": "GET",
  "post": "POST",
}
export const fetchMethodCodes = extractKeys(fetchMethodMap);

export enum FetchDataType {
  JSON = "json",
  FILE = "file",
  HTML = "html",
}
export const fetchDataTypeMap: Record<string, string> = {
  "json": "JSON",
  "file": "File",
  "html": "HTML",
}
export const fetchDataTypeCodes = extractKeys(fetchDataTypeMap);

export enum FetchTokenType {
  HEADER_TOKEN = "header_token",
  QUERY_TOKEN = "query_token",
}
export const fetchTokenTypeMap: Record<string, string> = {
  "header_token": "Header Token",
  "query_token": "Query Token",
}
export const fetchTokenTypeCodes = extractKeys(fetchTokenTypeMap);

export interface FetchAuthToken {
  type: FetchTokenType;
  token: Record<string, string>;
}

export interface FetchConfig {
  method: FetchMethod;
  url: string;
  auth_token: FetchAuthToken;
  data_type: FetchDataType;
  success_code: number;
}

export enum TaskType {
  NORMAL = "normal",
  REZPONZA = "rezponza",
}
export const taskTypeMap: Record<string, string> = {
  "normal": "Normal",
  "rezponza": "Rezponza",
}
export const taskTypeCodes = extractKeys(taskTypeMap);

export interface TaskConfig {
  user_id: string | null;
  task_name: string;
  task_type: TaskType,
  description: string;
  fetch_config: FetchConfig;
  enigx_config: EnigxConfig;
  interval_secs: number;
  task_args: Record<string, string>;
}

export interface TaskConfigRead extends TaskConfig {
  _id: string | null;

  is_scheduled: boolean;
  next_run_time: string | null;
}

export enum TaskEditPageMode {
  EDIT = "edit",
  CREATE = "create",
}
