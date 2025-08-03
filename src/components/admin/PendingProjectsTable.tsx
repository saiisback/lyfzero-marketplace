import React from 'react';

const PendingProjectsTable: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Pending Projects</h2>
      <div className="bg-gray-800 rounded-lg p-4">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="p-2">Project Name</th>
              <th className="p-2">Seller</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Placeholder for pending projects */}
            <tr>
              <td colSpan={3} className="text-center p-4">
                No pending projects.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingProjectsTable;