import React from 'react';

const NFTCard: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-primary/50 transition-shadow duration-300">
      <div className="w-full h-56 bg-gray-700"></div>
      <div className="p-4">
        <h3 className="text-lg font-bold">NFT Name</h3>
        <p className="text-sm text-gray-400">Project Name</p>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-lg font-bold text-primary">1.2 ETH</p>
          <button className="bg-primary hover:bg-primary-dark text-primary-foreground font-bold py-2 px-4 rounded">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;