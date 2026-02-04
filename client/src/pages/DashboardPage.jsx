import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyGigs } from '../store/slices/gigSlice';
import { fetchMyBids, fetchBidsForGig, hireFreelancer } from '../store/slices/bidSlice';
import GigCard from '../components/GigCard';
import GigForm from '../components/GigForm';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myGigs } = useSelector((state) => state.gigs);
  const { myBids, gigBids } = useSelector((state) => state.bids);
  
  const [activeTab, setActiveTab] = useState('jobs');
  const [showGigForm, setShowGigForm] = useState(false);
  const [editingGig, setEditingGig] = useState(null);
  const [selectedGigId, setSelectedGigId] = useState(null);

  useEffect(() => {
    dispatch(fetchMyGigs());
    dispatch(fetchMyBids());
  }, [dispatch]);

  const handleEditGig = (gig) => {
    setEditingGig(gig);
    setShowGigForm(true);
  };

  const handleCloseForm = () => {
    setShowGigForm(false);
    setEditingGig(null);
  };

  const handleViewBids = (gigId) => {
      setSelectedGigId(gigId);
      dispatch(fetchBidsForGig(gigId));
  };

  const handleHire = async (bidId) => {
      try {
          await dispatch(hireFreelancer(bidId)).unwrap();
          toast.success('Freelancer hired!');
          dispatch(fetchMyGigs()); 
          dispatch(fetchBidsForGig(selectedGigId)); 
      } catch (err) {
          toast.error(err.message || 'Hiring failed');
      }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {user?.name}
            {user?.role === 'admin' && (
              <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded font-semibold">
                Admin
              </span>
            )}
          </p>
        </div>
        <button 
          onClick={() => setShowGigForm(true)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium shadow-sm"
        >
          Post a Job
        </button>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => { setActiveTab('jobs'); setSelectedGigId(null); }}
            className={`${activeTab === 'jobs' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none transition-colors`}
          >
            My Posted Jobs
          </button>
          <button
             onClick={() => { setActiveTab('bids'); setSelectedGigId(null); }}
             className={`${activeTab === 'bids' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none transition-colors`}
          >
            My Bids
          </button>
        </nav>
      </div>

      {activeTab === 'jobs' && (
        <div className="space-y-6">
           {myGigs.length === 0 && (
             <div className="text-center py-12">
               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
               <p className="mt-2 text-gray-500 italic">You haven't posted any jobs yet.</p>
               <button
                 onClick={() => setShowGigForm(true)}
                 className="mt-4 text-indigo-600 hover:text-indigo-500 font-medium"
               >
                 Post your first job
               </button>
             </div>
           )}
           {!selectedGigId ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {myGigs.map(gig => (
                   <div key={gig._id} className="relative">
                     <GigCard gig={gig} onEdit={handleEditGig} />
                     <button 
                       onClick={() => handleViewBids(gig._id)}
                       className="mt-3 w-full text-center text-indigo-600 hover:text-indigo-800 text-sm font-medium py-2 border border-indigo-200 rounded-md hover:bg-indigo-50 transition-colors"
                     >
                       View Bids
                     </button>
                   </div>
                 ))}
               </div>
           ) : (
               <div>
                   <button onClick={() => setSelectedGigId(null)} className="mb-4 text-sm text-gray-500 hover:text-gray-700 flex items-center">
                     <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                     </svg>
                     Back to jobs
                   </button>
                   <h2 className="text-xl font-bold mb-4">Bids for <span className="text-gray-900">{myGigs.find(g => g._id === selectedGigId)?.title}</span></h2>
                   <div className="space-y-4">
                       {gigBids.length === 0 ? (
                         <div className="text-center py-8 bg-gray-50 rounded-lg">
                           <p className="text-gray-500 italic">No bids yet.</p>
                         </div>
                       ) : gigBids.map(bid => (
                           <div key={bid._id} className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                               <div>
                                   <p className="font-medium text-gray-900">{bid.freelancerId.name} <span className="text-xs text-gray-400">({bid.freelancerId.email})</span></p>
                                   <p className="text-sm text-gray-500 italic mt-1">"{bid.message}"</p>
                                   <p className="mt-2 font-bold text-gray-700">${bid.price}</p>
                               </div>
                               <div>
                                   {bid.status === 'pending' && myGigs.find(g => g._id === selectedGigId)?.status === 'open' && (
                                       <button 
                                            onClick={() => handleHire(bid._id)}
                                            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors"
                                       >
                                           HIRE
                                       </button>
                                   )}
                                   {bid.status !== 'pending' && (
                                       <span className={`px-3 py-1 text-xs rounded-full uppercase font-bold ${bid.status === 'hired' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                           {bid.status}
                                       </span>
                                   )}
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
           )}
        </div>
      )}

      {activeTab === 'bids' && (
          <div className="space-y-6">
              {myBids.length === 0 && (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="mt-2 text-gray-500 italic">You haven't placed any bids yet.</p>
                </div>
              )}
              {myBids.map(bid => (
                  <div key={bid._id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Project: {bid.gigId?.title || 'Unknown Project'}</h3>
                         <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full uppercase ${bid.status === 'hired' ? 'bg-green-100 text-green-800' : bid.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                             {bid.status}
                          </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Your Pitch: "{bid.message}"</p>
                      <div className="mt-3 font-bold text-gray-700">Bid Amount: ${bid.price}</div>
                  </div>
              ))}
          </div>
      )}

      {/* Gig Form Modal */}
      {showGigForm && (
        <GigForm 
          gig={editingGig} 
          onClose={handleCloseForm} 
        />
      )}
    </div>
  );
};

export default DashboardPage;
