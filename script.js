// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', function() {
    // 初始化应用
    initBioVision();
});

// 主应用初始化函数
function initBioVision() {
    // 滚动时折叠搜索框
    initScrollHeader();
    
    // 导航切换
    initNavigation();
    
    // 身份选择模态框
    initIdentityModal();
    
    // 章节树交互
    initChapterTree();
    
    // 资源库筛选
    initGalleryFilters();
    
    // 考试页面交互
    initExamPage();
    
    // 讨论区交互
    initForumPage();
    
    // 个人中心交互
    initMyBioPage();
    
    // 按钮事件
    initButtonEvents();
    
    // 搜索功能
    initSearchFunctionality();
}

// 滚动时折叠搜索框
function initScrollHeader() {
    const header = document.getElementById('mainHeader');
    const headerSearch = document.getElementById('headerSearch');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            // 向下滚动超过100px，折叠搜索框
            if (scrollTop > lastScrollTop) {
                // 向下滚动
                header.classList.add('compact');
            } else {
                // 向上滚动
                header.classList.remove('compact');
            }
        } else {
            // 接近顶部，始终显示搜索框
            header.classList.remove('compact');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
}

// 导航切换功能
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const exploreBtn = document.getElementById('exploreBtn');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.classList.contains('active')) return;
            
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
            
            // 更新浏览器历史记录
            history.pushState(null, '', `#${pageId}`);
        });
    });
    
    // 探索按钮点击事件
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function() {
            // 切换到学习页面
            document.querySelectorAll('.nav-link').forEach(item => {
                item.classList.remove('active');
            });
            document.querySelector('[data-page="study"]').classList.add('active');
            
            document.querySelectorAll('.page-content').forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById('study').classList.add('active');
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // 处理浏览器前进/后退
    window.addEventListener('popstate', function() {
        const hash = window.location.hash.substring(1) || 'home';
        
        // 更新导航
        document.querySelectorAll('.nav-link').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${hash}"]`).classList.add('active');
        
        // 更新页面内容
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(hash).classList.add('active');
    });
    
    // 初始化页面（基于hash）
    const initialPage = window.location.hash.substring(1) || 'home';
    document.querySelectorAll('.nav-link').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-page="${initialPage}"]`).classList.add('active');
    
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(initialPage).classList.add('active');
}

// 身份选择模态框功能
function initIdentityModal() {
    const identityModal = document.getElementById('identityModal');
    const registerBtn = document.getElementById('registerBtn');
    const loginBtn = document.getElementById('loginBtn');
    const identityOptions = document.querySelectorAll('.identity-option');
    const confirmIdentityBtn = document.getElementById('confirmIdentity');
    let selectedIdentity = null;
    
    // 显示模态框
    const showModal = () => {
        identityModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    };
    
    // 隐藏模态框
    const hideModal = () => {
        identityModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };
    
    // 注册/登录按钮点击
    if (registerBtn) registerBtn.addEventListener('click', showModal);
    if (loginBtn) loginBtn.addEventListener('click', showModal);
    
    // 身份选项点击
    identityOptions.forEach(option => {
        option.addEventListener('click', function() {
            identityOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedIdentity = this.getAttribute('data-identity');
            confirmIdentityBtn.disabled = false;
            
            // 更新确认按钮文本
            if (selectedIdentity === 'educator') {
                confirmIdentityBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Coming Soon';
            } else {
                confirmIdentityBtn.textContent = 'Continue as Student';
            }
        });
    });
    
    // 确认身份
    confirmIdentityBtn.addEventListener('click', () => {
        if (selectedIdentity) {
            hideModal();
            if (selectedIdentity === 'student') {
                alert('Redirecting to student registration/login page...');
                // 这里可以添加实际的重定向逻辑
            } else {
                alert('Educator features are currently under development. You will be redirected to a waiting list.');
            }
        }
    });
    
    // 点击模态框外部关闭
    identityModal.addEventListener('click', (e) => {
        if (e.target === identityModal) {
            hideModal();
        }
    });
    
    // ESC键关闭模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && identityModal.style.display === 'flex') {
            hideModal();
        }
    });
}

// 章节树交互功能
function initChapterTree() {
    const treeItems = document.querySelectorAll('.tree-item');
    const treeToggle = document.getElementById('treeToggle');
    const treeContent = document.getElementById('treeContent');
    let treeExpanded = true;
    
    // 切换章节树展开/折叠
    if (treeToggle) {
        treeToggle.addEventListener('click', function() {
            treeExpanded = !treeExpanded;
            
            if (treeExpanded) {
                treeContent.style.maxHeight = '600px';
                treeContent.style.opacity = '1';
                treeToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
            } else {
                treeContent.style.maxHeight = '0';
                treeContent.style.opacity = '0';
                treeToggle.innerHTML = '<i class="fas fa-chevron-up"></i>';
            }
        });
    }
    
    // 章节树项点击
    treeItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有激活状态
            treeItems.forEach(i => {
                i.classList.remove('active');
            });
            
            // 添加激活状态到点击的项目
            this.classList.add('active');
            
            // 如果是单元，展开子项
            if (this.classList.contains('unit')) {
                const unitId = this.getAttribute('data-unit');
                const subsection = this.nextElementSibling;
                
                if (subsection && subsection.classList.contains('tree-subsection')) {
                    // 切换显示/隐藏
                    if (subsection.style.display === 'none') {
                        subsection.style.display = 'block';
                        this.querySelector('i').className = 'fas fa-folder-open';
                    }
                }
            }
            
            // 如果是概念，更新右侧内容
            if (this.classList.contains('concept')) {
                const conceptName = this.querySelector('span').textContent;
                updateConceptContent(conceptName);
            }
        });
    });
    
    // 初始化所有单元为展开状态
    document.querySelectorAll('.tree-subsection').forEach(subsection => {
        subsection.style.display = 'block';
    });
}

// 更新概念内容
function updateConceptContent(conceptName) {
    // 这里可以添加AJAX请求来获取概念内容
    // 目前只是模拟更新
    const conceptTitle = document.querySelector('.concept-title h3');
    if (conceptTitle) {
        conceptTitle.textContent = conceptName;
        
        // 更新概念路径
        const conceptPath = document.querySelector('.concept-path');
        if (conceptPath) {
            conceptPath.textContent = `Unit 1 / Chapter 1 / ${conceptName}`;
        }
    }
}

// 资源库筛选功能
function initGalleryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const resourceCards = document.querySelectorAll('.resource-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 更新按钮激活状态
            const filterGroup = this.closest('.filter-options');
            filterGroup.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            // 获取筛选条件
            const filterContainer = this.closest('.filter-group');
            const filterType = filterContainer.querySelector('h5').textContent;
            const filterValue = this.getAttribute('data-filter') || this.getAttribute('data-unit');
            
            // 筛选资源
            filterResources(filterType, filterValue);
        });
    });
    
    // 筛选资源函数
    function filterResources(filterType, filterValue) {
        let visibleCards = 0;
        
        resourceCards.forEach(card => {
            let showCard = true;
            
            // 应用所有筛选条件
            document.querySelectorAll('.filter-group').forEach(group => {
                const activeBtn = group.querySelector('.filter-btn.active');
                if (activeBtn) {
                    const attr = activeBtn.hasAttribute('data-filter') ? 'data-filter' : 'data-unit';
                    const value = activeBtn.getAttribute(attr);
                    
                    if (value !== 'all') {
                        const cardValue = card.getAttribute(attr);
                        if (cardValue !== value) {
                            showCard = false;
                        }
                    }
                }
            });
            
            if (showCard) {
                card.style.display = 'block';
                visibleCards++;
                // 添加动画效果
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        // 如果没有显示任何卡片，显示消息
        if (visibleCards === 0) {
            showNoResultsMessage();
        }
    }
    
    function showNoResultsMessage() {
        // 检查是否已经显示了消息
        if (!document.querySelector('.no-results-message')) {
            const message = document.createElement('div');
            message.className = 'no-results-message';
            message.innerHTML = `
                <i class="fas fa-search"></i>
                <h4>No resources found</h4>
                <p>Try adjusting your filters to see more results.</p>
            `;
            message.style.cssText = `
                text-align: center;
                padding: 40px;
                background-color: white;
                border-radius: var(--border-radius);
                box-shadow: var(--box-shadow);
                margin-top: 20px;
            `;
            
            const galleryGrid = document.querySelector('.gallery-grid');
            galleryGrid.appendChild(message);
        }
    }
}

// 考试页面交互
function initExamPage() {
    // 难度级别选择
    const difficultyLevels = document.querySelectorAll('.difficulty-level');
    
    difficultyLevels.forEach(level => {
        level.addEventListener('click', function() {
            // 更新激活状态
            difficultyLevels.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const selectedLevel = this.getAttribute('data-level');
            updateExamDifficulty(selectedLevel);
        });
    });
    
    // 考试选项按钮
    const examButtons = document.querySelectorAll('.btn-exam');
    
    examButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const examType = this.getAttribute('data-exam');
            startExam(examType);
        });
    });
    
    // 单选题交互
    const radioOptions = document.querySelectorAll('input[name="sample-question"]');
    
    radioOptions.forEach(option => {
        option.addEventListener('change', function() {
            const selectedOption = this.closest('.option');
            const allOptions = document.querySelectorAll('.option');
            
            // 移除所有正确/错误标记（除了预标记的正确选项）
            allOptions.forEach(opt => {
                if (!opt.classList.contains('correct')) {
                    opt.classList.remove('incorrect');
                    opt.style.backgroundColor = '';
                }
            });
            
            // 标记选中的选项（如果不是正确选项）
            if (!selectedOption.classList.contains('correct')) {
                selectedOption.classList.add('incorrect');
                selectedOption.style.backgroundColor = 'rgba(231, 111, 81, 0.1)';
            }
            
            // 显示解释
            const explanation = document.querySelector('.question-explanation');
            if (explanation) {
                explanation.style.display = 'block';
            }
        });
    });
}

function updateExamDifficulty(level) {
    // 这里可以添加根据难度级别更新考试内容的逻辑
    console.log(`Exam difficulty updated to level ${level}`);
}

function startExam(examType) {
    let message = '';
    
    switch(examType) {
        case 'past':
            message = 'Starting past exam paper practice...';
            break;
        case 'unit':
            message = 'Opening unit selection dialog...';
            break;
        case 'adaptive':
            message = 'Starting adaptive difficulty training...';
            break;
        default:
            message = 'Starting exam...';
    }
    
    alert(message);
    // 这里可以添加实际开始考试的逻辑
}

// 讨论区交互
function initForumPage() {
    const createPostBtn = document.getElementById('createPostBtn');
    
    if (createPostBtn) {
        createPostBtn.addEventListener('click', function() {
            alert('Opening post creation form...\nYou can: Write question, Select Unit/Concept, Add tags');
            // 这里可以添加打开创建帖子表单的逻辑
        });
    }
    
    // 讨论卡片点击
    const discussionCards = document.querySelectorAll('.discussion-card');
    
    discussionCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // 如果不是按钮点击，则跳转到讨论详情
            if (!e.target.closest('button')) {
                const title = this.querySelector('h5').textContent;
                alert(`Opening discussion: "${title}"`);
                // 这里可以添加实际跳转到讨论详情的逻辑
            }
        });
    });
}

// 个人中心交互
function initMyBioPage() {
    // 这里可以添加个人中心特有的交互逻辑
    // 例如：编辑个人信息、查看详细统计数据等
}

// 按钮事件
function initButtonEvents() {
    // 保存概念按钮
    const saveConceptBtn = document.getElementById('saveConceptBtn');
    if (saveConceptBtn) {
        saveConceptBtn.addEventListener('click', function() {
            const conceptName = document.querySelector('.concept-title h3').textContent;
            alert(`"${conceptName}" saved to your collection!`);
            // 这里可以添加实际保存到本地存储或后端的逻辑
        });
    }
    
    // 开始测验按钮
    const startQuizBtn = document.getElementById('startQuizBtn');
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', function() {
            alert('Starting quiz on current concept...');
            // 这里可以添加开始测验的逻辑
        });
    }
}

// 搜索功能
function initSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    
    const performSearch = () => {
        const query = searchInput.value.trim();
        if (query) {
            alert(`Searching for: "${query}"\n\nSearch results will include:\n- Biology concepts\n- Animations\n- 3D Models\n- Questions\n- Discussion posts`);
            // 这里可以添加实际搜索逻辑
        }
    };
    
    // 搜索按钮点击
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    // 搜索输入框回车键
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// 导出函数供全局使用（如果需要）
window.BioVision = {
    init: initBioVision,
    updateConceptContent: updateConceptContent
};