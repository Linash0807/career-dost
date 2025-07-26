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
      progress: 0,
      milestones: [
        {
          title: 'HTML & CSS',
          description: 'Learn the basics of HTML and CSS',
          completed: false,
          dueDate: null,
          skills: ['HTML5', 'CSS3', 'Flexbox', 'Grid']
        },
        {
          title: 'JavaScript Basics',
          description: 'Understand JavaScript fundamentals',
          completed: false,
          dueDate: null,
          skills: ['Variables', 'Functions', 'DOM Manipulation', 'Events']
        },
        {
          title: 'Frontend Frameworks',
          description: 'Learn React or other frameworks',
          completed: false,
          dueDate: null,
          skills: ['React', 'Vue', 'Angular']
        }
      ]
    },
    {
      name: 'Backend Developer',
      progress: 0,
      milestones: [
        {
          title: 'Node.js Basics',
          description: 'Learn Node.js runtime and basics',
          completed: false,
          dueDate: null,
          skills: ['Node.js', 'npm', 'Modules']
        },
        {
          title: 'Databases',
          description: 'Understand databases and ORM',
          completed: false,
          dueDate: null,
          skills: ['MongoDB', 'SQL', 'Mongoose', 'Sequelize']
        },
        {
          title: 'API Development',
          description: 'Build RESTful APIs',
          completed: false,
          dueDate: null,
          skills: ['Express', 'REST', 'Authentication']
        }
      ]
    },
    {
      name: 'DevOps Engineer',
      progress: 0,
      milestones: [
        {
          title: 'Linux Basics',
          description: 'Learn Linux commands and shell scripting',
          completed: false,
          dueDate: null,
          skills: ['Bash', 'Shell Scripting', 'Linux Commands']
        },
        {
          title: 'CI/CD',
          description: 'Understand Continuous Integration and Deployment',
          completed: false,
          dueDate: null,
          skills: ['Jenkins', 'GitHub Actions', 'Docker']
        },
        {
          title: 'Cloud Platforms',
          description: 'Learn cloud services',
          completed: false,
          dueDate: null,
          skills: ['AWS', 'Azure', 'GCP']
        }
      ]
    }
  ];

  await CareerPath.insertMany(careerPathsData);
  console.log('Seeded career paths');
};

export default seedCareerPaths;
