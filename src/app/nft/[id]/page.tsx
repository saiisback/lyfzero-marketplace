import React from 'react';
import { useParams } from 'next/navigation';
import { useContract, useNFT } from '@thirdweb-dev/react';
import NFTDetailView from '@/components/nft/NFTDetailView';

const NFTDetailPage: React.FC = () => {
  const params = useParams();
  const { id } = params;

  const { contract: nftCollectionContract } = useContract(process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS);
  const { data: nft, isLoading: loadingNft } = useNFT(nftCollectionContract, id as string);

  if (loadingNft) {
    return <div>Loading NFT details...</div>;
  }

  if (!nft) {
    return <div>NFT not found.</div>;
  }

  return (
    <NFTDetailView 
      nft={{ metadata: nft.metadata, owner: nft.owner, tokenId: nft.metadata.id }} 
    />
  );
};

export default NFTDetailPage;