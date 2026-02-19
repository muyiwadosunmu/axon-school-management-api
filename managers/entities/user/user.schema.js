
module.exports = {
    createUser: [
        {
            model: 'username',
            required: true,
        },
        {
            model: 'email',
            required: true,
        },
        {
            model: 'password',
            required: true,
        },
        {
            model: 'username', // reusing username model for role, but might need custom enum validation later if desired. For now, let's just ensure it's a string.
            path: 'role',
            required: false,
        }
    ],
    login: [
        {
            model: 'username',
            required: true,
        },
        {
            model: 'password',
            required: true,
        }
    ]
}

