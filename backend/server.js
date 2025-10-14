// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());
// app.use(express.json());

// const { Pool } = require('pg');
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

// pool.query('SELECT NOW()', (err, res) => {
//   if (err) {
//     console.error('Database connection error:', err);
//   } else {
//     console.log('Database connected successfully');
//   }
// });

// app.get('/health', (req, res) => {
//   res.json({ status: 'ok', message: 'Server is running' });
// });

// app.get('/events', async (req, res) => {
//   try {
//     const result = await pool.query(
//       'SELECT * FROM events ORDER BY start_time DESC'
//     );
//     res.json(result.rows);
//   } catch (error) {
//     console.error('Error fetching events:', error);
//     res.status(500).json({ error: 'Failed to fetch events' });
//   }
// });

// app.get('/events/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await pool.query(
//       'SELECT * FROM events WHERE id = $1',
//       [id]
//     );
    
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Event not found' });
//     }
    
//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error('Error fetching event:', error);
//     res.status(500).json({ error: 'Failed to fetch event' });
//   }
// });

// app.post('/events', async (req, res) => {
//   try {
//     const { title, description, start_time, end_time, location, price, image_url, created_by } = req.body;
    
//     const result = await pool.query(
//       `INSERT INTO events (title, description, start_time, end_time, location, price, image_url, created_by)
//        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
//        RETURNING *`,
//       [title, description, start_time, end_time, location, price, image_url, created_by]
//     );
    
//     res.status(201).json(result.rows[0]);
//   } catch (error) {
//     console.error('Error creating event:', error);
//     res.status(500).json({ error: 'Failed to create event' });
//   }
// });

// app.put('/events/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, description, start_time, end_time, location, price, image_url } = req.body;
    
//     const result = await pool.query(
//       `UPDATE events 
//        SET title = $1, 
//            description = $2, 
//            start_time = $3, 
//            end_time = $4, 
//            location = $5, 
//            price = $6, 
//            image_url = $7,
//            updated_at = CURRENT_TIMESTAMP
//        WHERE id = $8
//        RETURNING *`,
//       [title, description, start_time, end_time, location, price, image_url, id]
//     );
    
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Event not found' });
//     }
    
//     res.json(result.rows[0]);res.json(result.rows[0]);
//   } catch (error) {
//     console.error('Error updating event:', error);
//     res.status(500).json({ error: 'Failed to update event' });atus(500).json({ error: 'Failed to update event' });
//   }
// });

// app.delete('/events/:id', async (req, res) => {elete('/events/:id', async (req, res) => {
//   try {y {
//     const { id } = req.params;
    
//     const result = await pool.query(
//       'DELETE FROM events WHERE id = $1 RETURNING *',
//       [id]   [id]
//     ); );
        
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Event not found' });t found' });
//     }
    
//     res.json({ message: 'Event deleted successfully', event: result.rows[0] });leted successfully', event: result.rows[0] });
//   } catch (error) {catch (error) {
//     console.error('Error deleting event:', error);eting event:', error);
//     res.status(500).json({ error: 'Failed to delete event' });
//   }
// });

// app.post('/events/:id/signup', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { user_id } = req.body; } = req.body;
    
//     res.json({ message: 'Successfully signed up for event' }); res.json({ message: 'Successfully signed up for event' });
//   } catch (error) {  } catch (error) {
//     console.error('Error signing up for event:', error);or('Error signing up for event:', error);
//     res.status(500).json({ error: 'Failed to sign up for event' });'Failed to sign up for event' });
//   }
// });

// app.listen(PORT, () => {, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`); running on http://localhost:${PORT}`);
// });

// module.exports = app;