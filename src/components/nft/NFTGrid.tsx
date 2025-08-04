import React from 'react';
import { useActiveListings, useContract } from '@thirdweb-dev/react';
import NFTCard from './NFTCard';

const NFTGrid: React.FC = () => {
  const { contract } = useContract(process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS, 'marketplace-v3');
  const { data: listings, isLoading } = useActiveListings(contract);

  if (isLoading) {
    return <div>Loading listings...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {listings && listings.length > 0 ? (
        listings.map((listing) => (
          <NFTCard key={listing.id} listing={listing} />
        ))
      ) : (
        <p>No listings found.</p>
      )}
    </div>
  );
};

export default NFTGrid;