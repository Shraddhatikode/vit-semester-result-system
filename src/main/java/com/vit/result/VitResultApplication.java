package com.vit.result;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class VitResultApplication {

    public static void main(String[] args) {
        SpringApplication.run(VitResultApplication.class, args);
        System.out.println("=================================================");
        System.out.println("  VIT Student Result Portal is Running on HTTP!  ");
        System.out.println("  Access URL: http://localhost:8080               ");
        System.out.println("=================================================");
    }
}
