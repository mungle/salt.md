import type { CommentMention } from './types';

// Keep selected identities only while their whole label survives an edit.
// Offsets match the textarea's UTF-16 positions (including emoji).
export function moveMentions(before: string, after: string, mentions: CommentMention[]): CommentMention[] {
  let start = 0;
  while (start < before.length && start < after.length && before[start] === after[start]) start++;
  let oldEnd = before.length, newEnd = after.length;
  while (oldEnd > start && newEnd > start && before[oldEnd - 1] === after[newEnd - 1]) { oldEnd--; newEnd--; }
  const delta = newEnd - oldEnd;
  return mentions.flatMap(m => {
    if (m.end <= start) return [m];
    if (m.start >= oldEnd) return [{ ...m, start: m.start + delta, end: m.end + delta }];
    return [];
  }).filter(m => after.slice(m.start, m.end) === '@' + m.label);
}

export const OPEN_COMMENT = 'salt:open-comment';
let target: { pageId: string; commentId: string } | null = null;
export const commentTarget = () => target;
export const clearCommentTarget = () => { target = null; };
export function openComment(pageId: string, commentId: string) {
  target = { pageId, commentId };
  window.dispatchEvent(new CustomEvent('salt:navigate', { detail: pageId }));
  window.dispatchEvent(new Event(OPEN_COMMENT));
}
