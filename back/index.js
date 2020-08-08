const keys = require('./keys')


// express app setup 
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors') 

const app = express()
app.use(cors()) // cross origin resource shairing 
app.use(bodyParser.json())

// Postgres Client Setup

const { Pool } = require('pg')

const pgClient = new Pool({
    user: keys.pgUser,
    password: keys.pgPassword,
    host: keys.pgHost,
    database: keys.pgDatabase,
})

pgClient.on('error', ()=>console.log("Lost PG Connection"))

pgClient
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch(err=> console.log(err))


// redis Client Setup
const redis = require('redis')

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: ()=> 1000
})

const redisPublisher = redisClient.duplicate();

// Express Routes Handlers

app.get('/values/all', async (req, res)=>{

    const values = await pgClient.query('SELECT * FROM values')
    res.send(values.rows)

})

app.get('/values/current' , async (req,res)=>{
    redisClient.hgetall('values', (err,values)=>{
        res.send(values)
    })
})

app.post('/values', async (req,res)=>{
    const index = req.body.value

    if(parseInt(index)> 40) {
        return res.status(422).send('Index too high')
    }

    redisClient.hset('values', index, 'Nothing Yet!')
    redisPublisher.publish('insert', index)
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index])

    res.send({ working: true})
})

app.listen(5000, ()=>{
    console.log('server is running on '+ 5000)
})