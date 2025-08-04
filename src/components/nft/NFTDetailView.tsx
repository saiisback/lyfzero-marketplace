"use client";
import React, { useEffect, useState } from 'react';
import { NFTMetadata, Project } from '@/types';
import ProjectDetailHeader from '../project/ProjectDetailHeader';
import PurchaseModal from './PurchaseModal';
import { supabase } from '@/lib/supabase';
import { useAddress, useContract, useBurnNFT } from '@thirdweb-dev/react';
import toast from 'react-hot-toast';

interface NFTDetailViewProps {
  nft: { metadata: NFTMetadata; owner: string; tokenId: string }; // Added owner and tokenId
}

const NFTDetailView: React.FC<NFTDetailViewProps> = ({ nft }) => {
  const address = useAddress();
  const { contract: nftCollectionContract } = useContract(process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS);
  const { mutate: burnNft, isLoading: isBurning, error: burnError } = useBurnNFT(nftCollectionContract);

  const [project, setProject] = useState<Project | null>(null);
  const [loadingProject, setLoadingProject] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      const projectIdAttribute = nft.metadata.attributes.find(
        (attr) => attr.trait_type === 'Project ID'
      );
      const projectId = projectIdAttribute ? Number(projectIdAttribute.value) : null;

      if (projectId) {
        try {
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single();

          if (error) throw error;
          setProject(data);
        } catch (error) {
          console.error('Error fetching project details:', error);
          toast.error('Error fetching project details.');
        } finally {
          setLoadingProject(false);
        }
      } else {
        setLoadingProject(false);
      }
    };

    fetchProject();
  }, [nft.metadata.attributes]);

  const handleRetire = async () => {
    if (!nftCollectionContract || !nft.tokenId) return;

    const loadingToast = toast.loading('Retiring NFT...');
    try {
      await burnNft({ tokenId: nft.tokenId });
      toast.success('NFT retired successfully!', { id: loadingToast });
      // Optionally, update the NFT's status in Supabase or re-fetch data
    } catch (error: any) {
      console.error('Error retiring NFT:', error);
      toast.error(`Error retiring NFT: ${error.message || error.toString()}`, { id: loadingToast });
    }
  };

  if (loadingProject) {
    return <div>Loading project details...</div>;
  }

  if (!project) {
    return <div>Project details not found.</div>;
  }

  const isOwner = address === nft.owner;

  return (
    <div>
      <ProjectDetailHeader project={project} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="w-full h-96 bg-gray-700 rounded-lg"></div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">{nft.metadata.name}</h2>
          <p className="text-gray-400 mb-6">{nft.metadata.description}</p>
          <div className="space-y-2 mb-6">
            {nft.metadata.attributes.map((attr, index) => (
              <div key={index} className="flex justify-between">
                <span className="font-semibold text-gray-300">{attr.trait_type}:</span>
                <span>{attr.value}</span>
              </div>
            ))}
          </div>
          {isOwner && (
            <button
              onClick={handleRetire}
              disabled={isBurning}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg mt-4"
            >
              {isBurning ? 'Retiring...' : 'Retire NFT'}
            </button>
          )}
          {/* PurchaseModal will need the listing object */}
          <PurchaseModal listing={{} as any} /> 
        </div>
      </div>
    </div>
  );
};

export default NFTDetailView;