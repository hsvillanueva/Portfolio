const header = document.querySelector('.site-header')
const menuButton = document.querySelector('.mobile-menu-button')
const nav = document.querySelector('.site-nav')
const indicator = document.querySelector('.nav-indicator')
const desktopLinks = [...document.querySelectorAll('.site-nav a')]
const mobileLinks = [...document.querySelectorAll('.mobile-nav a')]
const allLinks = [...desktopLinks, ...mobileLinks]
const sections = desktopLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean)

function setActiveLink(activeHref) {
  allLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === activeHref
    if (isActive) {
      link.setAttribute('aria-current', 'page')
    } else {
      link.removeAttribute('aria-current')
    }
  })

  updateIndicator()
}

function updateActiveSection() {
  const scrollPoint = window.scrollY + 140
  let currentSection = sections[0]

  sections.forEach((section) => {
    if (section.offsetTop <= scrollPoint) {
      currentSection = section
    }
  })

  if (currentSection) {
    setActiveLink(`#${currentSection.id}`)
  }
}

function updateIndicator() {
  if (!nav || !indicator) {
    return
  }

  const activeLink = nav.querySelector('[aria-current="page"]')

  if (!activeLink) {
    return
  }

  const navRect = nav.getBoundingClientRect()
  const linkRect = activeLink.getBoundingClientRect()

  indicator.style.opacity = '1'
  indicator.style.transform = `translate3d(${linkRect.left - navRect.left + 10}px, 0, 0)`
  indicator.style.width = `${Math.max(24, linkRect.width - 20)}px`
}

function closeMobileMenu() {
  header?.setAttribute('data-open', 'false')
  menuButton?.setAttribute('aria-expanded', 'false')
}

menuButton?.addEventListener('click', () => {
  const isOpen = header?.getAttribute('data-open') === 'true'
  header?.setAttribute('data-open', String(!isOpen))
  menuButton.setAttribute('aria-expanded', String(!isOpen))
})

allLinks.forEach((link) => {
  link.addEventListener('click', () => {
    setActiveLink(link.getAttribute('href'))
    closeMobileMenu()
  })
})

window.addEventListener('scroll', updateActiveSection, { passive: true })
window.addEventListener('resize', () => {
  updateActiveSection()
  updateIndicator()
})

function imageExists(src) {
  return new Promise((resolve) => {
    const image = new Image()
    image.onload = () => resolve(src)
    image.onerror = () => resolve(null)
    image.src = src
  })
}

async function loadProfileImage() {
  const frame = document.querySelector('.profile-frame')
  const photo = document.querySelector('.profile-photo')
  const placeholder = document.querySelector('.profile-placeholder')

  if (!frame || !photo || !placeholder) {
    return
  }

  const availableSource = (await imageExists('profile.png')) || (await imageExists('profile.jpg'))

  if (!availableSource) {
    return
  }

  photo.src = availableSource
  photo.hidden = false
  placeholder.hidden = true
  frame.setAttribute('data-has-photo', 'true')
}

updateActiveSection()
requestAnimationFrame(updateIndicator)
loadProfileImage()
