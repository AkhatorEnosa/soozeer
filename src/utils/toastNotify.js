import { toast, Flip } from 'react-toastify';

export const showSuccessToast = (message) => {
    toast.success(message, {
        className: "text-sm font-semibold",
        autoClose: 2000,
        position: 'top-right',
        closeOnClick: true,
        transition: Flip,
        hideProgressBar: true
    });
};

export const showErrorToast = (message) => {
    toast.error(message, {
        className: "text-sm font-semibold",
        autoClose: 2000,
        position: 'top-right',
        closeOnClick: true,
        transition: Flip,
        hideProgressBar: true
    });
};
