export const TextArea = ({onValueChange,  setTextValue, textValue }) => {
    return (
        <>
            <div className="mt-6">
                <textarea
                    type="textarea"
                    value={textValue}
                    onChange={(e) => onValueChange(e.target.value)}
                    id="large-input"
                    className="block w-full h-96 font-medium font-sans p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
            </div>
        </>
    );
};
