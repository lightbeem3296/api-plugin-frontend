import { customAlert, CustomAlertType } from "@/components/ui/alert";
import axios, { AxiosRequestConfig, AxiosInstance } from "axios";

export class AxiosHelper {
  private axiosInstance: AxiosInstance;

  constructor(baseUrl: string) {
    // Create an Axios instance with a custom base URL
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
    });

    this.axiosInstance.interceptors.request.use(
      (config) => {
        const accessToken = localStorage.getItem("accessToken");
        config.headers["Authorization"] = `Bearer ${accessToken}`;
        return config;
      },
      (err) => {
        Promise.reject(err);
      }
    );
  }

  // Generic GET request
  async get<T>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<T | undefined> {
    try {
      const response = await this.axiosInstance.get<T>(endpoint, config);
      return response.data;
    } catch (error: unknown) {
      await this.handleError(error);
    }
  }

  // Generic POST request
  async post<T, R>(
    endpoint: string,
    data: T,
    config?: AxiosRequestConfig,
  ): Promise<R | undefined> {
    try {
      const response = await this.axiosInstance.post<R>(
        endpoint,
        data,
        config
      );
      return response.data;
    } catch (error: unknown) {
      await this.handleError(error);
    }
  }

  // Generic POST Download request
  async download_post<T>(
    endpoint: string,
    data: T,
  ) {
    try {
      const response = await this.axiosInstance.post<BlobPart>(
        endpoint,
        data,
        {
          responseType: "blob",
        }
      );

      // Extract the filename from the response headers
      const contentDisposition = response.headers["content-disposition"];
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : "downloaded-file";

      // Create a URL for the downloaded blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create an anchor element and trigger a download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: unknown) {
      await this.handleError(error);
    }
  }

  // Generic PUT request
  async put<T, R>(
    endpoint: string,
    data: T,
  ): Promise<R | undefined> {
    try {
      const response = await this.axiosInstance.put<R>(endpoint, data);
      return response.data;
    } catch (error: unknown) {
      await this.handleError(error);
    }
  }

  // Generic PATCH request
  async patch<T, R>(
    endpoint: string,
    data: T,
  ): Promise<R | undefined> {
    try {
      const response = await this.axiosInstance.patch<R>(endpoint, data);
      return response.data;
    } catch (error: unknown) {
      await this.handleError(error);
    }
  }

  // Generic DELETE request
  async delete<R>(
    endpoint: string,
  ): Promise<R | undefined> {
    try {
      const response = await this.axiosInstance.delete<R>(endpoint);
      return response.data;
    } catch (error: unknown) {
      await this.handleError(error);
    }
  }

  // Centralized error handler
  private async handleError(error: unknown) {
    if (axios.isAxiosError(error)) {
      // console.error("Axios error:", error.response?.data || error.message);
      if (error.response?.status === 422) {
        let details = undefined;

        const data = error.response.data;
        if (data instanceof Blob) {
          const jsonData = JSON.parse(await data.text());
          console.log(jsonData);
          details = Array.isArray(jsonData.detail)
            ? jsonData.detail
            : undefined;
        } else {
          details = Array.isArray(error.response.data.detail)
            ? error.response.data.detail
            : undefined;
        }

        const title = "Validation Error";
        let message = "";
        let alertDetail: Record<string, string> | undefined = undefined;
        if (details) {
          alertDetail = {}
          for (let i = 0; i < details.length; i++) {
            const detail = details[i];
            const detail_type = detail.type;
            let detail_loc = "";
            for (let j = 0; j < detail.loc.length; j++) {
              detail_loc += j === 0 ? detail.loc[j] : " > " + detail.loc[j];
            }
            const detail_message = detail.msg;
            const detail_input = JSON.stringify(detail.input, null, 2);

            alertDetail["Type"] = detail_type;
            alertDetail["Location"] = detail_loc;
            alertDetail["Message"] = detail_message;
            alertDetail["Input"] = detail_input;
          }
        } else {
          message = JSON.stringify(error.response.data, null, 2);
        }

        customAlert({
          type: CustomAlertType.ERROR,
          title: title,
          message: message,
          detail: alertDetail,
        });
      } else if (error.response?.status === 401) {
        window.location.href = "/auth/login";
      } else if (error.response?.status === 400) {
        console.log(error.response?.data.detail);
        customAlert({
          type: CustomAlertType.ERROR,
          title: "Error",
          message: error.response?.data.detail,
        });
      } else {
        customAlert({
          type: CustomAlertType.ERROR,
          title: "Axios Error",
          message: JSON.stringify(error.response?.data, null, 2) || error.message,
        });
      }
    } else {
      console.error("Unexpected error:", error);
      customAlert({
        type: CustomAlertType.ERROR,
        title: "Unexpected Error",
        message: "An unexpected error occurred. Please try again.",
      });
    }
  }
}

// Instance
export const axiosHelper = new AxiosHelper(process.env.NEXT_PUBLIC_FRONTEND_API_BASE_URL || "");
