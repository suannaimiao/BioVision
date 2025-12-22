document.addEventListener('DOMContentLoaded', function() {
    initHeaderScroll();
    initNavigation();
    initSearch();
    initCarousel();
    initChapterTree();
    initLearningSteps();
    initYouTubeButtons();
    initDifficultySelector();
    initConceptNodes();
    initButtonEvents();
    initTagManagement();
});

function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    const threshold = 80;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > threshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const pages = document.querySelectorAll('.page-content');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            navLinks.forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
            
            const pageId = this.getAttribute('data-page');
            pages.forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(pageId).classList.add('active');
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            alert(`搜索内容：“${this.value}”。\n（实际搜索功能请接入后端 API）`);
        }
    });
}

function initCarousel() {
    const carouselDots = document.querySelectorAll('.carousel-dot');
    const carouselTitle = document.getElementById('carouselTitle');
    const carouselText = document.getElementById('carouselText');
    
    const carouselContent = [
        {
            title: "Personalized Learning Assistant",
            text: "Based on your learning progress, we intelligently recommend content suitable for you. If you struggle with a particular concept, we'll recommend review materials; if you haven't studied for a while, we'll provide interesting biology facts."
        },
        {
            title: "Interactive 3D Models",
            text: "Explore biological structures with our interactive 3D models that you can rotate, zoom, and dissect to understand complex biological systems from every angle."
        },
        {
            title: "Adaptive Practice System",
            text: "Our adaptive learning system adjusts question difficulty based on your performance, ensuring you're always challenged at the right level for optimal learning."
        }
    ];
    
    carouselDots.forEach(dot => {
        dot.addEventListener('click', function() {
            const slideIndex = parseInt(this.getAttribute('data-slide'));
            
            carouselDots.forEach(d => {
                d.classList.remove('active');
            });
            this.classList.add('active');
            
            if (carouselTitle && carouselText) {
                carouselTitle.textContent = carouselContent[slideIndex].title;
                carouselText.textContent = carouselContent[slideIndex].text;
            }
        });
    });
    
    let currentSlide = 0;
    setInterval(() => {
        currentSlide = (currentSlide + 1) % carouselDots.length;
        
        carouselDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        if (carouselTitle && carouselText) {
            carouselTitle.textContent = carouselContent[currentSlide].title;
            carouselText.textContent = carouselContent[currentSlide].text;
        }
    }, 5000);
}

function initChapterTree() {
    const treeItems = document.querySelectorAll('.tree-item');
    
    treeItems.forEach(item => {
        item.addEventListener('click', function() {
            treeItems.forEach(i => {
                i.classList.remove('active');
            });
            
            this.classList.add('active');
            
            if (this.classList.contains('unit')) {
                const nextConcept = this.nextElementSibling;
                if (nextConcept && nextConcept.classList.contains('concept')) {
                    nextConcept.classList.add('active');
                }
            }
            
            if (this.classList.contains('concept')) {
                updateConceptContent(this.textContent, this.getAttribute('data-concept'));
            }
        });
    });
}

function updateConceptContent(conceptName, conceptId) {
    const conceptTitle = document.getElementById('currentConceptTitle');
    if (conceptTitle) {
        conceptTitle.textContent = conceptName;
        
        const conceptPath = document.getElementById('currentConceptPath');
        if (conceptPath) {
            conceptPath.textContent = `Unit 1 / Chapter 1 / ${conceptName}`;
        }
        
        const animationTitle = document.querySelector('.personified-animation h3');
        if (animationTitle) {
            animationTitle.innerHTML = `<i class="fas fa-user-friends"></i> Personified Animation: ${conceptName} (5 min)`;
        }
    }
}

function initLearningSteps() {
    const stepButtons = document.querySelectorAll('.step-btn');
    const stepAnimation = document.getElementById('step-animation');
    
    stepButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const step = this.getAttribute('data-step');
            
            stepButtons.forEach(b => {
                b.classList.remove('btn-primary');
                b.classList.add('btn-secondary');
            });
            
            this.classList.remove('btn-secondary');
            this.classList.add('btn-primary');
            
            if (stepAnimation) {
                stepAnimation.style.display = 'block';
                stepAnimation.innerHTML = `
                    <h5>Step ${step}: ${this.textContent.split(': ')[1]}</h5>
                    <p>Playing animation segment for this step...</p>
                    <div style="background-color: #e9ecef; height: 200px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-top: 1rem;">
                        <i class="fas fa-play-circle" style="font-size: 3rem; color: var(--primary);"></i>
                    </div>
                    <button class="btn btn-secondary replay-step-btn" style="margin-top: 1rem;">
                        <i class="fas fa-redo"></i> Replay Step
                    </button>
                `;
                
                document.querySelector('.replay-step-btn')?.addEventListener('click', function() {
                    alert(`Replaying step ${step} animation...`);
                });
            }
        });
    });
}

function initYouTubeButtons() {
    const youtubeButtons = document.querySelectorAll('.yt-btn');
    
    youtubeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const time = this.getAttribute('data-time');
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            alert(`Opening YouTube video and jumping to ${minutes}:${seconds.toString().padStart(2, '0')}`);
        });
    });
}

function initDifficultySelector() {
    const difficultyDots = document.querySelectorAll('.difficulty-dot');
    
    difficultyDots.forEach(dot => {
        dot.addEventListener('click', function() {
            const level = this.getAttribute('data-level');
            
            difficultyDots.forEach(d => {
                d.classList.remove('active');
            });
            this.classList.add('active');
            
            const difficultyTexts = {
                '1': 'Very Easy',
                '2': 'Easy',
                '3': 'Medium',
                '4': 'Hard',
                '5': 'Very Hard'
            };
            
            const container = this.closest('.card-body');
            const button = container.querySelector('.btn-primary');
            if (button) {
                button.textContent = `Start ${difficultyTexts[level]} Questions`;
            }
        });
    });
}

function initConceptNodes() {
    const conceptNodes = document.querySelectorAll('.concept-node');
    
    conceptNodes.forEach(node => {
        node.addEventListener('click', function() {
            const concept = this.getAttribute('data-concept');
            alert(`Redirecting to ${concept} learning page...`);
            
            document.querySelectorAll('.nav-links a').forEach(item => {
                item.classList.remove('active');
            });
            document.querySelector('[data-page="study"]').classList.add('active');
            
            document.querySelectorAll('.page-content').forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById('study').classList.add('active');
        });
    });
}

function initButtonEvents() {
    document.getElementById('createPostBtn')?.addEventListener('click', function() {
        alert('Opening post creation form...\nYou can: Write question, Select Unit/Concept, Add tags');
    });
    
    document.getElementById('donateBtn')?.addEventListener('click', function() {
        alert('Thank you for considering a donation! This feature will redirect to a secure payment gateway.');
    });
    
    document.getElementById('view3dModelBtn')?.addEventListener('click', function() {
        alert('Opening 3D model viewer...');
    });
    
    document.getElementById('viewAllAnimationsBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Opening animation library...');
    });
    
    document.getElementById('viewAllModelsBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Opening 3D model library...');
    });
    
    document.querySelectorAll('.view-model-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const model = this.getAttribute('data-model');
            alert(`Opening ${model} 3D model viewer...`);
        });
    });
    
    document.getElementById('openKnowledgeGraphBtn')?.addEventListener('click', function() {
        alert('Opening full knowledge graph visualization...');
    });
    
    document.getElementById('startPracticeBtn')?.addEventListener('click', function() {
        alert('Starting past exam paper practice...');
    });
    
    document.getElementById('selectUnitBtn')?.addEventListener('click', function() {
        alert('Opening unit selection dialog...');
    });
    
    document.getElementById('startTrainingBtn')?.addEventListener('click', function() {
        alert('Starting adaptive difficulty training...');
    });
    
    document.getElementById('showExplanationBtn')?.addEventListener('click', function() {
        alert('Showing detailed explanation for the sample question...');
    });
    
    document.getElementById('goToConceptBtn')?.addEventListener('click', function() {
        alert('Redirecting to Water Properties concept page...');
    });
    
    document.getElementById('saveQuestionBtn')?.addEventListener('click', function() {
        alert('Question saved to your collection!');
    });
    
    document.getElementById('viewMistakesBtn')?.addEventListener('click', function() {
        alert('Opening mistake collection...');
    });
    
    document.getElementById('manageSavedBtn')?.addEventListener('click', function() {
        alert('Opening saved content management...');
    });
    
    document.getElementById('playAnimationBtn')?.addEventListener('click', function() {
        alert('Playing personified animation...');
    });
    
    document.getElementById('downloadAnimationBtn')?.addEventListener('click', function() {
        alert('Downloading animation file...');
    });
    
    document.getElementById('watchVideoBtn')?.addEventListener('click', function() {
        alert('Opening video player...');
    });
    
    document.getElementById('saveConceptBtn')?.addEventListener('click', function() {
        alert('Concept saved to your collection!');
    });
    
    document.getElementById('practiceQuestionsBtn')?.addEventListener('click', function() {
        alert('Opening practice questions for this concept...');
    });
    
    document.getElementById('discussionBtn')?.addEventListener('click', function() {
        alert('Opening discussion forum for this concept...');
    });
    
    document.getElementById('gotoGalleryBtn')?.addEventListener('click', function() {
        document.querySelectorAll('.nav-links a').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector('[data-page="gallery"]').classList.add('active');
        
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById('gallery').classList.add('active');
    });
}

function initTagManagement() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', function() {
            if (this.hasAttribute('data-tag')) {
                const tagValue = this.getAttribute('data-tag');
                
                tags.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                console.log(`Filtering by tag: ${tagValue}`);
            }
        });
    });
    
    const addNewTagBtn = document.getElementById('addNewTagBtn');
    const newTagName = document.getElementById('newTagName');
    const newTagColor = document.getElementById('newTagColor');
    const userTags = document.getElementById('userTags');
    
    if (addNewTagBtn && newTagName && newTagColor && userTags) {
        addNewTagBtn.addEventListener('click', function() {
            const tagName = newTagName.value.trim();
            if (!tagName) {
                alert('Please enter a tag name');
                return;
            }
            
            const newTag = document.createElement('span');
            newTag.className = 'tag';
            newTag.textContent = tagName;
            
            const colorClass = newTagColor.value;
            if (colorClass !== 'primary') {
                newTag.style.backgroundColor = `var(--${colorClass}-color, rgba(42, 157, 143, 0.1))`;
                newTag.style.color = `var(--${colorClass}-color, var(--primary-color))`;
            }
            
            userTags.appendChild(newTag);
            newTagName.value = '';
            
            alert(`Tag "${tagName}" added successfully!`);
        });
    }
}
