package com.anji.project.hmi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableJpaAuditing
@EntityScan(basePackages = {"com.anji.project.hmi.entity"})
@EnableTransactionManagement
public class HMIApplication {

    public static void main(String[] arguments) {
        SpringApplication.run(HMIApplication.class);
    }
}
