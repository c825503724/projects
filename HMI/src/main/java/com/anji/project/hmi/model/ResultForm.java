package com.anji.project.hmi.model;

import com.anji.project.hmi.meta.ResultEnum;

import java.io.Serializable;

/**
 * created by chenpeng at 2018/8/5-22:08
 */
public class ResultForm<T> implements Serializable {

    private static final long serialVersionUID = -8894023977967338570L;

    private String key;
    private int status = 0;
    private T result;
    private String message;

    public static <T> ResultForm<T> createSuccessResulForm(T result, String messge) {
        return new ResultForm<>(ResultEnum.success, result, messge);
    }

    private static <T> ResultForm<T> createErrorResultForm(T result, String message) {
        return new ResultForm<>(ResultEnum.error, result, message);
    }

    private ResultForm(ResultEnum resultEnum, T result, String message) {
        status = resultEnum.getResult();
        this.result = result;
        this.message = message;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public T getResult() {
        return result;
    }

    public void setResult(T result) {
        this.result = result;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
