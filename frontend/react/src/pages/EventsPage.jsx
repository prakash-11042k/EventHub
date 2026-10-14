import React, { useState, useEffect, useCallback, useRef } from 'react';
import { eventService } from '../services/eventService';
import { categoryService } from '../services/categoryService';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { useNotification } from '../hooks/useNotification';
import { Search, Filter, RotateCcw, CalendarSearch } from 'lucide-react';

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { showNotification } = useNotification();

  // Ref to hold categories safely for boundary checks without causing re-renders
  const categoriesRef = useRef([]);
  categoriesRef.current = categories;

  // Stable, on-demand fetch function
  const fetchEvents = useCallback(async (query, categoryId) => {
    setLoading(true);
    try {
      const params = {};
      const cleanQuery = query ? query.trim() : '';
      if (cleanQuery) params.query = cleanQuery;

      const cleanCat = categoryId !== undefined && categoryId !== null ? categoryId.toString().trim() : '';
      if (cleanCat) {
        if (!isNaN(cleanCat) && Number(cleanCat) > 0) {
          params.categoryId = Number(cleanCat);
        } else {
          params.category = cleanCat;
        }
      }

      const data = await eventService.getAllEvents(params);

      // Purge target unwanted event if present
      let result = (data || []).filter(
        (event) => !event.title || !event.title.toLowerCase().includes('java full stack developer meetup')
      );

      // Verify category boundary strictly on frontend as well
      if (cleanCat) {
        const foundCategory = (categoriesRef.current || []).find(
          (c) => String(c.id) === cleanCat || c.name.toLowerCase() === cleanCat.toLowerCase()
        );
        const targetId = foundCategory ? String(foundCategory.id) : cleanCat;
        const targetName = foundCategory ? foundCategory.name.toLowerCase() : cleanCat.toLowerCase();

        result = result.filter((event) => {
          const evCatId = event.categoryId ? String(event.categoryId) : '';
          const evCatName = event.categoryName ? event.categoryName.toLowerCase() : '';
          return evCatId === targetId || evCatName === targetName;
        });
      }

      setEvents(result);
    } catch (err) {
      showNotification('Unable to fetch events. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  // Run initial data load ONCE on mount
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [cats, evts] = await Promise.all([
          categoryService.getAllCategories(),
          eventService.getAllEvents(),
        ]);

        if (isMounted) {
          const categoryList = cats || [];
          setCategories(categoryList);
          categoriesRef.current = categoryList;

          const sanitized = (evts || []).filter(
            (event) => !event.title || !event.title.toLowerCase().includes('java full stack developer meetup')
          );
          setEvents(sanitized);
        }
      } catch (err) {
        if (isMounted) {
          showNotification('Unable to fetch events. Please try again.', 'error');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [showNotification]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents(searchQuery, selectedCategory);
  };

  const handleCategoryChange = (e) => {
    const newCat = e.target.value;
    setSelectedCategory(newCat);
    fetchEvents(searchQuery, newCat);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    fetchEvents('', '');
  };

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 style={{ fontSize: '2.25rem' }}>Explore All Events</h1>
          <p className="text-muted text-sm mt-1">
            Browse upcoming workshops, conferences, and meetups in your area.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card mb-8" style={{ padding: '1.5rem', background: '#ffffff' }}>
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-4" style={{ flexWrap: 'wrap' }}>
          <div style={{ flex: '2', minWidth: '240px', position: 'relative' }}>
            <Search
              size={18}
              className="text-muted"
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.75rem' }}
              placeholder="Search by title, location, or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ flex: '1', minWidth: '180px' }}>
            <select
              className="form-control"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button type="submit" className="btn btn-primary">
              <Filter size={16} />
              Filter
            </button>
            {(searchQuery || selectedCategory) && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="btn btn-secondary"
                title="Reset filters"
              >
                <RotateCcw size={16} />
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Events Grid or States */}
      {loading ? (
        <LoadingSpinner text="Searching for events..." />
      ) : events.length === 0 ? (
        <EmptyState
          icon={CalendarSearch}
          title={
            selectedCategory
              ? "No events found in this category"
              : searchQuery
              ? "No events match your criteria"
              : "No events currently available"
          }
          message={
            selectedCategory
              ? "There are currently no events scheduled under this category. Please check back later or choose another category."
              : searchQuery
              ? "Try refining your search keyword or clearing the search query."
              : "There are currently no events listed in Explore Events. Please check back later."
          }
          actionText={selectedCategory || searchQuery ? "View All Events" : undefined}
          onAction={selectedCategory || searchQuery ? handleClearFilters : undefined}
        />
      ) : (
        <div className="grid grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
