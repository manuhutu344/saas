import React from 'react'

interface Props{
    children: React.ReactNode
}

function layout({children}:Props) {
  return (
    <main className="auth">
        {children}
    </main>
  )
}

export default layout