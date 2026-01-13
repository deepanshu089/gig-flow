import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyGigs, createGig } from '../store/slices/gigSlice';
import { fetchMyBids, fetchBidsForGig, hireFreelancer } from '../store/slices/bidSlice';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myGigs } = useSelector((state) => state.gigs);
  const { myBids, gigBids } = useSelector((state) => state.bids);
  
  const [activeTab, setActiveTab] = useState('jobs');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');

  const [selectedGigId, setSelectedGigId] = useState(null);

  useEffect(() => {
    dispatch(fetchMyGigs());
    dispatch(fetchMyBids());
  }, [dispatch]);

  const handleCreateGig = async (e) => {
    e.preventDefault();
    if(!title || !description || !budget) return;
    try {
        await dispatch(createGig({ title, description, budget })).unwrap();
        setShowCreateModal(false);
        setTitle(''); setDescription(''); setBudget('');
        toast.success('Gig posted!');
    } catch (err) {
        toast.error('Failed to post gig');
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Post a Job
        </button>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => { setActiveTab('jobs'); setSelectedGigId(null); }}
            className={`${activeTab === 'jobs' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none`}
          >
            My Posted Jobs
          </button>
          <button
             onClick={() => { setActiveTab('bids'); setSelectedGigId(null); }}
             className={`${activeTab === 'bids' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none`}
          >
            My Bids
          </button>
        </nav>
      </div>

      {activeTab === 'jobs' && (
        <div className="space-y-6">
           {myGigs.length === 0 && <p className="text-gray-500 italic">You haven't posted any jobs yet.</p>}
           {!selectedGigId ? (
               myGigs.map(gig => (
                   <div key={gig._id} className="bg-white border border-gray-200 rounded shadow-sm p-6 hover:shadow-md">
                       <div className="flex justify-between items-start">
                           <div>
                               <h3 className="text-lg font-medium text-gray-900">{gig.title}</h3>
                               <p className="mt-1 text-sm text-gray-500">{gig.description}</p>
                               <div className="mt-2 text-sm text-gray-500 font-semibold">Budget: ${gig.budget}</div>
                           </div>
                           <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${gig.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                               {gig.status.toUpperCase()}
                           </span>
                       </div>
                       <div className="mt-4 flex space-x-4">
                           <button 
                                onClick={() => handleViewBids(gig._id)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                           >
                               View Bids
                           </button>
                       </div>
                   </div>
               ))
           ) : (
               <div>
                   <button onClick={() => setSelectedGigId(null)} className="mb-4 text-sm text-gray-500 hover:text-gray-700 flex items-center">&larr; Back to jobs</button>
                   <h2 className="text-xl font-bold mb-4">Bids for <span className="text-gray-900">{myGigs.find(g => g._id === selectedGigId)?.title}</span></h2>
                   <div className="space-y-4">
                       {gigBids.length === 0 ? <p className="text-gray-500 italic">No bids yet.</p> : gigBids.map(bid => (
                           <div key={bid._id} className="bg-white border border-gray-200 rounded p-4 flex justify-between items-center shadow-sm">
                               <div>
                                   <p className="font-medium text-gray-900">{bid.freelancerId.name} <span className="text-xs text-gray-400">({bid.freelancerId.email})</span></p>
                                   <p className="text-sm text-gray-500 italic">"{bid.message}"</p>
                                   <p className="mt-1 font-bold text-gray-700">${bid.price}</p>
                               </div>
                               <div>
                                   {bid.status === 'pending' && myGigs.find(g => g._id === selectedGigId)?.status === 'open' && (
                                       <button 
                                            onClick={() => handleHire(bid._id)}
                                            className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                                       >
                                           HIRE
                                       </button>
                                   )}
                                   {bid.status !== 'pending' && (
                                       <span className={`px-2 py-1 text-xs rounded-full uppercase font-bold ${bid.status === 'hired' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
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
              {myBids.length === 0 && <p className="text-gray-500 italic">You haven't placed any bids yet.</p>}
              {myBids.map(bid => (
                  <div key={bid._id} className="bg-white border border-gray-200 rounded shadow-sm p-6">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Project: {bid.gigId?.title || 'Unknown Project'}</h3>
                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full uppercase ${bid.status === 'hired' ? 'bg-green-100 text-green-800' : bid.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                             {bid.status}
                          </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Your Pitch: "{bid.message}"</p>
                      <div className="mt-2 font-bold text-gray-700">Bid Amount: ${bid.price}</div>
                  </div>
              ))}
          </div>
      )}

      {/* Modal */}
      {showCreateModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl">
                  <h2 className="text-xl font-bold mb-4">Post a Project</h2>
                  <form onSubmit={handleCreateGig} className="space-y-4">
                      <input 
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none" 
                        placeholder="Project Title" 
                        value={title} onChange={e => setTitle(e.target.value)} required 
                        autoFocus
                      />
                      <textarea 
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none" 
                        placeholder="Description" 
                        value={description} onChange={e => setDescription(e.target.value)} required 
                        rows={4}
                      />
                      <input 
                        type="number" 
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none" 
                        placeholder="Budget ($)" 
                        value={budget} onChange={e => setBudget(e.target.value)} required 
                      />
                      <div className="flex justify-end space-x-2 pt-2">
                          <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-600 transition-colors">Post Job</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default DashboardPage;
