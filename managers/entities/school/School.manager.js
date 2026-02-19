module.exports = class School { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.schoolsCollection   = "schools";
        this.httpExposed         = ['createSchool', 'getSchools', 'getSchool', 'updateSchool', 'deleteSchool'];
        this.auth                = ['createSchool', 'updateSchool', 'deleteSchool']; 
    }

    async createSchool({__longToken, __isSuperAdmin, name, address, phone, email, website}){
        const school = {name, address, phone, email, website};

        let result = await this.validators.school.createSchool(school);
        if(result) return result;

        const existingSchool = await this.mongomodels.school.findOne({ name });
        if(existingSchool) return { error: 'School already exists' };

        const createdSchool = await this.mongomodels.school.create(school);
        
        return { school: createdSchool };
    }

    async getSchools({__longToken, __isSuperAdmin}){
        const schools = await this.mongomodels.school.find();
        return { schools };
    }

    async getSchool({__longToken, id}){
        const school = await this.mongomodels.school.findById(id);
        if(!school) return { error: 'School not found' };
        return { school };
    }

    async updateSchool({__longToken, __isSuperAdmin, id, name, address, phone, email, website}){
        const updateData = {name, address, phone, email, website};
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        const updatedSchool = await this.mongomodels.school.findByIdAndUpdate(id, updateData, { new: true });
        if(!updatedSchool) return { error: 'School not found' };
        
        return { school: updatedSchool };
    }

    async deleteSchool({__longToken, __isSuperAdmin, id}){
        const deletedSchool = await this.mongomodels.school.findByIdAndDelete(id);
        if(!deletedSchool) return { error: 'School not found' };
        return { success: true };
    }
}
