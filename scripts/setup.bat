@echo off
chcp 65001 >nul

echo 🚀 开始设置园区租赁管理系统...

REM 检查Node.js版本
echo 📋 检查Node.js版本...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js未安装，请先安装Node.js
    pause
    exit /b 1
)



REM 创建环境配置文件
echo ⚙️ 创建环境配置文件...
if not exist .env (
    copy env.example .env
    echo ✅ 已创建 .env 文件
) else (
    echo ℹ️ .env 文件已存在
)

echo ✅ 环境配置文件创建完成

REM 检查端口是否被占用
echo 🔍 检查端口占用情况...
netstat -an | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo ⚠️ 端口 3000 已被占用，请关闭占用该端口的程序
) else (
    echo ✅ 端口 3000 可用
)

echo 🎉 项目设置完成！
echo.
echo 📝 下一步操作：
echo 1. 运行 'npm start' 启动开发服务器
echo 2. 在浏览器中访问 http://localhost:3000
echo 3. 开始开发您的园区租赁管理系统
echo.
echo 📚 更多信息请查看 README.md 文件

pause 