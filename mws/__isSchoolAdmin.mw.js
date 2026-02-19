module.exports = ({ config, managers }) => {
    return async ({ req, res, next, results }) => {
        const user = results.__longToken;
        if (!user || (user.role !== 'SCHOOL_ADMIN' && user.role !== 'SUPERADMIN')) {
            return managers.responseDispatcher.dispatch(res, { ok: false, code: 403, errors: 'forbidden' });
        }
        next(results);
    }
}
