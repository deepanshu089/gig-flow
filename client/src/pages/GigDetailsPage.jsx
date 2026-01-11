import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { placeBid } from '../store/slices/bidSlice';
import api from '../api/axios';
import toast from 'react-hot-toast';

const GigDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    
    const [gig, setGig] = useState(null);
    const [loading, setLoading] = useState(true);

    const [message, setMessage] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        const fetchGig = async () => {
            try {
                const { data } = await api.get(`/gigs/${id}`);
                setGig(data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load gig");
            } finally {
                setLoading(false);
            }
        };
        fetchGig();
    }, [id]);

    const handleBid = async (e) => {
        e.preventDefault();
        if(!user) {
            toast.error("Please login to bid");
            navigate('/login');
            return;
        }
        try {
            await dispatch(placeBid({ gigId: id, message, price })).unwrap();
            toast.success("Bid placed successfully!");
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.message || "Failed to place bid");
        }
    }

    if(loading) return <div className="p-8 text-center">Loading...</div>
    if(!gig) return <div className="p-8 text-center">Gig not found</div>

    const isOwner = user && gig.ownerId._id === user._id;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-2xl leading-6 font-medium text-gray-900">{gig.title}</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Posted by {gig.ownerId.name}</p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">Description</dt>
                            <dd className="mt-1 text-sm text-gray-900">{gig.description}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Budget</dt>
                            <dd className="mt-1 text-sm text-gray-900">${gig.budget}</dd>
                        </div>
                         <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                            <dd className="mt-1 text-sm text-gray-900">{gig.status}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            {/* Bid Form */}
            {!isOwner && gig.status === 'open' && (
                <div className="mt-8 bg-white shadow sm:rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Place a Bid</h3>
                    <form onSubmit={handleBid} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Your Pitch</label>
                            <textarea
                                value={message} onChange={e => setMessage(e.target.value)}
                                rows={4}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="Why are you the best fit for this job?"
                                required
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Your Price ($)</label>
                            <input
                                type="number"
                                value={price} onChange={e => setPrice(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="Offer amount"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-blue-600">
                            Submit Proposal
                        </button>
                    </form>
                </div>
            )}
             {isOwner && (
                 <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-md">
                     You are the owner of this gig. Visit your <button onClick={() => navigate('/dashboard')} className="underline font-bold">Dashboard</button> to manage bids.
                 </div>
             )}
        </div>
    )
}
export default GigDetailsPage;
