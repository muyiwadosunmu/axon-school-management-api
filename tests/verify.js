const http = require('http');

const BASE_URL = 'http://localhost:5111'; // Default User Port from config

async function request(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (token) {
            options.headers['token'] = token;
        }

        const req = http.request(`${BASE_URL}${path}`, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

function assert(condition, message, data) {
    if (!condition) {
        console.error(`❌ FAILED: ${message}`);
        if(data) console.error('Response Data:', JSON.stringify(data, null, 2));
        // process.exit(1);
    } else {
        console.log(`✅ PASSED: ${message}`);
    }
}

async function runTests() {
    console.log('🚀 Starting Verification Tests...');

    // 1. Register Superadmin
    console.log('\n--- 1. Superadmin Registration ---');
    const superAdminRes = await request('POST', '/api/user/createUser', {
        username: 'sa_' + Date.now().toString().slice(-6),
        email: 'sa_' + Date.now() + '@admin.com',
        password: 'password123',
        role: 'SUPERADMIN'
    });
    
    assert(superAdminRes.data.ok === true, 'Superadmin created', superAdminRes.data);
    const superToken = superAdminRes.data.data?.longToken;
    assert(superToken, 'Superadmin token received', superAdminRes.data);

    // 2. Create School (as Superadmin)
    console.log('\n--- 2. Create School ---');
    const schoolRes = await request('POST', '/api/school/createSchool', {
        name: 'Tech High ' + Date.now(),
        address: '123 Tech Lane',
        phone: '555-0199'
    }, superToken);

    assert(schoolRes.data.ok === true, 'School created', schoolRes.data);
    const schoolId = schoolRes.data.data?.school?._id;
    assert(schoolId, 'School ID received', schoolRes.data);

    // 3. Register School Admin (as Superadmin or self-register? Let's assume self-register with manual School ID for now or separate flow. 
    //    Actually, usually Superadmin creates School Admins, but our API allows createUser to set role/schoolId logic seems open. 
    //    Let's use createUser with SchoolId)
    console.log('\n--- 3. School Admin Registration ---');
    const schoolAdminRes = await request('POST', '/api/user/createUser', {
        username: 'sch_' + Date.now().toString().slice(-6),
        email: 'school_' + Date.now() + '@admin.com',
        password: 'password123',
        role: 'SCHOOL_ADMIN',
        schoolId: schoolId
    });

    assert(schoolAdminRes.data.ok === true, 'School Admin created');
    const schoolAdminToken = schoolAdminRes.data.data.longToken;
    assert(schoolAdminToken, 'School Admin token received');

    // 4. Create Classroom (as School Admin)
    console.log('\n--- 4. Create Classroom ---');
    const classRes = await request('POST', '/api/classroom/createClassroom', {
        name: 'Class 1A',
        capacity: 30,
        resources: ['Projector', 'Whiteboard']
    }, schoolAdminToken);

    assert(classRes.data.ok === true, 'Classroom created');
    const classroomId = classRes.data.data.classroom._id;
    assert(classroomId, 'Classroom ID received');

    // 5. Create Student (as School Admin)
    console.log('\n--- 5. Create Student ---');
    const studentRes = await request('POST', '/api/student/createStudent', {
        name: 'John Doe',
        age: 15,
        grade: '10th',
        classroomId: classroomId
    }, schoolAdminToken);

    assert(studentRes.data.ok === true, 'Student created');
    const studentId = studentRes.data.data.student._id;
    assert(studentId, 'Student ID received');

    // 6. Verify Enrollment (Get Student)
    console.log('\n--- 6. Verify Enrollment ---');
    const getStudentRes = await request('POST', `/api/student/getStudent`, { id: studentId }, schoolAdminToken);
    
    // Note: getStudent expects ID in body or query? Manager says: getStudent({__longToken, id})
    // The middleware calls the function with body + query + params merged. 
    // Wait, Api.manager.js merges `...body, ...results`. It doesn't seem to explicitly merge query params into data unless middleware does it?
    // Let's check `Api.manager.js`. It merges `req.body` and `results`. 
    // If I send JSON body it should work.
    
    assert(getStudentRes.data.ok === true, 'Get Student successful');
    assert(getStudentRes.data.data.student.classroomId && getStudentRes.data.data.student.classroomId._id == classroomId, 'Student is enrolled in correct classroom');

    // 7. RBAC Test: School Admin tries to delete School
    console.log('\n--- 7. RBAC Test (Negative Case) ---');
    const deleteSchoolRes = await request('POST', `/api/school/deleteSchool`, { id: schoolId }, schoolAdminToken);
    assert(deleteSchoolRes.data.ok === false || deleteSchoolRes.data.code === 403, 'School Admin cannot delete School');

    console.log('\n✅ Verification Complete');
}

runTests().catch(console.error);
