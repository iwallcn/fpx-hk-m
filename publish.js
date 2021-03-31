/**
 * 将 dist 目录下的文件拷贝到 process.env.npm_package_publishpath 下，然后提交到 svn
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process');

function clearDir(dir) {
  if (!dir) {
    return
  }
  const files = fs.readdirSync(dir)
  for (let i = 0; i < files.length; i++) {
    const newPath = path.join(dir, files[i]);
    const stat = fs.statSync(newPath)
    if (stat.isDirectory()) {
      //如果是文件夹就递归下去
      clearDir(newPath)
      fs.rmdirSync(newPath)
    } else {
      //删除文件
      fs.unlinkSync(newPath)
    }
  }
}

function copyDir(src, dest) {
  const files = fs.readdirSync(src)
  for (const file of files) {
    const srcPath = path.join(src, file)
    const stat = fs.statSync(srcPath)
    if (stat.isDirectory()) {
      const dirName = srcPath.split(path.sep).pop()
      const newDest = path.join(dest, dirName)
      fs.mkdirSync(newDest)
      copyDir(srcPath, newDest)
    } else {
      const destPath = path.join(dest, file)
      fs.copyFileSync(srcPath, destPath)
      console.log(`成功复制 ${srcPath} 到 ${destPath}`)
    }
  }
}

if (!process.env.npm_package_publishpath) {
  console.error('必须配置 publishpath')
  return
}

//
const srcDir = path.resolve(__dirname, `.${path.sep}dist`)
const destDir = path.isAbsolute(process.env.npm_package_publishpath) ?
  process.env.npm_package_publishpath : path.resolve(__dirname, process.env.npm_package_publishpath)


console.log(`清空 ${destDir}`)
clearDir(destDir) // 清空 web 站点 templates 文件夹

console.log(`复制 ${srcDir} 中的文件到 ${destDir}`)
copyDir(srcDir, destDir) // 复制文件

console.log()
console.log('提交到 SVN ...')
console.log()

const executeDir = path.join(destDir, '..')

const svnStatusRes = execSync(`cd ${executeDir} && svn status ${destDir}`)
const linebreak = (process.platform === 'win32') ? '\r\n' : '\n'
const svnStatusLines = svnStatusRes.toString().split(linebreak)
const newFiles = svnStatusLines.filter(str => str.startsWith('?')).map(line => line.split(' ').pop())
const delFiles = svnStatusLines.filter(str => str.startsWith('!')).map(line => line.split(' ').pop())

newFiles.forEach(file => execSync(`cd ${executeDir} && svn add ${file}`))
delFiles.forEach(file => execSync(`cd ${executeDir} && svn del ${file}`))

console.log(execSync(`cd ${executeDir} && svn ci -m "静态文件更新" ${destDir}`).toString())

console.log()
console.log('提交成功')
