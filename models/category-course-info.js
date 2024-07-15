const oracleDB = require('oracledb');
oracleDB.autoCommit = true;

const config = {
    user: 'SHIKHO',
    password: 'Shikho_2_2',
    connectionString: 'localhost:1521/orclpdb'
}

async function getTopCategories(){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `SELECT CATEGORY, COUNT(COURSE_ID) AS TOTAL_COURSES
                   FROM COURSE
                   GROUP BY CATEGORY
                   ORDER BY COUNT(COURSE_ID) DESC`

        let result = await conn.execute(
            sql,
            []
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function getTopCourses(){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `SELECT C2.*, AVG(R.RATING), U.*, I.SPECIALITY, I.RATINGS 
                   FROM
                       "USER" U JOIN INSTRUCTOR I on U.USER_ID = I.USER_ID
                                JOIN INSTRUCTS I2 ON U.USER_ID = I2.USER_ID
                                JOIN COURSE C2 on I2.COURSE_ID = C2.COURSE_ID
                                FULL OUTER JOIN REVIEWS R on C2.COURSE_ID = R.COURSE_ID
                   GROUP BY C2.COURSE_ID, U.USER_ID, NAME, EMAIL, PASSWORD, U.IMAGE, TYPE, I.SPECIALITY, I.RATINGS, COURSE_NAME, COURSE_DESCRIPTION, TOTAL_MARKS, EDUCATIONAL_LEVEL, CATEGORY, C2.IMAGE
                   ORDER BY AVG(R.RATING) DESC`

        let result = await conn.execute(
            sql,
            []
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function getTopTeachers(){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)
        let sql = `SELECT U.*, I.SPECIALITY, I.RATINGS
                   FROM "USER" U JOIN INSTRUCTOR I on U.USER_ID = I.USER_ID
                   ORDER BY RATINGS DESC`

        let result = await conn.execute(
            sql,
            []
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function getMaxCourse_ID(){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `SELECT MAX(COURSE_ID) FROM COURSE`

        let result = await conn.execute(
            sql,
            []
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function getCourseOfCategory(course_category){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `SELECT * FROM COURSE WHERE CATEGORY = :course_category`

        let result = await conn.execute(
            sql,
            [course_category]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function getCourseOfSearch(req){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `SELECT C.*, R.RATING, U.*  
                   FROM COURSE C FULL OUTER JOIN REVIEWS R on C.COURSE_ID = R.COURSE_ID
                                 FULL OUTER JOIN INSTRUCTS I ON C.COURSE_ID = I.COURSE_ID
                                 FULL OUTER JOIN INSTRUCTOR I2 ON I.USER_ID = I2.USER_ID
                                 FULL OUTER JOIN "USER" U ON I2.USER_ID = U.USER_ID
                   WHERE LOWER(C.COURSE_NAME) LIKE :req OR LOWER(C.CATEGORY) LIKE :req`

        let result = await conn.execute(
            sql,
            [req]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function getCourseInfo(course_id){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `SELECT U.*, I.SPECIALITY, I.RATINGS, C2.*, AVG(R.RATING)
                   FROM
                       "USER" U JOIN INSTRUCTOR I on U.USER_ID = I.USER_ID
                                JOIN INSTRUCTS I2 ON U.USER_ID = I2.USER_ID
                                JOIN COURSE C2 on I2.COURSE_ID = C2.COURSE_ID
                                FULL OUTER JOIN REVIEWS R on C2.COURSE_ID = R.COURSE_ID
                   WHERE C2.COURSE_ID = :course_id
                   GROUP BY C2.COURSE_ID, U.USER_ID, NAME, EMAIL, PASSWORD, U.IMAGE, TYPE, I.SPECIALITY, I.RATINGS, COURSE_NAME, COURSE_DESCRIPTION, TOTAL_MARKS, EDUCATIONAL_LEVEL, CATEGORY, C2.IMAGE`

        let result = await conn.execute(
            sql,
            [course_id]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function getTopicsOfCourse(course_id){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `SELECT * FROM TOPICS WHERE COURSE_ID = :course_id ORDER BY TOPIC_ID`

        let result = await conn.execute(
            sql,
            [course_id]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}



async function getDurationCount(course_id){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `SELECT SUM(C.DURATION)
                   FROM CONTENTS C JOIN TOPICS T ON C.TOPIC_ID = T.TOPIC_ID
                   WHERE T.COURSE_ID = :course_id
                   GROUP BY C.TOPIC_ID`

        let result = await conn.execute(
            sql,
            [course_id]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function getContentsOfATopic(topic_id){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `SELECT *
                   FROM CONTENTS C JOIN TOPICS T ON C.TOPIC_ID = T.TOPIC_ID
                   WHERE T.TOPIC_ID = :topic_id`

        let result = await conn.execute(
            sql,
            [topic_id]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function findCourseTeacherByID(course_id){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `SELECT U.NAME, I2.RATINGS,U.IMAGE
                   FROM COURSE C JOIN INSTRUCTS I on C.COURSE_ID = I.COURSE_ID
                   JOIN "USER" U on I.USER_ID = U.USER_ID
                   JOIN INSTRUCTOR I2 on U.USER_ID = I2.USER_ID
                   WHERE C.COURSE_ID = :course_id`


        let result = await conn.execute(
            sql,
            [course_id]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function findCourseMembersByID(course_id){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `SELECT U.NAME, U.EMAIL
                   FROM COURSE C JOIN ENROLLS E on C.COURSE_ID = E.COURSE_ID
                   JOIN "USER" U on E.USER_ID = U.USER_ID
                   WHERE C.COURSE_ID = :course_id`

        let result = await conn.execute(
            sql,
            [course_id]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function findReviewOfCourse(course_id){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `SELECT R.REVIEW_BODY,R.RATING, U.NAME,U.EMAIL
                   FROM REVIEWS R JOIN COURSE C ON R.COURSE_ID = C.COURSE_ID
                   JOIN "USER" U on R.USER_ID = U.USER_ID
                   WHERE C.COURSE_ID = :course_id`

        let result = await conn.execute(
            sql,
            [course_id]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function findTopicByTopicID(topic_id, course_id){
    let conn;
    try{
        conn = await oracleDB.getConnection(config)

        let sql = `SELECT * FROM TOPICS WHERE TOPIC_ID = :topic_id AND COURSE_ID = :course_id`

        let result = await conn.execute(
            sql,
            [topic_id, course_id]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function getVideoFromContent_ID(content_id){
    let conn;
    try {
        conn = await oracleDB.getConnection(config)

        let sql = `SELECT * FROM VIDEO WHERE CONTENT_ID = :content_id`

        let result = await conn.execute(
            sql,
            [content_id]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function findExamFromContent_ID(content_id){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `SELECT * FROM QUESTION_ANSWER WHERE CONTENT_ID = :content_id`

        let result = await conn.execute(
            sql,
            [content_id]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function addNewCourse(course_id, course_name, course_description, total_marks, educational_level,image,category){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `INSERT INTO COURSE (COURSE_ID, COURSE_NAME, COURSE_DESCRIPTION, TOTAL_MARKS, EDUCATIONAL_LEVEL,IMAGE,CATEGORY)
                   VALUES (:course_id, :course_name, :course_description, :total_marks, :educational_level, :image, :category)`
        const result = await conn.execute(
            sql,
            [course_id, course_name, course_description, total_marks, educational_level, image, category]
        )
        return result.rows
    } catch (err) {
        console.log(err)
    }
}

async function addNewReview(review_body, course_id, rating, user_id){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `INSERT INTO REVIEWS (USER_ID, COURSE_ID, REVIEW_BODY, RATING) VALUES (:user_id, :course_id, :review_body, :rating)`

        const result = await conn.execute(
            sql,
            [user_id, course_id, review_body, rating]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function addNewTeacherIntoCourse(user_id, course_id){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `INSERT INTO INSTRUCTS (USER_ID, COURSE_ID) VALUES (:user_id, :course_id)`

        const result = await conn.execute(
            sql,
            [user_id, course_id]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function insertCompletion(user_id, content_id, obtained_marks,course_id){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `INSERT INTO COMPLETED_CONTENT (USER_ID, CONTENT_ID, OBTAINED_MARKS, COURSE_ID) VALUES (:user_id, :content_id, :obtained_marks, :course_id)`

        const result = await conn.execute(
            sql,
            [user_id, content_id, obtained_marks, course_id]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function getMaxTopicID(){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `SELECT MAX(TOPIC_ID) FROM TOPICS`

        const result = await conn.execute(
            sql,
            []
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function insertNewTopic(topic_id, sl_no, topic_title, topic_description, course_id){
    let conn
    try{
        conn = await oracleDB.getConnection(config)

        let sql = `INSERT INTO TOPICS(TOPIC_ID, SL_NO, TOPIC_TITLE, TOPIC_DESCRIPTION, COURSE_ID)
                   VALUES (:topic_id, :sl_no, :topic_title, :topic_description, :course_id)`

        let result = await conn.execute(
            sql,
            [topic_id, sl_no, topic_title, topic_description, course_id]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function findMaxSL_no(topic_id){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `SELECT MAX(SL_NO) FROM TOPICS`

        let result = conn.execute(
            sql,
            [topic_id]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function getMaxQuestionID(){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `SELECT MAX("Question_ID") FROM QUESTION_ANSWER`

        let result = conn.execute(
            sql,
            []
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function insertNewVideoContent(link, content_id){
    let conn

    try{
        conn = await oracleDB.getConnection(config)

        let sql = 'INSERT INTO VIDEO(CONTENT_ID, URL_LINK) VALUES(:content_id, :link)'

        let result = await conn.execute(
            sql,
            [link, content_id]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}


async function insertIntoContentsAfterInsertingVideo(content_id, sl_no, title, duration, topic_id, total_marks){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `INSERT INTO CONTENTS(CONTENT_ID, SL_NO, TITLE, DURATION, TOPIC_ID, TOTAL_MARKS) 
                   VALUES (:content_id, :sl_no, :title, :duration, :topic_id, :total_marks)`

        let result = await conn.execute(
            sql,
            [content_id, sl_no, title, duration, topic_id, total_marks]
        )

        return result.rows;
    } catch (err){
        console.log(err)
    }
}


async function insertNewExamQuestion(question_id, description, option_1, option_2, option_3, option_4, content_id){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `INSERT INTO QUESTION_ANSWER ("Question_ID", DESCRIPTION, OPTION_1, OPTION_2, OPTION_3, OPTION_4, CONTENT_ID) 
                   VALUES (:question_id, :description, :option_1, :option_2, :option_3, :option_4, :content_id)`

        let result = await conn.execute(
            sql,
            /*{
                description: {
                    dir: oracleDB.BIND_IN, type: oracleDB.STRING }
            },*/
            [question_id, description, option_1, option_2, option_3, option_4, content_id]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function addNewWrittenDocument(content_id, document_body){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `INSERT INTO WRITTEN_DOCUMENT (CONTENT_ID, DESCRIPTION) VALUES (:content_id, :document_body)`

        let result = await conn.execute(
            sql,
            [content_id, document_body]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function addNewComment(content_id, user_id, description){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `INSERT INTO "COMMENT" (CONTENT_ID, USER_ID, DESCRIPTION) VALUES (:content_id, :user_id, :description)`

        let result = await conn.execute(
            sql,
            [content_id, user_id, description]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function isEnrolledIn(user_id, course_id){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `SELECT * FROM ENROLLS WHERE USER_ID = :user_id AND COURSE_ID = :course_id`

        const result = await conn.execute(
            sql,
            [user_id, course_id]
        )
        return result.rows;
    } catch (err){
        console.log(err)
    }
}

async function isTeaching(user_id, course_id){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `SELECT * FROM INSTRUCTS WHERE USER_ID = :user_id AND COURSE_ID = :course_id`

        const result = await conn.execute(
            sql,
            [user_id, course_id]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function totalEnrolledInACourse(course_id){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `SELECT C2.*, COUNT(U.USER_ID)
                   FROM "USER" U JOIN ENROLLS E on U.USER_ID = E.USER_ID 
                                 JOIN COURSE C2 on E.COURSE_ID = C2.COURSE_ID
                   WHERE C2.COURSE_ID = :course_id
                   GROUP BY C2.COURSE_ID, COURSE_NAME, COURSE_DESCRIPTION, TOTAL_MARKS, EDUCATIONAL_LEVEL, CATEGORY, C2.IMAGE`

        let result = await conn.execute(
            sql,
            [course_id]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function findMaxSL_no_topic(course_id){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `SELECT MAX(SL_NO), COURSE_ID FROM SHIKHO.TOPICS 
                   WHERE COURSE_ID = :course_id
                   GROUP BY COURSE_ID`

        let result = conn.execute(
            sql,
            [course_id]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}

async function findMaxSL_no_content(topic_id){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `SELECT MAX(SL_NO), TOPIC_ID FROM CONTENTS
                   WHERE TOPIC_ID = :topic_id
                   GROUP BY TOPIC_ID`

        let result = await conn.execute(
            sql,
            [topic_id]
        )

        return result.rows;
    } catch (err) {
        console.log(err)
    }
}

async function getExamInfoFromTopic_ID(topic_id){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `SELECT QA.*
                   FROM TOPICS T JOIN CONTENTS C2 on T.TOPIC_ID = C2.TOPIC_ID JOIN QUESTION_ANSWER QA on C2.CONTENT_ID = QA.CONTENT_ID
                   WHERE T.TOPIC_ID = :topic_id`

        let result = await conn.execute(
            sql,
            [topic_id]
        )

        return result.rows;
    } catch (err){
        console.log(err)
    }
}
async function getLastInsertedVideoContentID() {

    let conn;

    try {
        conn = await oracleDB.getConnection(config)

        let sql = `SELECT MAX(CONTENT_ID) FROM CONTENTS`

        let result = await conn.execute(
            sql,
            []
        )

        return result.rows;
    } catch (err) {
        console.log(err)
    }

}

async function insertCorrectAnswer(correct_answer, question_id){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        let sql = `INSERT INTO ANSWER (CORRECT_ANSWER, "Question_ID") VALUES (:correct_answer, :question_id)`

        let result = await conn.execute(
            sql,
            [correct_answer, question_id]
        )
        return result.rows
    } catch (err){
        console.log(err)
    }
}


async function getCompletionOfAModule(){
    let conn;

    try{
        conn = await oracleDB.getConnection(config)

        /*let sql = `SELECT CC.CONTENT_ID
                   FROM "USER" U JOIN COMPLETED_CONTENT CC on U.USER_ID = CC.USER_ID
                                 JOIN CONTENTS C2 on CC.CONTENT_ID = C2.CONTENT_ID
                   WHERE U.USER_ID = :user_id AND C2.TOPIC_ID = :topic_id AND CC.COURSE_ID = :course_id`*/

        let sql = `SELECT * FROM COMPLETED_CONTENT`

        let result = await conn.execute(
            sql,
            []
        )

        return result.rows;

    } catch (err){
        console.log(err)
    }
}

module.exports = {
    getTopCategories,
    getTopCourses,
    getTopTeachers,
    getMaxCourse_ID,
    getCourseOfCategory,
    getCourseOfSearch,
    getCourseInfo,
    getTopicsOfCourse,
    getContentsOfATopic,
    findCourseTeacherByID,
    findCourseMembersByID,
    findReviewOfCourse,
    findTopicByTopicID,
    getVideoFromContent_ID,
    findExamFromContent_ID,
    addNewCourse,
    addNewReview,
    addNewTeacherIntoCourse,
    insertCompletion,
    getMaxTopicID,
    insertNewTopic,
    findMaxSL_no_topic,
    getMaxQuestionID,
    insertNewVideoContent,
    insertNewExamQuestion,
    addNewWrittenDocument,
    addNewComment,
    isEnrolledIn,
    isTeaching,
    totalEnrolledInACourse,
    findMaxSL_no,
    findMaxSL_no_content,
    getExamInfoFromTopic_ID,
    getLastInsertedVideoContentID,
    insertIntoContentsAfterInsertingVideo,
    insertCorrectAnswer,
    getCompletionOfAModule
}