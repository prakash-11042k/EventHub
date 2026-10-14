package com.eventhub.dto;

import com.eventhub.entity.RegistrationStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RegistrationDto {
    private Long id;
    private Long eventId;
    private String eventTitle;
    private LocalDateTime eventDate;
    private String location;
    private String userName;
    private String userEmail;
    private LocalDateTime registrationDate;
    private RegistrationStatus status;
}
