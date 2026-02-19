module.exports = ({ config, managers }) => {
    return async ({ req, res, next, results }) => {
        const user = results.__longToken;
        if (!user) {
            return managers.responseDispatcher.dispatch(res, { ok: false, code: 401, errors: 'unauthorized' });
        }

    
        next(results);
    }
}
