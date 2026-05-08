function erRenderValue(f) {
  if (f.isLink && f.href) {
    return '<a href="' + f.href + '" class="er-value er-link" onclick="event.stopPropagation();">'
      + (f.value || '\u2014') + '</a>';
  }
  if (f.isButton && f.href) {
    return '<a href="' + f.href + '" class="er-btn-link" onclick="event.stopPropagation();" title="' + (f.label || '') + '">'
      + '<span class="material-symbols-outlined">' + (f.buttonIcon || 'open_in_new') + '</span>'
      + '</a>';
  }
  return '<span class="er-value">' + (f.value || '\u2014') + '</span>';
}

function erBuildCards(cards) {
  var html = '<div class="er-cards">';
  cards.forEach(function(card) {
    html += '<div class="er-card">';
    html += '<div class="er-card__title">';
    if (card.icon) {
      html += '<span class="material-symbols-outlined">' + card.icon + '</span>';
    }
    html += card.title + '</div>';
    (card.fields || []).forEach(function(f) {
      html += '<div class="er-field">';
      html += '<span class="er-label">' + f.label + '</span>';
      html += erRenderValue(f);
      html += '</div>';
    });
    html += '</div>';
  });
  html += '</div>';
  return html;
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.er-expand-btn[data-expand-on-click="true"]').forEach(function(btn) {
    var tr = btn.closest('tr');
    if (!tr) return;
    tr.classList.add('er-row--clickable');
    tr.addEventListener('click', function(e) {
      if (e.target.closest('a, input, button')) return;
      erToggle(btn);
    });
  });
});

function erToggle(btn) {
  var tr   = btn.closest('tr');
  var icon = btn.querySelector('.material-symbols-outlined');
  var next = tr.nextElementSibling;

  // Si la fila de detalle ya existe, togglearla
  if (next && next.classList.contains('er-detail-row')) {
    var isOpen = next.classList.contains('er-detail--open');

    document.querySelectorAll('.er-detail-row.er-detail--open').forEach(function(r) {
      r.classList.remove('er-detail--open');
      var prevIcon = r.previousElementSibling
        .querySelector('.er-expand-btn .material-symbols-outlined');
      if (prevIcon) prevIcon.style.transform = '';
    });

    if (!isOpen) {
      next.classList.add('er-detail--open');
      icon.style.transform = 'rotate(180deg)';
    }
    return;
  }

  // Cerrar cualquier otro abierto
  document.querySelectorAll('.er-detail-row.er-detail--open').forEach(function(r) {
    r.classList.remove('er-detail--open');
    var prevIcon = r.previousElementSibling
      .querySelector('.er-expand-btn .material-symbols-outlined');
    if (prevIcon) prevIcon.style.transform = '';
  });

  // Crear la fila desde data-cards
  var cards   = JSON.parse(btn.dataset.cards || '[]');
  var colspan = tr.cells.length;

  var detailTr = document.createElement('tr');
  detailTr.className = 'er-detail-row er-detail--open';
  detailTr.innerHTML =
    '<td colspan="' + colspan + '">' +
      '<div class="er-detail-inner">' + erBuildCards(cards) + '</div>' +
    '</td>';

  tr.parentNode.insertBefore(detailTr, next);
  icon.style.transform = 'rotate(180deg)';
}
