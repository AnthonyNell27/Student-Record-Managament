import { useEffect, useState } from 'react';
import { FaHistory } from 'react-icons/fa';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://192.168.0.219/student_rec/rec/api/get_logs.php')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setLogs(data.data.reverse());
        }
      })
      .catch(err => console.error('Failed to load logs', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-3 pt-3 h-full text-gray-800 dark:text-gray-100">
      <div className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col h-[645px]">
        <div className="flex items-center gap-2 mb-4">
          <FaHistory className="text-blue-600 text-2xl" />
          <h2 className="text-lg font-semibold">Audit Logs</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center flex-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex justify-center items-center flex-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">No audit logs found.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-blue-700 text-white uppercase text-xs">
                <tr>
                  <th className="px-4 py-2">Username</th>
                  <th className="px-4 py-2">Action</th>
                  <th className="px-4 py-2">Details</th>
                  <th className="px-4 py-2">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {logs.map((log, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}
                  >
                    <td className="px-4 py-2">{log.username}</td>
                    <td className="px-4 py-2 capitalize">{log.action.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-2">{log.details || '-'}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
