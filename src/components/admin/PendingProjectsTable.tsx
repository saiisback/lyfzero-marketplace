import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Project } from '@/types';
import toast from 'react-hot-toast';

const PendingProjectsTable: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('status', 'pending');
        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching pending projects:', error);
        toast.error('Error fetching pending projects.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleApprove = async (project: Project) => {
    const loadingToast = toast.loading('Approving project...');
    try {
      // 1. Call the grant-minter-role edge function
      const { data, error } = await supabase.functions.invoke('grant-minter-role', {
        body: { 
          sellerAddress: project.seller_wallet_address, 
          nftContractAddress: process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS 
        },
      });
      if (error) throw error;

      // 2. Update the project status to 'approved'
      const { error: dbError } = await supabase
        .from('projects')
        .update({ status: 'approved' })
        .eq('id', project.id);
      if (dbError) throw dbError;

      // 3. Update the UI
      setProjects(projects.filter((p) => p.id !== project.id));
      toast.success(`Project "${project.project_name}" approved.`, { id: loadingToast });
    } catch (error: any) {
      console.error('Error approving project:', error);
      toast.error(`Error approving project: ${error.message || error.toString()}`, { id: loadingToast });
    }
  };

  const handleReject = async (projectId: number) => {
    const loadingToast = toast.loading('Rejecting project...');
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'rejected' })
        .eq('id', projectId);
      if (error) throw error;

      setProjects(projects.filter((p) => p.id !== projectId));
      toast.success('Project rejected.', { id: loadingToast });
    } catch (error: any) {
      console.error('Error rejecting project:', error);
      toast.error(`Error rejecting project: ${error.message || error.toString()}`, { id: loadingToast });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Pending Projects</h2>
      <div className="bg-gray-800 rounded-lg p-4">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="p-2">Project Name</th>
              <th className="p-2">Seller</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((project) => (
                <tr key={project.id}>
                  <td className="p-2">{project.project_name}</td>
                  <td className="p-2">{project.seller_wallet_address}</td>
                  <td className="p-2">
                    <button 
                      onClick={() => handleApprove(project)} 
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded mr-2"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleReject(project.id)} 
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center p-4">
                  No pending projects.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingProjectsTable;