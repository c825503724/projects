package com.anji.project.hmi.meta;

/**
 * created by chenpeng at 2018/8/6-23:15
 */
public enum ResultEnum {


    error(0),
    success(1),
    warn(2),
    none(3);

    private Integer result;

    public Integer getResult() {
        return result;
    }

    ResultEnum(Integer i) {
        result = i;
    }

    public void setResult(Integer result) {
        this.result = result;
    }
}
