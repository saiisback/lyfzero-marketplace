import React, { useState } from 'react';
import { useAddress } from '@thirdweb-dev/react';
import { supabase } from '@/lib/supabase';

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
    if (!address || !file) return;

    setIsSubmitting(true);

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

      alert('Project created successfully! It is now pending approval.');
      // Reset form
      setProjectName('');
      setDescription('');
      setLocation('');
      setVerificationStandard('');
      setFile(null);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-primary">Create New Project</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ... form inputs ... */}
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