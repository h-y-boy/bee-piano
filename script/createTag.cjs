const { execSync } = require('child_process')
const fs = require('fs')
const { resolve } = require('path')

// 读取 package.json 文件
const fileUrl = resolve(__dirname, '../package.json')
console.log(__filename, __dirname, fileUrl)
const packageJson = JSON.parse(fs.readFileSync(fileUrl, 'utf8'))
const version = packageJson.version

try {
  // 创建附注标签
  execSync(`git tag -a v${version} -m "Release version ${version}"`)
  console.log(`Tag v${version} created successfully.`)

  // 推送标签到远程仓库
  execSync(`git push origin v${version}`)
  console.log(`Tag v${version} pushed to remote successfully.`)
} catch (error) {
  console.error(`Error creating or pushing tag: ${error.message}`)
}
