const { exec } = require('child_process');

// 执行脚本的命令
const command = 'sh ./deploy/deploy.sh';

// 执行命令
exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`执行出错: ${error}`);
        return;
    }
    console.log(`脚本输出: ${stdout}`);
    if (stderr) {
        console.log(`脚本错误输出: ${stderr}`);
    }
});
