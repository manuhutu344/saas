"use client"

import React from 'react'
import { useToast } from "@/components/ui/use-toast"
import {CldImage, CldUploadWidget} from "next-cloudinary"
import Image from 'next/image'
import { dataUrl, getImageSize } from '@/lib/utils'
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props'

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
        setImage((prevState: any)=>({
            ...prevState, 
            publicId: result?.info?.public_id,
            width: result?.info?.width,
            height: result?.info?.height,
            secureURL: result?.info?.secure_url
        }))
        onValueChange(result?.info?.public_id)
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
                        <div className="cursor-pointer overflow-hidden rounded-[10px]">
                            <CldImage width={getImageSize(type, image, "width")} height={getImageSize(type, image, "height")} src={publicId} alt='image' sizes={"(max-width: 767px) 100vw, 50vw"} placeholder={dataUrl as PlaceholderValue} className="media-uploader_cldImage" />
                        </div>
                    </>
                ):(
                    <div className="media-uploader_cta" onClick={()=>open()}>
                        <div className="media-uploader_cta-image">
                            <Image src="/assets/icons/add.svg" alt='Add Image' width={24} height={24}  />
                        </div>
                        <p className="p-14-medium">
                            Click Disini Untuk Upload
                        </p>
                    </div>
                )}
            </div>
        )}
    </CldUploadWidget>
  )
}

export default MediaUploader