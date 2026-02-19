module.exports = class Student { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.studentsCollection  = "students";
        this.httpExposed         = ['createStudent', 'getStudents', 'getStudent', 'updateStudent', 'deleteStudent', 'enrollStudent', 'transferStudent'];
        this.auth                = ['createStudent', 'getStudents', 'getStudent', 'updateStudent', 'deleteStudent', 'enrollStudent', 'transferStudent'];
    }

    async createStudent({__longToken, __isSchoolAdmin, name, age, grade, classroomId, schoolId}){
        const effectiveSchoolId = __longToken.schoolId || schoolId;
        if(!effectiveSchoolId) return { error: 'School ID required', code: 400 };

        const student = {name, age, grade, schoolId: effectiveSchoolId, classroomId};

        // Data validation
        let result = await this.validators.student.createStudent(student);
        if(result) return result;

        if (classroomId) {
            const classroom = await this.mongomodels.classroom.findById(classroomId);
            if (!classroom) return { error: 'Classroom not found', code: 404 };
            
            if (classroom.schoolId.toString() !== effectiveSchoolId.toString()) {
                return { error: 'Classroom belongs to a different school', code: 400 };
            }

            const currentCount = await this.mongomodels.student.countDocuments({ classroomId });
            if (currentCount >= classroom.capacity) {
                return { error: 'Classroom is full', code: 400 };
            }
        }

        // Creation
        const createdStudent = await this.mongomodels.student.create(student);
        
        return { student: createdStudent };
    }

    async getStudents({__longToken, __isSchoolAdmin, schoolId}){
        const effectiveSchoolId = __longToken.schoolId || schoolId;
        let query = {};
        if(effectiveSchoolId) query.schoolId = effectiveSchoolId;

        const students = await this.mongomodels.student.find(query).populate('classroomId');
        return { students };
    }

    async getStudent({__longToken, __isSchoolAdmin, id}){
        const student = await this.mongomodels.student.findById(id).populate('classroomId');
        if(!student) return { error: 'Student not found' };

         // Access Control
         if(__longToken.role !== 'SUPERADMIN' && student.schoolId.toString() !== __longToken.schoolId){
            return { error: 'Unauthorized Access', code: 403 };
       }

        return { student };
    }

    async updateStudent({__longToken, __isSchoolAdmin, id, name, age, grade}){
        const student = await this.mongomodels.student.findById(id);
        if(!student) return { error: 'Student not found' };

         // Access Control
         if(__longToken.role !== 'SUPERADMIN' && student.schoolId.toString() !== __longToken.schoolId){
            return { error: 'Unauthorized Access', code: 403 };
       }

        const updateData = {name, age, grade};
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        const updatedStudent = await this.mongomodels.student.findByIdAndUpdate(id, updateData, { new: true });
        
        return { student: updatedStudent };
    }

    async deleteStudent({__longToken, __isSchoolAdmin, id}){
        const student = await this.mongomodels.student.findById(id);
        if(!student) return { error: 'Student not found' };

         // Access Control
         if(__longToken.role !== 'SUPERADMIN' && student.schoolId.toString() !== __longToken.schoolId){
            return { error: 'Unauthorized Access', code: 403 };
       }

        await this.mongomodels.student.findByIdAndDelete(id);
        return { success: true };
    }

    async enrollStudent({__longToken, __isSchoolAdmin, id, classroomId}){
        // Basically same as transfer, assigning a classroom
        return this.transferStudent({__longToken, __isSchoolAdmin, id, classroomId});
    }

    async transferStudent({__longToken, __isSchoolAdmin, id, classroomId}){
        const student = await this.mongomodels.student.findById(id);
        if(!student) return { error: 'Student not found' };

         // Access Control
         if(__longToken.role !== 'SUPERADMIN' && student.schoolId.toString() !== __longToken.schoolId){
            return { error: 'Unauthorized Access', code: 403 };
        }

        // Verify classroom exists and belongs to same school
        const classroom = await this.mongomodels.classroom.findById(classroomId);
        if(!classroom) return { error: 'Classroom not found' };

        if(classroom.schoolId.toString() !== student.schoolId.toString()){
             return { error: 'Classroom belongs to a different school', code: 400 };
        }

        // Check capacity
        const currentCount = await this.mongomodels.student.countDocuments({ classroomId });
        if(currentCount >= classroom.capacity){
            return { error: 'Classroom is full', code: 400 };
        }

        const updatedStudent = await this.mongomodels.student.findByIdAndUpdate(id, { classroomId }, { new: true });
        return { student: updatedStudent };
    }
}
