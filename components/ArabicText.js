// ArabicText.js — All Arabic rendering passes through here. Rule 5.
// Usage: ArabicText(text, size?) returns an HTML string

export function ArabicText(text, size = 'md') {
  const sizes = {
    sm:   'font-size:20px; line-height:1.8;',
    md:   'font-size:28px; line-height:1.9;',
    lg:   'font-size:36px; line-height:1.8;',
    xl:   'font-size:52px; line-height:1.6;',
    hero: 'font-size:80px; line-height:1.2;',
    letter: 'font-size:96px; line-height:1.1;',
  };
  const sizeStyle = sizes[size] || sizes.md;
  return `<span class="arabic-text" style="font-family:'Amiri','Traditional Arabic',serif; direction:rtl; display:block; text-align:right; color:var(--text-arabic); ${sizeStyle}">${text}</span>`;
}

// Inline Arabic — for embedding within a sentence
export function ArabicInline(text) {
  return `<span style="font-family:'Amiri','Traditional Arabic',serif; direction:rtl; display:inline; color:var(--text-arabic); font-size:1.15em; line-height:1.6;">${text}</span>`;
}

// Highlighted word within an ayah — used in spot_in_ayah exercises
export function ArabicHighlighted(text, highlightWord) {
  if (!highlightWord) return ArabicText(text);
  const escaped = highlightWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const highlighted = text.replace(
    new RegExp(escaped),
    `<mark style="background:rgba(201,168,76,0.25); color:var(--gold); border-radius:4px; padding:0 2px;">${highlightWord}</mark>`
  );
  return `<span class="arabic-text" style="font-family:'Amiri','Traditional Arabic',serif; direction:rtl; display:block; text-align:right; color:var(--text-arabic); font-size:28px; line-height:1.9;">${highlighted}</span>`;
}
