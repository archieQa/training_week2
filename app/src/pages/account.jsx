/* eslint-disable react/display-name */
import React, { useState } from "react";
import store from "../store";
import toast from "react-hot-toast";

import Loader from "../components/loader";
import LoadingButton from "../components/loadingButton";

import api from "../services/api";

export default () => {
  const { user, setUser } = store()
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState({ ...user });
  const { EP_Group_ensTrainNet3 } = require("../utils/constants.js");

  const dispatch = useDispatch();
  if (!user) return <Loader />;

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    let body = values;
    try {
      const responseData = await api.put(`/user/${user._id}`, body);
      if (responseData.code) throw responseData.code;
      toast.success("Updated!");
      dispatch(setUser(responseData.data));
    } catch (e) {
      console.log(e);
      toast.error("Some Error! " + e);
    }
    setIsLoading(false);
  }

  const handleOrgEmailChange = (e) => {
    const enteredName = e.target.value;
    const matchingOption = EP_Group_ensTrainNet3.find((option) => option.value === enteredName);

    if (matchingOption) {
      // If the entered email matches one of the options, set organisation_name and organisation_email
      setValues({
        ...values,
        organisation_name: enteredName,
        organisation_email: matchingOption.email,
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-primary-black-50">
      <h1 className="text-primary-black-100 text-h1 font-bold">My account</h1>
      <div className="grid grid-cols-2  gap-4">
        <div className="w-full">
          <div className="text-sm font-medium mb-2">Name</div>
          <input className="input" value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} />
        </div>
        <div className="w-full">
          <div className="text-sm font-medium mb-2">Email</div>
          <input className="input" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} />
        </div>
        <div className="w-full">
          <div className="text-sm font-medium mb-2">Intermediary organisation name</div>
          <select
            className="input"
            value={values.organisation_name || ""}
            onChange={(e) => {
              handleOrgEmailChange(e);
            }}>
            {EP_Group_ensTrainNet3?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full">
          <div className="text-sm font-medium mb-2">Intermediary organisation email</div>
          <input className="input" type="email" value={values.organisation_email} onChange={(e) => setValues({ ...values, organisation_email: e.target.value })} />
        </div>
      </div>
      <LoadingButton className="bg-primary text-white py-2.5 px-3 rounded-md" loading={isLoading} onClick={handleSubmit}>
        Update
      </LoadingButton>
    </div>
  );
};

const ChangePassword = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button className="text-[#007bff] py-[15px] hover:underline" onClick={() => setOpen(true)}>
        Change password
      </button>

      {open ? (
        <div
          className="absolute top-0 bottom-0 left-0 right-0 bg-[#00000066] flex justify-center p-[1rem] z-50 "
          onClick={() => {
            // close modal when outside of modal is clicked
            setOpen(false);
          }}>
          <div
            className="w-full md:w-[35%] max-h-[400px] bg-[white] pt-[20px] rounded-md"
            onClick={(e) => {
              // do not close modal if anything inside modal content is clicked
              e.stopPropagation();
            }}>
            {/* Modal Body */}
            <div>
              <h5 className="text-[1.25rem] pl-3">Change password</h5>
              <hr className="my-3" />
              <div className="px-3">
                <Formik
                  initialValues={{ password: "", newPassword: "", verifyPassword: "" }}
                  onSubmit={async (values, actions) => {
                    try {
                      const res = await api.post(`/user/reset_password`, values);
                      if (!res.ok) throw res;
                      toast.success("Password changed!");
                      setOpen(false);
                    } catch (e) {
                      console.log("error", e.code);
                      toast.error("error", e.code);
                    }
                    actions.setSubmitting(false);
                  }}>
                  {({ values, isSubmitting, handleChange, handleSubmit }) => {
                    return (
                      <div autoComplete="off">
                        {/* Password */}
                        <div className="w-full">
                          <label>Password</label>
                          <input className="input mt-0" name="password" type="password" value={values.password} onChange={handleChange} />
                        </div>
                        {/* New Password */}
                        <div className="w-full mt-3">
                          <label>New Password</label>
                          <input className="input mt-0" name="newPassword" type="password" value={values.newPassword} onChange={handleChange} />
                        </div>
                        {/* Re-Type Password */}
                        <div className="w-full my-3">
                          <label>Re-type Password</label>
                          <input className="input mt-0" name="verifyPassword" type="password" value={values.verifyPassword} onChange={handleChange} />
                        </div>
                        {/* Update Button */}
                        <button
                          className="ml-[10px] bg-[#17a2b8] hover:bg-[#138496] text-[1rem] text-[#fff] py-[0.375rem] px-[0.75rem] rounded-[0.25rem]"
                          disabled={isSubmitting}
                          onClick={handleSubmit}>
                          Update
                        </button>
                      </div>
                    );
                  }}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
