---
title: 浅谈webSocket
date: 2023-09-12 01:37:03
toc: true
categories: 网络
tags:
  - http
  - webSocket
  - 网络协议
---
## webSocket 简介

webSocket 和 http 都是应用层，支持端对端的通讯。可以由服务端发起，也可以由客户端发起。

应用场景：消息通知，直播讨论区，聊天室，协同编辑等

## webSocket 建立连接

会先发起一个 http 请求，根服务端建立连接。连接成功之后再升级为 webSocket 协议，然后再通讯。

![](https://pic.imgdb.cn/item/64ff5112661c6c8e549b06e4.png)

## webSocket 和 http 区别

- 协议名称不同 `ws` 和 `http`
- http 一般只能浏览器发起请求，webSocket 可以双端发起请求
- webSocket 无跨域限制
- webSocket 通过 `send` 和 `onmessage` 进行通讯，http 通过 `req` 和 `res` 通讯

PS：`ws` 可以升级为 `wss` 协议，像 `http` 升级到 `https` 一样，增加 `SSL` 安全协议。

```js
import { createServer } from 'https'
import { readFileSync } from 'fs'
import { WebSocketServer } from 'ws'

const server = createServer({
  cert: readFileSync('/path/to/cert.pem'),
  key: readFileSync('/path/to/key.pem')
})
const wss = new WebSocketServer({ server })
```

## 扩展

PS：如果做项目开发，推荐使用 [socket.io](https://www.npmjs.com/package/socket.io)，API 更方便。

```js
io.on('connection', socket => {
  // emit an event to the socket
  socket.emit('request', /* … */)
  // emit an event to all connected sockets
  io.emit('broadcast', /* … */)
  // listen to the event
  socket.on('reply', () => { /* … */ })
})
```

## webSocket 和长轮询（长连接）的区别

- http 长轮询 - 客户端发起 http 请求，server 不立即返回，等待有结果再返回。这期间 TCP 连接不会关闭，阻塞式。（需要处理 timeout 的情况）
- webSocket - 客户端发起请求，服务端接收，连接关闭。服务端发起请求，客户端接收，连接关闭。非阻塞。

![](https://pic.imgdb.cn/item/64ff5158661c6c8e549b0c1a.png)
