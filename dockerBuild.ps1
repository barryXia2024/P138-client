# # 构建镜像 镜像名 {p138-client-web}
# docker build -t p138-client-web ./
# # 先删除已有容器（如果存在）容器名  {docker-client-web}
# docker rm -f docker-client-web 2>$null
# # 启动容器  容器名{docker-client-web} 镜像名{p138-client-web}
# docker run -d -p 8081:80 --name docker-client-web p138-client-web

# 1️⃣ 预拉基础镜像，防止每次 build 失败
docker pull nginx:alpine

# 2️⃣ 构建镜像，使用本地镜像，不去拉最新
docker build --pull=false -t p138-client-web ./

# 3️⃣ 删除已有容器（如果存在）
docker rm -f docker-client-web 2>$null

# 4️⃣ 启动容器
docker run -d -p 8081:80 --name docker-client-web p138-client-web
