import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Project } from '@/types';

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
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleApprove = async (project: Project) => {
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
      alert(`Project "${project.project_name}" approved.`);
    } catch (error) {
      console.error('Error approving project:', error);
      alert('Error approving project. Please try again.');
    }
  };

  const handleReject = async (projectId: number) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'rejected' })
        .eq('id', projectId);
      if (error) throw error;

      setProjects(projects.filter((p) => p.id !== projectId));
      alert('Project rejected.');
    } catch (error) {
      console.error('Error rejecting project:', error);
      alert('Error rejecting project. Please try again.');
    }
  };

  // ... return statement ...
};