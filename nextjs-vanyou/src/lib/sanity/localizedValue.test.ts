import { describe, it, expect } from 'vitest';
import { localizedValue } from './localizedValue';

describe('localizedValue', () => {
  it('返回指定 locale 的值', () => {
    const input = {
      en: 'Hello',
      zh: '你好',
      zhHant: '你好',
      fr: 'Bonjour',
    };
    
    expect(localizedValue(input, 'zh')).toBe('你好');
    expect(localizedValue(input, 'en')).toBe('Hello');
    expect(localizedValue(input, 'fr')).toBe('Bonjour');
  });

  it('当指定 locale 不存在时回退到 en', () => {
    const input = {
      en: 'Hello',
      zh: undefined,
      zhHant: undefined,
      fr: undefined,
    };
    
    expect(localizedValue(input, 'zh')).toBe('Hello');
    expect(localizedValue(input, 'fr')).toBe('Hello');
  });

  it('处理 undefined 输入', () => {
    expect(localizedValue(undefined, 'en')).toBeUndefined();
  });

  it('处理空对象', () => {
    expect(localizedValue({}, 'en')).toBeUndefined();
  });
});
