import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SplashOverlay from './SplashOverlay';

describe('SplashOverlay', () => {
  it('渲染随机引语', () => {
    const quotes = [
      { _key: 'q1', text: { en: 'Test quote', zh: '测试引语', zhHant: '測試引語', fr: 'Citation de test' } },
    ];
    
    render(<SplashOverlay quotes={quotes} locale="en" />);
    
    expect(screen.getByText('Test quote')).toBeInTheDocument();
  });

  it('无引语时显示加载中', () => {
    render(<SplashOverlay quotes={[]} locale="zh" />);
    
    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  it('支持多语言', () => {
    const quotes = [
      { _key: 'q1', text: { en: 'Hello', zh: '你好', zhHant: '你好', fr: 'Bonjour' } },
    ];
    
    const { rerender } = render(<SplashOverlay quotes={quotes} locale="zh" />);
    expect(screen.getByText('你好')).toBeInTheDocument();
    
    rerender(<SplashOverlay quotes={quotes} locale="fr" />);
    expect(screen.getByText('Bonjour')).toBeInTheDocument();
  });
});
