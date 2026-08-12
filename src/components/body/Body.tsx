import React from 'react'
import styles from './Body.module.css'

type BodyProps = {

    theme?: 'light' | 'dark',
    children?: React.ReactNode
}

export const Body:React.FC<BodyProps> = ({theme = 'light',children}) => {
  return (

     <main className={`${styles.body} ${theme === 'dark' ? styles.dark : '' }`}>

        <div className={styles.container}>

         {children}

        </div>

     </main>

  )
}
