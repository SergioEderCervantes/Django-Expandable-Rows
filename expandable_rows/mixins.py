import json

from django.utils.html import format_html
from django.utils.safestring import mark_safe

from .fields import ErCard


class ExpandableRowMixin:

    class Media:
        css = {"all": ("expandable_rows/expandable_rows.css",)}
        js = ("expandable_rows/expandable_rows.js",)

    """
    Añade filas expandibles al Django admin list view.

    Uso:
        1. Heredar ANTES de ModelAdmin.
        2. Añadir 'expand_detail' al final de list_display.
        3. Sobreescribir expandable_row_cards(self, obj) retornando lista de ErCard.

    Ejemplo:
        class AlumnoAdmin(ExpandableRowMixin, ModelAdmin):
            list_display = ['nombre', 'expand_detail']

            def expandable_row_cards(self, obj):
                ce = getattr(obj, 'contacto_emergencia', None)
                return [
                    ErCard(
                        title='Contacto Emergencia',
                        icon='contact_emergency',
                        fields=[
                            ErField('Nombre',   ce.nombre if ce else ''),
                            ErField('Teléfono', ce.telefono if ce else ''),
                            ErField('Correo', ce.correo, is_link=True, href=f'mailto:{ce.correo}'),
                        ],
                    ),
                ]
    """

    def expandable_row_cards(self, obj) -> list[ErCard]:
        """Sobreescribir en subclase. Retorna lista de ErCard."""
        return []

    @mark_safe
    def expand_detail(self, obj):
        cards = self.expandable_row_cards(obj)
        data = json.dumps([c.to_dict() for c in cards], ensure_ascii=False)
        return format_html(
            '<button type="button" class="er-expand-btn" data-cards=\'{data}\' '
            'onclick="erToggle(this);event.stopPropagation();" title="Ver detalle">'
            '<span class="material-symbols-outlined">expand_more</span>'
            '</button>',
            data=data,
        )

    expand_detail.short_description = ''  # type: ignore
