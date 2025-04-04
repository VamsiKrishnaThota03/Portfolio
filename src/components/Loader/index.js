import React from 'react';
import styled from 'styled-components';

const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.bg};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  transition: opacity 0.5s ease-out;
  opacity: ${({ isLoading }) => (isLoading ? 1 : 0)};
  visibility: ${({ isLoading }) => (isLoading ? 'visible' : 'hidden')};
`;

const LoaderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const LoaderImage = styled.img`
  width: 100px;
  height: 100px;
`;

const LoaderText = styled.div`
  color: ${({ theme }) => theme.primary};
  font-size: 18px;
  font-weight: 500;
`;

const Loader = ({ isLoading }) => {
  return (
    <LoaderContainer isLoading={isLoading}>
      <LoaderContent>
        <LoaderImage src="/images/pageloader.gif" alt="Loading..." />
        <LoaderText>Loading amazing content...</LoaderText>
      </LoaderContent>
    </LoaderContainer>
  );
};

export default Loader; 