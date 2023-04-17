const callApi = async (endpoint) => {
  const githubRes = await fetch(`https://api.github.com/${endpoint}`, {
    headers: {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${process.env.GITHUB_API_KEY}`,
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
  return githubRes.json()
}

module.exports = { callApi }