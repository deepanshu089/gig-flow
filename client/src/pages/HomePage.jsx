import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigs } from '../store/slices/gigSlice';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const dispatch = useDispatch();
    const { gigs, loading, error } = useSelector((state) => state.gigs);
    const [search, setSearch] = useState('');

    useEffect(() => {
        dispatch(fetchGigs(search));
    }, [dispatch, search]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                    Find the perfect freelance services
                </h1>
                <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                    Browse thousands of gigs and find the right talent for your project.
                </p>
            </div>

            <div className="mb-8 max-w-lg mx-auto">
                <input
                    type="text"
                    placeholder="Search gigs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                />
            </div>

            {loading ? (
                <p className="text-center">Loading gigs...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                    {gigs.map((gig) => (
                        <div key={gig._id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-xl transition-shadow duration-300">
                             <div className="p-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">{gig.title}</h3>
                                <p className="mt-2 text-sm text-gray-500 line-clamp-3">{gig.description}</p>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-primary font-bold">${gig.budget}</span>
                                    {/* Link to view details - we need to implement GigDetails page */}
                                    <span className="text-xs text-gray-500 uppercase tracking-wide bg-gray-100 px-2 py-1 rounded">{gig.status}</span>
                                </div>
                                <div className="mt-2 text-xs text-gray-400">
                                    Posted by {gig.ownerId?.name || "Unknown"}
                                </div>
                             </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;
