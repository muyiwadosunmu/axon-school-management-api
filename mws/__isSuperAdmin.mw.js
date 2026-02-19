module.exports = ({ config, managers }) => {
    return async ({ req, res, next, results }) => {
        const user = results.__longToken;
        console.log('[DEBUG] __isSuperAdmin Check:', { role: user?.role, required: 'SUPERADMIN' }); // Added log
        if (!user || user.role !== 'SUPERADMIN') {
            return managers.responseDispatcher.dispatch(res, { ok: false, code: 403, errors: 'forbidden' });
        }
        next(results);
    }
}
