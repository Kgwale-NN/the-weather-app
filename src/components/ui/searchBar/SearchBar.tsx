import { useState, useEffect, useRef } from 'react';
import styles from './SearchBar.module.css'
import { Search } from 'lucide-react'
import { TextInput } from '../textInput/TextInput'
import { Button } from '../button/Button'
import { weatherAPI } from '../../../services/weatherAPI'
import { type SearchLocation } from '../../../types/weather.types'

type SearchBarProps = {
    onSearch: (location: string) => void,
    theme?: 'light' | 'dark',
    placeholder?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, theme, placeholder }) => {
    const [searchValue, setSearchValue] = useState('')
    const [suggestions, setSuggestions] = useState<SearchLocation[]>([])
    const [showDropdown, setShowDropdown] = useState(false)
    const [loading, setLoading] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (navigator.onLine && searchValue.trim().length >= 2) {
                setLoading(true)
                try {
                    const results = await weatherAPI.searchLocation(searchValue)
                    setSuggestions(results)
                    setShowDropdown(true)
                } catch (error) {
                    console.error('Search error:', error)
                    setSuggestions([])
                } finally {
                    setLoading(false)
                }
            } else {
                setSuggestions([])
                setShowDropdown(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [searchValue])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSearch = () => {
        if (searchValue.trim()) {
            onSearch(searchValue)
            setSearchValue('')
            setShowDropdown(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    const handleSelectLocation = (location: SearchLocation) => {
        onSearch(location.name)
        setSearchValue('')
        setShowDropdown(false)
    }

    return (
        <div className={`${styles.searchBar} ${theme === 'dark' ? styles.dark : ''}`} ref={dropdownRef}>
            <div className={styles.inputWrapper}>
                <TextInput 
                    placeholder={placeholder} 
                    value={searchValue} 
                    onChange={(e) => setSearchValue(e.target.value)} 
                    onKeyPress={handleKeyPress}
                />
            </div>

            <Button className={styles.SearchButton} onClick={handleSearch}>
                <Search size={20} />
            </Button>

            {showDropdown && suggestions.length > 0 && (
                <div className={`${styles.dropdown} ${theme === 'dark' ? styles.dark : ''}`}>
                    {loading ? (
                        <div className={styles.loading}>Loading...</div>
                    ) : (
                        suggestions.map((location, index) => (
                            <div
                                key={index}
                                className={`${styles.suggestion} ${theme === 'dark' ? styles.dark : ''}`}
                                onClick={() => handleSelectLocation(location)}
                            >
                                <div className={styles.locationName}>{location.name}</div>
                                <div className={styles.locationDetails}>
                                    {location.region && <span>{location.region}, </span>}
                                    {location.country}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}