import { Toast } from "react-bootstrap";

const CustomSuccessToast: React.FC<{
    show: boolean;
    toastMessage?: string;
    toastVariant?: string; 
    onClose: () => void;
}> = ({ show, toastMessage = '', toastVariant = 'success', onClose }) => {
    return (
        <Toast
            show={show}
            onClose={onClose}
            delay={60000}
            autohide
            style={{
                position: 'fixed',
                top: 20,
                right: 20,
                zIndex: 105000,
            }}
        >
            
            <Toast.Body
                className={`text-white fs-4 rounded border border-${toastVariant}`}
                style={{
                    padding: '10px',
                    cursor: 'pointer',
                    backgroundColor: toastVariant, 
                }}
            >
                {toastMessage}
                <div onClick={onClose} style={{ cursor: 'pointer', float: 'right' }}>
                    <i className="ri-close-line"></i> 
                </div>
            </Toast.Body>
        </Toast>
    );
};

export default CustomSuccessToast;
