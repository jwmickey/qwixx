/**
 * TutorialModal component - First-time user guide
 */

import { useState } from 'react'

interface TutorialModalProps {
  isOpen: boolean
  onClose: () => void
}

const tutorialSteps = [
  {
    title: 'Welcome to Qwixx! 🎲',
    content: (
      <div className="space-y-3">
        <p className="text-gray-700">
          Qwixx is a fast-paced dice game where you mark numbers on your score sheet to score points.
        </p>
        <p className="text-gray-700">
          Let's walk through the basics to get you started!
        </p>
      </div>
    ),
  },
  {
    title: 'Understanding Your Score Sheet',
    content: (
      <div className="space-y-3">
        <p className="text-gray-700">Each player has four colored rows:</p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>
            <span className="font-semibold text-red-600">Red</span> and{' '}
            <span className="font-semibold text-yellow-600">Yellow</span>: Numbers 2→12
          </li>
          <li>
            <span className="font-semibold text-green-600">Green</span> and{' '}
            <span className="font-semibold text-blue-600">Blue</span>: Numbers 12→2
          </li>
        </ul>
        <p className="text-gray-700 font-semibold">
          ⚠️ Numbers must be marked left-to-right. Once you skip a number, you can't go back!
        </p>
      </div>
    ),
  },
  {
    title: 'How a Turn Works',
    content: (
      <div className="space-y-3">
        <p className="text-gray-700">Each turn has three phases:</p>
        <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
          <li>
            <strong>White Dice Phase:</strong> All players can mark the sum of the two white dice
          </li>
          <li>
            <strong>Colored Dice Phase:</strong> Active player can mark one white + colored die combination
          </li>
          <li>
            <strong>Other Players Phase:</strong> Inactive players can mark the white dice if they haven't yet
          </li>
        </ol>
        <p className="text-gray-700 text-sm italic mt-3">
          Don't worry—the game will guide you through each phase!
        </p>
      </div>
    ),
  },
  {
    title: 'Important Rules',
    content: (
      <div className="space-y-3">
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>
            <strong>Penalties:</strong> If the active player doesn't mark anything, they get a -5 point penalty
          </li>
          <li>
            <strong>Locking Rows:</strong> When you mark at least 5 numbers and reach the end (2 or 12), you can lock the row
          </li>
          <li>
            <strong>Game End:</strong> The game ends when 2 rows are locked OR a player gets 4 penalties
          </li>
        </ul>
      </div>
    ),
  },
  {
    title: "You're Ready to Play!",
    content: (
      <div className="space-y-3">
        <p className="text-gray-700">
          That's all you need to know to get started! Remember:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>Click the <strong>Help</strong> button anytime to review the rules</li>
          <li>Valid numbers will be highlighted when you can mark them</li>
          <li>Follow the on-screen instructions during each phase</li>
        </ul>
        <p className="text-gray-700 font-semibold text-center mt-4">
          Have fun! 🎉
        </p>
      </div>
    ),
  },
]

export function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0)

  if (!isOpen) return null

  const isLastStep = currentStep === tutorialSteps.length - 1
  const isFirstStep = currentStep === 0

  const handleNext = () => {
    if (isLastStep) {
      onClose()
      setCurrentStep(0)
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1))
  }

  const handleSkip = () => {
    onClose()
    setCurrentStep(0)
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <h2 id="tutorial-title" className="text-xl font-bold text-gray-900">
              {tutorialSteps[currentStep].title}
            </h2>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600 text-sm"
              aria-label="Skip tutorial"
            >
              Skip
            </button>
          </div>
          {/* Progress indicator */}
          <div className="mt-3 flex gap-1">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded ${
                  index === currentStep ? 'bg-blue-600' : index < currentStep ? 'bg-blue-300' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-6 min-h-[250px]">{tutorialSteps[currentStep].content}</div>

        <div className="border-t border-gray-200 p-4 flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={isFirstStep}
            className={`px-4 py-2 rounded font-medium ${
              isFirstStep
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            aria-label="Previous step"
          >
            Previous
          </button>
          <div className="text-sm text-gray-500 self-center">
            {currentStep + 1} of {tutorialSteps.length}
          </div>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
            aria-label={isLastStep ? 'Finish tutorial' : 'Next step'}
          >
            {isLastStep ? 'Get Started!' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
