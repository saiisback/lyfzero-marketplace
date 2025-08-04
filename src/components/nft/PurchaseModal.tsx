import React from 'react';
import { Web3Button, useContract, useBuyNow } from '@thirdweb-dev/react';
import { Listing } from '@thirdweb-dev/sdk';

interface PurchaseModalProps {
  listing: Listing;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ listing }) => {
  const { contract } = useContract(process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS, 'marketplace-v3');
  const { mutate: buyNow, isLoading, error } = useBuyNow(contract);

  const handlePurchase = async () => {
    try {
      await buyNow({ 
        id: listing.id, 
        buyAmount: 1, 
        type: listing.type 
      });
    } catch (err) {
      console.error(err);
      alert("Error purchasing NFT");
    }
  };

  return (
    <Web3Button
      contractAddress={process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!}
      action={handlePurchase}
      className="!bg-primary !hover:bg-primary-dark !text-primary-foreground !font-bold !py-3 !px-6 !rounded-lg !text-lg"
      isDisabled={isLoading}
    >
      {isLoading ? 'Purchasing...' : 'Buy Now'}
    </Web3Button>
  );
};

export default PurchaseModal;