import React from 'react'
import {Cloud, Sun , Moon} from 'lucide-react'
import styles from './Header.module.css'

type HeaderProps = {

    theme: 'light' | 'dark',
    onThemeToggle: () => void,
    unit: 'celsius' | 'fahrenheit',
    onUnitToggle: () => void

}

export const Header:React.FC<HeaderProps> = ({theme,onThemeToggle,unit,onUnitToggle}) => {                                                                                                                                                                       

  return (
    
    <header className={`${styles.header} ${theme === 'dark' ? styles.dark : ''}`}>

       <div>

       <div className={`${styles.logo} ${theme === 'dark' ? styles.dark : ''}`}>

        <Cloud size={24} />
        <span>Weather App</span>

       </div>

       <div className={styles.controls}>                                             

        <button className={`${styles.iconButton} ${theme === 'dark'  ? styles.dark : ''}`} onClick={onThemeToggle} aria-label = "Toggle theme">

          {theme === 'light' ? <Sun  size={24} /> : <Moon size={24} />} 
        </button>

        <button className={`${styles.unitButton} ${theme === 'dark' ? styles.dark : ''}`} onClick={onUnitToggle} aria-label="Toggle temperature unit">
             
 
         {unit === 'celsius' ? '\u00B0C' : '\u00B0F'} 

         </button> 

       </div>

       </div>

    </header>
  )
}
