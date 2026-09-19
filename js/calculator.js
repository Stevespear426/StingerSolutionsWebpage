// Stinger Solutions LLC — savings calculator

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.calc-form');
  if (!form) return;

  const subChecks = Array.from(document.querySelectorAll('.calc-sub-check'));
  const customCheck = document.getElementById('calcCustomCheck');
  const customNameInput = document.querySelector('.calc-custom-name');
  const tierRadios = Array.from(document.querySelectorAll('.calc-tier-radio'));
  const customTierPrice = document.getElementById('calcCustomTierPrice');
  const maintCheck = document.getElementById('calcMaintCheck');
  const maintPrice = document.getElementById('calcMaintPrice');

  const monthlyTotalEl = document.getElementById('calcMonthlyTotal');
  const annualTotalEl = document.getElementById('calcAnnualTotal');
  const barSub = document.getElementById('calcBarSub');
  const barSubValue = document.getElementById('calcBarSubValue');
  const barStinger = document.getElementById('calcBarStinger');
  const barStingerValue = document.getElementById('calcBarStingerValue');
  const breakevenEl = document.getElementById('calcBreakeven');
  const fiveYearEl = document.getElementById('calcFiveYearSavings');

  const money = (n) => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });

  function selectedTierPrice() {
    const checked = tierRadios.find(r => r.checked);
    if (!checked) return 0;
    if (checked.value === 'custom') {
      return Math.max(0, parseFloat(customTierPrice.value) || 0);
    }
    return parseFloat(checked.value) || 0;
  }

  // Typing in the custom price field implies choosing the custom tier.
  if (customTierPrice) {
    customTierPrice.addEventListener('input', () => {
      const customRadio = tierRadios.find(r => r.value === 'custom');
      if (customRadio) customRadio.checked = true;
      recalc();
    });
  }

  // Typing a name in the custom subscription row implies checking it.
  if (customNameInput) {
    customNameInput.addEventListener('input', () => {
      if (customNameInput.value.trim() && customCheck) customCheck.checked = true;
      recalc();
    });
  }

  function recalc() {
    let monthly = 0;
    subChecks.forEach(check => {
      if (!check.checked) return;
      const row = check.closest('.calc-item');
      const priceInput = row ? row.querySelector('.calc-sub-price') : null;
      const price = priceInput ? Math.max(0, parseFloat(priceInput.value) || 0) : 0;
      monthly += price;
    });

    const annual = monthly * 12;
    const oneTime = selectedTierPrice();
    const maintMonthly = (maintCheck && maintCheck.checked) ? Math.max(0, parseFloat(maintPrice.value) || 0) : 0;
    const netMonthlySavings = monthly - maintMonthly;

    monthlyTotalEl.textContent = money(monthly);
    annualTotalEl.textContent = money(annual);

    const fiveYearSub = monthly * 60;
    const fiveYearStinger = oneTime + (maintMonthly * 60);
    const maxBar = Math.max(fiveYearSub, fiveYearStinger, 1);

    barSub.style.width = Math.min(100, (fiveYearSub / maxBar) * 100) + '%';
    barStinger.style.width = Math.min(100, (fiveYearStinger / maxBar) * 100) + '%';
    barSubValue.textContent = money(fiveYearSub);
    barStingerValue.textContent = money(fiveYearStinger);

    if (netMonthlySavings > 0 && oneTime > 0) {
      const months = oneTime / netMonthlySavings;
      breakevenEl.textContent = months < 1
        ? 'Less than 1 month'
        : Math.round(months) + (Math.round(months) === 1 ? ' month' : ' months');
    } else {
      breakevenEl.textContent = '—';
    }

    const fiveYearSavings = fiveYearSub - fiveYearStinger;
    fiveYearEl.textContent = (fiveYearSavings < 0 ? '-' : '') + money(Math.abs(fiveYearSavings));
    fiveYearEl.parentElement.classList.toggle('calc-result-negative', fiveYearSavings < 0);
  }

  form.addEventListener('input', recalc);
  form.addEventListener('change', recalc);

  recalc();
});
