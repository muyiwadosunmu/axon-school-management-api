const bcrypt = require('bcrypt');

module.exports = class User { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.tokenManager        = managers.token;
        this.usersCollection     = "users";
        this.userExposed         = ['createUser', 'login'];
        this.httpExposed         = ['createUser', 'login']; // Exposed for HTTP
    }

    async createUser({username, email, password, role, schoolId}){
        if(role === 'SCHOOL_ADMIN'){
             if(!schoolId) return { error: 'School ID is required for School Administrators', code: 400 };
             
             const school = await this.mongomodels.school.findById(schoolId);
             if(!school) return { error: 'Invalid School ID', code: 400 };
        }

        const user = {username, email, password, role, schoolId};

        let result = await this.validators.user.createUser(user);
        if(result) return result;
        
        const existingUser = await this.mongomodels.user.findOne({ $or: [{email}, {username}] });
        if(existingUser) {
            return { error: 'User already exists' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUserRaw = await this.mongomodels.user.create({
            username, 
            email, 
            password: hashedPassword,
            role,
            schoolId
        });

        console.log(`[DEBUG] Created User Raw:`, createdUserRaw);

        const createdUser = createdUserRaw.toObject();
        delete createdUser.password;

        let longToken = this.tokenManager.genLongToken({
            userId: createdUser._id, 
            userKey: createdUser.key,
            role: createdUser.role,
            schoolId: createdUser.schoolId,
        });
        
        console.log(`[DEBUG] Generated Token Payload:`, {
            userId: createdUser._id, 
            userKey: createdUser.key,
            role: createdUser.role,
            schoolId: createdUser.schoolId,
        });
        
        return {
            user: createdUser, 
            longToken 
        };
    }

    async login({username, password}){
        const user = await this.mongomodels.user.findOne({ username });
        if(!user){
            return { error: 'Invalid credentials' };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return { error: 'Invalid credentials' };
        }

        const userData = user.toObject();
        delete userData.password;

        let longToken = this.tokenManager.genLongToken({
            userId: userData._id, 
            userKey: userData.key,
            role: userData.role,
            schoolId: userData.schoolId,
        });

        return {
            user: userData,
            longToken
        };
    }

}
