import React from 'react';
import { useSelector } from 'react-redux';

/**
 * Component to conditionally render content based on user role
 * 
 * @param {Array} roles - Array of allowed roles (e.g., ['admin', 'user'])
 * @param {ReactNode} children - Content to render if user has required role
 * @param {ReactNode} fallback - Content to render if user doesn't have required role
 */
const RoleGuard = ({ roles = [], children, fallback = null }) => {
  const { user } = useSelector((state) => state.auth);

  // If no user is logged in, return fallback
  if (!user) {
    return fallback;
  }

  // If no roles specified, just check if user is authenticated
  if (roles.length === 0) {
    return children;
  }

  // Check if user's role is in the allowed roles
  if (roles.includes(user.role)) {
    return children;
  }

  // User doesn't have required role
  return fallback;
};

export default RoleGuard;

/**
 * Usage examples:
 * 
 * // Only show to admins
 * <RoleGuard roles={['admin']}>
 *   <AdminPanel />
 * </RoleGuard>
 * 
 * // Show to both users and admins (authenticated users)
 * <RoleGuard>
 *   <AuthenticatedContent />
 * </RoleGuard>
 * 
 * // Show different content for non-authorized users
 * <RoleGuard roles={['admin']} fallback={<p>Admin access required</p>}>
 *   <AdminPanel />
 * </RoleGuard>
 */
