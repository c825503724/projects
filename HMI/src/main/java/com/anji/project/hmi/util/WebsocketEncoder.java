package com.anji.project.hmi.util;

import com.alibaba.fastjson.JSONObject;
import com.anji.project.hmi.entity.HMIRecord;

import javax.websocket.EncodeException;
import javax.websocket.Encoder;
import javax.websocket.EndpointConfig;

/**
 * created by chenpeng at 2018/8/13-15:29
 */
public class WebsocketEncoder implements Encoder.Text<HMIRecord> {

    @Override
    public String encode(HMIRecord object) throws EncodeException {
        return JSONObject.toJSONString(object);
    }

    @Override
    public void init(EndpointConfig endpointConfig) {

    }

    @Override
    public void destroy() {

    }
}
