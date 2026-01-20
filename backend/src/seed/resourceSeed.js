import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Resource from '../models/Resource.js';

dotenv.config();

const resources = [
    {
        title: "React - The Complete Guide",
        description: "Dive in and learn React.js from scratch! Learn Reactjs, Hooks, Redux, React Routing, Animations, Next.js and way more!",
        type: "course",
        url: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/",
        category: "Frontend",
        tags: ["React", "JavaScript", "Frontend"],
        difficulty: "intermediate",
        isPremium: true
    },
    {
        title: "Node.js Crash Course",
        description: "In this video we will look at the Node.js runtime environment and how it works.",
        type: "video",
        url: "https://www.youtube.com/watch?v=fBNz5xF-Kx4",
        category: "Backend",
        tags: ["Node.js", "JavaScript", "Backend"],
        difficulty: "beginner",
        isPremium: false
    },
    {
        title: "Introduction to Algorithms",
        description: "A comprehensive introduction to the modern study of computer algorithms.",
        type: "book", // Note: 'book' wasn't in my enum, I should check or update enum. I used 'documentation' in enum. Let's use 'article' or 'course' or update enum. I'll use 'course' for now or 'article'.
        // Wait, let's check my enum: ['video', 'article', 'course', 'documentation']
        // I'll use 'documentation' or 'article'. Let's use 'article' for a book link or 'course'.
        // Actually, I should stick to the enum.
        type: "article",
        url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
        category: "DSA",
        tags: ["Algorithms", "DSA", "Computer Science"],
        difficulty: "advanced",
        isPremium: false
    },
    {
        title: "MDN Web Docs",
        description: "Resources for developers, by developers.",
        type: "documentation",
        url: "https://developer.mozilla.org/en-US/",
        category: "Frontend",
        tags: ["HTML", "CSS", "JavaScript", "Web"],
        difficulty: "beginner",
        isPremium: false
    },
    {
        title: "System Design Primer",
        description: "Learn how to design large-scale systems.",
        type: "article",
        url: "https://github.com/donnemartin/system-design-primer",
        category: "System Design",
        tags: ["System Design", "Architecture", "Scalability"],
        difficulty: "advanced",
        isPremium: false
    },
    {
        title: "CS50's Introduction to Computer Science",
        description: "An introduction to the intellectual enterprises of computer science and the art of programming.",
        type: "course",
        url: "https://www.edx.org/course/introduction-computer-science-harvardx-cs50x",
        category: "Computer Science",
        tags: ["CS50", "Computer Science", "Programming"],
        difficulty: "beginner",
        isPremium: false
    }
];

const seedResources = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/career-dost');
        console.log('Connected to MongoDB');

        await Resource.deleteMany({});
        console.log('Cleared existing resources');

        await Resource.insertMany(resources);
        console.log('Seeded resources successfully');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding resources:', error);
        process.exit(1);
    }
};

seedResources();
