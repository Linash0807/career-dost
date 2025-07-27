import CareerPath from '../models/CareerPath.js';

const seedCareerPaths = async () => {
  const existing = await CareerPath.find();
  if (existing.length > 0) {
    console.log('Career paths already seeded');
    return;
  }

  const careerPathsData = [
    {
      name: 'Frontend Developer',
      description: 'Build beautiful, responsive user interfaces and web applications',
      icon: '🎨',
      difficulty: 'Beginner',
      estimatedDuration: '6-8 months',
      progress: 0,
      milestones: [
        {
          title: 'HTML & CSS Fundamentals',
          description: 'Master the building blocks of web development',
          completed: false,
          dueDate: null,
          skills: ['HTML5', 'CSS3', 'Semantic HTML', 'CSS Grid', 'Flexbox', 'Responsive Design'],
          resources: ['MDN Web Docs', 'CSS-Tricks', 'Flexbox Froggy'],
          estimatedTime: '2-3 weeks'
        },
        {
          title: 'JavaScript Essentials',
          description: 'Learn modern JavaScript programming',
          completed: false,
          dueDate: null,
          skills: ['ES6+', 'DOM Manipulation', 'Event Handling', 'Async/Await', 'Promises', 'Modules'],
          resources: ['Eloquent JavaScript', 'You Don\'t Know JS', 'JavaScript.info'],
          estimatedTime: '4-6 weeks'
        },
        {
          title: 'React Framework',
          description: 'Build interactive UIs with React',
          completed: false,
          dueDate: null,
          skills: ['React Hooks', 'Component Lifecycle', 'State Management', 'Props', 'JSX', 'Virtual DOM'],
          resources: ['React Official Docs', 'React Tutorial', 'Kent C. Dodds Blog'],
          estimatedTime: '6-8 weeks'
        },
        {
          title: 'Advanced Frontend',
          description: 'Master advanced frontend concepts',
          completed: false,
          dueDate: null,
          skills: ['TypeScript', 'Next.js', 'State Management (Redux/Zustand)', 'Testing (Jest/RTL)', 'Performance Optimization'],
          resources: ['TypeScript Handbook', 'Next.js Docs', 'Redux Toolkit'],
          estimatedTime: '8-10 weeks'
        }
      ]
    },
    {
      name: 'Backend Developer',
      description: 'Build robust server-side applications and APIs',
      icon: '⚙️',
      difficulty: 'Intermediate',
      estimatedDuration: '8-10 months',
      progress: 0,
      milestones: [
        {
          title: 'Programming Fundamentals',
          description: 'Master core programming concepts',
          completed: false,
          dueDate: null,
          skills: ['Data Structures', 'Algorithms', 'OOP', 'Design Patterns', 'Error Handling'],
          resources: ['Grokking Algorithms', 'Clean Code', 'Design Patterns Book'],
          estimatedTime: '4-6 weeks'
        },
        {
          title: 'Node.js & Express',
          description: 'Build server-side applications with Node.js',
          completed: false,
          dueDate: null,
          skills: ['Node.js', 'Express.js', 'Middleware', 'Routing', 'Error Handling', 'NPM'],
          resources: ['Node.js Docs', 'Express.js Guide', 'Node.js Design Patterns'],
          estimatedTime: '6-8 weeks'
        },
        {
          title: 'Database Management',
          description: 'Work with databases and data modeling',
          completed: false,
          dueDate: null,
          skills: ['MongoDB', 'SQL', 'Mongoose', 'Database Design', 'CRUD Operations', 'Indexing'],
          resources: ['MongoDB University', 'SQL Tutorial', 'Database Design Course'],
          estimatedTime: '6-8 weeks'
        },
        {
          title: 'API Development',
          description: 'Build RESTful and GraphQL APIs',
          completed: false,
          dueDate: null,
          skills: ['REST APIs', 'GraphQL', 'Authentication', 'Authorization', 'API Documentation', 'Testing'],
          resources: ['REST API Design', 'GraphQL Docs', 'Postman Learning'],
          estimatedTime: '8-10 weeks'
        }
      ]
    },
    {
      name: 'Full Stack Developer',
      description: 'Master both frontend and backend development',
      icon: '🔄',
      difficulty: 'Advanced',
      estimatedDuration: '12-15 months',
      progress: 0,
      milestones: [
        {
          title: 'Frontend Mastery',
          description: 'Complete frontend development skills',
          completed: false,
          dueDate: null,
          skills: ['React/Vue/Angular', 'TypeScript', 'State Management', 'Testing', 'Performance'],
          resources: ['Frontend Masters', 'React Advanced', 'Vue Mastery'],
          estimatedTime: '8-10 weeks'
        },
        {
          title: 'Backend Mastery',
          description: 'Complete backend development skills',
          completed: false,
          dueDate: null,
          skills: ['Node.js/Python/Java', 'Databases', 'APIs', 'Authentication', 'Security'],
          resources: ['Backend Masters', 'Node.js Advanced', 'Python Backend'],
          estimatedTime: '8-10 weeks'
        },
        {
          title: 'DevOps & Deployment',
          description: 'Learn deployment and infrastructure',
          completed: false,
          dueDate: null,
          skills: ['Docker', 'CI/CD', 'Cloud Platforms', 'Monitoring', 'Logging'],
          resources: ['Docker Tutorial', 'GitHub Actions', 'AWS/Azure/GCP'],
          estimatedTime: '6-8 weeks'
        },
        {
          title: 'Full Stack Projects',
          description: 'Build complete applications',
          completed: false,
          dueDate: null,
          skills: ['Project Architecture', 'Code Organization', 'Testing Strategy', 'Performance Optimization'],
          resources: ['Full Stack Open', 'Real World Apps', 'Project Ideas'],
          estimatedTime: '10-12 weeks'
        }
      ]
    },
    {
      name: 'Data Scientist',
      description: 'Analyze data and build machine learning models',
      icon: '📊',
      difficulty: 'Advanced',
      estimatedDuration: '12-15 months',
      progress: 0,
      milestones: [
        {
          title: 'Mathematics & Statistics',
          description: 'Build strong mathematical foundation',
          completed: false,
          dueDate: null,
          skills: ['Linear Algebra', 'Calculus', 'Statistics', 'Probability', 'Optimization'],
          resources: ['Khan Academy', 'MIT OpenCourseWare', 'Statistics Course'],
          estimatedTime: '8-10 weeks'
        },
        {
          title: 'Python for Data Science',
          description: 'Master Python data science libraries',
          completed: false,
          dueDate: null,
          skills: ['Python', 'NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'Jupyter'],
          resources: ['Python for Data Science', 'Pandas Documentation', 'DataCamp'],
          estimatedTime: '6-8 weeks'
        },
        {
          title: 'Machine Learning',
          description: 'Learn ML algorithms and techniques',
          completed: false,
          dueDate: null,
          skills: ['Scikit-learn', 'Supervised Learning', 'Unsupervised Learning', 'Model Evaluation', 'Feature Engineering'],
          resources: ['Coursera ML Course', 'Scikit-learn Tutorial', 'Kaggle Courses'],
          estimatedTime: '10-12 weeks'
        },
        {
          title: 'Deep Learning',
          description: 'Master neural networks and deep learning',
          completed: false,
          dueDate: null,
          skills: ['TensorFlow/PyTorch', 'Neural Networks', 'CNN', 'RNN', 'Transfer Learning'],
          resources: ['Deep Learning Specialization', 'Fast.ai', 'PyTorch Tutorials'],
          estimatedTime: '12-15 weeks'
        }
      ]
    },
    {
      name: 'Mobile Developer',
      description: 'Build native and cross-platform mobile applications',
      icon: '📱',
      difficulty: 'Intermediate',
      estimatedDuration: '8-12 months',
      progress: 0,
      milestones: [
        {
          title: 'Mobile Development Basics',
          description: 'Understand mobile app development concepts',
          completed: false,
          dueDate: null,
          skills: ['Mobile UI/UX', 'Platform Guidelines', 'App Store Guidelines', 'Mobile Testing'],
          resources: ['iOS Human Interface Guidelines', 'Material Design', 'Mobile Testing Guide'],
          estimatedTime: '4-6 weeks'
        },
        {
          title: 'React Native',
          description: 'Build cross-platform mobile apps',
          completed: false,
          dueDate: null,
          skills: ['React Native', 'Navigation', 'State Management', 'Native Modules', 'Performance'],
          resources: ['React Native Docs', 'Expo', 'React Navigation'],
          estimatedTime: '8-10 weeks'
        },
        {
          title: 'Native Development',
          description: 'Build native iOS/Android apps',
          completed: false,
          dueDate: null,
          skills: ['Swift/Kotlin', 'iOS/Android SDK', 'App Architecture', 'Publishing'],
          resources: ['iOS App Development', 'Android Development', 'App Store Connect'],
          estimatedTime: '10-12 weeks'
        },
        {
          title: 'Advanced Mobile Features',
          description: 'Implement advanced mobile features',
          completed: false,
          dueDate: null,
          skills: ['Push Notifications', 'Offline Storage', 'Camera/Media', 'Location Services', 'Analytics'],
          resources: ['Firebase', 'Mobile Analytics', 'Push Notification Guide'],
          estimatedTime: '6-8 weeks'
        }
      ]
    },
    {
      name: 'DevOps Engineer',
      description: 'Manage infrastructure and deployment pipelines',
      icon: '🚀',
      difficulty: 'Advanced',
      estimatedDuration: '10-12 months',
      progress: 0,
      milestones: [
        {
          title: 'Linux & Shell Scripting',
          description: 'Master Linux administration and automation',
          completed: false,
          dueDate: null,
          skills: ['Linux Commands', 'Bash Scripting', 'System Administration', 'Process Management'],
          resources: ['Linux Journey', 'Bash Scripting Tutorial', 'Linux Academy'],
          estimatedTime: '6-8 weeks'
        },
        {
          title: 'Containerization',
          description: 'Learn Docker and container orchestration',
          completed: false,
          dueDate: null,
          skills: ['Docker', 'Docker Compose', 'Kubernetes', 'Container Security'],
          resources: ['Docker Tutorial', 'Kubernetes Docs', 'Docker Security'],
          estimatedTime: '8-10 weeks'
        },
        {
          title: 'CI/CD Pipelines',
          description: 'Build automated deployment pipelines',
          completed: false,
          dueDate: null,
          skills: ['Jenkins', 'GitHub Actions', 'GitLab CI', 'Pipeline Design'],
          resources: ['Jenkins Tutorial', 'GitHub Actions Docs', 'CI/CD Best Practices'],
          estimatedTime: '6-8 weeks'
        },
        {
          title: 'Cloud Platforms',
          description: 'Master cloud infrastructure management',
          completed: false,
          dueDate: null,
          skills: ['AWS/Azure/GCP', 'Infrastructure as Code', 'Monitoring', 'Security'],
          resources: ['AWS Training', 'Azure Docs', 'Google Cloud Platform'],
          estimatedTime: '10-12 weeks'
        }
      ]
    },
    {
      name: 'Cybersecurity Engineer',
      description: 'Protect systems and networks from cyber threats',
      icon: '🔒',
      difficulty: 'Advanced',
      estimatedDuration: '12-15 months',
      progress: 0,
      milestones: [
        {
          title: 'Security Fundamentals',
          description: 'Understand cybersecurity basics',
          completed: false,
          dueDate: null,
          skills: ['Network Security', 'Cryptography', 'Security Protocols', 'Threat Modeling'],
          resources: ['Cybersecurity Fundamentals', 'Network Security Course', 'Cryptography Course'],
          estimatedTime: '8-10 weeks'
        },
        {
          title: 'Penetration Testing',
          description: 'Learn ethical hacking and testing',
          completed: false,
          dueDate: null,
          skills: ['Kali Linux', 'Metasploit', 'Burp Suite', 'Vulnerability Assessment'],
          resources: ['Kali Linux Tutorial', 'Metasploit Framework', 'OWASP Testing Guide'],
          estimatedTime: '10-12 weeks'
        },
        {
          title: 'Security Tools & Technologies',
          description: 'Master security tools and platforms',
          completed: false,
          dueDate: null,
          skills: ['SIEM Tools', 'Firewalls', 'IDS/IPS', 'Security Monitoring'],
          resources: ['Splunk Tutorial', 'Wireshark', 'Security Tools Guide'],
          estimatedTime: '8-10 weeks'
        },
        {
          title: 'Security Operations',
          description: 'Manage security operations and incident response',
          completed: false,
          dueDate: null,
          skills: ['Incident Response', 'Forensics', 'Compliance', 'Security Policies'],
          resources: ['Incident Response Guide', 'Digital Forensics', 'Security Compliance'],
          estimatedTime: '10-12 weeks'
        }
      ]
    },
    {
      name: 'Cloud Engineer',
      description: 'Design and manage cloud infrastructure solutions',
      icon: '☁️',
      difficulty: 'Advanced',
      estimatedDuration: '10-12 months',
      progress: 0,
      milestones: [
        {
          title: 'Cloud Fundamentals',
          description: 'Understand cloud computing concepts',
          completed: false,
          dueDate: null,
          skills: ['Cloud Models', 'Virtualization', 'Cloud Services', 'Cost Optimization'],
          resources: ['AWS Cloud Practitioner', 'Azure Fundamentals', 'Google Cloud Basics'],
          estimatedTime: '6-8 weeks'
        },
        {
          title: 'Infrastructure as Code',
          description: 'Automate infrastructure deployment',
          completed: false,
          dueDate: null,
          skills: ['Terraform', 'CloudFormation', 'Ansible', 'Infrastructure Automation'],
          resources: ['Terraform Tutorial', 'AWS CloudFormation', 'Ansible Documentation'],
          estimatedTime: '8-10 weeks'
        },
        {
          title: 'Cloud Architecture',
          description: 'Design scalable cloud solutions',
          completed: false,
          dueDate: null,
          skills: ['Microservices', 'Serverless', 'Load Balancing', 'Auto Scaling'],
          resources: ['AWS Architecture', 'Azure Architecture', 'Cloud Architecture Patterns'],
          estimatedTime: '10-12 weeks'
        },
        {
          title: 'Cloud Security & Compliance',
          description: 'Secure cloud environments',
          completed: false,
          dueDate: null,
          skills: ['Cloud Security', 'Identity Management', 'Compliance', 'Monitoring'],
          resources: ['AWS Security', 'Azure Security', 'Cloud Security Alliance'],
          estimatedTime: '8-10 weeks'
        }
      ]
    },
    {
      name: 'Product Manager',
      description: 'Lead product development and strategy',
      icon: '📋',
      difficulty: 'Intermediate',
      estimatedDuration: '8-10 months',
      progress: 0,
      milestones: [
        {
          title: 'Product Management Fundamentals',
          description: 'Learn product management basics',
          completed: false,
          dueDate: null,
          skills: ['Product Strategy', 'Market Research', 'User Research', 'Product Lifecycle'],
          resources: ['Product Management Course', 'Inspired Book', 'Product Hunt'],
          estimatedTime: '6-8 weeks'
        },
        {
          title: 'User Experience Design',
          description: 'Understand UX principles and design thinking',
          completed: false,
          dueDate: null,
          skills: ['Design Thinking', 'User Personas', 'User Journey Mapping', 'Wireframing'],
          resources: ['Design Thinking Course', 'UX Design Course', 'Figma Tutorial'],
          estimatedTime: '6-8 weeks'
        },
        {
          title: 'Data Analysis & Metrics',
          description: 'Use data to drive product decisions',
          completed: false,
          dueDate: null,
          skills: ['Analytics Tools', 'A/B Testing', 'KPI Definition', 'Data Visualization'],
          resources: ['Google Analytics', 'Mixpanel', 'Amplitude', 'Tableau'],
          estimatedTime: '6-8 weeks'
        },
        {
          title: 'Agile & Scrum',
          description: 'Manage product development process',
          completed: false,
          dueDate: null,
          skills: ['Agile Methodology', 'Scrum Framework', 'Sprint Planning', 'Stakeholder Management'],
          resources: ['Scrum Guide', 'Agile Manifesto', 'Jira Tutorial'],
          estimatedTime: '4-6 weeks'
        }
      ]
    },
    {
      name: 'Blockchain Developer',
      description: 'Build decentralized applications and smart contracts',
      icon: '⛓️',
      difficulty: 'Advanced',
      estimatedDuration: '10-12 months',
      progress: 0,
      milestones: [
        {
          title: 'Blockchain Fundamentals',
          description: 'Understand blockchain technology',
          completed: false,
          dueDate: null,
          skills: ['Blockchain Basics', 'Cryptography', 'Consensus Mechanisms', 'Distributed Systems'],
          resources: ['Blockchain Basics', 'Mastering Bitcoin', 'Ethereum Whitepaper'],
          estimatedTime: '6-8 weeks'
        },
        {
          title: 'Smart Contract Development',
          description: 'Build smart contracts with Solidity',
          completed: false,
          dueDate: null,
          skills: ['Solidity', 'Smart Contracts', 'Ethereum', 'Gas Optimization'],
          resources: ['Solidity Docs', 'CryptoZombies', 'OpenZeppelin'],
          estimatedTime: '8-10 weeks'
        },
        {
          title: 'DApp Development',
          description: 'Build decentralized applications',
          completed: false,
          dueDate: null,
          skills: ['Web3.js', 'DApp Architecture', 'Frontend Integration', 'Testing'],
          resources: ['Web3.js Docs', 'DApp Tutorial', 'Truffle Framework'],
          estimatedTime: '8-10 weeks'
        },
        {
          title: 'Advanced Blockchain',
          description: 'Master advanced blockchain concepts',
          completed: false,
          dueDate: null,
          skills: ['Layer 2 Solutions', 'DeFi Protocols', 'NFT Development', 'Cross-chain'],
          resources: ['Layer 2 Guide', 'DeFi Protocols', 'NFT Standards'],
          estimatedTime: '10-12 weeks'
        }
      ]
    },
    {
      name: 'Game Developer',
      description: 'Create interactive games and immersive experiences',
      icon: '🎮',
      difficulty: 'Intermediate',
      estimatedDuration: '10-12 months',
      progress: 0,
      milestones: [
        {
          title: 'Game Development Fundamentals',
          description: 'Learn game development basics',
          completed: false,
          dueDate: null,
          skills: ['Game Design', 'Game Mechanics', 'Game Loop', 'User Experience'],
          resources: ['Game Design Workshop', 'The Art of Game Design', 'Game Developer'],
          estimatedTime: '6-8 weeks'
        },
        {
          title: 'Unity Game Engine',
          description: 'Master Unity game development',
          completed: false,
          dueDate: null,
          skills: ['Unity', 'C# Programming', 'Game Objects', 'Physics', 'Animation'],
          resources: ['Unity Learn', 'Unity Documentation', 'Brackeys YouTube'],
          estimatedTime: '10-12 weeks'
        },
        {
          title: 'Game Programming',
          description: 'Advanced game programming concepts',
          completed: false,
          dueDate: null,
          skills: ['Game Architecture', 'AI Programming', 'Networking', 'Performance Optimization'],
          resources: ['Game Programming Patterns', 'AI for Games', 'Unity Networking'],
          estimatedTime: '8-10 weeks'
        },
        {
          title: 'Game Publishing',
          description: 'Publish and monetize games',
          completed: false,
          dueDate: null,
          skills: ['App Store Publishing', 'Steam Publishing', 'Monetization', 'Marketing'],
          resources: ['App Store Guidelines', 'Steam Publishing', 'Game Marketing'],
          estimatedTime: '6-8 weeks'
        }
      ]
    },
    {
      name: 'AI/ML Engineer',
      description: 'Build intelligent systems and machine learning solutions',
      icon: '🤖',
      difficulty: 'Advanced',
      estimatedDuration: '12-15 months',
      progress: 0,
      milestones: [
        {
          title: 'Mathematics for AI',
          description: 'Build mathematical foundation for AI',
          completed: false,
          dueDate: null,
          skills: ['Linear Algebra', 'Calculus', 'Statistics', 'Probability', 'Optimization'],
          resources: ['MIT Mathematics', 'Khan Academy', 'Statistics Course'],
          estimatedTime: '8-10 weeks'
        },
        {
          title: 'Machine Learning Fundamentals',
          description: 'Learn core ML algorithms and techniques',
          completed: false,
          dueDate: null,
          skills: ['Supervised Learning', 'Unsupervised Learning', 'Model Evaluation', 'Feature Engineering'],
          resources: ['Coursera ML', 'Scikit-learn', 'Kaggle Courses'],
          estimatedTime: '10-12 weeks'
        },
        {
          title: 'Deep Learning',
          description: 'Master neural networks and deep learning',
          completed: false,
          dueDate: null,
          skills: ['Neural Networks', 'CNN', 'RNN', 'Transformers', 'PyTorch/TensorFlow'],
          resources: ['Deep Learning Specialization', 'Fast.ai', 'PyTorch Tutorials'],
          estimatedTime: '12-15 weeks'
        },
        {
          title: 'AI Applications',
          description: 'Build real-world AI applications',
          completed: false,
          dueDate: null,
          skills: ['Computer Vision', 'NLP', 'Recommendation Systems', 'AI Ethics'],
          resources: ['Computer Vision Course', 'NLP Course', 'AI Ethics Course'],
          estimatedTime: '10-12 weeks'
        }
      ]
    }
  ];

  await CareerPath.insertMany(careerPathsData);
  console.log('✅ Seeded 12 comprehensive career paths');
};

export default seedCareerPaths;
