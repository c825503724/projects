package com.anji.project.hmi.entity;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * created by chenpeng at 2018/8/2-14:50
 */
@Entity
@Table(name = "hmi_record")
public class HMIRecord extends BaseEntity {

    private Float locationX;

    private Float locationY;

    private Float theta;

    private Integer number;

    private Integer location;

    private Integer route;

    private Integer operationStatus;

    private Integer targetLocation;

    private Integer communicationStatus;

    private Float power;

    private Float speed;


    public Float getLocationX() {
        return locationX;
    }

    public void setLocationX(Float locationX) {
        this.locationX = locationX;
    }

    public Float getLocationY() {
        return locationY;
    }

    public void setLocationY(Float locationY) {
        this.locationY = locationY;
    }

    public Float getTheta() {
        return theta;
    }

    public void setTheta(Float theta) {
        this.theta = theta;
    }

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public Integer getLocation() {
        return location;
    }

    public void setLocation(Integer location) {
        this.location = location;
    }

    public Integer getRoute() {
        return route;
    }

    public void setRoute(Integer route) {
        this.route = route;
    }

    public Integer getOperationStatus() {
        return operationStatus;
    }

    public void setOperationStatus(Integer operationStatus) {
        this.operationStatus = operationStatus;
    }

    public Integer getTargetLocation() {
        return targetLocation;
    }

    public void setTargetLocation(Integer targetLocation) {
        this.targetLocation = targetLocation;
    }

    public Integer getCommunicationStatus() {
        return communicationStatus;
    }

    public void setCommunicationStatus(Integer communicationStatus) {
        this.communicationStatus = communicationStatus;
    }

    public Float getPower() {
        return power;
    }

    public void setPower(Float power) {
        this.power = power;
    }

    public Float getSpeed() {
        return speed;
    }

    public void setSpeed(Float speed) {
        this.speed = speed;
    }
}
