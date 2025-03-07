"use client";

import { customAlert, CustomAlertType } from "@/components/ui/alert";
import { axiosHelper } from "@/lib/axios";
import { loadCurrentUser } from "@/services/authService";
import { ApiGeneralResponse } from "@/types/api";
import { ChangePasswordRequest } from "@/types/auth";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface ChangePasswordFormData {
  new_password: string;
  conf_password: string;
}

const changePasswordSchema = yup.object().shape({
  new_password: yup.string().required("New password is required"),
  conf_password: yup.string().required("Please confirm your new password").oneOf([yup.ref("new_password")], "Passwords do not match"),
});

export default function LogoutPage() {
  const currentUser = loadCurrentUser();
  const {
    register: registerChangePassword,
    handleSubmit: handleSubmitChangePassword,
    watch: watchChangePassword,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: yupResolver(changePasswordSchema),
  })
  const [loadingChangePassword, setLoadingChangePassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  }
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  }

  // Update Password
  const onSubmitChangePassword = async (data: ChangePasswordFormData) => {
    setLoadingChangePassword(true);
    try {
      const response = await axiosHelper.post<ChangePasswordRequest, ApiGeneralResponse>("/user/change-password", data, {
        headers: {
          "Content-Type": "application/json",
        }
      });
      if (response) {
        customAlert({
          type: CustomAlertType.SUCCESS,
          title: "Password is changed",
          message: "Password is successfully changed. You can now login with your new password.",
        });
      }
    } catch (error: any) { // eslint-disable-line
      customAlert({
        type: CustomAlertType.ERROR,
        title: "Failed change password",
        message: error.response?.data.detail || error.message,
      });
    } finally {
      setLoadingChangePassword(false);
    }
  }

  return (
    <div>
      <div className="flex justify-between px-2 py-4">
        <p className="text-lg font-medium text-base-content">
          Profile
        </p>
      </div>
      <div className="p-4 min-h-[calc(100vh-11.4rem)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-screen-sm">
          {/* Username */}
          <div className="col-span-1 font-medium">Username</div>
          <div className="col-span-2 ml-2">{currentUser?.username}</div>
          {/* Password */}
          <div className="col-span-1 font-medium">Password</div>
          <form
            onSubmit={handleSubmitChangePassword(onSubmitChangePassword)}
            className="col-span-2 ml-2"
          >
            <div className="flex flex-col gap-2">
              <fieldset>
                <legend className="fieldset-label">New Password <span className="text-red-600">*</span></legend>
                <label className="input input-sm input-bordered flex items-center gap-2 w-60">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="new_password"
                    className="grow"
                    placeholder="******"
                    disabled={loadingChangePassword}
                    {...registerChangePassword("new_password", { required: "New password is required" })}
                  />
                  <button
                    type="button"
                    className={!watchChangePassword("new_password") ? "hidden" : ""}
                    onClick={() => handleClickShowNewPassword()}
                  >
                    {showNewPassword
                      ? <FontAwesomeIcon icon={faEyeSlash} width={12} />
                      : <FontAwesomeIcon icon={faEye} width={12} />}
                  </button>
                </label>
                {errors.new_password && (
                  <p className="text-red-500 text-sm mt-1">{errors.new_password.message}</p>
                )}
              </fieldset>
              <fieldset>
                <legend className="fieldset-label">New Password Confirm <span className="text-red-600">*</span></legend>
                <label className="input input-sm input-bordered flex items-center gap-2 w-60">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="conf_password"
                    className="grow"
                    placeholder="******"
                    disabled={loadingChangePassword}
                    {...registerChangePassword("conf_password", { required: "Confirm password is required" })}
                  />
                  <button
                    type="button"
                    className={!watchChangePassword("conf_password") ? "hidden" : ""}
                    onClick={() => handleClickShowConfirmPassword()}
                  >
                    {showConfirmPassword
                      ? <FontAwesomeIcon icon={faEyeSlash} width={12} />
                      : <FontAwesomeIcon icon={faEye} width={12} />}
                  </button>
                </label>
                {errors.conf_password && (
                  <p className="text-red-500 text-sm mt-1">{errors.conf_password.message}</p>
                )}
              </fieldset>
              <button
                type="submit"
                className="btn btn-sm btn-primary text-gray-100 w-20"
                disabled={loadingChangePassword}
              >
                {loadingChangePassword
                  ? <span className="loading loading-spinner loading-xs"></span>
                  : null}
                Change
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
