import React, { useState } from 'react';
import { useContract, useMintNFT } from '@thirdweb-dev/react';
import { Project } from '@/types';

interface MintNFTModalProps {
  project: Project;
  onClose: () => void;
}

const MintNFTModal: React.FC<MintNFTModalProps> = ({ project, onClose }) => {
  const { contract } = useContract(process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS);
  const { mutate: mintNft, isLoading, error } = useMintNFT(contract);
  const [quantity, setQuantity] = useState(1);

  const handleMint = () => {
    const metadata = {
      name: `${project.project_name} - Carbon Credit`,
      description: `This token represents one tonne of CO2e offset through the ${project.project_name}.`,
      image: "ipfs://...", // Placeholder image
      external_url: `https://carboncred.io/projects/${project.id}`,
      attributes: [
        { trait_type: 'Project', value: project.project_name },
        { trait_type: 'Location', value: project.location || '' },
        { trait_type: 'Standard', value: project.verification_standard || '' },
        { trait_type: 'Vintage Year', value: new Date().getFullYear() },
        { trait_type: 'Project ID', value: project.id },
        { trait_type: 'Status', value: 'Active' },
      ],
    };

    mintNft({
      to: project.seller_wallet_address,
      metadata,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-primary">Mint NFTs for {project.project_name}</h2>
        {/* Minting form would go here */}
        <div className="text-right">
          <button onClick={onClose} className="text-gray-400 hover:text-white mr-4">Cancel</button>
          <button onClick={handleMint} disabled={isLoading} className="bg-primary hover:bg-primary-dark text-primary-foreground font-bold py-2 px-6 rounded-lg">
            {isLoading ? 'Minting...' : 'Mint'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MintNFTModal;