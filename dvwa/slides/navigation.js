// Navigation and interactive features for DVWA Cybersecurity Course Slides

// Spoiler/Reveal functionality
document.addEventListener('DOMContentLoaded', () => {
  // Initialize spoilers
  const spoilers = document.querySelectorAll('.spoiler');
  spoilers.forEach(spoiler => {
    spoiler.addEventListener('click', () => {
      spoiler.classList.toggle('revealed');
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const navNext = document.getElementById('nav-next');
    const navPrev = document.getElementById('nav-prev');
    const navHome = document.getElementById('nav-home');
    
    switch(e.key) {
      case 'ArrowRight':
      case 'PageDown':
        if (navNext && !navNext.disabled) {
          navNext.click();
        }
        break;
      case 'ArrowLeft':
      case 'PageUp':
        if (navPrev && !navPrev.disabled) {
          navPrev.click();
        }
        break;
      case 'Home':
        if (navHome) {
          navHome.click();
        }
        break;
      case 'Escape':
        if (window.location.pathname !== '/slides/index.html' && 
            window.location.pathname !== '/index.html') {
          window.location.href = 'index.html';
        }
        break;
    }
  });

  // Smooth scroll to top on page load
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Add animation to elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe cards and sections
  const animatedElements = document.querySelectorAll('.card, .section, .level-section');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });

  // Code copy functionality
  const codeBlocks = document.querySelectorAll('pre');
  codeBlocks.forEach((block, index) => {
    // Create copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-btn';
    copyButton.innerHTML = '📋 Copy';
    copyButton.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      background: var(--gradient-primary);
      color: var(--color-bg-primary);
      border: none;
      padding: 0.5rem 1rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 600;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    block.style.position = 'relative';
    block.appendChild(copyButton);
    
    // Show button on hover
    block.addEventListener('mouseenter', () => {
      copyButton.style.opacity = '1';
    });
    
    block.addEventListener('mouseleave', () => {
      copyButton.style.opacity = '0';
    });
    
    // Copy functionality
    copyButton.addEventListener('click', async () => {
      const code = block.querySelector('code').textContent;
      try {
        await navigator.clipboard.writeText(code);
        copyButton.innerHTML = '✓ Copied!';
        setTimeout(() => {
          copyButton.innerHTML = '📋 Copy';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });
  });

  // Progress indicator
  updateProgress();
});

// Update progress indicator
function updateProgress() {
  const progressEl = document.getElementById('progress');
  if (!progressEl) return;
  
  const currentPage = getCurrentPage();
  const totalPages = 8; // 1 index + 7 vulnerabilities
  progressEl.textContent = `${currentPage} / ${totalPages}`;
}

// Get current page number
function getCurrentPage() {
  const path = window.location.pathname;
  if (path.includes('index.html') || path.endsWith('/slides/')) {
    return 1;
  }
  const match = path.match(/0(\d)_/);
  return match ? parseInt(match[1]) + 1 : 1;
}

// Navigation helpers
function navigateTo(url) {
  window.location.href = url;
}

// Add hover effects to module cards
document.addEventListener('DOMContentLoaded', () => {
  const moduleCards = document.querySelectorAll('.module-card');
  moduleCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });
  });
});

// Confetti effect for completed sections (optional easter egg)
function celebrateCompletion() {
  // Simple particle effect
  const colors = ['#00f5ff', '#7c3aed', '#ec4899', '#10b981'];
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    createParticle(colors[Math.floor(Math.random() * colors.length)]);
  }
}

function createParticle(color) {
  const particle = document.createElement('div');
  particle.style.cssText = `
    position: fixed;
    width: 10px;
    height: 10px;
    background: ${color};
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    left: ${Math.random() * 100}vw;
    top: -20px;
    animation: fall ${2 + Math.random() * 3}s linear forwards;
  `;
  
  document.body.appendChild(particle);
  
  setTimeout(() => {
    particle.remove();
  }, 5000);
}

// Add fall animation dynamically
if (!document.getElementById('particle-animation')) {
  const style = document.createElement('style');
  style.id = 'particle-animation';
  style.textContent = `
    @keyframes fall {
      to {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// Utility: Highlight syntax in code blocks
function highlightSyntax() {
  const codeBlocks = document.querySelectorAll('pre code');
  codeBlocks.forEach(block => {
    let html = block.innerHTML;
    
    // Simple syntax highlighting
    // Comments
    html = html.replace(/(#[^\n]*)/g, '<span style="color: #94a3b8; font-style: italic;">$1</span>');
    
    // Strings
    html = html.replace(/(['""][^'"]*['"])/g, '<span style="color: #10b981;">$1</span>');
    
    // Keywords
    const keywords = ['SELECT', 'FROM', 'WHERE', 'UNION', 'OR', 'AND', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER'];
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
      html = html.replace(regex, '<span style="color: #ec4899; font-weight: 600;">$1</span>');
    });
    
    block.innerHTML = html;
  });
}

// Call syntax highlighting on load
document.addEventListener('DOMContentLoaded', highlightSyntax);
