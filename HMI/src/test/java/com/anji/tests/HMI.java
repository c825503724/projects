package com.anji.tests;

import com.anji.project.hmi.HMIApplication;
import com.anji.project.hmi.repository.HMIRecordRepository;
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
    @Test
    public void ss() {
//        hmiRecordRepository.queryLatestHMIRecord();
    }
}
