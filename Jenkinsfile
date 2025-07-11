pipeline {
    agent any

    environment {
        NODE_VERSION = '18.17.1'
        NODE_DIR = "${env.WORKSPACE}/node"
        PATH = "${env.WORKSPACE}/node/bin:${env.PATH}"
    }

    stages {
        stage('Setup Node.js') {
            steps {
                sh '''
                    if [ ! -d "$NODE_DIR" ]; then
                        curl -O https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz
                        mkdir -p $NODE_DIR
                        tar -xf node-v$NODE_VERSION-linux-x64.tar.xz --strip-components=1 -C $NODE_DIR
                    fi
                    node -v
                    npm -v
                '''
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                dir('backend') {
                    script {
                        def hasTestScript = sh(script: "grep -q '\"test\"' package.json && echo yes || echo no", returnStdout: true).trim()
                        if (hasTestScript == "yes") {
                            sh 'npm test -- --coverage'
                        } else {
                            echo 'Test stage skipped, no test script found in package.json'
                        }
                    }
                }
            }
        }

        stage('Install Frontend Dependencies') { 
            steps {
                dir('frontend') { 
                    sh 'npm install' 
                }
            }
        }

        stage('Run Frontend Tests') { 
            steps {
                dir('frontend') { 
                    sh 'npm test -- --ci --verbose --detectOpenHandles --coverage'
                }
            }
        }

              stage('Archive Coverage Reports') { 
            steps {
                script {
                    dir('backend') {
                        archiveArtifacts artifacts: 'coverage/**', fingerprint: true 
                    }
                    dir('frontend') {
                        archiveArtifacts artifacts: 'coverage/**', fingerprint: true 
                    }
                }
            }
        }
    }
}
