"use client"
export default function Error(
    {
        error,  
    }:
    {
        error: Error
    }
){
    return (
        <div className="w-full min-h-56 flex items-center justify-center flex-col">
            <h2>{ error.message }</h2>
            <button>Try Again</button>
        </div>
    )
}