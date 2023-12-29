import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useHistory } from "react-router-dom";

import Loader from "../../components/loader";

import api from "../../services/api";

export default () => {
  const [user, setUser] = useState();
  const [values, setValues] = useState({});

  const { id } = useParams();
  const history = useHistory();

  const { EP_Group_ensTrainNet3} = require("../../utils/constants.js");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/user/${id}`);
        setUser(data);
        setValues(data);
      } catch (e) {
        toast.error(e.message);
      }
    })();
  }, [id]);
  
  const onUpdate = async () => {
    const { data } = await api.put(`/user/${id}`, values);
    toast.success("Updated!");
  };

  const onDelete = async () => {
    if (!confirm("Are you sure?")) return;
    const { data } = await api.remove(`/user/${id}`);
    toast.success("Delete!");
    history.push("/user");
  };

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

  if (!user) return <Loader />;

  return (
    <div className="bg-white rounded-md p-8 border border-primary-black-50">
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
              onChange={(e) => { handleOrgEmailChange(e)}}
            >
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
      <div className="flex items-center space-x-2 mt-4">
        <button className="btn btn-primary" onClick={onUpdate}>
          Update
        </button>
        <button className="btn btn-red" onClick={onDelete}>
            Delete
          </button>
      </div>
    </div>
  );
};
