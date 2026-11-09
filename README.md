# Vamsi Krishna Thota - Portfolio

A responsive single-page portfolio built with React and styled-components. It covers my experience, skills and projects.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![styled-components](https://img.shields.io/badge/styled--components-5-DB7093?logo=styledcomponents&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-5-007FFF?logo=mui&logoColor=white)
![EmailJS](https://img.shields.io/badge/EmailJS-contact%20form-F5A623)
![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000000?logo=vercel)

## Live demo

**https://portfolio-beryl-nine-58.vercel.app**

## Overview

The site is a Create React App project. All content (bio, skills, experience, education and projects) lives in one data file, `src/data/constants.js`, so you can update the site without touching any components. It is a single scrolling page, and project details open in a modal.

## Features

- **Sections:** Hero (with typewriter roles and an animated background), About, Skills, Experience, Projects, Education and Contact
- **Light/dark theme toggle:** a floating button switches the theme, and the choice is saved to `localStorage`
- **Project gallery:** filter by category and by role (frontend / backend / full-stack, inferred from project tags), sort by newest, oldest or complexity, and open a project's details in a modal
- **Contact form:** sends messages through [EmailJS](https://www.emailjs.com/) using `@emailjs/browser`
- **Page loader:** a short loading animation runs on first render
- **Back-to-top button** and smooth-scrolling navbar links
- **Responsive layout** for desktop, tablet and mobile

## Tech stack

| Area | Tools |
| --- | --- |
| UI | React 18, Create React App (`react-scripts`) |
| Styling | styled-components, Material UI (`@mui/material`, `@mui/icons-material`, `@mui/lab`) |
| Extras | `typewriter-effect`, `react-scroll`, `react-icons`, `react-router-dom` |
| Email | EmailJS (`@emailjs/browser`) |
| Hosting | Vercel (Node 22.x engine) |

## Project structure

```
Portfolio/
├── public/                 # index.html, favicon, profile and project images
│   └── images/             # project screenshots shown in the gallery
└── src/
    ├── App.js              # page layout, theme toggle, loader, project modal
    ├── components/         # HeroSection, About, Skills, Experience, Projects,
    │                       # ProjectDetails, Education, Contact, Navbar, Footer, ...
    ├── data/constants.js   # all site content (bio, skills, experience, projects)
    ├── themes/, utils/     # light and dark theme definitions
    └── images/
```

## Getting started

### Prerequisites

- Node.js 22.x (see `engines` in `package.json`) and npm

### Install and run

```bash
git clone https://github.com/VamsiKrishnaThota03/Portfolio.git
cd Portfolio
npm install
npm start          # dev server at http://localhost:3000
```

### Other scripts

| Command | Description |
| --- | --- |
| `npm run build` | Production build into `build/` |
| `npm test` | Run the CRA test runner |
| `npm run deploy` | Build and publish `build/` to GitHub Pages via `gh-pages` (the live site is hosted on Vercel) |

### Configuration

There are no environment variables. The EmailJS service ID, template ID and public key are set in `src/components/Contact/index.js`. To send messages to your own inbox, replace them with values from your EmailJS dashboard.

### Customizing the content

Edit `src/data/constants.js` to change the bio, resume link, social links, skills, experience, education and projects. Put project images in `public/images/`.

## Contact

- GitHub: [VamsiKrishnaThota03](https://github.com/VamsiKrishnaThota03)
- LinkedIn: [Vamsi Krishna Thota](https://www.linkedin.com/in/thota-vamsi-krishna-a6b9b1264/)
- Email: vamsikrishnathota483@gmail.com
