#!/usr/bin/env groovy

// See https://github.com/capralifecycle/jenkins-pipeline-library
@Library('cals') _

buildConfig([
  slack: [
    channel: '#rødekors-dev-info',
    teamDomain: 'cals-capra',
  ],
]) {
  dockerNode {
    checkout scm

    def img = docker.image('circleci/node:12-browsers')
    img.pull()
    img.inside {
      stage('Install dependencies') {
        sh 'npm ci'
      }

      stage('Lint') {
        sh 'npm run lint'
      }

      stage('Run normal tests') {
        sh 'npm test'
      }

      stage('Generate build') {
        sh 'npm run build'
      }
    }
  }
}
