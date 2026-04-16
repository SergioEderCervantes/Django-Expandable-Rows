# django-expandable-rows

Filas expandibles para Django admin list views. Compatible con Unfold.

## Instalación

1. Copia la carpeta `expandable_rows/` a tu proyecto.

2. Añade a `INSTALLED_APPS` en `settings.py`:
   ```python
   INSTALLED_APPS = [
       ...
       "expandable_rows",  # ajusta el path según tu estructura
   ]
   ```
   > Si tu proyecto usa estructura de paquete tipo `app/`, cambia el `name` en `apps.py` al path correcto (e.g. `"myapp.expandable_rows"`).

3. Crea `templates/admin/base_site.html` en tu proyecto:
   ```html
   {% extends "admin/base.html" %}
   {% load static %}

   {% block extrastyle %}
   {{ block.super }}
   <link rel="stylesheet" href="{% static 'expandable_rows/expandable_rows.css' %}">
   <script src="{% static 'expandable_rows/expandable_rows.js' %}"></script>
   {% endblock %}
   ```
   > Si usas Unfold, añade también los bloques `title`, `branding` y `nav-global` que Unfold necesita (ver nota al final).

---

## Uso en ModelAdmin

```python
from expandable_rows.fields import ErCard, ErField
from expandable_rows.mixins import ExpandableRowMixin


class ProductoAdmin(ExpandableRowMixin, ModelAdmin):
    list_display = ["nombre", "precio", "expand_detail"]

    def expandable_row_cards(self, obj):
        return [
            ErCard(
                title="Detalles",
                icon="info",  # Material Symbol (opcional)
                fields=[
                    ErField("Descripción", obj.descripcion),
                    ErField("Stock", str(obj.stock)),
                ],
            ),
            ErCard(
                title="Proveedor",
                icon="local_shipping",
                fields=[
                    ErField("Nombre",   obj.proveedor.nombre),
                    ErField("Teléfono", obj.proveedor.telefono),
                ],
            ),
        ]
```

- `ExpandableRowMixin` va **antes** de `ModelAdmin` en la herencia.
- `expand_detail` se añade **al final** de `list_display`.
- `expandable_row_cards` retorna una lista de `ErCard`.

---

## ErField — tipos de campo

Todos los campos se construyen con `ErField`. El primer argumento es el `label`, el segundo el `value`.

### Texto plano (por defecto)

```python
ErField("Stock", str(obj.stock))
ErField("Descripción", obj.descripcion or "")
```

### Link — value clickeable

```python
ErField("Correo", obj.correo, is_link=True, href=f"mailto:{obj.correo}")
ErField("Expediente", str(obj.expediente), is_link=True, href=f"/admin/app/expediente/{obj.pk}/change/")
```

El `value` se renderiza como `<a href="...">` con el color accent del tema.
Si `is_link=True`, `href` es obligatorio (se lanza `ValueError` si está vacío).

### Button — icono-link flotante

```python
ErField("Ver detalle", is_button=True, href=f"/admin/app/expediente/{obj.pk}/change/", button_icon="open_in_new")
```

Renderiza un icono de [Material Symbols](https://fonts.google.com/icons) como link alineado a la derecha del campo.
`button_icon` es opcional (default: `open_in_new`). `value` puede omitirse.
Si `is_button=True`, `href` es obligatorio.

### Referencia completa de ErField

| Parámetro     | Tipo   | Default        | Descripción                                      |
|---------------|--------|----------------|--------------------------------------------------|
| `label`       | `str`  | —              | Etiqueta visible (requerido)                     |
| `value`       | `str`  | `''`           | Valor visible                                    |
| `is_link`     | `bool` | `False`        | Renderiza `value` como `<a>`                     |
| `href`        | `str`  | `''`           | URL del link o button (requerido si link/button) |
| `is_button`   | `bool` | `False`        | Renderiza un icono-link flotante                 |
| `button_icon` | `str`  | `open_in_new`  | Nombre del Material Symbol para el button        |

---

## ErCard — referencia

```python
ErCard(title="Título", icon="person", fields=[...])
```

| Parámetro | Tipo          | Default | Descripción                              |
|-----------|---------------|---------|------------------------------------------|
| `title`   | `str`         | —       | Título de la card (requerido)            |
| `fields`  | `list[ErField]` | `[]`  | Lista de campos                          |
| `icon`    | `str`         | `''`    | Material Symbol para el título (opcional)|

---

## Nota para proyectos con Unfold

El `base_site.html` debe replicar lo que Unfold ya hace, más tus assets:

```html
{% extends "admin/base.html" %}
{% load i18n static %}

{% block title %}{% if subtitle %}{{ subtitle }} | {% endif %}{{ title }} | {{ site_title|default:_('Django site admin') }}{% endblock %}
{% block branding %}{% include "unfold/helpers/site_branding.html" %}{% endblock %}
{% block nav-global %}{% endblock %}

{% block extrastyle %}
{{ block.super }}
<link rel="stylesheet" href="{% static 'expandable_rows/expandable_rows.css' %}">
<script src="{% static 'expandable_rows/expandable_rows.js' %}"></script>
{% endblock %}
```
