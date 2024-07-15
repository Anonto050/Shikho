/*
const database = require('./databaseConnect')

async function getUserByUsername(username) {
    //let sql = 'SELECT * FROM "USER" WHERE NAME = :username';
    //return (await database.execute(sql, [username], database.options))
    let conn;
    try{
        const result = await database.execute(
            'SELECT * FROM COURSE WHERE COURSE_ID = :id',
            [username],
            database.options
        )
        console.log(result)
    } catch (err){
        console.log(err);
    }
}

async function insertAccountIntoDB(user_id, name, email, password, image) {
    let sql = 'INSERT INTO "USER" (USER_ID, NAME, EMAIL, PASSWORD, IMAGE) VALUES(:user_id, :name, :email, :password, :image)'
    return (await database.execute(sql, [user_id, name, email, password, image], database.options))
}

module.exports = {
    getUserByUsername,
    insertAccountIntoDB
}

getUserByUsername(10);*/

const oracleDB = require('oracledb');

const config = {
    user: 'SHIKHO',
    password: 'Shikho_2_2',
    connectionString: 'localhost:1521/orclpdb'
}

async function getStudentInfoByUsername(username){
    let conn
    try{
        conn = await oracleDB.getConnection(config);

        const result = await conn.execute(
            `SELECT U.NAME AS FULL_NAME, U.EMAIL AS EMAIL, U.PASSWORD AS PASSWORD, U.IMAGE AS IMAGE, S2.EDUCATIONAL_LEVEL AS EDUCATIONAL_LEVEL, I.NAME AS INSTITUTION_NAME
             FROM "USER" U, STUDENT S2, INSTITUTION I
             WHERE U.NAME = :username AND U.USER_ID = S2.USER_ID AND S2.INSTITUTION_ID = I.INSTITUTION_ID;`,
            [username]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function insertNewUser(user_id, educational_level, institution_id){
    let conn;
    try{
        conn = await oracleDB.getConnection(config);

        let sql = 'INSERT INTO STUDENT (USER_ID, EDUCATIONAL_LEVEL, INSTITUTION_ID) VALUES(:user_id, :educational_level, :institution_id)'

        const result = await conn.execute(
            sql,
            [user_id, educational_level, institution_id]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function getUserByID(user_id){
    let conn
    try{
        conn = await oracleDB.getConnection(config);

        const result = await conn.execute(
            `SELECT U.NAME AS FULL_NAME, U.EMAIL AS EMAIL, U.PASSWORD AS PASSWORD, U.IMAGE AS IMAGE, S2.EDUCATIONAL_LEVEL AS EDUCATIONAL_LEVEL, I.NAME AS INSTITUTION_NAME
             FROM "USER" U, STUDENT S2, INSTITUTION I
             WHERE U.USER_ID = :user_id AND U.USER_ID = S2.USER_ID AND S2.INSTITUTION_ID = I.INSTITUTION_ID`,
            [user_id]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

module.exports = {
    getStudentInfoByUsername,
    insertNewUser,
    getUserByID
}

/*getUserByUsername('Saffat Zabin').then(function (result){
    console.log(result)
});*/
//console.log(getUserByUsername('Saffat Zabin'));