const oracleDB = require('oracledb');
oracleDB.autoCommit = true;

const config = {
    user: 'SHIKHO',
    password: 'Shikho_2_2',
    connectionString: 'localhost:1521/orclpdb'
}

async function insertNewUser(user_id, speciality, ratings){
    let conn;
    try{
        conn = await oracleDB.getConnection(config);

        let sql = 'INSERT INTO INSTRUCTOR (USER_ID, SPECIALITY, RATINGS) VALUES(:user_id, :speciality, :ratings)'

        const result = await conn.execute(
            sql,
            [user_id, speciality, ratings]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function getInstructorByUserID(user_id){
    let conn
    try{
        conn = await oracleDB.getConnection(config);

        const result = await conn.execute(
            `SELECT U.NAME AS FULL_NAME, U.EMAIL AS EMAIL, U.PASSWORD AS PASSWORD, U.IMAGE AS IMAGE, I2.SPECIALITY AS SPECIALITY, I2.RATINGS AS RATINGS, I3.WORKPLACE AS WORKPLACE 
             FROM "USER" U, INSTRUCTOR I2, INDEPENDENT_INSTRUCTOR I3
             WHERE U.USER_ID = :user_id AND U.USER_ID = I2.USER_ID AND U.USER_ID = I3.USER_ID`,
            [user_id]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function getInstructorByName(user_name){
    let conn
    try{
        conn = await oracleDB.getConnection(config);

        const result = await conn.execute(
            `SELECT U.NAME AS FULL_NAME, U.EMAIL AS EMAIL, U.PASSWORD AS PASSWORD, U.IMAGE AS IMAGE, I2.SPECIALITY AS SPECIALITY, I2.RATINGS AS RATINGS, I3.WORKPLACE AS WORKPLACE 
             FROM "USER" U, INSTRUCTOR I2, INDEPENDENT_INSTRUCTOR I3
             WHERE U.NAME = :user_name AND U.USER_ID = I2.USER_ID AND U.USER_ID = I3.USER_ID`,
            [user_name]
        )
    } catch (err){
        console.log(err)
    }
}

module.exports = {
    insertNewUser,
    getInstructorByUserID,
    getInstructorByName
}
