import { AlertCircle } from "lucide-react"

const FormError = ({ message }: { message?: string }) => {
    if (!message) return
    return (
        <div className="bg-destructive/90 text-secondary-foreground  flex items-center gap-2 my-3 p-2 rounded-sm">
            <AlertCircle className="w-4 h-4" />
            <p>{message}</p>
        </div>
    )
}

export default FormError