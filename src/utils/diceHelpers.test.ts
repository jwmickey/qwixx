import { describe, it, expect } from 'vitest'
import {
  rollDie,
  rollAllDice,
  getWhiteDiceSum,
  getActivePlayerCombinations,
  getOtherPlayerCombinations,
  getPossibleSums,
} from './diceHelpers'

describe('diceHelpers', () => {
  describe('rollDie', () => {
    it('should return a number between 1 and 6', () => {
      for (let i = 0; i < 100; i++) {
        const result = rollDie()
        expect(result).toBeGreaterThanOrEqual(1)
        expect(result).toBeLessThanOrEqual(6)
        expect(Number.isInteger(result)).toBe(true)
      }
    })
  })
  
  describe('rollAllDice', () => {
    it('should return a DiceState with all six dice', () => {
      const dice = rollAllDice()
      
      expect(dice).toHaveProperty('white1')
      expect(dice).toHaveProperty('white2')
      expect(dice).toHaveProperty('red')
      expect(dice).toHaveProperty('yellow')
      expect(dice).toHaveProperty('green')
      expect(dice).toHaveProperty('blue')
      
      // All values should be between 1 and 6
      expect(dice.white1).toBeGreaterThanOrEqual(1)
      expect(dice.white1).toBeLessThanOrEqual(6)
      expect(dice.white2).toBeGreaterThanOrEqual(1)
      expect(dice.white2).toBeLessThanOrEqual(6)
      expect(dice.red).toBeGreaterThanOrEqual(1)
      expect(dice.red).toBeLessThanOrEqual(6)
      expect(dice.yellow).toBeGreaterThanOrEqual(1)
      expect(dice.yellow).toBeLessThanOrEqual(6)
      expect(dice.green).toBeGreaterThanOrEqual(1)
      expect(dice.green).toBeLessThanOrEqual(6)
      expect(dice.blue).toBeGreaterThanOrEqual(1)
      expect(dice.blue).toBeLessThanOrEqual(6)
    })
  })
  
  describe('getWhiteDiceSum', () => {
    it('should return the sum of white dice', () => {
      const dice = {
        white1: 3,
        white2: 4,
        red: 5,
        yellow: 2,
        green: 6,
        blue: 1,
      }
      
      expect(getWhiteDiceSum(dice)).toBe(7)
    })
  })
  
  describe('getActivePlayerCombinations', () => {
    it('should return all possible combinations with no locked rows', () => {
      const dice = {
        white1: 2,
        white2: 3,
        red: 4,
        yellow: 5,
        green: 6,
        blue: 1,
      }
      
      const combinations = getActivePlayerCombinations(dice, [])
      
      // White dice sum
      expect(combinations).toContainEqual({ color: null, sum: 5 })
      
      // Red combinations
      expect(combinations).toContainEqual({ color: 'red', sum: 6 }) // white1 + red
      expect(combinations).toContainEqual({ color: 'red', sum: 7 }) // white2 + red
      
      // Yellow combinations
      expect(combinations).toContainEqual({ color: 'yellow', sum: 7 }) // white1 + yellow
      expect(combinations).toContainEqual({ color: 'yellow', sum: 8 }) // white2 + yellow
      
      // Green combinations
      expect(combinations).toContainEqual({ color: 'green', sum: 8 }) // white1 + green
      expect(combinations).toContainEqual({ color: 'green', sum: 9 }) // white2 + green
      
      // Blue combinations
      expect(combinations).toContainEqual({ color: 'blue', sum: 3 }) // white1 + blue
      expect(combinations).toContainEqual({ color: 'blue', sum: 4 }) // white2 + blue
    })
    
    it('should exclude locked rows from combinations', () => {
      const dice = {
        white1: 2,
        white2: 3,
        red: 4,
        yellow: 5,
        green: 6,
        blue: 1,
      }
      
      const combinations = getActivePlayerCombinations(dice, ['red', 'blue'])
      
      // Should not include red or blue combinations
      expect(combinations.find(c => c.color === 'red')).toBeUndefined()
      expect(combinations.find(c => c.color === 'blue')).toBeUndefined()
      
      // Should still include yellow and green
      expect(combinations.find(c => c.color === 'yellow')).toBeDefined()
      expect(combinations.find(c => c.color === 'green')).toBeDefined()
      
      // Should still include white dice sum
      expect(combinations).toContainEqual({ color: null, sum: 5 })
    })
    
    it('should not duplicate sums when white dice produce same result', () => {
      const dice = {
        white1: 3,
        white2: 3,
        red: 4,
        yellow: 5,
        green: 6,
        blue: 1,
      }
      
      const combinations = getActivePlayerCombinations(dice, [])
      
      // Red combinations - should only have one entry for sum 7 (3 + 4)
      const redCombinations = combinations.filter(c => c.color === 'red')
      expect(redCombinations.length).toBe(1)
      expect(redCombinations[0].sum).toBe(7)
    })
  })
  
  describe('getOtherPlayerCombinations', () => {
    it('should only return white dice sum', () => {
      const dice = {
        white1: 3,
        white2: 4,
        red: 5,
        yellow: 2,
        green: 6,
        blue: 1,
      }
      
      const combinations = getOtherPlayerCombinations(dice)
      
      expect(combinations).toHaveLength(1)
      expect(combinations[0]).toEqual({ color: null, sum: 7 })
    })
  })
  
  describe('getPossibleSums', () => {
    it('should return unique sorted sums', () => {
      const dice = {
        white1: 2,
        white2: 3,
        red: 4,
        yellow: 5,
        green: 6,
        blue: 1,
      }
      
      const sums = getPossibleSums(dice, [])
      
      // Should be sorted
      for (let i = 1; i < sums.length; i++) {
        expect(sums[i]).toBeGreaterThan(sums[i - 1])
      }
      
      // Should include expected sums
      expect(sums).toContain(3) // white1 + blue
      expect(sums).toContain(4) // white2 + blue
      expect(sums).toContain(5) // white1 + white2
      expect(sums).toContain(6) // white1 + red
      expect(sums).toContain(7) // white1 + yellow or white2 + red
      expect(sums).toContain(8) // white1 + green or white2 + yellow
      expect(sums).toContain(9) // white2 + green
      
      // Check uniqueness
      expect(new Set(sums).size).toBe(sums.length)
    })
    
    it('should exclude sums from locked rows', () => {
      const dice = {
        white1: 1,
        white2: 1,
        red: 1,
        yellow: 1,
        green: 6,
        blue: 6,
      }
      
      const sums = getPossibleSums(dice, ['green', 'blue'])
      
      // Should not have sums from green (1+6=7) or blue (1+6=7)
      // Should only have white sum (2) and red/yellow combinations
      expect(sums).toContain(2) // white1 + white2
      expect(sums).toContain(2) // white1/2 + red/yellow (same as white sum)
      
      // With green and blue locked, max sum should be from yellow or red
      const maxSum = Math.max(...sums)
      expect(maxSum).toBeLessThanOrEqual(2) // white + red/yellow = 1 + 1 = 2
    })
  })
})
