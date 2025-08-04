import React from 'react';
import { ThirdwebNftMedia } from '@thirdweb-dev/react';
import { Listing } from '@thirdweb-dev/sdk';

interface NFTCardProps {
  listing: Listing;
}

const NFTCard: React.FC<NFTCardProps> = ({ listing }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-primary/50 transition-shadow duration-300">
      <ThirdwebNftMedia metadata={listing.asset} className="w-full h-56" />
      <div className="p-4">
        <h3 className="text-lg font-bold">{listing.asset.name}</h3>
        <p className="text-sm text-gray-400">{listing.asset.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-lg font-bold text-primary">
            {listing.currencyValuePerToken.displayValue} {listing.currencyValuePerToken.symbol}
          </p>
          {/* The PurchaseModal will be triggered from the NFTDetailView */}
        </div>
      </div>
    </div>
  );
};

export default NFTCard;