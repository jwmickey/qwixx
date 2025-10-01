import { describe, it, expect } from 'vitest'
import {
  generatePlayerId,
  createRowNumbers,
  createColorRow,
  createScoreSheet,
  calculateRowScore,
  calculateTotalScore,
  createPlayer,
  canMarkNumber,
  canLockRow,
  shouldGameEnd,
} from './gameHelpers'

describe('gameHelpers', () => {
  describe('generatePlayerId', () => {
    it('should generate a unique player ID', () => {
      const id1 = generatePlayerId()
      const id2 = generatePlayerId()
      
      expect(id1).toMatch(/^player-\d+-[a-z0-9]+$/)
      expect(id2).toMatch(/^player-\d+-[a-z0-9]+$/)
      expect(id1).not.toBe(id2)
    })
  })
  
  describe('createRowNumbers', () => {
    it('should create ascending numbers for red row', () => {
      const numbers = createRowNumbers('red')
      
      expect(numbers).toHaveLength(11)
      expect(numbers[0]).toEqual({ number: 2, marked: false })
      expect(numbers[10]).toEqual({ number: 12, marked: false })
    })
    
    it('should create ascending numbers for yellow row', () => {
      const numbers = createRowNumbers('yellow')
      
      expect(numbers).toHaveLength(11)
      expect(numbers[0]).toEqual({ number: 2, marked: false })
      expect(numbers[10]).toEqual({ number: 12, marked: false })
    })
    
    it('should create descending numbers for green row', () => {
      const numbers = createRowNumbers('green')
      
      expect(numbers).toHaveLength(11)
      expect(numbers[0]).toEqual({ number: 12, marked: false })
      expect(numbers[10]).toEqual({ number: 2, marked: false })
    })
    
    it('should create descending numbers for blue row', () => {
      const numbers = createRowNumbers('blue')
      
      expect(numbers).toHaveLength(11)
      expect(numbers[0]).toEqual({ number: 12, marked: false })
      expect(numbers[10]).toEqual({ number: 2, marked: false })
    })
  })
  
  describe('createColorRow', () => {
    it('should create a color row with correct structure', () => {
      const row = createColorRow('red')
      
      expect(row.color).toBe('red')
      expect(row.numbers).toHaveLength(11)
      expect(row.locked).toBe(false)
    })
  })
  
  describe('createScoreSheet', () => {
    it('should create a score sheet with all four rows', () => {
      const scoreSheet = createScoreSheet()
      
      expect(scoreSheet.red.color).toBe('red')
      expect(scoreSheet.yellow.color).toBe('yellow')
      expect(scoreSheet.green.color).toBe('green')
      expect(scoreSheet.blue.color).toBe('blue')
    })
  })
  
  describe('calculateRowScore', () => {
    it('should calculate score for 0 marks', () => {
      const row = createColorRow('red')
      expect(calculateRowScore(row)).toBe(0)
    })
    
    it('should calculate score for 1 mark', () => {
      const row = createColorRow('red')
      row.numbers[0].marked = true
      expect(calculateRowScore(row)).toBe(1)
    })
    
    it('should calculate score for 2 marks', () => {
      const row = createColorRow('red')
      row.numbers[0].marked = true
      row.numbers[1].marked = true
      expect(calculateRowScore(row)).toBe(3)
    })
    
    it('should calculate score for 5 marks', () => {
      const row = createColorRow('red')
      for (let i = 0; i < 5; i++) {
        row.numbers[i].marked = true
      }
      expect(calculateRowScore(row)).toBe(15)
    })
    
    it('should calculate score for all 11 marks', () => {
      const row = createColorRow('red')
      row.numbers.forEach(n => n.marked = true)
      expect(calculateRowScore(row)).toBe(66)
    })
  })
  
  describe('calculateTotalScore', () => {
    it('should calculate total score with no marks or penalties', () => {
      const player = createPlayer('Test Player')
      expect(calculateTotalScore(player)).toBe(0)
    })
    
    it('should calculate total score with penalties', () => {
      const player = createPlayer('Test Player')
      player.penalties = 2
      expect(calculateTotalScore(player)).toBe(-10)
    })
    
    it('should calculate total score with marks and penalties', () => {
      const player = createPlayer('Test Player')
      player.scoreSheet.red.numbers[0].marked = true
      player.scoreSheet.red.numbers[1].marked = true
      player.penalties = 1
      expect(calculateTotalScore(player)).toBe(-2) // 3 points - 5 penalty
    })
  })
  
  describe('createPlayer', () => {
    it('should create a player with correct structure', () => {
      const player = createPlayer('John Doe')
      
      expect(player.name).toBe('John Doe')
      expect(player.id).toMatch(/^player-/)
      expect(player.penalties).toBe(0)
      expect(player.totalScore).toBe(0)
      expect(player.scoreSheet).toBeDefined()
    })
  })
  
  describe('canMarkNumber', () => {
    it('should allow marking any number on empty row', () => {
      const row = createColorRow('red')
      
      expect(canMarkNumber(row, 2)).toBe(true)
      expect(canMarkNumber(row, 7)).toBe(true)
      expect(canMarkNumber(row, 12)).toBe(true)
    })
    
    it('should not allow marking if row is locked', () => {
      const row = createColorRow('red')
      row.locked = true
      
      expect(canMarkNumber(row, 5)).toBe(false)
    })
    
    it('should not allow marking already marked number', () => {
      const row = createColorRow('red')
      row.numbers[0].marked = true
      
      expect(canMarkNumber(row, 2)).toBe(false)
    })
    
    it('should only allow marking numbers to the right of rightmost mark', () => {
      const row = createColorRow('red')
      row.numbers[2].marked = true // Mark number 4
      
      expect(canMarkNumber(row, 2)).toBe(false) // To the left
      expect(canMarkNumber(row, 3)).toBe(false) // To the left
      expect(canMarkNumber(row, 5)).toBe(true)  // To the right
      expect(canMarkNumber(row, 12)).toBe(true) // To the right
    })
    
    it('should work with descending rows (green/blue)', () => {
      const row = createColorRow('green')
      row.numbers[1].marked = true // Mark number 11
      
      expect(canMarkNumber(row, 12)).toBe(false) // To the left
      expect(canMarkNumber(row, 10)).toBe(true)  // To the right
      expect(canMarkNumber(row, 2)).toBe(true)   // To the right
    })
  })
  
  describe('canLockRow', () => {
    it('should not allow locking with less than 5 marks', () => {
      const row = createColorRow('red')
      for (let i = 0; i < 4; i++) {
        row.numbers[i].marked = true
      }
      
      expect(canLockRow(row, 12)).toBe(false)
    })
    
    it('should allow locking with 5+ marks on last number', () => {
      const row = createColorRow('red')
      for (let i = 0; i < 5; i++) {
        row.numbers[i].marked = true
      }
      
      expect(canLockRow(row, 12)).toBe(true)
    })
    
    it('should not allow locking with 5+ marks on non-last number', () => {
      const row = createColorRow('red')
      for (let i = 0; i < 5; i++) {
        row.numbers[i].marked = true
      }
      
      expect(canLockRow(row, 7)).toBe(false)
    })
    
    it('should work with descending rows (last number is 2)', () => {
      const row = createColorRow('green')
      for (let i = 0; i < 5; i++) {
        row.numbers[i].marked = true
      }
      
      expect(canLockRow(row, 2)).toBe(true)
      expect(canLockRow(row, 12)).toBe(false)
    })
  })
  
  describe('shouldGameEnd', () => {
    it('should return false with 0 locked rows and no penalties', () => {
      const players = [createPlayer('Player 1'), createPlayer('Player 2')]
      expect(shouldGameEnd(0, players)).toBe(false)
    })
    
    it('should return false with 1 locked row', () => {
      const players = [createPlayer('Player 1'), createPlayer('Player 2')]
      expect(shouldGameEnd(1, players)).toBe(false)
    })
    
    it('should return true with 2 locked rows', () => {
      const players = [createPlayer('Player 1'), createPlayer('Player 2')]
      expect(shouldGameEnd(2, players)).toBe(true)
    })
    
    it('should return true when a player has 4 penalties', () => {
      const players = [createPlayer('Player 1'), createPlayer('Player 2')]
      players[0].penalties = 4
      expect(shouldGameEnd(0, players)).toBe(true)
    })
    
    it('should return false when a player has 3 penalties', () => {
      const players = [createPlayer('Player 1'), createPlayer('Player 2')]
      players[0].penalties = 3
      expect(shouldGameEnd(0, players)).toBe(false)
    })
  })
})
