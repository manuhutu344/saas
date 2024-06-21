import React from 'react'
import { useToast } from "@/components/ui/use-toast"
import {CldUploadWidget} from "next-cloudinary"

interface Props{
    onValueChange: (value: string) => void
    setImage: React.Dispatch<any>
    publicId: string
    image: any
    type: string
}

function MediaUploader({onValueChange, setImage, publicId, image, type}:Props) {
    const { toast } = useToast()
    function onUploadSuccessHandler(result: any){
        toast({
            title: "Gambar Berhasil Di Upload",
            description: "1 Credit Diambil",
            duration: 5000,
            className: "success-toast"
        })
    }
    function onUploadErrorHandler(){
        toast({
            title: "Ada Sesuatu Yang Salah",
            description: "Coba Lagi",
            duration: 5000,
            className: "error-toast"
        })
    }
  return (
    <CldUploadWidget uploadPreset="jsm_imaginify" options={{
        multiple: false,
        resourceType:"image",
    }} onSuccess={onUploadSuccessHandler} onError={onUploadErrorHandler}>
        {({open})=>(
            <div className="flex flex-col gap-4">
                <h3 className="h3-bold text-dark-600">
                    Original
                </h3>
                {publicId ?(
                    <>
                        Ini Gambar
                    </>
                ):(
                    <div>
                        Ini Tidak Ada Gambar
                    </div>
                )}
            </div>
        )}
    </CldUploadWidget>
  )
}

export default MediaUploader