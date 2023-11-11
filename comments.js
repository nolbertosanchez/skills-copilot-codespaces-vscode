// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

// Create express application
const app = express();
// Middleware
app.use(bodyParser.json());
app.use(cors());

// Store all comments in memory
const commentsByPostId = {};

// Route handler for get request to /posts/:id/comments
app.get('/posts/:id/comments', (req, res) => {
  // Send back comments for a post id
  res.send(commentsByPostId[req.params.id] || []);
});

// Route handler for post request to /posts/:id/comments
app.post('/posts/:id/comments', async (req, res) => {
  // Create comment id
  const commentId = randomBytes(4).toString('hex');
  // Get content from request body
  const { content } = req.body;
  // Get comments for post id
  const comments = commentsByPostId[req.params.id] || [];
  // Push new comment to comments array
  comments.push({ id: commentId, content, status: 'pending' });
  // Set comments for post id
  commentsByPostId[req.params.id] = comments;
  // Send event to event bus
  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: 'pending',
    },
  });
  // Send back comments
  res.status(201).send(comments);
});

// Route handler for post request to /events
app.post('/events', async (req, res) => {
  // Get event
  const { type, data } = req.body;
  // If event type is CommentModerated
  if (type === 'CommentModerated') {
    // Get comment id, post id, content, status
    const { id, postId, content, status } = data;
    // Get comments for post id
    const comments = commentsByPostId[postId];
    // Find comment with id
    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    // Set status of comment
    comment.status = status;
    // Send event to event bus
    await axios.post