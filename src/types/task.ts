export interface EnigxConfig {
  tenant_id: string;
  project_id: string;
  bearer_token: string;
}

export enum FetchMethod {
  GET = "get",
  POST = "post",
}

export enum FetchDataType {
  JSON = "json",
  FILE = "file",
  HTML = "html",
}

export enum FetchTokenType {
  HEADER_TOKEN = "header_token",
  QUERY_TOKEN = "query_token",
}

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

export interface TaskConfig {
  user_id: string;
  task_name: string;
  description: string;
  fetch_config: FetchConfig;
  enigx_config: EnigxConfig;
  interval_secs: number;
}

export interface TaskConfigRead extends TaskConfig {
  _id: string;

  is_scheduled: boolean;
  next_run_time: string | null;
}