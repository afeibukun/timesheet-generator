export default function DefaultSubmitButton({ handleButtonClick, children }: any) {
    return (
        <button type="button"
            onClick={handleButtonClick}
            className="inline-flex items-center px-8 py-2 rounded relative uppercase text-sm font-semibold bg-purple-700 text-white">
            <span className="">{children}</span>
        </button>
    )

}