import { Octokit } from '@octokit/core'

const octokit = new Octokit({
  auth: localStorage.getItem('token')
})

export default octokit
