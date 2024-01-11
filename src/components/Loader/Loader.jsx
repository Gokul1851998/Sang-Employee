import { Backdrop } from '@mui/material'
import React from 'react'
import { Blocks , Hourglass } from 'react-loader-spinner'

export default function Loader({open,handleClose}) {
  return (
    <Backdrop
    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={open}
    onClick={handleClose}
  >
    <Hourglass
        visible={true}
        height="80"
        width="80"
        ariaLabel="hourglass-loading"
        wrapperStyle={{}}
        wrapperClass=""
        colors={['#8c99e0', '#8c99e0']}
    />
  </Backdrop>
  )
}