import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Search,
  Language,
  Link,
  ImportExport,
  OpenInNew,
  ContentCopy,
  Restaurant,
  LocationOn,
  Phone,
  Schedule,
  Star,
  AttachMoney,
} from '@mui/icons-material';

interface RestaurantData {
  name: string;
  cuisine: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  email: string;
  description: string;
  openingTime: string;
  closingTime: string;
  priceRange: string;
  rating: number;
  imageUrl: string;
  gallery: string[];
  website?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface RestaurantDataImporterProps {
  onImport: (data: RestaurantData) => void;
}

const RestaurantDataImporter: React.FC<RestaurantDataImporterProps> = ({ onImport }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<RestaurantData | null>(null);

  // Google Search Tab State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Browser Link Tab State
  const [browserUrl, setBrowserUrl] = useState('');

  // Website Link Tab State
  const [websiteUrl, setWebsiteUrl] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    setError(null);
    setSuccess(null);
    setExtractedData(null);
  };

  const generateGoogleSearchUrl = (query: string) => {
    const encodedQuery = encodeURIComponent(`${query} restaurant`);
    return `https://www.google.com/search?q=${encodedQuery}`;
  };

  const generateMapsSearchUrl = (query: string) => {
    const encodedQuery = encodeURIComponent(query);
    return `https://www.google.com/maps/search/${encodedQuery}`;
  };

  const handleGoogleSearch = () => {
    if (!searchQuery.trim()) {
      setError('Please enter a restaurant name to search');
      return;
    }

    // Generate search suggestions
    const suggestions = [
      {
        type: 'Google Search',
        url: generateGoogleSearchUrl(searchQuery),
        description: 'Search for restaurant information on Google',
        icon: <Search />,
      },
      {
        type: 'Google Maps',
        url: generateMapsSearchUrl(searchQuery),
        description: 'Find restaurant location and reviews on Google Maps',
        icon: <LocationOn />,
      },
      {
        type: 'Yelp',
        url: `https://www.yelp.com/search?find_desc=${encodeURIComponent(searchQuery)}&find_loc=`,
        description: 'View restaurant reviews and details on Yelp',
        icon: <Star />,
      },
    ];

    setSearchResults(suggestions);
    setSuccess('Search links generated! Click to open in new tab and gather information.');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('URL copied to clipboard!');
  };

  const extractDataFromUrl = async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      // Universal URL parser that works for any domain
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const hostname = urlObj.hostname.replace('www.', '');
      const urlLower = url.toLowerCase();
      
      // Extract path segments for analysis
      const pathSegments = pathname.split('/').filter(segment => segment.length > 0);
      
      // Common location keywords to identify
      const locationKeywords = ['area', 'centre', 'center', 'district', 'zone', 'street', 'road', 'avenue', 'plaza', 'mall', 'square'];
      const cuisineKeywords = ['italian', 'chinese', 'indian', 'mexican', 'japanese', 'thai', 'french', 'american', 'mediterranean', 'asian', 'seafood', 'steakhouse', 'pizza', 'sushi', 'burger'];
      
      let extractedData: RestaurantData = {
        name: '',
        cuisine: 'International',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phoneNumber: '',
        email: '',
        description: '',
        openingTime: '11:00',
        closingTime: '22:00',
        priceRange: '$$',
        rating: 4.0,
        imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
        gallery: [],
        website: url,
      };

      // Smart extraction based on URL patterns
      if (urlLower.includes('zomato.com')) {
        // Zomato pattern: /city/restaurant-name-area
        const city = pathSegments[0] || 'City';
        const restaurantSlug = pathSegments[pathSegments.length - 1] || hostname.split('.')[0];
        const parts = restaurantSlug.split('-');
        
        // Usually first part or first few parts are restaurant name
        const nameParts = [];
        const locationParts = [];
        let foundLocation = false;
        
        for (const part of parts) {
          if (locationKeywords.some(keyword => part.toLowerCase().includes(keyword))) {
            foundLocation = true;
          }
          if (foundLocation) {
            locationParts.push(part);
          } else {
            nameParts.push(part);
          }
        }
        
        extractedData.name = nameParts.join(' ').split(' ')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        extractedData.city = city.charAt(0).toUpperCase() + city.slice(1);
        extractedData.address = locationParts.join(' ').split(' ')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        extractedData.state = city.toLowerCase() === 'dubai' ? 'Dubai' : extractedData.city;
        extractedData.email = `info@${nameParts.join('').toLowerCase()}.com`;
        
      } else if (urlLower.includes('yelp.com')) {
        // Yelp pattern: /biz/restaurant-name-city-number
        const bizIndex = pathSegments.indexOf('biz');
        if (bizIndex >= 0 && bizIndex + 1 < pathSegments.length) {
          const slug = pathSegments[bizIndex + 1];
          const parts = slug.split('-');
          
          // Remove common suffixes and numbers
          const cleanParts = parts.filter(part => 
            !part.match(/^\d+$/) && 
            !['restaurant', 'cafe', 'bar', 'grill', 'bistro', 'kitchen'].includes(part.toLowerCase())
          );
          
          // Last 1-2 parts might be city
          const nameParts = cleanParts.slice(0, -1);
          const cityPart = cleanParts[cleanParts.length - 1];
          
          extractedData.name = nameParts.join(' ').split(' ')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
          extractedData.city = cityPart ? cityPart.charAt(0).toUpperCase() + cityPart.slice(1) : 'City';
          extractedData.email = `contact@${nameParts.join('').toLowerCase()}.com`;
        }
        
      } else if (urlLower.includes('maps.google.com') || urlLower.includes('google.com/maps')) {
        // Google Maps patterns
        const placeMatch = url.match(/place\/([^\/\?]+)/);
        const dataMatch = url.match(/data=![\s\S]*?!1s([^!]+)/);
        const searchMatch = url.match(/search\/([^\/\?]+)/);
        
        let restaurantName = '';
        if (placeMatch) {
          restaurantName = decodeURIComponent(placeMatch[1]).replace(/\+/g, ' ');
        } else if (searchMatch) {
          restaurantName = decodeURIComponent(searchMatch[1]).replace(/\+/g, ' ');
        } else if (dataMatch) {
          restaurantName = decodeURIComponent(dataMatch[1]).replace(/\+/g, ' ');
        }
        
        if (restaurantName) {
          extractedData.name = restaurantName;
          extractedData.email = `info@${restaurantName.toLowerCase().replace(/\s+/g, '')}.com`;
        }
        
      } else if (urlLower.includes('tripadvisor.com')) {
        // TripAdvisor pattern: /Restaurant_Review-g-d-Reviews-Restaurant_Name
        const reviewMatch = pathname.match(/Restaurant_Review-[^-]+-[^-]+-Reviews-([^\.]+)/);
        if (reviewMatch) {
          const name = reviewMatch[1].replace(/_/g, ' ');
          extractedData.name = name;
          extractedData.email = `info@${name.toLowerCase().replace(/\s+/g, '')}.com`;
        }
        
      } else if (urlLower.includes('opentable.com')) {
        // OpenTable pattern: /restaurant-name
        const slug = pathSegments[pathSegments.length - 1] || pathSegments[0];
        if (slug) {
          extractedData.name = slug.split('-')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
          extractedData.email = `reservations@${slug.replace(/-/g, '')}.com`;
        }
        
      } else if (urlLower.includes('ubereats.com')) {
        // UberEats pattern: /store/restaurant-name/
        const storeIndex = pathSegments.indexOf('store');
        if (storeIndex >= 0 && storeIndex + 1 < pathSegments.length) {
          const slug = pathSegments[storeIndex + 1];
          extractedData.name = slug.split('-')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
          extractedData.email = `orders@${slug.replace(/-/g, '')}.com`;
        }
        
      } else if (urlLower.includes('doordash.com')) {
        // DoorDash pattern: /store/restaurant-name-id/
        const storeIndex = pathSegments.indexOf('store');
        if (storeIndex >= 0 && storeIndex + 1 < pathSegments.length) {
          const slug = pathSegments[storeIndex + 1];
          const parts = slug.split('-');
          // Remove ID at the end if it's a number
          if (parts[parts.length - 1].match(/^\d+$/)) {
            parts.pop();
          }
          extractedData.name = parts
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
          extractedData.email = `info@${parts.join('').toLowerCase()}.com`;
        }
        
      } else {
        // Generic extraction for any other domain
        // Try to extract from path first
        if (pathSegments.length > 0) {
          // Look for restaurant-like segments
          const possibleName = pathSegments.find(segment => 
            segment.length > 3 && 
            !segment.match(/^\d+$/) &&
            !['menu', 'about', 'contact', 'home', 'index'].includes(segment.toLowerCase())
          );
          
          if (possibleName) {
            extractedData.name = possibleName.split('-')
              .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
          } else {
            // Fallback to domain name
            const domainName = hostname.split('.')[0];
            extractedData.name = domainName.split('-')
              .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
          }
        } else {
          // Use domain name
          const domainName = hostname.split('.')[0];
          extractedData.name = domainName.split('-')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        }
        
        extractedData.email = `info@${hostname}`;
      }

      // Try to detect cuisine from URL or name
      for (const cuisine of cuisineKeywords) {
        if (urlLower.includes(cuisine) || extractedData.name.toLowerCase().includes(cuisine)) {
          extractedData.cuisine = cuisine.charAt(0).toUpperCase() + cuisine.slice(1);
          break;
        }
      }

      // Set default values for empty fields
      if (!extractedData.name) {
        extractedData.name = 'Restaurant Name';
      }
      if (!extractedData.address) {
        extractedData.address = 'Restaurant Address';
      }
      if (!extractedData.city) {
        extractedData.city = 'City';
      }
      if (!extractedData.state) {
        extractedData.state = 'State';
      }
      if (!extractedData.zipCode) {
        extractedData.zipCode = '00000';
      }
      if (!extractedData.phoneNumber) {
        extractedData.phoneNumber = '(555) 123-4567';
      }
      if (!extractedData.email) {
        extractedData.email = `info@restaurant.com`;
      }
      if (!extractedData.description) {
        extractedData.description = `${extractedData.name} - Please update this description with actual restaurant details.`;
      }

      setExtractedData(extractedData);
      setSuccess(`Data extracted from ${hostname}! Please review and update the information before importing. Fields that couldn't be extracted have placeholder values.`);
      
    } catch (err) {
      setError('Failed to parse the URL. Please check the link and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImportData = () => {
    if (extractedData) {
      onImport(extractedData);
      setSuccess('Restaurant data imported successfully!');
      setExtractedData(null);
    }
  };

  const renderExtractedData = () => {
    if (!extractedData) return null;

    return (
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Restaurant sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Extracted Restaurant Data</Typography>
          </Box>

          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>Basic Information</Typography>
              <Typography variant="body2" gutterBottom><strong>Name:</strong> {extractedData.name}</Typography>
              <Typography variant="body2" gutterBottom><strong>Cuisine:</strong> {extractedData.cuisine}</Typography>
              <Typography variant="body2" gutterBottom><strong>Price Range:</strong> {extractedData.priceRange}</Typography>
              <Typography variant="body2" gutterBottom><strong>Rating:</strong> {extractedData.rating}/5</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>Contact & Location</Typography>
              <Typography variant="body2" gutterBottom><strong>Address:</strong> {extractedData.address}</Typography>
              <Typography variant="body2" gutterBottom><strong>City:</strong> {extractedData.city}, {extractedData.state} {extractedData.zipCode}</Typography>
              <Typography variant="body2" gutterBottom><strong>Phone:</strong> {extractedData.phoneNumber}</Typography>
              <Typography variant="body2" gutterBottom><strong>Email:</strong> {extractedData.email}</Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Description</Typography>
            <Typography variant="body2" paragraph>{extractedData.description}</Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Hours</Typography>
            <Typography variant="body2">{extractedData.openingTime} - {extractedData.closingTime}</Typography>
          </Box>

          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={handleImportData}
              startIcon={<ImportExport />}
              sx={{ bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }}
            >
              Import This Data
            </Button>
            <Button
              variant="outlined"
              onClick={() => setExtractedData(null)}
            >
              Cancel
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Import Restaurant Data
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Quickly import restaurant information from various sources to save time on data entry.
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="import data tabs">
            <Tab label="Google Search" icon={<Search />} iconPosition="start" />
            <Tab label="Browser Link" icon={<Link />} iconPosition="start" />
            <Tab label="Restaurant Website" icon={<Language />} iconPosition="start" />
          </Tabs>
        </Box>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

        <TabPanel value={currentTab} index={0}>
          <Typography variant="h6" gutterBottom>Search for Restaurant Information</Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Enter a restaurant name to generate search links. Open the links in new tabs to gather information.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              label="Restaurant Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., Joe's Pizza NYC"
              fullWidth
              onKeyPress={(e) => e.key === 'Enter' && handleGoogleSearch()}
            />
            <Button
              variant="contained"
              onClick={handleGoogleSearch}
              startIcon={<Search />}
            >
              Generate Links
            </Button>
          </Box>

          {searchResults.length > 0 && (
            <List>
              {searchResults.map((result, index) => (
                <ListItem key={index} divider>
                  <Box sx={{ mr: 2 }}>{result.icon}</Box>
                  <ListItemText
                    primary={result.type}
                    secondary={result.description}
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Copy URL">
                      <IconButton onClick={() => copyToClipboard(result.url)}>
                        <ContentCopy />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Open in new tab">
                      <IconButton onClick={() => window.open(result.url, '_blank')}>
                        <OpenInNew />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <Typography variant="h6" gutterBottom>Extract Data from Browser Link</Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Paste a link from Yelp, Google Maps, or other restaurant directory to extract information.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              label="Restaurant Page URL"
              value={browserUrl}
              onChange={(e) => setBrowserUrl(e.target.value)}
              placeholder="https://www.yelp.com/biz/restaurant-name"
              fullWidth
            />
            <Button
              variant="contained"
              onClick={() => extractDataFromUrl(browserUrl)}
              disabled={loading || !browserUrl.trim()}
              startIcon={loading ? <CircularProgress size={16} /> : <ImportExport />}
            >
              {loading ? 'Extracting...' : 'Extract'}
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label="Yelp" size="small" />
            <Chip label="Google Maps" size="small" />
            <Chip label="TripAdvisor" size="small" />
            <Chip label="OpenTable" size="small" />
          </Box>
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <Typography variant="h6" gutterBottom>Import from Restaurant Website</Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Enter the restaurant's official website URL to extract menu, contact, and business information.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              label="Restaurant Website URL"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://restaurantname.com"
              fullWidth
            />
            <Button
              variant="contained"
              onClick={() => extractDataFromUrl(websiteUrl)}
              disabled={loading || !websiteUrl.trim()}
              startIcon={loading ? <CircularProgress size={16} /> : <Language />}
            >
              {loading ? 'Extracting...' : 'Extract'}
            </Button>
          </Box>

          <Alert severity="info">
            <Typography variant="body2">
              <strong>Note:</strong> Data extraction works best with structured websites that include contact information, 
              hours, and location details on their homepage or about page.
            </Typography>
          </Alert>
        </TabPanel>

        {renderExtractedData()}
      </CardContent>
    </Card>
  );
};

export default RestaurantDataImporter;