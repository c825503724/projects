package com.anji.project.hmi.service;

import org.springframework.context.ApplicationListener;

public interface SerialPortService extends ApplicationListener {

    //是否成功初始化
    boolean init();

    PortState getServiceState();


    enum PortState {

        NOT_START, FAIL, STOP,SUCCESS
    }
}
