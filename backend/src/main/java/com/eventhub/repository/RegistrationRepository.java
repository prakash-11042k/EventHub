package com.eventhub.repository;

import com.eventhub.entity.EventRegistration;
import com.eventhub.entity.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<EventRegistration, Long> {
    List<EventRegistration> findByUserId(Long userId);
    List<EventRegistration> findByEventId(Long eventId);
    boolean existsByUserIdAndEventIdAndStatus(Long userId, Long eventId, RegistrationStatus status);
    Optional<EventRegistration> findByUserIdAndEventId(Long userId, Long eventId);
    long countByEventIdAndStatus(Long eventId, RegistrationStatus status);
}
