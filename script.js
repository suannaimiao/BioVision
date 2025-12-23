document.addEventListener('DOMContentLoaded', function() {
    initHeaderScroll();
    initNavigation(); // 这个函数会设置正确的初始活动页面
    initSearch();
    initCarousel();
    initLearningSteps();
    initDifficultySelector();
    initConceptNodes();
    initIdentityModal();
    initTagManagement();
    
    // 监听页面切换，只在切换到 study 页面时初始化
    document.addEventListener('pageChange', function(e) {
        if (e.detail.page === 'study') {
            console.log('切换到学习页面，重新初始化');
            initStudyPage();
            initCollapsibleTree();
            loadDynamicContent();
        }
    });

    // 页面加载后，确保只有 home 页面是活动的
    // 这行代码可以确保即使HTML有误，JS也能纠正初始状态
    const homePage = document.getElementById('home');
    const studyPage = document.getElementById('study');
    if (homePage && studyPage && studyPage.classList.contains('active')) {
        studyPage.classList.remove('active');
        console.log('已纠正初始页面状态：仅显示首页');
    }
});



function initStudyPage() {

    console.log('初始化学习页面功能');
    
    // 移除原来的initChapterTree调用
    initVideoPlayers();
    initStepAnimations();
    initYouTubeButtons();
    initPracticeQuestions();
    initDiscussionSection();
    initKeywordTooltips();
    initButtonEvents();
    initResourceNavigation();
    initQuestionFilters();
}


function initHeaderScroll() {
    const header = document.querySelector('.site-header');
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const pages = document.querySelectorAll('.page-content');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const pageId = this.getAttribute('data-page');
            console.log('切换到页面:', pageId);
            
            // 移除所有活动状态
            navLinks.forEach(item => {
                item.classList.remove('active');
            });
            pages.forEach(page => {
                page.classList.remove('active');
            });
            
            // 添加当前活动状态
            this.classList.add('active');
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add('active');
            }
            
            // 触发自定义事件
            document.dispatchEvent(new CustomEvent('pageChange', {
                detail: { page: pageId }
            }));
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            return false;
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

// 初始化章节树
function initChapterTree() {
    const treeItems = document.querySelectorAll('.tree-item');
    
    treeItems.forEach(item => {
        item.addEventListener('click', function() {
            const isUnit = this.classList.contains('unit');
            const isChapter = this.classList.contains('chapter');
            const isConcept = this.classList.contains('concept');
            
            // 更新激活状态
            treeItems.forEach(i => {
                i.classList.remove('active');
            });
            this.classList.add('active');
            
            // 如果是单元，激活第一个子章节
            if (isUnit) {
                let nextElement = this.nextElementSibling;
                while (nextElement && !nextElement.classList.contains('unit')) {
                    if (nextElement.classList.contains('chapter') || 
                        nextElement.classList.contains('concept')) {
                        nextElement.classList.add('active');
                        break;
                    }
                    nextElement = nextElement.nextElementSibling;
                }
            }
            
            // 如果是章节，激活第一个子概念
            if (isChapter) {
                let nextElement = this.nextElementSibling;
                while (nextElement && !nextElement.classList.contains('chapter') && 
                       !nextElement.classList.contains('unit')) {
                    if (nextElement.classList.contains('concept')) {
                        nextElement.classList.add('active');
                        break;
                    }
                    nextElement = nextElement.nextElementSibling;
                }
            }
            
            // 如果是概念，加载内容
            if (isConcept) {
                const conceptName = this.textContent.replace('●', '').trim();
                const conceptId = this.getAttribute('data-concept');
                updateConceptContent(conceptName, conceptId);
            }
        });
    });
}
// 更新概念内容
// function updateConceptContent(conceptName, conceptId) {
//     // 更新标题
//     const conceptTitle = document.getElementById('currentConceptTitle');
//     const conceptPath = document.getElementById('currentConceptPath');
    
//     if (conceptTitle) {
//         conceptTitle.textContent = conceptName;
//     }
    
//     if (conceptPath) {
//         // 根据概念ID获取路径信息
//         const [unit, chapter, concept] = conceptId.split('.');
//         const unitNames = {
//             '1': 'Unit 1: Chemical Basis of Life',
//             '2': 'Unit 2: Cell Structure',
//             '3': 'Unit 3: Cell Metabolism',
//             '4': 'Unit 4: Genetics',
//             '5': 'Unit 5: Evolution'
//         };
        
//         const chapterNames = {
//             '1.1': 'Chapter 1: Water and Life',
//             '1.2': 'Chapter 2: Carbon Compounds'
//         };
        
//         conceptPath.textContent = `${unitNames[unit]} / ${chapterNames[`${unit}.${chapter}`]} / ${conceptName}`;
//     }
    
//     // 更新动画标题
//     const animationTitle = document.querySelector('.personified-animation h3');
//     if (animationTitle) {
//         animationTitle.innerHTML = `<i class="fas fa-user-friends"></i> Personified Animation: ${conceptName} (5 min)`;
//     }
    
//     // 这里可以添加更多内容更新的逻辑
//     console.log(`Loading content for concept: ${conceptName} (${conceptId})`);
// }


// 初始化视频播放器
function initVideoPlayers() {
    const videoPlaceholders = document.querySelectorAll('.video-placeholder');
    
    videoPlaceholders.forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            const videoId = this.id;
            playVideo(videoId);
        });
    });
    
    // 播放完整视频按钮
    document.getElementById('watchVideoBtn')?.addEventListener('click', function() {
        playVideo('mainVideo');
    });
}

function playVideo(videoId) {
    // 实际应用中这里会嵌入视频播放器
    // 这里用模拟弹窗代替
    alert(`Playing video: ${videoId === 'mainVideo' ? 'Complete explanation video (15:32)' : 'Personified animation (5:00)'}\n\nNote: In production, this would embed an actual video player.`);
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

// 初始化步骤动画
function initStepAnimations() {
    const stepButtons = document.querySelectorAll('.step-btn');
    const stepAnimation = document.getElementById('step-animation');
    
    if (!stepButtons.length || !stepAnimation) return;
    
    stepButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const step = this.getAttribute('data-step');
            const stepText = this.querySelector('.step-label').nextSibling.textContent.trim();
            
            // 更新按钮状态
            stepButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 更新动画显示
            const animationPreviews = stepAnimation.querySelectorAll('.animation-preview');
            if (animationPreviews.length) {
                animationPreviews.forEach(preview => {
                    preview.innerHTML = `
                        <i class="fas fa-play-circle"></i>
                        <p>Playing animation for: ${stepText}</p>
                        <div class="animation-progress" style="width: 80%; height: 4px; background: var(--primary); margin-top: 1rem; border-radius: 2px;"></div>
                    `;
                    preview.style.cursor = 'default';
                });
            }
            
            // 显示步骤内容
            const steps = {
                '1': {
                    title: 'Step 1: Polarity of Water Molecules',
                    content: 'Water molecules are polar because oxygen is more electronegative than hydrogen, creating partial charges that allow hydrogen bonding.',
                    animation: 'Polarity Animation'
                },
                '2': {
                    title: 'Step 2: Cohesion',
                    content: 'Hydrogen bonds cause water molecules to stick together, creating surface tension and allowing water to form droplets.',
                    animation: 'Cohesion Animation'
                },
                '3': {
                    title: 'Step 3: Adhesion',
                    content: 'Water molecules adhere to other surfaces, enabling capillary action in plants and other biological systems.',
                    animation: 'Adhesion Animation'
                },
                '4': {
                    title: 'Step 4: Solvent Properties',
                    content: 'Water\'s polarity makes it an excellent solvent for ionic compounds and polar molecules, essential for biochemical reactions.',
                    animation: 'Solvent Animation'
                }
            };
            
            const currentStep = steps[step];
            if (currentStep) {
                stepAnimation.innerHTML = `
                    <h5>${currentStep.title}</h5>
                    <p>${currentStep.content}</p>
                    <div class="animation-preview">
                        <i class="fas fa-play-circle"></i>
                        <p>Playing: ${currentStep.animation}</p>
                        <div class="animation-progress" style="width: 80%; height: 4px; background: var(--primary); margin-top: 1rem; border-radius: 2px;"></div>
                    </div>
                    <button class="btn btn-secondary replay-step-btn" style="margin-top: 1rem;">
                        <i class="fas fa-redo"></i> Replay Animation
                    </button>
                `;
                
                // 添加重播按钮事件
                document.querySelector('.replay-step-btn')?.addEventListener('click', function() {
                    alert(`Replaying step ${step} animation...`);
                });
            }
        });
    });
}


// 初始化YouTube按钮
function initYouTubeButtons() {
    const youtubeButtons = document.querySelectorAll('.yt-btn');
    
    youtubeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const time = parseInt(this.getAttribute('data-time'));
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            
            // 模拟YouTube播放器
            alert(`Opening YouTube video and jumping to ${minutes}:${seconds.toString().padStart(2, '0')}\n\nNote: In production, this would control an embedded YouTube player.`);
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

function initIdentityModal() {
    const identityModal = document.getElementById('identityModal');
    // const registerBtn = document.getElementById('registerBtn');
    // const loginBtn = document.getElementById('loginBtn');
    const startJournalBtn = document.getElementById('startJournalBtn'); // 新增按钮
    const identityOptions = document.querySelectorAll('.identity-option');
    const confirmIdentityBtn = document.getElementById('confirmIdentity');
    let selectedIdentity = null;

    // 为注册、登录和新增的“Start My Journal”按钮绑定相同的事件
    [startJournalBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                identityModal.style.display = 'flex';
            });
        }
    });

    identityOptions.forEach(option => {
        option.addEventListener('click', function () {
            identityOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedIdentity = this.getAttribute('data-identity');
            confirmIdentityBtn.disabled = false;

            // 如果选择Educator，显示提示
            if (selectedIdentity === 'educator') {
                confirmIdentityBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Coming Soon';
            } else {
                confirmIdentityBtn.innerHTML = 'Continue as Student';
            }
        });
    });

    confirmIdentityBtn.addEventListener('click', () => {
        if (selectedIdentity) {
            identityModal.style.display = 'none';
            if (selectedIdentity === 'student') {
                alert('Redirecting to student registration/login page...');
            } else {
                alert('Educator features are currently under development. You will be redirected to a waiting list.');
            }
        }
    });

    // 点击模态框外部关闭
    identityModal.addEventListener('click', (e) => {
        if (e.target === identityModal) {
            identityModal.style.display = 'none';
        }
    });
}


// 初始化练习题目
function initPracticeQuestions() {
    const showAnswerBtns = document.querySelectorAll('.show-answer-btn');
    const saveQuestionBtns = document.querySelectorAll('.save-question-btn');
    const startQuizBtn = document.getElementById('startQuizBtn');
    
    // 显示答案按钮
    showAnswerBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const questionItem = this.closest('.question-item');
            const options = questionItem.querySelectorAll('.option');
            let correctAnswer = '';
            
            // 根据难度设置正确答案（模拟）
            const difficulty = questionItem.getAttribute('data-difficulty');
            switch(difficulty) {
                case 'easy':
                    correctAnswer = 'Hydrogen bond'; // q1c
                    break;
                case 'medium':
                    correctAnswer = 'It allows water transport against gravity'; // q2b
                    break;
                default:
                    correctAnswer = 'Answer';
            }
            
            // 显示正确答案
            const originalText = this.textContent;
            this.textContent = `Correct: ${correctAnswer}`;
            this.classList.add('btn-primary');
            this.classList.remove('btn-secondary');
            
            // 3秒后恢复
            setTimeout(() => {
                this.textContent = originalText;
                this.classList.remove('btn-primary');
                this.classList.add('btn-secondary');
            }, 3000);
        });
    });
    
    // 保存题目按钮
    saveQuestionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.classList.add('btn-primary');
                alert('Question saved to your collection!');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.classList.remove('btn-primary');
                alert('Question removed from your collection.');
            }
        });
    });
    
    // 开始测验按钮
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', function() {
            const selectedTags = document.querySelectorAll('.tag.active');
            const tags = Array.from(selectedTags).map(tag => tag.getAttribute('data-tag'));
            
            alert(`Starting quiz with ${tags.includes('all') ? 'all' : tags.join(', ')} questions\nAdaptive difficulty system activated.`);
            
            // 模拟跳转到考试页面
            console.log('Redirecting to exam page with filters:', tags);
        });
    }
}

// 初始化讨论区
function initDiscussionSection() {
    const createPostBtn = document.getElementById('createPostBtn');
    const viewAllDiscussionsBtn = document.getElementById('viewAllDiscussionsBtn');
    const discussionItems = document.querySelectorAll('.discussion-item');
    
    if (createPostBtn) {
        createPostBtn.addEventListener('click', function() {
            alert('Opening post creation form...\nYou can create a new discussion post here.');
        });
    }
    
    if (viewAllDiscussionsBtn) {
        viewAllDiscussionsBtn.addEventListener('click', function() {
            alert('Redirecting to full discussion forum...');
            // 实际应用中这里会跳转到讨论区页面
        });
    }
    
    // 讨论项点击事件
    discussionItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (!e.target.closest('.reply-count') && !e.target.closest('button')) {
                alert('Opening discussion thread...');
            }
        });
    });
}

// 初始化关键词工具提示
function initKeywordTooltips() {
    const keywords = document.querySelectorAll('.keyword');
    const tooltipContainer = document.getElementById('keywordTooltipContainer');
    
    // 点击外部关闭工具提示
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.keyword') && !e.target.closest('.keyword-tooltip')) {
            keywords.forEach(keyword => {
                keyword.classList.remove('active');
            });
            if (tooltipContainer) {
                tooltipContainer.style.display = 'none';
            }
        }
    });
    
    keywords.forEach(keyword => {
        keyword.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // 关闭其他工具提示
            keywords.forEach(k => {
                if (k !== this) k.classList.remove('active');
            });
            
            // 切换当前工具提示
            this.classList.toggle('active');
            
            // 如果工具提示在外部容器中
            const tooltip = this.querySelector('.keyword-tooltip');
            if (tooltip && tooltipContainer) {
                tooltipContainer.innerHTML = '';
                const clonedTooltip = tooltip.cloneNode(true);
                clonedTooltip.style.display = 'block';
                clonedTooltip.style.position = 'fixed';
                
                // 计算位置
                const rect = this.getBoundingClientRect();
                clonedTooltip.style.left = Math.min(rect.left, window.innerWidth - 320) + 'px';
                clonedTooltip.style.top = (rect.bottom + 10) + 'px';
                
                tooltipContainer.appendChild(clonedTooltip);
                tooltipContainer.style.display = 'block';
                
                // 添加关闭按钮事件
                const closeBtn = clonedTooltip.querySelector('.tooltip-close');
                if (closeBtn) {
                    closeBtn.addEventListener('click', function() {
                        tooltipContainer.style.display = 'none';
                        keyword.classList.remove('active');
                    });
                }
            }
        });
    });
}


// 初始化按钮事件
function initButtonEvents() {
    // 移除可能会引起冲突的事件监听器
    const saveBtn = document.getElementById('saveConceptBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bookmark')) {
                icon.classList.replace('fa-bookmark', 'fa-check');
                this.innerHTML = '<i class="fas fa-check"></i> Saved';
                this.classList.add('btn-primary');
                setTimeout(() => {
                    icon.classList.replace('fa-check', 'fa-bookmark');
                    this.innerHTML = '<i class="fas fa-bookmark"></i> Save';
                    this.classList.remove('btn-primary');
                }, 2000);
            }
        });
    }
    
    // 播放动画按钮
    document.getElementById('playAnimationBtn').addEventListener('click', function() {
        const video = document.getElementById('personifiedVideo');
        if(video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });
    
    // 下载动画按钮
    document.getElementById('downloadAnimationBtn')?.addEventListener('click', function() {
        alert('Downloading animation file...\nMP4 format, 5 minutes, 1080p');
    });
    
    // 查看所有问题按钮
    document.getElementById('viewAllQuestionsBtn')?.addEventListener('click', function() {
        alert('Opening full question bank for this concept...');
    });
    
    // 查看模型按钮
    document.querySelectorAll('.view-model-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const model = this.closest('.model-card').getAttribute('data-model');
            alert(`Opening 3D model viewer for: ${model}\nInteractive 3D visualization will load.`);
        });
    });

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


// 初始化资源导航
function initResourceNavigation() {
    document.getElementById('gotoGalleryBtn')?.addEventListener('click', function() {
        alert('Redirecting to animation and 3D model gallery...');
        // 实际应用中这里会切换到Gallery页面
    });
    
    document.getElementById('view3dModelBtn')?.addEventListener('click', function() {
        alert('Opening 3D model gallery with all available models...');
    });
    
    document.getElementById('downloadNotesBtn')?.addEventListener('click', function() {
        alert('Downloading concept notes as PDF...');
    });
}

// 初始化题目过滤器
function initQuestionFilters() {
    const tags = document.querySelectorAll('.tag[data-tag]');
    const questionItems = document.querySelectorAll('.question-item');
    
    tags.forEach(tag => {
        tag.addEventListener('click', function() {
            const selectedTag = this.getAttribute('data-tag');
            
            // 更新标签状态
            tags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // 过滤题目
            questionItems.forEach(item => {
                if (selectedTag === 'all') {
                    item.style.display = 'block';
                } else if (selectedTag === 'easy' || selectedTag === 'medium' || selectedTag === 'hard') {
                    if (item.getAttribute('data-difficulty') === selectedTag) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                } else {
                    // 按知识点标签过滤
                    const tags = item.querySelectorAll('.mini-tag');
                    const hasTag = Array.from(tags).some(t => 
                        t.textContent.toLowerCase().includes(selectedTag.toLowerCase())
                    );
                    item.style.display = hasTag ? 'block' : 'none';
                }
            });
            
            // 更新题目计数
            const visibleCount = document.querySelectorAll('.question-item[style="display: block"]').length;
            const totalCount = questionItems.length;
            const questionCount = document.querySelector('.question-count');
            if (questionCount) {
                questionCount.textContent = `${visibleCount} of ${totalCount} questions`;
            }
        });
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

// 可折叠树
function initCollapsibleTree() {
    console.log('初始化折叠目录树');
    
    // 确保默认展开第一个单元和第一个章节
    const defaultUnit = document.querySelector('.tree-unit[data-unit="1"]');
    const defaultChapter = document.querySelector('.tree-chapter[data-chapter="1.1"]');
    
    if (defaultUnit && !defaultUnit.classList.contains('expanded')) {
        expandUnit(defaultUnit);
    }
    
    if (defaultChapter && !defaultChapter.classList.contains('expanded')) {
        expandChapter(defaultChapter);
    }
    
    // 单元点击事件 - 使用事件委托
    document.querySelector('.chapter-tree').addEventListener('click', function(e) {
        // 处理单元头部点击
        if (e.target.closest('.unit-header')) {
            e.preventDefault();
            e.stopPropagation();
            
            const unitHeader = e.target.closest('.unit-header');
            const unit = unitHeader.closest('.tree-unit');
            const isExpanded = unit.classList.contains('expanded');
            
            if (isExpanded) {
                collapseUnit(unit);
            } else {
                expandUnit(unit);
                
                // 动态加载单元内容（新增的关键代码）
                const unitContent = unit.querySelector('.unit-content');
                if (unitContent && unitContent.children.length === 0) {
                    const unitId = unit.getAttribute('data-unit');
                    loadUnitContent(unitId, unitContent);
                }
                
                // 如果有活跃的概念，加载其内容
                const activeConcept = unit.querySelector('.tree-concept.active');
                if (activeConcept) {
                    const conceptId = activeConcept.getAttribute('data-concept');
                    const conceptName = activeConcept.querySelector('.concept-title').textContent;
                    updateConceptContent(conceptName, conceptId);
                }
            }
            
            return false; // 阻止进一步传播
        }
        
        // 处理章节头部点击
        if (e.target.closest('.chapter-header')) {
            e.preventDefault();
            e.stopPropagation();
            
            const chapterHeader = e.target.closest('.chapter-header');
            const chapter = chapterHeader.closest('.tree-chapter');
            const isExpanded = chapter.classList.contains('expanded');
            
            if (isExpanded) {
                collapseChapter(chapter);
            } else {
                expandChapter(chapter);
            }
            
            return false; // 阻止进一步传播
        }
        
        // 处理概念点击
        if (e.target.closest('.tree-concept')) {
            e.preventDefault();
            e.stopPropagation();
            
            const concept = e.target.closest('.tree-concept');
            const conceptId = concept.getAttribute('data-concept');
            const conceptName = concept.querySelector('.concept-title').textContent;
            
            // 移除所有概念的活动状态
            document.querySelectorAll('.tree-concept').forEach(c => {
                c.classList.remove('active');
            });
            
            // 添加当前概念的活动状态
            concept.classList.add('active');
            
            // 确保父级单元和章节是展开的
            const chapter = concept.closest('.tree-chapter');
            const unit = concept.closest('.tree-unit');
            
            if (chapter && !chapter.classList.contains('expanded')) {
                expandChapter(chapter);
            }
            
            if (unit && !unit.classList.contains('expanded')) {
                expandUnit(unit);
            }
            
            // 更新内容
            updateConceptContent(conceptName, conceptId);
            
            return false; // 阻止进一步传播
        }
    });
}

// 展开指定单元
// 展开指定单元
function expandUnit(unit) {
    console.log('展开单元:', unit.getAttribute('data-unit'));
    
    // 首先折叠所有其他单元（除了当前单元）
    document.querySelectorAll('.tree-unit').forEach(otherUnit => {
        if (otherUnit !== unit && otherUnit.classList.contains('expanded')) {
            collapseUnit(otherUnit);
        }
    });
    
    // 展开当前单元
    unit.classList.add('expanded');
    
    // 更新箭头图标
    const toggleIcon = unit.querySelector('.unit-toggle');
    if (toggleIcon) {
        toggleIcon.classList.remove('fa-chevron-right');
        toggleIcon.classList.add('fa-chevron-down');
    }
    
    // 确保单元内容可见
    const unitContent = unit.querySelector('.unit-content');
    if (unitContent) {
        unitContent.style.display = 'block';
    }
    
    // 如果有内容，加载第一个章节
    const firstChapter = unit.querySelector('.tree-chapter');
    if (firstChapter && !firstChapter.classList.contains('expanded')) {
        expandChapter(firstChapter);
    }
}

// 折叠指定单元
function collapseUnit(unit) {
    console.log('折叠单元:', unit.getAttribute('data-unit'));
    
    unit.classList.remove('expanded');
    
    // 更新箭头图标
    const toggleIcon = unit.querySelector('.unit-toggle');
    if (toggleIcon) {
        toggleIcon.classList.remove('fa-chevron-down');
        toggleIcon.classList.add('fa-chevron-right');
    }
    
    // 隐藏单元内容
    const unitContent = unit.querySelector('.unit-content');
    if (unitContent) {
        unitContent.style.display = 'none';
    }
    
    // 折叠该单元内的所有章节
    unit.querySelectorAll('.tree-chapter.expanded').forEach(chapter => {
        collapseChapter(chapter);
    });
}

// 展开指定章节
function expandChapter(chapter) {
    console.log('展开章节:', chapter.getAttribute('data-chapter'));
    
    chapter.classList.add('expanded');
    
    // 更新箭头图标
    const toggleIcon = chapter.querySelector('.chapter-toggle');
    if (toggleIcon) {
        toggleIcon.classList.remove('fa-chevron-right');
        toggleIcon.classList.add('fa-chevron-down');
    }
    
    // 确保章节内容可见
    const chapterContent = chapter.querySelector('.chapter-content');
    if (chapterContent) {
        chapterContent.style.display = 'block';
    }
}

// 折叠指定章节
function collapseChapter(chapter) {
    console.log('折叠章节:', chapter.getAttribute('data-chapter'));
    
    chapter.classList.remove('expanded');
    
    // 更新箭头图标
    const toggleIcon = chapter.querySelector('.chapter-toggle');
    if (toggleIcon) {
        toggleIcon.classList.remove('fa-chevron-down');
        toggleIcon.classList.add('fa-chevron-right');
    }
    
    // 隐藏章节内容
    const chapterContent = chapter.querySelector('.chapter-content');
    if (chapterContent) {
        chapterContent.style.display = 'none';
    }
}

// 加载动态内容（用于未展开的单元）
function loadDynamicContent() {
    // 为每个单元添加点击加载内容的功能
    const units = document.querySelectorAll('.tree-unit');
    
    units.forEach(unit => {
        const unitId = unit.getAttribute('data-unit');
        const unitContent = unit.querySelector('.unit-content');
        
        // 如果单元内容为空，监听展开事件来加载内容
        if (unitContent && unitContent.children.length === 0) {
            const unitHeader = unit.querySelector('.unit-header');
            
            unitHeader.addEventListener('click', function() {
                // 延迟加载内容，避免同时加载所有单元
                setTimeout(() => {
                    if (unit.classList.contains('expanded') && unitContent.children.length === 0) {
                        loadUnitContent(unitId, unitContent);
                    }
                }, 300);
            }, { once: true }); // 只加载一次
        }
    });
}

// 加载单元内容
function loadUnitContent(unitId, container) {
    // 模拟API加载
    console.log(`Loading content for Unit ${unitId}...`);
    
    // 根据单元ID加载不同的内容
    const contentMap = {
        '2': {
            chapters: [
                {
                    id: '2.1',
                    title: 'Chapter 3: Cell Membrane',
                    concepts: [
                        { id: '2.1.1', title: 'Membrane Structure' },
                        { id: '2.1.2', title: 'Passive Transport' },
                        { id: '2.1.3', title: 'Active Transport' }
                    ]
                },
                {
                    id: '2.2',
                    title: 'Chapter 4: Cell Organelles',
                    concepts: [
                        { id: '2.2.1', title: 'Nucleus' },
                        { id: '2.2.2', title: 'Mitochondria' },
                        { id: '2.2.3', title: 'Chloroplasts' },
                        { id: '2.2.4', title: 'Endoplasmic Reticulum' },
                        { id: '2.2.5', title: 'Golgi Apparatus' }
                    ]
                }
            ]
        },
        '3': {
            chapters: [
                {
                    id: '3.1',
                    title: 'Chapter 5: Enzymes',
                    concepts: [
                        { id: '3.1.1', title: 'Enzyme Structure' },
                        { id: '3.1.2', title: 'Enzyme Kinetics' },
                        { id: '3.1.3', title: 'Enzyme Regulation' }
                    ]
                },
                {
                    id: '3.2',
                    title: 'Chapter 6: Cellular Respiration',
                    concepts: [
                        { id: '3.2.1', title: 'Glycolysis' },
                        { id: '3.2.2', title: 'Krebs Cycle' },
                        { id: '3.2.3', title: 'Electron Transport Chain' }
                    ]
                }
            ]
        }
    };
    
    const content = contentMap[unitId];
    if (!content) return;
    
    // 清空容器
    container.innerHTML = '';
    
    // 添加章节
    content.chapters.forEach(chapterData => {
        const chapterElement = createChapterElement(chapterData);
        container.appendChild(chapterElement);
    });
    
    // 重新绑定事件
    setTimeout(() => {
        initCollapsibleTree();
    }, 100);
}

// 创建章节元素
function createChapterElement(chapterData) {
    const chapterDiv = document.createElement('div');
    chapterDiv.className = 'tree-chapter';
    chapterDiv.setAttribute('data-chapter', chapterData.id);
    
    const chapterContent = `
        <div class="chapter-header">
            <i class="fas fa-chevron-right chapter-toggle"></i>
            <i class="fas fa-file-alt"></i>
            <span class="chapter-title">${chapterData.title}</span>
        </div>
        <div class="chapter-content">
            ${chapterData.concepts.map(concept => `
                <div class="tree-concept" data-concept="${concept.id}">
                    <i class="fas fa-circle"></i>
                    <span class="concept-title">${concept.title}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    chapterDiv.innerHTML = chapterContent;
    return chapterDiv;
}

// 更新概念内容（与之前的功能集成）
function updateConceptContent(conceptName, conceptId) {
    console.log('更新概念内容:', conceptName, conceptId);
    
    // 更新标题
    const conceptTitle = document.getElementById('currentConceptTitle');
    const conceptPath = document.getElementById('currentConceptPath');
    
    if (conceptTitle) {
        conceptTitle.textContent = conceptName;
    }
    
    if (conceptPath) {
        // 根据概念ID获取路径信息
        const [unit, chapter, concept] = conceptId.split('.');
        const unitNames = {
            '1': 'Unit 1: Chemical Basis of Life',
            '2': 'Unit 2: Cell Structure',
            '3': 'Unit 3: Cell Metabolism',
            '4': 'Unit 4: Genetics',
            '5': 'Unit 5: Evolution'
        };
        
        const chapterNames = {
            '1.1': 'Chapter 1: Water and Life',
            '1.2': 'Chapter 2: Carbon Compounds',
            '2.1': 'Chapter 3: Cell Membrane',
            '2.2': 'Chapter 4: Cell Organelles'
        };
        
        conceptPath.textContent = `${unitNames[unit] || `Unit ${unit}`} / ${chapterNames[`${unit}.${chapter}`] || `Chapter ${chapter}`} / ${conceptName}`;
    }
    
    // 更新动画标题
    const animationTitle = document.querySelector('.personified-animation h3');
    if (animationTitle) {
        animationTitle.innerHTML = `<i class="fas fa-user-friends"></i> Personified Animation: ${conceptName} (5 min)`;
    }
}


// 显示单元概述
function showUnitOverview(unitId) {
    const unitTitles = {
        '1': 'Chemical Basis of Life',
        '2': 'Cell Structure and Function',
        '3': 'Cell Metabolism',
        '4': 'Genetics',
        '5': 'Evolution and Diversity'
    };
    
    const unitName = unitTitles[unitId] || `Unit ${unitId}`;
    
    // 更新内容显示单元概述
    const conceptTitle = document.getElementById('currentConceptTitle');
    const conceptPath = document.getElementById('currentConceptPath');
    
    if (conceptTitle) {
        conceptTitle.textContent = `${unitName} - Overview`;
    }
    
    if (conceptPath) {
        conceptPath.textContent = `${unitName} / Unit Overview`;
    }
    
    // 显示单元概述内容
    console.log(`Showing overview for Unit ${unitId}`);
}

// 模拟内容加载
function simulateContentLoad(conceptId) {
    // 在实际应用中，这里会从服务器加载内容
    // 现在只显示一个简单的加载状态
    const animationTitle = document.querySelector('.personified-animation h3');
    if (animationTitle) {
        const originalText = animationTitle.innerHTML;
        animationTitle.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Loading content...`;
        
        setTimeout(() => {
            animationTitle.innerHTML = originalText;
        }, 500);
    }
}

// 键盘导航支持
document.addEventListener('keydown', function(e) {
    // 只在学习页面生效
    if (!document.getElementById('study').classList.contains('active')) return;
    
    const activeConcept = document.querySelector('.tree-concept.active');
    if (!activeConcept) return;
    
    switch(e.key) {
        case 'ArrowUp':
            e.preventDefault();
            navigateToPreviousConcept();
            break;
        case 'ArrowDown':
            e.preventDefault();
            navigateToNextConcept();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            navigateToParentChapter();
            break;
        case 'ArrowRight':
            e.preventDefault();
            navigateToNextChapter();
            break;
    }
});

// 导航到上一个概念
function navigateToPreviousConcept() {
    const activeConcept = document.querySelector('.tree-concept.active');
    if (!activeConcept) return;
    
    const allConcepts = Array.from(document.querySelectorAll('.tree-concept'));
    const currentIndex = allConcepts.indexOf(activeConcept);
    
    if (currentIndex > 0) {
        allConcepts[currentIndex - 1].click();
    }
}

// 导航到下一个概念
function navigateToNextConcept() {
    const activeConcept = document.querySelector('.tree-concept.active');
    if (!activeConcept) return;
    
    const allConcepts = Array.from(document.querySelectorAll('.tree-concept'));
    const currentIndex = allConcepts.indexOf(activeConcept);
    
    if (currentIndex < allConcepts.length - 1) {
        allConcepts[currentIndex + 1].click();
    }
}

// 导航到父章节
function navigateToParentChapter() {
    const activeConcept = document.querySelector('.tree-concept.active');
    if (!activeConcept) return;
    
    const parentChapter = activeConcept.closest('.tree-chapter');
    if (parentChapter) {
        const chapterHeader = parentChapter.querySelector('.chapter-header');
        chapterHeader.click();
    }
}

// 导航到下一个章节
function navigateToNextChapter() {
    const activeConcept = document.querySelector('.tree-concept.active');
    if (!activeConcept) return;
    
    const parentChapter = activeConcept.closest('.tree-chapter');
    if (parentChapter) {
        const nextChapter = parentChapter.nextElementSibling;
        if (nextChapter && nextChapter.classList.contains('tree-chapter')) {
            const chapterHeader = nextChapter.querySelector('.chapter-header');
            chapterHeader.click();
        }
    }
}
