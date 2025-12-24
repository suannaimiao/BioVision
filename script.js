document.addEventListener('DOMContentLoaded', function () {
    initHeaderScroll();
    initNavigation();
    initSearch();
    initCarousel();
    initLearningSteps();
    initDifficultySelector();
    initConceptNodes();
    initIdentityModal();
    initTagManagement();

    // 监听页面切换，只在切换到 study 页面时初始化
    document.addEventListener('pageChange', function (e) {
        if (e.detail.page === 'study') {
            console.log('切换到学习页面，重新初始化');
            initStudyPage();
            initCollapsibleTree();
            loadDynamicContent();
        } else if (e.detail.page === 'gallery') {
            console.log('初始化资源库页面');
            initGalleryPage();
        } else if (e.detail.page === 'exam') {
            console.log('初始化考试页面');
            initExamPage();
        } else if (e.detail.page === 'forum') {
            console.log('初始化讨论区页面');
            initForumPage(); // 新增的行
        }
        // 页面切换后滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 确保初始状态正确
    ensureInitialState();

});


// 初始化考试页面
function initExamPage() {
    console.log('初始化考试页面功能');

    // 初始化目录树跳转功能
    initExamTreeNavigation();

    // 初始化难度选择
    initDifficultySelection();

    // 初始化开始考试按钮
    initExamStartButtons();

    // 初始化考试设置模态框
    initExamSettingsModal();

    // 初始化单元选择
    initUnitSelection();

    // 初始化概念练习按钮
    initConceptPracticeButtons();

    // 初始化自适应训练按钮
    initAdaptiveTraining();

    // 初始化过滤标签
    initExamTagFilters();

    // 初始化示例题目交互
    initSampleQuestion();

    // 修正卡片对齐问题
    fixExamCardAlignment();

    // 监听窗口大小变化，重新对齐
    window.addEventListener('resize', fixExamCardAlignment);
}

// 初始化考试目录树跳转
function initExamTreeNavigation() {
    const treeUnits = document.querySelectorAll('#exam .tree-unit');

    treeUnits.forEach(unit => {
        unit.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            // 移除所有活动状态
            treeUnits.forEach(u => {
                u.classList.remove('active');
            });

            // 添加当前活动状态
            this.classList.add('active');

            // 获取目标区域
            const targetSelector = this.getAttribute('data-target');
            const targetSection = document.querySelector(targetSelector);

            if (targetSection) {
                // 计算导航栏高度
                const header = document.querySelector('.site-header');
                const headerHeight = header ? header.offsetHeight : 80;

                // 计算目标位置（减去导航栏高度）
                const targetPosition = targetSection.offsetTop - headerHeight;

                // 平滑滚动到目标位置
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // 添加高亮效果
                targetSection.classList.add('highlight-section');
                setTimeout(() => {
                    targetSection.classList.remove('highlight-section');
                }, 1500);

                console.log('跳转到:', targetSelector);
            }
        });
    });
}

// 初始化难度选择
function initDifficultySelection() {
    // 左侧难度面板
    const difficultyOptions = document.querySelectorAll('#exam .difficulty-option');

    difficultyOptions.forEach(option => {
        option.addEventListener('click', function () {
            const difficulty = this.getAttribute('data-difficulty');

            // 更新按钮状态
            difficultyOptions.forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');

            // 过滤卡片显示
            filterExamCardsByDifficulty(difficulty);

            // 更新全局难度设置
            updateGlobalDifficulty(difficulty);

            console.log('难度设置为:', difficulty);
        });
    });

    // 应用设置按钮
    document.getElementById('applySettingsBtn')?.addEventListener('click', function () {
        const timerValue = document.getElementById('examTimer')?.value || 60;
        const activeDifficulty = document.querySelector('#exam .difficulty-option.active');
        const difficulty = activeDifficulty ? activeDifficulty.getAttribute('data-difficulty') : 'mixed';

        alert(`设置已应用:\n时间: ${timerValue}分钟\n难度: ${difficulty}`);
    });
}

// 过滤考试卡片
function filterExamCardsByDifficulty(difficulty) {
    const examCards = document.querySelectorAll('#exam .exam-card');

    examCards.forEach(card => {
        const cardDifficulty = card.getAttribute('data-difficulty');

        if (difficulty === 'mixed' || cardDifficulty === difficulty) {
            card.style.display = 'block';
            card.classList.add('fade-in');
            setTimeout(() => {
                card.classList.remove('fade-in');
            }, 300);
        } else {
            card.style.display = 'none';
        }
    });

    // 更新显示数量
    updateExamCardCount();
}

// 更新考试卡片计数
function updateExamCardCount() {
    const visibleCards = document.querySelectorAll('#exam .exam-card[style="display: block"]').length;
    const totalCards = document.querySelectorAll('#exam .exam-card').length;

    // 创建或更新计数显示
    let counter = document.querySelector('#exam .exam-counter');
    if (!counter) {
        counter = document.createElement('div');
        counter.className = 'exam-counter';
        counter.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: var(--primary-color);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
            z-index: 100;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        `;
        document.body.appendChild(counter);
    }

    counter.textContent = `显示 ${visibleCards} / ${totalCards} 个试卷`;
    counter.style.opacity = '1';

    setTimeout(() => {
        counter.style.opacity = '0';
        setTimeout(() => {
            if (counter.parentNode) {
                document.body.removeChild(counter);
            }
        }, 500);
    }, 3000);
}

// 更新全局难度设置
function updateGlobalDifficulty(difficulty) {
    // 更新难度标签显示
    const difficultyTexts = {
        'easy': '简单',
        'normal': '普通',
        'difficult': '困难',
        'mixed': '混合'
    };

    const difficultyTag = document.querySelector('#exam .difficulty-tag');
    if (difficultyTag) {
        difficultyTag.className = 'difficulty-tag ' + difficulty;
        difficultyTag.textContent = difficultyTexts[difficulty] || difficulty;
    }

    // 保存设置到localStorage
    localStorage.setItem('examDifficulty', difficulty);
}

// 初始化开始考试按钮
function initExamStartButtons() {
    const startButtons = document.querySelectorAll('#exam .start-exam-btn, .start-concept-btn, #startUnitPracticeBtn, #startAdaptiveBtn');

    startButtons.forEach(button => {
        button.addEventListener('click', function () {
            // 打开考试设置模态框
            openExamSettingsModal(this);
        });
    });

    // 预览按钮
    const previewButtons = document.querySelectorAll('#exam .preview-exam-btn');
    previewButtons.forEach(button => {
        button.addEventListener('click', function () {
            const card = this.closest('.card');
            const title = card.querySelector('h3').textContent;

            alert(`预览试卷: ${title}\n\n提示: 在实际应用中，这里会显示试卷预览页面。`);
        });
    });

    // 查看概念按钮
    const viewConceptButtons = document.querySelectorAll('#exam .view-concept-btn');
    viewConceptButtons.forEach(button => {
        button.addEventListener('click', function () {
            const card = this.closest('.concept-card');
            const concept = card.getAttribute('data-concept');

            alert(`跳转到概念页面: ${concept}\n\n提示: 在实际应用中，这里会跳转到相应的学习页面。`);
        });
    });
}

// 打开考试设置模态框
function openExamSettingsModal(button) {
    const modal = document.getElementById('examSettingsModal');
    if (!modal) return;

    // 根据按钮类型设置不同的默认值
    const buttonType = button.className.includes('start-exam-btn') ? 'exam' :
        button.className.includes('start-concept-btn') ? 'concept' :
            button.className.includes('startUnitPracticeBtn') ? 'unit' : 'adaptive';

    // 显示模态框
    modal.style.display = 'flex';

    // 设置模态框标题
    const modalTitle = modal.querySelector('h3');
    const examTitle = button.closest('.card')?.querySelector('h3')?.textContent || '练习';

    if (modalTitle) {
        switch (buttonType) {
            case 'exam':
                modalTitle.innerHTML = `<i class="fas fa-file-alt"></i> 开始试卷: ${examTitle}`;
                break;
            case 'concept':
                modalTitle.innerHTML = `<i class="fas fa-lightbulb"></i> 开始概念练习: ${examTitle}`;
                break;
            case 'unit':
                modalTitle.innerHTML = `<i class="fas fa-book"></i> 开始单元练习`;
                break;
            case 'adaptive':
                modalTitle.innerHTML = `<i class="fas fa-robot"></i> 开始自适应训练`;
                break;
        }
    }

    // 存储按钮信息，用于开始考试
    modal.setAttribute('data-button-type', buttonType);
    modal.setAttribute('data-exam-id', button.getAttribute('data-exam') || '');
}

// 初始化考试设置模态框
function initExamSettingsModal() {
    const modal = document.getElementById('examSettingsModal');
    if (!modal) return;

    // 关闭按钮
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('#cancelExamBtn');

    [closeBtn, cancelBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function () {
                modal.style.display = 'none';
            });
        }
    });

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });


    // 时间选择
    const timerOptions = modal.querySelectorAll('.timer-option');
    timerOptions.forEach(option => {
        option.addEventListener('click', function () {
            timerOptions.forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // 难度选择
    const difficultyOptions = modal.querySelectorAll('.difficulty-option');
    difficultyOptions.forEach(option => {
        option.addEventListener('click', function () {
            difficultyOptions.forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // 题目数量滑块
    const slider = modal.querySelector('#questionCountSlider');
    const sliderValue = modal.querySelector('#questionCountValue');

    if (slider && sliderValue) {
        slider.addEventListener('input', function () {
            sliderValue.textContent = this.value;
        });
    }

    // 开始考试按钮
    const startExamBtn = modal.querySelector('#startExamBtn');
    if (startExamBtn) {
        startExamBtn.addEventListener('click', function () {
            // 获取设置
            const activeTimer = modal.querySelector('.timer-option.active');
            const activeDifficulty = modal.querySelector('.difficulty-option.active');
            const questionCount = slider ? slider.value : 25;

            const time = activeTimer ? activeTimer.getAttribute('data-minutes') : 60;
            const difficulty = activeDifficulty ? activeDifficulty.getAttribute('data-difficulty') : 'normal';
            const buttonType = modal.getAttribute('data-button-type');
            const examId = modal.getAttribute('data-exam-id');

            // 关闭模态框
            modal.style.display = 'none';

            // 开始考试
            startExam(buttonType, examId, {
                time: parseInt(time),
                difficulty: difficulty,
                questionCount: parseInt(questionCount)
            });
        });
    }

    // 点击模态框外部关闭
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// 为考试进行中弹窗添加关闭功能
function initExamInProgressModal() {
    const examModal = document.getElementById('examInProgressModal');
    if (!examModal) return;

    // 关闭按钮
    const closeBtn = examModal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            examModal.style.display = 'none';

            // 停止计时器
            const timerInterval = examModal.getAttribute('data-timer-interval');
            if (timerInterval) {
                clearInterval(parseInt(timerInterval));
            }
        });
    }

    // 点击模态框外部关闭
    examModal.addEventListener('click', function (e) {
        if (e.target === examModal) {
            examModal.style.display = 'none';

            // 停止计时器
            const timerInterval = examModal.getAttribute('data-timer-interval');
            if (timerInterval) {
                clearInterval(parseInt(timerInterval));
            }
        }
    });
}


// 修正考试卡片高度不对齐问题
function fixExamCardAlignment() {
    console.log('修正考试卡片对齐问题...');

    // 获取所有考试卡片
    const examCards = document.querySelectorAll('#exam .exam-card');
    const conceptCards = document.querySelectorAll('#exam .concept-card');
    const allCards = [...examCards, ...conceptCards];

    // 如果没有卡片，直接返回
    if (allCards.length === 0) return;

    // 重置所有卡片的最小高度
    allCards.forEach(card => {
        card.style.minHeight = 'auto';
    });

    // 计算每行卡片的最大高度
    setTimeout(() => {
        // 按容器分组卡片
        const containers = document.querySelectorAll('#exam .card-container');

        containers.forEach(container => {
            const cardsInContainer = container.querySelectorAll('.card');
            if (cardsInContainer.length > 0) {
                let maxHeight = 0;

                // 计算这一行卡片的最大高度
                cardsInContainer.forEach(card => {
                    const cardHeight = card.offsetHeight;
                    if (cardHeight > maxHeight) {
                        maxHeight = cardHeight;
                    }
                });

                // 设置所有卡片为相同的最小高度
                cardsInContainer.forEach(card => {
                    card.style.minHeight = `${maxHeight}px`;
                    card.style.display = 'flex';
                    card.style.flexDirection = 'column';

                    // 确保卡片内容正确布局
                    const cardBody = card.querySelector('.card-body');
                    if (cardBody) {
                        cardBody.style.flex = '1';
                        cardBody.style.display = 'flex';
                        cardBody.style.flexDirection = 'column';

                        // 确保标签和底部对齐
                        const tags = cardBody.querySelector('.resource-tags');
                        if (tags) {
                            tags.style.marginTop = 'auto';
                            tags.style.paddingTop = '1rem';
                        }
                    }
                });
            }
        });

        console.log('考试卡片高度已对齐');
    }, 100);
}
// 开始考试
function startExam(buttonType, examId, settings) {
    console.log('开始考试:', { buttonType, examId, settings });

    // 显示考试进行中模态框
    const examModal = document.getElementById('examInProgressModal');
    if (!examModal) return;

    initExamInProgressModal();

    // 设置考试信息
    const examTitle = examModal.querySelector('h3');
    const timeMinutes = examModal.querySelector('#minutes');
    const timeSeconds = examModal.querySelector('#seconds');

    // 根据类型设置标题
    let title = '';
    switch (buttonType) {
        case 'exam':
            title = '考试进行中';
            break;
        case 'concept':
            title = '概念练习';
            break;
        case 'unit':
            title = '单元练习';
            break;
        case 'adaptive':
            title = '自适应训练';
            break;
    }

    examTitle.innerHTML = `<i class="fas fa-hourglass-half"></i> ${title}`;

    // 设置时间
    timeMinutes.textContent = settings.time.toString().padStart(2, '0');
    timeSeconds.textContent = '00';

    // 设置题目数量
    examModal.querySelector('#totalQuestions').textContent = settings.questionCount;
    examModal.querySelector('#currentQuestion').textContent = '1';
    examModal.querySelector('#progressPercentage').textContent = '4%';

    // 更新进度条
    const progressFill = examModal.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = '4%';
    }

    // 显示考试模态框
    examModal.style.display = 'flex';

    // 开始计时器
    startExamTimer(settings.time);

    // 初始化考试问题
    initExamQuestions(buttonType, settings);
}

// 开始考试计时器
function startExamTimer(minutes) {
    const examModal = document.getElementById('examInProgressModal');
    if (!examModal) return;

    let totalSeconds = minutes * 60;
    const timeMinutes = examModal.querySelector('#minutes');
    const timeSeconds = examModal.querySelector('#seconds');

    const timerInterval = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            alert('时间到！考试结束。');
            examModal.style.display = 'none';
            return;
        }

        totalSeconds--;
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;

        timeMinutes.textContent = mins.toString().padStart(2, '0');
        timeSeconds.textContent = secs.toString().padStart(2, '0');
    }, 1000);

    // 存储计时器ID以便清理
    examModal.setAttribute('data-timer-interval', timerInterval);
}

// 初始化考试问题
function initExamQuestions(buttonType, settings) {
    const examModal = document.getElementById('examInProgressModal');
    if (!examModal) return;

    // 问题导航
    const previousBtn = examModal.querySelector('#previousQuestionBtn');
    const nextBtn = examModal.querySelector('#nextQuestionBtn');
    const flagBtn = examModal.querySelector('#flagQuestionBtn');

    let currentQuestion = 1;
    const totalQuestions = settings.questionCount;

    // 更新问题显示
    function updateQuestionDisplay() {
        examModal.querySelector('#currentQuestion').textContent = currentQuestion;
        examModal.querySelector('#progressPercentage').textContent =
            Math.round((currentQuestion / totalQuestions) * 100) + '%';

        // 更新进度条
        const progressFill = examModal.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = (currentQuestion / totalQuestions * 100) + '%';
        }

        // 更新按钮状态
        previousBtn.disabled = currentQuestion === 1;
        nextBtn.innerHTML = currentQuestion === totalQuestions ?
            'Submit <i class="fas fa-check"></i>' :
            'Next <i class="fas fa-arrow-right"></i>';

        // 更新问题内容（模拟）
        updateQuestionContent(currentQuestion);
    }

    // 前一题
    previousBtn.addEventListener('click', function () {
        if (currentQuestion > 1) {
            currentQuestion--;
            updateQuestionDisplay();
        }
    });

    // 下一题
    nextBtn.addEventListener('click', function () {
        if (currentQuestion < totalQuestions) {
            currentQuestion++;
            updateQuestionDisplay();
        } else {
            // 提交考试
            submitExam();
        }
    });

    // 标记问题
    flagBtn.addEventListener('click', function () {
        const icon = this.querySelector('i');
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            this.classList.add('btn-primary');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            this.classList.remove('btn-primary');
        }
    });

    // 初始显示
    updateQuestionDisplay();
}

// 更新问题内容
function updateQuestionContent(questionNumber) {
    const examModal = document.getElementById('examInProgressModal');
    if (!examModal) return;

    const questionText = examModal.querySelector('#examQuestionText');
    const options = examModal.querySelectorAll('.exam-option');

    // 模拟不同的问题内容
    const questions = [
        "Which of the following properties of water is responsible for its high surface tension?",
        "What is the primary function of the mitochondria in eukaryotic cells?",
        "Which process produces the most ATP during cellular respiration?",
        "In DNA replication, which enzyme is responsible for unwinding the double helix?",
        "Which of the following best describes natural selection?"
    ];

    const questionIndex = (questionNumber - 1) % questions.length;
    questionText.textContent = questions[questionIndex];

    // 清空选项选择
    options.forEach(option => {
        const radio = option.querySelector('input[type="radio"]');
        if (radio) radio.checked = false;
    });
}

// 提交考试
function submitExam() {
    const examModal = document.getElementById('examInProgressModal');
    if (!examModal) return;

    // 停止计时器
    const timerInterval = examModal.getAttribute('data-timer-interval');
    if (timerInterval) {
        clearInterval(parseInt(timerInterval));
    }

    // 关闭模态框
    examModal.style.display = 'none';

    // 显示结果
    alert('考试已提交！\n\n系统正在评分...\n\n提示：在实际应用中，这里会显示详细的结果分析。');
}

// 初始化单元选择
function initUnitSelection() {
    const unitOptions = document.querySelectorAll('#exam .unit-option');

    unitOptions.forEach(option => {
        option.addEventListener('click', function () {
            const unit = this.getAttribute('data-unit');

            // 更新按钮状态
            unitOptions.forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');

            console.log('选择单元:', unit);

            // 更新难度选择区域显示
            updateDifficultySelectionForUnit(unit);
        });
    });

    // 难度级别选择
    const difficultyLevels = document.querySelectorAll('#exam .difficulty-level');
    difficultyLevels.forEach(level => {
        level.addEventListener('click', function () {
            const difficulty = this.getAttribute('data-level');

            // 更新按钮状态
            difficultyLevels.forEach(lvl => {
                lvl.classList.remove('active');
            });
            this.classList.add('active');

            console.log('选择难度级别:', difficulty);
        });
    });
}

// 更新单元难度选择
function updateDifficultySelectionForUnit(unit) {
    const unitNames = {
        '1': '化学基础',
        '2': '细胞结构',
        '3': '细胞代谢',
        '4': '遗传学'
    };

    const unitName = unitNames[unit] || `Unit ${unit}`;

    // 更新标题
    const selectorTitle = document.querySelector('#exam .difficulty-selector h4');
    if (selectorTitle) {
        selectorTitle.innerHTML = `<i class="fas fa-sliders-h"></i> 为${unitName}选择难度`;
    }
}

// 初始化概念练习按钮
function initConceptPracticeButtons() {
    const conceptCards = document.querySelectorAll('#exam .concept-card');

    conceptCards.forEach(card => {
        card.addEventListener('click', function (e) {
            // 如果不是点击按钮，则高亮卡片
            if (!e.target.closest('button')) {
                conceptCards.forEach(c => {
                    c.classList.remove('selected');
                });
                this.classList.add('selected');
            }
        });
    });
}

// 初始化自适应训练
function initAdaptiveTraining() {
    const startAdaptiveBtn = document.getElementById('startAdaptiveBtn');
    const viewAllGeneralBtn = document.getElementById('viewAllGeneralBtn');

    if (startAdaptiveBtn) {
        startAdaptiveBtn.addEventListener('click', function () {
            // 打开设置模态框
            openExamSettingsModal(this);
        });
    }

    if (viewAllGeneralBtn) {
        viewAllGeneralBtn.addEventListener('click', function () {
            alert('打开所有一般问题列表...\n\n提示：在实际应用中，这里会显示所有问题的列表。');
        });
    }
}

// 初始化考试标签过滤
function initExamTagFilters() {
    const filterTags = document.querySelectorAll('#exam .filter-tags .tag');

    filterTags.forEach(tag => {
        tag.addEventListener('click', function () {
            const unit = this.getAttribute('data-unit');

            // 更新标签状态
            filterTags.forEach(t => {
                t.classList.remove('active');
            });
            this.classList.add('active');

            console.log('过滤单元:', unit);

            // 在实际应用中，这里会过滤显示对应单元的问题
            // 现在是模拟功能
            if (unit === 'all') {
                alert('显示所有单元的问题');
            } else {
                alert(`显示Unit ${unit}的问题`);
            }
        });
    });
}

// 初始化示例题目交互
function initSampleQuestion() {
    const showExplanationBtn = document.getElementById('showExplanationBtn');
    const goToConceptBtn = document.getElementById('goToConceptBtn');
    const addTagBtn = document.getElementById('addTagBtn');
    const saveQuestionBtn = document.getElementById('saveQuestionBtn');

    if (showExplanationBtn) {
        showExplanationBtn.addEventListener('click', function () {
            alert('正确答案: C) Cohesion\n\n解释: 水的表面张力是由水分子之间的内聚力（cohesion）引起的。内聚力是相同分子之间的吸引力，使得水分子在水面上形成紧密的薄膜。');
        });
    }

    if (goToConceptBtn) {
        goToConceptBtn.addEventListener('click', function () {
            alert('跳转到"水的特性"概念页面...');
        });
    }

    if (addTagBtn) {
        addTagBtn.addEventListener('click', function () {
            alert('添加标签到题目...\n\n提示：在实际应用中，这里会打开标签选择器。');
        });
    }

    if (saveQuestionBtn) {
        saveQuestionBtn.addEventListener('click', function () {
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                alert('题目已保存到收藏！');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                alert('题目已从收藏中移除！');
            }
        });
    }
}

// 确保初始状态正确
function ensureInitialState() {
    const homePage = document.getElementById('home');
    const studyPage = document.getElementById('study');
    const galleryPage = document.getElementById('gallery');

    // 检查是否有多个活动页面
    const activePages = document.querySelectorAll('.page-content.active');
    if (activePages.length > 1) {
        activePages.forEach((page, index) => {
            if (index > 0) page.classList.remove('active');
        });
    }

    // 如果学习页面或资源库页面是初始活动页面，纠正为首页
    if (studyPage && studyPage.classList.contains('active')) {
        studyPage.classList.remove('active');
        console.log('已纠正初始页面状态：显示首页');
    }

    if (galleryPage && galleryPage.classList.contains('active')) {
        galleryPage.classList.remove('active');
        console.log('已纠正初始页面状态：显示首页');
    }
}

// 在initStudyPage函数中确保视频相关初始化
function initStudyPage() {
    console.log('初始化学习页面功能');

    // 确保视频容器存在并正确初始化
    ensureVideoContainer();

    fixMissingTooltips();

    initVideoPlayers();
    initStepAnimations(); // 调用修复后的函数

    initYouTubeButtons();
    initPracticeQuestions();
    initDiscussionSection();

    // 检查关键词元素
    const keywords = document.querySelectorAll('.keyword');
    console.log('学习页面 - 找到关键词数量:', keywords.length);
    keywords.forEach((kw, index) => {
        const tooltip = kw.querySelector('.keyword-tooltip');
        const hasContent = tooltip && tooltip.querySelector('h5') && tooltip.querySelector('p');
        console.log(`关键词 ${index + 1}:`, kw.textContent.trim(), '- 工具提示完整:', hasContent);
    });

    initKeywordTooltips();
    initButtonEvents();
    initResourceNavigation();
    initQuestionFilters();

    // 确保步骤动画容器可见
    const stepAnimation = document.getElementById('step-animation');
    if (stepAnimation) {
        stepAnimation.style.display = 'block';
        stepAnimation.style.visibility = 'visible';
        stepAnimation.style.opacity = '1';
    }
}


function ensureVideoContainer() {
    const stepAnimation = document.getElementById('step-animation');
    if (!stepAnimation) return;

    // 检查视频容器是否存在
    let videoContainer = document.getElementById('video-container');
    let stepIframe = document.getElementById('stepVideo');

    // 如果不存在，创建它们
    if (!videoContainer) {
        console.log('创建视频容器...');
        videoContainer = document.createElement('div');
        videoContainer.id = 'video-container';
        videoContainer.style.width = '100%';
        videoContainer.style.height = '400px';
        videoContainer.style.minHeight = '400px';
        videoContainer.style.position = 'relative';
        videoContainer.style.display = 'block';

        // 找到正确的位置插入视频容器
        const contentElement = stepAnimation.querySelector('p');
        if (contentElement) {
            contentElement.parentNode.insertBefore(videoContainer, contentElement.nextElementSibling);
        }
    }

    if (!stepIframe) {
        console.log('创建iframe...');
        stepIframe = document.createElement('iframe');
        stepIframe.id = 'stepVideo';
        stepIframe.className = 'video-player';
        stepIframe.src = 'https://www.youtube.com/embed/3jwAGWky98c'; // 默认视频
        stepIframe.frameBorder = '0';
        stepIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        stepIframe.allowFullscreen = true;
        stepIframe.style.width = '100%';
        stepIframe.style.height = '400px';
        stepIframe.style.minHeight = '400px';
        stepIframe.style.border = 'none';
        stepIframe.style.display = 'block';

        videoContainer.innerHTML = '';
        videoContainer.appendChild(stepIframe);
    }
}

function initHeaderScroll() {
    const header = document.querySelector('.site-header');
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const pages = document.querySelectorAll('.page-content');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
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

    searchInput.addEventListener('keypress', function (e) {
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
        dot.addEventListener('click', function () {
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
        item.addEventListener('click', function () {
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

// 初始化视频播放器
function initVideoPlayers() {
    const videoPlaceholders = document.querySelectorAll('.video-placeholder');

    videoPlaceholders.forEach(placeholder => {
        placeholder.addEventListener('click', function () {
            const videoId = this.id;
            playVideo(videoId);
        });
    });

    // 播放完整视频按钮
    document.getElementById('watchVideoBtn')?.addEventListener('click', function () {
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
        btn.addEventListener('click', function () {
            const step = this.getAttribute('data-step');

            stepButtons.forEach(b => {
                b.classList.remove('btn-primary');
                b.classList.add('btn-secondary');
            });

            this.classList.remove('btn-secondary');
            this.classList.add('btn-primary');

            if (stepAnimation) {
                stepAnimation.style.display = 'block';

                document.querySelector('.replay-step-btn')?.addEventListener('click', function () {
                    alert(`Replaying step ${step} animation...`);
                });
            }
        });
    });
}

// 初始化步骤动画
// 初始化步骤动画 - 修复版本
function initStepAnimations() {
    console.log('初始化步骤动画...');
    const stepButtons = document.querySelectorAll('.step-btn');
    const stepAnimation = document.getElementById('step-animation');

    if (!stepButtons.length || !stepAnimation) {
        console.error('缺少必要的DOM元素');
        return;
    }

    const stepVideos = {
        '1': '3jwAGWky98c',
        '2': 'qgVFkRn8f10',
        '3': '6EDBlowVST0',
        '4': 'AOtJk7pq0bs'
    };

    const steps = {
        '1': {
            title: 'Step 1: Polarity of Water Molecules',
            content: 'Water molecules are polar because oxygen is more electronegative than hydrogen, creating partial charges that allow hydrogen bonding.'
        },
        '2': {
            title: 'Step 2: Cohesion',
            content: 'Hydrogen bonds cause water molecules to stick together, creating surface tension and allowing water to form droplets.'
        },
        '3': {
            title: 'Step 3: Adhesion',
            content: 'Water molecules adhere to other surfaces, enabling capillary action in plants and other biological systems.'
        },
        '4': {
            title: 'Step 4: Solvent Properties',
            content: 'Water\'s polarity makes it an excellent solvent for ionic compounds and polar molecules, essential for biochemical reactions.'
        }
    };

    // 确保初始视频容器正确
    const videoContainer = document.getElementById('video-container');
    const stepIframe = document.getElementById('stepVideo');

    if (videoContainer) {
        videoContainer.style.height = '400px';
        videoContainer.style.minHeight = '400px';
        videoContainer.style.position = 'relative';
        videoContainer.style.display = 'block';
    }

    if (stepIframe) {
        stepIframe.style.height = '400px';
        stepIframe.style.minHeight = '400px';
        stepIframe.style.width = '100%';
        stepIframe.style.border = 'none';
        stepIframe.style.display = 'block';
    }

    stepButtons.forEach((btn) => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const step = this.getAttribute('data-step');
            console.log('切换步骤到:', step);

            // 更新按钮状态
            stepButtons.forEach(b => {
                b.classList.remove('active');
            });

            this.classList.add('active');

            const videoId = stepVideos[step];

            if (videoId) {
                console.log('加载视频:', videoId);

                // 更新iframe的src，保留视频容器
                const newSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

                // 确保视频容器存在
                let videoContainer = document.getElementById('video-container');
                let stepIframe = document.getElementById('stepVideo');

                // 如果视频容器不存在，重新创建
                if (!videoContainer) {
                    console.log('视频容器不存在，重新创建...');
                    videoContainer = document.createElement('div');
                    videoContainer.id = 'video-container';
                    videoContainer.style.width = '100%';
                    videoContainer.style.height = '400px';
                    videoContainer.style.minHeight = '400px';
                    videoContainer.style.position = 'relative';
                    videoContainer.style.display = 'block';

                    // 找到正确的位置插入视频容器
                    const contentElement = stepAnimation.querySelector('p');
                    if (contentElement && contentElement.nextElementSibling) {
                        contentElement.parentNode.insertBefore(videoContainer, contentElement.nextElementSibling);
                    }
                }

                // 如果iframe不存在，创建新的
                if (!stepIframe || !videoContainer.contains(stepIframe)) {
                    console.log('创建新的iframe...');
                    stepIframe = document.createElement('iframe');
                    stepIframe.id = 'stepVideo';
                    stepIframe.className = 'video-player';
                    stepIframe.frameBorder = '0';
                    stepIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                    stepIframe.allowFullscreen = true;
                    stepIframe.style.width = '100%';
                    stepIframe.style.height = '400px';
                    stepIframe.style.minHeight = '400px';
                    stepIframe.style.border = 'none';
                    stepIframe.style.display = 'block';

                    videoContainer.innerHTML = '';
                    videoContainer.appendChild(stepIframe);
                }

                // 更新视频src
                stepIframe.src = newSrc;

                // 确保容器高度
                videoContainer.style.height = '400px';
                videoContainer.style.minHeight = '400px';
                videoContainer.style.display = 'block';
            }

            // 更新标题和内容 - 只更新文本，不替换整个容器
            const currentStep = steps[step];
            if (currentStep) {
                const titleElement = stepAnimation.querySelector('h5');
                const contentElement = stepAnimation.querySelector('p');

                if (titleElement) {
                    titleElement.textContent = currentStep.title;
                }

                if (contentElement) {
                    contentElement.textContent = currentStep.content;
                }

                console.log('更新步骤内容:', currentStep.title);
            }

            // 确保动画区域可见
            stepAnimation.style.display = 'block';
            stepAnimation.style.visibility = 'visible';
            stepAnimation.style.opacity = '1';
        });
    });

    // 初始化第一个按钮为激活状态
    if (stepButtons.length > 0) {
        stepButtons[0].classList.add('active');
    }
}


// 初始化YouTube按钮
function initYouTubeButtons() {
    const youtubeButtons = document.querySelectorAll('.yt-btn');

    youtubeButtons.forEach(btn => {
        btn.addEventListener('click', function () {
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
        dot.addEventListener('click', function () {
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
        node.addEventListener('click', function () {
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
        btn.addEventListener('click', function () {
            const questionItem = this.closest('.question-item');
            const options = questionItem.querySelectorAll('.option');
            let correctAnswer = '';

            // 根据难度设置正确答案（模拟）
            const difficulty = questionItem.getAttribute('data-difficulty');
            switch (difficulty) {
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
        btn.addEventListener('click', function () {
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
        startQuizBtn.addEventListener('click', function () {
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
        createPostBtn.addEventListener('click', function () {
            alert('Opening post creation form...\nYou can create a new discussion post here.');
        });
    }

    if (viewAllDiscussionsBtn) {
        viewAllDiscussionsBtn.addEventListener('click', function () {
            alert('Redirecting to full discussion forum...');
            // 实际应用中这里会跳转到讨论区页面
        });
    }

    // 讨论项点击事件
    discussionItems.forEach(item => {
        item.addEventListener('click', function (e) {
            if (!e.target.closest('.reply-count') && !e.target.closest('button')) {
                alert('Opening discussion thread...');
            }
        });
    });
}

// 初始化关键词工具提示
// 初始化关键词工具提示 - 修复版本
function initKeywordTooltips() {
    console.log('初始化关键词工具提示...');
    const keywords = document.querySelectorAll('.keyword');

    if (!keywords.length) {
        console.warn('未找到关键词元素');
        return;
    }

    // 移除全局容器方式，改为每个关键词独立控制
    keywords.forEach(keyword => {
        const tooltip = keyword.querySelector('.keyword-tooltip');
        const closeBtn = tooltip?.querySelector('.tooltip-close');

        if (!tooltip) {
            console.warn('关键词缺少工具提示:', keyword.textContent.trim());
            return;
        }

        // 点击关键词显示/隐藏工具提示
        keyword.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const isActive = this.classList.contains('active');

            // 关闭所有其他工具提示
            keywords.forEach(k => {
                if (k !== this) {
                    k.classList.remove('active');
                }
            });

            // 切换当前工具提示
            if (!isActive) {
                this.classList.add('active');
                console.log('显示工具提示:', this.getAttribute('data-keyword') || this.textContent.trim());
            } else {
                this.classList.remove('active');
            }
        });

        // 点击关闭按钮
        if (closeBtn) {
            closeBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                keyword.classList.remove('active');
                console.log('关闭工具提示');
            });
        }

        // 为工具提示本身添加点击事件，防止点击工具提示内部时关闭
        tooltip.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });

    // 点击页面其他地方关闭所有工具提示
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.keyword') && !e.target.closest('.keyword-tooltip')) {
            keywords.forEach(keyword => {
                keyword.classList.remove('active');
            });
        }
    });

    // 确保默认不显示任何工具提示
    keywords.forEach(keyword => {
        keyword.classList.remove('active');
    });

    console.log('关键词工具提示初始化完成，找到', keywords.length, '个关键词');
}


// 初始化按钮事件
function initButtonEvents() {
    // 移除可能会引起冲突的事件监听器
    const saveBtn = document.getElementById('saveConceptBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function (e) {
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
    document.getElementById('playAnimationBtn').addEventListener('click', function () {
        const video = document.getElementById('personifiedVideo');
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });

    // 下载动画按钮
    document.getElementById('downloadAnimationBtn')?.addEventListener('click', function () {
        alert('Downloading animation file...\nMP4 format, 5 minutes, 1080p');
    });

    // 查看所有问题按钮
    document.getElementById('viewAllQuestionsBtn')?.addEventListener('click', function () {
        alert('Opening full question bank for this concept...');
    });

    // 查看模型按钮
    document.querySelectorAll('.view-model-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const model = this.closest('.model-card').getAttribute('data-model');
            alert(`Opening 3D model viewer for: ${model}\nInteractive 3D visualization will load.`);
        });
    });

    // document.getElementById('createPostBtn')?.addEventListener('click', function() {
    //     alert('Opening post creation form...\nYou can: Write question, Select Unit/Concept, Add tags');
    // });

    document.getElementById('donateBtn')?.addEventListener('click', function () {
        alert('Thank you for considering a donation! This feature will redirect to a secure payment gateway.');
    });

    document.getElementById('view3dModelBtn')?.addEventListener('click', function () {
        alert('Opening 3D model viewer...');
    });

    document.getElementById('viewAllAnimationsBtn')?.addEventListener('click', function (e) {
        e.preventDefault();
        alert('Opening animation library...');
    });

    document.getElementById('viewAllModelsBtn')?.addEventListener('click', function (e) {
        e.preventDefault();
        alert('Opening 3D model library...');
    });

    document.querySelectorAll('.view-model-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const model = this.getAttribute('data-model');
            alert(`Opening ${model} 3D model viewer...`);
        });
    });

    document.getElementById('openKnowledgeGraphBtn')?.addEventListener('click', function () {
        alert('Opening full knowledge graph visualization...');
    });

    document.getElementById('startPracticeBtn')?.addEventListener('click', function () {
        alert('Starting past exam paper practice...');
    });

    document.getElementById('selectUnitBtn')?.addEventListener('click', function () {
        alert('Opening unit selection dialog...');
    });

    document.getElementById('startTrainingBtn')?.addEventListener('click', function () {
        alert('Starting adaptive difficulty training...');
    });

    document.getElementById('showExplanationBtn')?.addEventListener('click', function () {
        alert('Showing detailed explanation for the sample question...');
    });

    document.getElementById('goToConceptBtn')?.addEventListener('click', function () {
        alert('Redirecting to Water Properties concept page...');
    });

    document.getElementById('saveQuestionBtn')?.addEventListener('click', function () {
        alert('Question saved to your collection!');
    });

    document.getElementById('viewMistakesBtn')?.addEventListener('click', function () {
        alert('Opening mistake collection...');
    });

    document.getElementById('manageSavedBtn')?.addEventListener('click', function () {
        alert('Opening saved content management...');
    });

    document.getElementById('playAnimationBtn')?.addEventListener('click', function () {
        alert('Playing personified animation...');
    });

    document.getElementById('downloadAnimationBtn')?.addEventListener('click', function () {
        alert('Downloading animation file...');
    });

    document.getElementById('watchVideoBtn')?.addEventListener('click', function () {
        alert('Opening video player...');
    });

    document.getElementById('saveConceptBtn')?.addEventListener('click', function () {
        alert('Concept saved to your collection!');
    });

    document.getElementById('practiceQuestionsBtn')?.addEventListener('click', function () {
        alert('Opening practice questions for this concept...');
    });

    document.getElementById('discussionBtn')?.addEventListener('click', function () {
        alert('Opening discussion forum for this concept...');
    });

    document.getElementById('gotoGalleryBtn')?.addEventListener('click', function () {
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
    document.getElementById('gotoGalleryBtn')?.addEventListener('click', function () {
        alert('Redirecting to animation and 3D model gallery...');
        // 实际应用中这里会切换到Gallery页面
    });

    document.getElementById('view3dModelBtn')?.addEventListener('click', function () {
        alert('Opening 3D model gallery with all available models...');
    });

    document.getElementById('downloadNotesBtn')?.addEventListener('click', function () {
        alert('Downloading concept notes as PDF...');
    });
}

// 初始化题目过滤器
function initQuestionFilters() {
    const tags = document.querySelectorAll('.tag[data-tag]');
    const questionItems = document.querySelectorAll('.question-item');

    tags.forEach(tag => {
        tag.addEventListener('click', function () {
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
        tag.addEventListener('click', function () {
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
        addNewTagBtn.addEventListener('click', function () {
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
    document.querySelector('.chapter-tree').addEventListener('click', function (e) {
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

            unitHeader.addEventListener('click', function () {
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
document.addEventListener('keydown', function (e) {
    // 只在学习页面生效
    if (!document.getElementById('study').classList.contains('active')) return;

    const activeConcept = document.querySelector('.tree-concept.active');
    if (!activeConcept) return;

    switch (e.key) {
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


// 修复缺失的工具提示内容
function fixMissingTooltips() {
    console.log('检查并修复缺失的工具提示内容...');

    const keywords = document.querySelectorAll('.keyword');

    keywords.forEach(keyword => {
        const tooltip = keyword.querySelector('.keyword-tooltip');
        if (!tooltip) return;

        // 检查tooltip是否有内容
        const hasContent = tooltip.querySelector('h5') && tooltip.querySelector('p');
        const keywordText = keyword.getAttribute('data-keyword') || keyword.textContent.trim().toLowerCase();

        if (!hasContent) {
            console.log('修复缺失内容的工具提示:', keywordText);

            // 根据关键词类型添加内容
            let title = '';
            let content = '';

            switch (keywordText) {
                case 'cohesion':
                    title = 'Cohesion';
                    content = 'The attraction between molecules of the same substance. In water, hydrogen bonds cause molecules to stick together.';
                    break;
                case 'adhesion':
                    title = 'Adhesion';
                    content = 'The attraction between molecules of different substances. Water adheres to surfaces, allowing capillary action.';
                    break;
                default:
                    title = keywordText.charAt(0).toUpperCase() + keywordText.slice(1);
                    content = `Definition for ${keywordText}...`;
            }

            // 创建内容
            const titleElement = document.createElement('h5');
            titleElement.textContent = title;

            const contentElement = document.createElement('p');
            contentElement.textContent = content;

            // 确保关闭按钮存在
            let closeBtn = tooltip.querySelector('.tooltip-close');
            if (!closeBtn) {
                closeBtn = document.createElement('span');
                closeBtn.className = 'tooltip-close';
                closeBtn.innerHTML = '×';
                tooltip.appendChild(closeBtn);
            }

            // 添加内容到tooltip
            tooltip.appendChild(titleElement);
            tooltip.appendChild(contentElement);
        }
    });
}




// 资源库

// 初始化资源库页面
function initGalleryPage() {
    console.log('初始化资源库页面功能');

    // 初始化目录树跳转功能
    initGalleryTreeNavigation();

    // 初始化资源卡片交互
    initResourceCards();

    // 初始化标签过滤功能
    initGalleryTagFilters();

    // 初始化知识图谱节点
    initGalleryConceptNodes();

    // 初始化查看全部按钮
    initViewAllButtons();

    // 修复：使用新的错误标签过滤函数
    initMistakeTagFilters();

    // 修复：初始化错误概念链接
    initMistakeConceptLinks();

    // // 初始化错误标签过滤
    // initMistakeTags();
}

// 初始化资源库目录树跳转
function initGalleryTreeNavigation() {
    const treeUnits = document.querySelectorAll('#gallery .tree-unit');

    treeUnits.forEach(unit => {
        unit.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            // 移除所有活动状态
            treeUnits.forEach(u => {
                u.classList.remove('active');
            });

            // 添加当前活动状态
            this.classList.add('active');

            // 获取目标区域
            const targetSelector = this.getAttribute('data-target');
            const targetSection = document.querySelector(targetSelector);

            if (targetSection) {
                // 计算导航栏高度
                const header = document.querySelector('.site-header');
                const headerHeight = header ? header.offsetHeight : 80;

                // 计算目标位置（减去导航栏高度）
                const targetPosition = targetSection.offsetTop - headerHeight;

                // 平滑滚动到目标位置
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // 添加高亮效果
                targetSection.classList.add('highlight-section');
                setTimeout(() => {
                    targetSection.classList.remove('highlight-section');
                }, 1500);

                console.log('跳转到:', targetSelector);
            } else {
                console.error('找不到目标元素:', targetSelector);
                alert(`无法跳转到 ${targetSelector}，该章节不存在或ID不匹配。`);
            }
        });
    });

    // 添加键盘导航支持
    document.addEventListener('keydown', function (e) {
        // 只在资源库页面生效
        if (!document.getElementById('gallery').classList.contains('active')) return;

        const activeUnit = document.querySelector('#gallery .tree-unit.active');
        if (!activeUnit) return;

        const allUnits = Array.from(document.querySelectorAll('#gallery .tree-unit'));
        const currentIndex = allUnits.indexOf(activeUnit);

        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                if (currentIndex > 0) {
                    allUnits[currentIndex - 1].click();
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (currentIndex < allUnits.length - 1) {
                    allUnits[currentIndex + 1].click();
                }
                break;
            case 'Home':
                e.preventDefault();
                allUnits[0].click();
                break;
            case 'End':
                e.preventDefault();
                allUnits[allUnits.length - 1].click();
                break;
        }
    });
}

// 初始化资源卡片交互
function initResourceCards() {
    // 播放动画/预览资源按钮
    const previewButtons = document.querySelectorAll('.preview-resource-btn, .view-model-btn, .download-resource-btn');

    previewButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const card = this.closest('.resource-card');
            const resourceType = card.getAttribute('data-type');
            const resourceTitle = card.querySelector('h3').textContent;
            const tags = card.getAttribute('data-tags');

            // 根据按钮类型执行不同操作
            if (this.classList.contains('preview-resource-btn')) {
                if (resourceType === 'animation' || resourceType === 'video') {
                    openResourceModal(resourceTitle, 'preview', resourceType);
                }
            } else if (this.classList.contains('view-model-btn')) {
                openResourceModal(resourceTitle, '3dviewer', resourceType);
            } else if (this.classList.contains('download-resource-btn')) {
                openResourceModal(resourceTitle, 'download', resourceType);
            }
        });
    });

    // 卡片悬停效果
    const resourceCards = document.querySelectorAll('.resource-card');
    resourceCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
        });

        // 卡片点击（可选，提供更多信息）
        card.addEventListener('click', function (e) {
            // 确保不是点击了按钮
            if (!e.target.closest('button')) {
                const title = this.querySelector('h3').textContent;
                const description = this.querySelector('.resource-card-body p').textContent;
                const tags = Array.from(this.querySelectorAll('.tag')).map(tag => tag.textContent);

                showResourceDetails(title, description, tags);
            }
        });
    });
}

// 打开资源模态框
function openResourceModal(title, action, resourceType) {
    const modalMessages = {
        'preview': {
            'animation': `播放动画: ${title}`,
            'video': `播放视频: ${title}`
        },
        '3dviewer': `打开3D模型查看器: ${title}`,
        'download': `下载资源: ${title}`
    };

    const message = modalMessages[action] ?
        modalMessages[action][resourceType] || modalMessages[action] :
        `执行 ${action} 操作: ${title}`;

    alert(`${message}\n\n提示: 在实际应用中，这里会打开相应的查看器或下载文件。`);
}

// 显示资源详情
function showResourceDetails(title, description, tags) {
    // 创建详情模态框
    const modal = document.createElement('div');
    modal.className = 'resource-modal';
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 20px 50px rgba(0,0,0,0.2);
        z-index: 1000;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    `;

    modal.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
            <h3 style="color: var(--primary-color); margin-bottom: 1rem;">${title}</h3>
            <p style="color: #666; line-height: 1.6;">${description}</p>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
            <h4 style="color: #555; margin-bottom: 0.5rem;">标签:</h4>
            <div>${tags.map(tag => `<span class="tag" style="margin-right: 0.5rem;">${tag}</span>`).join('')}</div>
        </div>
        
        <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;">
            <button class="btn btn-secondary" id="closeResourceModal">关闭</button>
            <button class="btn btn-primary" id="openResourceBtn">打开资源</button>
        </div>
    `;

    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 999;
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    // 添加事件监听器
    document.getElementById('closeResourceModal').addEventListener('click', () => {
        document.body.removeChild(modal);
        document.body.removeChild(overlay);
    });

    document.getElementById('openResourceBtn').addEventListener('click', () => {
        alert(`正在打开: ${title}`);
        document.body.removeChild(modal);
        document.body.removeChild(overlay);
    });

    // 点击遮罩层关闭
    overlay.addEventListener('click', () => {
        document.body.removeChild(modal);
        document.body.removeChild(overlay);
    });
}

// 初始化画廊标签过滤
function initGalleryTagFilters() {
    const tags = document.querySelectorAll('#animation-section .tag-container .tag, #models-section .tag-container .tag');
    const resourceCards = document.querySelectorAll('#gallery .resource-card');

    tags.forEach(tag => {
        tag.addEventListener('click', function () {
            const selectedTag = this.getAttribute('data-tag');

            // 更新标签状态
            tags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // 过滤资源卡片
            resourceCards.forEach(card => {
                if (selectedTag === 'all') {
                    card.style.display = 'block';
                } else {
                    const cardTags = card.getAttribute('data-tags');
                    if (cardTags && cardTags.includes(selectedTag)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });

            // 添加动画效果
            const visibleCards = Array.from(resourceCards).filter(card =>
                card.style.display !== 'none'
            );

            visibleCards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.05}s`;
                card.classList.add('fade-in');
                setTimeout(() => {
                    card.classList.remove('fade-in');
                }, 300);
            });

            // 更新计数
            updateResourceCount(visibleCards.length, resourceCards.length);
        });
    });
}

// 更新资源计数
function updateResourceCount(visible, total) {
    // 可以添加计数显示元素
    let counter = document.querySelector('.resource-counter');
    if (!counter) {
        counter = document.createElement('div');
        counter.className = 'resource-counter';
        counter.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
            z-index: 100;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        `;
        document.body.appendChild(counter);
    }

    counter.textContent = `显示 ${visible} / ${total} 个资源`;
    counter.style.opacity = '1';

    // 3秒后淡出
    setTimeout(() => {
        counter.style.opacity = '0';
        setTimeout(() => {
            if (counter.parentNode) {
                document.body.removeChild(counter);
            }
        }, 500);
    }, 3000);
}

// 初始化知识图谱节点
function initGalleryConceptNodes() {
    const conceptNodes = document.querySelectorAll('#gallery .concept-node');

    conceptNodes.forEach(node => {
        node.addEventListener('click', function () {
            const concept = this.getAttribute('data-concept');
            const title = this.querySelector('h4').textContent;

            // 显示概念详情
            showConceptDetail(concept, title);
        });

        // 悬停效果
        node.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
        });

        node.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        });
    });

    // 打开完整知识图谱按钮
    const openGraphBtn = document.getElementById('openKnowledgeGraphBtn');
    if (openGraphBtn) {
        openGraphBtn.addEventListener('click', function () {
            alert('打开完整知识图谱可视化界面...\n\n提示: 在实际应用中，这里会打开一个交互式知识图谱。');
        });
    }
}

// 显示概念详情
function showConceptDetail(conceptId, title) {
    const conceptDetails = {
        'water-properties': {
            description: '水的特性包括极性、内聚力和粘附力，这些特性使水成为生命的必要物质。',
            relatedConcepts: ['pH Scale', 'Macromolecules', 'Cell Structure'],
            resources: ['Water Properties Explained', 'Cohesion Animation']
        },
        'ph-scale': {
            description: 'pH 值表示溶液的酸碱度，范围从 0（酸性）到 14（碱性），7 为中性。',
            relatedConcepts: ['Water Properties', 'Enzyme Activity'],
            resources: ['pH Scale Interactive', 'Buffer System Animation']
        },
        'macromolecules': {
            description: '生物大分子包括碳水化合物、脂质、蛋白质和核酸，是生命的基础。',
            relatedConcepts: ['Cell Structure', 'Molecular Genetics'],
            resources: ['Macromolecules 3D Model', 'Protein Synthesis Animation']
        }
    };

    const detail = conceptDetails[conceptId] || {
        description: `关于 ${title} 的详细信息。`,
        relatedConcepts: [],
        resources: []
    };

    const modal = document.createElement('div');
    modal.className = 'concept-modal';
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 20px 50px rgba(0,0,0,0.2);
        z-index: 1000;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    `;

    modal.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
            <h3 style="color: var(--primary-color); margin-bottom: 1rem;">${title}</h3>
            <p style="color: #666; line-height: 1.6; margin-bottom: 1.5rem;">${detail.description}</p>
            
            ${detail.relatedConcepts.length ? `
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="color: #555; margin-bottom: 0.5rem;">相关概念:</h4>
                    <div>${detail.relatedConcepts.map(concept =>
        `<span class="tag" style="margin-right: 0.5rem; margin-bottom: 0.5rem;">${concept}</span>`
    ).join('')}</div>
                </div>
            ` : ''}
            
            ${detail.resources.length ? `
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="color: #555; margin-bottom: 0.5rem;">相关资源:</h4>
                    <ul style="padding-left: 1.5rem; color: #666;">
                        ${detail.resources.map(resource =>
        `<li style="margin-bottom: 0.5rem;">${resource}</li>`
    ).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
        
        <div style="display: flex; justify-content: flex-end; gap: 1rem;">
            <button class="btn btn-secondary" id="closeConceptModal">关闭</button>
            <button class="btn btn-primary" id="gotoConceptBtn">前往学习页面</button>
        </div>
    `;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 999;
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    // 事件监听器
    document.getElementById('closeConceptModal').addEventListener('click', () => {
        document.body.removeChild(modal);
        document.body.removeChild(overlay);
    });

    document.getElementById('gotoConceptBtn').addEventListener('click', () => {
        // 导航到学习页面
        document.querySelector('[data-page="study"]').click();
        setTimeout(() => {
            // 模拟选择对应概念
            alert(`正在加载 ${title} 的学习内容...`);
            document.body.removeChild(modal);
            document.body.removeChild(overlay);
        }, 100);
    });

    overlay.addEventListener('click', () => {
        document.body.removeChild(modal);
        document.body.removeChild(overlay);
    });
}

// 初始化查看全部按钮
function initViewAllButtons() {
    const viewAllAnimationsBtn = document.getElementById('viewAllAnimationsBtn');
    const viewAllModelsBtn = document.getElementById('viewAllModelsBtn');

    if (viewAllAnimationsBtn) {
        viewAllAnimationsBtn.addEventListener('click', function (e) {
            e.preventDefault();
            // 过滤只显示动画资源
            filterResourcesByType('animation');
        });
    }

    if (viewAllModelsBtn) {
        viewAllModelsBtn.addEventListener('click', function (e) {
            e.preventDefault();
            // 过滤只显示3D模型
            filterResourcesByType('3dmodel');
        });
    }
}

// 按类型过滤资源
function filterResourcesByType(type) {
    const resourceCards = document.querySelectorAll('#gallery .resource-card');
    const sections = document.querySelectorAll('#gallery .section-title');

    // 隐藏所有卡片
    resourceCards.forEach(card => {
        card.style.display = 'none';
    });

    // 显示指定类型的卡片
    const filteredCards = Array.from(resourceCards).filter(card =>
        card.getAttribute('data-type') === type
    );

    filteredCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.display = 'block';
            card.classList.add('fade-in');
            setTimeout(() => {
                card.classList.remove('fade-in');
            }, 300);
        }, index * 50);
    });

    // 滚动到对应部分
    let targetSection;
    if (type === 'animation') {
        targetSection = document.querySelector('#animation-section') || sections[0];
    } else if (type === '3dmodel') {
        targetSection = document.querySelector('#models-section') || sections[1];
    }

    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // 更新计数
    updateResourceCount(filteredCards.length, resourceCards.length);
}

// 初始化错误标签过滤
function initMistakeTags() {
    const mistakeTags = document.querySelectorAll('#gallery .mistake-tags .tag');
    const mistakeItems = document.querySelectorAll('#gallery .mistake-item');

    if (mistakeTags.length === 0 || mistakeItems.length === 0) return;

    // 创建标签容器（如果不存在）
    let tagContainer = document.querySelector('#gallery .tag-container');
    if (!tagContainer) {
        const mistakesList = document.querySelector('#gallery .mistakes-list');
        if (mistakesList) {
            tagContainer = document.createElement('div');
            tagContainer.className = 'tag-container';
            tagContainer.style.marginBottom = '1rem';
            mistakesList.parentNode.insertBefore(tagContainer, mistakesList);
        }
    }

    // 为每个错误项添加数据属性
    mistakeItems.forEach((item, index) => {
        const tags = Array.from(item.querySelectorAll('.tag')).map(tag =>
            tag.textContent.toLowerCase().replace(/\s+/g, '-')
        );
        item.setAttribute('data-tags', tags.join(' '));
    });

    // 标签点击事件
    mistakeTags.forEach(tag => {
        tag.addEventListener('click', function () {
            const selectedTag = this.textContent.toLowerCase().replace(/\s+/g, '-');

            // 过滤错误项
            mistakeItems.forEach(item => {
                const itemTags = item.getAttribute('data-tags');
                if (itemTags && itemTags.includes(selectedTag)) {
                    item.style.display = 'block';
                    item.classList.add('fade-in');
                    setTimeout(() => {
                        item.classList.remove('fade-in');
                    }, 300);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}


// 修复标签过滤功能
// 修复标签过滤功能的JavaScript - 确保样式正确切换
function initMistakeTagFilters() {
    console.log('初始化错误标签过滤...');

    const filterTags = document.querySelectorAll('#mistakes-section .tag-container .tag');
    const mistakeItems = document.querySelectorAll('#mistakes-section .mistake-item');

    if (!filterTags.length || !mistakeItems.length) {
        console.log('未找到错误标签或错误项');
        return;
    }

    // 为每个错误项添加数据属性
    mistakeItems.forEach((item, index) => {
        const mistakeTags = item.querySelectorAll('.mistake-tags .tag');
        const tagValues = Array.from(mistakeTags).map(tag => {
            const text = tag.textContent.trim().toLowerCase();
            return text.replace(/\s+/g, '-');
        });

        if (item.textContent.includes('Unit 1')) tagValues.push('unit1');
        if (item.textContent.includes('Unit 2')) tagValues.push('unit2');
        if (item.textContent.includes('Unit 3')) tagValues.push('unit3');
        if (item.textContent.includes('Unit 4')) tagValues.push('unit4');

        if (item.textContent.includes('Diagram')) tagValues.push('diagram');

        item.setAttribute('data-tags', tagValues.join(' '));
    });

    // 过滤标签点击事件
    filterTags.forEach(tag => {
        tag.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const selectedTag = this.getAttribute('data-tag');
            console.log('选择标签:', selectedTag);

            // 移除所有标签的活动状态 - 使用更彻底的方法
            filterTags.forEach(t => {
                // 移除所有样式类，然后重新添加基础类
                t.className = 'tag';
                // 确保基础样式
                t.style.backgroundColor = '';
                t.style.color = '';
                t.style.borderColor = '';
                t.style.fontWeight = '';
                t.style.boxShadow = '';
            });

            // 添加当前标签的活动状态
            this.className = 'tag active';
            this.style.backgroundColor = 'var(--primary)';
            this.style.color = 'white';
            this.style.borderColor = 'var(--primary)';
            this.style.fontWeight = '600';
            this.style.boxShadow = '0 2px 8px rgba(42, 157, 143, 0.3)';

            // 过滤错误项
            mistakeItems.forEach(item => {
                const itemTags = item.getAttribute('data-tags');

                if (selectedTag === 'all') {
                    item.style.display = 'block';
                    item.classList.add('fade-in');
                } else if (itemTags && itemTags.includes(selectedTag)) {
                    item.style.display = 'block';
                    item.classList.add('fade-in');
                } else {
                    item.style.display = 'none';
                }

                setTimeout(() => {
                    item.classList.remove('fade-in');
                }, 300);
            });

            // 更新计数显示
            updateMistakeCount(selectedTag);
        });
    });

    // 初始化显示所有错误
    if (filterTags.length > 0) {
        const allTag = document.querySelector('#gallery .tag[data-tag="all"]');
        if (allTag) {
            // 直接设置样式
            allTag.className = 'tag active';
            allTag.style.backgroundColor = 'var(--primary)';
            allTag.style.color = 'white';
            allTag.style.borderColor = 'var(--primary)';
            allTag.style.fontWeight = '600';
            allTag.style.boxShadow = '0 2px 8px rgba(42, 157, 143, 0.3)';

            updateMistakeCount('all');
        }
    }
}

// 更新错误计数
function updateMistakeCount(selectedTag) {
    const mistakeItems = document.querySelectorAll('#gallery .mistake-item');
    let visibleCount = 0;

    if (selectedTag === 'all') {
        visibleCount = mistakeItems.length;
    } else {
        mistakeItems.forEach(item => {
            const itemTags = item.getAttribute('data-tags');
            if (itemTags && itemTags.includes(selectedTag)) {
                visibleCount++;
            }
        });
    }

    // 更新或创建计数显示
    let counter = document.querySelector('#gallery .mistake-counter');
    const container = document.querySelector('#gallery .card-body .tag-container');

    if (!counter && container) {
        counter = document.createElement('div');
        counter.className = 'mistake-counter';
        counter.style.cssText = `
            margin-top: 10px;
            font-size: 0.9rem;
            color: var(--secondary-color);
            font-weight: 500;
        `;
        container.parentNode.insertBefore(counter, container.nextElementSibling);
    }

    if (counter) {
        const tagNames = {
            'all': '所有错误',
            'unit1': '第一单元',
            'unit2': '第二单元',
            'unit3': '第三单元',
            'unit4': '第四单元',
            'difficult': '困难题目',
            'calculation': '计算题',
            'diagram': '图表题'
        };

        counter.textContent = `${tagNames[selectedTag] || selectedTag}: 显示 ${visibleCount} 个错误`;
    }
}

// 修复错误标签点击跳转到概念的功能
function initMistakeConceptLinks() {
    const mistakeTags = document.querySelectorAll('#gallery .mistake-tags .tag');

    mistakeTags.forEach(tag => {
        tag.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const tagText = this.textContent.trim();
            console.log('点击错误标签:', tagText);

            // 根据标签文本跳转到对应概念
            const conceptMap = {
                'Unit 1': 'Water Properties',
                'Unit 2': 'Cell Structure',
                'Unit 3': 'Enzymes',
                'Unit 4': 'Molecular Genetics',
                'Water Properties': 'water-properties',
                'Polarity': 'water-properties',
                'DNA Replication': 'molecular-genetics',
                'Molecular Biology': 'molecular-genetics'
            };

            const conceptName = conceptMap[tagText];
            if (conceptName) {
                // 导航到学习页面
                const studyLink = document.querySelector('[data-page="study"]');
                if (studyLink) {
                    studyLink.click();

                    // 显示提示信息
                    setTimeout(() => {
                        alert(`正在跳转到相关概念: ${conceptName}\n\n您可以在学习页面找到关于 ${tagText} 的详细内容。`);
                    }, 500);
                }
            } else {
                // 如果没有特定概念映射，显示通用提示
                alert(`标签: ${tagText}\n\n提示: 您可以在MyBio中心编辑和管理标签。`);
            }
        });
    });
}

// 初始化讨论区页面
function initForumPage() {
    console.log('初始化讨论区页面功能');

    // 初始化讨论区目录树导航
    initForumTreeNavigation();

    // 初始化创建帖子按钮
    initCreatePostButton();

    // 初始化关注按钮
    initFollowButtons();

    // 初始化概念点击事件
    initForumConceptClicks();

    // 加载初始帖子数据
    loadInitialForumPosts();
}
// 初始化讨论区目录树导航
function initForumTreeNavigation() {
    const treeUnits = document.querySelectorAll('#forum .tree-unit');

    treeUnits.forEach(unit => {
        unit.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            // 移除所有活动状态
            treeUnits.forEach(u => {
                u.classList.remove('active');
                u.classList.remove('expanded');
            });

            // 添加当前活动状态
            this.classList.add('active');

            // 如果是单元，切换展开状态
            const unitId = this.getAttribute('data-target');
            if (unitId && unitId.includes('unit')) {
                const isExpanded = this.classList.contains('expanded');
                if (!isExpanded) {
                    this.classList.add('expanded');
                    const unitContent = this.querySelector('.unit-content');
                    if (unitContent) {
                        unitContent.style.display = 'block';
                    }
                }
            }

            // 获取目标区域
            const targetSelector = this.getAttribute('data-target');
            const targetSection = document.querySelector(targetSelector);

            if (targetSection) {
                // 隐藏所有讨论区
                document.querySelectorAll('#forum .discussion-section').forEach(section => {
                    section.style.display = 'none';
                    section.classList.remove('active');
                });

                // 显示目标讨论区
                targetSection.style.display = 'block';
                targetSection.classList.add('active');

                console.log('切换到讨论区:', targetSelector);
            }
        });
    });

    // 初始展开热门讨论
    const hotDiscussions = document.querySelector('#forum .tree-unit[data-target="#hot-discussions"]');
    if (hotDiscussions) {
        hotDiscussions.classList.add('active');
    }
}


// 加载初始帖子数据
function loadInitialForumPosts() {
    // 初始示例帖子数据
    const initialPosts = [
        {
            id: 'post1',
            title: 'What is the role of primase in DNA replication?',
            author: 'Student A',
            unit: 'Unit 4',
            concept: 'DNA Replication',
            time: '2 hours ago',
            content: 'What is the specific mechanism of primase in DNA replication? Why do we need RNA primers instead of directly using DNA?',
            tags: ['DNA Replication', 'Unit 4', 'Genetics', 'Molecular Biology', 'Help Needed'],
            replies: 15,
            isFollowed: false,
            isMine: false
        },
        {
            id: 'post2',
            title: 'What are the main differences between mitosis and meiosis?',
            author: 'Student B',
            unit: 'Unit 2',
            concept: 'Cell Division',
            time: '5 hours ago',
            content: 'What are the main differences between mitosis and meiosis in terms of process, outcome, and biological significance?',
            tags: ['Cell Division', 'Unit 2', 'Mitosis', 'Meiosis'],
            replies: 8,
            isFollowed: false,
            isMine: false
        },
        {
            id: 'post3',
            title: 'How to understand enzyme specificity?',
            author: 'Student C',
            unit: 'Unit 3',
            concept: 'Enzymes',
            time: '1 day ago',
            content: 'What aspects does enzyme specificity include? How do lock-and-key theory and induced fit theory explain enzyme specificity?',
            tags: ['Enzyme', 'Unit 3', 'Metabolism', 'Specificity', 'Help Needed'],
            replies: 12,
            isFollowed: false,
            isMine: false
        }
    ];

    // 清空所有帖子列表容器
    clearAllDiscussionLists();

    // 添加初始帖子
    initialPosts.forEach(post => {
        addPostToForum(post);
    });
}

// 清空所有讨论列表
function clearAllDiscussionLists() {
    const listContainers = [
        'hotDiscussionList',
        'unit1DiscussionList',
        'unit2DiscussionList',
        'unit3DiscussionList',
        'unit4DiscussionList',
        'myPostsList',
        'followedPostsList'
    ];

    listContainers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
        }
    });
}

// 创建帖子元素
function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.className = 'discussion-item';
    postElement.setAttribute('data-post-id', post.id);
    postElement.setAttribute('data-unit', post.unit.toLowerCase().replace(' ', ''));
    postElement.setAttribute('data-author', post.author);

    // 根据是否是我的帖子添加特殊类
    if (post.isMine) {
        postElement.classList.add('my-post');
    }

    // 格式化标签
    const tagsHtml = post.tags.map(tag =>
        `<span class="tag" data-tag="${tag.toLowerCase().replace(/\s+/g, '-')}">${tag}</span>`
    ).join('');

    // 关注按钮样式
    const followButtonClass = post.isFollowed ? 'btn-follow following' : 'btn-follow';
    const followButtonText = post.isFollowed ? 'Following' : 'Follow';

    postElement.innerHTML = `
        <h4>${post.title}</h4>
        <p class="discussion-meta">
            <span class="user-info">
                <i class="fas fa-user"></i> ${post.author} 
                <button class="${followButtonClass}" data-author="${post.author}">${followButtonText}</button>
            </span> 
            • <span class="unit-info">${post.unit} / ${post.concept}</span> 
            • <span class="time-info">${post.time}</span>
            • <span class="reply-count"><i class="fas fa-comment"></i> ${post.replies} replies</span>
        </p>
        <p>${post.content}</p>
        <div class="tag-container">
            ${tagsHtml}
        </div>
    `;

    return postElement;
}

// 添加帖子到论坛
function addPostToForum(post) {
    const postElement = createPostElement(post);

    // 1. 添加到热门讨论列表
    const hotList = document.getElementById('hotDiscussionList');
    if (hotList && !post.isMine) {
        hotList.appendChild(postElement.cloneNode(true));
    }

    // 2. 根据单元添加到相应单元列表
    const unitNumber = post.unit.match(/\d+/)?.[0];
    if (unitNumber) {
        const unitList = document.getElementById(`unit${unitNumber}DiscussionList`);
        if (unitList) {
            unitList.appendChild(postElement.cloneNode(true));
        }
    }

    // 3. 如果是我的帖子，添加到我的帖子列表
    if (post.isMine) {
        const myPostsList = document.getElementById('myPostsList');
        const emptyMyPosts = document.getElementById('emptyMyPosts');

        if (myPostsList) {
            // 移除空状态提示
            if (emptyMyPosts) {
                emptyMyPosts.style.display = 'none';
            }

            // 添加到我的帖子列表
            myPostsList.appendChild(postElement.cloneNode(true));
        }
    }

    // 4. 如果被关注，添加到关注列表
    if (post.isFollowed) {
        const followedList = document.getElementById('followedPostsList');
        const emptyFollowedPosts = document.getElementById('emptyFollowedPosts');

        if (followedList) {
            // 移除空状态提示
            if (emptyFollowedPosts) {
                emptyFollowedPosts.style.display = 'none';
            }

            // 添加到关注列表
            followedList.appendChild(postElement.cloneNode(true));
        }
    }

    // 重新绑定关注按钮事件
    initFollowButtons();
}

// 显示创建帖子模态框
function showCreatePostModal() {
    const modal = document.createElement('div');
    modal.className = 'forum-modal';
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 20px 50px rgba(0,0,0,0.2);
        z-index: 1000;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    `;

    modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h3 style="color: var(--primary-color); margin: 0;">
                <i class="fas fa-plus"></i> Create New Post (Ask for Help)
            </h3>
            <span class="modal-close" style="font-size: 1.5rem; cursor: pointer; color: #666;">&times;</span>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Title *</label>
            <input type="text" id="postTitle" placeholder="What is your question?" 
                   style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;">
        </div>
        
        <div style="margin-bottom: 1.5rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Content *</label>
            <textarea id="postContent" placeholder="Describe your question in detail..." rows="5"
                      style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; resize: vertical;"></textarea>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
            <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Unit *</label>
                <select id="postUnit" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;">
                    <option value="">Select Unit</option>
                    <option value="1">Unit 1: Chemical Basis of Life</option>
                    <option value="2">Unit 2: Cell Structure</option>
                    <option value="3">Unit 3: Cell Metabolism</option>
                    <option value="4">Unit 4: Genetics</option>
                </select>
            </div>
            
            <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Concept</label>
                <select id="postConcept" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;">
                    <option value="">Select Concept</option>
                    <!-- 概念选项将通过JS动态添加 -->
                </select>
            </div>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Tags (optional)</label>
            <input type="text" id="postTags" placeholder="Add tags separated by commas (e.g., DNA, Replication, Help)" 
                   style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;">
        </div>
        
        <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;">
            <button class="btn btn-secondary" id="cancelPostBtn">Cancel</button>
            <button class="btn btn-primary" id="submitPostBtn">
                <i class="fas fa-paper-plane"></i> Submit Post
            </button>
        </div>
    `;

    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 999;
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    // 单元选择变化时更新概念选项
    const unitSelect = modal.querySelector('#postUnit');
    const conceptSelect = modal.querySelector('#postConcept');

    unitSelect.addEventListener('change', function () {
        conceptSelect.innerHTML = '<option value="">Select Concept</option>';

        const concepts = {
            '1': ['Water Properties', 'pH Scale', 'Macromolecules'],
            '2': ['Cell Membrane', 'Organelles', 'Cell Division'],
            '3': ['Enzymes', 'Cellular Respiration', 'Photosynthesis'],
            '4': ['DNA Replication', 'Protein Synthesis', 'Mendelian Genetics']
        };

        const selectedConcepts = concepts[this.value] || [];
        selectedConcepts.forEach(concept => {
            const option = document.createElement('option');
            option.value = concept.toLowerCase().replace(/\s+/g, '-');
            option.textContent = concept;
            conceptSelect.appendChild(option);
        });
    });

    // 关闭按钮事件
    const closeModal = () => {
        document.body.removeChild(modal);
        document.body.removeChild(overlay);
    };

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('#cancelPostBtn').addEventListener('click', closeModal);

    // 提交帖子按钮
    modal.querySelector('#submitPostBtn').addEventListener('click', () => {
        const title = modal.querySelector('#postTitle').value.trim();
        const content = modal.querySelector('#postContent').value.trim();
        const unitValue = modal.querySelector('#postUnit').value;
        const conceptValue = modal.querySelector('#postConcept').value;
        const tagsInput = modal.querySelector('#postTags').value.trim();

        if (!title || !content || !unitValue) {
            alert('Please fill in all required fields (Title, Content, and Unit).');
            return;
        }

        // 生成新帖子
        const newPost = {
            id: 'post-' + Date.now(),
            title: title,
            author: 'You', // 假设当前用户
            unit: unitValue === '1' ? 'Unit 1' :
                unitValue === '2' ? 'Unit 2' :
                    unitValue === '3' ? 'Unit 3' : 'Unit 4',
            concept: conceptValue ? conceptSelect.options[conceptSelect.selectedIndex].textContent : 'General',
            time: 'Just now',
            content: content,
            tags: tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : ['Help Needed'],
            replies: 0,
            isFollowed: false,
            isMine: true
        };

        // 添加帖子到论坛
        addPostToForum(newPost);

        // 显示成功消息
        const successMessage = document.createElement('div');
        successMessage.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color, #4CAF50);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1001;
            animation: slideInRight 0.3s ease-out;
        `;

        successMessage.innerHTML = `
            <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
            Post created successfully! It will appear in the relevant section.
        `;

        document.body.appendChild(successMessage);

        // 自动切换到我的帖子页面
        setTimeout(() => {
            const myPostsUnit = document.querySelector('#forum .tree-unit[data-target="#my-posts"]');
            if (myPostsUnit) {
                myPostsUnit.click();
            }
        }, 500);

        // 移除成功消息
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => {
                    if (successMessage.parentNode) {
                        document.body.removeChild(successMessage);
                    }
                }, 300);
            }
        }, 3000);

        // 关闭模态框
        closeModal();
    });

    // 点击遮罩层关闭
    overlay.addEventListener('click', closeModal);
}

// 初始化创建帖子按钮
// 初始化创建帖子按钮
function initCreatePostButton() {
    const createPostBtn = document.getElementById('createPostBtn_forum');

    if (createPostBtn) {
        createPostBtn.addEventListener('click', function () {
            // 创建帖子模态框
            const modal = document.createElement('div');
            modal.className = 'forum-modal';
            modal.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 2rem;
                border-radius: 12px;
                box-shadow: 0 20px 50px rgba(0,0,0,0.2);
                z-index: 1000;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            `;

            modal.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3 style="color: var(--primary-color); margin: 0;">
                        <i class="fas fa-plus"></i> Create New Post (Ask for Help)
                    </h3>
                    <span class="modal-close" style="font-size: 1.5rem; cursor: pointer;">&times;</span>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Title *</label>
                    <input type="text" id="postTitle" placeholder="What is your question?" 
                           style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;">
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Content *</label>
                    <textarea id="postContent" placeholder="Describe your question in detail..." rows="5"
                              style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; resize: vertical;"></textarea>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Unit *</label>
                        <select id="postUnit" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;">
                            <option value="">Select Unit</option>
                            <option value="1">Unit 1: Chemical Basis of Life</option>
                            <option value="2">Unit 2: Cell Structure</option>
                            <option value="3">Unit 3: Cell Metabolism</option>
                            <option value="4">Unit 4: Genetics</option>
                        </select>
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Concept</label>
                        <select id="postConcept" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;">
                            <option value="">Select Concept</option>
                        </select>
                    </div>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Tags (optional)</label>
                    <input type="text" id="postTags" placeholder="Add tags separated by commas (e.g., DNA, Replication, Help)" 
                           style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;">
                </div>
                
                <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;">
                    <button class="btn btn-secondary" id="cancelPostBtn">Cancel</button>
                    <button class="btn btn-primary" id="submitPostBtn">Submit Post</button>
                </div>
            `;

            // 创建遮罩层
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 999;
            `;

            document.body.appendChild(overlay);
            document.body.appendChild(modal);

            // 单元选择变化时更新概念选项
            const unitSelect = modal.querySelector('#postUnit');
            const conceptSelect = modal.querySelector('#postConcept');

            unitSelect.addEventListener('change', function () {
                conceptSelect.innerHTML = '<option value="">Select Concept</option>';

                const concepts = {
                    '1': ['Water Properties', 'pH Scale', 'Macromolecules'],
                    '2': ['Cell Membrane', 'Organelles', 'Cell Division'],
                    '3': ['Enzymes', 'Cellular Respiration', 'Photosynthesis'],
                    '4': ['DNA Replication', 'Protein Synthesis', 'Mendelian Genetics']
                };

                const selectedConcepts = concepts[this.value] || [];
                selectedConcepts.forEach(concept => {
                    const option = document.createElement('option');
                    option.value = concept.toLowerCase().replace(/\s+/g, '-');
                    option.textContent = concept;
                    conceptSelect.appendChild(option);
                });
            });

            // 关闭按钮事件
            const closeModal = () => {
                document.body.removeChild(modal);
                document.body.removeChild(overlay);
            };

            modal.querySelector('.modal-close').addEventListener('click', closeModal);
            modal.querySelector('#cancelPostBtn').addEventListener('click', closeModal);

            // 提交帖子按钮
            modal.querySelector('#submitPostBtn').addEventListener('click', () => {
                const title = modal.querySelector('#postTitle').value.trim();
                const content = modal.querySelector('#postContent').value.trim();
                const unitValue = modal.querySelector('#postUnit').value;
                const conceptText = conceptSelect.options[conceptSelect.selectedIndex]?.textContent || 'General';
                const tagsInput = modal.querySelector('#postTags').value.trim();

                if (!title || !content || !unitValue) {
                    alert('Please fill in all required fields (Title, Content, and Unit).');
                    return;
                }

                // 创建新帖子对象
                const newPost = {
                    id: 'post-' + Date.now(),
                    title: title,
                    author: 'You',
                    unit: `Unit ${unitValue}`,
                    concept: conceptText,
                    time: 'Just now',
                    content: content,
                    tags: tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : ['Help Needed'],
                    replies: 0,
                    isFollowed: false,
                    isMine: true
                };

                // 调用函数将帖子添加到论坛
                addPostToForum(newPost);

                // 关闭模态框
                closeModal();

                // 自动切换到"My Posts"视图
                setTimeout(() => {
                    const myPostsUnit = document.querySelector('#forum .tree-unit[data-target="#my-posts"]');
                    if (myPostsUnit) {
                        myPostsUnit.click();
                    }
                }, 100);
            });

            // 点击遮罩层关闭
            overlay.addEventListener('click', closeModal);
        });
    }
}

// 初始化关注按钮
function initFollowButtons() {
    // 为所有关注按钮添加事件监听器
    const followButtons = document.querySelectorAll('#forum .btn-follow');

    followButtons.forEach(button => {
        // 移除现有事件监听器（避免重复绑定）
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        // 设置关注按钮的基础样式
        newButton.style.cssText = `
            margin-left: 0.5rem;
            font-size: 0.8rem;
            background-color: ${newButton.classList.contains('following') ? 'var(--primary-color)' : 'transparent'};
            color: ${newButton.classList.contains('following') ? 'white' : 'var(--primary-color)'};
            border: 1px solid var(--primary-color);
            border-radius: 4px;
            padding: 2px 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-weight: 500;
        `;

        // 添加悬停效果
        newButton.addEventListener('mouseenter', function () {
            if (!this.classList.contains('following')) {
                this.style.backgroundColor = 'rgba(42, 157, 143, 0.1)';
            } else {
                this.style.backgroundColor = 'var(--primary-dark, #1d8879)';
                this.style.borderColor = 'var(--primary-dark, #1d8879)';
            }
        });

        newButton.addEventListener('mouseleave', function () {
            if (!this.classList.contains('following')) {
                this.style.backgroundColor = 'transparent';
            } else {
                this.style.backgroundColor = 'var(--primary-color)';
                this.style.borderColor = 'var(--primary-color)';
            }
        });

        // 点击事件
        newButton.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const isFollowing = this.classList.contains('following');
            const author = this.getAttribute('data-author');
            const postElement = this.closest('.discussion-item');
            const postId = postElement?.getAttribute('data-post-id');

            if (isFollowing) {
                // 取消关注
                this.classList.remove('following');
                this.textContent = 'Follow';
                this.style.backgroundColor = 'transparent';
                this.style.color = 'var(--primary-color)';

                // 从关注列表中移除
                removePostFromFollowedList(postId);

                alert(`You have unfollowed ${author}.`);
            } else {
                // 关注
                this.classList.add('following');
                this.textContent = 'Following';
                this.style.backgroundColor = 'var(--primary-color)';
                this.style.color = 'white';

                // 添加到关注列表
                addPostToFollowedList(postElement);

                alert(`You are now following ${author}. Their posts will appear in your "Followed Posts" section.`);
            }
        });
    });
}

// 将帖子添加到关注列表
function addPostToFollowedList(postElement) {
    if (!postElement) return;

    const followedList = document.getElementById('followedPostsList');
    const emptyFollowedPosts = document.getElementById('emptyFollowedPosts');

    if (!followedList) return;

    // 移除空状态提示
    if (emptyFollowedPosts) {
        emptyFollowedPosts.style.display = 'none';
    }

    // 克隆帖子元素
    const postClone = postElement.cloneNode(true);
    const postId = postClone.getAttribute('data-post-id');

    // 检查是否已存在
    const existingPost = followedList.querySelector(`[data-post-id="${postId}"]`);
    if (existingPost) return;

    // 添加到关注列表
    followedList.appendChild(postClone);

    // 重新绑定关注按钮事件
    initFollowButtons();
}

// 从关注列表中移除帖子
function removePostFromFollowedList(postId) {
    if (!postId) return;

    const followedList = document.getElementById('followedPostsList');
    if (!followedList) return;

    // 查找并移除帖子
    const postToRemove = followedList.querySelector(`[data-post-id="${postId}"]`);
    if (postToRemove) {
        followedList.removeChild(postToRemove);
    }

    // 如果关注列表为空，显示空状态
    if (followedList.children.length === 0) {
        const emptyFollowedPosts = document.getElementById('emptyFollowedPosts');
        if (emptyFollowedPosts) {
            emptyFollowedPosts.style.display = 'block';
        }
    }
}
// 初始化概念点击事件
function initForumConceptClicks() {
    const concepts = document.querySelectorAll('#forum .tree-concept');

    concepts.forEach(concept => {
        concept.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const conceptId = this.getAttribute('data-concept');
            const conceptName = this.querySelector('.concept-title').textContent;

            // 查找对应的单元并激活
            const parentUnit = this.closest('.tree-unit');
            if (parentUnit) {
                // 触发单元点击来显示对应的讨论区
                parentUnit.click();

                // 在单元讨论区内筛选概念特定内容
                setTimeout(() => {
                    filterPostsByConcept(conceptId, conceptName);
                }, 100);
            }
        });
    });
}

// 按概念筛选帖子
function filterPostsByConcept(conceptId, conceptName) {
    const activeSection = document.querySelector('#forum .discussion-section.active');
    if (!activeSection) return;

    const discussionList = activeSection.querySelector('.card-body');
    if (!discussionList) return;

    const allPosts = discussionList.querySelectorAll('.discussion-item');

    // 显示所有帖子
    allPosts.forEach(post => {
        post.style.display = 'block';
    });

    // 如果有特定的概念筛选，显示筛选信息
    if (conceptId) {
        // 在实际应用中，这里会根据概念筛选帖子
        // 现在只是显示一个消息
        console.log(`Filtering posts for concept: ${conceptName} (${conceptId})`);

        // 可以添加筛选逻辑，例如：
        // allPosts.forEach(post => {
        //     const postConcept = post.getAttribute('data-concept');
        //     if (postConcept !== conceptId) {
        //         post.style.display = 'none';
        //     }
        // });
    }
}