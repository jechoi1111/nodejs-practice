const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

// mysql connection
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'database',
    connectTimeout: 5000,
    connectionLimit: 30
})

const getConn = async () => {
    return await connection.getConnection(async (conn) => conn);
}

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.listen(8080, function (){
    console.log('listening on 6000');
});
// 서버를 띄울 포트 번호, 띄운 후 실행할 코드
// 서버를 띄우기 위한 기본 셋팅

app.get('/pet', function(request, response){
    response.send('펫 용품을 쇼핑할 수 있는 페이지 입니다.')
});

app.get('/', function(request, response){
    response.sendFile(__dirname + '/index.html');
})

app.get('/write', function (req, res){
    res.sendFile(__dirname + '/write.html');
})

app.post('/add', function (req, res) {
    res.send('전송 완료');
    console.log(req.body.title)
})

app.get('/apiTest', async (req, res) => {
    const conn = await getConn();
    const query = 'SELECT * FROM TEST';
    let [rows, fields] =  await conn.query(query, []);
    conn.release();

    res.send(rows);
})

app.post('/postApiTest', async (req, res) => {
    const conn = await getConn();
    const query = 'INSERT INTO TEST(ID, PASSWORD) VALUES (?, ?)';
    const values = ["2", "1234"]

    await conn.query(query, values, (error, res) => {
        if (error) throw error;
    })

    console.log('데이터 insert 완료');

    conn.release();
})
