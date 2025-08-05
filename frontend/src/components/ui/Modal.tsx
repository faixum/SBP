import React from 'react';
import { X } from '../icons/LucideIcons';
import { Button } from './Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                {/* Modal panel */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-grow">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    {title}
                                </h3>
                            </div>
                            <div className="mt-3 text-center sm:mt-0">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={onClose}
                                    className="rounded-full p-2 h-auto w-auto text-gray-400 hover:text-gray-500"
                                    aria-label="Close modal"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                         <div className="mt-5">
                            {children}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};