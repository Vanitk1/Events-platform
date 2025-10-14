import { supabase } from './supabase';

const api = {
  async getAll() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
    return data;
  },

  async create(eventData) {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();

    if (error) {
      console.error('Error creating event:', error);
      throw error;
    }
    return data;
  },

  async update(id, eventData) {
    console.log('api.update called with:', { id, eventData });
    
    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating event:', error);
      throw error;
    }
    
    console.log('Successfully updated event:', data);
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
    
    return { success: true };
  },

  async signup(eventId) { 
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('Must be logged in to sign up');

    const { data, error } = await supabase
      .from('event_signups')
      .insert([{ event_id: eventId, user_id: user.id }])
      .select()
      .single();

    if (error) {
      console.error('Error signing up for event:', error);
      throw error;
    }
    
    return data;
  }
};

export default api;