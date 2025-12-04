document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LOGIC FOR LOGIN PAGE ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const overlay = document.getElementById('loadingOverlay');
            if (overlay) {
                overlay.classList.add('active');
            }

            // Simulate API latency
            setTimeout(() => {
                // Save mock session
                localStorage.setItem('legal_erp_session', 'true');
                window.location.href = 'dashboard.html';
            }, 1500);
        });
        return; // Stop execution here if we are on login page
    }

    // --- 2. LOGIC FOR DASHBOARD ---

    // Navigation Logic
    const navItems = document.querySelectorAll('.nav-primary .nav-item[data-target]');
    const sections = document.querySelectorAll('.page-section');
    const subtitle = document.getElementById('page-subtitle');

    const subtitles = {
        dashboard: 'Visão consolidada de processos, prazos e faturamento em tempo real.',
        processos: 'Gestão completa do contencioso com filtros avançados e painel de risco.',
        audiencias: 'Agenda avançada de audiências, prazos fatais e SLAs contratuais.',
        clientes: 'Visão única de clientes, partes e relacionamento estratégico.',
        financeiro: 'Monitoramento econômico do escritório e projeções de caixa.'
    };

    // Handle Page Transitions (Tab Switching)
    if (navItems.length > 0) {
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const target = item.getAttribute('data-target');

                // 1. Show Loading Overlay briefly for effect
                const loading = document.getElementById('loadingOverlay');
                if (loading) {
                    loading.classList.add('active');
                    setTimeout(() => {
                        loading.classList.remove('active');
                    }, 400); // Quick transition
                }

                // 2. Update Active Menu Item
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // 3. Update Active Section
                sections.forEach(sec => {
                    if (sec.getAttribute('data-section') === target) {
                        sec.classList.add('active');
                    } else {
                        sec.classList.remove('active');
                    }
                });

                // 4. Update Subtitle
                if (subtitles[target] && subtitle) {
                    subtitle.textContent = subtitles[target];
                }
            });
        });
    }

    // Modal Logic (New Record)
    const newRecordBtn = document.getElementById('newRecordBtn');
    const modal = document.getElementById('newRecordModal');
    const closeBtns = document.querySelectorAll('.modal-close, .modal-close-btn');

    if (newRecordBtn && modal) {
        newRecordBtn.addEventListener('click', () => {
            modal.classList.add('open');
        });

        // Close on X or Cancel button
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('open');
            });
        });

        // Close on click outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('open');
            }
        });

        // Mock Submission
        const form = document.getElementById('newRecordForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                // Show loading
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn.textContent;
                btn.textContent = 'Salvando...';

                setTimeout(() => {
                    btn.textContent = originalText;
                    modal.classList.remove('open');
                    // Reset form
                    form.reset();
                    alert('Registro salvo com sucesso (Simulação)');
                }, 800);
            });
        }
    }

    // Modal Logic (New Process)
    const btnOpenProcessModal = document.getElementById('btnOpenProcessModal');
    const processModal = document.getElementById('newProcessModal');
    const closeProcessBtn = document.getElementById('closeProcessModal');
    const cancelProcessBtn = document.getElementById('cancelProcessModal');
    const processForm = document.getElementById('newProcessForm');

    if (btnOpenProcessModal && processModal) {
        btnOpenProcessModal.addEventListener('click', () => {
            processModal.classList.add('open');
        });

        const closeProcess = () => {
            processModal.classList.remove('open');
        };

        if (closeProcessBtn) closeProcessBtn.addEventListener('click', closeProcess);
        if (cancelProcessBtn) cancelProcessBtn.addEventListener('click', closeProcess);

        processModal.addEventListener('click', (e) => {
            if (e.target === processModal) closeProcess();
        });

        if (processForm) {
            processForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = processForm.querySelector('button[type="submit"]');
                const originalText = btn.textContent;
                btn.textContent = 'Criando...';

                // Get values
                const procNum = document.getElementById('procNum').value;
                const procClient = document.getElementById('procClient').value;
                const procArea = document.getElementById('procArea').value;
                const procPhase = document.getElementById('procPhase').value;
                const procResp = document.getElementById('procResp').value;
                const procProb = document.getElementById('procProb').value;

                setTimeout(() => {
                    // Add to table
                    const tableBody = document.querySelector('section[data-section="processos"] tbody');
                    if (tableBody) {
                        const newRow = `
                            <tr>
                              <td>${procNum}</td>
                              <td>${procClient}</td>
                              <td><span class="tag-pill">${procArea}</span></td>
                              <td>${procPhase}</td>
                              <td>${procProb}%</td>
                              <td>${procResp}</td>
                            </tr>
                        `;
                        tableBody.insertAdjacentHTML('afterbegin', newRow);
                    }

                    btn.textContent = originalText;
                    closeProcess();
                    processForm.reset();
                    alert('Processo criado com sucesso!');
                }, 800);
            });
        }
    }

    // Simulate initial loading of dashboard
    const initialLoading = document.getElementById('loadingOverlay');
    if (initialLoading && !sessionStorage.getItem('dashboard_loaded')) {
        // If it's the dashboard page
        initialLoading.classList.add('active');
        setTimeout(() => {
            initialLoading.classList.remove('active');
            sessionStorage.setItem('dashboard_loaded', 'true');
        }, 800);
    }

    // --- 3. THEME TOGGLE LOGIC ---
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const icon = themeToggle ? themeToggle.querySelector('.icon') : null;

    // Check saved preference
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        if (icon) icon.textContent = '☾';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            if (icon) icon.textContent = isLight ? '☾' : '☀';
        });
    }

    // --- 4. SIDEBAR TOGGLE LOGIC ---
    const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
    const appContainer = document.querySelector('.app');

    // Restore sidebar state from localStorage
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        appContainer.classList.add('sidebar-hidden');
    }

    if (sidebarToggleBtn) {
        const icon = sidebarToggleBtn.querySelector('.icon');

        // Set initial icon based on state
        if (isCollapsed) {
            icon.textContent = '☰'; // Hamburger menu when collapsed
            sidebarToggleBtn.title = 'Expandir menu';
        }

        sidebarToggleBtn.addEventListener('click', () => {
            appContainer.classList.toggle('sidebar-hidden');
            const isHidden = appContainer.classList.contains('sidebar-hidden');

            // Update icon and title
            if (isHidden) {
                icon.textContent = '☰'; // Hamburger menu when collapsed
                sidebarToggleBtn.title = 'Expandir menu';
            } else {
                icon.textContent = '«'; // Left arrows when expanded
                sidebarToggleBtn.title = 'Recolher menu';
            }

            // Save state to localStorage
            localStorage.setItem('sidebarCollapsed', isHidden);
        });
    }
});
