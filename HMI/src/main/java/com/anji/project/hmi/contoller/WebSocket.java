package com.anji.project.hmi.contoller;

import com.anji.project.hmi.config.WebsocketConfig;
import com.anji.project.hmi.util.WebsocketEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * created by chenpeng at 2018/8/10-19:47
 */
@ServerEndpoint(value = "/freshData",configurator = WebsocketConfig.class,
                encoders = {WebsocketEncoder.class})
@Component
public class WebSocket {
    private static AtomicInteger liveLinks = new AtomicInteger();

    private static CopyOnWriteArrayList<WebSocket> sockets = new CopyOnWriteArrayList<>();

    private Session session;

    private static final Logger logger = LoggerFactory.getLogger(WebSocket.class);

    @OnOpen
    public void onOpen(Session session,EndpointConfig endpointConfig) {
        String httpSessionId=(String)endpointConfig.getUserProperties().get("sessionId");
        this.session = session;
        sockets.add(this);
        liveLinks.addAndGet(1);
    }

    @OnClose
    public void onClose() {
        sockets.remove(this);
        liveLinks.decrementAndGet();
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        logger.error("websocket异常错误!", throwable);
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        System.out.println(message);
    }

    public static void sendMessageToAll(Object message){
        for(WebSocket webSocket:WebSocket.sockets){
            webSocket.sendMessage(message);
        }
    }
    private void sendMessage(Object message) {
        try {
            if (this.session != null) {
                this.session.getBasicRemote().sendObject(message);
            }
        } catch (EncodeException e) {
            logger.error("websocket解码错误！", e);
        } catch (IOException ioe) {
            logger.error("io异常", ioe);
        }
    }

}
