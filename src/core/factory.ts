import { TagBuilder } from "./builder";

export interface TagConfig {
  id?: string;
  classes?: string[];
  styles?: Record<string, string>;
  attrs?: Record<string, string>;
  events?: Record<string, EventListener>;
  text?: string;
  children?: HTMLElement[];
}

export interface Tag {
  toHtml(): HTMLElement;
}

export type ElementType = "button" | "div" | "img" | "input" | "h1" | "h2" | "h3" | "span" | "p" | "a";

function applyConfig(builder: TagBuilder, config: TagConfig): HTMLElement {
  if (config.id) builder.withAttr("id", config.id);
  if (config.text) builder.withText(config.text);
  config.classes?.forEach((c) => builder.withClass(c));
  if (config.styles) Object.entries(config.styles).forEach(([p, v]) => builder.withStyle(p, v));
  if (config.attrs) Object.entries(config.attrs).forEach(([k, v]) => builder.withAttr(k, v));
  if (config.events) Object.entries(config.events).forEach(([e, h]) => builder.withEvent(e, h));
  config.children?.forEach((child) => builder.withChild(child));
  return builder.build();
}

class ButtonTag implements Tag {
  config: TagConfig;
  constructor(config: TagConfig) { this.config = config; }
  toHtml(): HTMLElement { return applyConfig(new TagBuilder("button"), this.config); }
}

class DivTag implements Tag {
  config: TagConfig;
  constructor(config: TagConfig) { this.config = config; }
  toHtml(): HTMLElement { return applyConfig(new TagBuilder("div"), this.config); }
}

class ImageTag implements Tag {
  config: TagConfig;
  constructor(config: TagConfig) { this.config = config; }
  toHtml(): HTMLElement { return applyConfig(new TagBuilder("img"), this.config); }
}

class InputTag implements Tag {
  config: TagConfig;
  constructor(config: TagConfig) { this.config = config; }
  toHtml(): HTMLElement { return applyConfig(new TagBuilder("input"), this.config); }
}

class SpanTag implements Tag {
  config: TagConfig;
  constructor(config: TagConfig) { this.config = config; }
  toHtml(): HTMLElement { return applyConfig(new TagBuilder("span"), this.config); }
}

class ParagraphTag implements Tag {
  config: TagConfig;
  constructor(config: TagConfig) { this.config = config; }
  toHtml(): HTMLElement { return applyConfig(new TagBuilder("p"), this.config); }
}

class AnchorTag implements Tag {
  config: TagConfig;
  constructor(config: TagConfig) { this.config = config; }
  toHtml(): HTMLElement { return applyConfig(new TagBuilder("a"), this.config); }
}

class HeadingTag implements Tag {
  config: TagConfig;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  constructor(config: TagConfig, level: 1 | 2 | 3 | 4 | 5 | 6 = 1) {
    this.config = config;
    this.level = level;
  }
  toHtml(): HTMLElement { return applyConfig(new TagBuilder(`h${this.level}`), this.config); }
}

export class TagFactory {
  private static registry: Record<ElementType, (config: TagConfig) => Tag> = {
    button: (c) => new ButtonTag(c),
    div: (c) => new DivTag(c),
    img: (c) => new ImageTag(c),
    input: (c) => new InputTag(c),
    h1: (c) => new HeadingTag(c, 1),
    h2: (c) => new HeadingTag(c, 2),
    h3: (c) => new HeadingTag(c, 3),
    span: (c) => new SpanTag(c),
    p: (c) => new ParagraphTag(c),
    a: (c) => new AnchorTag(c),
  };

  static create(type: ElementType, config: TagConfig = {}): HTMLElement {
    return TagFactory.registry[type](config).toHtml();
  }
}
