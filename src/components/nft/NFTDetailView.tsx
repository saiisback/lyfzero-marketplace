import React from 'react';
import { NFTMetadata, Project } from '@/types';
import ProjectDetailHeader from '../project/ProjectDetailHeader';
import PurchaseModal from './PurchaseModal';

interface NFTDetailViewProps {
  nft: { metadata: NFTMetadata }; // Simplified for now
  project: Project;
}

const NFTDetailView: React.FC<NFTDetailViewProps> = ({ nft, project }) => {
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
          <PurchaseModal />
        </div>
      </div>
    </div>
  );
};

export default NFTDetailView;