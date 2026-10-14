package com.eventhub.controller;

import com.eventhub.dto.RegistrationDto;
import com.eventhub.entity.User;
import com.eventhub.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping("/events/{eventId}")
    public ResponseEntity<RegistrationDto> registerForEvent(
            @AuthenticationPrincipal User user,
            @PathVariable Long eventId) {
        return ResponseEntity.ok(registrationService.registerForEvent(user.getId(), eventId));
    }

    @DeleteMapping("/events/{eventId}")
    public ResponseEntity<Void> cancelRegistration(
            @AuthenticationPrincipal User user,
            @PathVariable Long eventId) {
        registrationService.cancelRegistration(user.getId(), eventId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my-registrations")
    public ResponseEntity<List<RegistrationDto>> getMyRegistrations(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(registrationService.getUserRegistrations(user.getId()));
    }

    @GetMapping("/events/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RegistrationDto>> getEventRegistrations(@PathVariable Long eventId) {
        return ResponseEntity.ok(registrationService.getEventRegistrations(eventId));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RegistrationDto>> getAllRegistrations() {
        return ResponseEntity.ok(registrationService.getAllRegistrations());
    }
}
