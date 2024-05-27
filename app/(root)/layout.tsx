import MobileNav from '@/components/shared/MobileNav'
import Sidebar from '@/components/shared/Sidebar'
import React from 'react'

interface Props{
    children: React.ReactNode
}

function layout({children}:Props) {
  return (
    <main className='root'>
      <Sidebar />
      <MobileNav />
        <div className="root-container">
            <div className="wrapper">
                {children}
            </div>
        </div>
    </main>
  )
}

export default layout