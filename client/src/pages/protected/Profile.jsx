import React, { useState } from "react";
import { useProfile } from "../../hooks/queries/useProfile";
import Loader from "../Loader";
import { useUpdateProfile } from "../../hooks/mutation/useUpdateProfile";

const Profile = () => {
  const { data, isLoading } = useProfile();
  if (isLoading) return <Loader />;

  return (
    <div className="h-[calc(100vh-64px)] w-full bg-gray-100 text-black px-4 py-5 md:px-10 overflow-y-scroll flex gap-2 flex-col lg:flex-row">
      <div className="flex-1 bg-gray-200 flex flex-row lg:flex-col items-center justify-center gap-10 max-sm:gap-2 max-sm:overflow-scroll p-2">
        <div className="shrink-0 w-50 h-50 rounded-full bg-white flex items-center justify-center text-7xl font-bold max-sm:w-20 max-sm:h-20 max-sm:text-[25px]">
          AM
        </div>
        <div className="flex flex-col gap-4 max-sm:gap-1">
          <p className="text-2xl font-medium max-sm:text-[17px]">
            Name: <span className="font-bold">{data.user.name}</span>
          </p>
          <p className="text-2xl font-medium max-sm:text-[17px]">
            Email:{" "}
            <span className="text-[17px] font-bold max-sm:text-sm">
              {data.user.email}
            </span>
          </p>
          <p className="text-2xl font-medium max-sm:text-[17px]">
            Role:{" "}
            <span className="py-1 px-4 bg-green-200 border-1 border-green-700 rounded-full text-[20px] font-bold text-green-900 max-sm:text-sm">
              {data.user.role.toUpperCase()}
            </span>
          </p>
        </div>
      </div>
      <div className="flex-1 bg-gray-200 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>

        <UpdateForm user={data.user} />
      </div>
    </div>
  );
};

const UpdateForm = ({ user }) => {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");

  const mutation = useUpdateProfile();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    mutation.mutate({ name: name.trim(), email: email.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Your name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Email
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="you@example.com"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={mutation.isLoading}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            mutation.isLoading
              ? "bg-indigo-300"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {mutation.isLoading ? "Updating..." : "Update Profile"}
        </button>

        {mutation.isError && (
          <p className="text-sm text-red-600">
            {mutation.error?.response?.data?.message || "Update failed"}
          </p>
        )}
      </div>
    </form>
  );
};

export default Profile;
