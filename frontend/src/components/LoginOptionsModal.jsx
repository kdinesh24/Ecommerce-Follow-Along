const LoginOptionsModal = ({ isOpen, onClose, onSelectRole }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Select Login Type</h2>
        <p className="text-gray-600 mb-6">
          Please select how you would like to login to your account
        </p>
        <div className="space-y-4">
          <button
            onClick={() => onSelectRole('seller')}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Login as Seller
          </button>
          
          <button
            onClick={() => onSelectRole('customer')}
            className="w-full py-3 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Login as Customer
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default LoginOptionsModal