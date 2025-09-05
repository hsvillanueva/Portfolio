const GITHUB_USERNAME = 'hsvillanueva';
const projectsContainer = document.getElementById('projects-container');

async function fetchGitHubProjects() {
    try {
        const reposResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12&type=all`);
        
        if (!reposResponse.ok) {
            throw new Error(`HTTP error! status: ${reposResponse.status}`);
        }
        
        const repos = await reposResponse.json();
        const orgsResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/orgs`);
        let orgRepos = [];
        
        if (orgsResponse.ok) {
            const orgs = await orgsResponse.json();
            for (const org of orgs.slice(0, 3)) {
                try {
                    const orgReposResponse = await fetch(`https://api.github.com/orgs/${org.login}/repos?sort=updated&per_page=10`);
                    if (orgReposResponse.ok) {
                        const orgReposData = await orgReposResponse.json();
                        const recentOrgRepos = orgReposData.filter(repo => 
                            repo.description && 
                            new Date(repo.updated_at) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
                        );
                        orgRepos.push(...recentOrgRepos);
                    }
                } catch (error) {
                    console.log(`Could not fetch repos for org ${org.login}:`, error);
                }
            }
        }
        let searchContributions = [];
        try {
            const contributionsResponse = await fetch(`https://api.github.com/search/repositories?q=committer:${GITHUB_USERNAME}+is:public&sort=updated&per_page=6`);
            if (contributionsResponse.ok) {
                const contributionsData = await contributionsResponse.json();
                searchContributions = contributionsData.items || [];
            }
        } catch (error) {
            console.log('Search API failed:', error);
        }
        const allRepos = [...repos, ...orgRepos, ...searchContributions];
        const uniqueRepos = allRepos.filter((repo, index, self) => 
            index === self.findIndex(r => r.id === repo.id)
        );
        
        const processedRepos = uniqueRepos.map(repo => {
            const isOwned = repo.owner.login === GITHUB_USERNAME;
            const isFork = repo.fork;
            const isOrgRepo = !isOwned && !isFork && orgRepos.some(orgRepo => orgRepo.id === repo.id);
            
            return {
                ...repo,
                isExternalContribution: !isOwned && !isFork && !isOrgRepo,
                isOrgContribution: isOrgRepo
            };
        });

        const filteredRepos = processedRepos
            .filter(repo => repo.description)
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        
        displayProjects(filteredRepos);
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        displayError();
    }
}

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

    // Show only first 6 projects initially
    const initialProjects = projects.slice(0, 6);
    const remainingProjects = projects.slice(6);
    
    // Generate HTML for initial projects
    const initialProjectsHTML = initialProjects.map(project => generateProjectHTML(project)).join('');
    
    // Set up the main projects grid with all projects
    const allProjectsHTML = projects.map(project => generateProjectHTML(project)).join('');
    
    projectsContainer.innerHTML = `
        <div class="projects-grid" id="main-projects-grid">
            ${initialProjectsHTML}
        </div>
        <div class="projects-grid" id="additional-projects-grid" style="display: none;">
        </div>
    `;
    
    // Add show more button in a completely separate section if there are more than 6
    if (remainingProjects.length > 0) {
        const additionalProjectsHTML = remainingProjects.map(project => generateProjectHTML(project)).join('');
        
        // Populate the additional projects
        document.getElementById('additional-projects-grid').innerHTML = additionalProjectsHTML;
        
        // Create a separate button section after the projects container
        const buttonSection = document.createElement('div');
        buttonSection.className = 'projects-button-section';
        buttonSection.innerHTML = `
            <button id="show-more-btn" class="show-more-btn">
                <span class="btn-text">Show ${remainingProjects.length} More Projects</span>
                <i class="fas fa-chevron-down btn-icon"></i>
            </button>
        `;
        
        // Insert the button section right after the projects container
        projectsContainer.parentNode.insertBefore(buttonSection, projectsContainer.nextSibling);
        
        // Add event listener for show more button
        const showMoreBtn = document.getElementById('show-more-btn');
        const additionalProjects = document.getElementById('additional-projects-grid');
        let isExpanded = false;
        
        showMoreBtn.addEventListener('click', () => {
            if (!isExpanded) {
                additionalProjects.style.display = 'grid';
                showMoreBtn.querySelector('.btn-text').textContent = 'Show Less';
                showMoreBtn.querySelector('.btn-icon').classList.replace('fa-chevron-down', 'fa-chevron-up');
                isExpanded = true;
            } else {
                additionalProjects.style.display = 'none';
                showMoreBtn.querySelector('.btn-text').textContent = `Show ${remainingProjects.length} More Projects`;
                showMoreBtn.querySelector('.btn-icon').classList.replace('fa-chevron-up', 'fa-chevron-down');
                isExpanded = false;
            }
        });
    }
}

function generateProjectHTML(project) {
    return `
        <div class="project-card">
            <div class="project-header">
                <h3 class="project-title">
                    ${project.name}
                    ${project.isOrgContribution ? '<span class="contribution-badge org"><i class="fas fa-building"></i> Organization Project</span>' :
                      project.isExternalContribution ? '<span class="contribution-badge external"><i class="fas fa-users"></i> External Contribution</span>' : 
                      project.fork ? '<span class="contribution-badge"><i class="fas fa-code-branch"></i> Fork Contribution</span>' : ''}
                </h3>
                <p class="project-description">${project.description || 'No description available'}</p>
                ${project.isOrgContribution || project.isExternalContribution ? `<p class="project-owner">by ${project.owner.login}</p>` : ''}
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
    `;
}

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

window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.background = '#0d1117';
    } else {
        header.style.background = '#161b22';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubProjects();
});

function updatePersonalInfo() {
    const personalInfo = {
        name: "Hannah Villanueva",
        title: "Developer in Progress",
        description: "I am Hannah Sophia L. Villanueva, a 3rd year BS Computer Science student at Caraga State University - Main Campus. I specialize in Python programming and designing UX/UI interfaces for websites. Currently learning frameworks like React, Django and Flask to enhance my web development skills.",
        email: "hslvillanueva@gmail.com",
        linkedin: "https://www.linkedin.com/in/hannahsophiavillanueva/",
        github: `https://github.com/hsvillanueva`
    };
    
    document.querySelector('.hero-content h1').textContent = `> ${personalInfo.name}`;
    document.querySelector('.hero-content p').textContent = personalInfo.title;
    document.querySelector('.about p').textContent = personalInfo.description;
    
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks[0].href = personalInfo.github; 
    socialLinks[1].href = personalInfo.linkedin;
    socialLinks[2].href = `mailto:${personalInfo.email}`;
}

document.addEventListener('DOMContentLoaded', () => {
    updatePersonalInfo();
    
    const profileImg = document.getElementById('profile-img');
    profileImg.addEventListener('error', function() {
        this.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.className = 'profile-placeholder';
        placeholder.innerHTML = '<i class="fas fa-user"></i>';
        this.parentNode.appendChild(placeholder);
    });
});
