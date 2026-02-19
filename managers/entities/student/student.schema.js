module.exports = {
    createStudent: [
        { model: 'title', path: 'name', required: true },
        { model: 'number', path: 'age', required: true },
        { model: 'text', path: 'grade', required: true },
        { model: 'id', path: 'classroomId', required: false },
    ],
    updateStudent: [
        { model: 'id', required: true },
        { model: 'title', path: 'name', required: false },
        { model: 'number', path: 'age', required: false },
        { model: 'text', path: 'grade', required: false },
    ],
    getStudent: [{ model: 'id', required: true }],
    deleteStudent: [{ model: 'id', required: true }],
    enrollStudent: [
        { model: 'id', required: true },
        { model: 'id', path: 'classroomId', required: true },
    ],
    transferStudent: [
        { model: 'id', required: true },
        { model: 'id', path: 'classroomId', required: true },
    ],
}
