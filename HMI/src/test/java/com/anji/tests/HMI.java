package com.anji.tests;

import com.anji.project.hmi.HMIApplication;
import com.anji.project.hmi.entity.HMIRecord;
import com.anji.project.hmi.repository.HMIRecordRepository;
import com.anji.project.hmi.service.SerialPortService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = HMIApplication.class)
public class HMI {

    @Autowired
    private HMIRecordRepository hmiRecordRepository;

    @Autowired
    private SerialPortService serialPortService;

    @Test
    public void ss() {
        HMIRecord record = new HMIRecord();
        record.setNumber(1);
        record.setLocationY(2.1F);
        record.setLocationX(2.5F);
        record.setLocation(221);
        record.setCommunicationStatus(1);
        record.setOperationStatus(1);
        record.setSpeed(22.1F);
        record.setRoute(22);
        record.setTargetLocation(222);
        record.setPower(2.0F);
        record.setTheta(2.1F);

    }


}
