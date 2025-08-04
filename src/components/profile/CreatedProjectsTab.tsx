import React, { useEffect, useState } from 'react';
import { useAddress } from '@thirdweb-dev/react';
import { supabase } from '@/lib/supabase';
import { Project } from '@/types';
import MintNFTModal from '../nft/MintNFTModal';

const CreatedProjectsTab: React.FC = () => {
  const address = useAddress();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!address) return;

    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('seller_wallet_address', address)
          .eq('status', 'approved');
        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching created projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [address]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Approved Projects</h2>
      {projects.length > 0 ? (
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{project.project_name}</h3>
                <p className="text-sm text-gray-400">{project.location}</p>
              </div>
              <button 
                onClick={() => setSelectedProject(project)}
                className="bg-primary hover:bg-primary-dark text-primary-foreground font-bold py-2 px-4 rounded-lg"
              >
                Mint NFTs
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <p>You don't have any approved projects yet.</p>
        </div>
      )}
      {selectedProject && (
        <MintNFTModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </div>
  );
};

export default CreatedProjectsTab;