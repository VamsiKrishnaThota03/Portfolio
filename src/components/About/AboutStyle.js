import styled from 'styled-components';
import _default from '../../themes/default';

export const AboutContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
  align-items: center;
  padding: 40px 0px 80px 0px;
  @media (max-width: 960px) {
    padding: 20px 0;
  }
`;

export const AboutWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1100px;
  padding: 0px 30px;
  gap: 12px;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

export const AboutTitle = styled.div`
  font-size: 42px;
  text-align: center;
  font-weight: 600;
  margin-top: 20px;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 32px;
  }
`;

export const AboutSubtitle = styled.div`
  font-size: 18px;
  text-align: center;
  max-width: 800px;
  color: ${({ theme }) => theme.text_secondary};
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const AboutSection = styled.div`
  width: 100%;
  margin: 25px 0;
  border-radius: 16px;
  position: relative;
  padding: 25px;
  background-color: ${({ theme }) => theme.card};
  box-shadow: 0px 4px 24px rgba(23, 92, 230, 0.15);
`;

export const AboutSectionTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 16px;
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const AboutSectionText = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 16px;
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const AboutSectionList = styled.ul`
  margin-left: 20px;
  list-style-type: disc;
`;

export const AboutSectionListItem = styled.li`
  font-size: 16px;
  line-height: 1.6;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 8px;
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const Highlight = styled.span`
  color: ${({ theme }) => theme.primary};
  font-weight: 500;
`;

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  margin: 16px 0;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const ValuesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin: 16px 0;
`;

export const ValueBadge = styled.div`
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.primary + 15};
  color: ${({ theme }) => theme.primary};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const SocialMediaIcons = styled.div`
  display: flex;
  margin-top: 1rem;
`;

export const SocialMediaIcon = styled.a`
  display: inline-block;
  margin: 0 1rem;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text_primary};
  transition: color 0.2s ease-in-out;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

export const Quote = styled.div`
  font-style: italic;
  font-size: 18px;
  line-height: 1.6;
  color: ${({ theme }) => theme.text_primary + 90};
  border-left: 4px solid ${({ theme }) => theme.primary};
  padding-left: 20px;
  margin: 25px 0;
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const ButtonLink = styled.a`
  display: inline-block;
  background: linear-gradient(225deg, hsla(271, 100%, 50%, 1) 0%, hsla(294, 100%, 50%, 1) 100%);
  color: ${({ theme }) => theme.text_primary};
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 16px;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0px 0px 20px rgba(133, 76, 230, 0.4);
  }
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;