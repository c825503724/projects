package com.anji.project.hmi.contoller;

import com.anji.project.hmi.entity.HMIRecord;
import com.anji.project.hmi.repository.HMIRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.DependsOn;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * created by chenpeng at 2018/8/2-19:09
 */
@RestController
public class MainController {

    @Autowired
    private HMIRecordRepository hmiRecordRepository;
    @GetMapping("create")
    public void create() {
        HMIRecord record=new HMIRecord();
        record.setCommunicationStatus(1);
        record.setLocation(11);
        record.setLocationX(1.1f);
        record.setLocationY(1.3f);
        record.setNumber(12);
        hmiRecordRepository.save(record);
    }
}
