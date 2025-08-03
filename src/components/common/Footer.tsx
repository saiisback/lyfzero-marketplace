import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} CarbonCred. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;