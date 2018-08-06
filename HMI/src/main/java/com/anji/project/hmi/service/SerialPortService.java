package com.anji.project.hmi.service;

public interface SerialPortService  {

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

