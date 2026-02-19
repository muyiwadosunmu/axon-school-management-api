module.exports = ({ config, managers }) => {
    return async ({ req, res, next, results }) => {
        const token = req.headers.token || req.query.token;
        if (!token) {
            return managers.responseDispatcher.dispatch(res, { ok: false, code: 401, errors: 'unauthorized' });
        }

        const decoded = managers.token.verifyLongToken({ token });
        if (!decoded) {
            return managers.responseDispatcher.dispatch(res, { ok: false, code: 401, errors: 'unauthorized' });
        }

        // Attach user info to the results so it can be used by next middlewares or the manager
        // Bolt handles assigning the return value to results[middlewareName]
        
        console.log('[DEBUG] __longToken MW Decoded:', decoded); 

        next(decoded);
    }
}