document.addEventListener('DOMContentLoaded', () => {
    // ============================================================
    // DOM References
    // ============================================================
    const expenseForm = document.getElementById('expense-form');
    const expenseNameInput = document.getElementById('expense-name');
    const expenseCostInput = document.getElementById('expense-cost');
    const expenseDueDayInput = document.getElementById('expense-due-day');
    const isRecurringToggle = document.getElementById('is-recurring');
    const recurringOptions = document.getElementById('recurring-options');
    const startMonthInput = document.getElementById('start-month');
    const endMonthInput = document.getElementById('end-month');
    const noEndDateToggle = document.getElementById('no-end-date');
    const monthsGrid = document.getElementById('months-grid');
    const submitBtn = document.getElementById('submit-btn');

    const expenseListEl = document.getElementById('expense-list');
    const emptyState = document.getElementById('empty-state');

    const totalExpensesEl = document.getElementById('total-expenses');
    const totalPaidEl = document.getElementById('total-paid');
    const totalUnpaidEl = document.getElementById('total-unpaid');
    const progressBar = document.getElementById('payment-progress');
    const progressPct = document.getElementById('progress-pct');

    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const currentMonthLabel = document.getElementById('current-month-label');

    const toastEl = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const toastUndo = document.getElementById('toast-undo');

    const editModal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-form');
    const editIdInput = document.getElementById('edit-id');
    const editNameInput = document.getElementById('edit-name');
    const editCostInput = document.getElementById('edit-cost');
    const editDueDayInput = document.getElementById('edit-due-day');
    const editIsRecurring = document.getElementById('edit-is-recurring');
    const editRecurringOptions = document.getElementById('edit-recurring-options');
    const editStartMonth = document.getElementById('edit-start-month');
    const editEndMonth = document.getElementById('edit-end-month');
    const editNoEndDate = document.getElementById('edit-no-end-date');
    const editMonthsGrid = document.getElementById('edit-months-grid');
    const cancelEditBtn = document.getElementById('cancel-edit');

    const filterBtns = document.querySelectorAll('.filter-btn');

    // ============================================================
    // State
    // ============================================================
    const MONTH_NAMES = [
        'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ];
    const MONTH_SHORT = [
        'Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu',
        'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'
    ];

    const now = new Date();
    let currentYear = now.getFullYear();
    let currentMonth = now.getMonth(); // 0-indexed
    let activeFilter = 'all';
    let toastTimeout = null;
    let undoAction = null;

    // Data structures:
    // expenses (Master): [{ id, name, cost, isRecurring, recurringMode, startMonth, endMonth, noEndDate, customMonths, position }]
    // paymentHistory: { "YYYY-MM": { expenseId: true/false } }
    let expenses = JSON.parse(localStorage.getItem('spendsmart_expenses')) || [];
    let paymentHistory = JSON.parse(localStorage.getItem('spendsmart_payments')) || {};

    // Drag state
    let draggedItem = null;
    let draggedExpenseId = null;

    // ============================================================
    // Init
    // ============================================================
    initMonthsGrid(monthsGrid, 'add');
    updateMonthLabel();
    renderCurrentMonth();

    // Set default start month
    const nowKey = getMonthKey(currentYear, currentMonth);
    startMonthInput.value = nowKey;

    // ============================================================
    // Month Navigation
    // ============================================================
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateMonthLabel();
        renderCurrentMonth();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateMonthLabel();
        renderCurrentMonth();
    });

    function updateMonthLabel() {
        currentMonthLabel.textContent = `${MONTH_NAMES[currentMonth]} ${currentYear}`;
    }

    function getMonthKey(year, month) {
        return `${year}-${String(month + 1).padStart(2, '0')}`;
    }

    // ============================================================
    // Recurring Toggle (Add Form)
    // ============================================================
    isRecurringToggle.addEventListener('change', () => {
        toggleRecurringOptions(recurringOptions, isRecurringToggle.checked);
    });

    noEndDateToggle.addEventListener('change', () => {
        endMonthInput.disabled = noEndDateToggle.checked;
        if (noEndDateToggle.checked) {
            endMonthInput.value = '';
        }
    });

    // Tab buttons for add form
    setupModeTabs(document.querySelector('.input-section .recurring-mode-tabs'),
        document.getElementById('range-mode'),
        document.getElementById('custom-mode'));

    // Tab buttons for edit form
    setupModeTabs(document.querySelector('#edit-recurring-options .recurring-mode-tabs'),
        document.getElementById('edit-range-mode'),
        document.getElementById('edit-custom-mode'));

    function setupModeTabs(tabContainer, rangeEl, customEl) {
        if (!tabContainer) return;
        tabContainer.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                tabContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if (btn.dataset.mode === 'range') {
                    rangeEl.classList.remove('hidden');
                    customEl.classList.add('hidden');
                } else {
                    rangeEl.classList.add('hidden');
                    customEl.classList.remove('hidden');
                }
            });
        });
    }

    function toggleRecurringOptions(container, show) {
        if (show) {
            container.classList.remove('hidden');
            container.classList.add('visible');
        } else {
            container.classList.remove('visible');
            container.classList.add('hidden');
        }
    }

    // ============================================================
    // Months Grid Builder
    // ============================================================
    function initMonthsGrid(container, prefix, selectedMonths = []) {
        container.innerHTML = '';
        MONTH_SHORT.forEach((name, idx) => {
            const chip = document.createElement('div');
            chip.className = 'month-chip';
            chip.textContent = name;
            chip.dataset.month = idx;
            if (selectedMonths.includes(idx)) {
                chip.classList.add('selected');
            }
            chip.addEventListener('click', () => {
                chip.classList.toggle('selected');
            });
            container.appendChild(chip);
        });
    }

    function getSelectedMonths(container) {
        return Array.from(container.querySelectorAll('.month-chip.selected')).map(c => parseInt(c.dataset.month));
    }

    // ============================================================
    // Filter Buttons
    // ============================================================
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            renderCurrentMonth();
        });
    });

    // ============================================================
    // Add Expense
    // ============================================================
    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = expenseNameInput.value.trim();
        const cost = parseFloat(expenseCostInput.value);
        const dueDayVal = expenseDueDayInput.value ? parseInt(expenseDueDayInput.value, 10) : null;
        const dueDay = (dueDayVal && dueDayVal >= 1 && dueDayVal <= 31) ? dueDayVal : null;

        if (!name || isNaN(cost) || cost <= 0) return;

        const isRecurring = isRecurringToggle.checked;
        const activeTab = document.querySelector('.input-section .recurring-mode-tabs .tab-btn.active');
        const recurringMode = activeTab ? activeTab.dataset.mode : 'range';

        const expense = {
            id: Date.now().toString(),
            name,
            cost,
            dueDay,
            isRecurring,
            recurringMode: isRecurring ? recurringMode : null,
            startMonth: isRecurring && recurringMode === 'range' ? startMonthInput.value : null,
            endMonth: isRecurring && recurringMode === 'range' && !noEndDateToggle.checked ? endMonthInput.value : null,
            noEndDate: isRecurring && recurringMode === 'range' ? noEndDateToggle.checked : false,
            customMonths: isRecurring && recurringMode === 'custom' ? getSelectedMonths(monthsGrid) : [],
            position: expenses.length,
            createdMonth: getMonthKey(currentYear, currentMonth)
        };

        expenses.push(expense);
        saveData();

        // Reset form
        expenseNameInput.value = '';
        expenseCostInput.value = '';
        if (expenseDueDayInput) expenseDueDayInput.value = '';
        isRecurringToggle.checked = false;
        toggleRecurringOptions(recurringOptions, false);
        noEndDateToggle.checked = false;
        endMonthInput.disabled = false;
        initMonthsGrid(monthsGrid, 'add');

        renderCurrentMonth();

        // Brief feedback
        showToast('✅ Spesa aggiunta!', false);
    });

    // ============================================================
    // Determine if expense is active for a given month
    // ============================================================
    function isExpenseActiveForMonth(expense, year, month) {
        const monthKey = getMonthKey(year, month);

        if (!expense.isRecurring) {
            // One-time: only show in the month it was created
            return expense.createdMonth === monthKey;
        }

        if (expense.recurringMode === 'range') {
            const start = expense.startMonth || expense.createdMonth;
            const end = expense.noEndDate ? null : expense.endMonth;
            if (monthKey < start) return false;
            if (end && monthKey > end) return false;
            return true;
        }

        if (expense.recurringMode === 'custom') {
            return expense.customMonths && expense.customMonths.includes(month);
        }

        return expense.createdMonth === monthKey;
    }

    // ============================================================
    // Payment History Helpers
    // ============================================================
    function getPaymentStatus(expenseId, year, month) {
        const key = getMonthKey(year, month);
        return paymentHistory[key] && paymentHistory[key][expenseId] === true;
    }

    function setPaymentStatus(expenseId, year, month, isPaid) {
        const key = getMonthKey(year, month);
        if (!paymentHistory[key]) {
            paymentHistory[key] = {};
        }
        paymentHistory[key][expenseId] = isPaid;
        saveData();
    }

    // ============================================================
    // Due Date & Overdue Helpers
    // ============================================================
    function isExpenseOverdue(expense, year, month) {
        const isPaid = getPaymentStatus(expense.id, year, month);
        if (isPaid || !expense.dueDay) return false;

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const effectiveDay = Math.min(expense.dueDay, daysInMonth);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dueDate = new Date(year, month, effectiveDay);
        dueDate.setHours(0, 0, 0, 0);

        return today > dueDate;
    }

    function isExpenseDueToday(expense, year, month) {
        const isPaid = getPaymentStatus(expense.id, year, month);
        if (isPaid || !expense.dueDay) return false;

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const effectiveDay = Math.min(expense.dueDay, daysInMonth);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dueDate = new Date(year, month, effectiveDay);
        dueDate.setHours(0, 0, 0, 0);

        return today.getTime() === dueDate.getTime();
    }

    // ============================================================
    // Render Current Month
    // ============================================================
    function renderCurrentMonth() {
        expenseListEl.innerHTML = '';

        const activeExpenses = expenses
            .filter(exp => isExpenseActiveForMonth(exp, currentYear, currentMonth))
            .sort((a, b) => (a.position || 0) - (b.position || 0));

        // Apply filter
        const filtered = activeExpenses.filter(exp => {
            const isPaid = getPaymentStatus(exp.id, currentYear, currentMonth);
            const isOverdue = isExpenseOverdue(exp, currentYear, currentMonth);
            if (activeFilter === 'paid') return isPaid;
            if (activeFilter === 'unpaid') return !isPaid;
            if (activeFilter === 'overdue') return isOverdue;
            return true;
        });

        if (filtered.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
            filtered.forEach(exp => renderExpenseItem(exp));
        }

        updateSummary(activeExpenses);
    }

    // ============================================================
    // Render Single Expense Item
    // ============================================================
    function renderExpenseItem(expense) {
        const isPaid = getPaymentStatus(expense.id, currentYear, currentMonth);
        const isOverdue = isExpenseOverdue(expense, currentYear, currentMonth);
        const isDueToday = isExpenseDueToday(expense, currentYear, currentMonth);

        const li = document.createElement('li');
        let classNames = 'expense-item';
        if (isPaid) {
            classNames += ' paid';
        } else if (isOverdue) {
            classNames += ' overdue';
        } else if (isDueToday) {
            classNames += ' due-today';
        }
        li.className = classNames;
        li.dataset.id = expense.id;
        li.draggable = true;

        const recurringBadgeHtml = expense.isRecurring
            ? `<span class="expense-badge">🔄 Ricorrente</span>`
            : '';

        let dueBadgeHtml = '';
        if (expense.dueDay) {
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            const effectiveDay = Math.min(expense.dueDay, daysInMonth);
            const monthShort = MONTH_SHORT[currentMonth];

            if (isPaid) {
                dueBadgeHtml = `<span class="expense-due-badge paid">📅 Scadeva il ${effectiveDay} ${monthShort}</span>`;
            } else if (isOverdue) {
                dueBadgeHtml = `<span class="expense-due-badge overdue">⚠️ Scaduta il ${effectiveDay} ${monthShort}</span>`;
            } else if (isDueToday) {
                dueBadgeHtml = `<span class="expense-due-badge due-today">⏰ Scade oggi (${effectiveDay} ${monthShort})</span>`;
            } else {
                dueBadgeHtml = `<span class="expense-due-badge upcoming">📅 Scadenza: ${effectiveDay} ${monthShort}</span>`;
            }
        }

        const badgesContainer = (recurringBadgeHtml || dueBadgeHtml)
            ? `<div class="expense-badges-row">${recurringBadgeHtml}${dueBadgeHtml}</div>`
            : '';

        li.innerHTML = `
            <span class="drag-handle">⠿</span>
            <div class="expense-info">
                <span class="expense-name">${escapeHtml(expense.name)}</span>
                <span class="expense-cost">${expense.cost.toFixed(2)} €</span>
                ${badgesContainer}
            </div>
            <div class="expense-actions">
                <button class="pay-btn" title="${isPaid ? 'Segna come Da Pagare' : 'Segna come Pagato'}">${isPaid ? '↩' : '✓'}</button>
                <button class="edit-btn" title="Modifica">✎</button>
                <button class="delete-btn" title="Elimina">&times;</button>
            </div>
        `;

        // Pay / Unpay button
        const payBtn = li.querySelector('.pay-btn');
        payBtn.addEventListener('click', () => {
            const wasPaid = getPaymentStatus(expense.id, currentYear, currentMonth);
            setPaymentStatus(expense.id, currentYear, currentMonth, !wasPaid);

            if (!wasPaid) {
                showToast(`"${expense.name}" segnata come pagata`, true, () => {
                    setPaymentStatus(expense.id, currentYear, currentMonth, false);
                    renderCurrentMonth();
                });
            } else {
                showToast(`"${expense.name}" riportata a Da Pagare`, false);
            }

            renderCurrentMonth();
        });

        // Edit button
        const editBtn = li.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
            openEditModal(expense);
        });

        // Delete button
        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            const removedExpense = { ...expense };
            const idx = expenses.findIndex(e => e.id === expense.id);

            expenses = expenses.filter(e => e.id !== expense.id);
            saveData();

            // Animate out
            li.style.transform = 'translateX(100%)';
            li.style.opacity = '0';
            li.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                renderCurrentMonth();
            }, 300);

            showToast(`"${expense.name}" eliminata`, true, () => {
                // Undo delete
                expenses.splice(idx, 0, removedExpense);
                saveData();
                renderCurrentMonth();
            });
        });

        // Drag and Drop
        li.addEventListener('dragstart', (e) => {
            draggedItem = li;
            draggedExpenseId = expense.id;
            li.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', expense.id);
        });

        li.addEventListener('dragend', () => {
            li.classList.remove('dragging');
            draggedItem = null;
            draggedExpenseId = null;
            document.querySelectorAll('.expense-item').forEach(item => {
                item.classList.remove('drag-over');
            });
        });

        li.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            if (draggedItem && draggedItem !== li) {
                li.classList.add('drag-over');
            }
        });

        li.addEventListener('dragleave', () => {
            li.classList.remove('drag-over');
        });

        li.addEventListener('drop', (e) => {
            e.preventDefault();
            li.classList.remove('drag-over');

            if (draggedItem && draggedItem !== li) {
                const targetId = li.dataset.id;
                const fromIndex = expenses.findIndex(exp => exp.id === draggedExpenseId);
                const toIndex = expenses.findIndex(exp => exp.id === targetId);

                if (fromIndex !== -1 && toIndex !== -1) {
                    const [movedExpense] = expenses.splice(fromIndex, 1);
                    expenses.splice(toIndex, 0, movedExpense);

                    // Update positions
                    expenses.forEach((exp, i) => exp.position = i);
                    saveData();
                    renderCurrentMonth();
                }
            }
        });

        // Touch-based drag (mobile)
        let touchStartY = 0;
        let touchClone = null;

        li.addEventListener('touchstart', (e) => {
            if (e.target.closest('.pay-btn, .edit-btn, .delete-btn')) return;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        expenseListEl.appendChild(li);
    }

    // ============================================================
    // Update Summary
    // ============================================================
    function updateSummary(activeExpenses) {
        let total = 0;
        let paid = 0;
        let unpaid = 0;

        activeExpenses.forEach(exp => {
            total += exp.cost;
            if (getPaymentStatus(exp.id, currentYear, currentMonth)) {
                paid += exp.cost;
            } else {
                unpaid += exp.cost;
            }
        });

        totalExpensesEl.textContent = `${total.toFixed(2)} €`;
        totalPaidEl.textContent = `${paid.toFixed(2)} €`;
        totalUnpaidEl.textContent = `${unpaid.toFixed(2)} €`;

        const pct = total > 0 ? Math.round((paid / total) * 100) : 0;
        progressBar.style.width = `${pct}%`;
        progressPct.textContent = pct;
    }

    // ============================================================
    // Edit Modal
    // ============================================================
    function openEditModal(expense) {
        editIdInput.value = expense.id;
        editNameInput.value = expense.name;
        editCostInput.value = expense.cost;
        if (editDueDayInput) {
            editDueDayInput.value = expense.dueDay || '';
        }
        editIsRecurring.checked = expense.isRecurring;

        // Toggle recurring options visibility
        toggleRecurringOptions(editRecurringOptions, expense.isRecurring);

        if (expense.isRecurring) {
            // Set mode tabs
            const tabs = editModal.querySelectorAll('.recurring-mode-tabs .tab-btn');
            tabs.forEach(t => {
                t.classList.toggle('active', t.dataset.mode === (expense.recurringMode || 'range'));
            });

            const editRangeMode = document.getElementById('edit-range-mode');
            const editCustomMode = document.getElementById('edit-custom-mode');

            if (expense.recurringMode === 'custom') {
                editRangeMode.classList.add('hidden');
                editCustomMode.classList.remove('hidden');
            } else {
                editRangeMode.classList.remove('hidden');
                editCustomMode.classList.add('hidden');
            }

            editStartMonth.value = expense.startMonth || '';
            editEndMonth.value = expense.endMonth || '';
            editNoEndDate.checked = expense.noEndDate || false;
            editEndMonth.disabled = editNoEndDate.checked;

            initMonthsGrid(editMonthsGrid, 'edit', expense.customMonths || []);
        }

        // Show modal
        editModal.classList.remove('hidden');
        requestAnimationFrame(() => {
            editModal.classList.add('visible');
        });
    }

    function closeEditModal() {
        editModal.classList.remove('visible');
        setTimeout(() => {
            editModal.classList.add('hidden');
        }, 300);
    }

    cancelEditBtn.addEventListener('click', closeEditModal);

    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) closeEditModal();
    });

    editIsRecurring.addEventListener('change', () => {
        toggleRecurringOptions(editRecurringOptions, editIsRecurring.checked);
    });

    editNoEndDate.addEventListener('change', () => {
        editEndMonth.disabled = editNoEndDate.checked;
        if (editNoEndDate.checked) editEndMonth.value = '';
    });

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = editIdInput.value;
        const name = editNameInput.value.trim();
        const cost = parseFloat(editCostInput.value);
        const dueDayVal = editDueDayInput && editDueDayInput.value ? parseInt(editDueDayInput.value, 10) : null;
        const dueDay = (dueDayVal && dueDayVal >= 1 && dueDayVal <= 31) ? dueDayVal : null;

        if (!name || isNaN(cost) || cost <= 0) return;

        const idx = expenses.findIndex(exp => exp.id === id);
        if (idx === -1) return;

        const isRecurring = editIsRecurring.checked;
        const activeTab = editModal.querySelector('.recurring-mode-tabs .tab-btn.active');
        const recurringMode = activeTab ? activeTab.dataset.mode : 'range';

        expenses[idx] = {
            ...expenses[idx],
            name,
            cost,
            dueDay,
            isRecurring,
            recurringMode: isRecurring ? recurringMode : null,
            startMonth: isRecurring && recurringMode === 'range' ? editStartMonth.value : null,
            endMonth: isRecurring && recurringMode === 'range' && !editNoEndDate.checked ? editEndMonth.value : null,
            noEndDate: isRecurring && recurringMode === 'range' ? editNoEndDate.checked : false,
            customMonths: isRecurring && recurringMode === 'custom' ? getSelectedMonths(editMonthsGrid) : [],
        };

        saveData();
        closeEditModal();
        renderCurrentMonth();

        showToast('✅ Spesa modificata!', false);
    });

    // ============================================================
    // Toast Notifications
    // ============================================================
    function showToast(message, showUndo = false, undoCallback = null) {
        // Clear previous
        if (toastTimeout) {
            clearTimeout(toastTimeout);
            toastTimeout = null;
        }

        toastMessage.textContent = message;
        toastUndo.style.display = showUndo ? 'inline-block' : 'none';
        undoAction = undoCallback;

        toastEl.classList.remove('hidden');
        requestAnimationFrame(() => {
            toastEl.classList.add('visible');
        });

        toastTimeout = setTimeout(() => {
            hideToast();
        }, showUndo ? 5000 : 2500);
    }

    function hideToast() {
        toastEl.classList.remove('visible');
        setTimeout(() => {
            toastEl.classList.add('hidden');
        }, 350);
        undoAction = null;
    }

    toastUndo.addEventListener('click', () => {
        if (undoAction) {
            undoAction();
            undoAction = null;
        }
        hideToast();
    });

    // ============================================================
    // Persistence
    // ============================================================
    function saveData() {
        localStorage.setItem('spendsmart_expenses', JSON.stringify(expenses));
        localStorage.setItem('spendsmart_payments', JSON.stringify(paymentHistory));
    }

    // ============================================================
    // Utilities
    // ============================================================
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
});
