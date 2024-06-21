"use client"

import React, { useState, useTransition } from 'react'
import {  z } from "zod"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from '@/constants'
import { CustomField } from './CostomField'
import { AspectRatioKey, debounce, deepMergeObjects } from '@/lib/utils'
import { updateCredits } from '@/lib/actions/user.actions'
import MediaUploader from './MediaUploader'
 
export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string()
})

function TransformationForm({action, data = null, userId, type, creditBalance, config = null}:TransformationFormProps) {
  const transformationType = transformationTypes[type]
  const [image, setImage] = useState(data)
  const [newTransformation, setNewTransformation] = useState<Transformations | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTransforming, setIsTransforming] = useState(false)
  const [transformationConfig, setTransformationConfig] = useState(config)
  const [isPending, startTransition] = useTransition()
  const initialValues = data && action === "Update" ? {
    title: data?.title,
    aspectRatio: data?.aspectRatio,
    color: data?.color,
    prompt: data?.prompt,
    publicId: data?.publicId,
  }: defaultValues
    // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  function onSelectFieldHandler(value: string, onChangeField: (value: string) => void){
      const imageSizes = aspectRatioOptions[value as AspectRatioKey]
      setImage((prevState : any)=>({
        ...prevState,
        aspectRatio: imageSizes.aspectRatio,
        width: imageSizes.width,
        height: imageSizes.height
      }))
      setNewTransformation(transformationType.config)

      return onChangeField
  }

  function onInputChangeHandler(fieldName: string, value: string, type: string, onChangeField: (value: string)=>void){
    debounce(()=>{
      setNewTransformation((prevState: any)=>({
        ...prevState,
        [type]:{
          ...prevState?.[type],
          [fieldName === "prompt" ? "prompt" : "to"]:
          value
        }
      }))
      return onChangeField(value)
    }, 1000)
  }

  async function onTransformHandler(){
    setIsTransforming(true)
    setTransformationConfig(
      deepMergeObjects(newTransformation, transformationConfig)
    )
    setNewTransformation(null)
    startTransition(async()=>{
      // await updateCredits(userId, creditFee)
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomField control={form.control} name="title" formLabel="Image Title" className="w-full" render={({field})=> <Input {...field} className='input-field' />} />
        {type === "fill" && (
          <CustomField control={form.control} name='aspectRatio' formLabel='Aspect Ratio' className="w-full" render={({field})=>(
      <Select
      onValueChange={(value)=>onSelectFieldHandler(value, field.onchange)}
      >
          <SelectTrigger className="select-field">
            <SelectValue placeholder="Pilih Ukurannya" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(aspectRatioOptions).map((key)=>(
              <SelectItem key={key} value={key} className="select-item">
                  {aspectRatioOptions[key as AspectRatioKey].label}
              </SelectItem>
            ))}
          </SelectContent>
     </Select>

          )} />
        )}
        {(type === "remove" || type === "recolor") && (
          <div className="prompt-field">
              <CustomField control={form.control} name="prompt" formLabel={
                type === "remove" ? "Object di hapus" : "Object di warnain ulang"
              } className="w-full" render={({field})=>(
                <Input value={field.value} className="input-field" onChange={(e)=> onInputChangeHandler(
                  'prompt',
                  e.target.value,
                  type,
                  field.onChange
                )} />
              )} />
              {type === "recolor" && (
                <CustomField control={form.control} name="color" formLabel="Warna Pengganti" className="w-full" render={({field})=>(
                  <Input value={field.value} className="input-field" onChange={(e)=> onInputChangeHandler(
                    'color',
                    e.target.value,
                    'recolor',
                    field.onChange
                  )} />
                )}  />
              )}
          </div>
        )}
        <div className="media-uploader-field">
              <CustomField control={form.control} name="publicId" className="flex size-full flex-col" render={({field})=>(
                <MediaUploader onValueChange={field.onChange} setImage={setImage} publicId={field.value} image={image} type={type} />
              )} />
        </div>
        <div className="flex flex-col gap-4">
          <Button type="button" className="submit-button capitalize"
            disabled={isTransforming || newTransformation
                    === null
            }
            onClick={onTransformHandler}
            >
              {isTransforming ? "Transformasi..." : "Terapkan Transformasi"}
            </Button>
          <Button type="submit" className="submit-button capitalize"
          disabled={isSubmitting}
          >
            {isSubmitting ? "Mengirimkan..." : "Simpan Gambar"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default TransformationForm