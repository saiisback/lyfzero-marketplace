import React from 'react';
import { Project } from '@/types';

interface ProjectDetailHeaderProps {
  project: Project;
}

const ProjectDetailHeader: React.FC<ProjectDetailHeaderProps> = ({ project }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
      <h1 className="text-3xl font-bold text-primary mb-2">{project.project_name}</h1>
      <p className="text-gray-400 mb-4">{project.description}</p>
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center">
          <span className="font-semibold text-gray-300 mr-2">Location:</span>
          <span>{project.location}</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold text-gray-300 mr-2">Standard:</span>
          <span>{project.verification_standard}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailHeader;