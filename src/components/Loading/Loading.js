import React from 'react'

function Loading(props) {
   return (
      <><div className={`bigParent ${props.dark ? 'dark' : 'light'}`}>
         <div className='parent'>
            <div className='first'></div>
         </div>
         <div className='parent'>
            <div className='second'></div>
         </div>
         <div className='parent'>
            <div className='third'></div>
         </div>
      </div>
      </>
   )
}

export default Loading;