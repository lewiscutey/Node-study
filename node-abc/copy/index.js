/* const fs = require('fs')

let pathname = {
  src: './copy.js',
  dist: './test.js'
}

let ReadStream = fs.createReadStream(pathname.src)
let WriteStream = fs.createWriteStream(pathname.dist)

ReadStream.pipe(WriteStream)

// 复制完成触发的事件
WriteStream.on('finish', () => {
  console.log('复制完成')
}) */

const fs = require('fs')
const out = process.stdout

let paths = {
  src: './test.mp3',
  dist: './mp3/test1.mp3'
}

function copy(paths) {
  let {
    src,
    dist
  } = paths
  let readStream = fs.createReadStream(src)
  let writeStream = fs.createWriteStream(dist)

  let stat = fs.statSync(src),
    totalSize = stat.size,
    progress = 0,
    lastSize = 0,
    startTime = Date.now();
    console.log(stat);

  readStream.on('data', function (chunk) {
    progress += chunk.length;
  })

  // 我们添加了一个递归的setTimeout来做一个旁观者
  // 每500ms观察一次完成进度，并把已完成的大小、百分比和复制速度一并写到控制台上
  // 当复制完成时，计算总的耗费时间
  setTimeout(function show() {
    let percent = Math.ceil((progress / totalSize) * 100)
    let size = Math.ceil(progress / 1000000)
    let diff = size - lastSize
    lastSize = size
    out.clearLine()
    out.cursorTo(0)
    out.write(`已完成${size}MB,${percent}%, 速度：${diff * 2}MB/s`)
    if (progress < totalSize) {
      setTimeout(show, 500)
    } else {
      let endTime = Date.now()
      console.log(`共用时：${(endTime - startTime) / 1000}秒。`)
    }
  }, 500)
}

copy(paths)