'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Toggle } from "@/components/ui/toggle"
import { Bold, Italic, List, ListOrdered, Strikethrough } from 'lucide-react'
import { useEffect } from 'react'
import { useFormContext } from "react-hook-form"

const Tiptap = ({ val }: { val: string }) => {
    const { setValue } = useFormContext()
    const editor = useEditor({

        editorProps: {
            attributes: {
                class: "min-h-[80px] w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
            }
        },
        extensions: [StarterKit.configure({
            orderedList: {
                HTMLAttributes: {
                    class: "list-decimal pl-4"
                }
            },
            bulletList: {
                HTMLAttributes: {
                    class: "list-disc pl-4"
                }
            }
        })],
        content: val,

        onUpdate: ({ editor }) => {
            const content = editor.getHTML()
            setValue("description", content, {
                shouldValidate: true,
                shouldDirty: true,
            })
        },
    })

    useEffect(() => {
        if (editor?.isEmpty) editor.commands.setContent(val)
    }, [val])
    return (
        <div className='flex flex-col gap-2'>
            {
                editor && (
                    <div className='border-input border rounded-md'>
                        <Toggle
                            pressed={editor.isActive("bold")}
                            onPressedChange={() => editor.chain().focus().toggleBold().run()}
                            size={"sm"}
                        >
                            <Bold />
                        </Toggle>
                        <Toggle
                            pressed={editor.isActive("italic")}
                            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                            size={"sm"}
                        >
                            <Italic />
                        </Toggle>
                        <Toggle
                            pressed={editor.isActive("strike")}
                            onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                            size={"sm"}
                        >
                            <Strikethrough />
                        </Toggle>
                        <Toggle
                            pressed={editor.isActive("orderList")}
                            onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                            size={"sm"}
                        >
                            <ListOrdered />
                        </Toggle>
                        <Toggle
                            pressed={editor.isActive("bulledList")}
                            onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                            size={"sm"}
                        >
                            <List />
                        </Toggle>
                    </div>
                )
            }
            <EditorContent editor={editor} />
        </div>
    )
}

export default Tiptap
