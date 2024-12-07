import { X } from 'lucide-react'

export function CancelSubscriptionModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-main rounded-lg p-8 max-w-md w-full shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Cancel Subscription</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="mb-6 text-gray-300">
          Are you sure you want to cancel your subscription? You will lose access to all premium features.
        </p>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition-colors"
          >
            Confirm Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

