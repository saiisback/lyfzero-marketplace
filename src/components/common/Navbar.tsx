import React from 'react';
import Link from 'next/link';
import ConnectWalletButton from './ConnectWalletButton';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              CarbonCred
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/marketplace" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Marketplace
              </Link>
              <Link href="/profile" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Profile
              </Link>
              <Link href="/admin" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Admin
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;