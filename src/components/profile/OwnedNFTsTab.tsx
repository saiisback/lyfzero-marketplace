import React from 'react';

const OwnedNFTsTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My NFTs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Placeholder for owned NFTs */}
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <p>You don't own any NFTs yet.</p>
        </div>
      </div>
    </div>
  );
};

export default OwnedNFTsTab;