import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from './ui/button';
import { PropsWithoutRef, ReactNode, useState } from "react"

function NkDialog({ children, itemID, dialogContent, dialogTitle, dialogDescription, deleteFunction }: PropsWithoutRef<JSX.IntrinsicElements['div'] & {
    dialogContent: ReactNode
    dialogTitle: ReactNode
    dialogDescription: ReactNode
    itemID: string
    deleteFunction: (itemId: number | string) => void
}>) {
    return <Dialog>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogDescription>
                    {dialogDescription}
                </DialogDescription>
                {dialogContent}
            </DialogHeader>
            <div className="flex flex-row justify-between">
                <DialogClose asChild>
                    <Button
                        className="w-16"
                        onClick={() => {
                            deleteFunction(itemID)
                        }}>OK
                    </Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Cancel
                    </Button>
                </DialogClose>
            </div>
        </DialogContent>
    </Dialog >
}

export default NkDialog