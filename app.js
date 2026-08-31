document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('form').forEach(initFormValidation);
  document.querySelectorAll('.card').forEach(initTableFilter);
  initGauges();
});

function initFormValidation(form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach((field) => clearFieldError(field));

    requiredFields.forEach((field) => {
      const value = field.value.trim();
      if (!value) {
        markFieldError(field, 'Este campo é obrigatório.');
        isValid = false;
      } else if (field.type === 'email' && !isValidEmail(value)) {
        markFieldError(field, 'Informe um e-mail válido.');
        isValid = false;
      } else if (field.type === 'number' && Number(value) <= 0) {
        markFieldError(field, 'Informe um valor maior que zero.');
        isValid = false;
      }
    });

    if (!isValid) {
      showToast('Verifique os campos destacados antes de salvar.', 'error');
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    showToast('Registro salvo com sucesso.', 'success');
    form.reset();
    requiredFields.forEach((field) => clearFieldError(field));
  });

  form.querySelectorAll('[required]').forEach((field) => {
    field.addEventListener('input', () => clearFieldError(field));
  });
}

function markFieldError(field, message) {
  field.setAttribute('aria-invalid', 'true');
  field.style.borderColor = 'var(--danger)';

  const wrapper = field.closest('.field');
  if (!wrapper) return;

  let errorEl = wrapper.querySelector('.field-error');
  if (!errorEl) {
    errorEl = document.createElement('span');
    errorEl.className = 'field-error';
    wrapper.appendChild(errorEl);
  }
  errorEl.textContent = message;
  errorEl.style.display = 'block';
}

function clearFieldError(field) {
  field.removeAttribute('aria-invalid');
  field.style.borderColor = '';

  const wrapper = field.closest('.field');
  const errorEl = wrapper ? wrapper.querySelector('.field-error') : null;
  if (errorEl) errorEl.style.display = 'none';
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function initTableFilter(card) {
  const filterBar = card.querySelector('.filter-bar');
  const table = card.querySelector('table');
  if (!filterBar || !table) return;

  const controls = filterBar.querySelectorAll('input[type="search"], select');
  if (!controls.length) return;

  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));

  controls.forEach((control) => {
    const evt = control.tagName === 'SELECT' ? 'change' : 'input';
    control.addEventListener(evt, () => applyFilters(rows, controls, tbody, table.dataset.columns));
  });
}

function applyFilters(rows, controls, tbody) {
  const terms = Array.from(controls)
    .map((el) => el.value.trim().toLowerCase())
    .filter(Boolean);

  let visibleCount = 0;

  rows.forEach((row) => {
    const rowText = row.textContent.toLowerCase();
    const matches = terms.every((term) => rowText.includes(term));
    row.style.display = matches ? '' : 'none';
    if (matches) visibleCount += 1;
  });

  toggleEmptyRow(tbody, rows, visibleCount);
}

function toggleEmptyRow(tbody, rows, visibleCount) {
  let emptyRow = tbody.querySelector('.js-empty-row');

  if (visibleCount === 0) {
    if (!emptyRow) {
      const columnCount = rows[0] ? rows[0].children.length : 1;
      emptyRow = document.createElement('tr');
      emptyRow.className = 'js-empty-row';
      emptyRow.innerHTML = `<td colspan="${columnCount}">
        <div class="empty-state">
          <h3>Nenhum resultado encontrado</h3>
          <p>Ajuste os termos de busca ou os filtros selecionados.</p>
        </div>
      </td>`;
      tbody.appendChild(emptyRow);
    }
    emptyRow.style.display = '';
  } else if (emptyRow) {
    emptyRow.style.display = 'none';
  }
}

function initGauges() {
  document.querySelectorAll('.gauge[data-atual]').forEach((gauge) => {
    const atual = Number(gauge.dataset.atual || 0);
    const total = Number(gauge.dataset.total || 0);
    const minimo = Number(gauge.dataset.minimo || 0);
    if (!total) return;

    const pct = Math.max(0, Math.min(100, (atual / total) * 100));
    const minPct = Math.max(0, Math.min(100, (minimo / total) * 100));

    gauge.style.setProperty('--pct', `${pct}%`);
    gauge.style.setProperty('--min-pct', `${minPct}%`);

    gauge.classList.remove('gauge--low', 'gauge--out');
    if (atual <= 0) {
      gauge.classList.add('gauge--out');
    } else if (atual < minimo) {
      gauge.classList.add('gauge--low');
    }
  });
}

function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.setAttribute('role', 'status');
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => toast.classList.add('is-visible'), 10);
  setTimeout(() => {
    toast.classList.remove('is-visible');
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}
