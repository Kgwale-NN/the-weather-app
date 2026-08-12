import { useState } from 'react'

export const useLocalStorage = <T>(key: string,defaultvalue:T) => {
  
    const [storedValue,setStoredValue] = useState<T>(() => {

        try{

            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item): defaultvalue
        }catch(error){

          console.error(error)
          return defaultvalue
        }
    })


      const setValue = (value:T) => {

        try{

            setStoredValue(value)
            window.localStorage.setItem(key,JSON.stringify(value))
        }catch(error){

              console.error(error)

        }
      }

      return [storedValue,setValue] as const
}
