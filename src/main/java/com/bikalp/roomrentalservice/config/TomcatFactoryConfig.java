package com.bikalp.roomrentalservice.config;

import jakarta.servlet.MultipartConfigElement;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.unit.DataSize;

@Configuration
public class TomcatFactoryConfig {
    @Bean
    public TomcatServletWebServerFactory tomcatFactory() {
        System.out.println("TomcatFactoryConfig: Custom Tomcat factory bean is being used!");
        // setting default size 100MB
        return new TomcatServletWebServerFactory() {
            @Override
            protected void customizeConnector(org.apache.catalina.connector.Connector connector) {
                super.customizeConnector(connector);
                connector.setMaxParameterCount(20); // no of images that can be passed in one request
                connector.setMaxPostSize(104857600); // setting default size 100MB
            }
        };
    }

    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        factory.setMaxFileSize(DataSize.ofMegabytes(20)); // 20MB per file
        factory.setMaxRequestSize(DataSize.ofMegabytes(100)); // 100MB total
        factory.setFileSizeThreshold(DataSize.ofKilobytes(512)); // when file writing to disk starts
        return factory.createMultipartConfig();
    }
}
