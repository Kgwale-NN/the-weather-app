import React , {type ButtonHTMLAttributes} from 'react'
import styles from './Button.module.css'

export const Button:React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({className = '', children , ...rest}) => {
  return (
   
    <button className={`${styles.button} ${className}`} {...rest}>

        {children}
        
    </button>

  )
}
