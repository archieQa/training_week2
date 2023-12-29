import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-hot-toast";

import Loader from "../../components/loader";
import Modal from "../../components/modal";

import api from "../../services/api";
import store from "../../store";

export default () => {
  const [users, setUsers] = useState();

  const {user } = store();

  const history = useHistory();

  useEffect(() => {
    (async () => {
      const { data } = await api.get("/user");
      setUsers(data);
    })();
  }, []);

  if (!users) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-h1">Users</h3>
        <Create />
      </div>

      <div className="flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ring-1 ring-primary-black-50 sm:rounded-lg">
              <table className="min-w-full divide-y divide-primary-black-50">
                <thead className="bg-white">
                  <tr>
                    <th scope="col" className="p-3 text-left text-h3-semibold text-primary-black-100">
                      Name
                    </th>
                    <th scope="col" className="p-3 text-left text-h3-semibold text-primary-black-100">
                      Email
                    </th>
                    <th scope="col" className="p-3 text-left text-h3-semibold text-primary-black-100">
                      IO Name
                    </th>
                    <th scope="col" className="p-3 text-left text-h3-semibold text-primary-black-100">
                      IO Email
                    </th>
                    <th scope="col" className="p-3 text-left text-h3-semibold text-primary-black-100">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-black-50 bg-white">
                  {users.map((e) => (
                    <tr
                      key={e.email}
                      className={`odd:bg-[#FCFCFC] ${user.role === "admin" && "hover:bg-primary-black-40 cursor-pointer"}`}
                      onClick={() => user.role === "admin" && history.push(`/user/${e._id}`)}
                    >
                      <td className="whitespace-nowrap p-3 text-sm text-primary-black-90">{e.name}</td>
                      <td className="whitespace-nowrap p-3 text-sm text-primary-black-90">
                        <a onClick={(e) => e.stopPropagation()} href={`mailto:${e.email}`} target="_blank" className="hover:underline">
                          {e.email}
                        </a>
                      </td>
                      <td className="whitespace-nowrap p-3 text-sm text-primary-black-90">{e.organisation_name}</td>
                      <td className="whitespace-nowrap p-3 text-sm text-primary-black-90">
                        <a onClick={(e) => e.stopPropagation()} href={`mailto:${e.organisation_email}`} target="_blank" className="hover:underline">
                          {e.organisation_email}
                        </a>
                      </td>
                      <td className="whitespace-nowrap p-3 text-sm text-primary-black-90">{(e.created_at || "")?.slice(0, 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Create = () => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({ password: "Abc123$$" });
  const history = useHistory();

  async function onCreate() {
    const res = await api.post("/user", values);
    toast.success("Created!");
    history.push(`/user/${res.data._id}`);
  }

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setOpen(true)}>
        Create user
      </button>

      <Modal isOpen={open} className="max-w-xl w-full p-6" onClose={() => setOpen(false)}>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="w-full">
            <div className="text-sm font-medium mb-2">Name</div>
            <input className="input block" value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} />
          </div>
          <div className="w-full">
            <div className="text-sm font-medium mb-2">Email</div>
            <input className="input block" type="email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} />
          </div>
          <div className="w-full">
            <div className="text-sm font-medium mb-2">Organisation name</div>
            <input className="input block" value={values.organisation_name} onChange={(e) => setValues({ ...values, organisation_name: e.target.value })} />
          </div>
          <div className="w-full">
            <div className="text-sm font-medium mb-2">Organisation email</div>
            <input className="input block" value={values.organisation_email} onChange={(e) => setValues({ ...values, organisation_email: e.target.value })} />
          </div>

          <div className="w-full">
            <div className="text-sm font-medium mb-2">Password</div>
            <input className="input block" value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })} />
          </div>
        </div>

        <button
          className="btn btn-primary mt-4 disabled:opacity-80 disabled:cursor-not-allowed"
          disabled={!values.name || !values.email || !values.organisation_name || !values.organisation_email || !values.password}
          onClick={onCreate}
        >
          Create
        </button>
      </Modal>
    </div>
  );
};
