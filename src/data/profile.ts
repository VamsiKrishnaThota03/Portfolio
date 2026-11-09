// Single source of truth for all site content.
// Edit this file to update the portfolio; components read from here only.

export const SITE_URL = 'https://portfolio-beryl-nine-58.vercel.app';

export const profile = {
  name: 'Thota Vamsi Krishna',
  firstName: 'Vamsi',
  initials: 'VK',
  headline: 'Incoming Software Engineer at Google',
  location: 'Bangalore, India',
  timezone: 'Asia/Kolkata',
  email: 'vamsikrishnathota483@gmail.com',
  resume: '/Thota_Vamsi_Krishna_Resume.pdf',
  photo: '/images/profile.webp',
  photoFallback: '/images/profile.jpg',
  status: 'Incoming Software Engineer @ Google · ex-Amazon',
  summary:
    'Software Engineer joining Google (Nov 2026). Previously at Amazon, 1+ year building backend services, rules engines, data pipelines and AWS infrastructure. Delivered a global fee-incentive launch across 8 marketplaces; built tooling that cut P0 investigations by ~90%. I also build AI agents and developer tools.',
  roles: ['backend services', 'rules engines', 'data pipelines', 'AWS infrastructure', 'AI agents', 'developer tools'],
} as const;

export type SocialKey = 'github' | 'linkedin' | 'leetcode' | 'email';

export const socials: { key: SocialKey; label: string; handle: string; href: string }[] = [
  { key: 'github', label: 'GitHub', handle: 'VamsiKrishnaThota03', href: 'https://github.com/VamsiKrishnaThota03' },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    handle: 'thota-vamsi-krishna',
    href: 'https://www.linkedin.com/in/thota-vamsi-krishna-a6b9b1264/',
  },
  { key: 'leetcode', label: 'LeetCode', handle: 'BitTwister', href: 'https://leetcode.com/u/BitTwister/' },
  { key: 'email', label: 'Email', handle: profile.email, href: `mailto:${profile.email}` },
];

export const stats: { value: number; prefix?: string; suffix?: string; label: string; detail: string }[] = [
  { value: 8, label: 'marketplaces', detail: 'Global new-seller fee-incentive launch across NA, EU and JP' },
  { value: 90, prefix: '~', suffix: '%', label: 'faster investigations', detail: 'P0 root-causing cut from 5-6 hours to ~30 minutes' },
  { value: 512, label: 'EC2 instances', detail: 'Quota synced during a customer-facing region migration' },
  { value: 1000, suffix: '+', label: 'DSA problems', detail: 'Solved across competitive programming platforms' },
];

export type Experience = {
  company: string;
  role: string;
  team?: string;
  start: string;
  end: string;
  location: string;
  summary: string;
  stack: string[];
  highlights: string[];
  incoming?: boolean;
  metrics?: { k: string; v: string }[];
};

export const experience: Experience[] = [
  {
    // Incoming role: intentionally no details.
    company: 'Google',
    role: 'Software Engineer',
    start: 'Nov 2026',
    end: 'Present',
    location: '',
    summary: '',
    stack: [],
    highlights: [],
    incoming: true,
  },
  {
    company: 'Amazon',
    role: 'Software Development Engineer',
    team: 'Seller Fees & Incentives',
    metrics: [
      { k: 'marketplaces', v: '8' },
      { k: 'p0_investigation', v: '5-6h → ~30m' },
      { k: 'eligibility_configs', v: '45+' },
      { k: 'benefits_cut_over', v: '5' },
    ],
    start: 'Jan 2026',
    end: 'Nov 2026',
    location: 'Bangalore',
    summary:
      'Fee-incentive programs for new sellers: event-driven discount platform, rules-based eligibility and the tooling that keeps it healthy.',
    stack: ['Java', 'Python', 'Drools', 'AWS Lambda', 'CDK', 'SQS', 'S3', 'DynamoDB', 'Glue', 'CloudWatch', 'SQL pipelines', 'React'],
    highlights: [
      'Key contributor to the global launch of a new-seller fee-incentive program (Jul 2026): 6+ fee benefits across 8 marketplaces in NA, EU and JP, reaching millions of sellers.',
      'Led the migration of a fee-exemption benefit into an event-driven discount platform (S3 → SQS → rules engine), writing the Drools rules plus unit, integration and end-to-end tests.',
      'Moved eligibility from SQL batch pipelines into a rules-based eligibility engine with 45+ marketplace-specific configs, shrinking the pipeline to 3 jobs.',
      'Designed a zero-overlap cutover for 5 benefits across 2 CDK pipelines and led beta and production UAT.',
      'Migrated benefit preview and calculation calls to a new Fee Gateway Service.',
      'Conceived and built a Python CLI that automates P0 seller-ticket root-causing: it traces 4-6 dependent pipeline jobs, streams multi-GB outputs and uses an internal LLM to explain the cause. Investigations dropped from 5-6 hours to ~30 minutes (~90%), and the tool was adopted team-wide.',
      'Added SEV-3 alarms on critical pipeline jobs and built an S3 → DynamoDB Glue job.',
    ],
  },
  {
    company: 'Amazon',
    role: 'Software Development Engineer',
    team: 'Alexa Mobile',
    metrics: [
      { k: 'ec2_instances', v: '512' },
      { k: 'resources_replicated', v: '511' },
      { k: 'apis_monitored', v: '24' },
      { k: 'changes_shipped', v: '64' },
    ],
    start: 'Jul 2025',
    end: 'Dec 2025',
    location: 'Chennai',
    summary: 'Infrastructure, reliability and security for a customer-facing Alexa service.',
    stack: ['Java', 'TypeScript', 'React', 'AWS CDK', 'Lambda', 'EC2', 'IAM', 'CloudWatch'],
    highlights: [
      'Led the region migration of a customer-facing Alexa service out of Dublin: IAM roles across 3 AWS accounts, quota sync for 512 EC2 instances and 511 AWS resources replicated via batched Lambda jobs.',
      'Peak-readiness and security hardening: timeout alarms, emergency deploy blocking, bake times, CSP headers, and fixes for request-ID/log injection and sensitive-data handling.',
      'Built CloudWatch monitoring for 24 APIs and added code-coverage tracking.',
      'Fixed React bugs and retired 6 legacy experiments; shipped 64 changes across 15 packages.',
    ],
  },
  {
    company: 'Komplai',
    metrics: [{ k: 'onboarding_time', v: '−30%' }],
    role: 'SDE Intern',
    start: 'Jun 2025',
    end: 'Jun 2025',
    location: 'Bangalore',
    summary: 'Full-stack compliance features for a regulatory-tech startup.',
    stack: ['Next.js', 'Prisma', 'Docker', 'SQL'],
    highlights: [
      'Built full-stack compliance features with Next.js, Prisma, Docker and SQL.',
      'Automated KYB checks with a company-registry (CIN) API, cutting onboarding time by 30%.',
    ],
  },
  {
    company: 'Troywings Technologies',
    metrics: [{ k: 'throughput', v: '+30%' }],
    role: 'SDE Intern',
    start: 'Jun 2023',
    end: 'Dec 2023',
    location: 'Bangalore',
    summary: 'Performance and auth work on Node.js microservices.',
    stack: ['Node.js', 'Redis', 'NGINX', 'JWT', 'bcrypt'],
    highlights: [
      'Raised microservice throughput by 30% with Redis caching and concurrent job queues (Node.js, NGINX).',
      'Implemented multi-factor authentication with JWT and bcrypt.',
    ],
  },
];

export const education = {
  school: 'IIIT Jabalpur',
  degree: 'B.Tech, Computer Science and Engineering',
  start: 'Dec 2021',
  end: 'May 2025',
  grade: 'CGPA 8.5/10',
};

export const achievement = 'Solved 1000+ data structures & algorithms problems across competitive programming platforms.';

export type ProjectCategory = 'ai' | 'fullstack' | 'backend';

export const projectFilters: { key: 'all' | ProjectCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'ai', label: 'AI & Agents' },
  { key: 'fullstack', label: 'Full-stack' },
  { key: 'backend', label: 'Backend' },
];

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  points?: string[];
  stack: string[];
  categories: ProjectCategory[];
  image?: string;
  imageAlt?: string;
  github: string;
  live?: string;
  video?: string;
  badge?: string;
  featured?: boolean;
  hue: number;
};

const gh = (repo: string) => `https://github.com/VamsiKrishnaThota03/${repo}`;

export const projects: Project[] = [
  {
    slug: 'decision-memory',
    title: 'Decision Memory',
    tagline: 'Your team already decided. Decision Memory makes sure nobody forgets.',
    description:
      'An Atlassian Forge app for Jira, Confluence and Rovo that remembers team decisions and flags new work that contradicts them, before it gets built. Decisions are captured where they happen and turned into checkable guardrails.',
    points: [
      'Capture decisions from Jira comments, Confluence pages, ADRs or by asking Rovo',
      'Flags issues, comments and proposals that contradict a decision, with evidence and owner',
      'Rovo AI agent and actions, an MCP server and a Teamwork Graph connector',
      '47 passing tests; built for Atlassian Codegeist 2026',
    ],
    stack: ['Atlassian Forge', 'Rovo Agent', 'MCP', 'Teamwork Graph', 'JavaScript', 'Jira', 'Confluence'],
    categories: ['ai', 'fullstack'],
    image: '/projects/decision-memory.webp',
    imageAlt: 'Jira issue showing a Decision Memory comment warning that the work conflicts with a team decision',
    github: gh('decision-memory'),
    video: 'https://www.youtube.com/watch?v=txTaT7M3AVI',
    badge: 'Codegeist 2026',
    featured: true,
    hue: 250,
  },
  {
    slug: 'haggl',
    title: 'Haggl',
    tagline: 'AI agents haggle, PayPal settles.',
    description:
      'A marketplace where AI agents negotiate every price within code-enforced limits. Google Gemini plays the seller and buyer agents, while the seller’s floor price never reaches the model and every AI decision is verified and clamped by code. Deals are paid with PayPal Checkout.',
    points: [
      'Buyer agent negotiates with several sellers in parallel and recommends the best deal',
      'Jailbreak Arena: a public challenge to trick an AI seller below its secret price',
      'PayPal Checkout (Orders v2), automatic seller payouts and verified webhooks',
      'Negotiates in 10 languages with voice input',
    ],
    stack: ['Node.js', 'Google Gemini', 'PayPal Checkout', 'AG Grid', 'Render'],
    categories: ['ai', 'fullstack'],
    image: '/projects/haggl.webp',
    imageAlt: 'Haggl shopping agent negotiating with several sellers in parallel',
    github: gh('haggl'),
    live: 'https://haggl.onrender.com',
    video: 'https://www.youtube.com/watch?v=Y9tVURlwO8Q',
    badge: 'Hackathon',
    featured: true,
    hue: 200,
  },
  {
    slug: 'task-management',
    title: 'Task Management',
    tagline: 'Go API, Next.js UI and Gemini-powered subtasks.',
    description:
      'Full-stack task manager: a Go (Gin, GORM, PostgreSQL) API with JWT auth, an admin role and WebSocket task-update broadcasts, a Next.js + TypeScript frontend, and Google Gemini suggestions that refine task descriptions and propose subtasks.',
    stack: ['Go', 'Gin', 'GORM', 'PostgreSQL', 'Next.js', 'TypeScript', 'WebSocket', 'Gemini'],
    categories: ['fullstack', 'ai'],
    image: '/projects/task-management.webp',
    imageAlt: 'Task management board listing tasks with status and priority',
    github: gh('task-management'),
    hue: 160,
  },
  {
    slug: 'blog-app',
    title: 'Blog App',
    tagline: 'Full-stack blogging with auth, pagination and dark mode.',
    description:
      'Full-stack blog platform with JWT auth, post CRUD with author-only edit/delete, a paginated public feed, a My Blogs dashboard and dark mode. React 19 + TypeScript + Tailwind (Vite) client, Express + TypeScript + PostgreSQL API. Deployed on Vercel, Render and Neon.',
    stack: ['React', 'TypeScript', 'Tailwind', 'Vite', 'Express', 'PostgreSQL'],
    categories: ['fullstack'],
    image: '/projects/blog-app.webp',
    imageAlt: 'Blog app home page with a feed of posts',
    github: gh('blog-app'),
    live: 'https://blog-app-seven-ruddy.vercel.app',
    hue: 20,
  },
  {
    slug: 'disaster-response-coordination',
    title: 'Disaster Response Coordination',
    tagline: 'Real-time disaster dashboard with Gemini and PostGIS.',
    description:
      'Disaster coordination dashboard using Gemini for location extraction, priority and image checks, OpenCage geocoding, Leaflet maps, reports and nearby-resource search over Supabase/PostGIS, with live updates via Socket.IO.',
    stack: ['React', 'Vite', 'Chakra UI', 'Express', 'Socket.IO', 'Supabase', 'PostGIS', 'Gemini'],
    categories: ['fullstack', 'ai'],
    image: '/projects/disaster-response-coordination.webp',
    imageAlt: 'Disaster response dashboard listing active disasters',
    github: gh('disaster-response-coordination'),
    live: 'https://disaster-response-coordination-one.vercel.app',
    hue: 0,
  },
  {
    slug: 'sql-query-editor',
    title: 'SQL Query Editor',
    tagline: 'Browser-based SQL editor with virtualized results.',
    description:
      'Browser-based SQL editor demo built with React, Vite and CodeMirror: syntax highlighting, query formatting, predefined Northwind-style queries, virtualized sortable results (react-window), query history and CSV export. Runs against mock data.',
    stack: ['React', 'Vite', 'CodeMirror', 'react-window'],
    categories: ['fullstack'],
    image: '/projects/sql-query-editor.webp',
    imageAlt: 'SQL editor in dark mode with query and results table',
    github: gh('sql-query-editor'),
    live: 'https://sql-query-editor-fawn.vercel.app',
    hue: 220,
  },
  {
    slug: 'smart-cab-allocation',
    title: 'Smart Cab Allocation',
    tagline: 'Nearest-cab matching on Google Maps.',
    description:
      'Full-stack cab booking app: find the nearest available cab on Google Maps (Haversine distance plus town/pincode matching), book it, follow a simulated trip along the driving route, and manage cabs and users as an admin.',
    stack: ['React', 'Express', 'MongoDB', 'JWT', 'Google Maps API'],
    categories: ['fullstack'],
    image: '/projects/smart-cab-allocation.webp',
    imageAlt: 'Cab search screen showing nearby cabs on a map',
    github: gh('smart-cab-allocation'),
    live: 'https://smart-cab-allocation-frontend.vercel.app/login',
    hue: 45,
  },
  {
    slug: 'ride-sharing-platform',
    title: 'Ride-Sharing Platform',
    tagline: 'Ride-safety sharing with live maps and feedback.',
    description:
      'Full-stack ride-safety sharing app (monorepo). Travelers share cab details via WhatsApp, companions view shared trips on a Leaflet map and leave feedback, and admins review users and feedback.',
    stack: ['React', 'Express', 'Sequelize', 'PostgreSQL', 'JWT', 'WebSocket', 'Leaflet'],
    categories: ['fullstack'],
    image: '/projects/ride-sharing-platform.webp',
    imageAlt: 'Traveler dashboard of the ride-sharing platform',
    github: gh('Ride-Sharing-Platform'),
    hue: 280,
  },
  {
    slug: 'crypto-weather-nexus',
    title: 'Crypto Weather Nexus',
    tagline: 'Live crypto prices, weather and news in one dashboard.',
    description:
      'Next.js 14 dashboard combining live crypto prices (CoinGecko), city weather (OpenWeatherMap) and crypto news, with 7-day price charts, favorites saved locally and toast alerts for big price or weather changes.',
    stack: ['Next.js', 'TypeScript', 'Redux Toolkit', 'Tailwind', 'Jest'],
    categories: ['fullstack'],
    image: '/projects/crypto-weather-nexus.webp',
    imageAlt: 'Dashboard with weather cards, crypto prices and news',
    github: gh('crypto-weather-nexus'),
    live: 'https://crypto-weather-nexus-eta.vercel.app/',
    hue: 190,
  },
  {
    slug: 'imf-gadget-api',
    title: 'IMF Gadget API',
    tagline: 'Mission: Impossible-themed REST API.',
    description:
      'REST API for an IMF gadget inventory: JWT auth, auto-generated codenames, random mission success probability, status filtering, soft decommissioning and a self-destruct endpoint, documented with Swagger.',
    stack: ['Node.js', 'Express', 'PostgreSQL', 'Sequelize', 'Swagger'],
    categories: ['backend'],
    github: gh('imf-gadget-api'),
    hue: 330,
  },
  {
    slug: 'movie-imdb',
    title: 'Movie IMDb',
    tagline: 'Debounced movie search with ratings and themes.',
    description:
      'Responsive movie search app using the OMDb API: debounced live search, movie detail pages, 1-5 star ratings and a light/dark theme. Built with Next.js 15, React 19, TanStack Query, Redux Toolkit, Tailwind CSS 4 and shadcn/ui.',
    stack: ['Next.js', 'React', 'TypeScript', 'TanStack Query', 'Redux Toolkit', 'Tailwind', 'shadcn/ui'],
    categories: ['fullstack'],
    image: '/projects/movie-imdb.webp',
    imageAlt: 'Movie search results grid',
    github: gh('movie-imdb'),
    live: 'https://movie-imdb-omega.vercel.app/movies',
    hue: 50,
  },
  {
    slug: 'ibooking',
    title: 'IBooking',
    tagline: 'Hotel search and reservations on the MERN stack.',
    description:
      'Hotel booking web app: React frontend with destination/date/guest search, hotel pages and room reservation, backed by an Express + MongoDB REST API with JWT auth and admin-only hotel/room management.',
    stack: ['React', 'Express', 'MongoDB', 'Mongoose', 'JWT'],
    categories: ['fullstack'],
    image: '/projects/ibooking.webp',
    imageAlt: 'Hotel booking home page with a search bar',
    github: gh('IBooking'),
    hue: 210,
  },
  {
    slug: 'faq-project',
    title: 'Multilingual FAQ API',
    tagline: 'Auto-translated FAQs with Redis caching.',
    description:
      'Multilingual FAQ REST API built with Django and DRF. FAQs are auto-translated to Hindi and Bengali on save, answers use a CKEditor rich-text editor, and per-language responses are cached in Redis.',
    stack: ['Python', 'Django', 'DRF', 'Redis', 'CKEditor'],
    categories: ['backend'],
    image: '/projects/faq-project.webp',
    imageAlt: 'FAQ page listing translated questions',
    github: gh('faq_project'),
    hue: 140,
  },
  {
    slug: 'plagiarism-checker',
    title: 'Plagiarism Checker',
    tagline: 'Cosine-similarity plagiarism estimates.',
    description:
      'Django web app that estimates plagiarism by comparing text or .txt/.docx uploads against Google Custom Search results, and compares two documents with each other, using cosine similarity and NLTK stopword filtering.',
    stack: ['Python', 'Django', 'NLTK', 'Google Custom Search'],
    categories: ['backend'],
    image: '/projects/plagiarism-checker.webp',
    imageAlt: 'Plagiarism checker web check page',
    github: gh('Plagiarism-Checker'),
    hue: 100,
  },
];

export type SkillGroup = { key: string; title: string; blurb: string; items: string[] };

export const skills: SkillGroup[] = [
  { key: 'lang', title: 'Languages', blurb: 'Daily drivers and the rest', items: ['Java', 'Python', 'JavaScript', 'TypeScript', 'SQL', 'C++', 'Go'] },
  {
    key: 'backend',
    title: 'Backend & Data',
    blurb: 'Services, rules and pipelines',
    items: ['Node.js', 'Express', 'Django', 'Drools', 'REST', 'Data pipelines', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'DynamoDB'],
  },
  {
    key: 'cloud',
    title: 'Cloud & DevOps',
    blurb: 'AWS and shipping safely',
    items: ['AWS Lambda', 'CDK', 'DynamoDB', 'S3', 'SQS', 'Glue', 'CloudWatch', 'IAM', 'EC2', 'Docker', 'CI/CD', 'Git'],
  },
  { key: 'frontend', title: 'Frontend', blurb: 'Interfaces people enjoy', items: ['React', 'Next.js', 'Redux', 'React Query', 'Tailwind'] },
  { key: 'ai', title: 'AI', blurb: 'Agents and tooling', items: ['Rovo agents', 'MCP', 'Gemini'] },
];

export const sections = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'lab', label: 'Lab' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
] as const;

/** Every scroll target, in page order (used by the section rail, palette and terminal). */
export const allSections = [
  { id: 'top', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'lab', label: 'Incident replay' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'fit', label: 'Fit finder' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'contact', label: 'Contact' },
] as const;
