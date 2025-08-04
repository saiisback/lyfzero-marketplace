export interface UserProfile {
  id: string;
  wallet_address: string;
  username?: string;
  role: 'user' | 'admin';
}

export interface Project {
  id: number;
  seller_wallet_address: string;
  project_name: string;
  description?: string;
  location?: string;
  verification_standard?: string;
  verification_docs_url?: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Based on the NFT Metadata Standard in the spec
export interface NFTAttribute {
  trait_type: 
    | 'Project' 
    | 'Location' 
    | 'Standard' 
    | 'Vintage Year' 
    | 'Project ID' 
    | 'Status';
  value: string | number;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: NFTAttribute[];
}
