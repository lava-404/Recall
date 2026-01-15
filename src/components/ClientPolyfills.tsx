'use client'

import { useEffect } from 'react'

function ClientPolyfills() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.Buffer = window.Buffer || require('buffer').Buffer
    }
  }, [])

  return null
}

export default ClientPolyfills;
