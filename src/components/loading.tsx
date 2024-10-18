

export default function Loading() {
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="flex space-x-2">
                <div className="w-4 h-4 bg-black rounded-full animate-bounce"></div>
                <div className="w-4 h-4 bg-black rounded-full animate-bounce200"></div>
                <div className="w-4 h-4 bg-black rounded-full animate-bounce400"></div>
            </div>

        </div>
    )
}