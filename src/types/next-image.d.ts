import type { StaticImageData } from 'next/image'
import type { JSX } from 'react'

declare module 'next/image' {
  export default function Image(props: {
    src: string | StaticImageData
    alt: string
    width?: number
    height?: number
    fill?: boolean
    style?: React.CSSProperties
    className?: string
    priority?: boolean
    sizes?: string
  }): JSX.Element
} 