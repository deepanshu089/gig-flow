import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteGig } from '../store/slices/gigSlice';

const GigCard = ({ gig, onEdit }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Check if user can modify this gig
  const isOwner = user && gig.ownerId && gig.ownerId._id === user._id;
  const isAdmin = user && user.role === 'admin';
  const canModify = isOwner || isAdmin;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this gig? This action cannot be undone.')) {
      dispatch(deleteGig(gig._id));
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{gig.title}</h3>
          {isAdmin && (
            <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded font-semibold">
              Admin View
            </span>
          )}
        </div>
        
        {canModify && (
          <div className="flex space-x-2 ml-4">
            <button
              onClick={() => onEdit(gig)}
              className="text-blue-600 hover:text-blue-800 transition-colors p-1"
              title="Edit gig"
              aria-label="Edit gig"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 transition-colors p-1"
              title="Delete gig"
              aria-label="Delete gig"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-3">{gig.description}</p>
      
      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl font-bold text-green-600">
          ${Number(gig.budget).toLocaleString()}
        </span>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          gig.status === 'open' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {gig.status}
        </span>
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Posted by: <span className="font-medium text-gray-700">
            {gig.ownerId?.name || 'Unknown'}
          </span>
        </p>
        {isOwner && (
          <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-semibold">
            Your Gig
          </span>
        )}
      </div>
    </div>
  );
};

export default GigCard;
