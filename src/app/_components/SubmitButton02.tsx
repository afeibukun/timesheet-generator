export default function SubmitButton02({ handleButtonClick, showLoading, loadingText, children }: any) {
    return (
        <button type="button"
            onClick={handleButtonClick}
            className="inline-flex items-center px-8 py-2 rounded relative uppercase text-sm font-semibold bg-purple-700 text-white">
            <span className={`inline-flex items-center absolute ${showLoading ? 'visible' : 'invisible'}`}>
                <span className="inline-block mr-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </span>
                <span>
                    <span>{loadingText}</span>
                    <span>...</span>
                </span>
            </span>
            <span className={`${showLoading ? 'invisible' : 'visible'}`}>{children}</span>
        </button>
    )
}