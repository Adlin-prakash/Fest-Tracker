import React from "react";

function Modal({
  isOpen,
  onClose,
  onSubmit,
  status,
  setStatus,
  currentRound,
  setCurrentRound,
  roundDetails,
  setRoundDetails,
  handleRoundChange,
  handleAddRound,
  winnerName,
  setWinnerName,
  winnerCollege,
  setWinnerCollege,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded shadow-lg w-1/2">
        <h2 className="text-2xl mb-4">Update Event Details</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Current Round</label>
          <input
            type="text"
            value={currentRound}
            onChange={(e) => setCurrentRound(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Round Details</label>
          {roundDetails.map((round, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                name="roundNumber"
                placeholder="Round Number"
                value={round.roundNumber}
                onChange={(e) => handleRoundChange(index, e)}
                className="border p-2 w-full mb-2"
              />
              <input
                type="text"
                name="timing"
                placeholder="Timing"
                value={round.timing}
                onChange={(e) => handleRoundChange(index, e)}
                className="border p-2 w-full"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddRound}
            className="bg-blue-500 text-white p-2 rounded mt-2"
          >
            Add Round
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Winner Name</label>
          <input
            type="text"
            value={winnerName}
            onChange={(e) => setWinnerName(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Winner College</label>
          <input
            type="text"
            value={winnerCollege}
            onChange={(e) => setWinnerCollege(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
