module.exports = ({ config, managers }) => {
    return async ({ req, res, next, results }) => {
        const user = results.__longToken;
        if (!user) {
            return managers.responseDispatcher.dispatch(res, { ok: false, code: 401, errors: 'unauthorized' });
        }

        // Check if the route requires specific roles
        // Ideally we would pass required roles to this middleware, 
        // but the current architecture seems to load middlewares by name.
        // We might need a more dynamic way or specific middlewares like __isSuperAdmin.
        
        // For now, let's implement checking based on context or we can create specific middlewares.
        // Let's assume we use this middleware generally and it might need enhancement for specific role checks
        // OR better: Create specific middlewares for roles. 
        
        // However, the prompt asked for RBAC.
        // Let's create __isSuperAdmin and __isSchoolAdmin instead of a generic one for simplicity in this architecture.

        next(results);
    }
}
