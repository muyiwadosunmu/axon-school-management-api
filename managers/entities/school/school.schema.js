module.exports = {
    createSchool: [
        { model: 'title', path: 'name', required: true },
        { model: 'text', path: 'address', required: true },
        { model: 'phone', required: false },
        { model: 'email', required: false },
        { model: 'url', path: 'website', required: false },
    ],
    updateSchool: [
        { model: 'id', required: true },
        { model: 'title', path: 'name', required: false },
        { model: 'text', path: 'address', required: false },
        { model: 'phone', required: false },
        { model: 'email', required: false },
        { model: 'url', path: 'website', required: false },
    ],
    getSchool: [{ model: 'id', required: true }],
    deleteSchool: [{ model: 'id', required: true }],
}
