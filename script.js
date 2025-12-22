// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', function() {
    // 初始化应用
    initBioVision();
    
    // 隐藏教师端菜单项
    document.querySelectorAll('.educator-only').forEach(el => {
        el.style.display = 'none';
    });
});

// 主应用初始化函数
function initBioVision() {
    // 导航切换
    initNavigation();
    
    // 身份选择模态框
    initIdentityModal();
    
    // 章节树交互
    initChapterTree();
    
    // 学习步骤交互
    initLearningSteps();
    
    // YouTube按钮交互
    initYouTubeButtons();
    
    // 难度选择器
    initDifficultySelector();
    
    // 知识图谱节点点击
    initConceptNodes();
    
    // 搜索功能
    initSearch();
    
    // 轮播控制
    initCarousel();
    
    // 其他按钮事件
    initButtonEvents();
    
    // 标签管理
    initTagManagement();
}

// 导航切换功能
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 更新导航状态
            navLinks.forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
            
            // 隐藏所有页面内容
            document.querySelectorAll('.page-content').forEach(page => {
                page.classList.remove('active');
            });
            
            // 显示选中的页面
            const pageId = this.getAttribute('data-page');
            document.getElementById(pageId).classList.add('active');
            
            // 滚动到顶部
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// 身份选择模态框功能
function initIdentityModal() {
    const identityModal = document.getElementById('identityModal');
    const registerBtn = document.getElementById('registerBtn');
    const loginBtn = document.getElementById('loginBtn');
    const identityOptions = document.querySelectorAll('.identity-option');
    const confirmIdentityBtn = document.getElementById('confirmIdentity');
    let selectedIdentity = null;
    
    registerBtn.addEventListener('click', () => {
        identityModal.style.display = 'flex';
    });
    
    loginBtn.addEventListener('click', () => {
        identityModal.style.display = 'flex';
    });
    
    identityOptions.forEach(option => {
        option.addEventListener('click', function() {
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

// 章节树交互功能
function initChapterTree() {
    const treeItems = document.querySelectorAll('.tree-item');
    
    treeItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有激活状态
            treeItems.forEach(i => {
                i.classList.remove('active');
            });
            
            // 添加激活状态到点击的项目
            this.classList.add('active');
            
            // 如果是单元，激活第一个概念
            if (this.classList.contains('unit')) {
                const nextConcept = this.nextElementSibling;
                if (nextConcept && nextConcept.classList.contains('concept')) {
                    nextConcept.classList.add('active');
                }
            }
            
            // 如果是概念，更新右侧内容
            if (this.classList.contains('concept')) {
                updateConceptContent(this.textContent, this.getAttribute('data-concept'));
            }
        });
    });
}

// 更新概念内容
function updateConceptContent(conceptName, conceptId) {
    const conceptTitle = document.getElementById('currentConceptTitle');
    if (conceptTitle) {
        conceptTitle.textContent = conceptName;
        
        // 更新概念路径
        const conceptPath = document.getElementById('currentConceptPath');
        if (conceptPath) {
            // 这里可以根据conceptId生成更精确的路径
            conceptPath.textContent = `Unit 1 / Chapter 1 / ${conceptName}`;
        }
        
        // 更新拟人动画标题
        const animationTitle = document.querySelector('.personified-animation h3');
        if (animationTitle) {
            animationTitle.innerHTML = `<i class="fas fa-user-friends"></i> Personified Animation: ${conceptName} (5 min)`;
        }
    }
}

// 学习步骤交互功能
function initLearningSteps() {
    const stepButtons = document.querySelectorAll('.step-btn');
    const stepAnimation = document.getElementById('step-animation');
    
    stepButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const step = this.getAttribute('data-step');
            
            // 移除所有按钮的激活状态
            stepButtons.forEach(b => {
                b.classList.remove('btn-primary');
                b.classList.add('btn-secondary');
            });
            
            // 添加激活状态到当前按钮
            this.classList.remove('btn-secondary');
            this.classList.add('btn-primary');
            
            // 显示动画区域
            if (stepAnimation) {
                stepAnimation.style.display = 'block';
                stepAnimation.innerHTML = `
                    <h5>Step ${step}: ${this.textContent.split(': ')[1]}</h5>
                    <p>Playing animation segment for this step...</p>
                    <div style="background-color: #e9ecef; height: 200px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-top: 1rem;">
                        <i class="fas fa-play-circle" style="font-size: 3rem; color: var(--primary-color);"></i>
                    </div>
                    <button class="btn btn-secondary replay-step-btn" style="margin-top: 1rem;">
                        <i class="fas fa-redo"></i> Replay Step
                    </button>
                `;
                
                // 为回放按钮添加事件
                document.querySelector('.replay-step-btn')?.addEventListener('click', function() {
                    alert(`Replaying step ${step} animation...`);
                });
            }
        });
    });
}

// YouTube按钮交互功能
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

// 难度选择器功能
function initDifficultySelector() {
    const difficultyDots = document.querySelectorAll('.difficulty-dot');
    
    difficultyDots.forEach(dot => {
        dot.addEventListener('click', function() {
            const level = this.getAttribute('data-level');
            
            // 更新激活状态
            difficultyDots.forEach(d => {
                d.classList.remove('active');
            });
            this.classList.add('active');
            
            // 更新难度文本
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

// 知识图谱节点点击功能
function initConceptNodes() {
    const conceptNodes = document.querySelectorAll('.concept-node');
    
    conceptNodes.forEach(node => {
        node.addEventListener('click', function() {
            const concept = this.getAttribute('data-concept');
            alert(`Redirecting to ${concept} learning page...`);
            
            // 切换到Study页面并激活对应的概念
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

// 搜索功能
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            alert(`Searching for: "${this.value}"\n\nSearch results will include:\n- Biology concepts\n- Animations\n- 3D Models\n- Questions\n- Discussion posts`);
        }
    });
}

// 轮播控制功能
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
            
            // 更新轮播点状态
            carouselDots.forEach(d => {
                d.classList.remove('active');
            });
            this.classList.add('active');
            
            // 更新轮播内容
            if (carouselTitle && carouselText) {
                carouselTitle.textContent = carouselContent[slideIndex].title;
                carouselText.textContent = carouselContent[slideIndex].text;
            }
        });
    });
    
    // 自动轮播
    let currentSlide = 0;
    setInterval(() => {
        currentSlide = (currentSlide + 1) % carouselDots.length;
        
        // 更新轮播点
        carouselDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // 更新内容
        if (carouselTitle && carouselText) {
            carouselTitle.textContent = carouselContent[currentSlide].title;
            carouselText.textContent = carouselContent[currentSlide].text;
        }
    }, 5000);
}

// 其他按钮事件
function initButtonEvents() {
    // 创建帖子按钮
    document.getElementById('createPostBtn')?.addEventListener('click', function() {
        alert('Opening post creation form...\nYou can: Write question, Select Unit/Concept, Add tags');
    });
    
    // 捐赠按钮
    document.getElementById('donateBtn')?.addEventListener('click', function() {
        alert('Thank you for considering a donation! This feature will redirect to a secure payment gateway.');
    });
    
    // 查看3D模型按钮
    document.getElementById('view3dModelBtn')?.addEventListener('click', function() {
        alert('Opening 3D model viewer...');
    });
    
    // 查看所有动画按钮
    document.getElementById('viewAllAnimationsBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Opening animation library...');
    });
    
    // 查看所有模型按钮
    document.getElementById('viewAllModelsBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Opening 3D model library...');
    });
    
    // 查看模型按钮
    document.querySelectorAll('.view-model-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const model = this.getAttribute('data-model');
            alert(`Opening ${model} 3D model viewer...`);
        });
    });
    
    // 打开知识图谱按钮
    document.getElementById('openKnowledgeGraphBtn')?.addEventListener('click', function() {
        alert('Opening full knowledge graph visualization...');
    });
    
    // 开始练习按钮
    document.getElementById('startPracticeBtn')?.addEventListener('click', function() {
        alert('Starting past exam paper practice...');
    });
    
    // 选择单元按钮
    document.getElementById('selectUnitBtn')?.addEventListener('click', function() {
        alert('Opening unit selection dialog...');
    });
    
    // 开始训练按钮
    document.getElementById('startTrainingBtn')?.addEventListener('click', function() {
        alert('Starting adaptive difficulty training...');
    });
    
    // 显示解释按钮
    document.getElementById('showExplanationBtn')?.addEventListener('click', function() {
        alert('Showing detailed explanation for the sample question...');
    });
    
    // 前往概念按钮
    document.getElementById('goToConceptBtn')?.addEventListener('click', function() {
        alert('Redirecting to Water Properties concept page...');
    });
    
    // 保存问题按钮
    document.getElementById('saveQuestionBtn')?.addEventListener('click', function() {
        alert('Question saved to your collection!');
    });
    
    // 查看错题按钮
    document.getElementById('viewMistakesBtn')?.addEventListener('click', function() {
        alert('Opening mistake collection...');
    });
    
    // 管理保存内容按钮
    document.getElementById('manageSavedBtn')?.addEventListener('click', function() {
        alert('Opening saved content management...');
    });
    
    // 播放动画按钮
    document.getElementById('playAnimationBtn')?.addEventListener('click', function() {
        alert('Playing personified animation...');
    });
    
    // 下载动画按钮
    document.getElementById('downloadAnimationBtn')?.addEventListener('click', function() {
        alert('Downloading animation file...');
    });
    
    // 观看视频按钮
    document.getElementById('watchVideoBtn')?.addEventListener('click', function() {
        alert('Opening video player...');
    });
    
    // 保存概念按钮
    document.getElementById('saveConceptBtn')?.addEventListener('click', function() {
        alert('Concept saved to your collection!');
    });
    
    // 练习问题按钮
    document.getElementById('practiceQuestionsBtn')?.addEventListener('click', function() {
        alert('Opening practice questions for this concept...');
    });
    
    // 讨论按钮
    document.getElementById('discussionBtn')?.addEventListener('click', function() {
        alert('Opening discussion forum for this concept...');
    });
    
    // 前往图库按钮
    document.getElementById('gotoGalleryBtn')?.addEventListener('click', function() {
        // 切换到Gallery页面
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

// 标签管理功能
function initTagManagement() {
    // 标签点击事件
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', function() {
            // 如果标签有data-tag属性，处理过滤
            if (this.hasAttribute('data-tag')) {
                const tagValue = this.getAttribute('data-tag');
                
                // 移除所有激活状态
                tags.forEach(t => t.classList.remove('active'));
                
                // 激活当前标签
                this.classList.add('active');
                
                // 这里可以添加过滤内容的逻辑
                console.log(`Filtering by tag: ${tagValue}`);
            }
        });
    });
    
    // 添加新标签功能
    const addTagBtn = document.getElementById('addTagBtn');
    const newTagName = document.getElementById('newTagName');
    const newTagColor = document.getElementById('newTagColor');
    const userTags = document.getElementById('userTags');
    
    if (addTagBtn && newTagName && newTagColor && userTags) {
        addTagBtn.addEventListener('click', function() {
            const tagName = newTagName.value.trim();
            if (!tagName) {
                alert('Please enter a tag name');
                return;
            }
            
            // 创建新标签
            const newTag = document.createElement('span');
            newTag.className = 'tag';
            newTag.textContent = tagName;
            
            // 添加颜色类
            const colorClass = newTagColor.value;
            if (colorClass !== 'primary') {
                newTag.style.backgroundColor = `var(--${colorClass}-color, rgba(42, 157, 143, 0.1))`;
                newTag.style.color = `var(--${colorClass}-color, var(--primary-color))`;
            }
            
            // 添加到容器
            userTags.appendChild(newTag);
            
            // 清空输入
            newTagName.value = '';
            
            alert(`Tag "${tagName}" added successfully!`);
        });
    }
}

// 导出函数供全局使用（如果需要）
window.BioVision = {
    init: initBioVision,
    updateConceptContent: updateConceptContent
};