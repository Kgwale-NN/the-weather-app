import React , {type InputHTMLAttributes} from 'react'
import styles from './TextInput.module.css'

export const TextInput:React.FC<InputHTMLAttributes<HTMLInputElement>> = ({ className = '' , ...rest}) => {

  return (
   
    <input type='text' className={`${styles.input} ${className}`} {...rest} />
  )

}
