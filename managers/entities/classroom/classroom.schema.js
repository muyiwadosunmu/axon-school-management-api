module.exports = {
    createClassroom: [
        { model: 'title', path: 'name', required: true },
        { model: 'number', path: 'capacity', required: true },
        { model: 'arrayOfStrings', path: 'resources', required: false },
    ],
    updateClassroom: [
        { model: 'id', required: true },
        { model: 'title', path: 'name', required: false },
        { model: 'number', path: 'capacity', required: false },
        { model: 'arrayOfStrings', path: 'resources', required: false },
    ],
    getClassroom: [{ model: 'id', required: true }],
    deleteClassroom: [{ model: 'id', required: true }],
}
