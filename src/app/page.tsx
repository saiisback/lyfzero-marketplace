import Link from 'next/link';

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-primary mb-4">Welcome to CarbonCred</h1>
      <p className="text-lg mb-8">The decentralized marketplace for carbon credits.</p>
      <Link href="/marketplace" className="bg-primary hover:bg-primary-dark text-primary-foreground font-bold py-3 px-6 rounded-lg text-lg">
        Explore Marketplace
      </Link>
    </div>
  );
}
