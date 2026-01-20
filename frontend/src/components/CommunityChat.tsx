import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';

interface User {
  _id: string;
  name: string;
}

interface Reply {
  _id: string;
  user: User;
  text: string;
  createdAt: string;
}

interface Post {
  _id: string;
  title: string;
  body: string;
  tags: string[];
  user: User;
  replies: Reply[];
  upvotes: string[];
  createdAt: string;
}

export const CommunityChat: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: '', body: '', tags: '' });
  const [replyTexts, setReplyTexts] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch current user
  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/auth/profile');
      setCurrentUser((response.data as any).user);
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  };

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const response = await api.get('/forum');
      setPosts((response.data as any).posts);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch posts');
      setLoading(false);
    }
  };

  // Create a new post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to create a post');
      return;
    }

    try {
      const postData = {
        title: newPost.title,
        body: newPost.body,
        tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      const response = await api.post('/forum', postData);
      setPosts([(response.data as any).post, ...posts]);
      setNewPost({ title: '', body: '', tags: '' });
    } catch (err) {
      setError('Failed to create post');
    }
  };

  // Add a reply to a post
  const handleAddReply = async (postId: string) => {
    if (!currentUser) {
      setError('You must be logged in to reply');
      return;
    }

    try {
      const response = await api.post(`/forum/${postId}/reply`, {
        text: replyTexts[postId],
      });

      // Update the post with the new reply
      setPosts(posts.map(post =>
        post._id === postId ? (response.data as any).post : post
      ));

      // Clear the reply text
      setReplyTexts({ ...replyTexts, [postId]: '' });
    } catch (err) {
      setError('Failed to add reply');
    }
  };

  // Upvote a post
  const handleUpvote = async (postId: string) => {
    if (!currentUser) {
      setError('You must be logged in to upvote');
      return;
    }

    try {
      const response = await api.post(`/forum/${postId}/upvote`);

      // Update the post with the new upvote status
      setPosts(posts.map(post =>
        post._id === postId ? (response.data as any).post : post
      ));
    } catch (err) {
      setError('Failed to upvote post');
    }
  };

  // Handle reply text change
  const handleReplyChange = (postId: string, text: string) => {
    setReplyTexts({ ...replyTexts, [postId]: text });
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Load posts and user on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchCurrentUser();
      fetchPosts();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (!isAuthenticated) {
    return <div className="text-center py-4">You must be logged in to view the community chat.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Post</h2>
        <form onSubmit={handleCreatePost}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="body">
              Content
            </label>
            <textarea
              id="body"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newPost.body}
              onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newPost.tags}
              onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            Create Post
          </button>
        </form>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Community Discussions</h2>
        {posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <p className="text-gray-600">No posts yet. Be the first to start a discussion!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
                    <div className="flex items-center mt-2">
                      <span className="text-sm font-medium text-gray-600">
                        {post.user.name}
                      </span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-sm text-gray-500">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUpvote(post._id)}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-full ${post.upvotes.includes(currentUser?._id || '')
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    <span>👍</span>
                    <span>{post.upvotes.length}</span>
                  </button>
                </div>
                <p className="mt-4 text-gray-700">{post.body}</p>
                {post.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Replies section */}
              <div className="bg-gray-50 px-6 py-4">
                <h4 className="font-medium text-gray-700 mb-3">Replies</h4>
                {post.replies.length > 0 ? (
                  <div className="space-y-4">
                    {post.replies.map((reply) => (
                      <div key={reply._id} className="border-l-2 border-blue-200 pl-4 py-2">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-800">{reply.user.name}</span>
                          <span className="text-xs text-gray-500">
                            {formatDate(reply.createdAt)}
                          </span>
                        </div>
                        <p className="mt-1 text-gray-700">{reply.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No replies yet.</p>
                )}

                {/* Add reply form */}
                <div className="mt-4 flex">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Write a reply..."
                    value={replyTexts[post._id] || ''}
                    onChange={(e) => handleReplyChange(post._id, e.target.value)}
                  />
                  <button
                    onClick={() => handleAddReply(post._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md transition duration-300"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
