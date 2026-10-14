package com.eventhub.service;

import com.eventhub.dto.RegistrationDto;
import com.eventhub.entity.Event;
import com.eventhub.entity.EventRegistration;
import com.eventhub.entity.RegistrationStatus;
import com.eventhub.entity.User;
import com.eventhub.exception.ResourceNotFoundException;
import com.eventhub.repository.EventRepository;
import com.eventhub.repository.RegistrationRepository;
import com.eventhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @Transactional
    public RegistrationDto registerForEvent(Long userId, Long eventId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        // Check if already registered
        if (registrationRepository.existsByUserIdAndEventIdAndStatus(userId, eventId, RegistrationStatus.CONFIRMED)) {
            throw new IllegalArgumentException("Already registered for this event");
        }

        // Check capacity
        if (event.getAvailableSeats() <= 0) {
            throw new IllegalArgumentException("Event is full");
        }

        // Decrease available seats
        event.setAvailableSeats(event.getAvailableSeats() - 1);
        eventRepository.save(event);

        EventRegistration registration = new EventRegistration();
        registration.setUser(user);
        registration.setEvent(event);
        registration.setStatus(RegistrationStatus.CONFIRMED);

        return mapToDto(registrationRepository.save(registration));
    }

    @Transactional
    public void cancelRegistration(Long userId, Long eventId) {
        EventRegistration registration = registrationRepository.findByUserIdAndEventId(userId, eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found"));

        if (registration.getStatus() == RegistrationStatus.CANCELLED) {
            throw new IllegalArgumentException("Registration is already cancelled");
        }

        registration.setStatus(RegistrationStatus.CANCELLED);
        registrationRepository.save(registration);

        // Increase available seats
        Event event = registration.getEvent();
        event.setAvailableSeats(event.getAvailableSeats() + 1);
        eventRepository.save(event);
    }

    public List<RegistrationDto> getUserRegistrations(Long userId) {
        return registrationRepository.findByUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<RegistrationDto> getEventRegistrations(Long eventId) {
        return registrationRepository.findByEventId(eventId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<RegistrationDto> getAllRegistrations() {
        return registrationRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private RegistrationDto mapToDto(EventRegistration registration) {
        RegistrationDto dto = new RegistrationDto();
        dto.setId(registration.getId());
        dto.setEventId(registration.getEvent().getId());
        dto.setEventTitle(registration.getEvent().getTitle());
        dto.setEventDate(registration.getEvent().getEventDate().atTime(registration.getEvent().getStartTime()));
        dto.setLocation(registration.getEvent().getLocation());
        dto.setUserName(registration.getUser().getFullName());
        dto.setUserEmail(registration.getUser().getEmail());
        dto.setRegistrationDate(registration.getRegistrationDate());
        dto.setStatus(registration.getStatus());
        return dto;
    }
}
