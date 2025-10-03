# 设置目标目录为当前项目
DEST_DIR="/Users/xiayiming/Desktop/zyrt/p138-clinet-web-expo/src/api"

# 下载文件
curl -L "http://192.168.31.249:8888/docs/ts.zip" -o ./tmpfile.zip

# 解压文件
unzip -o ./tmpfile.zip -d ./temp_unzip

# 复制文件到目标目录
cp -R ./temp_unzip/interface "$DEST_DIR/"
cp -R ./temp_unzip/schema "$DEST_DIR/"

# 清理临时文件
rm -f ./tmpfile.zip
rm -rf ./temp_unzip
