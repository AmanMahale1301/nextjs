import React, { useEffect } from 'react'

const error = ({error,reset}) => {
  useEffect(() => {
   
    console.error(error)
  }, [error])
  
  return (
    <>
    <h2>Something went wrong!</h2>
    <button onClick={()=>reset()}>
      Try again
    </button>
    </>
  )
}

export default error