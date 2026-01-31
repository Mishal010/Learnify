import React, { useState, useEffect } from "react";
import { useProfile } from "../../hooks/queries/useProfile";
import Loader from "../Loader";
import { useUpdateProfile } from "../../hooks/mutation/useUpdateProfile";
import {
  User,
  Mail,
  Shield,
  Save,
  Camera,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const Profile = () => {
  const { data, isLoading } = useProfile();

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader />
      </div>
    );

  const user = data?.user;

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-scroll w-full bg-gray-50 font-sans text-slate-800 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Account Settings
          </h1>
          <p className="text-slate-500 mt-1">
            Manage your profile details and preferences.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Profile Summary Card (Span 4) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-white p-7 flex flex-col items-center text-center relative overflow-hidden">
              {/* Decorative Background Blur */}
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-50 to-pink-50"></div>

              {/* Avatar */}
              <div className="relative z-10 mt-0 mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-lg">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center border-4 border-white overflow-hidden">
                    {/* Fallback to Initials with Gradient Text */}
                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600">
                      {user.role === "student" ? (
                        <img
                          src="https://media.gettyimages.com/id/1212812078/vector/student-avatar-flat-icon-flat-vector-illustration-symbol-design-element.jpg?s=612x612&w=0&k=20&c=SouFqEm9Lcnv6GPGoRqLmazCb-SnlrWWa7bGpzmNpus="
                          alt="Avtar"
                        />
                      ) : (
                        <img
                          src="https://cdn-icons-png.flaticon.com/128/3429/3429440.png"
                          alt="Avtar"
                        />
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-1">
                {user?.name}
              </h2>
              <p className="text-slate-500 text-sm mb-6">{user?.email}</p>

              {/* Role Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold uppercase tracking-wider border border-indigo-100">
                <Shield size={14} />
                {user?.role}
              </div>

              {/* Stats / Info (Static for visuals) */}
              <div className="w-full flex justify-center mt-8 pt-8 border-t border-gray-100">
                <div>
                  <span className="block text-2xl font-bold text-slate-900">
                    Active
                  </span>
                  <span className="text-xs text-slate-400 font-medium uppercase">
                    Status
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Edit Form (Span 8) */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-white p-8">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Profile Details
                  </h3>
                  <p className="text-slate-500 text-sm">
                    Update your personal information.
                  </p>
                </div>
              </div>

              <UpdateForm user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UpdateForm = ({ user }) => {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isSuccess, setIsSuccess] = useState(false);

  const mutation = useUpdateProfile();

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    mutation.mutate(
      { name: name.trim(), email: email.trim() },
      {
        onSuccess: () => {
          setIsSuccess(true);
          setTimeout(() => setIsSuccess(false), 3000);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Name Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1">
            Full Name
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <User size={18} />
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium text-slate-800"
              placeholder="Your name"
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1">
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <Mail size={18} />
            </div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium text-slate-800"
              placeholder="you@example.com"
            />
          </div>
        </div>
      </div>

      {/* Role Input (Read Only) */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 ml-1">
          Role / Permissions
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Shield size={18} />
          </div>
          <input
            value={user?.role?.toUpperCase() || ""}
            disabled
            className="w-full pl-11 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-slate-500 font-medium cursor-not-allowed select-none"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <span className="text-xs font-bold text-slate-400 bg-slate-200 px-2 py-1 rounded">
              LOCKED
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-400 ml-1">
          Role cannot be changed directly.
        </p>
      </div>

      <div className="pt-2 flex items-center justify-between">
        {/* Error Message */}
        <div>
          {mutation.isError && (
            <p className="text-sm text-red-500 font-medium flex items-center gap-1">
              <AlertCircle size={16} />
              {mutation.error?.response?.data?.message || "Update failed"}
            </p>
          )}
          {isSuccess && (
            <p className="text-sm text-green-600 font-medium flex items-center gap-1 animate-pulse">
              <CheckCircle2 size={16} />
              Profile updated successfully!
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="flex items-center gap-2 px-8 py-3 rounded-xl text-white font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default Profile;
