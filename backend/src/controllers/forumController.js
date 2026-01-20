import ForumPost from '../models/ForumPost.js';

// Create a new forum post
export const createPost = async (req, res) => {
  try {
    const { title, body, tags } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required.' });
    }

    const post = new ForumPost({
      title,
      body,
      tags: tags || [],
      user: userId,
    });

    await post.save();
    res.status(201).json({ post });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error creating post' });
  }
};

// Get all forum posts
export const getPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find()
      .populate('user', 'name')
      .populate('replies.user', 'name')
      .sort({ createdAt: -1 });
    res.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error fetching posts' });
  }
};

// Add a reply to a forum post
export const addReply = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!text) {
      return res.status(400).json({ message: 'Reply text is required.' });
    }

    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    post.replies.push({
      user: userId,
      text,
    });

    await post.save();
    res.json({ post });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ message: 'Server error adding reply' });
  }
};

// Upvote a forum post
export const upvotePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const post = await ForumPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Check if user has already upvoted
    const alreadyUpvoted = post.upvotes.includes(userId);
    if (alreadyUpvoted) {
      // Remove upvote
      post.upvotes = post.upvotes.filter(id => id.toString() !== userId.toString());
    } else {
      // Add upvote
      post.upvotes.push(userId);
    }

    await post.save();
    res.json({ post, upvoted: !alreadyUpvoted });
  } catch (error) {
    console.error('Error upvoting post:', error);
    res.status(500).json({ message: 'Server error upvoting post' });
  }
};
