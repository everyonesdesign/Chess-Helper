interface IOptions {
    selector: string,
    source: (term: string, suggest: (items: string[]) => void) => void,
    minChars: number,
    delay: number,
    offsetLeft: number,
    offsetTop: number,
    cache: number,
    menuClass: string,
    renderItem: (item: string, search: string) => string,
    onSelect:(e: Event, term: string, item: string) => void,
}

export default function autocomplete(options: Partial<IOptions>): void
