# How to Add Images to the Front Page

## 📁 Where to Put Your Images

**Location**: `frontend/public/images/`

You can organize them in folders like this:
```
frontend/public/images/
├── habitats/          (for exhibit images)
│   ├── savanna.jpg
│   ├── aquatic.jpg
│   └── rainforest.jpg
├── events/           (for event images)
│   ├── dolphin-show.jpg
│   ├── penguin-feeding.jpg
│   └── giraffe-feeding.jpg
└── backgrounds/      (for hero background)
    └── zoo-hero.jpg
```

## 📝 Which File to Edit

**File**: `frontend/src/app/page.tsx`

## 🖼️ How to Add Images

### 1. Featured Exhibits (Habitat Cards)

**Current code** (around line 133):
```tsx
<img
  src={`/images/pexels-gary-whyte-228069-730537.jpg`}
  alt={habitat.habitat_name}
  loading="lazy"
  className="h-44 w-full object-cover"
/>
```

**To use different images per habitat**, you can change it to:
```tsx
<img
  src={`/images/habitats/${habitat.habitat_name.toLowerCase().replace(/\s+/g, '-')}.jpg`}
  alt={habitat.habitat_name}
  loading="lazy"
  className="h-44 w-full object-cover"
  onError={(e) => {
    // Fallback if image doesn't exist
    e.currentTarget.src = '/images/habitats/default.jpg';
  }}
/>
```

**OR** use a simple mapping:
```tsx
const getHabitatImage = (habitat: Habitat) => {
  const imageMap: Record<string, string> = {
    'African Savanna': '/images/habitats/savanna.jpg',
    'Tropical Rainforest': '/images/habitats/rainforest.jpg',
    'Aquatic Center': '/images/habitats/aquatic.jpg',
  };
  return imageMap[habitat.habitat_name] || '/images/habitats/default.jpg';
};

// Then in the img tag:
<img
  src={getHabitatImage(habitat)}
  alt={habitat.habitat_name}
  loading="lazy"
  className="h-44 w-full object-cover"
/>
```

### 2. Upcoming Events (Event Cards)

**Current code** (around line 232):
```tsx
<img
  src={`/images/events/giraffe-feeding.jpg`}
  alt={event.event_name}
  loading="lazy"
  className="h-44 w-full object-cover"
/>
```

**To use different images per event**, change it to:
```tsx
const getEventImage = (event: Event) => {
  const imageMap: Record<string, string> = {
    'Dolphin Show': '/images/events/dolphin-show.jpg',
    'Penguin Feeding Time': '/images/events/penguin-feeding.jpg',
    'Lion Encounter': '/images/events/lion-encounter.jpg',
  };
  return imageMap[event.event_name] || '/images/events/default.jpg';
};

// Then in the img tag:
<img
  src={getEventImage(event)}
  alt={event.event_name}
  loading="lazy"
  className="h-44 w-full object-cover"
  onError={(e) => {
    e.currentTarget.src = '/images/events/default.jpg';
  }}
/>
```

### 3. Hero Section Background (ZooVerse Stats)

**Current code** (around line 46):
```tsx
<div className="absolute inset-0 -z-10 bg-gradient-to-br
              from-dark_spring_green-500 via-sea_green-400 to-dark_spring_green-600 rounded-3xl" />
```

**To add a background image**, change it to:
```tsx
{/* Background image */}
<div 
  className="absolute inset-0 -z-10 rounded-3xl bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: 'url(/images/backgrounds/zoo-hero.jpg)',
  }}
/>
{/* Dark overlay for text readability */}
<div className="absolute inset-0 -z-10 bg-gradient-to-br
              from-dark_spring_green-900/80 via-sea_green-800/70 to-dark_spring_green-900/80 rounded-3xl" />
{/* Color overlay to maintain color scheme */}
<div className="absolute inset-0 -z-10 bg-gradient-to-br
              from-dark_spring_green-500/60 via-sea_green-400/50 to-dark_spring_green-600/60 rounded-3xl" />
```

## 🎯 Quick Steps

1. **Add your images** to `frontend/public/images/` (create subfolders if needed)
2. **Open** `frontend/src/app/page.tsx`
3. **Find the image tags** (around lines 133 and 232)
4. **Update the `src` attribute** to point to your image path
5. **Save** and refresh your browser

## 💡 Tips

- Image paths start with `/images/` (not `/public/images/`)
- Use JPG or PNG format
- Recommended size: 800x600px for cards, 1920x1080px for backgrounds
- Keep file names lowercase with hyphens (e.g., `dolphin-show.jpg`)
- Add `onError` handlers to show fallback images if files are missing

