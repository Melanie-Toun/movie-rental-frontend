// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { formatDistanceToNow } from 'date-fns';
// import { FiEdit, FiTrash } from 'react-icons/fi';
// import { toast } from 'react-hot-toast';
// import { useAuthStore } from '@/store/authUser';

// const Comments = ({ mediaType, mediaId }) => {
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [editingCommentId, setEditingCommentId] = useState(null);
//   const [editText, setEditText] = useState('');
//   const user = useAuthStore(state => state.user);
//   const isAuthenticated = useAuthStore(state => state.isAuthenticated);

//   useEffect(() => {
//     fetchComments();
//   }, [mediaId, mediaType]);

//   const fetchComments = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`/api/reviews/comments/${mediaType}/${mediaId}`);
//       setComments(response.data.comments);
//     } catch (error) {
//       console.error('Error fetching comments:', error);
//       toast.error('Failed to load comments');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmitComment = async (e) => {
//     e.preventDefault();
    
//     if (!user) {
//       toast.error('Please login to comment');
//       return;
//     }
    
//     if (!newComment.trim()) {
//       toast.error('Comment cannot be empty');
//       return;
//     }
    
//     try {
//       setSubmitting(true);
//       const response = await axios.post(
//         '/api/reviews/comments',
//         {
//           mediaType,
//           mediaId,
//           content: newComment
//         }
//       );
      
//       setComments([response.data.comment, ...comments]);
//       setNewComment('');
//       toast.success('Comment added');
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Error adding comment');
//       console.error('Error adding comment:', error);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleEditComment = async (commentId) => {
//     if (!editText.trim()) {
//       toast.error('Comment cannot be empty');
//       return;
//     }
    
//     try {
//       setSubmitting(true);
//       const response = await axios.patch(
//         `/api/reviews/comments/${commentId}`,
//         { content: editText }
//       );
      
//       setComments(
//         comments.map((comment) =>
//           comment.id === commentId ? response.data.comment : comment
//         )
//       );
      
//       setEditingCommentId(null);
//       toast.success('Comment updated');
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Error updating comment');
//       console.error('Error updating comment:', error);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDeleteComment = async (commentId) => {
//     if (!window.confirm('Are you sure you want to delete this comment?')) {
//       return;
//     }
    
//     try {
//       setSubmitting(true);
//       await axios.delete(`/api/reviews/comments/${commentId}`);
      
//       setComments(comments.filter((comment) => comment.id !== commentId));
//       toast.success('Comment deleted');
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Error deleting comment');
//       console.error('Error deleting comment:', error);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const startEditing = (comment) => {
//     setEditingCommentId(comment.id);
//     setEditText(comment.content);
//   };

//   const cancelEditing = () => {
//     setEditingCommentId(null);
//     setEditText('');
//   };

//   return (
//     <div className="w-full max-w-4xl">
//       <h3 className="text-xl font-semibold mb-6">Comments</h3>
      
//       {/* New comment form */}
//       <form onSubmit={handleSubmitComment} className="mb-8">
//         <div className="flex items-start mb-4">
//           <img
//             src={user?.image || "/default-avatar.png"}
//             alt={user?.username || "User"}
//             className="w-10 h-10 rounded-full mr-3 object-cover"
//           />
//           <div className="flex-1">
//             <textarea
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//               placeholder={user ? "Add a comment..." : "Login to comment"}
//               disabled={!user || submitting}
//               className="w-full px-3 py-2 border text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               rows={3}
//             />
//           </div>
//         </div>
//         <div className="flex justify-end">
//           <button
//             type="submit"
//             disabled={!user || submitting || !newComment.trim()}
//             className={`px-4 py-2 rounded-md font-medium ${
//               !user || submitting || !newComment.trim()
//                 ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
//                 : 'bg-blue-600 text-white hover:bg-blue-700'
//             } transition-colors`}
//           >
//             {submitting ? 'Posting...' : 'Post Comment'}
//           </button>
//         </div>
//       </form>
      
//       {/* Comments list */}
//       <div className="space-y-6">
//         {loading ? (
//           <p className="text-center py-4">Loading comments...</p>
//         ) : comments.length === 0 ? (
//           <p className="text-center py-4 text-gray-500">No comments yet. Be the first to comment!</p>
//         ) : (
//           comments.map((comment) => (
//             <div key={comment.id} className="bg-gray-100 text-slate-900 dark:bg-gray-800 p-4 rounded-lg">
//               <div className="flex items-start gap-3">
//                 <img
//                   src={comment.user.image || "/default-avatar.png"}
//                   alt={comment.user.username}
//                   className="w-10 h-10 rounded-full object-cover"
//                 />
//                 <div className="flex-1">
//                   <div className="flex justify-between items-center mb-1">
//                     <h4 className="font-semibold">{comment.user.username}</h4>
//                     <span className="text-sm text-gray-500">
//                       {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
//                     </span>
//                   </div>
                  
//                   {editingCommentId === comment.id ? (
//                     <div className="mt-2">
//                       <textarea
//                         value={editText}
//                         onChange={(e) => setEditText(e.target.value)}
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         rows={3}
//                         disabled={submitting}
//                       />
//                       <div className="flex justify-end gap-2 mt-2">
//                         <button
//                           onClick={cancelEditing}
//                           className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100 transition-colors"
//                           disabled={submitting}
//                         >
//                           Cancel
//                         </button>
//                         <button
//                           onClick={() => handleEditComment(comment.id)}
//                           className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
//                           disabled={submitting || !editText.trim()}
//                         >
//                           {submitting ? 'Saving...' : 'Save'}
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     <>
//                       <p className="text-gray-800 dark:text-gray-200">{comment.content}</p>
//                       {comment.user.id === user?.id && (
//                         <div className="flex gap-3 mt-2">
//                           <button
//                             onClick={() => startEditing(comment)}
//                             className="text-gray-500 hover:text-blue-600 flex items-center gap-1 text-sm"
//                             disabled={submitting}
//                           >
//                             <FiEdit size={14} />
//                             <span>Edit</span>
//                           </button>
//                           <button
//                             onClick={() => handleDeleteComment(comment.id)}
//                             className="text-gray-500 hover:text-red-600 flex items-center gap-1 text-sm"
//                             disabled={submitting}
//                           >
//                             <FiTrash size={14} />
//                             <span>Delete</span>
//                           </button>
//                         </div>
//                       )}
//                     </>
//                   )}
                  
//                   {comment.edited && (
//                     <span className="text-xs text-gray-500 mt-1 italic">
//                       (edited)
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
      
//       {/* Load more button - if we need pagination */}
//       {comments.length > 0 && !loading && (
//         <div className="mt-8 text-center">
//           <button
//             onClick={() => fetchComments()}
//             className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
//           >
//             Refresh Comments
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Comments;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/authUser';

const Comments = ({ mediaType, mediaId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  const [userRatings, setUserRatings] = useState({});
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  useEffect(() => {
    fetchComments();
  }, [mediaId, mediaType]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/reviews/comments/${mediaType}/${mediaId}`);
      setComments(response.data.comments);
      
      // Fetch ratings for all comment authors in one batch
      const userIds = [...new Set(response.data.comments.map(comment => comment.user.id))];
      if (userIds.length > 0) {
        fetchUserRatings(userIds);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRatings = async (userIds) => {
    try {
      const response = await axios.get(`/api/reviews/ratings/users/${mediaType}/${mediaId}`, {
        params: { userIds: userIds.join(',') }
      });
      
      // Transform the response to a map of userId -> rating
      const ratingsMap = {};
      response.data.ratings.forEach(rating => {
        ratingsMap[rating.userId] = rating.value;
      });
      
      setUserRatings(ratingsMap);
    } catch (error) {
      console.error('Error fetching user ratings:', error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to comment');
      return;
    }
    
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    try {
      setSubmitting(true);
      const response = await axios.post(
        '/api/reviews/comments',
        {
          mediaType,
          mediaId,
          content: newComment
        }
      );
      
      // Fetch current user's rating if not already in state
      if (user.id && !userRatings[user.id]) {
        try {
          const ratingResponse = await axios.get(
            `/api/reviews/ratings/user/${mediaType}/${mediaId}`
          );
          
          if (ratingResponse.data.rating) {
            setUserRatings(prev => ({
              ...prev,
              [user.id]: ratingResponse.data.rating.value
            }));
          }
        } catch (error) {
          console.error('Error fetching user rating:', error);
        }
      }
      
      setComments([response.data.comment, ...comments]);
      setNewComment('');
      toast.success('Comment added');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding comment');
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    try {
      setSubmitting(true);
      const response = await axios.patch(
        `/api/reviews/comments/${commentId}`,
        { content: editText }
      );
      
      setComments(
        comments.map((comment) =>
          comment.id === commentId ? response.data.comment : comment
        )
      );
      
      setEditingCommentId(null);
      toast.success('Comment updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating comment');
      console.error('Error updating comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    
    try {
      setSubmitting(true);
      await axios.delete(`/api/reviews/comments/${commentId}`);
      
      setComments(comments.filter((comment) => comment.id !== commentId));
      toast.success('Comment deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting comment');
      console.error('Error deleting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditText('');
  };

  // Function to render user rating badge
  const renderUserRating = (userId) => {
    const rating = userRatings[userId];
    if (!rating) return null;
    
    return (
      <div className="flex items-center text-xs text-white bg-gray-700 px-2 py-1 rounded-full ml-2">
        <FaStar className="text-yellow-400 mr-1" size={12} />
        <span>{rating}</span>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl">
      <h3 className="text-xl font-semibold mb-6">Comments</h3>
      
      {/* New comment form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="flex items-start mb-4">
          <img
            src={user?.image || "/default-avatar.png"}
            alt={user?.username || "User"}
            className="w-10 h-10 rounded-full mr-3 object-cover"
          />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={user ? "Add a comment..." : "Login to comment"}
              disabled={!user || submitting}
              className="w-full px-3 py-2 border text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!user || submitting || !newComment.trim()}
            className={`px-4 py-2 rounded-md font-medium ${
              !user || submitting || !newComment.trim()
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } transition-colors`}
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>
      
      {/* Comments list */}
      <div className="space-y-6">
        {loading ? (
          <p className="text-center py-4">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-100 text-slate-900 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <img
                  src={comment.user.image || "/default-avatar.png"}
                  alt={comment.user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <h4 className="font-semibold">{comment.user.username}</h4>
                      {renderUserRating(comment.user.id)}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  
                  {editingCommentId === comment.id ? (
                    <div className="mt-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        disabled={submitting}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={cancelEditing}
                          className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100 transition-colors"
                          disabled={submitting}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleEditComment(comment.id)}
                          className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                          disabled={submitting || !editText.trim()}
                        >
                          {submitting ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-800 dark:text-gray-200">{comment.content}</p>
                      {comment.user.id === user?.id && (
                        <div className="flex gap-3 mt-2">
                          <button
                            onClick={() => startEditing(comment)}
                            className="text-gray-500 hover:text-blue-600 flex items-center gap-1 text-sm"
                            disabled={submitting}
                          >
                            <FiEdit size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-gray-500 hover:text-red-600 flex items-center gap-1 text-sm"
                            disabled={submitting}
                          >
                            <FiTrash size={14} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                  
                  {comment.edited && (
                    <span className="text-xs text-gray-500 mt-1 italic">
                      (edited)
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Load more button - if we need pagination */}
      {comments.length > 0 && !loading && (
        <div className="mt-8 text-center">
          <button
            onClick={() => fetchComments()}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            Refresh Comments
          </button>
        </div>
      )}
    </div>
  );
};

export default Comments;