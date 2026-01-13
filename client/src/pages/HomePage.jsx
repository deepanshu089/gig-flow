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
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Find freelance services
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-gray-600">
                        Connect with top talent, bid on projects, and manage your work effortlessly.
                    </p>
                </div>

                <div className="mb-12 max-w-xl mx-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="What service are you looking for?"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12 bg-red-50 rounded">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                        {gigs.map((gig) => (
                            <div key={gig._id} className="bg-white border border-gray-200 rounded shadow-sm p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded uppercase">
                                        {gig.status}
                                    </span>
                                    <span className="text-xl font-bold text-gray-900">${gig.budget}</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {gig.title}
                                </h3>
                                <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                                    {gig.description}
                                </p>
                                
                                <div className="border-t pt-4 mt-4">
                                    <div className="flex items-center mb-4">
                                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-xs uppercase">
                                            {gig.ownerId?.name?.charAt(0) || "U"}
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">{gig.ownerId?.name || "Unknown"}</p>
                                            <p className="text-xs text-gray-500">Project Owner</p>
                                        </div>
                                    </div>

                                    <Link to={`/gigs/${gig._id}`} className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
