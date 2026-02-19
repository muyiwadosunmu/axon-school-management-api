module.exports = class Classroom { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.classroomsCollection = "classrooms";
        this.httpExposed         = ['createClassroom', 'getClassrooms', 'getClassroom', 'updateClassroom', 'deleteClassroom'];
        this.auth                = ['createClassroom', 'getClassrooms', 'getClassroom', 'updateClassroom', 'deleteClassroom']; 
    }

    async createClassroom({__longToken, __isSchoolAdmin, name, capacity, resources, schoolId}){
        const effectiveSchoolId = __longToken.schoolId || schoolId;
        if(!effectiveSchoolId) return { error: 'School ID required', code: 400 };

        const classroom = {name, capacity, resources, schoolId: effectiveSchoolId};

        // Data validation
        let result = await this.validators.classroom.createClassroom(classroom);
        if(result) return result;

        // Check for duplicate in the same school
        const existingClassroom = await this.mongomodels.classroom.findOne({ name, schoolId: effectiveSchoolId });
        if(existingClassroom) return { error: 'Classroom already exists in this school' };

        // Creation
        const createdClassroom = await this.mongomodels.classroom.create(classroom);
        
        return { classroom: createdClassroom };
    }

    async getClassrooms({__longToken, __isSchoolAdmin, schoolId}){
        const effectiveSchoolId = __longToken.schoolId || schoolId;
        let query = {};
        if(effectiveSchoolId) query.schoolId = effectiveSchoolId;

        const classrooms = await this.mongomodels.classroom.find(query);
        return { classrooms };
    }

    async getClassroom({__longToken, __isSchoolAdmin, id}){
        const classroom = await this.mongomodels.classroom.findById(id);
        if(!classroom) return { error: 'Classroom not found' };

        // Access Control
        if(__longToken.role !== 'SUPERADMIN' && classroom.schoolId.toString() !== __longToken.schoolId){
             return { error: 'Unauthorized Access', code: 403 };
        }

        return { classroom };
    }

    async updateClassroom({__longToken, __isSchoolAdmin, id, name, capacity, resources}){
        const classroom = await this.mongomodels.classroom.findById(id);
        if(!classroom) return { error: 'Classroom not found' };

         // Access Control
         if(__longToken.role !== 'SUPERADMIN' && classroom.schoolId.toString() !== __longToken.schoolId){
            return { error: 'Unauthorized Access', code: 403 };
       }

        const updateData = {name, capacity, resources};
        // Remove undefined fields
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        const updatedClassroom = await this.mongomodels.classroom.findByIdAndUpdate(id, updateData, { new: true });
        
        return { classroom: updatedClassroom };
    }

    async deleteClassroom({__longToken, __isSchoolAdmin, id}){
        const classroom = await this.mongomodels.classroom.findById(id);
        if(!classroom) return { error: 'Classroom not found' };

         // Access Control
         if(__longToken.role !== 'SUPERADMIN' && classroom.schoolId.toString() !== __longToken.schoolId){
            return { error: 'Unauthorized Access', code: 403 };
       }

        await this.mongomodels.classroom.findByIdAndDelete(id);
        return { success: true };
    }
}
