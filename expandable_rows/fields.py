from dataclasses import dataclass, field


@dataclass
class ErField:
    label: str
    value: str = ''
    is_link: bool = False
    href: str = ''
    is_button: bool = False
    button_icon: str = 'open_in_new'

    def __post_init__(self) -> None:
        if (self.is_link or self.is_button) and not self.href:
            raise ValueError(f"ErField '{self.label}': se requiere 'href' cuando is_link o is_button es True")

    def to_dict(self) -> dict:
        d: dict = {'label': self.label, 'value': self.value}
        if self.is_link:
            d['isLink'] = True
            d['href'] = self.href
        if self.is_button:
            d['isButton'] = True
            d['href'] = self.href
            d['buttonIcon'] = self.button_icon
        return d


@dataclass
class ErCard:
    title: str
    fields: list[ErField] = field(default_factory=list)
    icon: str = ''

    def to_dict(self) -> dict:
        d: dict = {'title': self.title, 'fields': [f.to_dict() for f in self.fields]}
        if self.icon:
            d['icon'] = self.icon
        return d
