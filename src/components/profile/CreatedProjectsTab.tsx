import React from 'react';

const CreatedProjectsTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Projects</h2>
      <div className="bg-gray-800 rounded-lg p-4 text-center">
        <p>You haven't created any projects yet.</p>
      </div>
    </div>
  );
};

export default CreatedProjectsTab;