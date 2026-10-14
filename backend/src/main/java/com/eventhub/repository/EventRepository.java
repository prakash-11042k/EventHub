package com.eventhub.repository;

import com.eventhub.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByCategoryId(Long categoryId);

    @Query("SELECT e FROM Event e WHERE LOWER(e.category.name) = LOWER(:categoryName)")
    List<Event> findByCategoryNameIgnoreCase(@Param("categoryName") String categoryName);
    
    @Query("SELECT e FROM Event e WHERE " +
           "LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.location) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Event> searchByQuery(@Param("query") String query);

    @Query("SELECT e FROM Event e WHERE " +
           "e.category.id = :categoryId AND (" +
           "LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.location) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Event> searchByQueryAndCategory(@Param("query") String query, @Param("categoryId") Long categoryId);

    @Query("SELECT e FROM Event e WHERE " +
           "LOWER(e.category.name) = LOWER(:categoryName) AND (" +
           "LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.location) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Event> searchByQueryAndCategoryName(@Param("query") String query, @Param("categoryName") String categoryName);
}
