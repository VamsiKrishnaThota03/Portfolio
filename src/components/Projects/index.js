import React, { useState, useMemo } from 'react'
import { 
  Container, 
  Wrapper, 
  Title, 
  Desc, 
  CardContainer, 
  ToggleButtonGroup, 
  ToggleButton, 
  Divider,
  FilterContainer,
  FilterHeading,
  FilterOptions,
  SortContainer,
  SortSelect,
  TagsFilter,
  TagButton
} from './ProjectsStyle'
import ProjectCard from '../Cards/ProjectCards'
import { projects } from '../../data/constants'

const Projects = ({openModal, setOpenModal}) => {
  // Category filter
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Role filter (frontend, backend, full-stack)
  const [roleFilter, setRoleFilter] = useState('all');
  
  // Sort option (newest, oldest, complexity)
  const [sortOption, setSortOption] = useState('newest');

  // Filter and sort projects based on user selections
  const filteredProjects = useMemo(() => {
    return projects
      .filter(project => {
        // Category filter
        if (categoryFilter !== 'all' && project.category !== categoryFilter) {
          return false;
        }

        // Role filter - extremely simplified to debug
        if (roleFilter !== 'all') {
          const projectTags = project.tags.map(tag => tag.toLowerCase());
          
          // For frontend filter - check for common frontend tags
          if (roleFilter === 'frontend') {
            const frontendKeywords = ['react', 'html', 'css', 'ui', 'redux', 'tailwind'];
            // Pass if ANY frontend keyword is found
            const hasFrontend = frontendKeywords.some(keyword => 
              projectTags.some(tag => tag.includes(keyword.toLowerCase()))
            );
            if (!hasFrontend) return false;
          }
          
          // For backend filter - check for common backend tags
          else if (roleFilter === 'backend') {
            const backendKeywords = ['node', 'express', 'api', 'server', 'django', 'database', 'mongo', 'sql'];
            // Pass if ANY backend keyword is found
            const hasBackend = backendKeywords.some(keyword => 
              projectTags.some(tag => tag.includes(keyword.toLowerCase()))
            );
            if (!hasBackend) return false;
          }
          
          // For full-stack filter - need both frontend and backend elements
          else if (roleFilter === 'full-stack') {
            const frontendKeywords = ['react', 'html', 'css', 'ui', 'redux', 'tailwind'];
            const backendKeywords = ['node', 'express', 'api', 'server', 'django', 'database', 'mongo', 'sql'];
            
            const hasFrontend = frontendKeywords.some(keyword => 
              projectTags.some(tag => tag.includes(keyword.toLowerCase()))
            );
            
            const hasBackend = backendKeywords.some(keyword => 
              projectTags.some(tag => tag.includes(keyword.toLowerCase()))
            );
            
            if (!hasFrontend || !hasBackend) return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        // Sort by date or complexity
        if (sortOption === 'newest') {
          return new Date(b.date.split(' - ')[1] || b.date) - new Date(a.date.split(' - ')[1] || a.date);
        } else if (sortOption === 'oldest') {
          return new Date(a.date.split(' - ')[0]) - new Date(b.date.split(' - ')[0]);
        } else if (sortOption === 'complexity') {
          // Here we could use a complexity score if available, or estimate from tags count
          return b.tags.length - a.tags.length;
        }
        return 0;
      });
  }, [categoryFilter, roleFilter, sortOption]);

  // Clear all filters
  const clearFilters = () => {
    setCategoryFilter('all');
    setRoleFilter('all');
    setSortOption('newest');
  };

  return (
    <Container id="projects">
      <Wrapper>
        <Title>Projects</Title>
        <Desc>
          Showcasing a diverse portfolio of technical solutions, from high-performance web applications to machine learning systems, demonstrating expertise in full-stack development and emerging technologies.
        </Desc>
        
        <FilterContainer>
          <SortContainer>
            <FilterHeading>Sort by:</FilterHeading>
            <SortSelect value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="complexity">Complexity</option>
            </SortSelect>
            
            <TagButton 
              style={{ marginLeft: 'auto' }} 
              onClick={clearFilters}
            >
              Clear Filters
            </TagButton>
          </SortContainer>
          
          <FilterHeading>Project Type:</FilterHeading>
          <FilterOptions>
            <TagButton 
              active={categoryFilter === 'all'} 
              onClick={() => setCategoryFilter('all')}
            >
              All
            </TagButton>
            <TagButton 
              active={categoryFilter === 'web app'} 
              onClick={() => setCategoryFilter('web app')}
            >
              Web Apps
            </TagButton>
            <TagButton 
              active={categoryFilter === 'machine learning'} 
              onClick={() => setCategoryFilter('machine learning')}
            >
              Machine Learning
            </TagButton>
          </FilterOptions>
          
          <FilterHeading>Project Role:</FilterHeading>
          <FilterOptions>
            <TagButton 
              active={roleFilter === 'all'} 
              onClick={() => setRoleFilter('all')}
            >
              All Roles
            </TagButton>
            <TagButton 
              active={roleFilter === 'frontend'} 
              onClick={() => setRoleFilter('frontend')}
            >
              Frontend
            </TagButton>
            <TagButton 
              active={roleFilter === 'backend'} 
              onClick={() => setRoleFilter('backend')}
            >
              Backend
            </TagButton>
            <TagButton 
              active={roleFilter === 'full-stack'} 
              onClick={() => setRoleFilter('full-stack')}
            >
              Full-Stack
            </TagButton>
          </FilterOptions>
        </FilterContainer>
        
        <CardContainer>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                openModal={openModal} 
                setOpenModal={setOpenModal}
              />
            ))
          ) : (
            <div style={{ 
              padding: '20px', 
              textAlign: 'center', 
              color: '#666',
              width: '100%' 
            }}>
              No projects match your current filters. Try adjusting your selection.
            </div>
          )}
        </CardContainer>
      </Wrapper>
    </Container>
  )
}

export default Projects