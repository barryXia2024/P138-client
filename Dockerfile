# 使用官方 Nginx 镜像作为基础镜像
FROM nginx:alpine

# 设置工作目录
WORKDIR /usr/share/nginx/html

# 清空默认页面
RUN rm -rf ./*

# 拷贝前端构建产物
COPY dist/ /usr/share/nginx/html/

# 拷贝自定义 Nginx 配置
COPY default.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
