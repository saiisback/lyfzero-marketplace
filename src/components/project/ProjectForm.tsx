"use client";
import React, { useState } from 'react';
import { useAddress } from '@thirdweb-dev/react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

const ProjectForm: React.FC = () => {
  const address = useAddress();
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [verificationStandard, setVerificationStandard] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      toast.error('Please connect your wallet.');
      return;
    }
    if (!file) {
      toast.error('Please upload a verification document.');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Creating project...');

    try {
      // 1. Upload verification document to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${address}-${Date.now()}.${fileExt}`;
      const { data: fileData, error: fileError } = await supabase.storage
        .from('verification-documents')
        .upload(fileName, file);

      if (fileError) throw fileError;

      // 2. Create project record in Supabase database
      const { error: dbError } = await supabase.from('projects').insert({
        seller_wallet_address: address,
        project_name: projectName,
        description,
        location,
        verification_standard: verificationStandard,
        verification_docs_url: fileData.path,
      });

      if (dbError) throw dbError;

      toast.success('Project created successfully! It is now pending approval.', { id: loadingToast });
      // Reset form
      setProjectName('');
      setDescription('');
      setLocation('');
      setVerificationStandard('');
      setFile(null);
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast.error(`Error creating project: ${error.message || error.toString()}`, { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-primary">Create New Project</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-300">Project Name</label>
          <input
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-primary focus:border-primary"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-300">Location</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="verificationStandard" className="block text-sm font-medium text-gray-300">Verification Standard</label>
          <input
            type="text"
            id="verificationStandard"
            value={verificationStandard}
            onChange={(e) => setVerificationStandard(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-300">Verification Documents</label>
          <input
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary-dark"
          />
        </div>
        <div className="text-right">
          <button 
            type="submit" 
            className="bg-primary hover:bg-primary-dark text-primary-foreground font-bold py-2 px-6 rounded-lg disabled:opacity-50"
            disabled={!address || isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;