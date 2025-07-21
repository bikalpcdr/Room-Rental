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
    public ServletContextInitializer servletContextInitializer() {
        return servletContext -> {
            // Set the fileCountMax attribute for multipart uploads
            servletContext.setAttribute("org.apache.tomcat.util.http.fileupload.fileCountMax", 20);
        };
    }

    @Bean
    public org.springframework.boot.web.embedded.tomcat.TomcatContextCustomizer fileCountMaxCustomizer() {
        return context -> context.getServletContext().setAttribute("org.apache.tomcat.util.http.fileupload.fileCountMax", 20);
    }

    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();

        // Set max individual file size
        factory.setMaxFileSize(DataSize.ofMegabytes(20)); // 20MB per file

        // Set max total request size
        factory.setMaxRequestSize(DataSize.ofMegabytes(100)); // 100MB total

        // ✅ Optional: Increase number of file items allowed
        factory.setFileSizeThreshold(DataSize.ofKilobytes(512)); // when file writing to disk starts

        return factory.createMultipartConfig();
    }
}
