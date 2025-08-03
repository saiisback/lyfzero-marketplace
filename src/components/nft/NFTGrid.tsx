import React from 'react';
import NFTCard from './NFTCard';

const NFTGrid: React.FC = () => {
  // Placeholder data
  const nfts = [1, 2, 3, 4, 5, 6];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {nfts.map((nft) => (
        <NFTCard key={nft} />
      ))}
    </div>
  );
};

export default NFTGrid;