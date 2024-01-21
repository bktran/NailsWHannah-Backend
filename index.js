require('dotenv').config();//for environment variables
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const mysql = require('mysql2')
const app = express() //firing up express/server

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME
})

// REQUEST - get info from frontend/send to backend
// RESPONSE - send to frontend
app.get('/api/get', (request, response) => {
  const sql = 
  `
    SELECT * FROM reviews;
  `
  db.query(sql, (err, result) => {
    response.send(result) //Send to Frontend
    console.log("🚀 ~ db.query ~ result:", result)
  })

})

app.post('/api/insert', (request, response) => {
  const reviewer = request.body.reviewer
  const reviewText = request.body.reviewText
  const sql =
  `
    INSERT INTO reviews (client_name, review) 
    VALUES (?, ?);
  `
  db.query(sql, [reviewer, reviewText], (err, result) => {
    console.log(err)
  })

})

//RUNNING ON LOCALHOST:3001
app.listen(3001, () => {
  console.log('running on port 3001')
})