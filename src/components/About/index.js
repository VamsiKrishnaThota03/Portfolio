import React from 'react';
import { Bio } from '../../data/constants';
import { GitHub, LinkedIn, Code, BugReport, Computer, ImportContacts, EmojiEvents, Speed, PersonOutline, School, WorkOutline, FitnessCenter, Brush, MusicNote } from '@mui/icons-material';
import {
  AboutContainer,
  AboutWrapper,
  AboutTitle,
  AboutSubtitle,
  AboutSection,
  AboutSectionTitle,
  AboutSectionText,
  Highlight,
  FlexRow,
  FlexColumn,
  AboutSectionList,
  AboutSectionListItem,
  ValuesContainer,
  ValueBadge,
  Quote,
  ButtonLink,
  SocialMediaIcons,
  SocialMediaIcon
} from './AboutStyle';

const About = () => {
  return (
    <AboutContainer id="about-section">
      <AboutWrapper>
        <AboutTitle>About Me</AboutTitle>
        <AboutSubtitle>
          Get to know more about my journey, professional values, and the person behind the code.
        </AboutSubtitle>

        {/* Professional Story Section */}
        <AboutSection>
          <AboutSectionTitle>
            <PersonOutline style={{ marginRight: '10px', verticalAlign: 'middle' }} />
            My Professional Story
          </AboutSectionTitle>
          <AboutSectionText>
            I'm a <Highlight>Computer Science student at IIIT Jabalpur</Highlight> with a passion for solving complex problems through code. My journey in technology began when I was introduced to competitive programming in high school, which sparked my fascination with algorithms and efficient problem-solving.
          </AboutSectionText>
          <AboutSectionText>
            During my academic journey, I've had the opportunity to work as a <Highlight>Software Development Engineer Intern at Troywings Technologies</Highlight>, where I built high-performance distributed systems and scalable user management solutions. This professional experience deepened my understanding of real-world software architecture and the importance of creating maintainable, efficient code.
          </AboutSectionText>
          <AboutSectionText>
            Beyond my formal education, I'm a lifelong learner who's solved <Highlight>1000+ algorithmic problems</Highlight> on platforms like LeetCode and Codeforces. I believe in constantly expanding my skillset, which has led me to explore full-stack development, cloud technologies, and increasingly, the world of AI and machine learning.
          </AboutSectionText>
          <Quote>
            "The most powerful tool we have as developers is automation. If you're repeating yourself, you're doing it wrong."
          </Quote>
        </AboutSection>

        {/* Mission Statement Section */}
        <AboutSection>
          <AboutSectionTitle>
            <Code style={{ marginRight: '10px', verticalAlign: 'middle' }} />
            My Mission
          </AboutSectionTitle>
          <AboutSectionText>
            I aim to create technology that <Highlight>makes a meaningful difference</Highlight> in people's lives by focusing on three core principles:
          </AboutSectionText>
          <AboutSectionList>
            <AboutSectionListItem>
              <strong>Building for scale and performance</strong> - Creating systems that handle growth elegantly and respond quickly to user needs
            </AboutSectionListItem>
            <AboutSectionListItem>
              <strong>Prioritizing intuitive user experiences</strong> - Ensuring technology is accessible and valuable to all users, regardless of their technical background
            </AboutSectionListItem>
            <AboutSectionListItem>
              <strong>Engineering with integrity</strong> - Developing software that respects user privacy, security, and promotes positive social impact
            </AboutSectionListItem>
          </AboutSectionList>
          <AboutSectionText>
            I believe the best software emerges from collaboration, continuous learning, and a deep understanding of user needs. Every line of code I write is guided by these principles.
          </AboutSectionText>
        </AboutSection>

        {/* Career Goals Section */}
        <AboutSection>
          <AboutSectionTitle>
            <WorkOutline style={{ marginRight: '10px', verticalAlign: 'middle' }} />
            Career Goals
          </AboutSectionTitle>
          <AboutSectionText>
            As I continue to grow as a developer, I'm focused on several key professional objectives:
          </AboutSectionText>
          <FlexRow>
            <FlexColumn>
              <AboutSectionTitle style={{ fontSize: "22px" }}>Short-Term</AboutSectionTitle>
              <AboutSectionList>
                <AboutSectionListItem>Master cloud-native development practices and microservice architecture</AboutSectionListItem>
                <AboutSectionListItem>Contribute to open-source projects that align with my values</AboutSectionListItem>
                <AboutSectionListItem>Develop expertise in scalable system design and optimization</AboutSectionListItem>
              </AboutSectionList>
            </FlexColumn>
            <FlexColumn>
              <AboutSectionTitle style={{ fontSize: "22px" }}>Long-Term</AboutSectionTitle>
              <AboutSectionList>
                <AboutSectionListItem>Become a technical leader who mentors the next generation of developers</AboutSectionListItem>
                <AboutSectionListItem>Lead the development of systems that tackle significant technological challenges</AboutSectionListItem>
                <AboutSectionListItem>Contribute to setting industry standards for software engineering excellence</AboutSectionListItem>
              </AboutSectionList>
            </FlexColumn>
          </FlexRow>
          <AboutSectionText>
            I'm particularly interested in opportunities that allow me to work with <Highlight>distributed systems</Highlight>, <Highlight>real-time applications</Highlight>, and <Highlight>cutting-edge AI integrations</Highlight>.
          </AboutSectionText>
        </AboutSection>

        {/* Values Section */}
        <AboutSection>
          <AboutSectionTitle>
            <EmojiEvents style={{ marginRight: '10px', verticalAlign: 'middle' }} />
            My Values
          </AboutSectionTitle>
          <AboutSectionText>
            These core principles guide my approach to work and collaboration:
          </AboutSectionText>
          <ValuesContainer>
            <ValueBadge>Technical Excellence</ValueBadge>
            <ValueBadge>Continuous Learning</ValueBadge>
            <ValueBadge>User-Centric Design</ValueBadge>
            <ValueBadge>Code Maintainability</ValueBadge>
            <ValueBadge>Thoughtful Architecture</ValueBadge>
            <ValueBadge>Effective Communication</ValueBadge>
            <ValueBadge>Ethical Development</ValueBadge>
            <ValueBadge>Problem-First Approach</ValueBadge>
          </ValuesContainer>
          <AboutSectionText>
            I believe that great software isn't just about clever algorithms—it's about creating systems that are <Highlight>reliable</Highlight>, <Highlight>maintainable</Highlight>, and <Highlight>genuinely useful</Highlight> to the people who depend on them.
          </AboutSectionText>
        </AboutSection>

        {/* Hobbies & Soft Skills Section */}
        <AboutSection>
          <AboutSectionTitle>
            <ImportContacts style={{ marginRight: '10px', verticalAlign: 'middle' }} />
            Beyond Coding
          </AboutSectionTitle>
          <AboutSectionText>
            My interests outside of programming help me develop transferable skills that enhance my work as a developer:
          </AboutSectionText>
          <FlexRow>
            <FlexColumn>
              <AboutSectionTitle style={{ fontSize: "20px" }}>
                <FitnessCenter style={{ marginRight: '5px', fontSize: '18px', verticalAlign: 'middle' }} />
                Fitness & Chess
              </AboutSectionTitle>
              <AboutSectionText>
                Regular workouts and chess matches sharpen my <Highlight>strategic thinking</Highlight> and <Highlight>discipline</Highlight>. Both activities teach the importance of planning multiple steps ahead and adapting quickly to changing circumstances—skills that directly translate to solving complex programming challenges.
              </AboutSectionText>
            </FlexColumn>
            <FlexColumn>
              <AboutSectionTitle style={{ fontSize: "20px" }}>
                <Brush style={{ marginRight: '5px', fontSize: '18px', verticalAlign: 'middle' }} />
                Digital Design
              </AboutSectionTitle>
              <AboutSectionText>
                Creating digital art has enhanced my <Highlight>attention to detail</Highlight> and <Highlight>UI/UX sensibilities</Highlight>. This hobby gives me a deeper appreciation for both functionality and aesthetics in software development, helping me build more user-friendly interfaces.
              </AboutSectionText>
            </FlexColumn>
          </FlexRow>
          <FlexRow>
            <FlexColumn>
              <AboutSectionTitle style={{ fontSize: "20px" }}>
                <School style={{ marginRight: '5px', fontSize: '18px', verticalAlign: 'middle' }} />
                Teaching & Mentoring
              </AboutSectionTitle>
              <AboutSectionText>
                Helping peers with programming concepts has strengthened my <Highlight>communication skills</Highlight> and <Highlight>empathy</Highlight>. Breaking down complex topics for others deepens my own understanding and improves my ability to collaborate effectively in team environments.
              </AboutSectionText>
            </FlexColumn>
            <FlexColumn>
              <AboutSectionTitle style={{ fontSize: "20px" }}>
                <MusicNote style={{ marginRight: '5px', fontSize: '18px', verticalAlign: 'middle' }} />
                Music Appreciation
              </AboutSectionTitle>
              <AboutSectionText>
                Exploring diverse music genres has cultivated my <Highlight>creativity</Highlight> and <Highlight>pattern recognition</Highlight>. This appreciation for rhythm and structure influences how I approach code organization and algorithm development.
              </AboutSectionText>
            </FlexColumn>
          </FlexRow>
        </AboutSection>

        {/* Connect Section */}
        <AboutSection>
          <AboutSectionTitle>Let's Connect</AboutSectionTitle>
          <AboutSectionText>
            I'm always open to discussing new projects, opportunities, or just chatting about technology and development.
          </AboutSectionText>
          <FlexRow style={{ justifyContent: 'center' }}>
            <ButtonLink href={Bio.github} target="_blank">
              <GitHub style={{ marginRight: '8px' }} /> GitHub Profile
            </ButtonLink>
            <ButtonLink href={Bio.linkedin} target="_blank">
              <LinkedIn style={{ marginRight: '8px' }} /> LinkedIn
            </ButtonLink>
            <ButtonLink href={Bio.resume} target="_blank">
              <Computer style={{ marginRight: '8px' }} /> Resume
            </ButtonLink>
          </FlexRow>
        </AboutSection>
      </AboutWrapper>
    </AboutContainer>
  );
};

export default About;