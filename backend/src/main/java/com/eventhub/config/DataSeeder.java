package com.eventhub.config;

import com.eventhub.entity.Category;
import com.eventhub.repository.CategoryRepository;
import com.eventhub.repository.EventRepository;
import com.eventhub.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        removeAllEvents();
        seedCategories();
    }

    /**
     * Remove all events and registrations to ensure Explore Events is completely cleared.
     */
    private void removeAllEvents() {
        long regCount = registrationRepository.count();
        if (regCount > 0) {
            registrationRepository.deleteAll();
            log.info("Deleted all {} event registrations.", regCount);
        }
        long eventCount = eventRepository.count();
        if (eventCount > 0) {
            eventRepository.deleteAll();
            log.info("Deleted all {} events from database.", eventCount);
        }
    }

    private void seedCategories() {
        Map<String, String> categoryData = Map.ofEntries(
                Map.entry("Technology", "Software development, AI, Cloud computing, and tech innovations"),
                Map.entry("Business", "Startups, entrepreneurship, investing, and professional networking"),
                Map.entry("Workshop", "Hands-on coding bootcamps, technical masterclasses, and skill training"),
                Map.entry("Conference", "Keynote conventions, global industry summits, and panel discussions"),
                Map.entry("Sports", "Tournaments, marathons, fitness bootcamps, and athletics"),
                Map.entry("Entertainment", "Live music concerts, comedy specials, and performing arts"),
                Map.entry("Design & Creative", "UI/UX design, digital arts, 3D animation, and product design"),
                Map.entry("Health & Wellness", "Yoga retreats, mental health seminars, and fitness sessions"),
                Map.entry("Science & Education", "Scientific research, academic symposiums, and STEM showcases"),
                Map.entry("Community & Social", "Charity drives, community meetups, and volunteer gatherings"),
                Map.entry("Gaming & Esports", "Esports championships, game development jams, and gaming leagues"),
                Map.entry("Food & Culinary", "Food festivals, culinary workshops, and gourmet tastings")
        );

        for (Map.Entry<String, String> entry : categoryData.entrySet()) {
            if (!categoryRepository.existsByName(entry.getKey())) {
                Category category = new Category();
                category.setName(entry.getKey());
                category.setDescription(entry.getValue());
                categoryRepository.save(category);
                log.info("Seeded category: {}", entry.getKey());
            }
        }
    }
}
