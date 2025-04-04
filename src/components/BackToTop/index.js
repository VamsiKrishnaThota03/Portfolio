import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Button = styled.button`
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.white};
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease-in-out;
  opacity: ${({ show }) => (show ? 1 : 0)};
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
  transform: ${({ show }) => (show ? 'translateY(0)' : 'translateY(20px)')};
  z-index: 999;
  
  &:hover {
    transform: scale(1.1) ${({ show }) => (show ? '' : 'translateY(20px)')};
  }
`;

const BackToTop = () => {
  const [showButton, setShowButton] = useState(false);

  // Show button when scrolled down 300px
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll to top with smooth animation
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Button show={showButton} onClick={scrollToTop} aria-label="Back to top">
      <KeyboardArrowUpIcon fontSize="medium" />
    </Button>
  );
};

export default BackToTop; 