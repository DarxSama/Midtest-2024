
const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "shopdee"
});
db.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/product', function(req, res) {
    const { productName, productDetail, price, cost, quantity } = req.body;

/* ใช้ prepared statements เพื่อป้องกัน SQL Injection โดยดาร เปลี่ยน sql += "VALUES('"+ productName +"','
"+ productDetail +"', " sql += price +","+ cost +"," + quantity + ")" เป็น VALUES (?, ?, ?, ?, ?)*/
    let sql = "INSERT INTO product (productName, productDetail, price, cost, quantity) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [productName, productDetail, price, cost, quantity], function(err, result) {
            if (err) throw err;
            res.send({'message':'บันทึกข้อมูลสำเร็จ','status':true});        
    });
});

app.get('/product/:id', function(req, res) {
    const productID = req.params.id;

    // ใช้ prepared statements เพื่อป้องกัน SQL Injection
    let sql = "SELECT * FROM product WHERE productID = ?";
    db.query(sql, [productID], function(err, result) {
            if (err) throw err;    
    });
});

app.post('/login', function(req, res) {
    const { username, password } = req.body;
    // ใช้ prepared statements เพื่อป้องกัน SQL Injection
    let sql = "SELECT * FROM customer WHERE username = ? AND password = ? AND isActive = 1";
    db.query(sql, [username, password], function(err, result) {
        if(err) throw err
        // ตรวจสอบว่าพบผู้ใช้ที่ตรงกับข้อมูลที่ให้มา
        if (result.length > 0) {
            let customer = result[0];
            customer['message'] = "เข้าสู่ระบบสำเร็จ";
            customer['status'] = true;
            res.send(customer);
        } else {
            res.send({ "message": "กรุณาระบุรหัสผ่านใหม่อีกครั้ง", "status": false });
        }
    });
});
app.listen(port, function() {
    console.log(`server listening on port ${port}`);
});
