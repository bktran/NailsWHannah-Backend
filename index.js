require('dotenv').config();//for environment variables
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const mysql = require('mysql2')
const app = express() //firing up express/server

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

// REQUEST - get info from frontend/send to backend
// RESPONSE - send to frontend
app.get('/api/get', (request, response) => {
  const sql = `
    SELECT * FROM reviews;
  `
  db.query(sql, (err, result) => {
    response.send(result) //Send to Frontend (client)
  })

})

app.post('/api/insert', (request, response) => {
  const client_name = request.body.client_name //use body because we are passing in the data
  const review_text = request.body.review_text

  const sql = `
    INSERT INTO reviews (client_name, review) 
    VALUES (?, ?);
  `
  db.query(sql, [ client_name, review_text ], (err, result) => {
    console.log(err)
  })

})

app.delete("/api/delete/:id", (req, res) => {
  const id = req.params.id //use params because we are passing in the id
  const sql = `
    DELETE FROM reviews WHERE id = ?
  `
  db.query(sql, id, (err, result) => {
    if (err) {
      console.log(err)
    }
  })
})

app.put("/api/update/:id", (req, res) => {
  const id = req.params.id //use params because we are passing in the id
  const review_text = req.body.review_text
  const sql = `
    UPDATE reviews SET review =? WHERE id =?
  `
  // set array in order of ? ?
  db.query(sql, [ review_text, id ], (err, result) => {
    if (err) {
      console.log(err)
    }
  })
})

//RUNNING ON LOCALHOST:3001
app.listen(3001, () => {
  console.log('running on port 3001')
})