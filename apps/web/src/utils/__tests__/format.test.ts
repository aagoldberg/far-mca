import { describe, it, expect } from 'vitest'
import { formatUnits, parseUnits } from 'viem'

const USDC_DECIMALS = 6

describe('USDC Amount Formatting', () => {
  describe('formatUnits', () => {
    it('should format 1 USDC correctly', () => {
      const amount = BigInt(1000000) // 1 USDC = 1,000,000 units
      expect(formatUnits(amount, USDC_DECIMALS)).toBe('1')
    })

    it('should format fractional USDC correctly', () => {
      const amount = BigInt(1500000) // 1.5 USDC
      expect(formatUnits(amount, USDC_DECIMALS)).toBe('1.5')
    })

    it('should format small amounts correctly', () => {
      const amount = BigInt(100) // 0.0001 USDC
      expect(formatUnits(amount, USDC_DECIMALS)).toBe('0.0001')
    })

    it('should format zero correctly', () => {
      const amount = BigInt(0)
      expect(formatUnits(amount, USDC_DECIMALS)).toBe('0')
    })

    it('should format large amounts correctly', () => {
      const amount = BigInt(1000000000000) // 1,000,000 USDC
      expect(formatUnits(amount, USDC_DECIMALS)).toBe('1000000')
    })
  })

  describe('parseUnits', () => {
    it('should parse 1 USDC correctly', () => {
      const result = parseUnits('1', USDC_DECIMALS)
      expect(result).toBe(BigInt(1000000))
    })

    it('should parse fractional USDC correctly', () => {
      const result = parseUnits('0.5', USDC_DECIMALS)
      expect(result).toBe(BigInt(500000))
    })

    it('should parse very small amounts correctly', () => {
      const result = parseUnits('0.000001', USDC_DECIMALS)
      expect(result).toBe(BigInt(1))
    })

    it('should parse zero correctly', () => {
      const result = parseUnits('0', USDC_DECIMALS)
      expect(result).toBe(BigInt(0))
    })
  })

  describe('Formatting for display', () => {
    const formatForDisplay = (amount: bigint): string => {
      const formatted = formatUnits(amount, USDC_DECIMALS)
      const num = parseFloat(formatted)
      return new Intl.NumberFormat('en-US').format(num)
    }

    it('should format with thousand separators', () => {
      const amount = BigInt(1234567000000) // 1,234,567 USDC
      expect(formatForDisplay(amount)).toBe('1,234,567')
    })

    it('should handle decimals in display', () => {
      const amount = BigInt(1234500000) // 1,234.5 USDC
      expect(formatForDisplay(amount)).toBe('1,234.5')
    })
  })
})