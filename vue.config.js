module.exports = {
  baseUrl: "/",
  devServer: {
    proxy: {
      "/api": {
        target: "http://172.28.171.24:8080/api",
        ws: true,
        changeOrigin: true
      }
    }
  }
};
