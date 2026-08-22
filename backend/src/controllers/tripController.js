import { queryAll, queryOne, executeRun } from '../db/database.js';

// Get all trips for current user (or demo trips if unauthenticated)
export const getTrips = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 1; // Default to user 1 for demo
    const trips = await queryAll(
      `SELECT t.*, 
        (SELECT COUNT(*) FROM trip_stops WHERE trip_id = t.id) as stop_count,
        (SELECT GROUP_CONCAT(city_name, ' · ') FROM trip_stops WHERE trip_id = t.id) as cities_list
       FROM trips t
       WHERE t.user_id = ?
       ORDER BY t.start_date DESC`,
      [userId]
    );

    res.json({ success: true, trips });
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch trips' });
  }
};

// Create a new trip with multi-city stops
export const createTrip = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 1;
    const { 
      title, 
      description, 
      start_date, 
      end_date, 
      cover_image_url, 
      total_budget, 
      base_currency, 
      stops 
    } = req.body;

    if (!title || !start_date || !end_date) {
      return res.status(400).json({ success: false, message: 'Title, start date, and end date are required' });
    }

    const defaultCover = cover_image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';
    const shareCode = 'TRIP-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    // Insert Trip Record
    const result = await executeRun(
      `INSERT INTO trips (user_id, title, description, start_date, end_date, cover_image_url, total_budget, base_currency, share_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, title, description || '', start_date, end_date, defaultCover, total_budget || 0, base_currency || 'USD', shareCode]
    );

    const tripId = result.lastID;

    // Insert City Stops if provided
    if (stops && Array.isArray(stops) && stops.length > 0) {
      for (let i = 0; i < stops.length; i++) {
        const stop = stops[i];
        await executeRun(
          `INSERT INTO trip_stops (trip_id, city_name, country, order_index)
           VALUES (?, ?, ?, ?)`,
          [tripId, stop.city_name || stop.name || 'City', stop.country || 'Global', i]
        );
      }
    }

    // Fetch the newly created trip
    const createdTrip = await queryOne(`SELECT * FROM trips WHERE id = ?`, [tripId]);

    res.status(201).json({ success: true, trip: createdTrip, message: 'Trip created successfully!' });
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ success: false, message: 'Failed to create trip' });
  }
};

// Delete a trip
export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    await executeRun(`DELETE FROM trips WHERE id = ?`, [id]);
    res.json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ success: false, message: 'Failed to delete trip' });
  }
};
