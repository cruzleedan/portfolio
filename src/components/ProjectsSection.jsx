// ProjectsSection.js
import { motion, useInView } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

import OutlinedButton from './OutlinedButton';
import ProjectCard from './ProjectCard';

const projects = [
  {
    id: 1,
    title: 'Project 1',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.',
    imageUrl: 'https://via.placeholder.com/300', // Example image URL
    demoUrl: '#', // URL to project demo
    codeUrl: '#', // URL to project code repository
    tag: ['Mobile'],
  },
  {
    id: 2,
    title: 'Project 2',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.',
    imageUrl: 'https://via.placeholder.com/300', // Example image URL
    demoUrl: '#', // URL to project demo
    codeUrl: '#', // URL to project code repository
    tag: ['Web'],
  },
  {
    id: 3,
    title: 'Project 3',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.',
    imageUrl: 'https://via.placeholder.com/300', // Example image URL
    demoUrl: '#', // URL to project demo
    codeUrl: '#', // URL to project code repository
    tag: ['Web'],
  },
  // Add more projects as needed
];

const ProjectsSection = () => {
  const [selectedTag, setSelectedTag] = useState();
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [tags, setTags] = useState([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const handleTagChange = (newTag) => {
    setSelectedTag(newTag);
  };

  useEffect(() => {
    setFilteredProjects(projects);
    setTags(['All', ...new Set(projects.flatMap((project) => project.tag))]);
    setSelectedTag('All');
  }, []);

  useEffect(() => {
    const filteredProjects =
      selectedTag === 'All'
        ? projects
        : projects.filter((project) => project.tag.includes(selectedTag));
    setFilteredProjects(filteredProjects);
  }, [selectedTag]);

  const cardVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  return (
    <section id='projects' className='py-24'>
      <div className='container mx-auto'>
        <div className='mx-auto mb-8 max-w-3xl text-center'>
          <h2 className='mb-4 text-3xl font-bold'>Projects</h2>
          <p className='text-lg'>Check out some of my recent projects below.</p>
        </div>
        <div className='flex flex-row items-center justify-center gap-2 py-6'>
          {tags.map((tag) => (
            <OutlinedButton
              key={tag}
              onClick={() => handleTagChange(tag)}
              isSelected={tag === selectedTag}
            >
              {tag}
            </OutlinedButton>
          ))}
        </div>
        <ul
          ref={ref}
          className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'
        >
          {filteredProjects.map((project, index) => (
            <motion.li
              key={index}
              variants={cardVariants}
              initial='initial'
              animate={isInView ? 'animate' : 'initial'}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ProjectCard key={project.id} project={project} />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ProjectsSection;
