import React from 'react';
import { useAddress, useContract, useOwnedNFTs, ThirdwebNftMedia } from '@thirdweb-dev/react';
import Link from 'next/link';

const OwnedNFTsTab: React.FC = () => {
  const address = useAddress();
  const { contract: nftCollectionContract } = useContract(process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS);
  const { data: ownedNfts, isLoading: loadingOwnedNfts } = useOwnedNFTs(nftCollectionContract, address);

  if (!address) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 text-center">
        <p>Connect your wallet to view your NFTs.</p>
      </div>
    );
  }

  if (loadingOwnedNfts) {
    return <div>Loading your NFTs...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My NFTs</h2>
      {ownedNfts && ownedNfts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ownedNfts.map((nft) => (
            <Link href={`/nft/${nft.metadata.id}`} key={nft.metadata.id}>
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-primary/50 transition-shadow duration-300 cursor-pointer">
                <ThirdwebNftMedia metadata={nft.metadata} className="w-full h-56" />
                <div className="p-4">
                  <h3 className="text-lg font-bold">{nft.metadata.name}</h3>
                  <p className="text-sm text-gray-400">ID: {nft.metadata.id}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <p>You don't own any NFTs yet.</p>
        </div>
      )}
    </div>
  );
};

export default OwnedNFTsTab;