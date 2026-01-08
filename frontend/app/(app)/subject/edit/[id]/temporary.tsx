"use client";

import { useParams } from 'next/navigation'

export default function Page() {
  const params = useParams();

  return (
    <div>
      Toto je predmet s id: {params.id}
    </div>
  )
}

