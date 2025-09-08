import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Typography,
  Card,
  CardMedia,
  CardActions,
  TextField,
  Alert,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogContent,
  DialogTitle,
  Chip,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Add,
  Image as ImageIcon,
  Visibility,
  Close,
} from '@mui/icons-material';

interface ImageGalleryUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const ImageGalleryUpload: React.FC<ImageGalleryUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 10,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleAddImageUrl = () => {
    if (!imageUrl.trim()) {
      setError('Please enter an image URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(imageUrl);
    } catch (e) {
      setError('Please enter a valid URL');
      return;
    }

    if (images.length >= maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    onImagesChange([...images, imageUrl]);
    setImageUrl('');
    setError(null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newImages: string[] = [];
      
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setError(`${file.name} is not an image file`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError(`${file.name} is too large (max 5MB)`);
          continue;
        }

        // Convert to base64 for demo purposes
        // In production, you would upload to a server or cloud storage
        const base64 = await convertToBase64(file);
        newImages.push(base64);
      }

      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages]);
      }
    } catch (err) {
      setError('Failed to upload images');
    } finally {
      setLoading(false);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= images.length) return;
    
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    onImagesChange(newImages);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Restaurant Gallery
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Add up to {maxImages} images for your restaurant gallery
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Upload Controls */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          component="label"
          startIcon={loading ? <CircularProgress size={20} /> : <CloudUpload />}
          disabled={loading || images.length >= maxImages}
        >
          Upload Images
          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={handleFileUpload}
          />
        </Button>

        <Box sx={{ display: 'flex', gap: 1, flexGrow: 1, maxWidth: 500 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Or paste image URL here..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddImageUrl();
              }
            }}
            disabled={images.length >= maxImages}
          />
          <Button
            variant="outlined"
            onClick={handleAddImageUrl}
            disabled={images.length >= maxImages}
            startIcon={<Add />}
          >
            Add
          </Button>
        </Box>
      </Box>

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
          <ImageIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            No images uploaded yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload images or add URLs to create your gallery
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {images.map((image, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
              <Card sx={{ position: 'relative', height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={image}
                  alt={`Gallery image ${index + 1}`}
                  sx={{ objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => setPreviewImage(image)}
                />
                <CardActions sx={{ justifyContent: 'space-between', p: 1 }}>
                  <Box>
                    {index === 0 && (
                      <Chip
                        label="Main"
                        size="small"
                        color="primary"
                        sx={{ mr: 1 }}
                      />
                    )}
                    <Typography variant="caption" color="text.secondary">
                      Image {index + 1}
                    </Typography>
                  </Box>
                  <Box>
                    <Tooltip title="View">
                      <IconButton
                        size="small"
                        onClick={() => setPreviewImage(image)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {index > 0 && (
                      <Tooltip title="Move up">
                        <IconButton
                          size="small"
                          onClick={() => handleMoveImage(index, 'up')}
                        >
                          ↑
                        </IconButton>
                      </Tooltip>
                    )}
                    {index < images.length - 1 && (
                      <Tooltip title="Move down">
                        <IconButton
                          size="small"
                          onClick={() => handleMoveImage(index, 'down')}
                        >
                          ↓
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Remove">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Image count indicator */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {images.length} / {maxImages} images
        </Typography>
      </Box>

      {/* Preview Dialog */}
      <Dialog
        open={!!previewImage}
        onClose={() => setPreviewImage(null)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Image Preview</Typography>
            <IconButton onClick={() => setPreviewImage(null)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {previewImage && (
            <Box sx={{ textAlign: 'center' }}>
              <img
                src={previewImage}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                }}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ImageGalleryUpload;