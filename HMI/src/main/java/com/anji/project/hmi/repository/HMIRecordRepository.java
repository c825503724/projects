package com.anji.project.hmi.repository;

import com.anji.project.hmi.entity.HMIRecord;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

/**
 * created by chenpeng at 2018/8/2-19:11
 */
public interface HMIRecordRepository extends CrudRepository<HMIRecord,Integer> {

@Query(value = "select id,locationx,locationy,theta,number,location,route,operation_status,target_location," +
        "communication_status,power,speed,create_time,update_time from hmi_record order by create_time desc limit 0,1",nativeQuery = true)
HMIRecord queryLatestHMIRecord();

}
