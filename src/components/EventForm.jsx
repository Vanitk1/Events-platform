import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { searchImages } from '../services/unsplashApi';
import api from '../services/api';
import '../styles/EventForm.css';

function EventForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    location: '',
    price: '0'
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [suggestedImages, setSuggestedImages] = useState([]);
  const [selectedUnsplashImage, setSelectedUnsplashImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageSource, setImageSource] = useState('upload');

  const fetchEventData = useCallback(async () => {
    try {
      const event = await api.getById(id);
      
      const startDateTime = new Date(event.start_time);
      const endDateTime = new Date(event.end_time);
      
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      const formatTime = (date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
      };
      
      setFormData({
        title: event.title,
        description: event.description,
        start_date: formatDate(startDateTime),
        start_time: formatTime(startDateTime),
        end_date: formatDate(endDateTime),
        end_time: formatTime(endDateTime),
        location: event.location,
        price: event.price
      });
      
      if (event.image_url) {
        setImagePreview(event.image_url);
        setSelectedUnsplashImage({ urls: { regular: event.image_url } });
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      alert('Failed to load event data');
      navigate('/my-events');
    }
  }, [id, navigate]);

  useEffect(() => {
    if (isEditMode) {
      fetchEventData();
    }
  }, [isEditMode, fetchEventData]);

  useEffect(() => {
    const fetchImages = async () => {
      if (formData.title.length > 2 && imageSource === 'unsplash') {
        try {
          const images = await searchImages(formData.title);
          setSuggestedImages(images);
        } catch (error) {
          console.error('Error fetching images:', error);
        }
      }
    };

    const timeoutId = setTimeout(fetchImages, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.title, imageSource]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSelect = (image) => {
    if (selectedUnsplashImage?.id === image.id) {
      setSelectedUnsplashImage(null);
      setImagePreview(null);
      console.log('Image unselected');
    } else {
      setSelectedUnsplashImage(image);
      setImagePreview(image.urls.regular);
      setImageFile(null);
      console.log('Image selected:', image);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setSelectedUnsplashImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('You must be logged in to ' + (isEditMode ? 'edit' : 'create') + ' events');
        navigate('/');
        return;
      }

      const startDateTime = `${formData.start_date}T${formData.start_time}`;
      const endDateTime = `${formData.end_date}T${formData.end_time}`;

      let imageUrl = imagePreview;

      if (imageSource === 'upload' && imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `events/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('event-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      } else if (imageSource === 'unsplash' && selectedUnsplashImage) {
        imageUrl = selectedUnsplashImage.urls.regular;
      }

      const eventData = {
        title: formData.title,
        description: formData.description,
        start_time: startDateTime,
        end_time: endDateTime,
        location: formData.location,
        price: formData.price,
        image_url: imageUrl
      };

      if (isEditMode) {
        await api.update(id, eventData);
        navigate('/my-events');
      } else {
        await api.create({ ...eventData, created_by: user.id });
        navigate('/events');
      }
      
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to ' + (isEditMode ? 'update' : 'create') + ' event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-form-container">
      <h1>{isEditMode ? 'Edit Event' : 'Create New Event'}</h1>
      
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label htmlFor="title">Event Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Community Yoga Session, Dance class etc."
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Describe your event..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="start_date">Start Date *</label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="start_time">Start Time *</label>
            <input
              type="time"
              id="start_time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="end_date">End Date *</label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="end_time">End Time *</label>
            <input
              type="time"
              id="end_time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="location">Location *</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="Leisure Centre, Gunnersbury Park etc."
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price (£) *</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            placeholder="£0.00 for free events"
          />
        </div>

        <div className="form-group">
          <label>Event Image</label>
          
          <div className="image-source-toggle" role="group" aria-label="Choose image source">
            <button
              type="button"
              className={imageSource === 'upload' ? 'active' : ''}
              onClick={() => setImageSource('upload')}
              aria-label="Upload custom image from your device"
              aria-pressed={imageSource === 'upload'}
            >
              📤 Upload Image
            </button>
            <button
              type="button"
              className={imageSource === 'unsplash' ? 'active' : ''}
              onClick={() => setImageSource('unsplash')}
              aria-label="Choose image from Unsplash library"
              aria-pressed={imageSource === 'unsplash'}
            >
              🖼️ Choose from Unsplash
            </button>
          </div>

          {imageSource === 'upload' ? (
            <div className="upload-section">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
              {imageFile && (
                <p className="file-name">✅ Selected: {imageFile.name}</p>
              )}
            </div>
          ) : (
            <div className="unsplash-section">
              {suggestedImages.length > 0 ? (
                <div className="suggested-images">
                  <p className="suggestion-label">
                    💡 Suggested images for "{formData.title}":
                  </p>
                  <div className="image-grid" role="list" aria-label="Available images from Unsplash">
                    {suggestedImages.map((image) => (
                      <div
                        key={image.id}
                        className={`image-wrapper ${selectedUnsplashImage?.id === image.id ? 'selected' : ''}`}
                        onClick={() => handleImageSelect(image)}
                        role="listitem"
                        tabIndex={0}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleImageSelect(image);
                          }
                        }}
                        aria-label={`${image.alt_description || 'Unsplash image'}. ${selectedUnsplashImage?.id === image.id ? 'Currently selected' : 'Click to select'}`}
                        aria-selected={selectedUnsplashImage?.id === image.id}
                      >
                        <img
                          src={image.urls.small}
                          alt={image.alt_description || 'Unsplash image'}
                          className="suggested-image"
                        />
                        {selectedUnsplashImage?.id === image.id && (
                          <div className="selected-badge" aria-hidden="true">✓</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="photo-credit">
                    📸 Photos by{' '}
                    <a 
                      href="https://unsplash.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Unsplash
                    </a>
                  </p>
                </div>
              ) : (
                <p className="no-images">
                  {formData.title.length > 0 
                    ? '⏳ Loading images...' 
                    : 'ℹ️ Type a title to see image suggestions'}
                </p>
              )}
            </div>
          )}

          {imagePreview && (
            <div className="image-preview">
              <p className="preview-label">Preview:</p>
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(isEditMode ? '/my-events' : '/events')}
            className="btn-cancel"
            aria-label="Cancel and go back"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-submit"
            aria-label={
              loading 
                ? (isEditMode ? 'Updating event, please wait' : 'Creating event, please wait')
                : (isEditMode ? 'Update this event' : 'Create new event')
            }
            aria-disabled={loading}
          >
            {loading 
              ? (isEditMode ? 'Updating...' : 'Creating...') 
              : (isEditMode ? 'Update Event' : 'Create Event')
            }
          </button>
        </div>
      </form>
    </div>
  );
}

export default EventForm;