const express = require('express')
const cors = require('cors')
const { callApi } = require('./github')

const app = express()
const port = process.env.PORT

app.use(cors())

app.get('/healthcheck', (req, res) => {
  return res.send({
    healthy: true,
    timestamp: new Date().toISOString()
  })
})

app.get('/api/users', async (req, res) => {
  const since = req.query?.since
  const users = await callApi(`users?since=${since}`)
  const lastId = users[users.length-1].id
  return res.send({
    users: users.map(({id, login}) => ({id, login})),
    next: `${process.env.BASE_URL}/api/users?since=${lastId}`
  })
})

app.get('/api/users/:username/details', async (req, res) => {
  const username = req.params.username
  const {id, login, html_url, created_at} = await callApi(`users/${username}`)
  return res.send({id, login, html_url, created_at})
})

app.get('/api/users/:username/repos', async (req, res) => {
  const username = req.params.username
  const page = req.query?.page
  const repos = await callApi(`users/${username}/repos?page=${page}`)
  return res.send(repos.map(({id, name, html_url}) => ({id, name, html_url})))
})

app.listen(port, () => {
  console.info('Listening on port', port)
})