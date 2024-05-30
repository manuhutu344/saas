import Header from '@/components/shared/Header'
import React from 'react'
import { transformationTypes } from '@/constants'

function page({params:{type}}: SearchParamProps) {
  const transformation = transformationTypes[type]
  return (
    <Header title={transformation.title} subtitle={transformation.subTitle} />
  )
}

export default page