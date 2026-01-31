import React from "react";
import Loader from "../Loader";
import { useAllPayments } from "../../hooks/queries/useAllPayments";
import { useSearchParams } from "react-router-dom";

const AdminPayments = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "25");
  const { data, isLoading } = useAllPayments({ page, limit });
  if (isLoading) return <Loader />;

  const payments = data?.result || data?.payments || data?.data?.result || [];
  const pagination = data?.pagination || data?.data?.pagination || { page, totalPages: 1, hasNextPage: false, hasPrevPage: false, total: payments.length };

  const updateParams = (newParams) => {
    const params = Object.fromEntries([...searchParams]);
    Object.assign(params, newParams);
    setSearchParams(params);
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full bg-gray-100 text-black px-4 py-5 md:px-10 overflow-y-auto">
      <h1 className="text-3xl font-semibold mb-4">Payments</h1>

      <div className="bg-white shadow rounded-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((p, idx) => (
              <tr key={p._id || idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{idx + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(p._id || p.paymentId || '').toString().slice(-8)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.user?.name || p.user?.email || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.amount} {p.currency || ''}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${p.status === 'completed' ? 'bg-green-100 text-green-800' : p.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(p.courses || []).map(c=>c.title || c).join(', ')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(p.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">Showing {payments.length} of {pagination.total || payments.length}</div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Rows:</label>
          <select
            value={limit}
            onChange={(e) => updateParams({ limit: String(Number(e.target.value)), page: '1' })}
            className="text-sm border rounded px-2 py-1"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>

          <nav className="inline-flex -space-x-px" aria-label="Pagination">
            <button
              onClick={() => updateParams({ page: String(Math.max(1, page - 1)), limit: String(limit) })}
              disabled={!pagination.hasPrevPage || page <= 1}
              className="px-3 py-1 bg-white border border-gray-300 text-sm rounded-l disabled:opacity-50"
            >Prev</button>

            {Array.from({ length: Math.max(1, pagination.totalPages) }).map((_, i) => {
              const p = i + 1;
              return (
                <button key={p} onClick={() => updateParams({ page: String(p), limit: String(limit) })} className={`px-3 py-1 border-t border-b border-gray-300 text-sm ${p === page ? 'bg-gray-200' : 'bg-white'}`}>{p}</button>
              );
            })}

            <button
              onClick={() => updateParams({ page: String(Math.min(pagination.totalPages || page + 1, pagination.totalPages || page + 1)), limit: String(limit) })}
              disabled={!pagination.hasNextPage || page >= (pagination.totalPages || 1)}
              className="px-3 py-1 bg-white border border-gray-300 text-sm rounded-r disabled:opacity-50"
            >Next</button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
