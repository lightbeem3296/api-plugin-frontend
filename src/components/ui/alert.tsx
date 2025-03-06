import { extractKeys, lookupValue } from "@/utils/record";
import { Bounce, toast, ToastOptions } from "react-toastify"

export enum CustomAlertType {
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
}

interface CustomAlertProps {
  type?: CustomAlertType,
  title?: string,
  message?: string,
  detail?: Record<string, string>,
}

export const customAlert = ({ type, title, message, detail }: CustomAlertProps) => {
  if (!title) {
    switch (type) {
      case CustomAlertType.INFO:
        title = "Info";
        break;
      case CustomAlertType.SUCCESS:
        title = "Success";
        break;
      case CustomAlertType.WARNING:
        title = "Warning";
        break;
      case CustomAlertType.ERROR:
        title = "Error";
        break;
      default:
        title = "Alert";
    }
  }

  const content = (
    <div className="flex flex-col">
      <h1 className="font-medium py-2">
        {title}
      </h1>
      <p className="text-sm">
        {message}
      </p>
      {extractKeys(detail).map((key) => (
        <div key={key} className="grid grid-cols-4 text-xs">
          <div className="col-span-1 font-medium">
            {key}
          </div>
          <pre className="col-span-3 overflow-auto">
            {lookupValue(detail, key)}
          </pre>
        </div>
      ))}
    </div>
  );
  const alertOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
  };

  switch (type) {
    case CustomAlertType.INFO:
      toast.info(content, alertOptions);
      break;
    case CustomAlertType.SUCCESS:
      toast.success(content, alertOptions);
      break;
    case CustomAlertType.WARNING:
      toast.warning(content, alertOptions);
      break;
    case CustomAlertType.ERROR:
      toast.error(content, alertOptions);
      break;
    default:
      toast.info(content, alertOptions);
  }
}
