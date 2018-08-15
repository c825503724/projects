package com.anji.project.hmi.contoller;

import com.anji.project.hmi.entity.HMIRecord;
import com.anji.project.hmi.repository.HMIRecordRepository;
import com.anji.project.hmi.service.SerialPortService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * created by chenpeng at 2018/8/2-19:09
 */
@Controller
public class MainController {

    @Autowired
    private HMIRecordRepository hmiRecordRepository;

    @Autowired
    private SerialPortService serialPortService;

    @GetMapping("create")
    public void create() {
        HMIRecord record = new HMIRecord();
        record.setCommunicationStatus(1);
        record.setLocation(11);
        record.setLocationX(1.1f);
        record.setLocationY(1.3f);
        record.setNumber(12);
        hmiRecordRepository.save(record);
    }

    @RequestMapping("show")
    public String show(Model model) {
        model.addAttribute("hello", "ok");
        return "index";
    }

    @RequestMapping("getLatest")
    @ResponseBody
    public HMIRecord getLatest() {
        return hmiRecordRepository.queryLatestHMIRecord();
    }

    @RequestMapping("dashbord")
    public String dashbord() {
        return "dashboard";
    }

    @RequestMapping("start")
    @ResponseBody
    public void start() {
        serialPortService.start();
    }

    @RequestMapping("stop")
    @ResponseBody
    public void stop() {
        serialPortService.stop();
    }
}
