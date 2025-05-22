import React from 'react'

function Input({search, onChange,placeholder,varient}) {
  return (
    <input
            type="text"
            className={varient}
            placeholder={placeholder}
            value={search}
            onChange={onChange}
          />
  )
}

export default Input
