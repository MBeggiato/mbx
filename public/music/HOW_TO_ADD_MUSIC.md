# How to Add Music to Your Music Player Pro

## Adding Music Files (Source Code Method)

1. Place your music files in the `public/music/` folder
2. Edit the `sampleTracks` array in `components/apps/MusicPlayerAppPro.tsx`
3. Add your tracks following this format:

```javascript
const sampleTracks = [
  {
    id: 1,
    title: "Your Song Title",
    artist: "Artist Name",
    duration: "0:00", // Will be auto-detected
    cover: "https://example.com/album-cover.jpg", // URL to album cover image
    url: "/music/your-song.mp3", // Path to your file
    artistUrl: "https://artist-website.com", // Optional: Link to artist's page
  },
  // Add more tracks...
];
```

## Example Configuration

```javascript
const sampleTracks = [
  {
    id: 1,
    title: "Bohemian Rhapsody",
    artist: "Queen",
    duration: "5:55",
    cover: "https://example.com/queen-bohemian-rhapsody.jpg",
    url: "/music/bohemian-rhapsody.mp3",
    artistUrl: "https://www.queen.com", // Optional artist website
  },
  {
    id: 2,
    title: "Hotel California",
    artist: "Eagles",
    duration: "6:30",
    cover: "https://example.com/eagles-hotel-california.jpg",
    url: "/music/hotel-california.mp3",
    artistUrl: "https://www.eagles.com", // Optional artist website
  },
  {
    id: 3,
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    duration: "8:02",
    cover: "https://example.com/led-zeppelin-iv.jpg",
    url: "/music/stairway-to-heaven.mp3",
    artistUrl: "https://www.ledzeppelin.com", // Optional artist website
  },
];
```

## Supported File Formats

- **MP3** (.mp3) - Most common, good compression
- **WAV** (.wav) - Uncompressed, high quality
- **OGG** (.ogg) - Open source format
- **M4A** (.m4a) - Apple's audio format
- **FLAC** (.flac) - Lossless compression (if browser supports)

## Album Cover Images

The music player displays album cover images from URLs specified in the `cover` field:

- **Image Loading**: Images are loaded dynamically with loading indicators
- **Error Handling**: Falls back to music note icon if image fails to load
- **Supported Formats**: JPG, PNG, GIF, WebP, SVG
- **Recommended Size**: 300x300 pixels or larger (square aspect ratio)
- **Display Locations**:
  - Large album art (264x264px) in the main player
  - Small thumbnails (40x40px) in the playlist

### Cover Image Sources

- **Album Art APIs**: Last.fm, Discogs, MusicBrainz
- **Streaming Services**: Spotify Web API (for metadata)
- **Image Hosting**: Imgur, Pixabay, Unsplash
- **Local Files**: Place in `public/covers/` and use `/covers/image.jpg`

### Example Cover URLs

```javascript
cover: "https://cdn.pixabay.com/audio/2022/05/27/23-51-43-941_200x200.jpg", // Pixabay
cover: "https://i.imgur.com/example.jpg", // Imgur
cover: "/covers/my-album.jpg", // Local file in public/covers/
```

## Music Player Features

The music player includes several advanced features for a great listening experience:

### Auto-Play & Queue Management

- **Auto-Play Next**: When a song ends, the next track automatically starts playing
- **Seamless Transitions**: No interruption between tracks when auto-playing
- **Smart Queue**: Tracks play in order or randomly based on shuffle mode

### Shuffle & Repeat Modes

- **Smart Shuffle**: Avoids repeating recently played tracks until all have been heard
- **Shuffle History**: Tracks the last played songs to prevent immediate repeats
- **Repeat Mode**: Loop the current track indefinitely
- **Visual Indicators**: Buttons highlight when modes are active

### Persistent Settings

- **Volume Memory**: Your volume setting is saved in browser localStorage
- **Track Position**: Current track and playback position are automatically saved
- **Auto-Resume**: Checkbox setting to control automatic restoration of tracks
- **Session Continuity**: Resume exactly where you left off between visits
- **Smart Restoration**: Only restores position if auto-resume setting is enabled
- **Safe Storage**: All settings persist across browser sessions

### User Interface

- **Loading States**: Visual feedback while tracks and images load
- **Error Handling**: Graceful fallbacks when files can't be loaded
- **Responsive Design**: Works well on different screen sizes
- **Tooltips**: Hover hints for control buttons

## Artist URL Feature

You can add optional clickable links to artist pages by including the `artistUrl` field:

- Artist names become clickable links when `artistUrl` is provided
- Links open in a new tab and are safe (using `noopener noreferrer`)
- Perfect for linking to artist websites, Spotify profiles, social media, etc.
- If no `artistUrl` is provided, artist name displays as regular text

Example artist URL destinations:

- Official websites: `https://artist-website.com`
- Spotify: `https://open.spotify.com/artist/[artist-id]`
- YouTube: `https://youtube.com/@artist-channel`
- Social media: `https://instagram.com/artist-handle`

## File Organization Tips

- Keep file names simple (no special characters)
- Use consistent naming: "Artist - Song Title.mp3"
- Consider file sizes (MP3 is smaller than WAV)
- Organize in subfolders if you have many files

## Recommended Music Sources (Free/Legal)

- **Free Music Archive**: https://freemusicarchive.org/
- **Incompetech**: https://incompetech.com/
- **YouTube Audio Library**: https://studio.youtube.com/channel/UCmMnXMFdGJ_B51-jYlFWO1w/music
- **Freesound**: https://freesound.org/
- **Pixabay Music**: https://pixabay.com/music/

## Troubleshooting

- If a song doesn't play, check the file path
- Make sure files are in supported formats
- Check browser console for error messages
- Ensure files aren't corrupted

Enjoy your music! 🎵
