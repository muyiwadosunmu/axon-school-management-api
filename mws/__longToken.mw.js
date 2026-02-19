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

        next(decoded);
    }
}