package com.eventhub;

import com.eventhub.dto.EventDto;
import com.eventhub.entity.Category;
import com.eventhub.entity.Event;
import com.eventhub.repository.CategoryRepository;
import com.eventhub.repository.EventRepository;
import com.eventhub.repository.RegistrationRepository;
import com.eventhub.service.EventService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class EventCategoryFilterTest {

    @Autowired
    private EventService eventService;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private RegistrationRepository registrationRepository;

    private Category workshopCategory;
    private Category sportsCategory;
    private Category businessCategory;
    private Category emptyCategory;

    private Event workshopEvent1;
    private Event workshopEvent2;
    private Event sportsEvent;
    private Event businessEvent;

    @BeforeEach
    void setUp() {
        // Clear registrations and events for test isolation
        registrationRepository.deleteAll();
        eventRepository.deleteAll();

        // Setup test categories
        workshopCategory = categoryRepository.findByName("Workshop")
                .orElseGet(() -> categoryRepository.save(Category.builder().name("Workshop").description("Workshop sessions").build()));

        sportsCategory = categoryRepository.findByName("Sports")
                .orElseGet(() -> categoryRepository.save(Category.builder().name("Sports").description("Sports tournaments").build()));

        businessCategory = categoryRepository.findByName("Business")
                .orElseGet(() -> categoryRepository.save(Category.builder().name("Business").description("Business summits").build()));

        emptyCategory = categoryRepository.findByName("Science & Education")
                .orElseGet(() -> categoryRepository.save(Category.builder().name("Science & Education").description("STEM topics").build()));

        // Setup test events
        workshopEvent1 = eventRepository.save(Event.builder()
                .title("Hands-on React & Java Workshop")
                .description("Intensive full stack workshop")
                .category(workshopCategory)
                .eventDate(LocalDate.now().plusDays(10))
                .startTime(LocalTime.of(10, 0))
                .endTime(LocalTime.of(16, 0))
                .location("New York, NY")
                .venue("Tech Center Room A")
                .capacity(50)
                .availableSeats(50)
                .build());

        workshopEvent2 = eventRepository.save(Event.builder()
                .title("Advanced Microservices Workshop")
                .description("Spring Boot & Docker workshop")
                .category(workshopCategory)
                .eventDate(LocalDate.now().plusDays(15))
                .startTime(LocalTime.of(9, 0))
                .endTime(LocalTime.of(15, 0))
                .location("Boston, MA")
                .venue("Code Labs")
                .capacity(40)
                .availableSeats(40)
                .build());

        sportsEvent = eventRepository.save(Event.builder()
                .title("Annual City Marathon")
                .description("Full marathon event across city")
                .category(sportsCategory)
                .eventDate(LocalDate.now().plusDays(20))
                .startTime(LocalTime.of(6, 0))
                .endTime(LocalTime.of(12, 0))
                .location("Chicago, IL")
                .venue("Grant Park")
                .capacity(300)
                .availableSeats(300)
                .build());

        businessEvent = eventRepository.save(Event.builder()
                .title("Startup Pitch & Business Summit")
                .description("Networking for venture investors and founders")
                .category(businessCategory)
                .eventDate(LocalDate.now().plusDays(25))
                .startTime(LocalTime.of(13, 0))
                .endTime(LocalTime.of(18, 0))
                .location("San Francisco, CA")
                .venue("Bay Convention Hall")
                .capacity(150)
                .availableSeats(150)
                .build());
    }

    @Test
    @DisplayName("1. When selecting 'Workshop', display ONLY events whose actual category is 'Workshop'")
    void testFilterByWorkshopCategory() {
        // Test with categoryId
        List<EventDto> byId = eventService.getAllEvents(null, workshopCategory.getId(), null);
        assertEquals(2, byId.size(), "Workshop category should have exactly 2 events");
        for (EventDto dto : byId) {
            assertEquals("Workshop", dto.getCategoryName());
            assertEquals(workshopCategory.getId(), dto.getCategoryId());
        }

        // Test with category name string
        List<EventDto> byName = eventService.getAllEvents(null, null, "Workshop");
        assertEquals(2, byName.size(), "Querying by category name 'Workshop' should return 2 events");
        for (EventDto dto : byName) {
            assertEquals("Workshop", dto.getCategoryName());
        }

        // Verify Sports and Business events are NOT present
        assertFalse(byId.stream().anyMatch(e -> e.getTitle().contains("Marathon")));
        assertFalse(byId.stream().anyMatch(e -> e.getTitle().contains("Startup Pitch")));
    }

    @Test
    @DisplayName("2. When selecting 'Sports', display ONLY events whose actual category is 'Sports'")
    void testFilterBySportsCategory() {
        // Test with categoryId
        List<EventDto> byId = eventService.getAllEvents(null, sportsCategory.getId(), null);
        assertEquals(1, byId.size(), "Sports category should have exactly 1 event");
        assertEquals("Annual City Marathon", byId.get(0).getTitle());
        assertEquals("Sports", byId.get(0).getCategoryName());
        assertEquals(sportsCategory.getId(), byId.get(0).getCategoryId());

        // Test with category name string
        List<EventDto> byName = eventService.getAllEvents(null, null, "Sports");
        assertEquals(1, byName.size(), "Querying by category name 'Sports' should return 1 event");
        assertEquals("Annual City Marathon", byName.get(0).getTitle());

        // Verify Workshop and Business events are NOT present
        assertFalse(byId.stream().anyMatch(e -> e.getTitle().contains("Workshop")));
        assertFalse(byId.stream().anyMatch(e -> e.getTitle().contains("Startup Pitch")));
    }

    @Test
    @DisplayName("3. When selecting 'Business', display ONLY events whose actual category is 'Business'")
    void testFilterByBusinessCategory() {
        // Test with categoryId
        List<EventDto> byId = eventService.getAllEvents(null, businessCategory.getId(), null);
        assertEquals(1, byId.size(), "Business category should have exactly 1 event");
        assertEquals("Startup Pitch & Business Summit", byId.get(0).getTitle());
        assertEquals("Business", byId.get(0).getCategoryName());
        assertEquals(businessCategory.getId(), byId.get(0).getCategoryId());

        // Test with category name string
        List<EventDto> byName = eventService.getAllEvents(null, null, "Business");
        assertEquals(1, byName.size(), "Querying by category name 'Business' should return 1 event");
        assertEquals("Startup Pitch & Business Summit", byName.get(0).getTitle());

        // Verify Workshop and Sports events are NOT present
        assertFalse(byId.stream().anyMatch(e -> e.getTitle().contains("Workshop")));
        assertFalse(byId.stream().anyMatch(e -> e.getTitle().contains("Marathon")));
    }

    @Test
    @DisplayName("4. Each event must appear ONLY under its assigned category")
    void testEachEventAppearsOnlyUnderAssignedCategory() {
        List<EventDto> workshops = eventService.getAllEvents(null, workshopCategory.getId(), null);
        List<EventDto> sports = eventService.getAllEvents(null, sportsCategory.getId(), null);
        List<EventDto> business = eventService.getAllEvents(null, businessCategory.getId(), null);

        // Disjoint sets check: no overlap in IDs between categories
        for (EventDto w : workshops) {
            assertTrue(sports.stream().noneMatch(s -> s.getId().equals(w.getId())), "Workshop event leaked into Sports");
            assertTrue(business.stream().noneMatch(b -> b.getId().equals(w.getId())), "Workshop event leaked into Business");
        }
        for (EventDto s : sports) {
            assertTrue(workshops.stream().noneMatch(w -> w.getId().equals(s.getId())), "Sports event leaked into Workshop");
            assertTrue(business.stream().noneMatch(b -> b.getId().equals(s.getId())), "Sports event leaked into Business");
        }
    }

    @Test
    @DisplayName("5. When 'All Categories' is selected, display all events")
    void testAllCategoriesDisplaysAllEvents() {
        // Null categoryId and null query
        List<EventDto> all1 = eventService.getAllEvents(null, null, null);
        assertEquals(4, all1.size(), "All Categories should display all 4 events");

        // "All Categories" string parameter
        List<EventDto> all2 = eventService.getAllEvents(null, null, "All Categories");
        assertEquals(4, all2.size(), "'All Categories' string should display all 4 events");

        // Empty string category parameter
        List<EventDto> all3 = eventService.getAllEvents(null, null, "");
        assertEquals(4, all3.size(), "Empty string category should display all 4 events");
    }

    @Test
    @DisplayName("6. When a category has no events, return empty list (0 events)")
    void testCategoryWithNoEventsReturnsEmpty() {
        // Category that exists but has 0 events
        List<EventDto> emptyResult = eventService.getAllEvents(null, emptyCategory.getId(), null);
        assertNotNull(emptyResult);
        assertEquals(0, emptyResult.size(), "Category with no events must return 0 items");

        // By name of empty category
        List<EventDto> emptyByName = eventService.getAllEvents(null, null, "Science & Education");
        assertNotNull(emptyByName);
        assertEquals(0, emptyByName.size(), "Query by name with no events must return 0 items");

        // Non-existent category ID
        List<EventDto> nonExistent = eventService.getAllEvents(null, 999999L, null);
        assertNotNull(nonExistent);
        assertEquals(0, nonExistent.size(), "Non-existent category ID must return 0 items");
    }

    @Test
    @DisplayName("7. Category filtering combined with search query works correctly")
    void testCategoryCombinedWithSearchQuery() {
        // Search "Microservices" inside Workshop -> should return workshopEvent2
        List<EventDto> microservicesInWorkshop = eventService.getAllEvents("Microservices", workshopCategory.getId(), null);
        assertEquals(1, microservicesInWorkshop.size());
        assertEquals("Advanced Microservices Workshop", microservicesInWorkshop.get(0).getTitle());

        // Search "City" inside Workshop -> should return 0 (City is in Sports marathon, not in Workshop!)
        List<EventDto> cityInWorkshop = eventService.getAllEvents("City", workshopCategory.getId(), null);
        assertEquals(0, cityInWorkshop.size(), "Search for 'City' in Workshop must return 0");

        // Search "City" inside Sports -> should return sportsEvent
        List<EventDto> cityInSports = eventService.getAllEvents("City", sportsCategory.getId(), null);
        assertEquals(1, cityInSports.size());
        assertEquals("Annual City Marathon", cityInSports.get(0).getTitle());
    }

    @Test
    @DisplayName("8. Case-insensitive and trimmed category names work properly")
    void testCaseInsensitivityAndTrimming() {
        List<EventDto> lowerCase = eventService.getAllEvents(null, null, "workshop");
        assertEquals(2, lowerCase.size(), "Lower-case 'workshop' should return 2 events");

        List<EventDto> upperCase = eventService.getAllEvents(null, null, "SPORTS");
        assertEquals(1, upperCase.size(), "Upper-case 'SPORTS' should return 1 event");

        List<EventDto> padded = eventService.getAllEvents(null, null, "   Business   ");
        assertEquals(1, padded.size(), "Padded '   Business   ' should return 1 event");
    }
}
