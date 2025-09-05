// Configuration - Replace with your GitHub username
const GITHUB_USERNAME = 'hsvillanueva'; // Replace this with your actual GitHub username

// DOM elements
const projectsContainer = document.getElementById('projects-container');

// Fetch GitHub repositories
async function fetchGitHubProjects() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const repos = await response.json();
        
        // Filter out forked repositories and empty repos (optional)
        const filteredRepos = repos.filter(repo => !repo.fork && repo.description);
        
        displayProjects(filteredRepos);
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        displayError();
    }
}

// Display projects in the grid
function displayProjects(projects) {
    if (projects.length === 0) {
        projectsContainer.innerHTML = `
            <div class="error">
                <h3>No projects found</h3>
                <p>Please check your GitHub username in the script.js file</p>
            </div>
        `;
        return;
    }

    projectsContainer.innerHTML = projects.map(project => `
        <div class="project-card">
            <div class="project-header">
                <h3 class="project-title">${project.name}</h3>
                <p class="project-description">${project.description || 'No description available'}</p>
            </div>
            <div class="project-content">
                <div class="project-stats">
                    <div class="stat">
                        <i class="fas fa-star"></i>
                        <span>${project.stargazers_count}</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-code-branch"></i>
                        <span>${project.forks_count}</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-circle"></i>
                        <span>${project.language || 'N/A'}</span>
                    </div>
                </div>
                
                ${project.topics && project.topics.length > 0 ? `
                    <div class="project-topics">
                        ${project.topics.map(topic => `<span class="topic">${topic}</span>`).join('')}
                    </div>
                ` : ''}
                
                <div class="project-links">
                    <a href="${project.html_url}" target="_blank" class="project-link repo-link">
                        <i class="fab fa-github"></i>
                        <span>View Code</span>
                    </a>
                    ${project.homepage ? `
                        <a href="${project.homepage}" target="_blank" class="project-link demo-link">
                            <i class="fas fa-external-link-alt"></i>
                            <span>Live Demo</span>
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Display error message
function displayError() {
    projectsContainer.innerHTML = `
        <div class="error">
            <h3>Oops! Something went wrong</h3>
            <p>Unable to fetch projects from GitHub. Please check:</p>
            <ul style="text-align: left; margin-top: 10px;">
                <li>Your internet connection</li>
                <li>The GitHub username in script.js</li>
                <li>GitHub API rate limits</li>
            </ul>
        </div>
    `;
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Simple header background change on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.background = '#0d1117';
    } else {
        header.style.background = '#161b22';
    }
});

// Observe project cards for animations
document.addEventListener('DOMContentLoaded', () => {
    // Fetch projects when page loads
    fetchGitHubProjects();
});

// Simple function to update personal information
function updatePersonalInfo() {
    // You can customize these values
    const personalInfo = {
        name: "Hannah Villanueva",
        title: "Developer in Progress",
        description: "I am Hannah Sophia L. Villanueva, a 3rd year BS Computer Science student at Caraga State University - Main Campus. I specialize in Python programming and designing UX/UI interfaces for websites. Currently learning frameworks like React, Django and Flask to enhance my web development skills.",
        email: "hslvillanueva@gmail.com",
        linkedin: "https://www.linkedin.com/in/hannahsophiavillanueva/",
        github: `https://github.com/hsvillanueva`
    };
    
    // Update the page content
    document.querySelector('.hero-content h1').textContent = `> ${personalInfo.name}`;
    document.querySelector('.hero-content p').textContent = personalInfo.title;
    document.querySelector('.about p').textContent = personalInfo.description;
    
    // Update social links
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks[0].href = personalInfo.github; // GitHub
    socialLinks[1].href = personalInfo.linkedin; // LinkedIn
    socialLinks[2].href = `mailto:${personalInfo.email}`; // Email
}

// Call the function to update personal info when page loads
document.addEventListener('DOMContentLoaded', () => {
    updatePersonalInfo();
    
    // Handle profile photo error (if image doesn't exist)
    const profileImg = document.getElementById('profile-img');
    profileImg.addEventListener('error', function() {
        // Create a placeholder if image doesn't exist
        this.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.className = 'profile-placeholder';
        placeholder.innerHTML = '<i class="fas fa-user"></i>';
        this.parentNode.appendChild(placeholder);
    });
});
