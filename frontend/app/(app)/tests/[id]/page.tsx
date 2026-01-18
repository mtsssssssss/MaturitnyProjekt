"use client";

import { useParams } from 'next/navigation'

const Page = () => {
  const params = useParams();

  return (
    <div>
      Toto je test s id: {params.id}
    </div>
  )
}

export default Page
