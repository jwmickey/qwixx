import { describe, it, expect } from 'vitest'
import { getValidNumbersForColor } from './coloredDiceHelpers'
import type { DiceState } from '../types/game'

describe('coloredDiceHelpers', () => {
  describe('getValidNumbersForColor', () => {
    it('should return only valid numbers for red die with white dice', () => {
      const dice: DiceState = {
        white1: 4,
        white2: 5,
        red: 1,
        yellow: 6,
        green: 2,
        blue: 4,
      }
      
      const validNumbers = getValidNumbersForColor(dice, 'red', [])
      
      // Red die (1) + white1 (4) = 5
      // Red die (1) + white2 (5) = 6
      expect(validNumbers).toContain(5)
      expect(validNumbers).toContain(6)
      expect(validNumbers.size).toBe(2)
    })
    
    it('should return only valid numbers for yellow die with white dice', () => {
      const dice: DiceState = {
        white1: 4,
        white2: 5,
        red: 1,
        yellow: 6,
        green: 2,
        blue: 4,
      }
      
      const validNumbers = getValidNumbersForColor(dice, 'yellow', [])
      
      // Yellow die (6) + white1 (4) = 10
      // Yellow die (6) + white2 (5) = 11
      expect(validNumbers).toContain(10)
      expect(validNumbers).toContain(11)
      expect(validNumbers.size).toBe(2)
    })
    
    it('should return only valid numbers for green die with white dice', () => {
      const dice: DiceState = {
        white1: 4,
        white2: 5,
        red: 1,
        yellow: 6,
        green: 2,
        blue: 4,
      }
      
      const validNumbers = getValidNumbersForColor(dice, 'green', [])
      
      // Green die (2) + white1 (4) = 6
      // Green die (2) + white2 (5) = 7
      expect(validNumbers).toContain(6)
      expect(validNumbers).toContain(7)
      expect(validNumbers.size).toBe(2)
    })
    
    it('should return only valid numbers for blue die with white dice', () => {
      const dice: DiceState = {
        white1: 4,
        white2: 5,
        red: 1,
        yellow: 6,
        green: 2,
        blue: 4,
      }
      
      const validNumbers = getValidNumbersForColor(dice, 'blue', [])
      
      // Blue die (4) + white1 (4) = 8
      // Blue die (4) + white2 (5) = 9
      expect(validNumbers).toContain(8)
      expect(validNumbers).toContain(9)
      expect(validNumbers.size).toBe(2)
    })
    
    it('should return only one number when white dice are the same', () => {
      const dice: DiceState = {
        white1: 3,
        white2: 3,
        red: 2,
        yellow: 5,
        green: 4,
        blue: 1,
      }
      
      const validNumbers = getValidNumbersForColor(dice, 'red', [])
      
      // Red die (2) + white1 (3) = 5
      // Red die (2) + white2 (3) = 5 (same)
      expect(validNumbers).toContain(5)
      expect(validNumbers.size).toBe(1)
    })
    
    it('should return empty set if color is locked', () => {
      const dice: DiceState = {
        white1: 4,
        white2: 5,
        red: 1,
        yellow: 6,
        green: 2,
        blue: 4,
      }
      
      const validNumbers = getValidNumbersForColor(dice, 'red', ['red'])
      
      expect(validNumbers.size).toBe(0)
    })
    
    it('should work correctly with different white dice values', () => {
      const dice: DiceState = {
        white1: 1,
        white2: 6,
        red: 3,
        yellow: 2,
        green: 5,
        blue: 4,
      }
      
      const validNumbers = getValidNumbersForColor(dice, 'red', [])
      
      // Red die (3) + white1 (1) = 4
      // Red die (3) + white2 (6) = 9
      expect(validNumbers).toContain(4)
      expect(validNumbers).toContain(9)
      expect(validNumbers.size).toBe(2)
    })
  })
})
