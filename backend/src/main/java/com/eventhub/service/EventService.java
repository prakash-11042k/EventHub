package com.eventhub.service;

import com.eventhub.dto.EventDto;
import com.eventhub.entity.Category;
import com.eventhub.entity.Event;
import com.eventhub.entity.EventRegistration;
import com.eventhub.exception.ResourceNotFoundException;
import com.eventhub.repository.CategoryRepository;
import com.eventhub.repository.EventRepository;
import com.eventhub.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final CategoryRepository categoryRepository;
    private final RegistrationRepository registrationRepository;

    public List<EventDto> getAllEvents(String query, Long categoryId) {
        return getAllEvents(query, categoryId, null);
    }

    public List<EventDto> getAllEvents(String query, Long categoryId, String category) {
        String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;

        Long resolvedCategoryId = (categoryId != null && categoryId > 0) ? categoryId : null;
        String resolvedCategoryName = null;

        if (resolvedCategoryId == null && category != null && !category.trim().isEmpty()) {
            String trimmedCat = category.trim();
            if (!"all categories".equalsIgnoreCase(trimmedCat) && !"all".equalsIgnoreCase(trimmedCat)) {
                try {
                    long parsedId = Long.parseLong(trimmedCat);
                    if (parsedId > 0) {
                        resolvedCategoryId = parsedId;
                    }
                } catch (NumberFormatException e) {
                    resolvedCategoryName = trimmedCat;
                }
            }
        }

        List<Event> events;

        if (resolvedCategoryId != null) {
            if (cleanQuery != null) {
                events = eventRepository.searchByQueryAndCategory(cleanQuery, resolvedCategoryId);
            } else {
                events = eventRepository.findByCategoryId(resolvedCategoryId);
            }
        } else if (resolvedCategoryName != null) {
            if (cleanQuery != null) {
                events = eventRepository.searchByQueryAndCategoryName(cleanQuery, resolvedCategoryName);
            } else {
                events = eventRepository.findByCategoryNameIgnoreCase(resolvedCategoryName);
            }
        } else if (cleanQuery != null) {
            events = eventRepository.searchByQuery(cleanQuery);
        } else {
            events = eventRepository.findAll();
        }

        return events.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public EventDto getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        return mapToDto(event);
    }

    public EventDto createEvent(EventDto eventDto) {
        Category category = categoryRepository.findById(eventDto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Event event = mapToEntity(eventDto, new Event());
        event.setCategory(category);
        event.setAvailableSeats(eventDto.getCapacity());

        return mapToDto(eventRepository.save(event));
    }

    public EventDto updateEvent(Long id, EventDto eventDto) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        Category category = categoryRepository.findById(eventDto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        // Handle capacity updates
        int difference = eventDto.getCapacity() - event.getCapacity();
        int newAvailableSeats = event.getAvailableSeats() + difference;
        
        if (newAvailableSeats < 0) {
            throw new IllegalArgumentException("Cannot reduce capacity below currently registered users");
        }

        event = mapToEntity(eventDto, event);
        event.setCategory(category);
        event.setAvailableSeats(newAvailableSeats);

        return mapToDto(eventRepository.save(event));
    }

    @Transactional
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event not found");
        }
        List<EventRegistration> registrations = registrationRepository.findByEventId(id);
        if (!registrations.isEmpty()) {
            registrationRepository.deleteAll(registrations);
        }
        eventRepository.deleteById(id);
    }

    @Transactional
    public void deleteAllEvents() {
        registrationRepository.deleteAll();
        eventRepository.deleteAll();
    }

    private EventDto mapToDto(Event event) {
        EventDto dto = new EventDto();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setEventDate(event.getEventDate());
        dto.setStartTime(event.getStartTime());
        dto.setEndTime(event.getEndTime());
        dto.setVenue(event.getVenue());
        dto.setLocation(event.getLocation());
        dto.setOrganizer(event.getOrganizer());
        dto.setImageUrl(event.getImageUrl());
        dto.setCapacity(event.getCapacity());
        dto.setAvailableSeats(event.getAvailableSeats());
        dto.setCategoryId(event.getCategory().getId());
        dto.setCategoryName(event.getCategory().getName());
        return dto;
    }

    private Event mapToEntity(EventDto dto, Event event) {
        event.setTitle(dto.getTitle());
        event.setDescription(dto.getDescription());
        event.setEventDate(dto.getEventDate());
        event.setStartTime(dto.getStartTime());
        event.setEndTime(dto.getEndTime());
        event.setVenue(dto.getVenue());
        event.setLocation(dto.getLocation());
        event.setOrganizer(dto.getOrganizer());
        event.setImageUrl(dto.getImageUrl());
        event.setCapacity(dto.getCapacity());
        return event;
    }
}
