require('dotenv').config;
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const { authenticate } = require('./middleware');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('build'));

const port = process.env.PORT;
const secret = process.env.SECRET;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

function getTweets() {
  return pool.query(`
    SELECT
      tweets.id,
      tweets.message,
      tweets.created_at,
      users.name,
      users.handle
    FROM
      tweets
    INNER JOIN users ON
      tweets.user_id = users.id
    ORDER BY tweets.created_at DESC
  `)
  .then(({ rows }) => rows);
}

function getUsers() {
    return pool.query(`
    SELECT * FROM users`)
    .then(({ rows }) => rows);
}

function createTweet(message, userId) {
  return pool.query(`
    INSERT INTO tweets
      (message, user_id)
    VALUES
      ($1, $2)
    RETURNING
      *
  `, [message, userId])
  .then(({ rows }) => rows[0]);
}

function getUserByHandle(handle) {
  return pool.query(`
    SELECT * FROM users WHERE handle = $1
  `, [handle])
  .then(({ rows }) => rows[0]);
}

function createUser(newUser) {
    const queryText = `
    INSERT INTO users
        (name, handle, password)
    VALUES
      ($1, $2, $3)
    RETURNING
      *`;

  const queryValues = [
    newUser.name,
    newUser.handle,
    newUser.password
  ];

    return pool.query(queryText, queryValues)
  .then(({ rows }) => {
    return rows.map((user) => {
      return {
        name: user.name,
        handle: user.handle,
        password: user.password
      };
    });
  })
  .then((newUser) => newUser[0]);
}

const api = express();

api.get('/session', authenticate, function (req, res) {
  res.send({
    message: 'You are authenticated'
  });
});

api.post('/session', async function (req, res) {
  const { handle, password } = req.body;

  const user = await getUserByHandle(handle);

  if (!user) {
    return res.status(401).send({ error: 'Unknown user' });
  }

  if (user.password !== password) {
    return res.status(401).send({ error: 'Wrong password' });
  }

  const token = jwt.sign({
    id: user.id,
    handle: user.handle,
    name: user.name
  }, new Buffer(secret, 'base64'));

  res.send({
    token: token
  });
});

api.post('/tweets', authenticate, async function(req, res) {
  const { id } = req.user;
  const { message } = req.body;

  const newTweet = await createTweet(message, id);
  res.send(newTweet);
});

api.post('/users', async function (req, res) {
    const { name, handle, password } = req.body;

    const user = await createUser({
        name,
        handle,
        password
    });
    
    const token = jwt.sign({
        name: user.name,
        handle: user.handle,
        password: user.password
    }, new Buffer(secret, 'base64'));

    res.send({
        token: token
    });
})

api.get('/tweets', async function (req, res) {
  const tweets = await getTweets();
  res.send(tweets);
});

api.get('/users', async function (req, res) {
    const users = await getUsers();
    res.send(users);
})

app.use('/api', api);

app.listen(port, () => {
    console.log('Library app running on port http://localhost:3333');
});
