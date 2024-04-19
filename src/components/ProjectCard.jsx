import React from 'react';

import ImageCarousel from './ImageCarousel';
import { Card } from './ui';

const ProjectCard = ({ project }) => {
  return (
    <Card className='overflow-hidden'>
      <div className='relative'>
        {project.images && project.images.length > 0 ? (
          <ImageCarousel images={project.images} />
        ) : (
          <img
            src='https://via.placeholder.com/300'
            alt={project.title}
            className='h-40 w-full object-cover'
          />
        )}
        <div className='p-4'>
          <h3 className='mb-2 text-lg font-semibold'>{project.title}</h3>
          <p className=''>{project.description}</p>
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;
