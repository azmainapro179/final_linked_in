import http from 'node:http'

const PORT = process.env.PORT || 4000

const server = http.createServer((req, res) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers)
    res.end(JSON.stringify({ ok: true }))
    return
  }

  if (req.url === '/api/health') {
    res.writeHead(200, headers)
    res.end(JSON.stringify({ status: 'ok', version: 'version-1' }))
    return
  }

  res.writeHead(200, headers)
  res.end(JSON.stringify({ message: 'Backend foundation ready for later members.' }))
})

server.listen(PORT, () => {
  console.log(`Incremental backend listening on http://localhost:${PORT}`)
})
