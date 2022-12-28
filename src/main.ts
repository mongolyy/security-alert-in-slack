import core from '@actions/core'
import github from '@actions/github'
import {graphql} from '@octokit/graphql'

async function run(): Promise<void> {
  try {
    const {repo} = github.context
    const hoge = await graphql(`
      query {
        repository(name: "${repo.repo}", owner: "${repo.owner}") {
          vulnerabilityAlerts(first: 100, states: [OPEN]) {
            nodes {
              createdAt
              dismissedAt
              securityVulnerability {
                package {
                  name
                }
                advisory {
                  description
                }
              }
            }
          }
        }
      }
    `)

    core.setOutput('vulnerabilityAlerts', hoge)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
