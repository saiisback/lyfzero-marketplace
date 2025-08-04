import React from 'react';
import { useActiveListings, useContract } from '@thirdweb-dev/react';
import NFTCard from './NFTCard';
import toast from 'react-hot-toast';

const NFTGrid: React.FC = () => {
  const { contract } = useContract(process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS, 'marketplace-v3');
  const { data: listings, isLoading, error } = useActiveListings(contract);

  if (isLoading) {
    return <div>Loading listings...</div>;
  }

  if (error) {
    toast.error('Error fetching listings.');
    return <div>Error loading listings.</div>;
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