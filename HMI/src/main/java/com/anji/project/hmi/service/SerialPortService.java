package com.anji.project.hmi.service;

import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;

public interface SerialPortService extends ApplicationListener<ApplicationEvent> {

    /**
     * 启动串口监听
     */
   void start();

    /**
     * 终止串口监听
     */
   void stop();

    /**
     * 获取目前监听状态
     * @return
     */
    PortState getServiceState();


    Integer getMessageLengthNotConsumed();

    /**
     * 四种监听状态
     */
    enum PortState {
        NOT_START, FAIL, STOP,SUCCESS
    }
}
