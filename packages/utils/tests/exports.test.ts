import { assertNever, isServer, noop } from '../src';
import { describe, expect, it } from 'vitest';

describe('utils exports', () => {
  it('returns undefined for noop', () => {
    expect(noop()).toBeUndefined();
  });

  it('detects server runtime in node tests', () => {
    expect(isServer()).toBe(true);
  });

  it('throws for assertNever', () => {
    expect(() => assertNever('unexpected' as never)).toThrow(
      'Unexpected value: unexpected',
    );
  });
});
