import React from 'react';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="w-full max-w-sm bg-base-100 rounded-3xl shadow-2xl border border-base-300 p-6 relative" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-black text-base-content mb-2">Confirm Logout</h3>
                <p className="text-base-content/80 text-sm mb-6">
                    Are you sure you want to log out?
                </p>
                <div className="flex justify-end gap-3 mt-2">
                    <button className="btn btn-ghost rounded-xl" onClick={onClose}>Cancel</button>
                    <button 
                        className="btn btn-primary rounded-xl px-6" 
                        onClick={onConfirm}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
