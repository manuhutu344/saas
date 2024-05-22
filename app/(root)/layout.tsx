import React from 'react'

interface Props{
    children: React.ReactNode
}

function layout({children}:Props) {
  return (
    <main className='root'>
        <div className="root-container">
            <div className="wrapper">
                {children}
            </div>
        </div>
    </main>
  )
}

export default layout