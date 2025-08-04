import React from 'react';
import { Web3Button, useContract, useBuyNow } from '@thirdweb-dev/react';
import { Listing } from '@thirdweb-dev/sdk';
import toast from 'react-hot-toast';

interface PurchaseModalProps {
  listing: Listing;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ listing }) => {
  const { contract } = useContract(process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS, 'marketplace-v3');
  const { mutate: buyNow, isLoading, error } = useBuyNow(contract);

  const handlePurchase = async () => {
    const loadingToast = toast.loading('Purchasing NFT...');
    try {
      await buyNow({ 
        id: listing.id, 
        buyAmount: 1, 
        type: listing.type 
      });
      toast.success('NFT purchased successfully!', { id: loadingToast });
    } catch (err: any) {
      console.error(err);
      toast.error(`Error purchasing NFT: ${err.message || err.toString()}`, { id: loadingToast });
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