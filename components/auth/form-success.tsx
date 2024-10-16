import { CheckCircle2 } from "lucide-react"


const FormSuccess = ({ message }: { message?: string }) => {
    if (!message) return
    return (
        <div className="bg-teal-400/25 text-secondary-foreground flex items-center gap-2 my-3 p-2 rounded-sm">
            <CheckCircle2 className="w-4 h-4" />
            <p>{message}</p>
        </div>
    )
}

export default FormSuccess