import { ToastStatus } from "@/lib/constants/enum";

type ToastNotificationPropsType = {
    toastType: ToastStatus,
    toastText: string,
}

export default function ToastNotification({ toastType, toastText }: ToastNotificationPropsType) {
    const notificationIcon = {
        success: <SuccessIcon />,
        danger: <DangerIcon />,
        info: <InfoIcon />
    }

    const notificationColor = {
        success: {
            bgColor: 'bg-green-100',
            progressBarColor: 'bg-green-700'
        },
        danger: {
            bgColor: 'bg-red-100',
            progressBarColor: 'bg-red-700'
        },
        info: {
            bgColor: 'bg-blue-100',
            progressBarColor: 'bg-blue-700'
        }
    }

    return (<div className="toast-notification-container">
        <div className={`toast-notification fixed w-80 top-6 right-6 p-2 rounded shadow-md ease-in-out opacity-90 animate-slideInRight ${'animate-fadeOut'} z-10 ${notificationColor[toastType].bgColor ?? 'bg-slate-100'} `}>
            <div className="px-2 py-2">
                <div className="flex gap-x-2">
                    <div className="icon">
                        {notificationIcon[toastType]}
                    </div>
                    <div className="message">
                        <p className="text-sm font-bold">{toastText}</p>
                    </div>
                </div>
            </div>
            <div className={`toast-progress absolute block bottom-0 left-0 h-1 w-full animate-progress ${notificationColor[toastType].progressBarColor ?? 'bg-slate-700'}`}></div>
        </div>
    </div>)
}

const SuccessIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>;
const DangerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" /> </svg>
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"> <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /> </svg>