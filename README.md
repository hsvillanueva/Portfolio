# Portfolio Website

A simple, responsive portfolio website to showcase your GitHub projects.

## Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **GitHub Integration**: Automatically fetches and displays your GitHub repositories
- **Modern UI**: Clean, professional design with smooth animations
- **Easy Customization**: Simple configuration to personalize the site

## Setup Instructions

1. **Configure Your GitHub Username**:
   - Open `script.js`
   - Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username:
   ```javascript
   const GITHUB_USERNAME = 'your-actual-username';
   ```

2. **Customize Personal Information**:
   - Update the `personalInfo` object in `script.js` with your details:
     - Name
     - Title/Role
     - Description
     - Email
     - LinkedIn URL

3. **Open the Website**:
   - Simply open `index.html` in your web browser
   - Or use a local server for development

## Project Structure

```
portfolio/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
├── README.md           # This file
└── .github/
    └── copilot-instructions.md
```

## Customization

### Colors and Styling
- Edit `styles.css` to change colors, fonts, and layout
- The main color scheme uses blue tones, but can be easily modified

### Sections
- **Hero**: Introduction and call-to-action
- **About**: Personal description
- **Projects**: GitHub repositories (automatically populated)
- **Contact**: Social media links

### GitHub API
- The site uses GitHub's public API to fetch your repositories
- No authentication required for public repos
- Shows repository name, description, language, stars, and forks
- Includes links to repository and live demo (if available)

## Deployment

### GitHub Pages
1. Push this code to a GitHub repository
2. Go to repository Settings → Pages
3. Select source branch (usually `main`)
4. Your site will be available at `https://yourusername.github.io/repository-name`

### Other Platforms
- **Netlify**: Drag and drop the folder or connect to GitHub
- **Vercel**: Import from GitHub repository
- **GitHub Codespaces**: Use the built-in simple browser

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

Feel free to use this template for your own portfolio!

## Need Help?

- Check that your GitHub username is correct in `script.js`
- Make sure you have public repositories to display
- Open browser developer tools to check for any console errors
"# Portfolio" 
